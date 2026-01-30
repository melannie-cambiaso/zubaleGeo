import { useGeolocation } from "@/hooks/useGeolocation";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform, Text } from "react-native";

export default function App() {
  const { location, errorMsg } = useGeolocation();
  console.log("Location:", location, "Error:", errorMsg);
  if (Platform.OS === "ios") {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === "android") {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}
