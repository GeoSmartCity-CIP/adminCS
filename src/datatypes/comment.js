
cs.datatype.comments = function(val, feature) {
  var dt = {};

  cs.datatype.comments.feature_ =  feature;
  var val = val || [];

  dt.getValue = function() {
    return val;
  };

  dt.getFdValue = function() {
    var wrapper =  cs.datatype.comments.wrapper = $('<div>', {class:'cs-datatype-comment-wrapper'});

    cs.datatype.comments.itemWrapper = $('<div>', {class:'cs-datatype-comment-itemwrapper'})
      .appendTo(wrapper);

    cs.datatype.comments.noComment = $('<div>')
      .html('There are no comments yet.')
      .appendTo(cs.datatype.comments.itemWrapper);

    if (val.length>0) {
      val.forEach(cs.datatype.comments.renderComment);
      cs.datatype.comments.noComment.hide();
    }
    cs.datatype.comments.renderAddComment();

    return wrapper;
  };

  dt.getEditValue = function() {
    return null;
  };

  dt.getDgValue = function() {
    var count = val.length;
    return count;
  };

  return dt;
};

cs.datatype.comments.renderAddComment = function() {
    var form = $('<form>', {class:'cs-datatype-comment-add form', role: 'form'})
    .appendTo(cs.datatype.comments.wrapper);

  var formgroup = $('<div>', {class:'form-group'})
    .appendTo(form);

  var input = $('<input>', {class:'form-control', type: 'text', placeholder: 'Your commnent ...'})
    .appendTo(formgroup);

  var formgroup2 = $('<div>', {class:'form-group'})
    .appendTo(form);

  var onClick = function(evt){

    evt.preventDefault();
    evt.stopPropagation();

    var value = input.val();

    if (!value) return;

      var commt = {
      datetime : (new Date()).toString('yyyy-MM-ddTHH:mm:ss'),
      text: input.val(),
      user: {id:cs.user.name, password:cs.user.name}
    };


    var successFn = function(evt){
      cs.datatype.comments.noComment.hide();
      commt.user = cs.user.name || 'user';
      input.val('');
      cs.datatype.comments.renderComment(commt);

      if (cs.datatype.comments.feature_.get('comments')){
        cs.datatype.comments.feature_.get('comments').push(commt);
      } else {
        cs.datatype.comments.feature_.set('comments',[commt]);
      }
    };

    gsc.cs.eventComment(commt, cs.datatype.comments.feature_.get('id'))
      .done( successFn )
      .fail(function(evt){
        if (evt.statusText) {
          successFn(evt);
        }
      });

  };

  var button = $('<button>', {class:'btn btn-default pull-right'})
    .html('Add')
    .on('click', onClick)
    .appendTo(formgroup2);

};


cs.datatype.comments.renderComment = function(comment) {

  var wrapperItem = $('<div>', {class:'cs-datatype-comment-item'})
    .appendTo(cs.datatype.comments.itemWrapper);

  var ago = cs.datatype.comments.time_ago(Date.parse(comment.datetime));

  $('<p>', {class:'cs-datatype-comment-date pull-right'})
    .html('<small>'+ago+'</small>')
    .appendTo(wrapperItem);
  $('<h4>', {class:'cs-datatype-comment-user'})
    .html(comment.user)
    .appendTo(wrapperItem);
  $('<div>', {class:'cs-datatype-comment-text'})
    .html(comment.text)
    .appendTo(wrapperItem);
};



cs.datatype.comments.time_ago = function(time) {

  if (time == null) return;

  switch (typeof time) {
    case 'number': break;
    case 'string': time = +new Date(time); break;
    case 'object': if (time.constructor === Date) time = time.getTime(); break;
    default: time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago', list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0, format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
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