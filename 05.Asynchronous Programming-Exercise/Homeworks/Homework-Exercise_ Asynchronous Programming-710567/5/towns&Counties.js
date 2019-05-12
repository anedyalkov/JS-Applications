function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_S1EzLpJt4';
    const townsEndpoint = 'Town';
    const countryEndpoint = 'Country';
    const username = 'niki';
    const password = '12345';
    const headers = {
        'Authorization': `Basic ${btoa(username + ':' + password)}`,
        'Content-Type': 'application/json'
    };

    $('#listCountries').on('click', listCountries);
    $('#addCountries').on('click', addCountry);

    async function addCountry() {
        let countryName = $('#countryName').val();

        let country = {
            name: countryName
        };

        await  $.ajax({
            url: baseUrl + 'appdata/' + appKey + '/' + countryEndpoint,
            headers,
            method: 'POST',
            data: JSON.stringify(country)
        });
        $('#countryName').val('');
        listCountries();
    }

    async function listCountries() {

        let countries = await $.ajax({
            url: baseUrl + 'appdata/' + appKey + '/' + countryEndpoint,
            headers,
            method: 'GET',

        });

        $('#countries').empty();
        for(let c of countries) {
            $divC = $(`<div class="card" data-id="${c._id}" style="width: 10rem;"></div>`);


            $btnE = $(`<div></div>`);
            $bt = $(`<button type="submit" class="btn btn-success" id="edit" style="margin-top: 20px; background-color: cornflowerblue">Edit Country</button>`);
            $in =  $(`<input id="editCountry" class='bl' type="text">`);
            $bt.on('click', editCountry);
            $btnE.append($bt);
            $btnE.append($in);

            $btnD = $(`<div>
                <button type="submit" class="btn btn-success" id="delete" style="margin-top: 20px; background-color: cornflowerblue">Delete Country</button>
                </div>`);
            $btnD.on('click', deleteCountry);

            $btnEtAdd = $(`<div></div>`);
            $bttAdd = $(`<button type="submit"  class="btn btn-success" id="addTown" style="margin-top: 20px; background-color: cornflowerblue" >Add Town</button>`);
            $intAdd =  $(`<input id="addTown" class='bl' type="text">`);
            $bttAdd.on('click', addTown);
            $btnEtAdd.append($bttAdd);
            $btnEtAdd.append($intAdd);
            //$btnTowns = $(`<div class="card-body">
            //    <button type="submit" class="btn btn-success" id="allTowns" style="margin-top: 20px; background-color: cornflowerblue">Towns in country</button>
            //    </div>`);
            //$btnTowns.on('click', allTowns);

            $divC.append($(`<div class="card-header"><a class="col">${c.name}</a></div>`));
            $divC.append($btnE);

            $divC.append($btnD);
            $divC.append($btnEtAdd);



            $('#countries').append($divC);
            //$divC.append($btnTowns);

            $divTowns = $(`<div data-countryName="${c.name}" class="card-body"></div>`);


            let towns = await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + townsEndpoint,
                headers,
                method: 'GET',
            });
            for(let t of towns) {
                if(t.country === c.name) {
                    $divCt = $(`<div data-id="${t._id}"></div>`);

//<button type="button" class="btn btn-outline-success">Success</button>
               // <button type="button" class="btn btn-outline-danger">Danger</button>
                       // <button type="button" class="btn btn-outline-warning">Warning</button>



                    $btnEt = $(`<div style="margin-top: 10px;"></div>`);
                    $btt = $(`<button type="submit" class="btn btn-outline-warning" id="editTown" >Edit Town</button>`);
                    $int =  $(` <input id="editTown" class='bl' type="text">Town name</input>`);
                    //$intc = $(`<input id="editTownCountry" class='bl' type="text">Country name</input>`);
                    $btt.on('click', editTown);
                    $btnEt.append($btt);
                    $btnEt.append($int);
                    //$btnEt.append($intc);

                    $btnDt = $(//`<div class="card-body">
                    `<button type="submit" class="btn btn-outline-danger" id="delete"  style="margin-top: 10px;">Delete Town</button>`);
                    //</div>`);
                    $btnDt.on('click', deleteTown);

                    //$btnTowns = $(`<div>
                    //<button type="submit" class="btn btn-success" id="allTowns" style="margin-top: 20px; background-color: cornflowerblue">Towns in country</button>
                    //</div>`);
                    //$btnTowns.on('click', allTowns);

                    $divCt.append($(`<div class="card-header"><a class="col">${t.name}</a></div>`));
                    $divCt.append($btnEt);
                    $divCt.append($btnDt);

                    $divTowns.append($divCt);
                }
            }

            $divC.append($divTowns);

        }
    }

    async function editCountry() {
        $inp = $(this).parent();//nextElementSibling.val();//.children().eq(0);
        let inps = $inp.children().eq(1).val();
        let id = $(this).parent().parent().data('id');

        let editedCountry = {
            name: inps,
        };
        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + countryEndpoint + '/' + id,
                method: 'PUT',
                data: JSON.stringify(editedCountry),
                headers
            });

        } catch (err) {
            console.log(err);
        }
        listCountries();
    }
    async function deleteCountry() {
        let id = $(this).parent().data('id');

        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + countryEndpoint + '/' + id,
                method: 'DELETE',
                headers
            });

        } catch (err) {
            console.log(err);
        }
        listCountries()
    }


    async function editTown() {
        let id = $(this).parent().parent().data('id');
        $inp = $(this).parent();//nextElementSibling.val();//.children().eq(0);
        let inps = $inp.children().eq(1).val();
        let countryName = $(this).parent().parent().parent().data('countryname');//.parent().parent().data('countryName');

        let editedTown = {
            name: inps,
            country: countryName
        };
        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + townsEndpoint + '/' + id,
                method: 'PUT',
                data: JSON.stringify(editedTown),
                headers
            });

        } catch (err) {
            console.log(err);
        }
        listCountries();
    }

    async function deleteTown() {
        let id = $(this).parent().data('id');

        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + townsEndpoint + '/' + id,
                method: 'DELETE',
                headers
            });

        } catch (err) {
            console.log(err);
        }
        listCountries()
    }
    async function addTown() {
        let townName = $(this).parent().children().eq(1).val();
        let countryId = $(this).parent().parent().data('id');

        let country = await $.ajax({
            url: baseUrl + 'appdata/' + appKey + '/' + countryEndpoint + '/' + countryId,
            headers,
            method: 'GET',
        });

        let town = {
            name: townName,
            country: country.name
        };

        await  $.ajax({
            url: baseUrl + 'appdata/' + appKey + '/' + townsEndpoint,
            headers,
            method: 'POST',
            data: JSON.stringify(town)
        });
        listCountries();
    }
}

