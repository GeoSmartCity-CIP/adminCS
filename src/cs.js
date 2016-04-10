var cs = cs || {};

cs.map_ = {};
cs.eventSource_ = new ol.source.Vector({});
cs.sideBar_ = {};
cs.datagrid_ = [];

cs.init = function (map) {
    cs.map_ = map;
};


cs.getAllEvents = function()  {
    var data = {};
    gsc.cs.eventListFilter(data)
        .done(function(res){
            cs.eventSource_.clear();
            cs.events2features(res);
        }).fail(function(err){
        cs.error(err);
    });
};


cs.error = function(error) {
    alert(error)
};


cs.event2feature = function(event){
    var coors = new ol.geom.Point( [event.location.lat, event.location.lon])
        .transform('EPSG:4326', 'EPSG:3857');

    var feature = new ol.Feature({
        geometry: coors,
        name: 'event'
    });

    feature.setId(event.id);
    feature.setProperties(event);
    return feature;
};


cs.events2features = function(events){
    events.forEach(function(event){
        cs.eventSource_.addFeature(cs.event2feature(event));
    });
    this.source2map();
    this.initData();
};


cs.source2map = function() {
    cs.layer_ =  new ol.layer.Vector({
        source: cs.eventSource_
    });
    cs.map_.addLayer(cs.layer_);
    cs.fit2features();
};


cs.initData = function() {
    cs.datagrid_ = [];
    cs.eventSource_.forEachFeature(function(feature){
        var properties = feature.getProperties();
        delete properties['location'];
        delete properties['geometry'];
        cs.datagrid_.push(properties);
    });
};


cs.fit2features = function() {
    var extent = cs.eventSource_.getExtent();
    cs.map_.getView().fit(extent,cs.map_.getSize());
};

cs.initSideBar = function() {
    cs.sideBar_ = $('#sidebar').sidebar('sidebar', {position: 'right'});
};
