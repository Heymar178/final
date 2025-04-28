import * as React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";

const Dialog = ({
  visible,
  onClose,
  title,
  content,
  actions,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  actions: React.ReactNode;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Content */}
          <View style={styles.contentBody}>{content}</View>

          {/* Actions */}
          <View style={styles.footer}>{actions}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  contentBody: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "column",
    gap: 12,
  },
  
});


export { Dialog };