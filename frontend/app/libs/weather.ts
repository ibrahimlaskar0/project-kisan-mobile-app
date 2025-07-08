import { fetchWeatherApi } from 'openmeteo';
import { getCurrentLocation } from './location';

export async function getWeatherData() {
	const location = await getCurrentLocation();
	if (!location) return null;

	const params = {
		latitude: location.latitude,
		longitude: location.longitude,
		"daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_probability_max", "wind_speed_10m_max", "sunrise", "sunset"],
		"hourly": ["temperature_2m", "precipitation_probability", "wind_speed_10m", "cloud_cover"],
		"current": ["temperature_2m", "precipitation", "wind_speed_10m", "weather_code", "cloud_cover", "is_day", "relative_humidity_2m"]
	};
	const url = "https://api.open-meteo.com/v1/forecast";
	const responses = await fetchWeatherApi(url, params);



	const response = responses[0];

	const utcOffsetSeconds = response.utcOffsetSeconds();
	const timezone = response.timezone();
	const timezoneAbbreviation = response.timezoneAbbreviation();
	const latitude = response.latitude();
	const longitude = response.longitude();

	const current = response.current()!;
	const hourly = response.hourly()!;
	const daily = response.daily()!;

	const sunrise = daily.variables(5)!;
	const sunset = daily.variables(6)!;

	return {
		current: {
			time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
			temperature2m: current.variables(0)!.value(),
			precipitation: current.variables(1)!.value(),
			windSpeed10m: current.variables(2)!.value(),
			weatherCode: current.variables(3)!.value(),
			cloudCover: current.variables(4)!.value(),
			isDay: current.variables(5)!.value(),
			relativeHumidity2m: current.variables(0)!.value(),
		},
		hourly: {
			time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
				(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
			),
			temperature2m: hourly.variables(0)!.valuesArray()!,
			precipitationProbability: hourly.variables(1)!.valuesArray()!,
			windSpeed10m: hourly.variables(2)!.valuesArray()!,
			cloudCover: hourly.variables(3)!.valuesArray()!,
		},
		daily: {
			time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
				(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
			),
			temperature2mMax: daily.variables(0)!.valuesArray()!,
			temperature2mMin: daily.variables(1)!.valuesArray()!,
			precipitationSum: daily.variables(2)!.valuesArray()!,
			precipitationProbabilityMax: daily.variables(3)!.valuesArray()!,
			windSpeed10mMax: daily.variables(4)!.valuesArray()!,
			sunrise: [...Array(sunrise.valuesInt64Length())].map(
				(_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
			),
			sunset: [...Array(sunset.valuesInt64Length())].map(
				(_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
			),
		},
	};
}