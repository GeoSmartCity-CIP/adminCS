var cs = cs || {};

cs.filterform = function(querySelector) {
    cs.filterform.form_= $('<form>',{class:'cs-filterform-form'})
        .appendTo($(querySelector));

    cs.filterform.status();
    cs.filterform.priority();
    cs.filterform.dateFrom();
    cs.filterform.dateTo();

    cs.filterform.buttons();
};

cs.filterform.dateFrom = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
        .appendTo(cs.filterform.form_);

    $('<label>',{for: 'datetime-from', class: 'cs-filterform-item-label'})
        .html('From date')
        .appendTo(formGroup);
    $('<input>', {id:'datetime-from', name:'datetime-from', class:'cs-filterform-item-input', type:'date'})
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
    $('<input>', {id:'datetime-to', name:'datetime-to', class:'cs-filterform-item-input', type:'date'})
        .appendTo(formGroup);

    return this;
};

cs.filterform.status = function() {

    var formGroup = $('<div>',{class:'cs-filterform-form-group form-group'})
        .appendTo(cs.filterform.form_);

    $('<label>',{for: 'status', class: 'cs-filterform-item-label'})
        .html('Status')
        .appendTo(formGroup);
    var select = $('<select>', {id:'status', name:'status', class:'cs-filterform-item-input', type:'date'})
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
    var select = $('<select>', {id:'priority', name:'priority', class:'cs-filterform-item-input', type:'date'})
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

    cs.filterform.filterData_.filter = filterData;
    return cs.filterform.filterData_;
};

cs.filterform.onResetButtonClick_ = function(evt) {

};



