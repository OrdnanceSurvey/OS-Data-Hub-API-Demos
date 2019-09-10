//
// Setup the EPSG:27700 (British National Grid) projection
//
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var bng = ol.proj.get('EPSG:27700');
bng.setExtent([-238375.0,0,700000,1300000]);

var map;
var serviceUrl = "https://osdatahubapi.os.uk/OSVectorTileAPI/vts/v1";

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

    var promise1 = fetch(serviceUrl + '?key=' + key).then(response => response.json());
    var promise2 = fetch(serviceUrl + '/resources/styles?key=' + key).then(response => response.json());
    var promise3 = fetch(serviceUrl + '/resources/sprites/sprite.json?key=' + key).then(response => response.json());
    var spriteImageUrl = serviceUrl + '/resources/sprites/sprite.png?key=' + key

    Promise.all([promise1, promise2, promise3])
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

            var options = {
                format: new ol.format.MVT(),
                url: tiles + '?key=' + key,
                attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
                projection: 'EPSG:' + wkid,
                tileGrid: new ol.tilegrid.TileGrid({
                    extent,
                    origin,
                    resolutions,
                    tileSize
                })
            }
            var source = new ol.source.VectorTile(options);
            var layer = new ol.layer.VectorTile({ source: source });

            // ol-mapbox-style doesn't like the 0 opacity for the icon colours, so we replace them here
            style.layers.forEach(layer => {
                if(layer.paint && layer.paint['icon-color']) {
                    layer.paint['icon-color'] = layer.paint['icon-color'].replace(',0)', ',1)');
                }
            });

            var styleFn = olms.stylefunction(layer, style, 'esri', resolutions, sprite, spriteImageUrl);

            source.on('tileloaderror', function(event) {
                message.classList.add("warning");
                message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
            });

            var center = [-121099, 7161610];
            if(wkid === 27700) {
                var point = new ol.geom.Point(center);
                point.transform('EPSG:3857', 'EPSG:27700');
                center = point.getCoordinates();
            }

            map = new ol.Map({
                target: 'map',
                layers: [layer],
                view: new ol.View({
                    projection: 'EPSG:' + wkid,
                    center: center,
                    zoom: Math.floor(resolutions.length / 2)
                })
            });
            map.getControls().forEach(control => {
                if(control instanceof ol.control.Attribution) {
                    control.setCollapsed(false);
                }
            });
        })
        .catch(error => {
            message.classList.add("warning");
            message.textContent = 'Got an error from the Vector Tile Service! Check your network connection, or try another API key.';
            instructions.classList.remove("hidden");
        });
}
