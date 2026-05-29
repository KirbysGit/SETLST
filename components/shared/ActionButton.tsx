import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

import { theme } from "../../constants/theme";

type ActionButtonVariant = "primary" | "subtle" | "ghost";

type ActionButtonProps = {
  label: string;
  variant?: ActionButtonVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function ActionButton({
  label,
  variant = "subtle",
  onPress,
  style,
  textStyle
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`], textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    borderWidth: 1
  },
  primary: {
    backgroundColor: theme.colors.teal,
    borderColor: theme.colors.teal
  },
  subtle: {
    backgroundColor: theme.colors.elevated,
    borderColor: theme.colors.border
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: theme.colors.border
  },
  label: {
    fontSize: theme.typography.small,
    fontWeight: "800",
    letterSpacing: 0
  },
  primaryLabel: {
    color: theme.colors.black
  },
  subtleLabel: {
    color: theme.colors.text
  },
  ghostLabel: {
    color: theme.colors.textMuted
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  }
});
