import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = React.forwardRef<View, { style?: object; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<View, { style?: object; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.cardHeader, style]} {...props}>
      {children}
    </View>
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, { style?: object; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <Text ref={ref} style={[styles.cardTitle, style]} {...props}>
      {children}
    </Text>
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, { style?: object; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <Text ref={ref} style={[styles.cardDescription, style]} {...props}>
      {children}
    </Text>
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<View, { style?: object; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<View, { style?: object; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.cardFooter, style]} {...props}>
      {children}
    </View>
  )
);
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "column",
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: "#888",
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };