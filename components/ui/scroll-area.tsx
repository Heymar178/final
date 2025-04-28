import * as React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

const ScrollArea = React.forwardRef<
  ScrollView,
  { children: React.ReactNode; style?: object }
>(({ children, style, ...props }, ref) => (
  <ScrollView
    ref={ref}
    style={[styles.scrollArea, style]}
    contentContainerStyle={styles.contentContainer}
    {...props}
  >
    {children}
  </ScrollView>
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = ({
  orientation = "vertical",
  style,
}: {
  orientation?: "vertical" | "horizontal";
  style?: object;
}) => {
  return (
    <View
      style={[
        styles.scrollBar,
        orientation === "vertical" && styles.verticalScrollBar,
        orientation === "horizontal" && styles.horizontalScrollBar,
        style,
      ]}
    >
      <View style={styles.scrollThumb} />
    </View>
  );
};
ScrollBar.displayName = "ScrollBar";

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    overflow: "hidden",
  },
  contentContainer: {
    flexGrow: 1,
  },
  scrollBar: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  verticalScrollBar: {
    width: 10,
    right: 0,
    top: 0,
    bottom: 0,
  },
  horizontalScrollBar: {
    height: 10,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollThumb: {
    flex: 1,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
});

export { ScrollArea, ScrollBar };