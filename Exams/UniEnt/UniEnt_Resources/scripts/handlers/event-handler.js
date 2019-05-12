handlers.getAllEvents = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    console.log(ctx);
    eventService.getAllEvents()
        .then(function (res) {
            let userId = sessionStorage.getItem('id');
            let events = res;

            events.forEach((event) => event.isCreator = event._acl.creator === userId);

            ctx.events = events;

            ctx.loadPartials({
                    header: '../templates/common/header.hbs',
                    footer: '../templates/common/footer.hbs',
                    event: '../templates/event/event.hbs'
                })
                .then(function () {
                    this.partial('../templates/event/allEventsPage.hbs');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
        });
}

handlers.getUserProfile = function(ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem("username");

     eventService.getAllEvents()
         .then(function (res) {
             let userId = sessionStorage.getItem('id');
             let events = res;
             ctx.eventsCount = 0;
             events.forEach((event) => event.isCreator = event._acl.creator === userId);
            for(let event of events){
                if(event.isCreator){
                     ctx.eventsCount += 1;
                }
            }
            ctx.events = events;
            console.log(ctx)
             ctx.loadPartials({
                     header: '../templates/common/header.hbs',
                     footer: '../templates/common/footer.hbs',
                     event: '../templates/event/event.hbs'
                 })
                 .then(function () {
                     this.partial('../templates/event/userProfilePage.hbs');
                 })
                 .catch(function (error) {
                     notifications.handleError(error);
                 })
         });
}

handlers.getCreateEvent = function(ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem("username");

    ctx.loadPartials({
        header: "../templates/common/header.hbs",
        footer: "../templates/common/footer.hbs"
    })
        .then(function() {
            this.partial("../templates/event/createEventPage.hbs");
        })
        .catch(function(error) {
            notification.handleError(error);
        });
};

handlers.createEvent = function(ctx) {
    console.log(ctx);
    let organizer = sessionStorage.getItem("username");
    let data = {
        ...ctx.params,
        peopleInterestedIn: 0,
        organizer
    };
    if (data.name.length < 6) {
        notifications.showError(
            "The name should be at least 6 characters long!"
        );
    } else if (data.description.length < 10) {
        notifications.showError(
            "Description should be at least 10 characters long!"
        );
    } else if (!data.imageURL.startsWith("https://")) {
        notifications.showError(
            'The image should start with "http://" or "https://"'
        );
    } else {
        eventService
            .createEvent(data)
            .then(function(res) {
                notifications.showInfo("Event created successfully.");
                ctx.redirect("#/allEvents");
            })
            .catch(function(error) {
                notifications.handleError(error);
            });
    }
};

handlers.getEventDetails = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    let id = ctx.params.id;

    eventService.getAEvent(id)
        .then(function (res) {
            let userId = sessionStorage.getItem('id');

            ctx.name = res.name;
            ctx.description = res.description;
            ctx.dateTime = res.dateTime
            ctx.imageURL = res.imageURL;
            ctx.likes = res.likes;
            ctx.peopleInterestedIn = res.peopleInterestedIn;
            ctx.organizer = res.organizer;

            ctx.isCreator = res._acl.creator === userId;
            ctx.id = id;

            ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                })
                .then(function () {

                    this.partial('./templates/event/eventDetails.hbs');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
        })
        .catch(function (error) {
            notifications.handleError(error);
        })
};  

handlers.getEditMyEventDetails = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    let id = ctx.params.id;

    eventService.getAEvent(id)
        .then(function (res) {
            // let userId = sessionStorage.getItem('id');

            ctx.name = res.name;
            ctx.description = res.description;
            ctx.dateTime = res.dateTime
            ctx.imageURL = res.imageURL;
            ctx.likes = res.likes;
            ctx.peopleInterestedIn = res.peopleInterestedIn;
            ctx.organizer = res.organizer;

            // ctx.isCreator = res._acl.creator === userId;
            ctx.id = id;

            ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                })
                .then(function () {

                    this.partial('./templates/event/editEventDetails.hbs');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
        })
        .catch(function (error) {
            notifications.handleError(error);
        })
};

handlers.editMyEvent = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;
    // console.log(ctx)
  
            let data = {};
             data.name = ctx.params.name;
             data.description = ctx.params.description;
             data.dateTime = ctx.params.dateTime
             data.imageURL = ctx.params.imageURL;
             data.likes = ctx.params.likes;
             data.peopleInterestedIn = ctx.params.peopleInterestedIn;
             data.organizer = ctx.params.organizer;

            eventService.editMyEvent(id, data)
                .then(function () {
                    notifications.showInfo('Event edited successfully!');

                    ctx.redirect('#/allEvents');
                })
                .catch(function (error) {
                    notifications.handleError(error);
                })
};

handlers.joinEvent = function (ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;
    eventService.getAEvent(id)
        .then(function (res) {
            let event = res;

            let newPeopleInterestedIn = Number(event.peopleInterestedIn) + 1;
            event.peopleInterestedIn = newPeopleInterestedIn;
            
            eventService.joinEvent(id, event)
                .then(function () {
                    notifications.showInfo('You join the event successfully.');
                    ctx.redirect('#/allEvents');
                })
                .catch(function (error) {
                    notifications.showError(error);
                })
        });
};

handlers.deleteEvent = function (ctx) {
    let id = ctx.params.id;

    eventService.deleteEvent(id)
        .then(function () {
            notifications.showInfo('Event closed successfully!');
            ctx.redirect('#/allEvents');
        })
        .catch(function (error) {
            notifications.handleError(error);
        })

};



