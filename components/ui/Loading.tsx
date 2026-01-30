import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface Props {
  message?: string;
}

export const Loading = ({ message }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} />
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
