import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";

const Switch = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    style?: object;
  }
>(({ value = false, onValueChange, disabled = false, style, ...props }, ref) => {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.switch,
        value ? styles.switchChecked : styles.switchUnchecked,
        disabled && styles.switchDisabled,
        style,
      ]}
      onPress={() => !disabled && onValueChange?.(!value)}
      activeOpacity={0.7}
      {...props}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
});
Switch.displayName = "Switch";

const styles = StyleSheet.create({
  switch: {
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "#ccc",
    paddingHorizontal: 2,
  },
  switchChecked: {
    backgroundColor: "#007AFF",
  },
  switchUnchecked: {
    backgroundColor: "#ccc",
  },
  switchDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export { Switch };