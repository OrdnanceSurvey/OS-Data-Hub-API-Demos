#OS Maps API Demos

This repo contains working examples of how to use the Ordnance Survey Maps API, a RESTful API based on the OS datasets. The API offers access to five styles of map: Leisure, Outdoor, Road, Light and Night. Scale varies from an overview of Great Britain and OS products such as [MiniScale®] (https://www.ordnancesurvey.co.uk/business-and-government/products/miniscale.html), OS VectorMap® Local and OS VectorMap® District, right down to OS MasterMap® Topography.

In the outdoor stack, buildings in OS MasterMap® Topography are 2.5D. The API supports EPSG:27700 and EPSG:3857 in OGC KVP WMTS and RESTful ZXY. PNG format is supported. There are JavaScript examples using [Leaflet](http://leafletjs.com/) and [Openlayers 3](http://openlayers.org/), as well as [Openlayers 2.13](http://openlayers.org/two/) for OpenSpace.

Register for an API key of OS Places API [here](https://www.ordnancesurvey.co.uk/forms/os-maps-api-signup).

Full documentation for the OS Places API can be found [here](https://apidocs.os.uk/docs/os-maps-overview).

##Data Sources

###Strategi

Strategi® is digital vector data. It’s a representation of Ordnance Survey’s 1:250 000 scale graphic products. As such, it’s ideal for apps that need an overview of generalised geographic information such as planning or environmental analysis.

###OS [VectorMap District](https://www.ordnancesurvey.co.uk/business-and-government/products/vectormap-district.html)

OS VectorMap® District is a mapping dataset that provides contextual mapping, with a recommended viewing scale range of 1:15 000 to 1:30 000. It provides the level of detail you’d expect to find in backdrop mapping, interactive web mapping and any app that’s geared to business locations and routing.

###OS [VectorMap Local](https://www.ordnancesurvey.co.uk/business-and-government/products/vectormap-local.html)

OS VectorMap® Local is a series of 5km by 5km tiles of simple vector GML data, which covers the whole of Great Britain. We designed it to help create graphical mapping.
It can be used as mapping in its own right or as a contextual reference for customers’ overlay information. Apps and services using OS VectorMap Local are likely to include banking and insurance, land and property, consumer website services, navigation products, cartographic representation and urban extents.

###OS [MasterMap](https://www.ordnancesurvey.co.uk/business-and-government/products/mastermap-products.html) Topography Layer

OS MasterMap® is the most detailed, current and comprehensive map dataset of Great Britain. The Topography Layer contains landscape features, such as buildings, fields, fences, land, water and roads, as well as administrative boundaries. The Topography Layer contains over 425 million features.

Our specification will extend the Infrastructure for Spatial Information in the European Community (INSPIRE) Geographical Names theme to ensure it’s compliant with European open data initiatives.

##License

These demos are released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html)
