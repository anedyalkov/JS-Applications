function attachEvents() {
    $("#refresh").on("click", loadMessages);
    $("#submit").on("click", createMessage);
    let url = "https://messenger-31cd3.firebaseio.com/.json";

    function loadMessages() {
        $.ajax({
            method: "GET",
            url
        })
            .then(displayMessages)
            .catch(handleError);
    }

    function displayMessages(data) {
        let content = "";
        for (let key in data) {
            content += `${data[key].author}: ${data[key].content}\n`;
        }
        $("#messages").text(content);
    }

    function createMessage() {
        if ($("#author").val() && $("#content").val()) {
            let newComment = {
                author: $("#author").val(),
                content: $("#content").val(),
                timestamp: Date.now()
            };

            $.ajax({
                method: "POST",
                url,
                data: JSON.stringify(newComment)
            })
            .then(function() {
                    $("#author").val("");
                    $("#content").val("");
                })
            .catch(handleError);
        }
    }

    function handleError(err) {
        $("#messages").text("Error");
    }
}
