import { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { theme } from "../../constants/theme";

interface Props extends Omit<PressableProps, "style"> {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  glowColor?: string;
  children: ReactNode;
}

export function InteractiveSurface({
  style,
  pressedStyle,
  glowColor = theme.colors.purple,
  children,
  ...rest
}: Props) {
  return (
    <Pressable
      {...rest}
      style={({ pressed, hovered }) => [
        styles.base,
        style,
        (pressed || hovered) && [
          styles.interactive,
          glowColor ? { borderColor: glowColor + "70", shadowColor: glowColor } : null,
          pressedStyle,
        ],
        pressed ? styles.pressed : hovered ? styles.hovered : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  interactive: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  hovered: {
    transform: [{ scale: 1.012 }],
  },
});
