const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

// Read the application API key and secret from the command line.
const key = process.argv[2];
const secret = process.argv[3];
if(!key || !secret) {
    throw Error('Please provide an API key and secret on the command line.\nUsage: server.js <API key> <API Secret>');
}
console.log('Using API key: ' + key);

// Setup an express server.
// This server serves the client files to the browser, and provides an endpoint to get an access token.
const app = express();
app.use(express.static(path.join(__dirname, 'client')));

app.get('/token', function(req, res) {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const authString = Buffer.from(key + ":" + secret).toString('base64');
    fetch('https://api.os.uk/oauth2/token/v1', {
        method: 'POST',
        body: params,
        headers: {
            Authorization: 'Basic ' + authString
        }
    })
        .then(res => res.json())
        .then(json => {
            res.set('Content-Type', 'application/json');
            res.send(json);
        })
        .catch(() => {
            res.status(500).send('Failed to get access token, check the API key and secret');
        });
});

app.listen(8080, () => console.log("Listening on port 8080. Please open http://localhost:8080 in a web browser."));
