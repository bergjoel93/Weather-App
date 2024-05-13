import "./styles/style.css";

getTodayWeather("salt lake city");
getThreeDayForecast("Salt lake city");
// Write a function that proccesses the weather JSON data into an object with only the data we require for the app.

async function getThreeDayForecast(location) {
  const data = await getCurrentWeatherJSON(location);
  if (!data) {
    console.error("Invalid or incomplete data received!");
    return null;
  }
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const threeDayForecast = {
    date1: weekday[new Date(data.forecast.forecastday[1].date).getDay()],
    high1: data.forecast.forecastday[1].day.maxtemp_f,
    low1: data.forecast.forecastday[1].day.mintemp_f,
    date2: weekday[new Date(data.forecast.forecastday[2].date).getDay()],
    high2: data.forecast.forecastday[2].day.maxtemp_f,
    low2: data.forecast.forecastday[2].day.mintemp_f,
    date3: weekday[new Date(data.forecast.forecastday[3].date).getDay()],
    high3: data.forecast.forecastday[3].day.maxtemp_f,
    low3: data.forecast.forecastday[3].day.mintemp_f,
  };

  console.log("Three day forecast:", threeDayForecast);

  return threeDayForecast;
}

async function getTodayWeather(location) {
  const data = await getCurrentWeatherJSON(location);
  // check if data and the necessary fields exist
  if (!data) {
    console.error("Invalid or incomplete data received!");
    return null;
  }
  // Extract the relevant information from data
  const todayWeather = {
    location: data.location.name,
    region: data.location.region,
    country: data.location.country,
    temperatureF: data.current.temp_f,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    windDir: data.current.wind_dir,
    windSpeed: data.current.wind_mph,
    humidity: data.current.humidity,
    uv: data.current.uv,
    feelsLike: data.current.feelslike_f,
    aqi: data.current.air_quality["us-epa-index"],
    pm25: data.current.air_quality.pm2_5,
    high: data.forecast.forecastday[0].day.maxtemp_f,
    low: data.forecast.forecastday[0].day.mincemp_f,
    rain: data.forecast.forecastday[0].day.daily_will_it_rain,
    chanceRain: data.forecast.forecastday[0].day.daily_chance_of_rain,
    sunrise: data.forecast.forecastday[0].astro.sunrise,
    sunset: data.forecast.forecastday[0].astro.sunset,
  };
  console.log("Today's weather: ", todayWeather);

  return todayWeather;
}

// Write a function that hits the API that can take a location and return the weather data for that location.

async function getCurrentWeatherJSON(location) {
  const apiKey = "aa1328b351db477fb30205829240905";
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=4&aqi=yes&alerts=no`;
  // Try to fetch the data from the weather API
  try {
    // await the response from the fetch request to the API URL.
    const response = await fetch(url);
    // await the trasnformation of the respons to JSON format.
    const data = await response.json();
    console.log("raw data", data);
    return data;
  } catch (error) {
    // log any errors encountered during the fetch operation to the console.
    console.error("Error fetching weather data:", error);
    return null; // return null if error occurs.
  }
}
