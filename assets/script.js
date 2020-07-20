$(document).ready(function() {

  let weatherInfo = $("#weather-info");
  let apiKey = "69de6a59efcfe98cdc7b78dff1d7d1b2";
  let searchBtn = $("#button-addon2");
  let currentWeather = $("#current-weather");

  searchBtn.click(function() {

    currentWeather.empty();

    let city = $("#city-name").val();
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    if (city) {
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);

        let cityName = $("<h2>").append($("<p>").text(response.name));
        let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + "MPH");

        currentWeather.append(cityName).append(humidity).append(windSpeed);
        
      });
    }
  
  }); 

});   