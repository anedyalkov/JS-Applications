handlers.getRegister = function (ctx) {
  ctx.loadPartials({
    header: '../templates/common/header.hbs',
    footer: '../templates/common/footer.hbs',
    registerForm: "../templates/register/registerForm.hbs"
  }).then(function () {
    this.partial('../templates/register/registerPage.hbs');
  }).catch(function (err) {
    notify.handleError(err);
  });
}

handlers.getLogin = function (ctx) {
  ctx.loadPartials({
    header: '../templates/common/header.hbs',
    footer: '../templates/common/footer.hbs',
    loginForm:'../templates/login/loginForm.hbs'
  }).then(function () {
    this.partial('../templates/login/loginPage.hbs');
  }).catch(function (err) {
    notify.handleError(err);
  });
}

handlers.registerUser = function (ctx) {
  let username = ctx.params.username;
  let password = ctx.params.password;
  // let repeatPassword = ctx.params.repeatPassword;
  // if (repeatPassword !== password) {
  //   notifications.showError('Passwords must match');
  //   return;
  // }
  userService.register(username, password).then((res) => {
    userService.saveSession(res);
    notify.showInfo('User registered successfully');
    ctx.redirect('#/home');
  }).catch(function (err) {
    notify.showError(err.responseJSON.description);
  });
}

handlers.loginUser = function (ctx) {
  console.log(ctx)
  let username = ctx.params.username;
  let password = ctx.params.password;
  userService.login(username, password).then((res) => {
    console.log(res);
    userService.saveSession(res);
    notify.showInfo('User logged in successfully');
    ctx.redirect('#/home');
  }).catch(function (err) {
    notify.showError(err.responseJSON.description);
  });
}

handlers.logoutUser = function (ctx) {
  userService.logout().then(() => {
    sessionStorage.clear();
    notify.showInfo('User logged out successfully');
    ctx.redirect('#/home');
  })
}
