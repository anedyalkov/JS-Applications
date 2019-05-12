$(() => {
    //   const allCats = $("#allCats");
    //   const codes = {};
    renderCatTemplate();

    function renderCatTemplate() {
        //  let source = $("#cat-template").html();
        //  let template = Handlebars.compile(source);
        //  codes.cats = window.cats;
        //  allCats.html(template(codes));

        //  let showMoreBtn = $(".btn-primary");
        //  console.log(codes.cats[0].imageLocation)
        //  console.log("xax")

        //  showMoreBtn.on("click", function () {
        //      if ($(this).text() === "Show status code") {
        //          $(this).text("Hide status code");
        //      } else {
        //          $(this).text("Show status code");
        //      }
        //      $(this).next().toggle();
        //  });
        let template = $("#cat-template").html();
        let compiledTemplate = Handlebars.compile(template);
        let renderedResult = compiledTemplate({
            cats
        });

        let catsElement = $("#allCats");
        catsElement.html(renderedResult);

        $("button").on("click", function (e) {
            let target = $(e.target);
            let idDiv = target.next();
            if (idDiv.attr("style")) {
                target.text("Hide status code");
                idDiv.removeAttr("style");
            } else {
                target.text("Show status code");
                idDiv.attr("style", "display: none");
            }
        });
    }

})
