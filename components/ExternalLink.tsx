import React from "react";
import {
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  StyleSheet,
} from "react-native";
import { openBrowserAsync } from "expo-web-browser";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: object;
}

export function ExternalLink({ href, children, style }: ExternalLinkProps) {
  const handlePress = async () => {
    if (Platform.OS === "web") {
      // Open the link in the default browser for web
      Linking.openURL(href);
    } else {
      // Open the link in an in-app browser for native platforms
      await openBrowserAsync(href);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.link, style]}>
      <Text style={styles.linkText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    padding: 8,
  },
  linkText: {
    color: "#",
    textDecorationLine: "underline",
  },
});
