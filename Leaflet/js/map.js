var map = L.map('map', {
    maxZoom: 20,
    minZoom: 7,
    center: [51.507222, -0.1275],
    maxBounds: [[49, -6.5],[61, 2.3]],
    zoom: 10
});

function setupLayer() {
    map.eachLayer(function(layer) { layer.remove(); });

    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    if(!key) {
        message.style.color = 'red';
        message.textContent = 'To view the map, please enter a valid api key.';
        return;
    }
    message.style.color = 'initial';
    message.textContent = 'To view the map, please enter a valid api key.';

    var url = 'https://osdatahubapi.os.uk/omse/wmts';
    var parameters = {
        key: key,
        tileMatrixSet: encodeURI('EPSG:3857'),
        version: '1.0.0',
        style: 'default',
        layer: encodeURI('Road 3857'),
        service: 'WMTS',
        request: 'GetTile',
        tileCol: '{x}',
        tileRow: '{y}',
        tileMatrix: '{z}',
    };
    let parameterString = Object.keys(parameters)
        .map(function(key) { return key + '=' + parameters[key]; })
        .join('&');
    var layer =  new L.TileLayer(
        url + '?' + parameterString,
        {
            attribution: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
            maxZoom: 20
        }
    );
    layer.on('tileerror', function(event) {
        message.style.color = 'red';
        message.textContent = 'Got an error loading tiles! Check your network connection, or try another API key.';
    });
    map.addLayer(layer);
}
