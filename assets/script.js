$(document).ready(function() {

  let apiKey = "69de6a59efcfe98cdc7b78dff1d7d1b2";
  let searchBtn = $("#button-addon2");
  let currentWeather = $("#current-weather");

  let storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  searchHistory();
  
  searchBtn.click(newSearch);
  $(".search-card").click(displayWeather);
    

  function newSearch() {

    currentWeather.empty();

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


  function searchHistory() {
    for (let i = 0; i < storedCities.length; i++) {
      let cityPrepend = $("<div>").addClass("card search-card").attr("data-name", storedCities[i]).text(storedCities[i]);
      $("#search-history").prepend(cityPrepend);
    }
  }


  function displayWeather() {

    currentWeather.empty();

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

      });

      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);
      
    });

  }


  $("#clear").click(function() {
    localStorage.removeItem("cities");
    currentWeather.empty();
    $("#search-history").empty();
    storedCities = [];
  });

  

});   