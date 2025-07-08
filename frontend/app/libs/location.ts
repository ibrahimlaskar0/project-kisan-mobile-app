import * as Location from 'expo-location';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

export async function getCurrentLocation(): Promise<UserLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    return {
      latitude,
      longitude,
      city: place.city || place.subregion || undefined,
      region: place.region || undefined,
      country: place.country || undefined,
    };
  } catch (e) {
    console.warn('Failed to get location:', e);
    return null;
  }
}