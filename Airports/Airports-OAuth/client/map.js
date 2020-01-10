
// The URL for the OS Data Hub APIs
const dataHubApi = 'https://osdatahubapi.os.uk/';

//
// Setup the EPSG:27700 (British National Grid) projection
//
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var bng = ol.proj.get('EPSG:27700');
bng.setExtent([-238375.0,0,700000,1300000]);

//
// Find the elements we use to display messages and feature details to the user
//
var message = document.getElementById('message');
var details = document.getElementById('details');
var attributes = document.getElementById('attributes');
const messageText = ' Check your network connection, or try restarting the server with another API key and secret.';

// Setup a select interaction. This allows users to click on features and see the feature attributes
const select = new ol.interaction.Select();
select.on('select', featureSelected);

//
// Get an access token for the OS Data Hub APIs, and keep the token fresh
//
let currentToken;
function getToken() {
    return fetch('/token')
        .then(response => response.json())
        .then(result => {
            if(result.access_token) {
                // Store this token
                currentToken = result.access_token;

                // Get a new token 30 seconds before this one expires
                const timeoutMS = (result.expires_in - 30) * 1000;
                setTimeout(getToken, timeoutMS);
            } else {
                // We failed to get the token
                return Promise.reject();
            }
        })
        .catch(error => {
            message.classList.add('warning');
            message.textContent = 'Got an error loading access token!' + messageText;
            return Promise.reject();
        });
}

getToken().then(() => {
    //
    // Get the WMTS capabilities doc from the server, so that we can set up the mapping layer
    //
    var url = dataHubApi + 'OSMapsAPI/wmts/v1?request=GetCapabilities&service=WMTS';
    fetch(url, {
        headers: {
            Authorization: 'Bearer ' + currentToken
        }
    })
        .then(response => response.text())
        .then(text => {
            var parser = new ol.format.WMTSCapabilities();
            var result = parser.read(text);
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'Light_27700'
            });

            var tileSource = new ol.source.WMTS({
                attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
                tileLoadFunction: (tile, src) => {
                    fetch(src, {
                        headers: {
                            Authorization: 'Bearer ' + currentToken
                        }
                    })
                        .then(response => response.blob())
                        .then(blob => {
                            // We have loaded the image data from the WMTS service. We convert it into a base64 image
                            // that we can set onto the OpenLayers tile.
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                var data = 'data:image/png;base64,' + btoa(reader.result);
                                tile.getImage().src = data;
                            };
                            reader.readAsBinaryString(blob);
                        })
                        .catch(error => {
                            message.classList.add('warning');
                            message.textContent = 'Got an error loading tiles!' + messageText;
                        });
                },
                ...options
            });
            var tileLayer = new ol.layer.Tile({ source: tileSource });

            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON({
                    dataProjection: 'EPSG:27700'
                }),
                strategy: ol.loadingstrategy.bbox,
                loader: (extent) => {
                    fetch(getURLForExtent(extent), {
                        headers: {
                            Authorization: 'Bearer ' + currentToken
                        }
                    })
                        .then(response => response.text())
                        .then(geojson => {
                            // We have loaded GeoJSON features from the WFS service. We convert them into OpenLayers
                            // features and set them onto the layer source.
                            const features = vectorSource.getFormat().readFeatures(geojson);
                            vectorSource.addFeatures(features);
                        })
                        .catch(error => {
                            message.classList.add('warning');
                            message.textContent = 'Got an error loading features!' + messageText;
                        });
                }
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            var map = new ol.Map({
                target: 'map',
                layers: [tileLayer, vectorLayer],
                view: new ol.View({
                    projection: 'EPSG:27700',
                    center: [331810, 430974],
                    zoom: 10,
                    minResolution: 0.109375
                })
            });
            map.getControls().forEach(control => {
                if(control instanceof ol.control.Attribution) {
                    control.setCollapsed(false);
                }
            });
            map.addInteraction(select);
        })
        .catch(error => {
            message.classList.add('warning');
            message.textContent = 'Got an error setting up the map!' + messageText;
            console.log(error);
        });
});

//
// This function returns a URL that does a WFS feature query for the given extent. We filter the results to
// look up Airports from the FunctionalSite collection.
//
function getURLForExtent(extent) {
    const wfsParameters = {
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeNames: 'Sites_FunctionalSite',
        outputFormat: 'GEOJSON',
        srsName: 'urn:ogc:def:crs:EPSG::27700',
        filter:
`<Filter xmlns="http://www.opengis.net/fes/2.0" xmlns:gml="http://www.opengis.net/gml/3.2">
  <And>
    <BBOX>
      <ValueReference>Shape</ValueReference>
      <gml:Envelope>
        <gml:lowerCorner>${extent[1]} ${extent[0]}</gml:lowerCorner>
        <gml:upperCorner>${extent[3]} ${extent[2]}</gml:upperCorner>
      </gml:Envelope>
    </BBOX>
    <PropertyIsEqualTo>
      <PropertyName>SiteFunction</PropertyName>
      <Literal>Airport</Literal>
    </PropertyIsEqualTo>
  </And>
</Filter>`
    };
    const urlParameters = Object.keys(wfsParameters)
        .map(param => param + '=' + encodeURI(wfsParameters[param]))
        .join('&');

    return dataHubApi + 'OSFeaturesAPI/wfs/v1?' + urlParameters;
}

//
// When the user clicks on a feature on the map, we display information about the selected feature in a table
//
function featureSelected(event) {
    if(event.selected.length === 0) {
        details.classList.add('hidden');
        attributes.innerText = '';
    } else {
        details.classList.remove('hidden');
        const feature = event.selected[0];
        let table = '<table><tr><th>Property</th><th>Value</th></ht></tr>';
        feature.getKeys().forEach(key => {
            const value = feature.get(key);
            if(typeof value === 'string') {
                table += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
            }
        });
        table += '</table>';
        attributes.innerHTML = table;
    }
}

//
// When the user clicks close we need to clear the current selection
//
function closeModal() {
    select.getFeatures().clear();
    details.classList.add('hidden');
}
