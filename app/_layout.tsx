import { LocationProvider } from "@/context/LocationProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen
          options={{
            headerTitle: "Geolocation",
          }}
          name="index"
        />
        <Stack.Screen
          name="camera"
          options={{
            headerTitle: "Camera",
          }}
        />
      </Stack>
    </LocationProvider>
  );
}
