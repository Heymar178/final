import React from "react";
import { View, Text, StyleSheet } from "react-native";

const badgeVariants = (variant: "default" | "secondary" | "destructive" | "outline") => {
  switch (variant) {
    case "secondary":
      return { backgroundColor: "#E0F2FE", color: "#0284C7" }; // Light blue background, blue text
    case "destructive":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C" }; // Light red background, red text
    case "outline":
      return { borderColor: "#D1D5DB", color: "#374151", borderWidth: 1 }; // Gray border, dark gray text
    default:
      return { backgroundColor: "#E5E7EB", color: "#111827" }; // Default gray background, black text
  }
};

export interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  style?: {
    badge?: object;
    text?: object;
  };
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ style, variant = "default", children }) => {
  const variantStyles = badgeVariants(variant);

  return (
    <View style={[styles.badge, variantStyles, style?.badge]}>
      <Text style={[styles.text, { color: variantStyles.color }, style?.text]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export { Badge };