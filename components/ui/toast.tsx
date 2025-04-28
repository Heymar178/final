import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { X } from "lucide-react-native";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.toastProvider}>{children}</View>;
};

const ToastViewport = ({ children, style }: { children: React.ReactNode; style?: object }) => {
  return <View style={[styles.toastViewport, style]}>{children}</View>;
};

const Toast = ({
  children,
  style,
  variant = "default",
}: {
  children: React.ReactNode;
  style?: object;
  variant?: "default" | "destructive";
}) => {
  return (
    <View
      style={[
        styles.toast,
        variant === "destructive" && styles.toastDestructive,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const ToastAction = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.toastAction, style]}>
      <Text style={styles.toastActionText}>{children}</Text>
    </TouchableOpacity>
  );
};

const ToastClose = ({ onPress, style }: { onPress: () => void; style?: object }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.toastClose, style]}>
      <X size={16} color="#888" />
    </TouchableOpacity>
  );
};

const ToastTitle = ({ children, style }: { children: React.ReactNode; style?: object }) => {
  return <Text style={[styles.toastTitle, style]}>{children}</Text>;
};

const ToastDescription = ({ children, style }: { children: React.ReactNode; style?: object }) => {
  return <Text style={[styles.toastDescription, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  toastProvider: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  toastViewport: {
    flexDirection: "column-reverse",
    padding: 16,
    maxHeight: "100%",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  toastDestructive: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  toastAction: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  toastActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  toastClose: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toastDescription: {
    fontSize: 14,
    color: "#888",
  },
});

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};