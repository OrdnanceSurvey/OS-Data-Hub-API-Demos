const BASE_URL = 'https://api.os.uk/search/links/v1/';

const MISSING_ID_MSG = 'To run this query, please enter an ID.';

window.displayDropdownMenu = function(id) {
    var dropdownMenu = document.getElementById(id);
    if (dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.remove('hidden');
    } else {
        dropdownMenu.classList.add('hidden');
    }
};

window.runByIdentifierQuery = function () {
    var byIdentifier = document.getElementById('byIdentifier').value;

    if(!byIdentifier) {
        displayErrorMessage(MISSING_ID_MSG);
        return;
    }

    var url = BASE_URL + 'identifiers/' + byIdentifier;
    runQuery(url);
};

window.runByFeatureTypeQuery = function () {
    var featureType = document.getElementById('feature').value;
    var featureTypeID = document.getElementById('featureTypeID').value;

    if(featureType === 'null') {
        displayErrorMessage('To run this query, please select a feature type.');
        return;
    }

    if(!featureTypeID) {
        displayErrorMessage(MISSING_ID_MSG);
        return;
    }

    var url = BASE_URL + 'featureTypes/' + encodeURI(featureType) + '/' + encodeURI(featureTypeID);
    runQuery(url);
};

window.runByIdentifierTypeQuery = function () {
    var identifierType = document.getElementById('identifier').value;
    var identifierTypeID = document.getElementById('identifierTypeID').value;

    if(identifierType === 'null') {
        displayErrorMessage('To run this query, please select a identifier type.');
        return;
    }

    if(!identifierTypeID) {
        displayErrorMessage(MISSING_ID_MSG);
        return;
    }

    var url = BASE_URL + 'identifierTypes/' + encodeURI(identifierType) + '/' + encodeURI(identifierTypeID);
    runQuery(url);
};

window.productVersionInformationQuery = function () {
    var correlationMethodID = document.getElementById('correlationMethod').value;

    if(correlationMethodID === 'null') {
        displayErrorMessage('To run this query, please select a correlation method.');
        return;
    }

    var url = BASE_URL + 'productVersionInfo/' + encodeURI(correlationMethodID);
    runQuery(url);
};

window.runExample = function (id, featureType) {
    document.getElementById('dropdownMenu').classList.add('hidden');

    var url = BASE_URL + 'featureTypes/' + featureType + '/' + id;
    document.getElementById('osExample').value = url;
    runQuery(url);
};

window.runAdanacExample = function (id, featureType) {
    document.getElementById('dropdownMenuAdanac').classList.add('hidden');

    var url = BASE_URL + 'featureTypes/' + featureType + '/' + id;
    document.getElementById('exampleAdanaDrive').value = url;
    runQuery(url);
};

function displayErrorMessage(messageText) {
    var message = document.getElementById('message');
    var results = document.getElementById('results');
    var instructions = document.getElementById('instructions');

    message.classList.add("warning");
    message.textContent = messageText;
    instructions.classList.remove("hidden");
    results.classList.add('hidden');
}

function runQuery(baseUrl) {
    //API Key input box
    var key = document.getElementById('keyInput').value;
    var message = document.getElementById('message');
    var results = document.getElementById('results');
    var instructions = document.getElementById('instructions');

    results.innerHTML = '';
    if(!key) {
        displayErrorMessage('To run the query, please enter a valid API key.');
        return;
    }

    message.classList.remove("warning");
    message.textContent = 'To run any of the queries, please enter a valid API key.';
    instructions.classList.add("hidden");
    results.classList.remove("hidden");

    var keyParam = 'key' + '=' + encodeURI(key);
    var url = baseUrl + '?' + keyParam;

    results.innerHTML = '<h1>Loading...</h1>';
    fetch(url)
        .then(response => {
            results.innerHTML = '';

            var divNode = document.createElement('div');
            divNode.classList.add('urlContainer');
            var url = response.url;
            divNode.innerHTML = '<span class="key">URL: </span> <span class="value">'+ url + '</span>';
            results.appendChild(divNode);

            var statusCode = response.status;
            var statusNode = document.createElement('div');
            statusNode.innerHTML = '<span class="key">Status: </span> <span class="value">'+ statusCode + '</span>';
            results.appendChild(statusNode);

            return response.json();
        })
        .then(json => {
            var node = document.createElement('pre');
            node.innerHTML = syntaxHighlight(JSON.stringify(json, undefined, 2));
            results.appendChild(node);
        })
        .catch(error => {
            message.classList.remove("warning");
            message.textContent = 'Got an error when running the query! Check your network connection, or try another API key.';
        });
}

function syntaxHighlight(json) {
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'value';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            }
        }
        return '<span class="' + cls + '">' + match + '</span>';
    })
}
