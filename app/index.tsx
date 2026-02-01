import { InfoModal } from "@/components/ui/InfoModal";
import { Loading } from "@/components/ui/Loading";
import { useLocationContext } from "@/context/LocationProvider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { AppleMaps, CameraPosition, Coordinates, GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import { getDistance } from "geolib";
import { useMemo, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const { location, errorMsg, loading, openAppSettings } = useGeolocation();
  const { setLocation, setMarkerLocation } = useLocationContext();
  const [marker, setMarker] = useState<Coordinates | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const currentPosition = useMemo(
    () => ({
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    }),
    [location?.coords.latitude, location?.coords.longitude],
  );

  const isDisabled = useMemo(() => {
    if (!marker) return true;
    if (!currentPosition.latitude || !currentPosition.longitude) return true;
    if (!marker.latitude || !marker.longitude) return true;

    const distance = getDistance(
      {
        lat: currentPosition.latitude,
        lng: currentPosition.longitude,
      },
      { lat: marker.latitude, lng: marker.longitude },
    );
    return distance > 500;
  }, [marker, currentPosition]);

  if (loading) return <Loading message="Getting location..." />;
  if (errorMsg) {
    if (errorMsg === "Permission to access location was denied") {
      return (
        <InfoModal
          title="Error"
          visible={true}
          message={errorMsg}
          onPress={openAppSettings}
        />
      );
    } else if (
      errorMsg === "Location services are not available on emulators." ||
      errorMsg === "Mocked locations are not allowed."
    ) {
      return <InfoModal title="Error" visible={true} message={errorMsg} />;
    }
  }

  const initialCamera: CameraPosition = {
    coordinates: {
      latitude: location!.coords.latitude,
      longitude: location!.coords.longitude,
    },
    zoom: 18,
  };

  const MapComponent = Platform.OS === "ios" ? AppleMaps : GoogleMaps;

  const handlePress = () => {
    if (currentPosition.latitude && currentPosition.longitude) {
      setLocation({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      });
    }
    if (marker?.latitude && marker?.longitude) {
      setMarkerLocation({
        latitude: marker.latitude,
        longitude: marker.longitude,
      });
    }

    router.push("/camera");
  };

  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
      <MapComponent.View
        style={styles.container}
        cameraPosition={initialCamera}
        onMapClick={(event) => setMarker(event.coordinates)}
        circles={[
          {
            center: currentPosition,
            radius: 5,
            strokeColor: "blue",
            fillColor: "rgba(0, 0, 255, 0.3)",
          },
        ]}
        markers={marker ? [{ coordinates: marker }] : []}
      />
      <TouchableOpacity
        style={[
          styles.button,
          { bottom: insets.bottom + 16 },
          isDisabled && styles.disabledButton,
        ]}
        disabled={isDisabled}
        onPress={handlePress}
      >
        <Text style={styles.text}>CHECK IN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "blue",
    position: "absolute",
    left: 16,
    padding: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  text: {
    color: "white",
  },
});
