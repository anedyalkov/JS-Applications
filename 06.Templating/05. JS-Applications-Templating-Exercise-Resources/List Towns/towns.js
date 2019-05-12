function attachEvents() {
    $("#btnLoadTowns").on("click", function () {
        let townsData = {};
        let townsArr = ($("#towns").val()).split(", ").map(e => {
            return { name: e }
        });
        townsData.towns = townsArr;

        let source = $("#towns-template").html();
        let template = Handlebars.compile(source);

        let result = template(townsData);
        $("#root").html(result);
    });
}