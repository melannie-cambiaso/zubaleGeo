import { Loading } from "@/components/ui/Loading";
import { PhotoPreview } from "@/components/ui/PhotoPreview";
import { useLocationContext } from "@/context/LocationProvider";
import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RNPhotoManipulator from "react-native-photo-manipulator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CameraLayout() {
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { bottom, top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const cameraRef = useRef<CameraView>(null);
  const { location } = useLocationContext();
  console.log(bottom, top)

  if (!permission) {
    return <Loading message="Requesting camera permission..." />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handlePress = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });
      const fontSize = 60;
      const locationText = `Lat: ${location?.latitude.toFixed(2)}, Lon: ${location?.longitude.toFixed(2)}`;
      const dateText = new Date().toLocaleString();
      const texts = [
        {
          position: { x: dateText.length * 22, y: 30 },
          text: dateText,
          textSize: fontSize,
          color: "white",
        },
        {
          position: { x: locationText.length * 20, y: 100 },
          text: locationText,
          textSize: fontSize,
          color: "white",
        },
      ];
      const manipulatedImage = await RNPhotoManipulator.printText(
        photo.uri,
        texts,
      );
      setPhoto({ ...photo, uri: manipulatedImage });
    }
  };

  if (photo) {
    return <PhotoPreview photo={photo.uri} />;
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          width: 50,
          height: 50,
          borderRadius: 25,
          position: "absolute",
          bottom: bottom + 16,
          left: width / 2 - 25,
        }}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
