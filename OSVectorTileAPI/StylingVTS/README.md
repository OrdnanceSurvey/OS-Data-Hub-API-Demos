# VTS styling

Our Vector Tile Service provides a readily usable style, based on the available features. If you wish to adapt the existing style or create your own, you can easily do so.

We will explain two options:
* Dynamically adapting the pre-defined style
* Creating your own style within the code

We will explain both for OpenLayers, the principles are similar for MapBoxGL JS and Arc JS.

It is also possible to create your own style from scratch and to host this locally on your server. This example has been omitted for the time being and will be added at a later date.

Before we start please ensure you have a working version of the OS Data Hub VTS Demo for OpenLayers. You can find out how to get this in the Getting Started Guide.

We recommend you take a look at the currently pre-defined styling for the service. You can get a copy of the pre-defined style directly from our VTS service by calling https://api.os.uk/maps/vector/v1/vts/resources/styles/?key={YourKey} in your browser.

The result is [minified](https://en.wikipedia.org/wiki/Minification_(programming)) to keep the file size as small as possible, rendering it difficult to read for humans. Search online for a "JSON pretty print" converter which will turn the minified JSON data you received back into a more readable format.
   
Take a look at this to get a better understanding of the structure. You will notice that each element contains a combination of defining attributes and style attributes. We can access, filter and change all of these, much like any other JSON data object.
