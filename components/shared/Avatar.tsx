import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../constants/theme";

type AvatarProps = {
  name: string;
  imageUrl?: string | null;
  color?: string;
  accentColor?: string;
  size?: number;
};

function getInitials(name: string) {
  return name
    .split(/[.\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, imageUrl, color, accentColor = theme.colors.teal, size = 48 }: AvatarProps) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={shape} />;
  }

  // Solid-color variant (legacy API, used by dashboard mock cards)
  if (color) {
    return (
      <View style={[styles.solid, shape, { backgroundColor: color, borderColor: accentColor }]}>
        <Text style={[styles.initials, { fontSize: Math.max(12, size * 0.34) }]}>
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  // Default: brand-gradient initials
  return (
    <LinearGradient
      colors={theme.gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, shape]}
    >
      <Text style={[styles.gradientInitials, { fontSize: Math.max(12, size * 0.32) }]}>
        {getInitials(name)}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  solid: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center"
  },
  initials: {
    color: theme.colors.text,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  gradientInitials: {
    color: theme.colors.background,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  }
});
