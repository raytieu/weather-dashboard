$(document).ready(function() {

  let weatherInfo = $("#weather-info");
  let apiKey = "69de6a59efcfe98cdc7b78dff1d7d1b2";
  let searchBtn = $("#button-addon2");
  let currentWeather = $("#current-weather");

  let storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  searchHistory();
  
  searchBtn.click(newSearch);
  $(".search-card").click(displayCurrent);
    
  function newSearch() {

    currentWeather.empty();

    let city = $("#city-name").val();
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      let cityName = $("<h2>").append($("<p>").text(response.name));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);
      
      storedCities.push(response.name);
      console.log(storedCities);
      localStorage.setItem("cities", JSON.stringify(storedCities));

      $("#search-history").empty();
      searchHistory();
    
    });
   
  } 

  function searchHistory() {
    for (let i = 0; i < storedCities.length; i++) {
      let cityPrepend = $("<div>").addClass("card search-card").attr("data-name", storedCities[i]).text(storedCities[i]);
      $("#search-history").prepend(cityPrepend);
    }
  }

  function displayCurrent() {

    currentWeather.empty();

    let city = $(this).attr("data-name");
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      let cityName = $("<h2>").append($("<p>").text(response.name));
      let tempF = $("<p>").text("Temperature: " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "\u00B0" + "F");
      let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      currentWeather.append(cityName).append(tempF).append(humidity).append(windSpeed);
    });

  }

  $("#clear").click(function() {
    localStorage.removeItem("cities");
    currentWeather.empty();
    $("#search-history").empty();
  });

  

});   