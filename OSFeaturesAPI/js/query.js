let startIndex = 0;
let count = 10;

window.query = function() {
    startIndex = 0;
    runQuery();
}
window.loadMore = function() {
    startIndex += count;
    runQuery();
}

function runQuery() {
    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    var results = document.getElementById('results');
    var search = document.getElementById('search');
    var more = document.getElementById('more');
    var instructions = document.getElementById('instructions');

    results.innerHTML = '';
    if(!key) {
        message.classList.add("warning");
        message.textContent = 'To run the query, please enter a valid API key.';
        instructions.classList.remove("hidden");
        search.disabled = false;
        more.disabled = true;
        return;
    }
    message.classList.remove("warning");
    message.textContent = 'To run the query, please enter a valid API key.';
    instructions.classList.add("hidden");

    var parameters = {
        key: key,
        request: 'GetFeature',
        service: 'WFS',
        version: '2.0.0',
        typeName: 'Sites_FunctionalSite',
        filter: '<Filter><PropertyIsEqualTo><PropertyName>SiteFunction</PropertyName><Literal>Airport</Literal></PropertyIsEqualTo></Filter>',
        startIndex: startIndex,
        count: count,
        outputFormat: 'GEOJSON'
    };
    var encodedParameters = Object.keys(parameters)
        .map(paramName => paramName + '=' + encodeURI(parameters[paramName]))
        .join('&');
    var url = 'https://osdatahubapi.os.uk/OSFeaturesAPI/wfs/v1?' + encodedParameters;

    search.disabled = true;
    more.disabled = true;
    results.innerHTML = '<h1>Loading...</h1>';
    fetch(url)
        .then(response => response.json())
        .then(json => {
            search.disabled = false;
            if(json.features.length === count) {
                // We got a full set of results, so we should enable the load more button
                more.disabled = false;
            }
            results.innerHTML = '';

            json.features.forEach(feature => {
                // Create a heading using the feature name
                var node = document.createElement('h1');
                node.innerText = feature.properties.DistinctiveName1;
                results.appendChild(node);

                // Print out the feature geometry
                node = document.createElement('label');
                node.setAttribute('for', feature.properties.OBJECTID);
                node.innerText = 'Geometry Type: ';
                results.appendChild(node);
                node = document.createElement('span');
                node.id = feature.properties.OBJECTID;
                node.innerText = feature.geometry.type;
                results.appendChild(node);

                // Create a table with all of the feature properties
                const table = document.createElement('table');
                results.appendChild(table);
                var row = document.createElement('tr');
                row.innerHTML = '<th>Property Name</th><th>Value</th>';
                table.appendChild(row);

                Object.keys(feature.properties).forEach(propertyName => {
                    var row = document.createElement('tr');
                    row.innerHTML = '<td>' + propertyName + '</td><td>' + feature.properties[propertyName] + '</td>';
                    table.appendChild(row);
                });
            });
        })
        .catch(error => {
            search.disabled = false;
            more.disabled = true;
            message.classList.remove("warning");
            message.textContent = 'Got an error when running the query! Check your network connection, or try another API key.';
        });
}
