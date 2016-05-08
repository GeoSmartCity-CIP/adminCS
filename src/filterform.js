var cs = cs || {};

cs.filterform = function(querySelector) {
    cs.filterform.form_= $('<form>', {class:'cs-filterform-form'})
        .appendTo($(querySelector));

    cs.filterform.status();
    cs.filterform.priority();
    cs.filterform.dateFrom();
    cs.filterform.dateTo();
    cs.filterform.bbox();

    cs.filterform.buttons();
    cs.filterform.initGeomFilter();
};

cs.filterform.width = 300;

cs.filterform.dateFrom = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
        .appendTo(cs.filterform.form_);

    $('<label>',{for: 'datetime-from', class: 'cs-filterform-item-label'})
        .html('From date')
        .appendTo(formGroup);
    $('<input>', {id:'datetime-from', name:'datetime-from', class:'cs-filterform-item-input form-control', type:'date'})
        .appendTo(formGroup);
    //type:'datetime-local'
    return this;
};

cs.filterform.dateTo = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
        .appendTo(cs.filterform.form_);

    $('<label>',{for: 'datetime-to', class: 'cs-filterform-item-label'})
        .html('To date')
        .appendTo(formGroup);
    //type:'datetime-local'
    $('<input>', {id:'datetime-to', name:'datetime-to', class:'cs-filterform-item-input form-control', type:'date'})
        .appendTo(formGroup);

    return this;
};



cs.filterform.status = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
        .appendTo(cs.filterform.form_);

    $('<label>',{for: 'status', class: 'cs-filterform-item-label'})
        .html('Status')
        .appendTo(formGroup);
    var select = $('<select>', {id:'status', name:'status', class:'cs-filterform-item-input form-control', type:'date'})
        .appendTo(formGroup);

    $('<option>', {value: ''})
        .html('--')
        .appendTo(select);

    var forStatus = function(status) {
        $('<option>', {value: status})
            .html(status)
            .appendTo(select);
    };

    if (cs.config_.hasOwnProperty('statuses')) {
        cs.config_.statuses.forEach(forStatus);
    }

    return this;
};

cs.filterform.priority = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
        .appendTo(cs.filterform.form_);
    $('<label>',{for: 'priority', class: 'cs-filterform-item-label'})
        .html('Priority')
        .appendTo(formGroup);
    var select = $('<select>', {id:'priority', name:'priority', class:'cs-filterform-item-input form-control', type:'date'})
        .appendTo(formGroup);

    $('<option>', {value: ''})
        .html('--')
        .appendTo(select);

    var forPrior = function(priority) {
        $('<option>', {value: priority})
            .html(priority)
            .appendTo(select);
    };

    if (cs.config_.hasOwnProperty('priorities')) {
        cs.config_.priorities.forEach(forPrior);
    }

    return this;
};


cs.filterform.bbox = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
      .appendTo(cs.filterform.form_);

    $('<label>',{for: 'bbox', class: 'cs-filterform-item-label'})
      .html('Geometry filter')
      .appendTo(formGroup);

    $('<small>',{class: 'text-muted', style:'display: block'})
      .html('Use Ctrl+drag (Meta+drag on Mac) to draw boxes. Or set bbox. ')
      .appendTo(formGroup);

    cs.filterform.bbox.input = $('<textarea>', {id:'bbox', name:'bbox', class:'cs-filterform-item-input form-control', type:'text', placeholder: 'lon-min, lat-min, lon-max, lat-max'})
      .appendTo(formGroup);

    return this;
};

cs.filterform.buttons = function() {

    var wrapper = $('<div>',{id:'formButtons',class:'cs-filterform-buttons cs-filterform-form-group'})
        .appendTo(cs.filterform.form_);
    $('<button>',{type: 'reset', class: 'btn btn-default'})
        .html('Reset')
        .on('click',cs.filterform.onResetButtonClick_)
        .appendTo(wrapper);

    $('<button>',{type: 'submit', class: 'btn btn-default'})
        .html('Submit')
        .on('click',cs.filterform.onSubmitButtonClick_)
        .appendTo(wrapper);
};

cs.filterform.onSubmitButtonClick_ = function(evt) {
    evt.preventDefault();
    cs.filterform.createDataJson_();

    var doneHandler_ = function(res) {
        console.log('number of features: ',res.length);
        cs.eventSource_.clear();
        if (res.length < 1 ) {
            alert('No feature was selected!');
            return
        }
        cs.events2features(res);
    };

    console.info(cs.filterform.filterData_);

    gsc.cs.eventListFilter(cs.filterform.filterData_)
        .done(doneHandler_)

};

cs.filterform.createDataJson_ = function() {
    cs.filterform.filterData_ = {};

    var filterData = {};


    var datetimeFrom =  cs.filterform.form_.find('#datetime-from').val();
    var datetimeTo =  cs.filterform.form_.find('#datetime-to').val();
    var status =  cs.filterform.form_.find('#status').val();
    var priority = cs.filterform.form_.find('#priority').val();
    var bbox = cs.filterform.form_.find('#bbox').val();


    if (datetimeFrom  || datetimeTo) {
        filterData.datetime = {};

        if (datetimeFrom) {
            filterData.datetime.from = new Date(datetimeFrom).toISOString();
        }

        if (datetimeTo) {
            filterData.datetime.to = new Date(datetimeTo).toISOString();
        }
    }

    if (priority) {
        filterData.priority = [priority];
    }

    if (status) {
        filterData.status = status;
    }

    if (bbox) {
        var array = bbox.split(',');
        if (array.length != 4) return;
        filterData.bbox = {
            "lat-min": +array[1],
              "lon-min": +array[0],
              "lat-max": +array[3],
              "lon-max": +array[2],
              "crs": "epsg:4326"
        };
    }

    cs.filterform.filterData_.filter = filterData;
    return cs.filterform.filterData_;
};

cs.filterform.onResetButtonClick_ = function(evt) {

};


cs.filterform.initGeomFilter = function () {



    cs.filterform.dragbox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
    });

    cs.map_.addInteraction(cs.filterform.dragbox);

    cs.filterform.dragbox.on('boxend', function(e) {
        var extent = cs.filterform.dragbox.getGeometry().getExtent();
        extent = ol.proj.transformExtent(extent,'EPSG:3857','EPSG:4326');
        cs.filterform.bbox.input.val(extent);
    });

    cs.filterform.dragbox.on('boxstart', function(e) {

    });
}


