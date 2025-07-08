import { useRouter } from "expo-router";
import { ArrowLeft, ArrowUp, Mic } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  from: string;
  text: string;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const CHAT_URL = process.env.EXPO_PUBLIC_BACKEND_URL || ''

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if(!CHAT_URL){
      const error_message = { from: "assistant", text: "Unable to connnect, please try again later."}
      setMessages((prev) => [...prev, error_message]);
      return
    }

    (async () => {
      const res = await fetch(CHAT_URL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text
        }),
      })
      const data: any = await res.json()

      setMessages((prev) => [...prev, { from: "assistant", text: data.response }]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    })()

    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="w-full py-4 px-6 bg-white border-b border-gray-200 flex-row items-center" style={{ position: 'absolute', top: 30, left: 0, right: 0, zIndex: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
          <ArrowLeft size={28} color="#222" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900 text-left">Chatbot</Text>
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

        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderColor: "#e5e7eb",
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={{ marginRight: 8, padding: 8 }}>
            <Mic size={24} color="#888" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 text-base px-3 py-2 bg-gray-100 rounded-xl"
            style={{ minHeight: 40, maxHeight: 100 }}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={{ marginLeft: 8, padding: 8, backgroundColor: "#7EAD0E", borderRadius: 999 }}
            onPress={handleSend}
          >
            <ArrowUp size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}