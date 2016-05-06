var cs = cs || {};

cs.user = {};

cs.user.reset = function() {
  cs.user.isAuthorized = false;

  cs.user.name = null;

  cs.user.password = null;

  cs.user.email = null;

  cs.user.role = null;

  cs.user.organization = null;

  cs.user.userProfile = $();
  cs.user.userProfile.empty();

  cs.user.loginForm = $();
  cs.user.loginForm.empty();
}

cs.user.reset();

cs.user.authenticate = function(username, password) {

  var loginSucces = function(evtData) {
    cs.user.name = username;
    cs.user.password = password;
    cs.user.role = evtData.user.role[0];
    cs.user.organization = evtData.user.organization;
    cs.user.email = evtData.user.email;
    cs.user.isAuthorized = true;
    cs.user.renderUserProfile();
  };

  var loginErr = function(evtData) {
    cs.user.loginForm.empty();
    cs.user.reset();
    cs.user.logOut();
    alert('Login failed.');
  };

  var data = {
    "user": {
      "id" : username,
      "password" : password
    }
  };

  var authPromise = gsc.cs.login(data)
    .done(loginSucces)
    .fail(loginErr);


};

cs.user.logOut = function(){
  cs.user.userProfile.hide();
  cs.user.reset();
  cs.user.renderLoginForm(cs.user.wrapper);
};

cs.user.renderLoginForm = function(querySelector) {


  cs.user.wrapper = querySelector;

  cs.user.userProfile.hide();
  cs.user.loginForm.empty();

  cs.user.loginForm = $('<form>',{class:'cs-userprofile-form form-group'})
    .appendTo($(querySelector));

  var fieldset = $('<fielset>')
    .appendTo(cs.user.loginForm);

  $('<legend>')
    .html('Login:')
    .appendTo(fieldset);
  $('<div>')
    .html('Username:<br>')
    .appendTo(fieldset);

  var username = $('<input>', {type:'text', name:'username', placeholder:'username', class:'form-control'})
    .appendTo(fieldset);

  $('<div>')
    .html('<br>')
    .appendTo(fieldset);


  $('<div>')
    .html('Password:<br>')
    .appendTo(fieldset);

  var password = $('<input>', {type:'password', name:'password', placeholder:'password', class:'form-control'})
    .appendTo(fieldset);
  $('<div>')
    .html('<br>')
    .appendTo(fieldset);

  $('<button>', {type:'submit', class: "btn btn-md btn-primary pull-right"})
    .html('log in')
    .on('click',function(evt){
      cs.user.authenticate(username.val(),password.val());
      evt.preventDefault();
    })
    .appendTo(fieldset);


};

cs.user.renderUserProfile = function() {

  cs.user.userProfile.empty();
  cs.user.loginForm.hide();

  cs.user.userProfile = $('<div>',{class:''})
    .appendTo(cs.user.wrapper);

  var fieldset = $('<fielset>')
    .appendTo(cs.user.userProfile);


  $('<legend>')
    .html('Logged as:')
    .appendTo(fieldset);

  $('<div>')
    .html('Username<br>')
    .appendTo(fieldset);
  $('<span>')
    .html(cs.user.name)
    .appendTo(fieldset);

  $('<div>')
    .html('Email<br>')
    .appendTo(fieldset);
  $('<span>')
    .html(cs.user.email)
    .appendTo(fieldset);

  $('<div>')
    .html('Role<br>')
    .appendTo(fieldset);
  $('<span>')
    .html(cs.user.role)
    .appendTo(fieldset);

  $('<div>')
    .html('Organization<br>')
    .appendTo(fieldset);
  $('<span>')
    .html(cs.user.organization + '<br><br>')
    .appendTo(fieldset);

  $('<button>')
    .html('Log out')
    .on('click',cs.user.logOut)
    .appendTo(fieldset);


};