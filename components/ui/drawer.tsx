import * as React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

const Drawer = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const DrawerHeader = ({
  children,
  onClose,
  style,
}: {
  children: React.ReactNode;
  onClose?: () => void; // Optional onClose prop for the close button
  style?: object;
}) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={styles.title}>{children}</Text>
      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButtonInline}
          accessibilityLabel="Close"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DrawerFooter = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const DrawerTitle = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const DrawerDescription = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#888",
  },
  header: {
    marginBottom: 8,
    marginTop: -50,
    alignItems: "center", // Center the order number text horizontally
  },
  closeButtonInline: {
    padding: 8,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center", // Center the Update Status button horizontally
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Ensure the text is centered
  },
  description: {
    fontSize: 14,
    color: "#888",
  },
});

export { Drawer, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };