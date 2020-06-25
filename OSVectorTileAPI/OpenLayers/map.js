//
// Setup the EPSG:27700 (British National Grid) projection
//
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var bng = ol.proj.get('EPSG:27700');
bng.setExtent([-238375.0,0,700000,1300000]);

var map;
var url = 'https://api.os.uk/maps/vector/v1/vts';

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
    
    // This example requires the style URL (The default one in this case). From the returned style.JSON it will
    // derive the URLS needed for the Capabilities URL, Service URL, Sprite.JSON URL/Sprite.PNG URL 
    var styleUrl = fetch(url + '/resources/styles?key=' + key).then(response => response.json());

    Promise.resolve(styleUrl)
        .then(result => {
            var styleJson = result;

            // Read URLS for sprites.json and sprites.png from styles.json
            var spritesJsonUrl = fetch(styleJson.sprite.replace("?key=", ".json?key=")).then(response => response.json());
            var spritesPngUrl = styleJson.sprite.replace("?key=", ".png?key=");

            // Fetch the service JSON
            var serviceUrl = fetch(styleJson.sources.esri.url).then(response => response.json());

            Promise.all([serviceUrl, spritesJsonUrl]).then(results => {

                var serviceJson = results[0];
                var spritesJson = results[1];

                // Read the tile grid dimensions from the service.json
                var extent = [serviceJson.fullExtent.xmin, serviceJson.fullExtent.ymin, serviceJson.fullExtent.xmax, serviceJson.fullExtent.ymax];
                var origin = [serviceJson.tileInfo.origin.x, serviceJson.tileInfo.origin.y];
                var resolutions = serviceJson.tileInfo.lods.map(l => l.resolution).slice(0, 16);
                var tileSize = serviceJson.tileInfo.rows;
                var tiles = serviceJson.tiles[0];
                var wkid = serviceJson.tileInfo.spatialReference.latestWkid;
                
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
                styleJson.layers.forEach(layer => {
                    if(layer.paint && layer.paint['icon-color']) {
                        layer.paint['icon-color'] = layer.paint['icon-color'].replace(',0)', ',1)');
                    }
                });
                
                // Setup the styling for the vector tile layer.
                // We use the default style fetched in the promise here, though "style" can be any JSON VTS style
                olms.stylefunction(layer, styleJson, 'esri', resolutions, spritesJson, spritesPngUrl);

                source.on('tileloaderror', function(event) {
                    message.classList.add("warning");
                    message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
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
                        zoom: Math.floor(resolutions.length / 2)
                    })
                });
                // Expand the attribution control, so that the the copyright message is visible
                map.getControls().forEach(control => {
                    if(control instanceof ol.control.Attribution) {
                        control.setCollapsed(false);
                    }
                });
            })

        })
        .catch(error => {
            message.classList.add("warning");
            message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
            instructions.classList.remove("hidden");
        });
}
