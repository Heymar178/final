import * as React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-TextInput bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  style?: object;
  onPress?: () => void;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  ({ style, variant = "default", size = "default", onPress, children, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.button,
          style,
          ...buttonVariants({ variant, size })
            .split(" ")
            .map(cls => (cls in styles ? styles[cls as keyof typeof styles] : {}))
        ]}
        onPress={onPress}
        {...props}
      >
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    );
  }
);
Button.displayName = "Button";

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export { Button, buttonVariants };