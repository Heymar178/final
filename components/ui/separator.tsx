import * as React from "react";
import { View, StyleSheet } from "react-native";

const Separator = React.forwardRef<
  View,
  {
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
    style?: object;
  }
>(({ orientation = "horizontal", decorative = true, style, ...props }, ref) => {
  if (decorative) {
    // If decorative, we don't render anything for accessibility purposes
    return null;
  }

  return (
    <View
      ref={ref}
      accessibilityRole="none"
      style={[
        styles.separator,
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  );
});
Separator.displayName = "Separator";

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#ccc",
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    width: 1,
    height: "100%",
  },
});

export { Separator };