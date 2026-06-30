import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../constants/theme";

export function HomeBackground() {
  const pulseA = useRef(new Animated.Value(0.55)).current;
  const pulseB = useRef(new Animated.Value(0.45)).current;
  const pulseC = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = (value: Animated.Value, min: number, max: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: max,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: min,
            duration,
            useNativeDriver: true,
          }),
        ])
      );

    const a = loop(pulseA, 0.45, 0.75, 4200);
    const b = loop(pulseB, 0.35, 0.65, 5600);
    const c = loop(pulseC, 0.25, 0.55, 6800);

    a.start();
    b.start();
    c.start();

    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [pulseA, pulseB, pulseC]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <LinearGradient
        colors={["#0B1020", theme.colors.background, "#05070B"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.orb, styles.orbPurple, { opacity: pulseA }]}>
        <LinearGradient
          colors={["#8B5CF640", "#8B5CF600"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orbTeal, { opacity: pulseB }]}>
        <LinearGradient
          colors={["#2EF2C330", "#2EF2C300"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orbBlue, { opacity: pulseC }]}>
        <LinearGradient
          colors={["#4EA1FF25", "#4EA1FF00"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <LinearGradient
        colors={["transparent", "transparent", "#05070B88"]}
        locations={[0, 0.65, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    overflow: "hidden",
  },
  orbPurple: {
    width: 320,
    height: 320,
    top: -80,
    right: -100,
  },
  orbTeal: {
    width: 260,
    height: 260,
    top: 180,
    left: -120,
  },
  orbBlue: {
    width: 220,
    height: 220,
    bottom: 120,
    right: -60,
  },
});
