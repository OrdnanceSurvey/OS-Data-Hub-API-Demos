const express = require('express');
const path = require('path');
const request = require('request');

// Read the application API key from the command line.
const key = process.argv[2];
if(!key) {
    throw Error('Please provide an API key on the command line.\nUsage: server.js <API key>');
}
console.log('Using API key: ' + key);

// Setup the regular expression that we use to replace the server URL in the HTTP responses.
const osDataHubAPIExpression = /https:\/\/api\.os\.uk/g;

// Setup an express router. This router acts as a proxy for OS Data Hub API calls. It's main role is to add the
// API key header on to each request.
const proxyRouter = express.Router();
proxyRouter.get('/\*', (req, res) => {
    // Prefix the request URL with the OS Data Hub API endpoint.
    const url = 'https://api.os.uk' + req.url;

    // We need to intercept and re-write all the requests, as we need to re-route requests back through this proxy.
    request({
        url,
        encoding: null,
        headers: {
            key
        }
    }, (error, response, buffer) => {
        if(!response) {
            res.status(502).send('Failed to proxy URL: ' + req.url);
            return;
        }

        const contentType = response.headers['content-type'];
        const statusCode = response.statusCode;
        if(contentType) {
            res.set('Content-Type', contentType);
        }
        res.status(statusCode);
        if(contentType !== 'image/png') {
            let body = buffer.toString();
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
