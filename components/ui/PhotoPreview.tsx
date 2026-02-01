import { Image, StyleSheet, View } from "react-native";

interface Props {
  photo: string;
}

export function PhotoPreview({ photo }: Props) {
  return (
    <View>
      <Image source={{ uri: photo }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
