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

  let lang: string | null

  (async () => {
    lang = await getAppLanguage()
  })()

  if (temperature < 10) advice.push("Too cold for most crops. Delay sowing.");
  else if (temperature <= 20) advice.push("Cool weather — suitable for sowing wheat, peas.");
  else if (temperature <= 30) advice.push("Good temperature for most crops.");
  if (temperature > 35) advice.push("High heat — increase irrigation, avoid spraying during noon.");
  if (temperature > 40) advice.push("Extreme heat — protect young crops, water early morning or evening.");

  
  if (rainProbability !== undefined) {
    if (rainProbability <= 20) advice.push("No rain expected — good day for pesticide or fertilizer spraying.");
    else if (rainProbability <= 50) advice.push("Slight rain chance — consider watering today.");
    else if (rainProbability <= 80) advice.push("Rain likely — postpone field spraying or harvesting.");
    else if (rainProbability > 80) advice.push("Heavy rain expected — protect harvested crops, delay irrigation.");
  }
  if (rainAmount !== undefined) {
    if (rainAmount >= 5 && rainAmount <= 15) advice.push("Moderate rainfall — reduce irrigation schedule.");
    if (rainAmount > 20) advice.push("Heavy rain — check for waterlogging in fields.");
  }


  if (windSpeed < 10) advice.push("Calm wind — suitable for spraying.");
  else if (windSpeed <= 25) advice.push("Moderate wind — be cautious with spraying.");
  if (windSpeed > 25) advice.push("Strong wind — avoid spraying and field work.");


  if (cloudCover < 20) advice.push("Sunny day — good for drying crops and spraying.");
  else if (cloudCover < 50) advice.push("Partly cloudy — good light for growth.");
  else if (cloudCover < 85) advice.push("Mostly cloudy — reduce evaporation, monitor fungus.");
  if (cloudCover > 85) advice.push("Overcast — may increase pest/disease risk.");


  if (humidity !== undefined) {
    if (humidity < 30) advice.push("Dry conditions — increase watering, risk of dehydration.");
    else if (humidity <= 60) advice.push("Ideal humidity for most crops.");
    if (humidity > 70) advice.push("High humidity — monitor for fungal disease.");
    if (humidity > 85) advice.push("Very high humidity — avoid spraying, risk of leaf burn and fungus.");
  }


  if (isDay !== undefined && time instanceof Date) {
    const hour = time.getHours();
    if (hour < 10 && isDay && cloudCover < 20) advice.push("Best time to water crops.");
    if (hour >= 12 && hour <= 15 && isDay && temperature > 30) advice.push("Avoid spraying or watering — high evaporation.");
    if (hour >= 17 && !isDay) advice.push("Good time for irrigation and field activity.");
  }
  

  if (rainProbability > 50 && windSpeed > 20) advice.push("Avoid pesticide spraying — may get washed off.");
  if (rainProbability > 60) advice.push("Consider early irrigation today — rain expected tomorrow.");
  if (rainProbability < 20 && cloudCover < 20) advice.push("Ideal time for planting, spraying, or harvesting.");
  if (rainProbability > 80 && rainAmount !== undefined && rainAmount > 20) advice.push("Heavy rain warning — cover stored grains and prepare for water drainage.");

  return advice;
}

export type { WeatherAdviceInput };