import { useRouter } from "expo-router";
import Speech from "expo-speech";
import { ArrowLeft, ArrowUp, Mic } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAppLanguage, useLanguage } from "../libs/language"
import { Audio } from "expo-av";

interface Message {
  from: string;
  text: string;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [lang, setLang] = useState<string | null>("")
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const CHAT_URL = process.env.EXPO_PUBLIC_BACKEND_URL || ''

  console.log(CHAT_URL)

  useEffect(() => {
    (async () => {
      setLang(await getAppLanguage())
      console.log(lang)
    })();
    return () => {
      Speech.stop()
    }
  }, [])

 // Start recording
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Microphone permission is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      // @ts-expect-error
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY as any);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Error starting recording", error);
    }
  };

  // Stop recording and send
  const stopAndSendRecording = async () => {

    if (!CHAT_URL) {
      const error_message = { from: "assistant", text: "Unable to connnect, please try again later." }
      setMessages((prev) => [...prev, error_message]);
      return
    }

    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) return;

      setRecording(null);

      // get language setting
      const lang = (await getAppLanguage()) || "en-US";

      const formData = new FormData();
      formData.append("audio", {
        uri,
        name: "voice.m4a",
        type: "audio/m4a",
      } as any);

      const res = await fetch(CHAT_URL + "/voice_to_chat?lang=" + lang, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { from: "user", text: data.response }]); 

      const chat_res = await fetch(CHAT_URL + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: data.response
          }),
        })

      if (res.status === 200) {
          const chat_data: any = await chat_res.json()

          setMessages((prev) => [...prev, { from: "assistant", text: chat_data.response }]);

          // Speech.speak(data.response, { language: lang || "en-US" })
      } else {
          setMessages((prev) => [...prev, { from: "assistant", text: "Unable to connect to the server" }]);
      }

      scrollViewRef.current?.scrollToEnd({ animated: true });

    } catch (error) {
      console.error("Error sending voice", error);
      Alert.alert("Upload failed", "Could not send your voice to backend.");
    }
  };


  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (!CHAT_URL) {
      const error_message = { from: "assistant", text: "Unable to connnect, please try again later." }
      setMessages((prev) => [...prev, error_message]);
      return
    }

    try {
      (async () => {
        Speech?.stop?.()

        const res = await fetch(CHAT_URL + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg.text
          }),
        })

        if (res.status === 200) {
          const data: any = await res.json()

          setMessages((prev) => [...prev, { from: "assistant", text: data.response }]);

          Speech.speak(data.response, { language: lang || "en-US" })
        } else {
          setMessages((prev) => [...prev, { from: "assistant", text: "Unable to connect to the server" }]);
        }

        scrollViewRef.current?.scrollToEnd({ animated: true });
      })()

      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (e) {
      setMessages((prev) => [...prev, { from: "assistant", text: "Somethign went wrong." }])
    }

  }

  const handleBack = () => {
    router.back()
  }

  // TODO: fix styling issue
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="w-full py-4 px-6 bg-white border-b border-gray-200 flex-row items-center" style={{ position: 'absolute', top: 30, left: 0, right: 0, zIndex: 10 }}>
        <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
          <ArrowLeft size={28} color="#222" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900 text-left">{useLanguage(lang, "chatbot")}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        <View className="flex-1 pt-16">
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, idx) => (
              <View
                key={idx}
                className={`mb-3 flex-row w-full ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <View
                  className={
                    msg.from === "user"
                      ? "bg-white border border-gray-200 rounded-2xl px-4 py-2 max-w-[75%]"
                      : "bg-green-100 rounded-2xl px-4 py-2 max-w-[75%]"
                  }
                  style={{
                    alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                    borderTopRightRadius: msg.from === "user" ? 0 : 16,
                    borderTopLeftRadius: msg.from === "user" ? 16 : 0,
                  }}
                >
                  <Text className={`text-base ${msg.from === "user" ? "text-gray-900" : "text-green-900"}`}>{msg.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {
          !recording ?
            <View className="px-3 py-2 border-t-2 border-slate-100 bg-white flex-row items-center">
              <TouchableOpacity className="mr-2 p-2" onPress={startRecording}>
                <Mic size={24} color="#888" />
              </TouchableOpacity>
              <TextInput
                className="flex-1 text-base px-3 py-2 bg-gray-100 rounded-xl"
                style={{ minHeight: 40, maxHeight: 100 }}
                placeholder={useLanguage(lang, "type_your_message")}
                value={input}
                onChangeText={setInput}
                multiline
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity className="ml-2 p-2 bg-[#7EAD0E] rounded-full" onPress={handleSend}>
                <ArrowUp size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            :
            <View className="px-3 py-2 border-t-2 border-slate-100 bg-white flex-row items-center">
              <TouchableOpacity className="ml-2 p-2 bg-[#7EAD0E] rounded-full" onPress={stopAndSendRecording}><Text>Stop Recording</Text></TouchableOpacity>
            </View>
        }

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}