var cs = cs || {};


cs.datatype = {};


cs.datatype.constructor = function(key, property){
    return  cs.datatype.types_[cs.evSchema[key]](property)
};


cs.datatype.string = function(val){
    var dt = {};

    dt.getValue = function() {
        return val;
    };


    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.number = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.datetime = function(val){
    // https://github.com/datejs/Datejs
    var datime =  Date.parse(val);
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        var wrapper = $('<div>',{});
        $('<span>',{class: 'cs-datatype-fd-datetime-date'})
            .html(datime.toString('yyyy/M/d'))
            .appendTo(wrapper);
        $('<span>',{class: 'cs-datatype-fd-datetime-time'})
            .html(datime.toString('HH:mm'))
                .appendTo(wrapper);

        return wrapper;
    };

    dt.getDgValue = function() {
        return datime.toString('yyyy/M/d')
    };



    return dt;
};

cs.datatype.media = function(val)  {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
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

    dt.getDgValue = function() {
        var wrapper = $('<div>',{class: 'cs-datatype-media'});
        function createMedia(item) {
           var anchor = $('<a>',{href: item, target:'_blank',class: 'cs-datatype-media-item'})
               .on('click', function (evt) { evt.stopPropagation() })
               .appendTo(wrapper);

            $('<img>',{src:'images/camera.svg',class: 'cs-datatype-media-item-image'})
                .appendTo(anchor);

        }
        val.forEach(createMedia);
        return wrapper;
    };

    return dt;
};

cs.datatype.geometry = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.priority = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.user = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.status = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};

cs.datatype.tags = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.id = function(val) {
    var dt = {};

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        return val
    };

    dt.getDgValue = function() {
        return val
    };

    return dt;
};


cs.datatype.empty = function() {
    var dt = {};

    dt.getValue = function() {
        return null;
    };

    dt.getFdValue = function() {
        return '--';
    };

    dt.getDgValue = function() {
        return '--';
    };

    return dt;
};


cs.datatype.types_ = {
    'string': cs.datatype.string,
    'media': cs.datatype.media,
    'datetime': cs.datatype.datetime,
    'number': cs.datatype.number,
    'priority': cs.datatype.priority,
    'status': cs.datatype.status,
    'comment': cs.datatype.comment,
    'user': cs.datatype.user,
    'tags': cs.datatype.tags,
    'geometry': cs.datatype.geometry,
    'id': cs.datatype.id
};
