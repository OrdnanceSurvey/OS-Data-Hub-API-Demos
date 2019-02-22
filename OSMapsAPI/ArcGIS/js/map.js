require(
    [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/WMTSLayer",
        "esri/geometry/Point",
        "esri/geometry/SpatialReference",
        "dojo/domReady!"
    ],
    function(Map, MapView, WMTSLayer, Point, SpatialReference) {
        var map = new Map();

        var view = new MapView({
            map: map,
            container: "map",
            center: new Point({
                x: 425168,
                y: 563779,
                spatialReference: new SpatialReference({wkid: 27700})
            }),
            scale: 50000,
            constraints: {
                minScale: 390,
                maxScale: 1600000
            }
        });

        window.setupLayer = function() {
            map.layers.removeAll();

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

            var wmtsLayer = new WMTSLayer({
                url: 'https://osdatahubapi.os.uk/omse/wmts',
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

            map.layers.add(wmtsLayer);
        };
    }
);
