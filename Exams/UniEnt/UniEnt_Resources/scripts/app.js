const handlers = {}

$(() => {
  const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');
    // home page routes
    this.get('/index.html', handlers.getHome);
    // this.get('/', handlers.getHome);
    this.get('#/home', handlers.getHome);

    // user routes
    this.get('#/register', handlers.getRegister);
    this.get('#/login', handlers.getLogin);

    this.post('#/register', handlers.registerUser);
    this.post('#/login', handlers.loginUser);
    this.get('#/logout', handlers.logoutUser);
    // event routes
    this.get('#/allEvents', handlers.getAllEvents);
    this.get('#/userProfile', handlers.getUserProfile);
    this.get('#/createEvent', handlers.getCreateEvent);
    this.get('#/details/:id', handlers.getEventDetails);
    this.get('#/editMyEvent/:id',handlers.getEditMyEventDetails);
    this.get('#/joinEvent/:id', handlers.joinEvent);
    this.get('#/delete/:id', handlers.deleteEvent);

    this.post('#/createEvent', handlers.createEvent);
    this.post('#/editMyEvent/:id',handlers.editMyEvent)
    
  });
  app.run();
});