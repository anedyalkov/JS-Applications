$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', (ctx) => {
            ctx.swap('<h2>Home Page</h2>');
        });
        this.get('#/about', (ctx) => {
            ctx.swap('<h2>About Page</h2>');
        });
        this.get('#/contact', (ctx) => {
            ctx.swap('<h2>Contact Page</h2>');
        });
        // this.get('#/book/:bookId', (ctx) => {
        //     let bookId = ctx.params.bookId; 
        //     console.log(bookId);
        // });

        this.get('#/login', (ctx) => {
            ctx.partial('loginForm.hbs')
        });

        this.post('#/login', (ctx) => {
            console.log(ctx.params.user);
            console.log(ctx.params.pass);
        });

        this.get('#/hello/:name',(ctx) => {
            ctx.title = "Hello!";
            ctx.name = ctx.params.name;
            ctx.partial('templates/greeting.hbs')
        })

    });

    $(() => {
        app.run();
    });
})




