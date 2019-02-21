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
    var instructions = document.getElementById('instructions');
    
    if(!key) {
        message.classList.add("warning");
        message.textContent = 'To view the map, please enter a valid API key.';
        instructions.classList.remove("hidden");
        return;
    }
    message.classList.remove("warning");
    message.textContent = 'To view the map, please enter a valid API key.';
    instructions.classList.add("hidden");

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
        message.classList.add("warning");
        message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Maps API';
        instructions.classList.remove("hidden");
    });
    map.addLayer(layer);
}
