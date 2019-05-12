function attachEvents(){
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);
    const baseUrl = "https://phonebook-357dc.firebaseio.com/phonebook";


    function loadContacts() {
        $.ajax({
            method: "GET",
            url: baseUrl + ".json",
            success: displayContacts,
            error: displayError
        });
    }

    function createContact() {
        $("#phonebook").empty();
        if ($("#person").val() && $("#phone").val()) {
            let newContact = {
                person: $("#person").val(),
                phone: $("#phone").val()
            };
            let postRequest = {
                method: "POST",
                url: baseUrl + ".json",
                data: JSON.stringify(newContact)
            };
            $.ajax(postRequest)
                .then(function () {
                    $("#person").val("");
                    $("#phone").val("");
                    loadContacts();
                })
                .catch(displayError);
        }
    }

    function deleteContact(key) {
        let deleteRequest = {
            method: "DELETE",
            url: baseUrl + "/" + key + ".json"
        };
        $.ajax(deleteRequest)
            .then(loadContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        $('#phonebook').empty();
        let keys = Object.keys(contacts);
        // keys.sort((a, b) => {
        //     return contacts[a].name.localeCompare(contacts[b].name);
        // })
        for (let key of keys) {
            let contact = contacts[key];
            if (contact.person) {
                let contactText = `${contact.person} : ${contact.phone} `;
                $('<li>').text(contactText)
                    .append($('<button>').text('[Delete]')
                        .click(function () {
                            deleteContact(key)
                        }))
                    .appendTo($('#phonebook'));
            }
        }
    }

    function displayError(error) {
        $('#phonebook').append($("<li>").text('Error'));
    }
}