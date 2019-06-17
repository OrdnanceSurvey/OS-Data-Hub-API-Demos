const express = require('express');
const path = require('path');
const request = require('request');

// Read the application API key from the command line.
const key = process.argv[2];
if(!key) {
    throw Error('Please provide an API key on the command line.\nUsage: server.js <API key>');
}
console.log('Using API key: ' + key);

// Setup some regular expressions that we need in the rest of the code.
const keyExpression = new RegExp('key=' + key, 'g');
const osDataHubAPIExpression = /https:\/\/osdatahubapi\.os\.uk/g;

// Setup an express router. This router acts as a proxy for OS Data Hub API calls. It's main role is to add the
// API key on to each request.
const proxyRouter = express.Router();
proxyRouter.get('/\*', (req, res) => {
    // Add the API key into the request URL, and prefix the whole thing with the OS Data Hub API endpoint.
    let separator = '?';
    if(req.url.indexOf('?') !== -1) {
        separator = '&';
    }
    const url = 'https://osdatahubapi.os.uk' + req.url + separator + 'key=' + key;

    // We need to intercept and re-write all the requests, as we don't want the WMTS capabilities document
    // or WFS replies to reveal the API key to the client, and we need to re-route requests back through this proxy.
    request({ url, encoding: null }, (error, response, buffer) => {
        const contentType = response.headers['content-type'];
        if(contentType) {
            res.set('Content-Type', contentType);
        }
        if(contentType !== 'image/png') {
            let body = buffer.toString();
            body = body.replace(keyExpression, '');
            body = body.replace(osDataHubAPIExpression, 'http://' + req.headers.host + '/proxy');
            res.send(body);
        } else {
            res.send(buffer);
        }
    });
});

// Setup an express server.
// This server serves the client files to the browser, and routes all '/proxy' requests onto the proxy router.
const app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.use('/proxy', proxyRouter);

app.listen(8080, () => console.log("Listening on port 8080. Please open http://localhost:8080 in a web browser."));
