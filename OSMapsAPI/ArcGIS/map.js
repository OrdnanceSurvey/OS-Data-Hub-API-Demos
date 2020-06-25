require(
    [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/WMTSLayer",
        "esri/geometry/Point",
        "esri/geometry/SpatialReference",
        "esri/geometry/projection",
        "dojo/domReady!"
    ],
    function(Map, MapView, WMTSLayer, Point, SpatialReference, projection) {
        var promise = projection.load();

        window.setupLayer = function() {
            // This sets up the API key entry at the beginning
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

            // Defining the WMTS layer using the service URL to pull in the main settings
            var wmtsLayer = new WMTSLayer({
                url: 'https://api.os.uk/maps/raster/v1/wmts',
                activeLayer: {
                    id: style
                },
                customParameters: {
                    key: key
                },
                copyright: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
            });

            wmtsLayer.when(success => {}, error => {
                message.classList.add("warning");
                message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Maps API';
                instructions.classList.remove("hidden");
            });

            var map = new Map({
                layers: [wmtsLayer]
            });
            
            // Once the projection loads we define the center coordinates in EPSG:27700
            // Then set up the map view
            promise.then(() => {
                var center = new Point({
                    x: 425168,
                    y: 563779,
                    spatialReference: new SpatialReference({wkid: 27700})
                });
                if(style.indexOf('27700') === -1) {
                    center = projection.project(center, new SpatialReference({ wkid: 3857 }));
                }
                new MapView({
                    map: map,
                    container: "map",
                    center: center,
                    scale: 250000
                });
            });
        };
    }
);
