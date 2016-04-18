var cs = cs || {};

cs.map_ = {};
cs.eventSource_ = new ol.source.Vector({});

cs.clusterSource_ = new ol.source.Cluster({
    distance: 30,
    source: cs.eventSource_
});

cs.sideBar_ = {};

cs.config_ = {};


cs.init = function (map) {
    cs.map_ = map;


    cs.popup_ = new ol.Overlay({
        element: document.getElementById('popup'),
        positioning: 'bottom-center',
        stopEvent: false
    });

    map.addOverlay(cs.popup_);

    this.getConfig();

    this.initEvents();
};


cs.getAllEvents = function()  {
    var data = {};

    var doneHandler_ = function(res) {
        cs.eventSource_.clear();
        cs.events2features(res);
    };


    gsc.cs.eventListFilter(data)
        .done(doneHandler_)
        .fail(cs.error);
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

    if (event.status == 'created') {
        feature.setStyle(cs.icon.ok);
    } else {
        feature.setStyle(cs.icon.ko);
    }
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
    cs.layer_ =  new ol.layer.Vector({
        //source: cs.eventSource_
        source: cs.clusterSource_,
        style: cs.style
    });
    cs.map_.addLayer(cs.layer_);
    cs.fit2features();
};


cs.fit2features = function() {
    var extent = cs.eventSource_.getExtent();
    cs.map_.getView().fit(extent,cs.map_.getSize(),{'padding' : [10, 10, 10, 400], 'maxZoom': 15});
};

cs.initSideBar = function() {
    cs.sideBar_ = $('#sidebar').sidebar();
};

cs.initEvents = function() {


    // http://openlayers.org/en/v3.8.1/examples/icon.html?q=style+icon
    var closePop = function(e) {
        $('#popup').popover('destroy');
        return
    };

    var singleClick = function(evt){
        cs.map_.forEachFeatureAtPixel(evt.pixel, function (feature,layer) {
            cs.clickFeatures(feature,layer,evt)
        });
    };

    //this.map_.on('pointermove', closePop);

    this.map_.getView().on('change:center', closePop);

    this.map_.on('singleclick', singleClick);
};

cs.icon = {};

cs.icon.ko  = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        // imgSize: [20,20],
        scale: 0.08,
        opacity: 1,
        src: 'images/icons/fire.svg'
    }))
});


cs.icon.ok  = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        // imgSize: [20,20],
        scale: 0.08,
        opacity: 1,
        src: 'images/icons/star.svg'
    }))
});


cs.styleCache = {};

cs.style = function(feature, resolution) {
    var style = cs.styleCache[size];
    var size = feature.get('features').length;
    if (size == 1){
        var f = feature.get('features')[0]
        if (f.get('status') == 'created') {
            return cs.icon.ko;
        } else {
            return cs.icon.ok;
        }
    }

    if (!style) {
        style = [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({
                    color: '#fff'
                }),
                fill: new ol.style.Fill({
                    color: '#3399CC'
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        })];
        cs.styleCache[size] = style;
    }
    return style;
};

cs.clickFeatures = function(feature,layer,evt) {
    var size = feature.get('features').length;

    if (size < 5) {

        cs.popup_.setPosition(evt.coordinate);
        var content = $('<div>');
        feature.get('features').forEach(function (item) {
            content.append(cs.renderFeaturePopup(item));
        });

        var popElm = $('#popup');

        popElm.popover("destroy").popover({
            'placement': 'top',
            'html': true,
            'content': content
        });

        popElm.popover('show');
    } else {
        console.log(feature.get())
        //cs.map_.getView().setZoom(cs.map_.getView().getZoom()+1);
        cs.zoom2feature(feature, cs.map_.getView().getZoom() + 1 );
    }
};

cs.renderFeaturePopup = function(feature) {

    var goTo = function(evt) {
        cs.featureDetail(feature);
    };

    var wrapper = $('<div>',{class:'cs-feature-popup-item-wrapper'})
        .on('click',goTo);

    $('<span>', {class:'fa fa-info-circle cs-feature-popup-item-icon'}).appendTo(wrapper);
   // $('<span>', {class: 'cs-feature-popup-item-name'}).html(feature.get('name')).appendTo(wrapper);
    $('<span>', {class: 'cs-feature-popup-item-name'}).html('<b>status:</b> '+ feature.get('status') +', <b>priority:</b> '+ feature.get('priority')).appendTo(wrapper);
    $('<img>', {class: 'cs-feature-popup-item-name', src:feature.get('media')[0].src }).appendTo(wrapper);


    return wrapper;
};

cs.zoom2feature = function(feature, maxZoom) {

    var mz = maxZoom || 15;

    var geometry = (feature.getGeometry());
    var mapSize = cs.map_.getSize();
    cs.map_.getView().fit(geometry, mapSize, {'padding' : [0, 0, 0, cs.sideBar_.width()], 'maxZoom': mz});

};

cs.getConfig = function() {
    var promiseDone = function(res) {
        cs.config_ = res;

        cs.filterform('#filterWrapper');
    };
    var promise = gsc.cs.getConfig()
        .done(promiseDone)
};

cs.evSchema = {
    'name' : 'string',
    'datetime' : 'datetime',
    'description' : 'desc',
    'id' : 'id',
    'media' : 'media',
    'priority' : 'priority',
    'user' : 'user',
    'status' : 'status',
    'location' : 'geometry',
    'geometry' : 'geometry',
    'tags' : 'tags',
    'comments' : 'comments'
};

cs.dgAttrs = ['name','location','description','datetime','media','priority','user','status','tags','comments'];

cs.fdAttrs = ['name','description','datetime','media','priority','user','status','tags','comments', 'location'];