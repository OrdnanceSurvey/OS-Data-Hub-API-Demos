var Road = new L.TileLayer('https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={key}', {
    key: 'INSERT_YOUR_API_KEY_HERE ',
    tilematrixSet: 'EPSG:27700',
    layer: 'Road 27700',
    imgFormat: 'png',
    continuousWorld: true
});

var Outdoor = new L.TileLayer('https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={key}', {
    key: 'INSERT_YOUR_API_KEY_HERE ',
    tilematrixSet: 'EPSG:27700',
    layer: 'Outdoor 27700',
    imgFormat: 'png',
    continuousWorld: true
});

var Light = new L.TileLayer('https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={key}', {
    key: 'INSERT_YOUR_API_KEY_HERE ',
    tilematrixSet: 'EPSG:27700',
    layer: 'Light 27700',
    imgFormat: 'png',
    continuousWorld: true
});

var Night = new L.TileLayer('https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={key}', {
    key: 'INSERT_YOUR_API_KEY_HERE ',
    tilematrixSet: 'EPSG:27700',
    layer: 'Night 27700',
    imgFormat: 'png',
    continuousWorld: true
});

var Leisure = new L.TileLayer('https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={key}', {
    key: 'INSERT_YOUR_API_KEY_HERE ',
    tilematrixSet: 'EPSG:27700',
    layer: 'Leisure 27700',
    imgFormat: 'png',
    continuousWorld: true
});

var baseMaps = {
    "Road": Road,
    "Outdoor": Outdoor,
    "Light": Light,
    "Night": Night,
    "Leisure": Leisure
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

L.control.layers(baseMaps).addTo(map);


map.on('click', function(e) {
    
 console.log(e.latlng)   
});    