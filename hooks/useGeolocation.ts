import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

import * as Device from "expo-device";
import * as Location from "expo-location";

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      if (!Device.isDevice) {
        setErrorMsg("Location services are not available on emulators.");
        setLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (Platform.OS === "android" && location.mocked) {
          setErrorMsg("Mocked locations are not allowed.");
          setLoading(false);
          return;
        }

        if (location.coords.accuracy == null || location.coords.accuracy < 5) {
          setErrorMsg("Mocked locations are not allowed.");
          setLoading(false);
          return;
        }

        setLocation(location);
      } catch (error) {
        if (error instanceof Error) setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  return { location, errorMsg, loading, openAppSettings };
};
