var apiKey = "f2db8e1b3757f3e4e3db807ed339605e";
var date = moment().format("MMMM Do");
var currentDate = "7/7/2020";
var city = "new York";
var lat;
var lon;
var cities = [];

// $(window).on("ready", renderList);

for (var i = 0; i < 5; i++) {
    $(`#date${i + 1}`).text(moment().add(i, 'days').format("dddd, (MMMM Do)"));
};

 function buttonControl (x) {
    var citySelect = cities[x];
    console.log(citySelect);
    city = citySelect;
    updateCurrentWeather();
    updateFiveDayForecast();
};



$("#searchBtn").on("click", function () {
    city = $("#citySearch").val();
    updateCurrentWeather();
    updateFiveDayForecast();
    cities.push(city);
    storeCities();
    renderList();
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
            lat = response.city.coord.lat;
            lon = response.city.coord.lon;
            updateUvIndex();
        });
};

function updateFiveDayForecast() {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            for (var i = 0; i < 5; i++) {
                var temperature = response.list[i].main.temp.toFixed(2);
                var humidity = response.list[i].main.humidity
                var icon = `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`
                $(`#temp${i + 1}`).text("Temp (F): " + temperature);
                $(`#humidity${i + 1}`).text("Humidity: " + humidity + "%");
                $(`#icon${i + 1}`).attr("src", icon);
            }

        });
};
var uvIndex;
function changeColors() {
    $("#currentUvIndex").removeClass("green");
    $("#currentUvIndex").removeClass("yellow");
    $("#currentUvIndex").removeClass("orange");
    $("#currentUvIndex").removeClass("red");
    if (uvIndex <= 2) {
        $("#currentUvIndex").addClass("green");
    }
    if (uvIndex > 2 && uvIndex <= 5) {
        $("#currentUvIndex").addClass("yellow");
    }
    if (uvIndex > 5 && uvIndex <= 7) {
        $("#currentUvIndex").addClass("orange");
    }
    if (uvIndex > 7) {
        $("#currentUvIndex").addClass("red");
    }
};

function updateUvIndex() {
    var queryURL = `https://api.openweathermap.org/data/2.5/uvi?&appid=${apiKey}&lat=` + lat + "&lon=" + lon;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURL);
            console.log(response);
            $("#currentUvIndex").text(response.value);
            uvIndex = response.value;
            changeColors();
        });
};

// storing cities in Local Storage
function storeCities() {
    // Stringify and send cities in localStorage 
    localStorage.setItem("cities", JSON.stringify(cities));
};


function renderList() {
    $("#cityList").empty();
    for (var i = 0; i < cities.length; i++) {
        var a = $("<li>");
        a.addClass("list-group-item");
        a.addClass("button");
        a.attr("type", "button");
        a.attr("onClick", `buttonControl(${i})`);
        a.text(cities[i]);
        $("#cityList").append(a);
        // add a delete button
        var deleteButton = '<span class="rockRight" style="padding:0"><button class="smBtn" id="smBtn' + i + '">&times;</button></span>';
        a.append(deleteButton);
    };
};

// pulling the copy of the preset cities from Local storage
function citiesFromStorage() {
    // retrive cities from storage
    var storedResults = JSON.parse(localStorage.getItem("cities"));
    // If  were retrieved from localStorage, update cities array it
    if (storedResults !== null) {
        cities = storedResults;
    }
};

citiesFromStorage();
renderList();

