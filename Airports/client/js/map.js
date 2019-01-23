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
const messageText = ' Check your network connection, or try restarting the server with another API key.';

//
// Get the WMTS capabilities doc from the server, so that we can set up the mapping layer
//
var url = '/proxy/omse/wmts?request=GetCapabilities';
fetch(url)
    .then(response => response.text(), error => {})
    .then(text => {
        var parser = new ol.format.WMTSCapabilities();
        var result = parser.read(text);
        var options = ol.source.WMTS.optionsFromCapabilities(result, {
            layer: 'Road_27700'
        });

        var tileSource = new ol.source.WMTS({
            attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
            ...options
        });
        var tileLayer = new ol.layer.Tile({ source: tileSource });

        tileSource.on('tileloaderror', function(event) {
            message.style.color = 'red';
            message.textContent = 'Got an error loading tiles!' + messageText;
        });

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:27700'
            }),
            url: getURLForExtent,
            strategy: ol.loadingstrategy.bbox
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(212,0,88,1)',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(212,0,88,0.2)'
                })
            })
        });

        var select = new ol.interaction.Select();
        select.on('select', featureSelected);

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
        message.style.color = 'red';
        message.textContent = 'Got an error setting up the map!' + messageText;
        console.log(error);
    });

//
// This function returns a URL that does a WFS feature query for the given extent. We filter the results to
// look up Airports from the FunctionalSite collection.
//
function getURLForExtent(extent) {
    const wfsParameters = {
        service: 'WFS',
        request: 'GetFeature',
        typeNames: 'FunctionalSite',
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
    }
    const urlParameters = Object.keys(wfsParameters)
        .map(param => param + '=' + encodeURI(wfsParameters[param]))
        .join('&');

    return '/proxy/omse/wfs?' + urlParameters;
}

//
// When the user clicks on a feature on the map, we display information about the selected feature in a table
//
function featureSelected(event) {
    if(event.selected.length === 0) {
        details.innerText = '';
    } else {
        const feature = event.selected[0];
        let table = '<table><tr><th>Property</th><th>Value</th></ht></tr>';
        feature.getKeys().forEach(key => {
            const value = feature.get(key);
            if(typeof value === 'string') {
                table += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
            }
        });
        table += '</table>';
        details.innerHTML = table;
    }
}
