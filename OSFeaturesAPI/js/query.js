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
    results.innerHTML = '';
    if(!key) {
        message.style.color = 'red';
        message.textContent = 'To run the query, please enter a valid api key.';
        search.disabled = false;
        more.disabled = true;
        return;
    }
    message.style.color = 'initial';
    message.textContent = 'To run the query, please enter a valid api key.';

    var parameters = {
        key: key,
        request: 'GetFeature',
        service: 'WFS',
        typeName: 'FunctionalSite',
        filter: '<Filter><PropertyIsEqualTo><PropertyName>SiteFunction</PropertyName><Literal>Airport</Literal></PropertyIsEqualTo></Filter>',
        startIndex: startIndex,
        count: count,
        outputFormat: 'GEOJSON'
    };
    var encodedParameters = Object.keys(parameters)
        .map(paramName => paramName + '=' + encodeURI(parameters[paramName]))
        .join('&');
    var url = 'https://osdatahubapi.os.uk/omse/wfs?' + encodedParameters;

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
                node = document.createElement('span');
                node.innerText = 'Geometry:';
                results.appendChild(node);
                node = document.createElement('pre');
                node.innerText = JSON.stringify(feature.geometry);
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
            message.style.color = 'red';
            message.textContent = 'Got an error when running the query! Check your network connection, or try another API key.';
        });
}
