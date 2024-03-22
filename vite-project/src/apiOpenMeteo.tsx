import { fetchWeatherApi } from 'openmeteo';
import config from '../config.json';

export const lyonData = config.cities.find(city => city.city === 'Lyon');


	
const params = {
	longitude: lyonData.longitude,
	latitude: lyonData.latitude,
	"current": ["temperature_2m", "is_day", "precipitation", "rain", "snowfall", "cloud_cover", "wind_speed_10m", "wind_direction_10m"],
	"hourly": "sunshine_duration",
	"daily": ["sunrise", "sunset"],
	"timezone": "Europe/London",
	"forecast_days": 1,
	"models": "arome_france_hd"
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
// const timezone = response.timezone();
// const timezoneAbbreviation = response.timezoneAbbreviation();
// const latitude = response.latitude();
// const longitude = response.longitude();

const current = response.current()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
export const weatherData = {
	current: {
		
		temperature2m: current.variables(0)!.value(),
		relativeHumidity2m: current.variables(1)!.value(),
		isDay: current.variables(1)!.value(),
		precipitation: current.variables(2)!.value(),
		rain: current.variables(3)!.value(),
		snowfall: current.variables(4)!.value(),		
		cloudCover: current.variables(6)!.value(),
		windSpeed10m: current.variables(7)!.value(),
		windDirection10m: current.variables(8)!.value(),
	},
	hourly: {
		time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		cloudCoverLow: hourly.variables(0)!.valuesArray()!,
		
	},
	daily: {
		time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		sunrise: daily.variables(0)!.valuesArray()!,
		sunset: daily.variables(1)!.valuesArray()!,
	},
	

};

// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.hourly.time.length; i++) {
	console.log(
		weatherData.hourly.time[i].toISOString(),
		weatherData.hourly.cloudCoverLow[i],
		
	);
}

for (let i = 0; i < weatherData.daily.time.length; i++) {
	console.log(
		weatherData.daily.time[i].toISOString(),
		weatherData.daily.sunrise[i],
		weatherData.daily.sunset[i]
	);
}

