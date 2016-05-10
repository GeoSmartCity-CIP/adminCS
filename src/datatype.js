var cs = cs || {};

cs.datatype = {};

cs.datatype.constructor = function(feature, key, property){
    return  cs.datatype.types_[cs.evSchema[key]](property, feature, key);
};

cs.datatype.string = function(val, feature, key){
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        var input = $('<input>', {type:'text' , name:key})
          .val(val)
        return input;
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.desc = function(val, feature, key){
    var dt = {};

    dt.getValue = function() {
        return val;
    };


    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        var input = $('<textarea>', {name:key})
          .val(val);
        return input;
    };

    dt.getDgValue = function() {
        if (val.length > 10 ) {
            return val.slice(0,10) + ' ...'
        } else {
            return val;
        }
    };

    return dt;
};

cs.datatype.number = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        var input = $('<input>', {type:'number', name:key})
          .val(val)
        return input;
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.datetime = function(val, feature, key) {
    // https://github.com/datejs/Datejs
    var datime =  Date.parse(val);
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        var wrapper = $('<span>',{});
        $('<span>',{class: 'cs-datatype-fd-datetime-date'})
          .html(datime.toString('yyyy/M/d'))
          .appendTo(wrapper);
        $('<span>',{class: 'cs-datatype-fd-datetime-time'})
          .html(datime.toString('HH:mm'))
          .appendTo(wrapper);
        return wrapper;
    };

    dt.getEditValue = function() {
        var date = val || (new Date()).toString('yyyy-MM-ddTHH:mm:ss');

        var input = $('<input>', {type:'datetime-local', name:key})
          .val(date);


        return input;
    };

    dt.getDgValue = function() {
        return datime.toString('yyyy/M/d')
    };

    return dt;
};

cs.datatype.media = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {

        if (val == null) {
            return cs.datatype.empty().getFdValue();
        }
        var wrapper = $('<div>',{class: 'cs-datatype-fd-media'});
        function createMedia(item) {
            var anchor = $('<a>',{href: item, target:'_blank',class: 'cs-datatype-fd-media-item'})
              .on('click', function (evt) { evt.stopPropagation() })
              .appendTo(wrapper);

            $('<img>',{src: item,class: 'cs-datatype-fd-media-item-image'})
              .appendTo(anchor);

        }
        val.forEach(createMedia);
        return wrapper;
    };

    dt.getEditValue = function() {
        return null;
    };

    dt.getDgValue = function() {

        if (val == null) {
            return cs.datatype.empty().getDgValue();
        }

        var wrapper = $('<div>',{class: 'cs-datatype-media'});
        function createMedia(item) {
            var anchor = $('<a>',{href: item, target:'_blank',class: 'cs-datatype-dg-media-item'})
              .on('click', function (evt) { evt.stopPropagation() })
              .appendTo(wrapper);

            $('<span>',{class: 'fa fa-picture-o'})
              .appendTo(anchor);

        }
        val.forEach(createMedia);
        return wrapper;
    };

    return dt;
};

cs.datatype.geometry = function(val, feature, key) {
    var dt = {};

    var goTo = function (evt) {
        evt.stopPropagation();
        cs.feature.zoom2feature(feature, 15, cs.datagrid.width);
    };

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {

        var loc = $('<span>',{class: 'cs-datatype-geom-fd-loc'});
        var lon = val.lon.toFixed(4);
        var lat = val.lat.toFixed(4);
        $('<a>',{title : lon + ', '+ lat})
          .html(lon + ', ' + lat)
          .on('click', goTo)
          .appendTo(loc);
        return loc;
    };

    dt.getEditValue = function() {
        return null;
    };

    dt.getDgValue = function() {
        var loc = $('<span>',{class: 'fa fa-map cs-datatype-geom-dg'})
          .on('click', goTo);
        return loc;
    };

    return dt;
};

cs.datatype.priority = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        var sel = $('<select>', {name:key});

        var rOpt = function (priority) {
            $('<option>',{value:priority, name:priority})
              .html(priority)
              .attr('selected',val == priority)
              .appendTo(sel)


        };

        if (cs.config_.hasOwnProperty('priorities')) {
            cs.config_.priorities.forEach(rOpt);
        }

        return sel
    };


    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.user = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        return null;
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.status = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        var sel = $('<select>', {name: key});

        var rOpt = function (status) {
            $('<option>',{value:status,name:status})
              .html(status)
              .attr('selected',val == status)
              .appendTo(sel)
        };

        if (cs.config_.hasOwnProperty('statuses')) {
            cs.config_.statuses.forEach(rOpt);
        }

        return sel
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.tags = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        var sel = $('<select>', {name: key});

        var rOpt = function (status) {
            $('<option>',{value:status,name:status})
              .attr('selected',val == status)
              .html(status)
              .appendTo(sel)
        };

        if (cs.config_.hasOwnProperty('tags')) {
            cs.config_.tags.forEach(rOpt);
        } else {
            return null;
        }

        return sel;
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.id = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getEditValue = function() {
        return null;
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.empty = function(val, feature, key) {
    var dt = {};

    dt.getValue = function() {
        return null;
    };

    dt.getFdValue = function() {
        return '--';
    };

    dt.getEditValue = function() {
        return null;
    };

    dt.getDgValue = function() {
        return '--';
    };
    
    return dt;
};