var options = {
    epsg: "EPSG:3857",
    bounds: [-1839380.6487, 4271140.7261, 4774562.5348, 8942520.8131],
    units: 'm'
};


// map initializing
var gscMap = gsc.map.Map('map',options);


cs.init(gscMap.getOlMap());
cs.initSideBar();


// reggio_emilia layer
// layers: http://hub.geosmartcity.eu/geoserver/web/
var layerReggio_Emilia = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/reggio_emilia/wms',
        params: {'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'reggio_emilia:edifici',
            STYLES: ''
        }
    })
});

var attribution  = new ol.Attribution({
    html: '<a href="http://link">TEXT</a>',
    options: {
        collapsible: true,
        label: 'A',
        collapsed: true,
        tipLabel: 'yooo'
    }
});

var layerOSM =  new ol.layer.Tile({
    source: new ol.source.OSM()
});


var layerMapQuest =  new ol.layer.Tile({
    source: new ol.source.MapQuest({layer: 'osm'})
});

gscMap.addLayer(layerOSM);

cs.getAllEvents();
