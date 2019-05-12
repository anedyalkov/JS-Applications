$(() => {
    let monkeysElement = $(".monkeys");

    Array.from(monkeys).forEach((monkey) => {
       
        let source =
            "<div class='monkey'>" +
            "<h2>" + monkey.name + "</h2>" +
            "<img src='" + monkey.image + "'/>" +
            "<button>Info</button>" +
            "<p style='display:none' id='" + monkey.id + "'>" +
            monkey.info +
            "</p>" +
            "</div>";

        Handlebars.registerPartial("monkey", source);

        let template = $("#monkey-template").html();
        let compiledTemplate = Handlebars.compile(template);
        let result = compiledTemplate(monkey);
        monkeysElement.append(result);
    });

    $("button").on("click", function (e) {
        let infoBtn = $(e.target);
        let infoDiv = infoBtn.next();
        if (infoDiv.css("display") !== "none") {
            infoDiv.hide();
        } else {
            infoDiv.show();
        }
    });
})