var cs = cs || {};

cs.featureDetail = function(feature) {
    cs.featureDetail.feature_ = feature;
    cs.feature.zoom2feature(feature);
    cs.featureDetail.renderFeature();
    cs.featureDetail.showDetail();
    return this;
};

cs.featureDetail.featureElement_ = '';

cs.featureDetail.width = 350;

cs.featureDetail.feature_ = {};

cs.featureDetail.renderFeature = function(){
    cs.featureDetail.featureElement_ =  $('<div>',{class:''});

    cs.featureDetail.renderToolButtons();

    cs.featureDetail.wrapper = $('<div>',{class: 'cs-featureDetail-wrapper'})
      .appendTo(cs.featureDetail.featureElement_);

    cs.featureDetail.renderProperties();
};

cs.featureDetail.renderProperties = function(){

    var properties = cs.featureDetail.feature_.getProperties();
    var wrapper = cs.featureDetail.wrapper;


    for (var attr in cs.fdAttrs){

        var key = cs.fdAttrs[attr];

        var item = cs.datatype.constructor(cs.featureDetail.feature_, key, properties[key] );

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


cs.featureDetail.renderToolButtons = function() {
    var toolBar = cs.featureDetail.toolButtons =  $('<div>', {class : 'gs-featureDetail-toolButtons btn-toolbar', role:'toolbar', 'aria-label': 'neco'})
      .appendTo(cs.featureDetail.featureElement_);
    var btnGroup = $('<div>', {class : 'btn-group', role:'group', 'aria-label': 'neco'})
      .appendTo(toolBar);

    $('<button>', {class : 'btn btn-default'})
      .appendTo(btnGroup)
      .html('<i class="fa fa-map-marker"></i>')
      .on('click', function(){cs.feature.zoom2feature(cs.featureDetail.feature_, 15)});


    cs.featureDetail.btnGroupSecure = $('<div>', {class : 'btn-group ', role:'group', 'aria-label': 'neco'})
      .hide()
      .appendTo(toolBar);

    
    $('<button>', {class : 'btn btn-default'})
      .appendTo(cs.featureDetail.btnGroupSecure)
      .html('<i class="fa fa-edit"></i>')
      .on('click', cs.featureDetail.switchToEdit);

    $('<button>', {class : 'btn btn-default'})
      .appendTo(cs.featureDetail.btnGroupSecure)
      .html('<i class="fa fa-trash"></i>')
      .on('click', function(){})

    $('<button>', {class : 'btn btn-default'})
      .appendTo(cs.featureDetail.btnGroupSecure)
      .html('<i class="fa fa-comments-o"></i>')
      .on('click', function(){})
};


cs.featureDetail.renderEditableForm = function(){

    var properties = cs.featureDetail.feature_.getProperties();

    cs.featureDetail.form_ = $('<form>')
      .appendTo(cs.featureDetail.wrapper);

    for (var attr in cs.fdAttrs){
        var key = cs.fdAttrs[attr];
        var item = cs.datatype.constructor(cs.featureDetail.feature_, key, properties[key] );
        var editValue = item.getEditValue();
        if (editValue) {
            var formGroup = $('<fieldset>',{ class:'form-group'})
              .appendTo(cs.featureDetail.form_);
            $('<label>',{for: key, class: 'cs-featureDetail-form-label'})
              .html(key)
              .appendTo(formGroup);
            editValue.addClass('cs-featureDetail-form-item')
            editValue.addClass('form-control')
            editValue.appendTo(formGroup);
        }
    }
    cs.featureDetail.renderButtons();
};


cs.featureDetail.showDetail = function() {
    cs.sideBar_.find('#featureDetailContent')
      .html(cs.featureDetail.featureElement_);
    cs.sideBar_.open('featureDetail');
};


cs.featureDetail.renderButtons = function() {

    var wrapper = $('<div>',{id:'formButtons', class:'cs-featureDetail-formButtons pull-right form-group'})
      .appendTo(cs.featureDetail.form_);

    $('<button>',{class: 'btn btn-default'})
      .html('Cancel')
      .on('click', function(evt){evt.preventDefault();cs.featureDetail.switchToProperties();})
      .appendTo(wrapper);

    $('<button>',{type: 'submit', class: 'btn btn-default'})
      .html('Submit')
      .on('click',cs.featureDetail.onSubmitButtonClick_)
      .appendTo(wrapper);
};


cs.featureDetail.onSubmitButtonClick_ = function(evt) {
    evt.preventDefault();
    cs.featureDetail.switchToProperties();
    var data = cs.featureDetail.form_.serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    data.id = cs.featureDetail.feature_.get('id');
    data.user = {id: cs.user.name, password: cs.user.password};

    gsc.cs.eventUpdate(data)
      .done( function (evt) {
          console.log(evt)
      }).fail(
      function (evt) {
          console.log(evt)
      }
    )

};


cs.featureDetail.switchToEdit = function() {
    cs.featureDetail.wrapper.empty();
    cs.featureDetail.renderEditableForm();
};


cs.featureDetail.switchToProperties = function() {
    cs.featureDetail.wrapper.empty();
    cs.featureDetail.renderProperties();
};