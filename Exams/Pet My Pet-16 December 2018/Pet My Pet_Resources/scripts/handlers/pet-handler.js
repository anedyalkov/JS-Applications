handlers.getAllPets = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    console.log(ctx);
    petService.getAllPets()
        .then(function (res) {
            let userId = sessionStorage.getItem('id');
            let pets = res;

            pets.forEach((pet) => pet.isCreator = pet._acl.creator === userId);

            ctx.pets = pets;

            ctx.loadPartials({
                    header: '../templates/common/header.hbs',
                    footer: '../templates/common/footer.hbs',
                    otherPet: '../templates/pet/otherPet.hbs'
                })
                .then(function () {
                    this.partial('../templates/pet/dashboard.hbs');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
        });
}

handlers.getPetDetails = function (ctx) {
       ctx.isAuth = userService.isAuth();
       ctx.username = sessionStorage.getItem('username');

       let id = ctx.params.id;
       petService.getAPet(id)
           .then(function (res) {
            //    let userId = sessionStorage.getItem('id');

               ctx.name = res.name;
               ctx.description = res.description;
               ctx.imageURL = res.imageURL;
               ctx.likes = res.likes;
               ctx.id = id;

            //    ctx.isCreator = res._acl.creator === userId;
             
               ctx.loadPartials({
                       header: './templates/common/header.hbs',
                       footer: './templates/common/footer.hbs'
                   })
                   .then(function () {
                       this.partial('./templates/pet/detailsOtherPet.hbs');
                   })
                   .catch(function (error) {
                       notifications.handleError(error);
                   })
           })
           .catch(function (error) {
               notifications.handleError(error);
           })
}

handlers.getCreatePet = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: '../templates/common/header.hbs',
        footer: '../templates/common/footer.hbs',
    }).then(function () {
        this.partial('../templates/pet/createPetPage.hbs');
    }).catch(function (error) {
        notification.handleError(error);
    })
}

handlers.getMyPets = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    petService.getMyPets()
        .then(function (res) {
            let userId = sessionStorage.getItem('id');
            let pets = res;
            pets.forEach((pet) => pet.isCreator = pet._acl.creator === userId);

            ctx.pets = pets
            ctx.loadPartials({
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                myPet: '../templates/pet/myPet.hbs'
            }).then(function () {
                this.partial('../templates/pet/myPetsPage.hbs');
            }).catch(function (error) {
                notifications.handleError(error);
            })
        })
}


handlers.createPet = function (ctx) {
    console.log(ctx);
    let data = {...ctx.params,
        likes: 0
    };
        petService.createPet(data)
            .then(function (res) {
                notifications.showInfo('Pet created.');
                ctx.redirect('#/home');
            })
            .catch(function (error) {
                notifications.handleError(error);
            });
};

handlers.likePet = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;
    petService.getAPet(id)
        .then(function (res) {
            let pet = res;

            let newLikes = Number(pet.likes) + 1;
            pet.likes = newLikes;

            petService.likePet(id, pet)
                .then(function () {
                    notifications.showInfo('Liked!');
                    ctx.redirect('#/dashboard');
                })
                .catch(function (error) {
                    notifications.showError(error);
                })
        });
};

handlers.getMyPetDetails = function (ctx) {

     ctx.isAuth = userService.isAuth();
     ctx.username = sessionStorage.getItem('username');

     let id = ctx.params.id;
     petService.getAPet(id)
        .then(function (res) {
          petService.getAPet(id)
              .then(function (res) {
                  //    let userId = sessionStorage.getItem('id');

                  ctx.name = res.name;
                  ctx.description = res.description;
                  ctx.imageURL = res.imageURL;
                  ctx.likes = res.likes;
                  ctx.id = id;

                  //    ctx.isCreator = res._acl.creator === userId;

                  ctx.loadPartials({
                          header: './templates/common/header.hbs',
                          footer: './templates/common/footer.hbs'
                      })
                      .then(function () {
                          this.partial('./templates/pet/detailsMyPet.hbs');
                      })
                      .catch(function (error) {
                          notifications.handleError(error);
                      })
              })
              .catch(function (error) {
                  notifications.handleError(error);
              })
        });
};

handlers.editMyPetInfo = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;
    console.log(ctx)
    petService.getAPet(id)
        .then(function (res) {
            let data = { ...res};

            data.description = ctx.params.description;

            petService.editMyPetInfo(id, data)
                .then(function () {
                    notifications.showInfo('Updated successfully!');

                    ctx.redirect('#/myPets');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
        });
};

handlers.getDeleteDetails = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    let id = ctx.params.id;
    console.log(id);
    petService.getAPet(id)
        .then(function (res) {
            //    let userId = sessionStorage.getItem('id');

            ctx.name = res.name;
            ctx.description = res.description;
            ctx.imageURL = res.imageURL;
            ctx.likes = res.likes;
            ctx.id = id;

            //    ctx.isCreator = res._acl.creator === userId;

            ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                })
                .then(function () {
                    this.partial('./templates/pet/deleteMyPet.hbs');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
        })
        .catch(function (error) {
            notifications.handleError(error);
        })
}

handlers.deletePet = function (ctx) {
    let id = ctx.params.id;

    petService.deletePet(id)
        .then(function () {
            notifications.showInfo('Pet removed successfully!');
            ctx.redirect('#/dashboard');
        })
        .catch(function (error) {
            notify.handleError(error);
        })

};