function attachEvents(){
    $('#submit').click(loadData);
    let code;

    let weatherConditions = {
        "Sunny": '☀',
        "Partly sunny":'⛅',
        "Overcast": '☁',
        "Rain": '☂',
        "Degrees": '°'
    }
  
    const baseUrl = 'https://judgetests.firebaseio.com/locations.json';
    function loadData(){
        $.ajax({
            method: "GET",
            url: baseUrl,
        })
        .then(getWeatherForecast)
        .catch(handleError)
    }

    function getWeatherForecast(response){
        for (let town of response){
            if (town.name === $('#location').val()){
                code = town.code;
            }
        }
        if (!code) {
            handleError();
        }

        let url1 = `https://judgetests.firebaseio.com/forecast/today/${code}.json`;
        let url2 = `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`;
        let requestCurrentConditions = $.ajax({
            method: "GET",
            url: url1
        });
        let requestThreeDayForecast = $.ajax({
            method: "GET",
            url: url2
        });
        Promise.all([requestCurrentConditions, requestThreeDayForecast])
            .then(displayWeatherInfo)
            .catch(handleError);

        function displayWeatherInfo([todayForecast, threeDayForecast]) {
            getCurrentForecast();
            getUpcomingForecast();

            function getCurrentForecast(){
                $('#forecast').show();
                $('#current').empty();
                let template = $(`<div class="label">Current conditions</div>
                <span class="condition symbol">${weatherConditions[todayForecast.forecast.condition]}</span>
                <span class="condition">
                <span class ="forecast-data">${todayForecast.name}</span>
                <span class ="forecast-data">${todayForecast.forecast.low}&#176;/${todayForecast.forecast.high}&#176;</span>
                <span class = "forecast-data">${todayForecast.forecast.condition}</span>
                </span>`);

                $('#current').append(template);
            }

            function getUpcomingForecast(){
                $("#upcoming").empty();
                $("#upcoming").append($("<div>").addClass("label").text("Three-day forecast"));

                for (let day of threeDayForecast.forecast) {
                    let template = $(`<span class="upcoming">
                    <span class ="symbol">${weatherConditions[day.condition]}</span>
                    <span class ="forecast-data">${day.low}&#176;/${day.high}&#176;</span>
                    <span class ="forecast-data">${day.condition}</span>
                    </span>`);
                    $("#upcoming").append(template);
                }
            }
        }
    }
   
    function handleError() {
        $('#forecast')
            .css('display', 'block')
            .text('Error');
        $('#location').val('');
    }       
}