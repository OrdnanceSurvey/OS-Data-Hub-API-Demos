require(["esri/Map", "esri/views/MapView", "esri/layers/WMTSLayer", "dojo/domReady!"], function(Map, MapView, WMTSLayer) {
    var map = new Map();

    var view = new MapView({
        map: map,
        container: "map",
        center: [51.507222, -0.1275],
        zoom: 10,
        constraints: {
            maxZoom: 20,
            minZoom: 7,
        }
    });

    window.setupLayer = function() {
        map.layers.removeAll();

        var key = document.getElementById('keyInput').value;
        var message = document.getElementById('message');
        if(!key) {
            message.style.color = 'red';
            message.textContent = 'To view the map, please enter a valid api key.';
            return;
        }
        message.style.color = 'initial';
        message.textContent = 'To view the map, please enter a valid api key.';

        var wmtsLayer = new WMTSLayer({
            url: 'https://osdatahubapi.os.uk/omse/wmts',
            customParameters: {
                key: key
            },
            copyright: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
        });

        wmtsLayer.when(success => {}, error => {
            message.style.color = 'red';
            message.textContent = 'Got an error loading tiles! Check your network connection, or try another API key.';
        });

        map.layers.add(wmtsLayer);
    }
});
