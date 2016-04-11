var cs = cs || {};


cs.featureDetail = function(feature) {
    cs.featureDetail.feature_ = feature;


    //cs.map_.getView().fitGeometry(feature.getGeometry(),cs.map_.getSize());

    cs.featureDetail.renderFeature();


    cs.featureDetail.showDetail();
    return this;
};

cs.featureDetail.featureElement_ = '';

cs.featureDetail.feature_ = {};

cs.featureDetail.renderFeature = function(){

    cs.featureDetail.featureElement_ =  $('<div>',{class:'cs-featureDetail-wrapper'})

    cs.featureDetail.renderProperties();
};

cs.featureDetail.renderProperties = function(){
    var properties = cs.featureDetail.feature_.getProperties();

    for (property in properties){
        $('<div>',{class: 'cs-featureDetail-property'})
            .html(property)
            .appendTo(cs.featureDetail.featureElement_)

        $('<div>')
            .html(properties[property])
            .appendTo(cs.featureDetail.featureElement_)
    }

};

cs.featureDetail.showDetail = function() {
    cs.sideBar_.open('featureDetail');
    cs.sideBar_.find('#featureDetail')
        .html(cs.featureDetail.featureElement_);
};
