var map;

function setupLayer() {
    if(map) {
        map.remove();
        map = null;
    }
    
    // Setting up the initial API key input
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

    // This sets up the actual VTS layer
    // Center coordinates are defined in EPSG:3857 lon/lat and we are asking for srs=3857 in the "transformRequest"
    var serviceUrl = "https://api.os.uk/maps/vector/v1/vts";
    map = new mapboxgl.Map({
        container: 'map',
        style: serviceUrl + '/resources/styles?key=' + key,
        center: [-1.608411, 54.968004],
        zoom: 9,
        maxZoom: 15,
        transformRequest: url => {
            url += '&srs=3857';
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
