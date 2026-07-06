import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../constants/theme";

type GradientButtonProps = {
  label?: string;
  icon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  size?: "lg" | "md" | "sm" | "icon";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function GradientButton({
  label,
  icon,
  onPress,
  disabled = false,
  size = "lg",
  style,
  textStyle,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, sizeStyles[size].wrapper, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={theme.gradients.brand}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyles[size].gradient]}
      >
        {icon}
        {label != null && (
          <Text style={[styles.label, sizeStyles[size].label, textStyle]}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.4,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    color: theme.colors.background,
    fontFamily: theme.fonts.extrabold,
  },
});

const sizeStyles = {
  lg: StyleSheet.create({
    wrapper: { borderRadius: 14, width: "100%" },
    gradient: { paddingVertical: 16 },
    label: { fontSize: 16, letterSpacing: 1 },
  }),
  md: StyleSheet.create({
    wrapper: { borderRadius: 12 },
    gradient: { paddingHorizontal: 24, paddingVertical: 11 },
    label: { fontSize: 14 },
  }),
  sm: StyleSheet.create({
    wrapper: { borderRadius: 10 },
    gradient: { paddingHorizontal: 16, paddingVertical: 8 },
    label: { fontSize: 13 },
  }),
  icon: StyleSheet.create({
    wrapper: { borderRadius: 20 },
    gradient: { width: 40, height: 40 },
    label: { fontSize: 14 },
  }),
} as const;
