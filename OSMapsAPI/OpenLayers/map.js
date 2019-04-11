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

    var url = 'https://osdatahubapi.os.uk/omse/wmts?request=GetCapabilities&key=' + key;
    fetch(url)
        .then(response => response.text())
        .then(text => {
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
            options.attributions = '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>';

            var source = new ol.source.WMTS(options);
            var layer = new ol.layer.Tile({ source: source });

            source.on('tileloaderror', function(event) {
                message.classList.add("warning");
                message.textContent = 'Could not load a map tile. Ensure you are entering a project API key for a project that contains the OS Maps API';
            });

            var viewOptions = {
                projection: options.projection,
                center: [51.507222, -0.1275],
                resolutions: options.tileGrid.getResolutions(),
                zoom: 10
            }

            if(options.projection === bng) {
                var point = new ol.geom.Point(viewOptions.center);
                point.transform('EPSG:3857', bng);
                viewOptions.center = point.getCoordinates();
                viewOptions.zoom = 5;
            }

            map = new ol.Map({
                target: 'map',
                layers: [layer],
                view: new ol.View(viewOptions)
            });
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
