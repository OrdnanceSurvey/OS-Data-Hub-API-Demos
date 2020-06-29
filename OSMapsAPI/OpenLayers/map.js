//
// Setup the EPSG:27700 (British National Grid) projection
//
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var bng = ol.proj.get('EPSG:27700');
bng.setExtent([-238375.0,0,700000,1300000]);

var map;
function setupLayer() {
    if(map) {
        map.setTarget(null);
    }

    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    var instructions = document.getElementById('instructions');
    var style = document.getElementById('style');

    if(!key) {
        message.classList.add("warning");
        message.textContent = 'To view the map, please enter a valid API key.';
        instructions.classList.remove("hidden");
        return;
    }
    message.classList.remove("warning");
    message.textContent = 'To view the map, please enter a valid API key.';
    instructions.classList.add("hidden");
    
    var url = 'https://api.os.uk/maps/raster/v1/wmts?service=wmts&request=GetCapabilities&key=' + key;
    fetch(url)
        .then(response => response.text())
        .then(text => {
            // OpenLayers allows us to get the service information directly from the GetCapabilites document instead of hard coding it.
            var parser = new ol.format.WMTSCapabilities();
            var result = parser.read(text);
            
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: style.value
            });
            if(!options) {
                message.classList.add("warning");
                message.textContent = 'Failed to find the selected mapping style! Try selecting an alternative mapping style.';
                instructions.classList.remove("hidden");
                return;
            }
            // Set correct attribution for the data layer.
            options.attributions = '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>';

            var source = new ol.source.WMTS(options);
            var layer = new ol.layer.Tile({ source: source });
            
            // Error handling should the tiles fail to load. This can be extended to catch specific errors.
            source.on('tileloaderror', function(event) {
                message.classList.add("warning");
                message.textContent = 'Could not load a map tile. You may be attempting to access Premium data with an API key that only has access to OS OpenData.';
                instructions.classList.remove("hidden");
            });
            
            // Set up the view options, center of map, zoom level and projection information
            var viewOptions = {
                projection: options.projection,
                center: [-121099, 7161610],
                resolutions: options.tileGrid.getResolutions(),
                zoom: 8
            };
            
            // If we are using a layer in British National Grid (EPSG:27700), then tranform the center point from
            // EPSG:3857 into BNG, and adjust the zoom level.
            if(options.projection === bng) {
                var point = new ol.geom.Point(viewOptions.center);
                point.transform('EPSG:3857', bng);
                viewOptions.center = point.getCoordinates();
                viewOptions.zoom = 3;
            }
            
            // Create the map object and connect it to the 'map' element in the html
            map = new ol.Map({
                target: 'map',
                layers: [layer],
                view: new ol.View(viewOptions)
            });
            
            // Expand the attribution control, so that the the copyright message is visible
            map.getControls().forEach(control => {
                if(control instanceof ol.control.Attribution) {
                    control.setCollapsed(false);
                }
            });
        })
        .catch(error => {
            message.classList.add("warning");
            message.textContent = 'Got an error from GetCapabilities! Check your network connection, or try another API key.';
            instructions.classList.remove("hidden");
        });
}
