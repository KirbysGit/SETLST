import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { theme } from "../../constants/theme";

type PillTone = "teal" | "purple" | "blue" | "orange" | "muted";

type PillProps = {
  label: string;
  tone?: PillTone;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const toneColors: Record<PillTone, string> = {
  teal: theme.colors.teal,
  purple: theme.colors.purple,
  blue: theme.colors.blue,
  orange: theme.colors.orange,
  muted: theme.colors.textMuted
};

export function Pill({ label, tone = "muted", style, textStyle }: PillProps) {
  const color = toneColors[tone];

  return (
    <View style={[styles.pill, { borderColor: color }, style]}>
      <Text style={[styles.label, { color }, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.03)"
  },
  label: {
    fontSize: theme.typography.micro,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase"
  }
});
