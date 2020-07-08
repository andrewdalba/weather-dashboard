var apiKey = "f2db8e1b3757f3e4e3db807ed339605e";
var date = moment().format("MMMM Do");
var currentDate = "7/7/2020";
var city = "new York";

for(var i = 0; i < 5; i++){
    // $(`#date${i+1}`).text(moment().add(i, 'days').calendar());
    $(`#date${i+1}`).text(moment().add(i, 'days').format("dddd, (MMMM Do)"));
}

$("#searchBtn").on("click", function(){
    city = $("#citySearch").val();
    updateCurrentWeather();
    updateFiveDayForecast();
});

function updateCurrentWeather() {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURL);
            console.log(response);
            $("#city").text(response.city.name + " (" + date + ")");
            $("#currentTemperature").text("Temperature (F): " + response.list[0].main.temp.toFixed(2));
            $("#currentHumidity").text("Humidity: " + response.list[0].main.humidity + "%");
            $("#currentWindSpeed").text("Wind Speed: " + response.list[0].wind.speed);
            $("#currentWeatherIcon").attr("src", `https://openweathermap.org/img/w/${response.list[0].weather[0].icon}.png`);
        });
};

function updateFiveDayForecast(){
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function (response){
        for(var i = 0; i < 5; i++){
            var temperature = response.list[i].main.temp.toFixed(2);
            var humidity = response.list[i].main.humidity
            var icon = `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`
            $(`#temp${i+1}`).text("Temp (F): " + temperature);
            $(`#humidity${i+1}`).text("Humidity: " + humidity + "%");
            $(`#icon${i+1}`).attr("src", icon);
        }

    });
};


// 3 ajax requests
// one for current forecast
// one for 5 day forecast
// one for UV index