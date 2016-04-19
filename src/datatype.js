var cs = cs || {};


cs.datatype = {};

cs.datatype.feature_ = {};

cs.datatype.constructor = function(feature, key, property){
    cs.datatype.feature_ = feature;
    return  cs.datatype.types_[cs.evSchema[key]](property);
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


cs.datatype.desc = function(val){
    var dt = {};

    dt.getValue = function() {
        return val;
    };


    dt.getFdValue = function() {
        return val
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
        var wrapper = $('<span>',{});
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

    dt.getDgValue = function() {

        if (val == null) {
            return cs.datatype.empty().getDdValue();
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

cs.datatype.geometry = function(val) {
    var dt = {};

    var goTo = function (evt) {
        evt.stopPropagation();
        cs.zoom2feature(cs.datatype.feature_);
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

    dt.getDgValue = function() {
        var loc = $('<span>',{class: 'fa fa-map cs-datatype-geom-dg'})
            .on('click', goTo)

        return loc;
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

cs.datatype.comments = function(val) {
    var dt = {};

    var val = val || [];

    dt.getValue = function() {
        return val;
    };

    dt.getFdValue = function() {
        var wrapper = $('<div>', {class:'cs-datatype-comment-wrapper'});

        var forEachComment = function(comment) {

            var wrapperItem = $('<div>', {class:'cs-datatype-comment-item'})
                .appendTo(wrapper);
            $('<span>', {class:'cs-datatype-comment-user'})
                .html(comment.user)
                .appendTo(wrapperItem);
            $('<span>', {class:'cs-datatype-comment-text'})
                .html(comment.text)
                .appendTo(wrapperItem);
        };

        val.forEach(forEachComment);

        return wrapper;
    };

    dt.getDgValue = function() {
        var count = val.length;
        return count;
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
    'comments': cs.datatype.comments,
    'user': cs.datatype.user,
    'tags': cs.datatype.tags,
    'geometry': cs.datatype.geometry,
    'id': cs.datatype.id,
    'desc': cs.datatype.desc
};
