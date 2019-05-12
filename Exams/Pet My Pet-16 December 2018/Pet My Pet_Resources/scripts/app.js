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
    // pet routes
    this.get('#/dashboard', handlers.getAllPets);
    this.get('#/details/:id', handlers.getPetDetails);
    this.get('#/createPet', handlers.getCreatePet);
    this.get('#/myPets',handlers.getMyPets);
    this.get('#/like/:id', handlers.likePet);
    this.get('#/detailsMyPet/:id', handlers.getMyPetDetails);
    this.get('#/delete/:id', handlers.getDeleteDetails);

    this.post('#/createPet', handlers.createPet);
    this.post('#/editMyPetInfo/:id', handlers.editMyPetInfo);
    this.post('#/delete/:id',handlers.deletePet);
    // ADD YOUR ROUTES HERE
  });
  app.run();
});