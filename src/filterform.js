var cs = cs || {};

cs.filterform = function(querySelector) {
    cs.filterform.form_= $('<form>',{class:'cs-filterform-form'})
        .appendTo($(querySelector));

    cs.filterform.dateFrom();
    cs.filterform.dateTo();
    cs.filterform.status();
    cs.filterform.buttons();
};

cs.filterform.dateFrom = function() {

    $('<label>',{for: 'datetime-from', class: 'cs-filterform-item-label'})
        .html('From date')
        .appendTo(cs.filterform.form_);
    $('<input>', {id:'datetime-from', name:'datetime-from', class:'cs-filterform-item-input', type:'date'})
        .appendTo(cs.filterform.form_);
    //type:'datetime-local'
    return this;
};

cs.filterform.dateTo = function() {

    $('<label>',{for: 'datetime-to', class: 'cs-filterform-item-label'})
        .html('To date')
        .appendTo(cs.filterform.form_);
    $('<input>', {id:'datetime-to', name:'datetime-to', class:'cs-filterform-item-input', type:'date'})
        .appendTo(cs.filterform.form_);
    //type:'datetime-local'
    return this;
};

cs.filterform.status = function() {

    $('<label>',{for: 'status', class: 'cs-filterform-item-label'})
        .html('Status')
        .appendTo(cs.filterform.form_);
    var select = $('<select>', {id:'status', name:'status', class:'cs-filterform-item-input', type:'date'})
        .appendTo(cs.filterform.form_);

    var forStatus = function(status) {
        console.log(status);
            $('option',{})
                .html(status)
                .appendTo(select);
    };

    if (cs.config_.hasOwnProperty('statuses')) {
            cs.config_.statuses.forEach(forStatus);
    }

    //type:'datetime-local'
    return this;
};


cs.filterform.buttons = function() {
    // <button type="submit" class="btn btn-default">Submit</button>

    var wrapper = $('<div>',{id:'formButtons',class:'cs-filterform-buttons'})
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
        console.log(res);
        cs.eventSource_.clear();
        cs.events2features(res);
    };

    gsc.cs.eventListFilter(cs.filterform.requestData_)
        .done(doneHandler_)

};

cs.filterform.createDataJson_ = function() {
    cs.filterform.requestData_ = {};
    var datetimeFrom =  cs.filterform.form_.find('#datetime-from').val();
    var datetimeTo =  cs.filterform.form_.find('#datetime-to').val();

    if (datetimeFrom  != null || datetimeTo != null) {
        cs.filterform.requestData_.datetime = {};

        if (datetimeFrom != null) {
            cs.filterform.requestData_.datetime.from = datetimeFrom;
        }

        if (datetimeTo != null) {
            cs.filterform.requestData_.datetime.to = datetimeTo;
        }
    }


    return cs.filterform.requestData_;
};

cs.filterform.onResetButtonClick_ = function(evt) {

};



