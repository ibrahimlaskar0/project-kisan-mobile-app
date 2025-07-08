import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, Camera as CameraIcon, File } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraKey, setCameraKey] = useState(0);
  const IMG_UPLOAD_URL: string = process.env.EXPO_PUBLIC_BACKEND_URL || "";

  useFocusEffect(
    useCallback(() => {
      setCameraKey(prev => prev + 1);
    }, [])
  );

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      (async () => {
        const response = await requestPermission();
        if (!response.granted) {
          Alert.alert("Permission required", "Camera access is needed to use this feature.");
          router.replace("/home");
        }
      })();
    }
  }, [permission]);

  const uploadPhoto = async (
    imageUri: string,
    onSuccess: (message: string) => void,
    onError?: () => void
  ) => {
    try {
      const compressed = await ImageManipulator.manipulateAsync(imageUri, [], {
        compress: 0.4,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const formData = new FormData();
      formData.append('image', {
        uri: compressed.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      const response = await fetch(IMG_UPLOAD_URL + "/upload", {
        method: "POST",
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data && data.message) {
        onSuccess(data.message);
      } else {
        Alert.alert("Error", "Failed to upload photo.");
        if (onError) onError();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to upload photo.");
      if (onError) onError();
      console.log(err);
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: false,
          quality: 0.3,
          skipProcessing: true,
        });
        if (photo) {
          await uploadPhoto(
            photo.uri,
            (message) => router.replace({ pathname: "../response", params: { message } })
          );
        } else {
          Alert.alert("Error", "Failed to capture photo.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (!permission || !permission.granted) {
    return <View className="flex-1 bg-black" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity
        style={{ position: 'absolute', top: 50, left: 18, zIndex: 20, backgroundColor: 'transparent', padding: 6, borderRadius: 20 }}
        onPress={() => router.replace('/home')}
        hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
      >
        <ArrowLeft color="#fff" size={30} />
      </TouchableOpacity>
      <CameraView key={cameraKey} ref={cameraRef} style={{ flex: 1 }} />
      <View className="absolute bottom-10 left-0 right-0 flex-row items-end px-8" style={{ width: '100%' }}>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            className="bg-white/60 p-5 rounded-full border-2 border-gray-400"
            onPress={handleTakePhoto}
            disabled={loading}
            style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
          >
            <CameraIcon size={40} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      {loading && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
}