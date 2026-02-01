import { useLocationContext } from "@/context/LocationProvider";
import { CameraCapturedPicture } from "expo-camera";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  photo: CameraCapturedPicture;
}

export function PhotoPreview({ photo }: Props) {
  const { location } = useLocationContext();
  const { bottom, top } = useSafeAreaInsets();
  return (
    <View>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      <Text style={[styles.text, { bottom }]}>
        {location
          ? `Lat: ${location.latitude}, Lon: ${location.longitude}`
          : "Loading location..."}
      </Text>
      <Text style={[styles.text, { top }]}>{new Date().toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    position: "absolute",
    color: "white",
    left: 20,
  },
});
