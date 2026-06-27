import { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  DimensionValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../constants/theme";

const SHIMMER_TRAVEL = 360;

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = "100%",
  height = 14,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const translateX = useRef(new Animated.Value(-SHIMMER_TRAVEL)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: SHIMMER_TRAVEL,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -SHIMMER_TRAVEL,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [translateX]);

  return (
    <View style={[styles.bone, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmerWrap, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255,0.04)",
            "rgba(255,255,255,0.10)",
            "rgba(255,255,255,0.04)",
            "transparent",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
}

export function SkeletonCircle({
  size = 48,
  style,
}: {
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
}

export function SkeletonCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  bone: {
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  shimmerWrap: {
    ...StyleSheet.absoluteFillObject,
    width: SHIMMER_TRAVEL,
  },
  shimmerGradient: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.surface + "EE",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    overflow: "hidden",
  },
});
