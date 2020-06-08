require(
    [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/VectorTileLayer",
        "esri/geometry/Point",
        "esri/geometry/SpatialReference",
        "esri/config",
        "dojo/domReady!"
    ],
    function(Map, MapView, VectorTileLayer, Point, SpatialReference, esriConfig) {
        
        var vectorLayerUrl = "https://api.os.uk/maps/vector/v1/vts";
        var key;

        // ArcGIS JS reads all required information directly from the main service URL
        esriConfig.request.interceptors.push({
            urls: vectorLayerUrl,
            before: function(params) {
                if(!params.requestOptions.query) {
                    params.requestOptions.query = {};
                }
                if(params.url.indexOf("key=") === -1) {
                    params.requestOptions.query.key = key;
                }
            }
        });

        var map = new Map();
        
        // Setting up the map view with default center, spatial reference, scale and zoom constraints
        new MapView({
            map: map,
            container: "map",
            center: new Point({
                x: 425168,
                y: 563779,
                spatialReference: new SpatialReference({wkid: 27700})
            }),
            scale: 250000,
            constraints: {
                minScale: 390,
                maxScale: 1600000
            }
        });
        
        window.setupLayer = function() {
            map.layers.removeAll();

            // This sets up the API key input at the start
            key = document.getElementById('keyInput').value;
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
            
            // This sets up the layer for the map
            var tileLayer = new VectorTileLayer({
                url: vectorLayerUrl,
                copyright: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
            });

            tileLayer.when(success => {}, error => {
                message.classList.add("warning");
                message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
                instructions.classList.remove("hidden");
            });

            map.layers.add(tileLayer);
        };
    }
);
