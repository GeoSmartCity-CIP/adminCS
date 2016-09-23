var cs = cs || {};

cs.feature = {};


cs.feature.event2feature = function(event){
  var coors = new ol.geom.Point( [event.location.lon, event.location.lat])
    .transform('EPSG:4326', 'EPSG:3857');

  var feature = new ol.Feature({
    geometry: coors,
    name: 'event'
  });


  if (event.status == 'created') {
    feature.setStyle(cs.feature.icon.ok);
  } else {
    feature.setStyle(cs.feature.icon.ko);
  }
  feature.setId(event.id);
  feature.setProperties(event);

  feature.set('label', cs.fLabel(feature));
  return feature;
};


cs.feature.zoom2feature = function(feature, maxZoom, leftPadding) {

  var padding = [0, 0, 0, 0];

  if (leftPadding) {
    padding = [0, 0, 0, leftPadding]
  } else if (cs.sideBar_.width() < cs.map_.getSize()[0] ) {
    padding = [0, 0, 0, cs.sideBar_.width()]
  }

  var mz = maxZoom || 15;

  var geometry = (feature.getGeometry());
  var mapSize = cs.map_.getSize();
  cs.map_.getView().fit(geometry, mapSize, {'padding' : padding, 'maxZoom': mz});

};



cs.feature.renderFeaturePopup = function(feature) {

  var goTo = function(evt) {
    cs.featureDetail(feature);
  };

  var wrapper = $('<div>',{class:'cs-feature-popup-item-wrapper'})
    .on('click',goTo);

  $('<span>', {class:'fa fa-info-circle cs-feature-popup-item-icon'}).appendTo(wrapper);

  $('<span>', {class: 'cs-feature-popup-item-name'}).html('<b>'+ feature.get('label') + '</b>' ).appendTo(wrapper);
  return wrapper;
};

cs.feature.updateProperties = function(feature, properties){
  for (key in properties) {
    var value = properties[key];
    feature.set(key,value);
  }
  cs.featureDetail.rerenderFd();
  cs.datagrid.rerenderDg();
};


cs.feature.styleCache = {};

cs.feature.style = function(feature, resolution) {
  var style = cs.feature.styleCache[size];
  var size = feature.get('features').length;
  if (size == 1){
    var f = feature.get('features')[0];
    if (f.get('status') == 'created') {
      return cs.feature.icon.ko;
    } else {
      return cs.feature.icon.ok;
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
    cs.feature.styleCache[size] = style;
  }
  return style;
};

cs.feature.clickOnFeatures = function(feature,layer,evt) {
  var size = feature.get('features').length;

  if (size < 5) {
    cs.popup_.setPosition(evt.coordinate);
    var content = $('<div>');
    feature.get('features').forEach(function (item) {
      content.append(cs.feature.renderFeaturePopup(item));
    });

    var popElm = $('#popup');
    popElm.popover("destroy").popover({
      'placement': 'top',
      'html': true,
      'content': content
    });

    popElm.popover('show');
  } else {
    cs.feature.zoom2feature(feature, cs.map_.getView().getZoom() + 1 );
  }
};


cs.feature.icon = {};

cs.feature.icon.ko  = new ol.style.Style({
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


cs.feature.icon.ok  = new ol.style.Style({
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


