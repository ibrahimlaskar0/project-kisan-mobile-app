import { Tabs } from "expo-router";
import { Bot, Camera, Home } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RateWidget from "../components/rate_widget";
import WeatherWidget from '../components/weather_widget';
import RateIcon from '../../assets/reshot-icon-money-GH3BJS8LUF.svg';
import WeatherIcon from '../../assets/reshot-icon-sun-S9ZW4T6UGQ.svg';

enum Page {WEATHER=0, RATE=1}

export default function HomeScreen() {

  const [pageIndex, setPageIndex] = useState<Page>(Page.WEATHER)


  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="w-full flex-row justify-center items-center">
      <View className="w-full flex-row justify-around items-center bg-transparent mt-5 mb-1">
        <TouchableOpacity className="flex-grow bg-blue-500 p-4 rounded-l-xl flex-row justify-center items-center" onPress={() => setPageIndex(Page.WEATHER)}>
          <WeatherIcon width={40} height={40}></WeatherIcon>
          <Text className="text-center text-xl text-gray-100 font-bold mx-2">Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-grow bg-green-400 p-4 rounded-r-xl flex-row justify-center items-center" onPress={() => setPageIndex(Page.RATE)}>
          <RateIcon width={40} height={40}></RateIcon>
          <Text className="text-center text-xl text-green-950 font-bold mx-2">Rate</Text>
        </TouchableOpacity>
      </View>
      </View>
      <ScrollView contentContainerStyle={{ alignItems: 'center', flexDirection: 'column', paddingVertical: 24 }}>
        <View style={{display: pageIndex === Page.WEATHER ? 'contents' : 'none'}}>
          <WeatherWidget/>
        </View>
        <View style={{display: pageIndex == Page.RATE ? 'contents' : 'none'}}>
          <RateWidget/>
        </View>
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
    </SafeAreaView>
  );
} 