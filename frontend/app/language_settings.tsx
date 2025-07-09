import { View, TouchableOpacity, Text, SafeAreaView, TouchableWithoutFeedback } from "react-native"
import { useEffect, useState } from "react"
import { Link, router } from "expo-router"
import { speak } from "expo-speech"
import { ArrowLeft } from "lucide-react-native"
import { getAppLanguage, useLanguage } from "./libs/language"
import { setAppLanguage } from "./libs/language"

const languages = [
    {name: "English", key: "en-US"},
    {name: "हिंदी", key: "hi-IN"}
]

export default function LanguageSelection() {
    const [selected, setSelected] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<any>(null)
    const [interfaceLang, setInterfaceLang] = useState<string|null>("")

    useEffect(() => {
        (async() => {
            setInterfaceLang(await getAppLanguage())
        })()
    }, [])

    const handleSpeak = (language: any) => {

        setSelectedLanguage(language);
        setSelected(true);
        speak(language.name, { language: language.key });
        (async () => {
            await setAppLanguage(language.key)
        })()
    }
    

    return (
        <View className="flex-col justify-between h-full bg-white py-8">
            <View className="w-full py-4 px-6 pt-8 bg-white border-b border-gray-200 flex-row items-center">
                <TouchableWithoutFeedback onPress={() => router.back()}>
                    <ArrowLeft color="#000" size={30}/>
                </TouchableWithoutFeedback>
                <Text className="text-center text-2xl font-bold mx-3">{useLanguage(interfaceLang, "select_language")}</Text>
            </View>
            <View className="flex px-10">
                {languages.map(lang => (
                    <TouchableOpacity key={lang.key} 
                    className="p-4 rounded-sm bg-blue-500 m-2 flex-row justify-center items-center" 
                    onPress={() => handleSpeak(lang)}>
                        <Text className="font-bold text-2xl">{lang.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {
                selected ?
                <View className="w-full">
                    <TouchableOpacity className="bg-blue-400 rounded w-full" onPress={() => router.replace("/home")}>
                            <Text className=" text-blue-950 p-6 text-2xl font-bold text-center">{useLanguage(interfaceLang, "next")}</Text>
                    </TouchableOpacity>
                </View>
                : <View><Text className="p-6 text-white/0"></Text></View>
            }
        </View>
    )
}