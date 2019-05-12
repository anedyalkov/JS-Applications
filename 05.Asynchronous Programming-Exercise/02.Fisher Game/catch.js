function attachEvents() {
    $('.load').on('click', loadCatches);
    $('.add').on('click', addCatch);
    const appKey = 'kid_B1u1PIq_V';
    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/biggestCatches`;

    const username = "guest";
    const password = "guest";
    const base64Auth = btoa(username + ":" + password);
    const authHeaders = {
        Authorization: "Basic " + base64Auth,
        "Content-Type": "application/json"
    };

    function loadCatches() {
        $.ajax({
                method: "GET",
                url: baseUrl,
                headers: authHeaders
            })
            .then(getCatches)
            .catch(handleError)
    }


    function addCatch() {
        let angler = $('#addForm .angler').val();
        let weight = Number($('#addForm .weight').val());
        let species = $('#addForm .species').val();
        let location = $('#addForm .location').val();
        let bait = $('#addForm .bait').val();
        let captureTime = Number($('#addForm .captureTime').val());

        let catchObj = {
            angler,
            weight,
            species,
            location,
            bait,
            captureTime
        }

        $.ajax({
                method: "POST",
                url: baseUrl,
                data: JSON.stringify(catchObj),
                headers: authHeaders
            })
            .then(loadCatches)
            .catch(handleError);

    }

    function getCatches(info) {
        $('#catches').empty();
        for (let obj of info) {
            let div = $("<div>").addClass("catch").attr("data-id", `${obj._id}`);
            div.append($("<label>Angler</label>")).append($("<input>").attr("type", "text").addClass("angler").val(`${obj.angler}`))
                .append($("<label>Weight</label>")).append($("<input>").attr("type", "number").addClass("weight").val(`${obj.weight}`))
                .append($("<label>Species</label>")).append($("<input>").attr("type", "text").addClass("species").val(`${obj.species}`))
                .append($("<label>Location</label>")).append($("<input>").attr("type", "text").addClass("location").val(`${obj.location}`))
                .append($("<label>Bait</label>")).append($("<input>").attr("type", "text").addClass("bait").val(`${obj.bait}`))
                .append($("<label>Capture Time</label>")).append($("<input>").attr("type", "number").addClass("captureTime").val(`${obj.captureTime}`));
            div.append($("<button>Update</button>").addClass("update").on("click", updateCatch))
                .append($("<button>Delete</button>").addClass("delete").on("click", deleteCatch));

            $('#catches').append(div);
        }
    }

    function updateCatch() {
        let element = $(this).parent();
        // let id = element.attr("data-id");
        let id = element.data("id");
        
        let angler = element.find(".angler").val();
        let weight = Number(element.find(".weight").val());
        let species = element.find(".species").val();
        let location = element.find(".location").val();
        let bait = element.find(".bait").val();
        let captureTime = Number(element.find(".captureTime").val());

        let body = {
            angler,
            weight,
            species,
            location,
            bait,
            captureTime
        }
        $.ajax({
                method: "PUT",
                url: baseUrl + '/' + id,
                headers: authHeaders,
                data: JSON.stringify(body)
            })
            .then(loadCatches)
            .catch(handleError);
    }

    function deleteCatch() {
        let element = $(this).parent();
        let id = element.attr("data-id");
        console.log(id)

        $.ajax({
                method: "DELETE",
                url: baseUrl + '/' + id,
                headers: authHeaders,
            })
            .then(loadCatches)
            .catch(handleError);
    }

    function handleError(err) {
         console.log(err)
    }
}