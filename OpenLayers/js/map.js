var map = new ol.Map({
    target: 'map',
    layers: [],
    view: new ol.View({
        center: [-121099, 7161610],
        zoom: 10,
        maxZoom: 20,
        minZoom: 7
    })
});
map.getControls().forEach(control => {
    if(control instanceof ol.control.Attribution) {
        control.setCollapsed(false);
    }
});

function setupLayer() {
    map.getLayers().clear();

    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    if(!key) {
        message.style.color = 'red';
        message.textContent = 'To view the map, please enter a valid api key.';
        return;
    }
    message.style.color = 'initial';
    message.textContent = 'To view the map, please enter a valid api key.';

    var url = 'https://osdatahubapi.os.uk/omse/wmts?request=GetCapabilities&key=' + key;
    fetch(url)
        .then(response => response.text())
        .then(text => {
            var parser = new ol.format.WMTSCapabilities();
            var result = parser.read(text);
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'Road_3857'
            });
            options.attributions = '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>';

            var source = new ol.source.WMTS(options);
            var layer = new ol.layer.Tile({ source: source });

            source.on('tileloaderror', function(event) {
                message.style.color = 'red';
                message.textContent = 'Got an error loading tiles! Check your network connection, or try another API key.';
            });

            map.addLayer(layer);
        })
        .catch(error => {
            message.style.color = 'red';
            message.textContent = 'Got an error from GetCapabilities! Check your network connection, or try another API key.';
        });
}
