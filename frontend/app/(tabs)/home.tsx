import { Tabs, router, Link } from "expo-router";
import { Bot, Camera, Home } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAppLanguage, useLanguage } from "../libs/language"

import WeatherWidget from '../components/weather_widget';

import LanguageIcon from "../../assets/Telugu_Translation_icon_-_02.svg"

enum Page { WEATHER = 0, RATE = 1 }

export default function HomeScreen() {

  const [lang, setLang] = useState<string | null>("")


  useEffect(() => {
    (async () => {
      setLang(await getAppLanguage())
      // console.log(lang)
      // console.log(ui_text.weather[lang])
    })();
  }, [])


  return (
    <View className="flex-1 bg-white">
      <View className="w-full py-4 pt-14 px-6 bg-white border-b border-gray-200">
        <TouchableOpacity className="flex-row items-center">
          <Link href="/language_settings">
            <LanguageIcon color="#000" height={30} width={30}/>
          </Link>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ alignItems: 'center', flexDirection: 'column', paddingVertical: 24, marginHorizontal: 24 }}>
          <WeatherWidget />        
      </ScrollView>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === "index") return <Home color={color} size={size} />;
            if (route.name === "camera") return <Camera color={color} size={size === 24 ? 40 : size} />;
            if (route.name === "chatbot") return <Bot color={color} size={size} />;
            return null;
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="camera" options={{ title: "Camera" }} />
        <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} />
      </Tabs>
    </View>
  );
} 