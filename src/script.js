// DOM Elements
const zipcodeInputField = document.getElementById('zipcode');
const submitButton = document.getElementById('submit__button');

// Variables
const apiKey = import.meta.env.VITE_API_KEY;
const unitGroup = 'us'; // or 'metric'
let location;

// Event listeners

// Runs parseCurrent and parseWeather
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  location = zipcodeInputField.value;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${apiKey}`;

  parseCurrentWeatherData(url);
  parseWeatherForecast(url);
});

// Updates value of location with input change 
zipcodeInputField.addEventListener('change', (e) => {
  location = e.target.value;
  console.log('location', location);
});



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
  }
}

// Parse current weather
async function parseCurrentWeatherData(url) {
  const response = await fetchData(url);

  const parsedData = {
    description: response.description,
    current: {
      temp: response.currentConditions.temp,
      icon: response.currentConditions.icon,
      conditions: response.currentConditions.conditions,
      precipprob: response.currentConditions.precipprob,
    },
  };

  console.log(`Current weather for ${location}`, parsedData);
  return parsedData;
}

// Parse 15 day forecast
async function parseWeatherForecast(url) {
  const response = await fetchData(url);

  const days = response.days;

  let forecast = [];

  days.forEach((day) => {
    let dailyForecast = {
      date: day.datetime,
      description: day.description,
      mintemp: day.tempmin,
      maxtemp: day.tempmax,
      icon: day.icon,
      precipprop: day.precipprob,
    };

    forecast.push(dailyForecast);
  });

  console.log(`Forecast for ${location}`, forecast);
  return forecast;
}
