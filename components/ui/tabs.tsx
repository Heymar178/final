import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tabs = ({ children, style }: { children: React.ReactNode; style?: object }) => {
  return <View style={[styles.tabs, style]}>{children}</View>;
};

const TabsList = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => {
  return <View style={[styles.tabsList, style]}>{children}</View>;
};

const TabsTrigger = ({
  children,
  isActive,
  onPress,
  style,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
  style?: object;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
        style,
      ]}
    >
      <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const TabsContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => {
  return <View style={[styles.tabsContent, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  tabsList: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  tabsTrigger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  tabsTriggerActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  tabsTriggerText: {
    fontSize: 14,
    color: "#888",
  },
  tabsTriggerTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
  tabsContent: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };