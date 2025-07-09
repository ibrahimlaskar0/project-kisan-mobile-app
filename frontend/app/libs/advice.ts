import { getAppLanguage, useLanguage} from "./language"

interface WeatherAdviceInput {
  temperature: number; // C
  minTemperature?: number;
  maxTemperature?: number;
  windSpeed: number; // km/h
  rainProbability: number; // %
  rainAmount?: number; // mm
  cloudCover: number; // %
  humidity?: number; // %
  isDay?: boolean;
  time?: Date;
}

export function getWeatherAdvice(input: WeatherAdviceInput): string[] {
  const advice: string[] = [];
  const {
    temperature,
    windSpeed,
    rainProbability,
    rainAmount,
    cloudCover,
    humidity,
    isDay,
    time,
  } = input;

  if (temperature < 10) advice.push("temp_very_cold");
  else if (temperature <= 20) advice.push("temp_cool");
  else if (temperature <= 30) advice.push("temp_optimal");
  if (temperature > 35) advice.push("temp_hot");
  if (temperature > 40) advice.push("temp_extreme");

  
  if (rainProbability !== undefined) {
    if (rainProbability <= 20) advice.push("rain_none");
    else if (rainProbability <= 50) advice.push("rain_light");
    else if (rainProbability <= 80) advice.push("rain_likely");
    else if (rainProbability > 80) advice.push("rain_heavy");
  }
  if (rainAmount !== undefined) {
    if (rainAmount >= 5 && rainAmount <= 15) advice.push("rain_mm_moderate");
    if (rainAmount > 20) advice.push("rain_mmm_heavy");
  }


  if (windSpeed < 10) advice.push("wind_calm");
  else if (windSpeed <= 25) advice.push("wind_moderate");
  if (windSpeed > 25) advice.push("wind_strong");


  if (cloudCover < 20) advice.push("cloud_clear");
  else if (cloudCover < 50) advice.push("cloud_partly");
  else if (cloudCover < 85) advice.push("cloud_mostly");
  if (cloudCover > 85) advice.push("cloud_overcast");


  if (humidity !== undefined) {
    if (humidity < 30) advice.push("humidity_dry");
    else if (humidity <= 60) advice.push("humidity_ideal");
    if (humidity > 70) advice.push("humidity_high");
    if (humidity > 85) advice.push("Vhumidity_very_high");
  }


  if (isDay !== undefined && time instanceof Date) {
    const hour = time.getHours();
    if (hour < 10 && isDay && cloudCover < 20) advice.push("time_morning");
    if (hour >= 12 && hour <= 15 && isDay && temperature > 30) advice.push("forecast_rain_wind");
    if (hour >= 17 && !isDay) advice.push("time_evening");
  }
  

  if (rainProbability > 50 && windSpeed > 20) advice.push("forecast_rain_wind");
  if (rainProbability > 60) advice.push("forecast_rain_tomorrow");
  if (rainProbability < 20 && cloudCover < 20) advice.push("forecast_clear_days");
  if (rainProbability > 80 && rainAmount !== undefined && rainAmount > 20) advice.push("forecast_heavy_rain");

  return advice;
}

export type { WeatherAdviceInput };