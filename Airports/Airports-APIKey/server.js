const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');

// Read the application API key from the command line.
const key = process.argv[2];
if(!key) {
    throw Error('Please provide an API key on the command line.\nUsage: server.js <API key>');
}
console.log('Using API key: ' + key);

// Setup the regular expression that we use to replace the server URL in the HTTP responses.
const osDataHubAPIExpression = /https:\/\/api\.os\.uk/g;

// Setup an express server.
// This server serves the client files to the browser, and routes all '/proxy' requests onto the proxy router.
const app = express();
app.use(express.static(path.join(__dirname, 'client')));

// Set up a proxy for the OS Data Hub API calls. Its main role is to add the API key header on to each request.
app.use('/proxy', proxy('https://api.os.uk', {
    proxyReqOptDecorator: function(proxyReqOpts) {
        proxyReqOpts.headers.key = key;
        return proxyReqOpts;
    },
    // We need to intercept and re-write text responses, as we need to re-route urls back through this proxy.
    userResDecorator: function (proxyRes, proxyResData, userReq) {
        const contentType = proxyRes.headers['content-type'];
        if(contentType !== 'image/png') {
            let body = proxyResData.toString('utf8');
            body = body.replace(osDataHubAPIExpression, 'http://' + userReq.headers.host + '/proxy');
            return body;
        } else {
            return proxyResData;
        }
    }
}));

app.listen(8080, () => console.log("Listening on port 8080. Please open http://localhost:8080 in a web browser."));
