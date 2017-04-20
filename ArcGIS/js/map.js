
    require([
    "esri/map", "esri/layers/WMTSLayer", "esri/layers/WMTSLayerInfo",
    "esri/config",
    "dojo/domReady!"
    ], function(
        Map, WMTSLayer, WMTSLayerInfo, 
        esriConfig
        ) {
        
        esri.config.defaults.io.corsEnabledServers.push("https://api2.ordnancesurvey.co.uk")
        var map = new Map("map");
        var options = {
            serviceMode: "KVP",
            hasAttributionData : true
        };
        var apiUrl = "https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/wmts"
        var wmtsLayer = new WMTSLayer(apiUrl + "?key=" + OS_API_KEY, options);
        map.addLayer(wmtsLayer);

        // When attribution element is ready, insert the OS attribution
        var attr = '<span>&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a></span>';
        var attributionReady = setInterval(function() {
            if (map.attribution.itemNodes.layer0) {
                map.attribution.itemNodes.layer0.innerHTML = attr;
                clearInterval(attributionReady);
            }
        }, 100);
       
    });