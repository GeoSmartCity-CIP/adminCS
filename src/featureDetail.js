var cs = cs || {};


cs.featureDetail = function(feature) {
    cs.featureDetail.feature_ = feature;


    var coors = (feature.getGeometry().getCoordinates());
    cs.map_.getView().setCenter(coors);
    cs.map_.getView().setZoom(16);

    cs.featureDetail.renderFeature();

    cs.featureDetail.showDetail();
    return this;
};

cs.featureDetail.featureElement_ = '';

cs.featureDetail.feature_ = {};

cs.featureDetail.renderFeature = function(){

    cs.featureDetail.featureElement_ =  $('<div>',{class:'cs-featureDetail-wrapper'});

    cs.featureDetail.renderProperties();
};

cs.featureDetail.renderProperties = function(){
    var properties = cs.featureDetail.feature_.getProperties();

    var wrapper = $('<div>',{class: 'cs-featureDetail-wrapper'})
        .appendTo(cs.featureDetail.featureElement_);

    $('<h2>',{class: 'cs-featureDetail-header'})
        .html('event detail')
        .appendTo(wrapper);

    for (var attr in cs.fdAttrs){

        var key = cs.dgAttrs[attr];

        var item = cs.datatype.constructor(key, properties[key]);

        var itemWrapper = $('<div>',{class: 'cs-featureDetail-item-wrapper'})
        .appendTo(wrapper);

        $('<span>',{class: 'cs-featureDetail-item-name'})
            .html(key)
            .appendTo(wrapper);

        $('<span>',{class: 'cs-featureDetail-item-value'})
            .html(item.getFdValue())
            .appendTo(wrapper);
    }

};

cs.featureDetail.showDetail = function() {
    cs.sideBar_.open('featureDetail');
    cs.sideBar_.find('#featureDetail')
        .html(cs.featureDetail.featureElement_);
};
