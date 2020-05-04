const express = require('express');
const path = require('path');
const request = require('request');

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
    request({
        method: 'POST',
        url: 'https://osdatahubapi.os.uk/oauth2/token/v1',
        auth: {
            username: key,
            password: secret
        },
        form: {
            grant_type: 'client_credentials'
        },
        encoding: null
    }, (error, response, buffer) => {
        if(error) {
            res.status(500).send('Failed to get access token, check the API key and secret');
        }

        // Pass the access token back to the caller
        const contentType = response.headers['content-type'];
        const statusCode = response.statusCode;
        res.set('Content-Type', contentType);
        res.status(statusCode);
        res.send(buffer);
    });
});

app.listen(8080, () => console.log("Listening on port 8080. Please open http://localhost:8080 in a web browser."));
