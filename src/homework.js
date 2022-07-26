function currentDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[date.getDay()];
  let upDate = `${day}, ${hours}:${minutes}`;

  return upDate;
}
let now = new Date();
let currentTime = document.querySelector('#date');
currentTime.innerHTML = currentDate(now);

function formatDay(timestemp) {
  let date = new Date(timestemp * 1000);
  let day = date.getDay();
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector('#forecast');
  let forecastHtml = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHtml =
        forecastHtml +
        `
        <div class="col-2">
          <div class="card otherDays">${formatDay(forecastDay.dt)}
            <div class="d-flex">
              <img src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              height="40"
              width="40" />
              <div class="col4">
                ${Math.round(forecastDay.temp.max)}°C
                <br />
                ${Math.round(forecastDay.temp.min)}°C
              </div>
            </div>
          </div>
          </div>`;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
  let apiKey = 'dc4867c7e70cb097c34a05c3fcfb260d';
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  document.querySelector('.region').innerHTML = response.data.name;
  document.querySelector('#temperature').innerHTML = Math.round(
    response.data.main.temp
  );
  celsiusTemp = response.data.main.temp;
  document.querySelector('#humidity').innerHTML = response.data.main.humidity;
  document.querySelector('#wind').innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector('#description').innerHTML =
    response.data.weather[0].main;
  document
    .querySelector('#icon')
    .setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  getForecast(response.data.coord);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector('#cityInfo').value;
  searchCity(city);
}

function searchCity(city) {
  let apiKey = 'dc4867c7e70cb097c34a05c3fcfb260d';
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showWeather);
}

let searchForm = document.querySelector('#cityForm');
searchForm.addEventListener('submit', handleSubmit);

function myPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = 'metric';
  let apiKey = 'dc4867c7e70cb097c34a05c3fcfb260d';
  let apiGeolocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiGeolocation).then(showWeather);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  celsiusElement.classList.add('active');
  fahrenheitElement.classList.remove('active');
  let celsius = document.querySelector('#temperature');
  celsius.innerHTML = Math.round(celsiusTemp);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  celsiusElement.classList.remove('active');
  fahrenheitElement.classList.add('active');

  let temperatureElement = document.querySelector('#temperature');
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function current(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(myPosition);
}

let celsiusTemp = null;

let currentPosition = document.querySelector('#current-button');
currentPosition.addEventListener('click', current);

let celsiusElement = document.querySelector('#celsius');
celsiusElement.addEventListener('click', displayCelsiusTemp);

let fahrenheitElement = document.querySelector('#fahrenheit');
fahrenheitElement.addEventListener('click', displayFahrenheitTemp);

searchCity('Paris');
