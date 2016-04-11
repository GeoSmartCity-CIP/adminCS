var cs = cs || {};

cs.map_ = {};
cs.eventSource_ = new ol.source.Vector({});

cs.clusterSource_ = new ol.source.Cluster({
    distance: 10,
    source: cs.eventSource_
});

cs.sideBar_ = {};

cs.init = function (map) {
    cs.map_ = map;
    this.initEvents();
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
    cs.datagrid.updateData();
};


cs.source2map = function() {
    var styleCache = {};
    cs.layer_ =  new ol.layer.Vector({
        source: cs.clusterSource_
    });
    cs.map_.addLayer(cs.layer_);
    cs.fit2features();
};


cs.fit2features = function() {
    var extent = cs.eventSource_.getExtent();
    cs.map_.getView().fit(extent,cs.map_.getSize());
};

cs.initSideBar = function() {
    cs.sideBar_ = $('#sidebar').sidebar();
};

cs.initEvents = function() {
    this.map_.on('singleclick', function(evt) {
        cs.map_.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
            //TODO cluster implement
                cs.featureDetail(feature.get('features')[0]);
            });
    });
};