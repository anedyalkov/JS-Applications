function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_BJ_Ke8hZg';
    const endPoint = 'venues';
    const username = 'guest';
    const password = 'pass';
    const headers = {
        'Authorization': `Basic ${btoa(username + ':' + password)}`,
        'Content-Type': 'application/json',
    };

    $('#getVenues').on('click', getVenues);
    
    async function getVenues() {
        let date = $('#venueDate').val();

        if (date) {
            //rpc/kid_BJ_Ke8hZg/custom/calendar?query={date}
            try {
                let venuesIds =  await $.ajax({
                    url: baseUrl + `rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`,
                    method: 'POST',
                    headers
                });

                await getVenuesIDsInfo(venuesIds);
            } catch (err) {
                console.log(err);
            }
        }
    }

    async function getVenuesIDsInfo(venuesIds) {
        console.log(venuesIds);

        for (let venuesId of venuesIds) {
            try {
                let venuesInfo = await $.ajax({
                    url: baseUrl + `appdata/kid_BJ_Ke8hZg/venues/${venuesId}`,
                    method: 'GET',
                    headers
                });

                displayInfo(venuesInfo);

            } catch (err) {
                console.log(err);
            }
        }
        $(`input.info`).on('click', moreInfo);
        $('.purchase').on('click', purchase);
    }

    function displayInfo(venuesInfo) {
        console.log(venuesInfo);
        let $div = $('#venue-info');

        $(`
<div class="venue" id="${venuesInfo._id}">
  <span class="venue-name"><input class="info" type="button" value="More info">${venuesInfo.name}</span>
  <div class="venue-details" style="display: none;">
    <table>
      <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
      <tr>
        <td class="venue-price">${venuesInfo.price} lv</td>
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
    <p class="description">${venuesInfo.description}</p>
    <p class="description">Starting time: ${venuesInfo.startingHour}</p>
  </div>
</div>

        `).appendTo($div);
    }

    function moreInfo() {
        $(this).parent().parent().find('div.venue-details').css('display', 'block');
    }

    function purchase() {
        let price = +($(this).parent().parent().find('td.venue-price').text()).replace(' lv', '');
        let qty = $(this).parent().parent().find('td > select.quantity :selected').val();
        let name = $(this).parent().parent().parent().parent().parent().parent().find('span.venue-name').text();
        let id = $(this).parent().parent().parent().parent().parent().parent().attr('id');

        $('div#venue-info').html(`
        <span class="head">Confirm purchase</span>
<div class="purchase-info">
  <span>${name}</span>
  <span>${qty} x ${price}</span>
  <span>Total: ${qty * price} lv</span>
  <input type="button" id="${id}" value="Confirm">
</div>

        `);
        $('.purchase-info > input').on('click', confirm);

        async function confirm() {
            let id = $(this).attr('id');

            try {
                let venuesConfirm = await $.ajax({
                    url: baseUrl + `rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${qty}`,
                    method: 'POST',
                    headers
                });

                $('div#venue-info').text('You may print this page as your ticket');
                $('div#venue-info').append(venuesConfirm.html);

            } catch (err) {
                console.log(err);
            }
        }
    }
}