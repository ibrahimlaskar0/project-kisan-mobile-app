import { Tabs } from "expo-router";
import { Bot, Camera, Home } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


function CustomTabBar({ state, navigation }: { state: any, descriptors: any, navigation: any }) {
  const insets = useSafeAreaInsets();
  const isCamera = state.routes[state.index]?.name === 'camera';
  const isChatbot = state.routes[state.index]?.name === 'chatbot';
  if (isCamera || isChatbot) return null;

  return (
    <View style={[styles.tabBar, { height: 70 + insets.bottom, paddingBottom: insets.bottom }]}> 
      <TouchableOpacity
        key={state.routes[0].key}
        onPress={() => {
          if (state.index !== 0) navigation.navigate('home');
        }}
        style={styles.tabButton}
        activeOpacity={0.8}
      >
        <Home color="#000" size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        key="camera"
        onPress={() => navigation.navigate('camera')}
        style={{
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }} 
        className="mt-[-24px] p-10 w-20 h-20 rounded-full bg-[#7EAD0E] items-center justify-center border-4 border-white shadow-black/15"
        activeOpacity={0.85}
      >
        <Camera color="#fff" size={40} />
      </TouchableOpacity>

      <TouchableOpacity
        key={state.routes[2].key}
        onPress={() => {
          if (state.index !== 2) navigation.navigate('chatbot');
        }}
        style={styles.tabButton}
        activeOpacity={0.8}
      >
        <Bot color="#000" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 8,
    position: 'relative',
    overflow: 'visible',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 16,
    zIndex: 0,
  },
  tabButton: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    zIndex: 1,
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} />
    </Tabs>
  );
}