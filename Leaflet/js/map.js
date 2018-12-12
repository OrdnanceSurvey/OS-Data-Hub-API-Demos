var url = 'https://ordnance-omse-dev-prod.apigee.net/omse/wmts';
var Road =  new L.TileLayer(url + '?key={key}&tilematrixSet=EPSG%3A27700&version=1.0.0&style=default&layer=Road%2027700&SERVICE=WMTS&REQUEST=GetTile&TileMatrix={z}&TileRow={y}&TileCol={x}',{
    attribution: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a> ',
    maxNativeZoom: 13,
    maxZoom : 14,
    key: OS_API_KEY,
});

var baseMaps = {
    "Road": Road
};

var epsg27700 = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs";
var crs = new L.Proj.CRS(
    'EPSG:27700',
    epsg27700, {
        transformation: new L.Transformation(1, 238375, -1, 1376256),
        resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
    });

var map = L.map('map', {
    crs: crs,
    layers: Road,
    zoomControl: true,
    maxZoom: 13,
    minZoom: 0,
    center: ([51.507222, -0.1275]),
    zoom: 4
});

map.on('click', function(e) {
    
 console.log(e.latlng)   
});    