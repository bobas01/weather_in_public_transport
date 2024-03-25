/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchWeatherApi } from "openmeteo";
import config from "../config.json";

export const cityData = config.cities.find((city) => city.city === "Lyon");

const params = {
  longitude: cityData.longitude,
  latitude: cityData.latitude,
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "precipitation",
    "rain",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "wind_speed_10m",
    "wind_direction_10m",
  ],
  hourly: ["wind_speed_10m", "wind_direction_10m", "is_day"],
  minutely_15: "wind_speed_10m",
  daily: ["sunrise", "sunset"],
  timezone: "Europe/London",
  forecast_days: 1,
  models: "best_match",
};
const url = "https://api.open-meteo.com/v1/meteofrance";
const responses = await fetchWeatherApi(url, params);

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();

const current = response.current()!;
const minutely15 = response.minutely15()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
export const weatherData = {
  current: {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature2m: current.variables(0)!.value(),
    relativeHumidity2m: current.variables(1)!.value(),
    apparentTemperature: current.variables(2)!.value(),
    isDay: current.variables(2)!.value(),
    precipitation: current.variables(3)!.value(),
    rain: current.variables(4)!.value(),
    snowfall: current.variables(5)!.value(),
    weatherCode: current.variables(6)!.value(),
    cloudCover: current.variables(7)!.value(),
    windSpeed10m: current.variables(8)!.value(),
    windDirection10m: current.variables(9)!.value(),
  },
  minutely15: {
    time: range(
      Number(minutely15.time()),
      Number(minutely15.timeEnd()),
      minutely15.interval()
    ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
    windSpeed10m: minutely15.variables(0)!.valuesArray()!,
  },
  hourly: {
    time: range(
      Number(hourly.time()),
      Number(hourly.timeEnd()),
      hourly.interval()
    ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
    windSpeed10m: hourly.variables(0)!.valuesArray()!,
    windDirection10m: hourly.variables(1)!.valuesArray()!,
    isDay: hourly.variables(2)!.valuesArray()!,
  },
  daily: {
    time: range(
      Number(daily.time()),
      Number(daily.timeEnd()),
      daily.interval()
    ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
    sunrise: daily.variables(0)!.valuesInt64(0)!,
    sunset: daily.variables(1)!.valuesInt64(0)!,
  },
};

// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.minutely15.time.length; i++) {
  console.log(
    weatherData.minutely15.time[i].toISOString(),
    weatherData.minutely15.windSpeed10m[i]
  );
}
for (let i = 0; i < weatherData.hourly.time.length; i++) {
  console.log(
    weatherData.hourly.time[i].toISOString(),
    weatherData.hourly.windSpeed10m[i],
    weatherData.hourly.windDirection10m[i],
    weatherData.hourly.isDay[i]
  );
}
