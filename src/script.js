// DOM Elements
const submitButton = document.getElementById('submit__button');

// Variables
const apiKey = import.meta.env.VITE_API_KEY;

// Functions

// Fetch data from API
async function fetchData(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP Error. Status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

// Parse current weather
async function parseCurrentWeatherData(url) {
  const response = await fetchData(url);

  if (!response) {
    console.error('No response data');
    return null;
  }
  console.log('response', response);

  const currentWeather = {
    description: response.description,
    locationName: response.resolvedAddress,
    temp: response.currentConditions.temp,
    icon: response.currentConditions.icon,
    conditions: response.currentConditions.conditions,
    precipprob: response.currentConditions.precipprob,
  };

  console.log(
    `Current weather for ${currentWeather.locationName}`,
    currentWeather
  );
  return currentWeather;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'short' };
  const dayOfWeek = date.toLocaleDateString(undefined, options);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${dayOfWeek} ${month}/${day}`;
}

// Parse 15 day forecast
async function parseWeatherForecast(url) {
  const response = await fetchData(url);
  if (!response) return;

  const forecast = response.days.map((day) => ({
    date: formatDate(day.datetime),
    description: day.description,
    mintemp: day.tempmin,
    maxtemp: day.tempmax,
    icon: day.icon,
    precipprop: day.precipprob,
  }));

  console.log(`15-Day Forecast`, forecast);
  return forecast;
}

async function handleWeatherRequest(e) {
  e.preventDefault();

  const location = document.getElementById('zipcode').value;
  if (!location) return console.error('Please enter location');

  const selectedUnit = document.querySelector('#units').value;
  const unitGroup = selectedUnit;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${apiKey}`;

  let currentWeather = await parseCurrentWeatherData(url);
  let forecast = await parseWeatherForecast(url);
  await displayCurrentWeather(currentWeather);
  await displayForecast(forecast);
}

// Display current weather
function displayCurrentWeather(weather) {
  const currentWeatherContainer = document.querySelector(
    '.current__weather__container'
  );

  console.log('weather', weather);

  currentWeatherContainer.textContent = '';
  currentWeatherContainer.classList.remove('hidden');

  const locationElement = document.createElement('h2');
  locationElement.classList.add('location__element');
  locationElement.textContent = `Current Weather in ${weather.locationName}`;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = `${weather.description}`;

  const iconElement = document.createElement('img');
  iconElement.src = `public/icons/${weather.icon}.png`;
  iconElement.alt = `${weather.icon} icon`;

  const tempElement = document.createElement('p');
  tempElement.classList.add('temp__element');
  tempElement.textContent = `${weather.temp}°`;

  const conditionsElement = document.createElement('p');
  conditionsElement.textContent = `${weather.conditions}`;

  const precipProbElement = document.createElement('p');
  precipProbElement.textContent = `${weather.precipprob}% chance of rain`;

  [
    locationElement,
    iconElement,
    tempElement,
    conditionsElement,
    precipProbElement,
    descriptionElement,
  ].forEach((element) => {
    element.classList.add('element');
    currentWeatherContainer.appendChild(element);
  });
}

// Display forecast
function displayForecast(forecast) {
  const forecastContainer = document.querySelector('.forecast__container');

  console.log('forecast', forecast);

  forecastContainer.textContent = '';
  forecastContainer.classList.remove('hidden');

  forecast.forEach((day) => {
    const card = document.createElement('div');
    card.innerHTML = `
          <p class="forecast__day">${day.date}</p>
          <img src="public/icons/${day.icon}.png" alt="" />
          <p>${day.mintemp}°–${day.maxtemp}°</p>
          <p>💧 ${day.precipprop}%</p>

    `;

    card.classList.add('forecast__card');
    forecastContainer.appendChild(card);
  });
}

// Event listeners

// Runs parseCurrent and parseWeather
submitButton.addEventListener('click', handleWeatherRequest);
