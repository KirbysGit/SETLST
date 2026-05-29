import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

type AvatarProps = {
  name: string;
  color: string;
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

export function Avatar({ name, color, accentColor = theme.colors.teal, size = 48 }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderColor: accentColor
        }
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.max(12, size * 0.34) }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5
  },
  initials: {
    color: theme.colors.text,
    fontWeight: "900",
    letterSpacing: 0
  }
});
