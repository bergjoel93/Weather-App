import "./styles/style.css";
import { format } from "date-fns";

defaultState();

const input = document.querySelector("input");
input.addEventListener("input", async () => {
  if (input.validity.valid) {
    let search = input.value;
    let data = await getWeatherData(search);
    if (data) {
      render(data);
    }
  }
});

async function defaultState() {
  let data = await getWeatherData("Salt lake City");
  if (data) {
    render(data);
  }
}

function render(data) {
  changeBackground(data);
  // Location
  const location = document.querySelector("#location");
  let locationString = `${data.location}, ${data.region}, ${data.country}`;
  location.innerHTML = locationString;
  // todays date
  const date = document.querySelector(".current-date");
  date.innerHTML = format(data.date, "MMMM d yyyy");
  // Conditions
  const currentCondition = document.querySelector(".current-condition");
  currentCondition.innerHTML = `${data.condition}`;
  // current temp
  const currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML = `${data.temperatureF}° F`;

  // icon
  const icon = document.querySelector("#weather-icon");
  icon.src = `${data.icon}`;

  // humidity
  // const humidity = document.querySelector("#humidity");
  // humidity.innerHTML = `Humidity: ${data.humidity}%`;

  // wind and wind speed.
  const windDirection = document.querySelector("#wind-direction");
  windDirection.innerHTML = `${data.windDir}`;

  const windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${data.windSpeed} mph`;

  // uv index
  const uv = document.querySelector("#uv");
  uv.innerHTML = `${data.uv}`;

  // air quality
  const aqiCard = document.querySelector("#aqi-card");
  const epaIndex = Number(data.aqi);
  changeAqiCardColor(epaIndex, aqiCard);
  const aqi = document.querySelector("#aqi");
  aqi.innerHTML = `${data.pm25}`;

  // feels like
  const feelsLike = document.querySelector("#feelsLike");
  feelsLike.innerHTML = `${data.feelsLike}° F`;

  // high and low
  const high = document.querySelector("#high");
  const low = document.querySelector("#low");
  high.innerHTML = `${data.high}° F`;
  low.innerHTML = `${data.low}° F`;

  // rain chance
  const rain = document.querySelector("#rain");
  rain.innerHTML = `${data.chanceRain} %`;

  // sunrise
  const sunrise = document.querySelector("#sunrise");
  sunrise.innerHTML = `${data.sunrise}`;

  //sunset
  const sunset = document.querySelector("#sunset");
  sunset.innerHTML = `${data.sunset}`;

  // Three day forecast
  const date1 = document.querySelector(".date1");
  const day1Icon = document.querySelector("#day1-icon");
  const day1high = document.querySelector(".day1-high");
  const day1low = document.querySelector(".day1-low");

  date1.innerHTML = data.date1;
  day1Icon.src = `${data.day1Icon}`;
  day1low.innerHTML = `${data.low1}° F`;
  day1high.innerHTML = `${data.high1}° F`;

  const date2 = document.querySelector(".date2");
  const day2Icon = document.querySelector("#day2-icon");
  const day2low = document.querySelector(".day2-low");
  const day2high = document.querySelector(".day2-high");

  date2.innerHTML = data.date2;
  day2Icon.src = `${data.day2Icon}`;
  day2low.innerHTML = `${data.low2}° F`;
  day2high.innerHTML = `${data.high2}° F`;

  const date3 = document.querySelector(".date3");
  const day3Icon = document.querySelector("#day3-icon");
  const day3low = document.querySelector(".day3-low");
  const day3high = document.querySelector(".day3-high");

  date3.innerHTML = data.date3;
  day3Icon.src = `${data.day3Icon}`;
  day3low.innerHTML = `${data.low3}° F`;
  day3high.innerHTML = `${data.high3}° F`;
}

function changeAqiCardColor(epaIndex, aqiCard) {
  const alpha = 0.3;
  switch (epaIndex) {
    case 1:
      aqiCard.style.backgroundColor = `rgba(4,225,14,${alpha})`;
      break;
    case 2:
      aqiCard.style.backgroundColor = `rgba(253,249,3,${alpha})`;
      break;
    case 3:
      aqiCard.style.backgroundColor = `rgba(253,124,0,${alpha})`;
      break;
    case 4:
      aqiCard.style.backgroundColor = `rgba(249,87,58,${alpha})`;
      break;
    case 5:
      aqiCard.style.backgroundColor = `rgba(177,69,111,${alpha})`;
      break;
    case 6:
      aqiCard.style.backgroundColor = `rgba(120,12,27,${alpha})`;
      break;
    default:
      aqiCard.style.backgroundColor = "rgba(255,255,255,0)";
      break;
  }
}

async function getWeatherData(location) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const data = await getCurrentWeatherJSON(location);
  // check if data and the necessary fields exist
  if (!data || !data.location || !data.current || !data.forecast) {
    console.error("Invalid or incomplete data received!");

    return null;
  } else {
    // Extract the relevant information from data

    const weatherData = {
      location: data.location.name,
      region: data.location.region,
      country: data.location.country,
      date: new Date(data.forecast.forecastday[0].date),
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
      low: data.forecast.forecastday[0].day.mintemp_f,
      rain: data.forecast.forecastday[0].day.daily_will_it_rain,
      chanceRain: data.forecast.forecastday[0].day.daily_chance_of_rain,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset,
      date1: weekday[new Date(data.forecast.forecastday[1].date).getDay()],
      day1Icon: data.forecast.forecastday[1].day.condition.icon,
      high1: data.forecast.forecastday[1].day.maxtemp_f,
      low1: data.forecast.forecastday[1].day.mintemp_f,
      date2: weekday[new Date(data.forecast.forecastday[2].date).getDay()],
      day2Icon: data.forecast.forecastday[2].day.condition.icon,
      high2: data.forecast.forecastday[2].day.maxtemp_f,
      low2: data.forecast.forecastday[2].day.mintemp_f,
      date3: weekday[new Date(data.forecast.forecastday[3].date).getDay()],
      day3Icon: data.forecast.forecastday[3].day.condition.icon,
      high3: data.forecast.forecastday[3].day.maxtemp_f,
      low3: data.forecast.forecastday[3].day.mintemp_f,
    };
    console.log(weatherData);
    return weatherData;
  }
}

// Write a function that hits the API that can take a location and return the weather data for that location.

async function getCurrentWeatherJSON(location) {
  const apiKey = "aa1328b351db477fb30205829240905";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=4&aqi=yes&alerts=no`;
  // Try to fetch the data from the weather API
  try {
    // await the response from the fetch request to the API URL.
    const response = await fetch(url);
    // await the trasnformation of the respons to JSON format.
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    // log any errors encountered during the fetch operation to the console.
    console.error("Error fetching weather data:", error);
    return null; // return null if error occurs.
  }
}
/**
 * This function changes the background of the app to match the current conditions of the day.
 */
function changeBackground(weatherData) {
  const body = document.querySelector("body");
  const condition = weatherData.condition.toLowerCase();
  console.log(condition);

  switch (categorizeWeatherCondition(condition)) {
    case "rain":
      body.style.background = `
      linear-gradient(0deg, rgba(79,74,68,1) 13%, rgba(209,209,209,1) 46%, rgba(172,172,172,1) 83%)
    `;
      body.style.color = "white";
      break;
    case "sunny":
      body.style.background = `
      linear-gradient(0deg,
      rgba(133, 77, 14, 1) 25%,
      rgba(2, 132, 199, 1) 75%
    )`;
      body.style.color = `white`;
      break;
    case "partly cloudy":
      body.style.background = `
        linear-gradient(0deg, rgba(221,160,99,1) 13%, rgba(138,202,231,1) 46%, rgba(238,238,238,1) 83%)
    `;
      break;
    case "cloudy":
      body.style.background = `
        linear-gradient(0deg, rgba(79,74,68,1) 13%, rgba(209,209,209,1) 46%, rgba(172,172,172,1) 83%)
      `;
      break;
    case "fog":
      body.style.background = `
      linear-gradient(0deg, rgba(95,94,93,1) 5%, rgba(229,229,229,1) 39%, rgba(244,244,244,1) 83%)
    `;
      break;
    case "snow":
      body.style.background = `
      linear-gradient(0deg, rgba(95,94,93,1) 5%, rgba(229,229,229,1) 39%, rgba(244,244,244,1) 83%)
    `;
      break;
    case "thunder":
      body.style.background = `
        linear-gradient(90deg, rgba(95,94,93,1) 30%, rgba(247,230,102,1) 39%, rgba(186,186,186,1) 46%)`;
      body.style.color = "white";
      break;
    default:
      body.style.background = `
       linear-gradient(0deg, rgba(133,77,14,1) 25%, rgba(1,134,203,1) 75%)
      `;
      break;
  }
  function categorizeWeatherCondition(condition) {
    if (condition.includes("snow") || condition.includes("sleet"))
      return "snow";

    if (condition.includes("thunder")) return "thunder";

    if (condition.includes("rain") || condition.includes("drizzle"))
      return "rain";

    if (condition.includes("sunny") || condition.includes("clear"))
      return "sunny";

    if (condition.includes("partly cloudy")) return "partly cloudy";

    if (condition.includes("cloudy") || condition.includes("overcast"))
      return "cloudy";

    if (condition.includes("fog")) return "fog";

    return "unknown"; // Default case if none of the conditions match
  }
}
