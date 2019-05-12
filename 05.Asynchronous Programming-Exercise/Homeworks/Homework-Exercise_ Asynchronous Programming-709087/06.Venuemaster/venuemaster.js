function attachEvents() {

    const baseUrl = 'https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/';
    const kinveyUsername = "guest";
    const kinveyPassword = "pass";
    const base64auth = btoa(`${kinveyUsername}:${kinveyPassword}`);
    const authHeaders = {"Authorization": "Basic " + base64auth, "Content-type": "application/json"};

    const $infoDiv = $('#venue-info');

    let name;
    let id;
    let ticketsQuantity;

    $('#getVenues').on('click', getIds);

    async function getIds() {

        let date = $('#venueDate').val();

        try {

            let ids = await $.ajax({
                method: 'POST',
                url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`,
                headers: authHeaders
            });

            await getVenues(ids);

        } catch (e) {
            console.error(e.message);
        }
    }

    async function getVenues(ids) {

        let venues = [];

        for (let i = 0; i < ids.length; i++) {

            venues.push(await $.ajax({
                method: 'GET',
                url: `${baseUrl}venues/${ids[i]}`,
                headers: authHeaders
            }));
        }

        displayVenues(venues);
    }

    function displayVenues(venues) {

        $infoDiv.empty();

        for (const venue of venues) {

            let $mainDiv = $(`<div class="venue" id="${venue._id}">`);

            let $nameSpan = $(`<span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>`);

            $nameSpan.find('input').on('click', showMoreInfo);
            $mainDiv.append($nameSpan);

            let $div = $(`<div class="venue-details" style="display: none;">
    <table>
      <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
      <tr>
        <td class="venue-price">${venue.price} lv</td>
        <td><select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></td>
        <td><input class="purchase" type="button" value="Purchase"></td>
      </tr>
    </table>
    <span class="head">Venue description:</span>
    <p class="description">${venue.description}</p>
    <p class="description">Starting time: ${venue.startingHour}</p>
  </div>`);

            $infoDiv.append($mainDiv);
            $mainDiv.append($div);
        }
    }

    function showMoreInfo() {

        name = $(this).parent().parent().find('span.venue-name').text();
        id = $(this).parent().parent().attr('id');

        $(this).parent().parent().find('div.venue-details').css('display', 'block');
        $(this).parent().parent().find('input.purchase').on('click', confirmPurchase);
    }

    function confirmPurchase() {

        let ticketPrice = Number($(this).parent().parent().find('td.venue-price').text().split(' ')[0]);
        ticketsQuantity = Number($(this).parent().parent().find('select.quantity').val());

        $infoDiv.empty();

        $infoDiv.append(`<span class="head">Confirm purchase</span>
<div class="purchase-info">
  <span>${name}</span>
  <span>${ticketsQuantity} x ${ticketPrice}</span>
  <span>Total: ${ticketsQuantity * ticketPrice} lv</span>
  <input type="button" value="Confirm">
</div>`);

        $infoDiv.find('input').on('click', confirm);

    }

    async function confirm() {

        $infoDiv.empty();

        console.log(id);

        let response = await $.ajax({
            method:'POST',
            url:`https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${ticketsQuantity}`,
            headers:authHeaders
        });

        console.log(response);
        $infoDiv.text('You may print this page as your ticket');
        $infoDiv.append(response.html);


    }
}