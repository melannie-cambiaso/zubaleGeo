import { Button, Modal, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  onPress?: () => void;
}

export const InfoModal = ({ visible, title, message, onPress }: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onPress}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text>{message}</Text>
          {onPress && <Button title="OK" onPress={onPress} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 8,
    gap: 8,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});