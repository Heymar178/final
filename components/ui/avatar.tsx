import * as React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const Avatar = React.forwardRef<
  View,
  { style?: object; children?: React.ReactNode }
>(({ style, children, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.avatar, style]}
    {...props}
  >
    {children}
  </View>
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  Image,
  { source: any; style?: object }
>(({ source, style, ...props }, ref) => (
  <Image
    ref={ref}
    source={source}
    style={[styles.avatarImage, style]}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  View,
  { style?: object; children?: React.ReactNode }
>(({ style, children, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.avatarFallback, style]}
    {...props}
  >
    <Text style={styles.fallbackText}>{children}</Text>
  </View>
));
AvatarFallback.displayName = "AvatarFallback";

const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  avatarFallback: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d1d1d1",
  },
  fallbackText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export { Avatar, AvatarImage, AvatarFallback };