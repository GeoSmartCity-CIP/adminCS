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

  this.getConfig()
    .done(function(){cs.sideBar_.open('info')});

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


cs.events2features = function(events){
  events.forEach(function(event){
    cs.eventSource_.addFeature(cs.feature.event2feature(event));
  });

  if (cs.sourceIsInMap){
    cs.fit2features(270);
  } else {
    cs.source2map();
  }

  cs.datagrid.updateData();
};


cs.source2map = function() {
  cs.layer_ =  new ol.layer.Vector({
    //source: cs.eventSource_
    source: cs.clusterSource_,
    style: cs.feature.style
  });
  cs.map_.addLayer(cs.layer_);
  cs.sourceIsInMap = true;
  cs.fit2features(250);
};


cs.fit2features = function(width) {
  var width = width || cs.sideBar_.width();
  var extent = cs.eventSource_.getExtent();
  cs.map_.getView().fit(extent,cs.map_.getSize(),{'padding' : [10, 10, 10, width], 'maxZoom': 15});
};

cs.initSideBar = function() {
  cs.sideBar_ = $('#sidebar').sidebar();

  var widthFn = function(evt,param) {
    cs.sideBar_.type = param.id;

    var pane = cs.sideBar_.find('#'+param.id);

    switch (cs.sideBar_.type) {
      case 'datagrid':
        cs.sideBar_.width(cs.datagrid.width);
        pane.css('min-width',cs.datagrid.width-400);
        break;
      case 'filter':
        cs.sideBar_.width(cs.filterform.width);
        pane.css('min-width',cs.filterform.width-100);
        break;
      case 'userProfile':
        cs.sideBar_.width(cs.user.width);
        pane.css('min-width',cs.user.width-100);
        break;
      case 'featureDetail':
        cs.sideBar_.width(cs.featureDetail.width);
        pane.css('min-width',cs.featureDetail.width-150);
        break;
      case 'info':
        cs.sideBar_.width(300);
        pane.css('min-width',300-150);
        break;
      default:
        cs.sideBar_.removeAttr('style')
    }
  };

  var transition;

  cs.sideBar_.resizable({
    minWidth: 40,
    animate: false,
    handles: "e"
  })
    .on( "resizestart", function( event, ui ) {
      transition = cs.sideBar_.css('transition');
      cs.sideBar_.css('transition','none')
    } )
    .on( "resizestop", function( event, ui ) {
      cs.sideBar_.css('transition', transition);
      if (cs.sideBar_.width() <= 40){
        cs.sideBar_.close();
      } else {
        switch (cs.sideBar_.type) {
          case 'datagrid':
            cs.datagrid.width = cs.sideBar_.width();
            break;
          case 'filter':
            cs.filterform.width = cs.sideBar_.width();
            break;
          case 'userProfile':
            cs.user.width = cs.sideBar_.width();
            break;
          case 'featureDetail':
            cs.featureDetail.width = cs.sideBar_.width();
            break;

        }
      }
    } )
    .on('content', widthFn)
};

cs.initEvents = function() {

  // http://openlayers.org/en/v3.8.1/examples/icon.html?q=style+icon
  var closePop = function(e) {
    $('#popup').popover('destroy');
    return;
  };

  var singleClick = function(evt){
    cs.map_.forEachFeatureAtPixel(evt.pixel, function (feature,layer) {
      cs.feature.clickOnFeatures(feature,layer,evt)
    });
  };

  //this.map_.on('pointermove', closePop);

  this.map_.getView().on('change:center', closePop);

  this.map_.on('singleclick', singleClick);
};


cs.getConfig = function() {
  var promiseDone = function(res) {
    cs.config_ = res;

    cs.filterform('#filterWrapper');
  };
  var promise = gsc.cs.getConfig()
    .done(promiseDone);
  return promise;
};

// property to type
cs.evSchema = {
  'label' : 'string',
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

// visualise these properties:
cs.dgAttrs = ['description', 'location', 'user', 'tags'];
cs.fdAttrs = ['description','location', 'user', 'tags'];


// featurelabel function
cs.fLabel = function(feature) {
  return feature.get('tags');
};
