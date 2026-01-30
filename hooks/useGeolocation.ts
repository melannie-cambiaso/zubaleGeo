import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

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
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
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
