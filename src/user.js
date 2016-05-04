var cs = cs || {};

cs.user = {};

cs.user.isAuthorized = false;

cs.user.name = null;

cs.user.password = null;

cs.user.email = null;

cs.user.role = null;

cs.user.organization = null;

cs.user.authenticate = function(username, password) {
  //TODO create authorization request ...
  cs.user.name = username;
  cs.user.password = password;
  cs.user.role = 'admin';
  cs.user.isAuthorized = true;
  console.log('user: ',username,' is authenticated, using password: ',password);
};

cs.user.renderLoginForm = function(querySelector) {
  var loginForm = $('<form>',{class:'cs-userprofile-form form-group'})
    .appendTo($(querySelector));
  var fieldset = $('<fielset>').appendTo(loginForm);
  $('<legend>')
    .html('Login:')
    .appendTo(fieldset);
  $('<div>')
    .html('Username or email:<br>')
    .appendTo(fieldset);

  var username = $('<input>', {type:'text', name:'username', placeholder:'username', class:'form-control'})
    .appendTo(fieldset);

  $('<div>')
    .html('Password:<br>')
    .appendTo(fieldset);

  var password = $('<input>', {type:'password', name:'password', placeholder:'password', class:'form-control'})
    .appendTo(fieldset);
  $('<div>')
    .html('<br>')
    .appendTo(fieldset);

  $('<button>', {type:'submit', class: "btn btn-lg btn-primary btn-block"})
    .html('log in')
    .on('click',function(evt){
      cs.user.authenticate(username.val(),password.val());
      evt.preventDefault();
    })
    .appendTo(fieldset);
};