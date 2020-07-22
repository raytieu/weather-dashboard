$(document).ready(function() {

  let apiKey = "69de6a59efcfe98cdc7b78dff1d7d1b2";
  let searchBtn = $("#button-addon2");
  let currentWeather = $("#current-weather");
  let forecastWeather = $(".five-day");

  let storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  searchHistory();
  lastResult();
  
  searchBtn.click(newSearch);
  $(".search-card").click(displayWeather);
    

  function newSearch() {

    currentWeather.empty();
    forecastWeather.empty();

    let city = $("#city-name").val();
    let queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    $.ajax({
      url: queryCurrent,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      let cityName = $("<h2>").text(response.name + " (" + moment().format('l') + ")").append($("<img>").attr("src", "assets/icons/" + response.weather[0].icon + ".png"));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      let lat = response.coord.lat;
      let lon = response.coord.lon;
      let queryForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`

      $.ajax({
        url: queryForecast,
        method: "GET"
      }).then(function(response) {
        console.log(response);

        let uvIndex = $("<p>").text("UV Index: ").append($("<span>").addClass("uv-index").text(response.current.uvi));
        currentWeather.append(uvIndex);

        if (response.current.uvi < 3) {
          $(".uv-index").css("background-color", "green");
        }
        else if (response.current.uvi >= 3 && response.current.uvi < 6) {
          $(".uv-index").css("background-color", "orange");
        }
        else if (response.current.uvi >= 6) {
          $(".uv-index").css("background-color", "red");
        }

        $(".five-day").append($("<p>").css("font-size", "25px").css("font-weight", "bold").text("5-Day Forecast:")).append($("<div>").addClass("row forecast-area"));

        for (let i = 1; i < 6; i++) {
          let forecastArea = $(".forecast-area");
          let newForecast = $("<div>").addClass("card col text-white bg-primary mb-3 forecast-card");

          let forecastDate = $("<strong>").addClass("forecast-date").text(moment().add(i, 'days').format('l'))
          let forecastIcon = $("<img>").attr("src", "assets/icons/" + response.daily[i].weather[0].icon + ".png");
          let forecastTemp = $("<p>").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
          let forecastHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");
      
          forecastArea.append(newForecast);
          newForecast.append(forecastDate).append(forecastIcon).append(forecastTemp).append(forecastHumidity);

        }

      });

      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);
      
      storedCities.push(response.name);
      // console.log(storedCities);
      localStorage.setItem("cities", JSON.stringify(storedCities));
      
      $("#search-history").empty();
      searchHistory();
      $(".search-card").click(displayWeather);

    });

  } 


  function displayWeather() {

    currentWeather.empty();
    forecastWeather.empty();

    let city = $(this).attr("data-name");
    let queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   
    $.ajax({
      url: queryCurrent,
      method: "GET"
    }).then(function(response) {

      let cityName = $("<h2>").text(response.name + " (" + moment().format('l') + ")").append($("<img>").attr("src", "assets/icons/" + response.weather[0].icon + ".png"));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      let lat = response.coord.lat;
      let lon = response.coord.lon;
      let queryForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`

      $.ajax({
        url: queryForecast,
        method: "GET"
      }).then(function(response) {
        console.log(response);

        let uvIndex = $("<p>").text("UV Index: ").append($("<span>").addClass("uv-index").text(response.current.uvi));
        currentWeather.append(uvIndex);

        if (response.current.uvi < 3) {
          $(".uv-index").css("background-color", "green");
        }
        else if (response.current.uvi >= 3 && response.current.uvi < 6) {
          $(".uv-index").css("background-color", "orange");
        }
        else if (response.current.uvi >= 6) {
          $(".uv-index").css("background-color", "red");
        }

        $(".five-day").append($("<p>").css("font-size", "25px").css("font-weight", "bold").text("5-Day Forecast:")).append($("<div>").addClass("row forecast-area"));

        for (let i = 1; i < 6; i++) {
          let forecastArea = $(".forecast-area");
          let newForecast = $("<div>").addClass("card col text-white bg-primary mb-3 forecast-card");

          let forecastDate = $("<strong>").addClass("forecast-date").text(moment().add(i, 'days').format('l'))
          let forecastIcon = $("<img>").attr("src", "assets/icons/" + response.daily[i].weather[0].icon + ".png");
          let forecastTemp = $("<p>").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
          let forecastHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");

          forecastArea.append(newForecast);
          newForecast.append(forecastDate).append(forecastIcon).append(forecastTemp).append(forecastHumidity);

        }

      });

      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);

    });

  }


  function lastResult() {

    currentWeather.empty();
    forecastWeather.empty();

    let city = storedCities.slice(-1)[0];
    let queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   
    $.ajax({
      url: queryCurrent,
      method: "GET"
    }).then(function(response) {

      let cityName = $("<h2>").text(response.name + " (" + moment().format('l') + ")").append($("<img>").attr("src", "assets/icons/" + response.weather[0].icon + ".png"));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      let lat = response.coord.lat;
      let lon = response.coord.lon;
      let queryForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`

      $.ajax({
        url: queryForecast,
        method: "GET"
      }).then(function(response) {
        console.log(response);

        let uvIndex = $("<p>").text("UV Index: ").append($("<span>").addClass("uv-index").text(response.current.uvi));
        currentWeather.append(uvIndex);

        if (response.current.uvi < 3) {
          $(".uv-index").css("background-color", "green");
        }
        else if (response.current.uvi >= 3 && response.current.uvi < 6) {
          $(".uv-index").css("background-color", "orange");
        }
        else if (response.current.uvi >= 6) {
          $(".uv-index").css("background-color", "red");
        }

        $(".five-day").append($("<p>").css("font-size", "25px").css("font-weight", "bold").text("5-Day Forecast:")).append($("<div>").addClass("row forecast-area"));

        for (let i = 1; i < 6; i++) {
          let forecastArea = $(".forecast-area");
          let newForecast = $("<div>").addClass("card col text-white bg-primary mb-3 forecast-card");

          let forecastDate = $("<strong>").addClass("forecast-date").text(moment().add(i, 'days').format('l'))
          let forecastIcon = $("<img>").attr("src", "assets/icons/" + response.daily[i].weather[0].icon + ".png");
          let forecastTemp = $("<p>").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
          let forecastHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");

          forecastArea.append(newForecast);
          newForecast.append(forecastDate).append(forecastIcon).append(forecastTemp).append(forecastHumidity);

        }

      });

      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);

    });

  }


  function searchHistory() {
    for (let i = 0; i < storedCities.length; i++) {
      let cityPrepend = $("<div>").addClass("card search-card").attr("data-name", storedCities[i]).text(storedCities[i]);
      $("#search-history").prepend(cityPrepend);
    }
  }


  $("#clear").click(function() {
    localStorage.removeItem("cities");
    currentWeather.empty();
    forecastWeather.empty();
    $("#search-history").empty();
    storedCities = [];
  });

});   