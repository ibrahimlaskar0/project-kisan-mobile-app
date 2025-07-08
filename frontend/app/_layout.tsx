import { Stack, router } from "expo-router";
import { useEffect } from "react"
import "../global.css";

import { getAppLanguage } from "./libs/language"

export default function RootLayout() {

  useEffect(() => {
    (async () => { 
      const deviceLanguage = await getAppLanguage() 

      if(deviceLanguage) {
        router.replace("/home")
      } else {
        router.replace("/language_settings")
      }
    })();

    
  }, [])
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
    </Stack>
  );
}
