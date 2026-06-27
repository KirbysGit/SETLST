import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "../../constants/theme";

const DEFAULT_HEIGHTS = [8, 16, 12, 20, 14, 24, 18, 12, 16, 10];

interface Props {
  active?: boolean;
  color?: string;
  heights?: number[];
  style?: ViewStyle;
}

export function AnimatedWaveform({
  active = true,
  color = theme.colors.purple,
  heights = DEFAULT_HEIGHTS,
  style,
}: Props) {
  const scales = useRef(heights.map(() => new Animated.Value(0.35))).current;

  useEffect(() => {
    if (!active) {
      scales.forEach((scale) => scale.setValue(0.2));
      return;
    }

    const loops = scales.map((scale, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 320 + index * 55,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.35,
            duration: 320 + index * 55,
            useNativeDriver: true,
          }),
        ])
      )
    );

    loops.forEach((loop) => loop.start());

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [active, scales]);

  return (
    <View style={[styles.container, style]}>
      {heights.map((height, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height,
              backgroundColor: active ? color : theme.colors.border,
              opacity: active ? 0.9 : 0.5,
              transform: [{ scaleY: scales[index] }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 28,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
});
