//
// Setup the EPSG:27700 (British National Grid) projection
//
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var bng = ol.proj.get('EPSG:27700');
bng.setExtent([-238375.0,0,700000,1300000]);

var map;
var serviceUrl = "https://api.os.uk/maps/vector/v1/vts";

function setupLayer() {
    if(map) {
        map.setTarget(null);
    }

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

    // This example requires the main Capabilities url, the style (our default one in this case), and due to the
    // style elements used in the the default style we also need the sprite file.
    // If you define your own style you may only need the main Capabilities url
    var capabilityPromise = fetch(serviceUrl + '?key=' + key).then(response => response.json());
    var stylePromise = fetch(serviceUrl + '/resources/styles?key=' + key).then(response => response.json());
    var spritePromise = fetch(serviceUrl + '/resources/sprites/sprite.json?key=' + key).then(response => response.json());
    var spriteImageUrl = serviceUrl + '/resources/sprites/sprite.png?key=' + key;

    Promise.all([capabilityPromise, stylePromise, spritePromise])
        .then(results => {
            var service = results[0];
            var style = results[1];
            var sprite = results[2];

            // Read the tile grid dimensions from the service meta-data
            var extent = [service.fullExtent.xmin, service.fullExtent.ymin, service.fullExtent.xmax, service.fullExtent.ymax];
            var origin = [service.tileInfo.origin.x, service.tileInfo.origin.y];
            var resolutions = service.tileInfo.lods.map(l => l.resolution).slice(0, 16);
            var tileSize = service.tileInfo.rows;
            var tiles = service.tiles[0];
            var wkid = service.tileInfo.spatialReference.latestWkid;

            // Set up the options required for the VTS source in OpenLayers
            var options = {
                format: new ol.format.MVT(),
                url: tiles,
                attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
                projection: 'EPSG:' + wkid,
                tileGrid: new ol.tilegrid.TileGrid({
                    extent,
                    origin,
                    resolutions,
                    tileSize
                })
            };
            var source = new ol.source.VectorTile(options);
            var layer = new ol.layer.VectorTile({ source: source });

            // ol-mapbox-style doesn't like the 0 opacity for the icon colours, so we replace them here
            style.layers.forEach(layer => {
                if(layer.paint && layer.paint['icon-color']) {
                    layer.paint['icon-color'] = layer.paint['icon-color'].replace(',0)', ',1)');
                }
                // Customise the road features, painting them red
                if (layer['source-layer'].startsWith('road')) {
                   layer.paint['line-color'] = '#FF0000';
                }
            });

            // Setup the styling for the vector tile layer.
            // We use the default style fetched in the promise here, though "style" can be any JSON VTS style
            olms.stylefunction(layer, style, 'esri', resolutions, sprite, spriteImageUrl);

            source.on('tileloaderror', function(event) {
                message.classList.add("warning");
                message.textContent = 'Could not load a map tile. You may be attempting to access Premium data with an API key that only has access to OS OpenData.';
                instructions.classList.remove("hidden");
            });

            // Set the default center of the map view
            var center = [-121099, 7161610];
            if(wkid === 27700) {
                var point = new ol.geom.Point(center);
                point.transform('EPSG:3857', 'EPSG:27700');
                center = point.getCoordinates();
            }

            // Create the map object and connect it to the 'map' element in the html
            map = new ol.Map({
                target: 'map',
                layers: [layer],
                view: new ol.View({
                    projection: 'EPSG:' + wkid,
                    center: center,
                    zoom: 7
                })
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
            message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
            instructions.classList.remove("hidden");
        });
}
