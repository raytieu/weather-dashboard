$(document).ready(function() {

  // API Key to retrieve API call from openweather.org
  let apiKey = "69de6a59efcfe98cdc7b78dff1d7d1b2";

  // Variables to query HTML elements
  let searchBtn = $("#button-addon2");
  let currentWeather = $("#current-weather");
  let forecastWeather = $(".five-day");

  // Array of cities in the search history that is retrieved from Local Storage
  let storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  // Render Search History and the most recent result upon loading page
  searchHistory();
  lastResult();
  
  // Functions to display current and future weather information and to push new search into storedCities array
  $(".search-card").click(displayWeather);
  searchBtn.click(newSearch);
  $(".form-control").keypress(function(event) {
    if (event.keyCode == 13) {
      newSearch();
    }
  });


  // Function when entering a new city search
  function newSearch() {

    // Clear current and future weather sections
    currentWeather.empty();
    forecastWeather.empty();

    // Retrieve city name from input field to query in the URL
    let city = $("#city-name").val();

    // Endpoint to call the Current Weather API 
    let queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    // AJAX call to populate the Current Weather section
    $.ajax({
      url: queryCurrent,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      let cityName = $("<h2>").text(response.name + " (" + moment().format('l') + ")").append($("<img>").attr("src", "assets/icons/" + response.weather[0].icon + ".png"));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      // Latitude and Longitude coordinates needed for the One Call API Endpoint
      let lat = response.coord.lat;
      let lon = response.coord.lon;

      // Endpoint to call the One Call API (UV Index in Current Weather, and all of 5-day Forecast)
      let queryForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`

      // AJAX call for UV Index and 5-day Forecast
      $.ajax({
        url: queryForecast,
        method: "GET"
      }).then(function(response) {
        console.log(response);

        // Retrieve UV Index and append to Current Weather Section
        let uvIndex = $("<p>").text("UV Index: ").append($("<span>").addClass("uv-index").text(response.current.uvi));
        currentWeather.append(uvIndex);

        // Conditions for background color of UV Index value
        if (response.current.uvi < 3) {
          $(".uv-index").css("background-color", "green");
        }
        else if (response.current.uvi >= 3 && response.current.uvi < 6) {
          $(".uv-index").css("background-color", "orange");
        }
        else if (response.current.uvi >= 6) {
          $(".uv-index").css("background-color", "red");
        }

        // Append "5-day Forecast" text
        $(".five-day").append($("<p>").css("font-size", "25px").css("font-weight", "bold").text("5-Day Forecast:")).append($("<div>").addClass("row forecast-area"));

        // For loop to create each individual 5-day forecast card
        for (let i = 1; i < 6; i++) {
          let forecastArea = $(".forecast-area");
          let newForecast = $("<div>").addClass("card col-xs-12 col-s text-white bg-primary mb-3 forecast-card");

          let forecastDate = $("<strong>").addClass("forecast-date").text(moment().add(i, 'days').format('l'))
          let forecastIcon = $("<img>").attr("src", "assets/icons/" + response.daily[i].weather[0].icon + ".png");
          let forecastTemp = $("<p>").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
          let forecastHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");
      
          forecastArea.append(newForecast);
          newForecast.append(forecastDate).append(forecastIcon).append(forecastTemp).append(forecastHumidity);

        }

      });

      // Append selected information into the Current Weather section
      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);
      
      // Push searched city into local storage if city does not exist in storage previously
      if (storedCities.indexOf(response.name) === -1) {
        storedCities.push(response.name);
        localStorage.setItem("cities", JSON.stringify(storedCities));
      }
      
      // Empty old search history and render updated one from LocalStorage
      $("#search-history").empty();
      searchHistory();

      // Render displayWeather function when clicking on a city in the history section
      $(".search-card").click(displayWeather);

    });

    // Clear input field after searching for a city
    $(".form-control").val('');
    
  } 


  // Function to display weather sections when clicking on a city in the search history
  function displayWeather() {

    // Clear current and future weather sections
    currentWeather.empty();
    forecastWeather.empty();

    // Retrieve city name from data value of city to query in the URL
    let city = $(this).attr("data-name");

    // Endpoint to call the Current Weather API 
    let queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   
    // AJAX call to populate the Current Weather section
    $.ajax({
      url: queryCurrent,
      method: "GET"
    }).then(function(response) {

      let cityName = $("<h2>").text(response.name + " (" + moment().format('l') + ")").append($("<img>").attr("src", "assets/icons/" + response.weather[0].icon + ".png"));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      // Latitude and Longitude coordinates needed for the One Call API Endpoint
      let lat = response.coord.lat;
      let lon = response.coord.lon;

      // Endpoint to call the One Call API (UV Index in Current Weather, and all of 5-day Forecast)
      let queryForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`

      // AJAX call for UV Index and 5-day Forecast
      $.ajax({
        url: queryForecast,
        method: "GET"
      }).then(function(response) {

        // Retrieve UV Index and append to Current Weather Section
        let uvIndex = $("<p>").text("UV Index: ").append($("<span>").addClass("uv-index").text(response.current.uvi));
        currentWeather.append(uvIndex);

        // Conditions for background color of UV Index value
        if (response.current.uvi < 3) {
          $(".uv-index").css("background-color", "green");
        }
        else if (response.current.uvi >= 3 && response.current.uvi < 6) {
          $(".uv-index").css("background-color", "orange");
        }
        else if (response.current.uvi >= 6) {
          $(".uv-index").css("background-color", "red");
        }

        // Append "5-day Forecast" text
        $(".five-day").append($("<p>").css("font-size", "25px").css("font-weight", "bold").text("5-Day Forecast:")).append($("<div>").addClass("row forecast-area"));

        // For loop to create each individual 5-day forecast card
        for (let i = 1; i < 6; i++) {
          let forecastArea = $(".forecast-area");
          let newForecast = $("<div>").addClass("card col-xs-12 col-s text-white bg-primary mb-3 forecast-card");

          let forecastDate = $("<strong>").addClass("forecast-date").text(moment().add(i, 'days').format('l'))
          let forecastIcon = $("<img>").attr("src", "assets/icons/" + response.daily[i].weather[0].icon + ".png");
          let forecastTemp = $("<p>").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
          let forecastHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");

          forecastArea.append(newForecast);
          newForecast.append(forecastDate).append(forecastIcon).append(forecastTemp).append(forecastHumidity);

        }

      });

      // Append selected information into the Current Weather section
      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);

    });

  }


  // Function to display weather sections of last city searched when the page loads
  function lastResult() {

    // Clear current and future weather sections
    currentWeather.empty();
    forecastWeather.empty();

    // Retrieve city name of the last city in the storedCities array
    let city = storedCities.slice(-1)[0];

    // Endpoint to call the Current Weather API 
    let queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   
    // AJAX call to populate the Current Weather section
    $.ajax({
      url: queryCurrent,
      method: "GET"
    }).then(function(response) {

      let cityName = $("<h2>").text(response.name + " (" + moment().format('l') + ")").append($("<img>").attr("src", "assets/icons/" + response.weather[0].icon + ".png"));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      // Latitude and Longitude coordinates needed for the One Call API Endpoint
      let lat = response.coord.lat;
      let lon = response.coord.lon;

      // Endpoint to call the One Call API (UV Index in Current Weather, and all of 5-day Forecast)
      let queryForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`

      // AJAX call for UV Index and 5-day Forecast
      $.ajax({
        url: queryForecast,
        method: "GET"
      }).then(function(response) {

        // Retrieve UV Index and append to Current Weather Section
        let uvIndex = $("<p>").text("UV Index: ").append($("<span>").addClass("uv-index").text(response.current.uvi));
        currentWeather.append(uvIndex);

        // Conditions for background color of UV Index value
        if (response.current.uvi < 3) {
          $(".uv-index").css("background-color", "green");
        }
        else if (response.current.uvi >= 3 && response.current.uvi < 6) {
          $(".uv-index").css("background-color", "orange");
        }
        else if (response.current.uvi >= 6) {
          $(".uv-index").css("background-color", "red");
        }

        // Append "5-day Forecast" text
        $(".five-day").append($("<p>").css("font-size", "25px").css("font-weight", "bold").text("5-Day Forecast:")).append($("<div>").addClass("row forecast-area"));

        // For loop to create each individual 5-day forecast card
        for (let i = 1; i < 6; i++) {
          let forecastArea = $(".forecast-area");
          let newForecast = $("<div>").addClass("card col-xs-12 col-s text-white bg-primary mb-3 forecast-card");

          let forecastDate = $("<strong>").addClass("forecast-date").text(moment().add(i, 'days').format('l'))
          let forecastIcon = $("<img>").attr("src", "assets/icons/" + response.daily[i].weather[0].icon + ".png");
          let forecastTemp = $("<p>").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
          let forecastHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");

          forecastArea.append(newForecast);
          newForecast.append(forecastDate).append(forecastIcon).append(forecastTemp).append(forecastHumidity);

        }

      });

      // Append selected information into the Current Weather section
      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);

    });

  }


  // Function to create a card for each city in the storedCities array that can be clicked on to display weather info
  function searchHistory() {
    for (let i = 0; i < storedCities.length; i++) {
      let cityPrepend = $("<div>").addClass("card search-card").attr("data-name", storedCities[i]).text(storedCities[i]);
      $("#search-history").prepend(cityPrepend);
    }
  }


  // Click function to clear all sections of displayed information, and also clear the storedCities array and Local Storage
  $("#clear").click(function() {
    localStorage.removeItem("cities");
    currentWeather.empty();
    forecastWeather.empty();
    $("#search-history").empty();
    storedCities = [];
  });

});   