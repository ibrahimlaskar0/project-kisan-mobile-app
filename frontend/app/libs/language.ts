import AsyncStorage from "@react-native-async-storage/async-storage";

type languagecode = "en" | "hi";

export async function setAppLanguage(language_code: languagecode) {
    await AsyncStorage.setItem("lang", language_code);
}

export async function getAppLanguage() {
    const language = await AsyncStorage.getItem("lang")

    if(language) {
        return language;
    }
    return null;
}