import AsyncStorage from "@react-native-async-storage/async-storage";
import { ui_language } from "./ui_language"

type languagecode = "en-US" | "hi-IN";

export function useLanguage(lang: string | null, key: string = "en-US"): string {
    if(!lang)
        lang = "en-US"
    return (ui_language as any)[key][lang]
}

export async function setAppLanguage(language_code: languagecode) {
    await AsyncStorage.setItem("lang", language_code);
}

export async function getAppLanguage() {
    const language = await AsyncStorage.getItem("lang")

    if (language) {
        return language;
    }
    return null;
}