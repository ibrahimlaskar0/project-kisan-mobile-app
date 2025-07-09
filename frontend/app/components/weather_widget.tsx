import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getWeatherAdvice, WeatherAdviceInput } from '../libs/advice';
import { cacheWithExpiry, getCache } from '../libs/cache';
import { getCurrentLocation, UserLocation } from '../libs/location';
import { getWeatherData } from '../libs/weather';
import { getAppLanguage, useLanguage } from '../libs/language';

import CloudyIcon from '../../assets/weather_icons/static/cloudy.svg';
import DayIcon from '../../assets/weather_icons/static/day.svg';
import NightIcon from '../../assets/weather_icons/static/night.svg';
import RainDayIcon from '../../assets/weather_icons/static/rainy-3.svg';
import RainIcon from '../../assets/weather_icons/static/rainy-6.svg';
import ThunderstormIcon from '../../assets/weather_icons/static/thunder.svg';

export default function WeatherWidget() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<string|null>(null)

  useEffect(() => {
    async function fetchData() {
      setLang(await getAppLanguage())

      setLoading(true);
      setError(null);
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);

        const cacheData = await getCache("weather");


        if(cacheData) {
          setWeather(cacheData)
        } else {
          const weatherResult = await getWeatherData();
          setWeather(weatherResult || null);
          await cacheWithExpiry("weather", weatherResult, 1800);
        }
      } catch (e) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="items-center justify-center p-6 w-full">
        <Text className="text-lg text-gray-500">Loading weather...</Text>
      </View>
    );
  }
  if (error || !location || !weather) {
    return (
      <View className="items-center justify-center p-6 w-full">
        <Text className="text-lg text-red-600">{error || 'No weather data available'}</Text>
      </View>
    );
  }

  // Extract data
  const { current, daily } = weather;
  // Today = 0, Tomorrow = 1
  const todayMin = daily?.temperature2mMin?.[0];
  const todayMax = daily?.temperature2mMax?.[0];
  const windSpeed = current?.windSpeed10m;
  const cloudCover = current?.cloudCover;
  const tomorrowPrecipProb = daily?.precipitationProbabilityMax?.[1];
  const isDay = current?.isDay;
  const weatherCode = current?.weatherCode;

  let sky = 'sky_clear';
  if (cloudCover >= 85) sky = 'sky_overcast';
  else if (cloudCover >= 50) sky = 'sky_mostly_cloudy';
  else if (cloudCover >= 20) sky = 'sky_partly_cloudy';

  let gradientColors = ['#3B7AED', '#84ABF0']; // default sunny day
  let icon = <DayIcon width={120} height={120} />;
  let textColor = 'black';
  let textColorClass = 'text-black';

  // clear day, clear night
  if ([0, 1].includes(weatherCode)) {
    if (isDay) {
      gradientColors = ['#3B7AED', '#84ABF0']; // default sunny day
      icon = <DayIcon width={120} height={120} />;
      textColor = 'black';
      textColorClass = 'text-black';
    } else {
      gradientColors = ['#081945', '#033899'];
      icon = <NightIcon width={120} height={120} />;
      textColor = 'white';
      textColorClass = 'text-white';
    }
  // cloudy
  } else if ([2, 3].includes(weatherCode)) {
    gradientColors = ['#363F59', '#7995C9'];
    icon = <CloudyIcon width={120} height={120} />;
    textColor = 'white';
    textColorClass = 'text-white';

  // rain
  } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    if (isDay) {
      // gradientColors = ['#667db6', '#0082c8', '#0082c8', '#667db6'];
      gradientColors = ['#363F59', '#7995C9'];
      icon = <RainDayIcon width={120} height={120} />;
      textColor = 'white';
      textColorClass = 'text-white';
    } else {
      // gradientColors = ['#232526', '#414345'];
      gradientColors = ['#363F59', '#7995C9'];
      icon = <RainIcon width={120} height={120} />;
      textColor = 'white';
      textColorClass = 'text-white';
    }
  // thunderstorm
  } else if ([95, 96, 99].includes(weatherCode)) {
    // gradientColors = ['#0f0c29', '#302b63', '#24243e'];
    gradientColors = ['#363F59', '#7995C9'];
    icon = <ThunderstormIcon width={120} height={120} />;
    textColor = 'white';
    textColorClass = 'text-white';
  }

  // Prepare advice input
  const adviceInput: WeatherAdviceInput = {
    temperature: current.temperature2m,
    minTemperature: todayMin,
    maxTemperature: todayMax,
    windSpeed: windSpeed,
    rainProbability: tomorrowPrecipProb,
    rainAmount: daily?.precipitationSum?.[0],
    cloudCover: cloudCover,
    humidity: current.relativeHumidity2m,
    isDay: isDay,
    time: current.time instanceof Date ? current.time : undefined,
  };
  const adviceList = getWeatherAdvice(adviceInput);

  return (
    <LinearGradient
      colors={gradientColors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, width: '100%', padding: 0, margin: 0 }}
    >
      <View className="items-center justify-center p-6 w-full">
        <Text className={`text-lg font-bold mb-2 text-center ${textColorClass}`}>
          {[location.city, location.region, location.country].filter(Boolean).join(', ')}
        </Text>
        <View className="flex-row items-center w-full justify-center mb-2">
          <View className="mr-4">
            {icon}
          </View>
          <View className="ml-4 items-center">
            <Text className={`text-4xl font-bold ${textColorClass}`}>
              {Math.round(current.temperature2m)}°C
            </Text>
            <Text className={`text-base mt-1 ${textColorClass}`}>{useLanguage(lang, "temp_current")}</Text>
          </View>
        </View>
        <View className="flex-row justify-between w-full mt-2 mb-2 px-4">
          <View className="items-center flex-1">
            <Text className={`text-base ${textColorClass}`}>{useLanguage(lang, "temp_min")}</Text>
            <Text className={`text-lg font-bold ${textColorClass}`}>{todayMin !== undefined ? Math.round(todayMin) : '--'}°C</Text>
          </View>
          <View className="items-center flex-1">
            <Text className={`text-base ${textColorClass}`}>{useLanguage(lang, "temp_max")}</Text>
            <Text className={`text-lg font-bold ${textColorClass}`}>{todayMax !== undefined ? Math.round(todayMax) : '--'}°C</Text>
          </View>
        </View>
        <View className="flex-row justify-between w-full mt-2 px-4">
          <View className="items-center flex-1">
            <Text className={`text-base ${textColorClass}`}>{useLanguage(lang, "wind_speed")}</Text>
            <Text className={`text-lg font-bold ${textColorClass}`}>{windSpeed !== undefined ? Math.round(windSpeed) : '--'} km/h</Text>
          </View>
          <View className="items-center flex-1">
            <Text className={`text-base ${textColorClass}`}>{useLanguage(lang, "sky")}</Text>
            <Text className={`text-lg font-bold ${textColorClass}`}>{useLanguage(lang, sky)}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className={`text-base ${textColorClass}`}>{useLanguage(lang, "rain_tomorrow")}</Text>
            <Text className={`text-lg font-bold ${textColorClass}`}>{tomorrowPrecipProb !== undefined ? Math.round(tomorrowPrecipProb) : '--'}%</Text>
          </View>
        </View>
        {adviceList.length > 0 && (
          <View
            className="w-full mt-4 rounded-xl p-4"
            style={{
              backgroundColor: 'rgba(96, 110, 130, 0.4)', // Tailwind gray-700 with 80% opacity
              borderWidth: 3,
              borderColor: 'rgba(157, 173, 196, 0.8)',
              borderStyle: 'solid',
            }}
          >
            <Text className={`text-xl font-extrabold mb-3 ${textColorClass}`}>{useLanguage(lang, "advice")}</Text>
            {adviceList.map((advice, idx) => (
              <Text key={idx} className={`text-lg mb-1 ${textColorClass}`}>• {lang ? useLanguage(lang, advice) : useLanguage("en-US", advice)}</Text>
            ))}
          </View>
        )}
      </View>
    </LinearGradient>
  );
} 