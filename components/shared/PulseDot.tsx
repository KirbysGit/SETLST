import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "../../constants/theme";

interface Props {
  color?: string;
  size?: number;
  active?: boolean;
  style?: ViewStyle;
}

export function PulseDot({
  color = theme.colors.purple,
  size = 7,
  active = true,
  style,
}: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const ring = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!active) {
      pulse.setValue(1);
      ring.setValue(0);
      return;
    }

    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0.6,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    dotLoop.start();
    ringLoop.start();

    return () => {
      dotLoop.stop();
      ringLoop.stop();
    };
  }, [active, pulse, ring]);

  const radius = size / 2;

  return (
    <View style={[styles.wrap, { width: size + 8, height: size + 8 }, style]}>
      {active && (
        <Animated.View
          style={[
            styles.ring,
            {
              width: size + 8,
              height: size + 8,
              borderRadius: (size + 8) / 2,
              borderColor: color,
              opacity: ring,
              transform: [
                {
                  scale: ring.interpolate({
                    inputRange: [0, 0.6],
                    outputRange: [1.8, 1],
                  }),
                },
              ],
            },
          ]}
        />
      )}
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: active ? color : theme.colors.border,
            opacity: active ? pulse : 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
  },
  dot: {},
});
