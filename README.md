# OS Data Hub API Demos

This repo contains working examples of how to use some of the products provided by the [OS Data Hub](https://osdatahub.os.uk/).
The OS Data Hub is a service providing access to Ordnance Survey data as part of the [Open MasterMap Implementation Programme](https://www.ordnancesurvey.co.uk/business-and-government/products/open-mastermap.html).

*Please note that the OS Maps API provided by the OS Data Hub is separate from the [OS Maps API for Enterprise](https://developer.ordnancesurvey.co.uk/os-maps-api-enterprise).
For help with OS Maps API for Enterprise see the separate [API docs](https://apidocs.os.uk/docs/os-maps-overview) and [demos](https://github.com/OrdnanceSurvey/OS-Maps-API).*

## Software requirements

All of the examples work with current web browsers. Internet Explorer is not supported.

The airports examples also require [Node.JS](https://nodejs.org).

## Using the demos

Each of the demos needs an API key to access the OS Data Hub APIs.

Register for API keys using the [OS Data Hub](https://osdatahub.os.uk/):
- Sign up to the OS Data Hub, and create a project
- Add the OS Maps API, OS Features API, OS Vector Tile API and the OS Linked Identifiers API to your project
- Copy the API key from the project page

Note that some of the demos will allow you to zoom in to Premium data levels.
If your OS Data Hub account is on the OS OpenData plan then these Premium Data requests will fail.
To gain Premium data access, please refer to the [API Plans & Pricing page in the OS Data Hub](https://osdatahub.os.uk/plans).

### OS Features API, OS Maps API, OS Vector Tile API and OS Linked Identifiers API examples

These examples are relatively simple, and are a good place to start understanding how to integrate the OS Data Hub APIs into a web application.

These examples use plain HTML, CSS and JavaScript. You can run them by opening the index.html in each folder, or you can serve the examples using a web server, for example [live-server](https://www.npmjs.com/package/live-server). 

### Airports examples

The airports examples are a little more complex.
Each displays a map provided by the OS Maps API, and overlays the map with features loaded from the OS Features API.
We search for features that are airports within the current extent of the map, and draw the feature geometry on top of the map.
Each airport is clickable, allowing you to see the additional feature properties that were returned from the WFS query.

These examples demonstate two approaches for providing OS Data Hub API access to a web application, without sharing your API key with the browser. 

#### Airports-APIKey
The Airports API Key example uses a small server to serve the web application and to act as a proxy for the OS Data Hub APIs.
This proxy allows you to embed an API key into the server without exposing the API key to the end users of the application.
To run the sample, install [Node.JS](https://nodejs.org) and then run the following commands from the `Airports-APIKey` directory:

<pre>
npm install
npm start &lt;API key&gt;
</pre>

Note: A production application would need to add extra protection to the server, to ensure that the only people able
to make API calls through the proxy are legitimate users of your application. Failure to do so would allow malicious
users to make API requests with your API key, even though they do not have direct access to it.

#### Airports-OAuth
The Airports OAuth example uses a small server to serve the web application and to provide access to an access token for the OS Data Hub APIs.
This approach allows you to embed an API key and secret into the server without exposing them the end users of the application.
To run the sample, install [Node.JS](https://nodejs.org) and then run the following commands from the `Airports-OAuth` directory:

<pre>
npm install
npm start &lt;API key&gt; &lt;API secret&gt;
</pre>

Note: A production application would need to add extra protection to the server, to ensure that the only people able
to get the access token are legitimate users of your application. Failure to do so would allow malicious users to make
API requests with the token, even though they do not have direct access to the API key and secret.


## License

These demos are released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html)
