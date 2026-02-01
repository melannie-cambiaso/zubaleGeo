import { useLocationContext } from "@/context/LocationProvider";
import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import RNPhotoManipulator from "react-native-photo-manipulator";

export const useCamera = () => {
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { location } = useLocationContext();

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
  return {
    photo,
    setPhoto,
    cameraRef,
    permission,
    handlePress,
    requestPermission,
  };
};
