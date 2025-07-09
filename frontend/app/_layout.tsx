import { Stack, router } from "expo-router";
import { useEffect } from "react"
import "../global.css";

import { getAppLanguage } from "./libs/language"

export default function RootLayout() {

  useEffect(() => {
    (async () => { 
      const deviceLanguage = await getAppLanguage() 

      console.log(deviceLanguage)

      if(deviceLanguage) {
        router.replace("/home")
      } else {
        router.replace("/language_settings")
      }
    })();

    
  }, [])
  
  return (
    <Stack>
      <Stack.Screen name="language_settings" options={{headerShown: false}} />
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen name="response" options={{headerShown: false}} />
      <Stack.Screen name="settings" options={{ title: "Settings"}} />
    </Stack>
  );
}
