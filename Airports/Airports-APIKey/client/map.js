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
const messageText = ' Check your network connection, or try restarting the server with another API key.';

//
// Get the WMTS capabilities doc from the server, so that we can set up the mapping layer
//
var select;
var url = '/proxy/OSMapsAPI/wmts/v1?request=GetCapabilities&service=WMTS';
fetch(url)
    .then(response => response.text())
    .then(text => {
        var parser = new ol.format.WMTSCapabilities();
        var result = parser.read(text);
        var options = ol.source.WMTS.optionsFromCapabilities(result, {
            layer: 'Light_27700'
        });

        var tileSource = new ol.source.WMTS({
            attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
            ...options
        });
        var tileLayer = new ol.layer.Tile({ source: tileSource });

        tileSource.on('tileloaderror', function(event) {
            message.classList.add('warning');
            message.textContent = 'Could not load a map tile. You may be attempting to access Premium data with an API key that only has access to OpenData.' + messageText;
        });

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:27700'
            }),
            url: getURLForExtent,
            strategy: ol.loadingstrategy.bbox
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        select = new ol.interaction.Select();
        select.on('select', featureSelected);

        var map = new ol.Map({
            target: 'map',
            layers: [tileLayer, vectorLayer],
            view: new ol.View({
                projection: 'EPSG:27700',
                center: [512217, 221078],
                zoom: 5,
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

//
// This function returns a URL that does a WFS feature query for the given extent. We filter the results to
// look up Airports from the Zoomstack collection.
//
function getURLForExtent(extent) {
    const wfsParameters = {
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeNames: 'Zoomstack_Airports',
        outputFormat: 'GEOJSON',
        srsName: 'urn:ogc:def:crs:EPSG::27700',
        filter:
`<Filter xmlns="http://www.opengis.net/fes/2.0" xmlns:gml="http://www.opengis.net/gml/3.2">
    <BBOX>
        <ValueReference>Shape</ValueReference>
        <gml:Envelope>
            <gml:lowerCorner>${extent[1]} ${extent[0]}</gml:lowerCorner>
            <gml:upperCorner>${extent[3]} ${extent[2]}</gml:upperCorner>
        </gml:Envelope>
    </BBOX>
</Filter>`
    };
    const urlParameters = Object.keys(wfsParameters)
        .map(param => param + '=' + encodeURI(wfsParameters[param]))
        .join('&');

    return '/proxy/OSFeaturesAPI/wfs/v1?' + urlParameters;
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
