const apiKey = import.meta.env.VITE_API_KEY;
const location = '90210';
const unitGroup = 'us'; // or 'metric'

const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${apiKey}`;

console.log('url', url);

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

async function parseCurrentWeatherData() {
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

async function parseWeatherForecast() {
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
      precipprop: day.precipprob
    };

    forecast.push(dailyForecast);
  });

  console.log(`Forecast for ${location}`, forecast);
  return forecast;
}

parseCurrentWeatherData();
parseWeatherForecast();
