ol.DOTS_PER_INCH = 90.7;
var epsg27700 = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs";
// The WMTS URL
//var url = "https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/wmts?apikey=INSERT_YOUR_KEY_HERE";
var url = "https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/wmts?key=INSERT_YOUR_API_KEY_HERE";


proj4.defs["EPSG:27700"] = epsg27700;

var epsg27700Projection = new ol.proj.Projection({
  code: epsg27700,
  extent: [-238375.0,0,700000,1300000]
});

var matrixIds = new Array(14);
for (var z = 0, i = 13; z < 14; z++, i--) {
    // generate resolutions and matrixIds arrays for this WMTS
    matrixIds[z] = "EPSG:27700:" + z;
}
var attribution = new ol.Attribution({
    html: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
});
var extent = [0,0,700000,1300000];

var map = new ol.Map({
    target: 'map',
    projection: epsg27700Projection,
    layers: [
        new ol.layer.Tile({
            extent: extent,
            source: new ol.source.WMTS({
                attributions: [attribution],
                url: url,
                layer: 'Road 27700',
                matrixSet: 'EPSG:27700',
                format: 'image/png',
                projection: epsg27700Projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: [-238375.0, 1376256.0],
                    resolutions: [896.0, 448.0, 224.0, 112.0,
                        56.0, 28.0, 14.0, 7.0, 3.5, 1.75,
                        0.875, 0.4375, 0.21875, 0.109375
                    ],
                    matrixIds: matrixIds
                }),
                style: ''
            })
        })
    ],
    view: new ol.View({
        extent: extent,
        center: [437289.62, 115545.03],
        maxZoom: 20,
        minZoom: 7,
        zoom: 9
    })
});
map.addControl(new ol.control.ZoomSlider());