import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheWithExpiry = async (key: string, data: any, ttlseconds: number) => {
  const item = {
    value: data,
    expiry: Date.now() + ttlseconds * 1000,
  };
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const cacheData = async (key: string, data: any) => {
    await AsyncStorage.setItem(key, data)
}

export const getCache = async (key: string) => {
  const json = await AsyncStorage.getItem(key);
  if (!json) return null;

  try {
    const item = JSON.parse(json);
    if (Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key); // auto-clear expired cache
      return null;
    }
    return item.value;
  } catch (e) {
    console.warn("Failed to parse cache", e);
    return null;
  }
};