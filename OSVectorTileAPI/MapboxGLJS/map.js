var map;

function setupLayer() {
    if(map) {
        map.remove();
        map = null;
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

    var serviceUrl = "https://osdatahubapi.os.uk/OSVectorTileAPI/vts/v1";
    map = new mapboxgl.Map({
        container: 'map',
        style: serviceUrl + '/resources/styles',
        center: [-1.608411, 54.968004],
        zoom: 9,
        maxZoom: 15,
        transformRequest: url => {
            url += '?key=' + key + '&srs=3857';
            return {
                url: url
            }
        }
    });

    map.addControl(new mapboxgl.AttributionControl({
        customAttribution: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
    }));
    
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    map.on('error', error => {
        console.log(error);
        message.classList.add("warning");
        message.textContent = 'Could not connect to the API. Ensure you are entering a project API key for a project that contains the OS Vector Tile API';
        instructions.classList.remove("hidden");
    });
}
