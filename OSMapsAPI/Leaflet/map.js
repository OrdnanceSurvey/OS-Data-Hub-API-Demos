//
// Setup the EPSG:27700 (British National Grid) projection
//
var crs = new L.Proj.CRS(
    'EPSG:27700',
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs",
    {
        transformation: new L.Transformation(1, 238375, -1, 1376256),
        resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
    });

var map;
function setupLayer() {
    if(map) {
        map.remove();
    }

    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    var instructions = document.getElementById('instructions');
    var style = document.getElementById('style').value;

    if(!key) {
        message.classList.add("warning");
        message.textContent = 'To view the map, please enter a valid API key.';
        instructions.classList.remove("hidden");
        return;
    }
    message.classList.remove("warning");
    message.textContent = 'To view the map, please enter a valid API key.';
    instructions.classList.add("hidden");

    var tileMatrix = 'EPSG:3857';
    var mapOptions = {
        maxZoom: 20,
        minZoom: 7,
        center: [51.507222, -0.1275],
        maxBounds: [[49, -6.5],[61, 2.3]],
        zoom: 10
    };
    if(style.indexOf('27700') !== -1) {
        tileMatrix = 'EPSG:27700';
        mapOptions.crs = crs;
        mapOptions.maxZoom = 13;
        mapOptions.minZoom = 0;
        mapOptions.zoom = 4;
    }

    var url = 'https://osdatahubapi.os.uk/omse/wmts';
    var parameters = {
        key: key,
        tileMatrixSet: encodeURI(tileMatrix),
        version: '1.0.0',
        style: 'default',
        layer: encodeURI(style),
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
    mapOptions.layers = layer;
    map = L.map('map', mapOptions);
}
