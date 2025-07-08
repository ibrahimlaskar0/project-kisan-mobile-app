import { View, TouchableOpacity, Text, ScrollView } from "react-native"
import { useState } from "react"
import { Link, router } from "expo-router"
import { speak } from "expo-speech"

const languages = [
    {name: "English", key: "en-US"},
    {name: "हिंदी", key: "hi-IN"}
]

export default function LanguageSelection() {
    const [selected, setSelected] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<any>(null)

    const handleSpeak = (language: any) => {
        setSelectedLanguage(language)
        setSelected(true)
        speak(language.name, { language: language.key })
    }
    

    return (
        <View className="flex-1 justify-center items-center p-8">
            <ScrollView className="flex-col">
                {languages.map(lang => (
                    <TouchableOpacity key={lang.key} 
                    className="w-full p-4 rounded-sm bg-blue-500 m-2 flex-row justify-center items-center" 
                    onPress={() => handleSpeak(lang)}>
                        <Text className="font-bold text-2xl">{lang.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {
                selected &&
                <View className="w-full">
                    <TouchableOpacity className="bg-blue-400 rounded w-full" onPress={() => router.replace({pathname: "/home", params: { language: selectedLanguage }})}>
                            <Text className=" text-blue-950 p-6 text-2xl font-bold text-center">Next</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}