// DOM Elements
const zipcodeInputField = document.getElementById('zipcode');
const submitButton = document.getElementById('submit__button');

// Variables
const apiKey = import.meta.env.VITE_API_KEY;

// Functions

async function handleWeatherRequest(e) {
  e.preventDefault();

  const location = zipcodeInputField.value;
  if (!location) return console.error('Please enter location');

  const selectedUnit = document.querySelector('input[name="units"]:checked');
  const unitGroup = selectedUnit ? selectedUnit.value : 'us';

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${apiKey}`;

  let currentWeather = await parseCurrentWeatherData(url);
  await parseWeatherForecast(url);
  await displayCurrentWeather(currentWeather);
}

// Event listeners

// Runs parseCurrent and parseWeather
submitButton.addEventListener('click', handleWeatherRequest);

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

// Parse 15 day forecast
async function parseWeatherForecast(url) {
  const response = await fetchData(url);
  if (!response) return;

  const forecast = response.days.map((day) => ({
    date: day.datetime,
    description: day.description,
    mintemp: day.tempmin,
    maxtemp: day.tempmax,
    icon: day.icon,
    precipprop: day.precipprob,
  }));

  console.log(`15-Day Forecast`, forecast);
  return forecast;
}

// Display current weather
function displayCurrentWeather(weather) {
  const currentWeatherContainer = document.querySelector(
    '.current__weather__container'
  );

  console.log('weather', weather);

  currentWeatherContainer.innerHTML = `
  <p>Current Weather in ${weather.locationName}</p>
  <p>Overview: ${weather.description}</p>
  <p>Temperature: ${weather.temp}°</p>
  <p>Conditions: ${weather.conditions}</p>
  <p>Chance of Rain: ${weather.precipprob}%</p>
  `;
}
