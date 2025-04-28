import * as React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    style?: object;
  }
>(({ checked = false, onChange, disabled = false, style, ...props }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.checkbox,
        checked && styles.checked,
        disabled && styles.disabled,
        style,
      ]}
      onPress={() => !disabled && onChange?.(!checked)}
      activeOpacity={0.7}
      {...props}
    >
      {checked && (
        <View style={styles.indicator}>
          <Check size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
});
Checkbox.displayName = "Checkbox";

const styles = StyleSheet.create({
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "#007AFF",
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Checkbox };