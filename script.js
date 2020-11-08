
var apiKey = '48a8885619581107ad308f5dc195b025',
    city = $('#city-name'),
    icon = $('#weather-icon'),
    temp = $('#temperature'),
    humidity = $('#humidity'),
    windSpeed = $('#wind-speed'),
    UVIndex = $('#uv-index'),
    forecastGroup = $('.forecast-group'),
    userInput,
    userSearch = localStorage.getItem('city-searches');
    userSearch = JSON.parse(userSearch) || [];

renderSearchHistory();

function renderWeather(cityName) {

  // API URLs
  var forecastQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&APPID=' + apiKey;

  var weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=' + apiKey;

  $.ajax({
    url: weatherQueryURL,
    method: 'GET'
  }).then(function(response){

    //  UV Index vars
    var Lat = 'lat=' + response.coord.lat,
        Lon = 'lon=' + response.coord.lon;

    // UV API call
    UVQUeryURL = 'https://api.openweathermap.org/data/2.5/uvi?' + '&APPID=' + apiKey + '&' + Lat + '&' + Lon;

    $.ajax({
      url: UVQUeryURL,
      method: 'GET'
    }).then(function(UVResponse){

      // Rendering UV Index from AJAX Call
      UVIndex.text('UV Index: ' + UVResponse.value);
    });

    // 5 Day Forecast API call
    $.ajax({
      url: forecastQueryURL,
      method: 'GET'
    }).then(function(forecastResponse){

      //weather icon
      var currentWeatherIcon = forecastResponse.list[0].weather[0].icon;
      icon.attr('src', 'https://openweathermap.org/img/wn/' + currentWeatherIcon + '@2x.png');

      forecastGroup.empty();

      $('h2').removeClass('d-none');

      // looping through forecast data with time of days
      for (var i = 0; i < forecastResponse.list.length; i++){

        if (forecastResponse.list[i].dt_txt.indexOf('15:00:00') !== -1) {

          // generating new cards 
          forecastGroup.append(`
            <div class='card forecast-card'>
              <img class='card-img-top'src=${'https://openweathermap.org/img/wn/' + forecastResponse.list[i].weather[0].icon + '@2x.png'}>
              <div class='card-body'>
                <h5 class='card-title'>${forecastResponse.list[i].dt_txt}</h5>
                <p class='card-text'>High: ${forecastResponse.list[i].main.temp_max}℉</p>
                <p class='card-text'>Humidity: ${forecastResponse.list[i].main.humidity}%</p>
              </div>
            </div>`);

        }
      }
    });

    $('.current-weather-col').addClass('row-border');

    city.empty();
    temp.empty();
    humidity.empty();
    windSpeed.empty();

    city.text(response.name);
    temp.text('Temperature: ' + response.main.temp + '℉');
    humidity.text('Humidity: ' + response.main.humidity + '%');
    windSpeed.text('Wind Speed: ' + response.wind.speed + 'MPH');

  });
}

// Search function
$('.btn-primary').click(function(event){
  event.preventDefault;
  var userInput = $('#city-search').val().trim();
  if((userInput === null) || (userInput === '')){
    alert('Please enter a valid city');
  }
  else {
    userSearch.push(userInput);
    localStorage.setItem('city-searches', JSON.stringify(userSearch));
    renderWeather(userInput);
    addPreviousSearch();
  }
});

// adding buttons
function addPreviousSearch() {

  var userInput = $('#city-search').val().trim(),
      previousSearch = $('<button>');

  previousSearch.addClass('search list-group-item list-group-item-action');
  previousSearch.attr('data-name', userInput);
  previousSearch.text(userInput.toUpperCase());
  $('.search-history').prepend(previousSearch);

}

function renderSearchHistory() {

    // looping through localStorage
    for (var i = 0; i < userSearch.length; i++) {
        var button = $('<button>');
        button.addClass('search list-group-item list-group-item-action');
        button.text(userSearch[i].toUpperCase());
        $('.search-history').prepend(button);
    }
}

// search 
$('.list-group-item-action').click(function(event){
  event.preventDefault();
  var pastSearch = $(this).text();
  renderWeather(pastSearch);
});

// clear history
$('.btn-secondary').click(function(){
  localStorage.clear();
  $('.search-history').empty();

  userSearch = [];
  
});