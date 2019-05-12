function attachEvents(){
    let container = $('#venue-info');
    $('#getVenues').on('click', loadVenues);
    const appKey = 'kid_BJ_Ke8hZg';
    const baseUrl = `https://baas.kinvey.com/`;
    const purchaseUrl = baseUrl + `rpc/${appKey}/custom/purchase`;

    const username = "guest";
    const password = "pass";
    const base64Auth = btoa(username + ":" + password);
    const authHeaders = {
        Authorization: "Basic " + base64Auth,
        "Content-Type": "application/json"
    };

    let venues = [];
    function loadVenues(){
        let date = $('#venueDate').val();
        console.log(date);
        $.ajax({
            method:'POST',
            url: baseUrl + `rpc/${appKey}/custom/` + `calendar?query=${date}`,
            headers: authHeaders
        })
            .then(getVenuesIds)
            .catch(handleError)
    }

    function getVenuesIds(venuesIds) {
       container.empty();
       for (let id of venuesIds){
           $.ajax({
               method: 'GET',
               url: baseUrl + `appdata/${appKey}/venues/` + `${id}`,
               headers: authHeaders
           })
               .then(displayCurrentVenue)
               .catch(handleError)
       }
    }

    function displayCurrentVenue(venue){
        let select = $('<select>').addClass('quantity');
        for (let i = 1; i <= 5; i++) {
            $('<option>').text(i).val(i)
                .appendTo(select);
        }
        let table = $('<table>').append($('<tbody>')
            .append($('<tr>')
                .append($('<th>').text('Ticket Price'))
                .append($('<th>').text('Quantity'))
                .append($('<th>').text('')))
            .append($('<tr>')
                .append($('<td>').addClass('venue-price').text(`${venue.price.toFixed(2)} lv`))
                .append($('<td>').append(select))
                .append($('<td>')
                    .append($('<input>').addClass('purchase')
                        .attr('type', 'button').val('Purchase')
                        .click(() => confirmPurchase(venue._id, venue.name, venue.price, select.val()))))));
        $('<div>').addClass('venue').attr('id', venue._id)
            .append($('<span>').addClass('venue-name')
                .append($('<input>').addClass('info')
                    .attr('type', 'button').attr('value', 'More info')
                    .click(showMoreInfo))
                .append(venue.name))
            .append($('<div>').addClass('venue-details').css('display', 'none')
                .append(table)
                .append($('<span>').addClass('head').text('Venue description'))
                .append($('<p>').addClass('description').text(venue.description))
                .append($('<p>').addClass('description').text(`Starting time: ${venue.startingHour}`)))
            .appendTo(container);      
    }

    function showMoreInfo(){
        let mainDiv = $(this).parent().parent();
        let divToShow = mainDiv.children()[1];
        console.log(divToShow);
        // $(divToShow).css('display', 'block');
        $(divToShow).show();
    }
    
    function confirmPurchase(venueId, venueName, price, quantity) {
        // console.log(quantity + ' x ' + price);
        container.empty();
        let cost = price * quantity;
        $('<span>').addClass('head').text('Confirmation purchase')
            .appendTo(container);
        $('<div>').addClass('purchase-info')
            .append($('<span>').text(venueName))
            .append($('<span>').text(`${quantity} x ${price.toFixed(2)}`))
            .append($('<span>').text(`Total: ${cost.toFixed(2)} lv`))
            .append($('<input>').attr('type', 'button').val('Confirm')
                .click(() => purchaseTickets(venueId, quantity)))
            .appendTo(container);
    }

    function purchaseTickets(venueId, quantity) {
        $.post({
            url: `${purchaseUrl}?venue=${venueId}&qty=${quantity}`,
            headers: authHeaders,
            contentType: 'application/json'
        })
            .then(printTicket)
            .catch(handleError);
    }

    function printTicket(ticket) {
        container.empty();
        container
            .text('You may print this page as your ticket')
            .append(ticket.html);
    }


    function handleError(error){
        let errorDiv = $('<div>').text('Error')
            .prependTo($('body'));
        setTimeout(function () {
            errorDiv.fadeOut(function () {
                errorDiv.remove();
            });
        }, 2000);
    }
}

