function attachEvents() {
    $("#refresh").on("click", loadMessages);
    $("#submit").on("click", createMessage);
    const baseUrl = "https://baas.kinvey.com/";
    const appKey = "kid_SJ5nbqPdN/";
    const appData = "messages";
    const authToken = "bfbbc12b-e806-42b6-9649-e11d48c1fb78.jPNHLEdU7G2Rd3uuK++jWk0mWnnex7tM91H2KRV7/ns=";
    const authHeaders = {
        "Authorization": `Kinvey ${authToken}`,
        // "Content-Type": "application/json"
    }

    // const username = "guest";
    // const password = "guest";
    // const base64Auth = btoa(username + ":" + password);
    // const authHeaders = {
    //     Authorization: "Basic " + base64Auth,
    //     // "Content-Type": "application/json"
    // };

    function loadMessages() {
        console.log(baseUrl + "appdata/" + appKey + appData);
        $.ajax({
            method: "GET",
            url: baseUrl + "appdata/" + appKey + appData,
            headers: authHeaders
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
                url: baseUrl + "appdata/" + appKey + appData,
                data: JSON.stringify(newComment),
                headers: authHeaders
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
