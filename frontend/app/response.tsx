import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResponseScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams();
  const hasSpoken = useRef(false);

  useEffect(() => {
    hasSpoken.current = false;
    if (typeof message === 'string' && message.trim()) {
      Speech.stop();
      Speech.speak(message, {
        onDone: () => { hasSpoken.current = true; },
      });
    }
    return () => {
      Speech.stop();
    };
  }, [message]);

  const handleBack = () => {
    Speech.stop();
    router.replace("/camera");
  };

  const handleRepeat = () => {
    if (typeof message === 'string' && message.trim()) {
      Speech.stop();
      Speech.speak(message);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      <TouchableOpacity onPress={handleBack} style={{ marginRight: 12, padding: 4 }} className="absolute top-12 left-4 px-6 py-3 z-10">
          <ArrowLeft size={28} color="#222" />
      </TouchableOpacity>
      <View className="bg-green-50 rounded-2xl shadow-md px-6 py-6 w-full max-w-2xl items-center justify-center min-h-[200px] relative">
        <ScrollView
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', minHeight: 120, paddingBottom: 80 }}
          showsVerticalScrollIndicator={true}
          style={{ width: '100%' }}
        >
          <Text className="text-xl font-bold text-green-800">
            {typeof message === 'string' ? message : ''}
          </Text>
        </ScrollView>
        <TouchableOpacity
          className="absolute bottom-4 right-4 bg-green-600 px-6 py-3 rounded-lg"
          style={{ marginBottom: 8 }}
          onPress={handleRepeat}
        >
          <Text className="text-white text-base font-semibold">Repeat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 