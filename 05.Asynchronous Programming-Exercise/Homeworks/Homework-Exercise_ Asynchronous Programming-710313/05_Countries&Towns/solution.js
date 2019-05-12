function countryInfo() {
    console.log('hi');

    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_ByFhVxWYE';//
    const endPoint = 'countries';
    const username = 'user';
    const password = 'user';
    const headers = {
        'Authorization': `Basic ${btoa(username + ':' + password)}`,
        'Content-Type': 'application/json',
    };

    let $addCountry = $('#addCountry');
    $addCountry.on('click', addCountry);

    async function addCountry() {
        let countryName = $('#newCountryName').val();

        if (countryName) {
            let newCountry = {
                name: countryName
            }

            try {
                await $.ajax({
                    url: baseUrl + 'appdata/' + appKey + '/' + endPoint,
                    method: 'POST',
                    headers,
                    data: JSON.stringify(newCountry)
                });
                $('#newCountryName').val('');

                await loadCountries();
            } catch (err) {
                console.log(err);
            }
        }
    }

    loadCountries();

    async function loadCountries() {

        try{
            let countries = await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + endPoint,
                method: 'GET',
                headers
            });

            displayCountries(countries);
        }catch(err){
            console.log(err);
        }
    }

    function displayCountries(countries) {
        console.log(countries);
        let $tableBody = $('#results > tbody');
        $tableBody.empty();

        for (let country of countries) {
            let $tr1 = $('<tr>');
            let $tr2 = $('<tr>');

            $(`
            
            <td>
                <label >Country Name:</label>
                <input type="text" id="input${country._id}" value="${country.name}"/>
                <button class="editCountry" id="edit${country._id}">Edit</button>
            </td>
            <td>
                    <button class="deleteCountry" id="delete${country._id}">Delete Country</button>
            </td>   
            `).appendTo($tr1);
            $tr1.appendTo($tableBody);

            $(`
            <td>
                Towns in ${country.name}:
                <button class="loadTowns" id="load${country.name}">Load</button>
                <table class="${country.name}" style="display: none">
                    <tbody>
                    
                    </tbody>
                </table>
            </td>
            <td>
                <label for="newTown${country.name}">Town:</label>
                <input type="text" id="newTown${country.name}" />
                <button class="addTown" id="addTown${country.name}">Add</button>
            </td>   
            `).appendTo($tr2);
            $tr2.appendTo($tableBody);

        }
        $('.editCountry').on('click', editCountry);
        $('.deleteCountry').on('click', deleteCountry);
        $('.loadTowns').on('click', loadTowns);
        $('.addTown').on('click', addTown);
    }

    async function loadTowns() {
        let countryName = ($(this).attr('id')).replace('load', '');

        try {
            let towns = await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/towns',
                method: 'GET',
                headers
            });

            displayTowns(towns, countryName);
        } catch (err) {
            console.log(err);
        }
    }

    function displayTowns(towns, countryName){

        let $table = $(`.${countryName}`);
        let $tableBody = $(`.${countryName} > tbody`);

        $table.css('display', 'block');
        $tableBody.empty();

        for (let town of towns.filter(x => x.country === countryName)) {

            let $tr = $(`
                <tr>
                <td>
                    <label >Name:</label>
                    <input type="text" id="name${town._id}" value="${town.name}"/>
                    <label >Country:</label>
                    <input type="text" id="country${town._id}" value="${town.country}"/>
                    <button class="editTown" id="edit${town._id}">Edit</button>
                    <button class="deleteTown" id="delete${town._id}">Delete</button>
                 </td>
                </tr>
`).appendTo($tableBody);
        }

        $('.editTown').on('click', editTown);
        $('.deleteTown').on('click', deleteTown);
    }

    async function editTown() {
        let townId = ($(this).attr('id')).replace('edit', '');

        let townName = $(`#name${townId}`).val();
        let townCountry = $(`#country${townId}`).val();
        if (townName) {
            if (townCountry) {
                let updateTown = {
                    name: townName,
                    country: townCountry
                };

                try {
                    await $.ajax({
                        url: baseUrl + 'appdata/' + appKey + '/towns/' + `${townId}`,
                        method: 'PUT',
                        headers,
                        data: JSON.stringify(updateTown)
                    });

                    await loadCountries();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    async function deleteTown() {
        let townId = ($(this).attr('id')).replace('delete', '');

        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/towns/' + `${townId}`,
                method: 'DELETE',
                headers
            });

            await loadCountries();
        } catch (err) {
            console.log(err);
        }
    }

    async function addTown() {
        let countryName = ($(this).attr('id')).replace('addTown', '');

        let inputId = `newTown${countryName}`;
        let townName = $(`#${inputId}`).val();

        if (townName){
            let newTown = {
                name: townName,
                country: countryName
            }

            try {
                await $.ajax({
                    url: baseUrl + 'appdata/' + appKey + '/towns',
                    method: 'POST',
                    headers,
                    data: JSON.stringify(newTown)
                });
                $(`#${inputId}`).val('');
                await loadCountries();
            } catch (err) {
                console.log(err);
            }
        }

    }

    async function editCountry() {

        let countryId = ($(this).attr('id')).replace('edit', '');

        let updateName = $(`#input${countryId}`).val();
        if (updateName){
            let updateCountry = {
                name: updateName
            }

            try {
                await $.ajax({
                    url: baseUrl + 'appdata/' + appKey + '/' + endPoint + `/${countryId}`,
                    method: 'PUT',
                    headers,
                    data: JSON.stringify(updateCountry)
                });

                await loadCountries();
            } catch (err) {
                console.log(err);
            }
        }
    }

    async function deleteCountry() {
        let countryId = ($(this).attr('id')).replace('delete', '');

        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + endPoint + `/${countryId}`,
                method: 'DELETE',
                headers
            });

            await loadCountries();
        } catch (err) {
            console.log(err);
        }
    }
}