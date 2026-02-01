import { Loading } from "@/components/ui/Loading";
import { PhotoPreview } from "@/components/ui/PhotoPreview";
import { useCamera } from "@/hooks/useCamera";
import { useOrientation } from "@/hooks/useOrientation";
import { CameraView } from "expo-camera";
import {
  Button,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./CameraScreen.styles";

export default function CameraScreen() {
  const { photo, cameraRef, permission, handlePress, requestPermission } =
    useCamera();
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { angle } = useOrientation();

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
      <View
        style={[
          styles.arrow,
          {
            transform: [{ rotate: `${angle}rad` }],
            bottom: bottom + 20,
            left: 20,
          },
        ]}
      />
    </View>
  );
}
