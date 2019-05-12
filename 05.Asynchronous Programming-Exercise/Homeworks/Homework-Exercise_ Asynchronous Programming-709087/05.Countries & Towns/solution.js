class Country {

    constructor(name){
        this.name = name;
    }
}

class Town {

    constructor(name, country){
        this.name = name;
        this.country = country;
    }
}

function solve() {

    const baseUrl = 'https://baas.kinvey.com/appdata/kid_rJnQrj3_V/';
    const kinveyUsername = "user";
    const kinveyPassword = "pass";
    const base64auth = btoa(`${kinveyUsername}:${kinveyPassword}`);
    const authHeaders = {"Authorization": "Basic " + base64auth, "Content-type": "application/json"};

    $('#addCountry').on('click', addCountry);
    $('#loadCountries').on('click', loadCountries);
    $('#loadTownsCreation').on('click', loadTownsCreations);
    $('#loadTowns').on('click', loadTowns);

    async function addCountry() {

        let $countryName = $('#countryName');

        let country = new Country($countryName.val());

        await $.ajax({
            method:'POST',
            url: `${baseUrl}countries`,
            headers: authHeaders,
            data:JSON.stringify(country)
        });

        $countryName.val('');

        await loadCountries();
    }

    async function loadCountries() {

        let countries = await getCountries();

        displayCountries(countries);

    }

    async function getCountries() {
        try {
            return await $.ajax({
                method: 'GET',
                url: `${baseUrl}countries`,
                headers: authHeaders,
            });
        }catch (e) {
            console.error(e.message);
        }
    }

    async function displayCountries(countries) {

        const $countryList = $('#countriesList');
        $countryList.empty();


        for (const country of countries) {

            let $li = $(`<li data-id="${country._id}"><span class="country-name">${country.name}</span></li>`);

            let $viewBtn = $('<button class="view">View</button>');
            $viewBtn.on('click',await viewCountryName);
            $li.append($viewBtn);

            let $deleteBtn = $('<button>Delete</button>');
            $deleteBtn.on('click',await deleteCountry);
            $li.append($deleteBtn);

            $countryList.append($li);
        }
    }

    async function viewCountryName(){

        const $element = $(this).parent();

        let countryName = $element
            .find('span.country-name')
            .text();

        $element.append($(`<input value="${countryName}">`));

        $element.find('button.view').prop("disabled", true);

        let $editBtn = $('<button>Edit</button>');
        $editBtn.on('click', await editCountryName);
        $element.append($editBtn);

    }

    async function editCountryName(){
        const $element = $(this).parent();

        let id = $element.data('id');
        let countryName = $element.find('input').val();

        let newCountry = new Country(countryName);

        try {

            await $.ajax({
                method:'PUT',
                url:`${baseUrl}countries/${id}`,
                headers:authHeaders,
                data:JSON.stringify(newCountry)
            });

            await loadCountries();
        }catch (e) {
            console.error(e.message);
        }
    }

    async function deleteCountry(){

        let id = $(this).parent().data('id');

        try {
            await $.ajax({
                method:'DELETE',
                url:`${baseUrl}countries/${id}`,
                headers:authHeaders,
            });

            await loadCountries();
        } catch (e) {
            console.error(e.message);
        }

    }

    async function loadTownsCreations() {

        const $townSection = $('#townCreation');

        let countries = await getCountries();

        $townSection.append(`<label for="townName">Town Name: </label>
                                <input type="text" id="townName">
                                <label for="townByCountry">Country Name: </label>`);

        let $select = $('<select id="townByCountry"></select>');
        $select.append('<option>');


        for (const country of countries) {
            $select.append($(`<option value="${country.name}">${country.name}</option>`))
        }

        $townSection.append($select);

        let $addTownBtn = $('<button id="addTown">Add Town</button>');
        $addTownBtn.on('click', addTown);
        $townSection.append($addTownBtn);
    }

    async function addTown() {

        const $townName = $('#townName');

        let country = $('#townByCountry option:selected').text();

        let town = new Town($townName.val(), country);

        try {
            await $.ajax({
                method:'POST',
                url:`${baseUrl}towns`,
                headers:authHeaders,
                data:JSON.stringify(town)
            });

            $townName.val('');

            await loadTowns();
        }catch (e) {
            console.error(e.message);
        }
    }

    async function loadTowns(){

        let towns = await getTowns();
        await displayTowns(towns);
    }

    async function getTowns() {

        try {
            return $.ajax({
                method:'GET',
                url:`${baseUrl}towns`,
                headers:authHeaders
            });
        }catch (e) {
            console.error(e.message)
        }
    }

    async function displayTowns(towns) {

        const $townsList = $('#townsList');
        $townsList.empty();


        for (const town of towns) {

            let $li = $(`<li data-id="${town._id}"><span class="town-name">${town.name} by ${town.country}</span></li>`);


            let $viewBtn = $('<button class="view">View</button>');
            $viewBtn.on('click',await viewTownName);
            $li.append($viewBtn);

            let $deleteBtn = $('<button>Delete</button>');
            $deleteBtn.on('click',await deleteTown);
            $li.append($deleteBtn);

            $townsList.append($li);
        }
    }

    async function viewTownName() {
        const $element = $(this).parent();

        $element.find('button.view').prop("disabled", true);

        let townName = $element
            .find('span.town-name')
            .text()
            .split(' ')
            .slice(0, -2)
            .join(' ');

        let countryName = $element
            .find('span.town-name')
            .text()
            .split(' ')
            .splice(-1, 1);

        let countries = await  getCountries();

        $element.append($(`<input value="${townName}">`));

        let $select = $('<select id="editCountry"></select>');
        $select.append('<option>');


        for (const country of countries) {
            let $option = ($(`<option value="${country.name}">${country.name}</option>`));

            if (country.name === countryName[0]){
                $option.prop('selected', true)
            }

            $select.append($option);
        }

        $element.append($select);

        let $editBtn = $('<button>Edit</button>');
        $editBtn.on('click', await editTown);
        $element.append($editBtn);
    }

    async function editTown(){

        const $element = $(this).parent();

        let id = $element.data('id');
        let townName = $element.find('input').val();
        let country = $element.find('option:selected').val();

        let town = new Town(townName, country);

        try {
            await $.ajax({
                method:'PUT',
                url:`${baseUrl}towns/${id}`,
                headers:authHeaders,
                data:JSON.stringify(town)
            });

            await loadTowns();
        }catch (e) {
            console.error(e.message);
        }
    }

    async function deleteTown() {
        let id = $(this).parent().data('id');

        try {
            await $.ajax({
                method:'DELETE',
                url:`${baseUrl}towns/${id}`,
                headers:authHeaders,
            });

            await loadTowns();
        } catch (e) {
            console.error(e.message);
        }
    }
}