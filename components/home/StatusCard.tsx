import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";
import { Card } from "../shared/Card";
import { Pill } from "../shared/Pill";

type StatusCardProps = {
  accentColor?: string;
  accentTone?: "teal" | "purple";
};

export function StatusCard({
  accentColor = theme.colors.teal,
  accentTone = "teal"
}: StatusCardProps) {
  return (
    <Card style={[styles.card, { borderColor: accentColor }]}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Pill label="Visible" tone={accentTone} />
          <Text style={styles.title}>Open to Chat</Text>
          <Text style={styles.helper}>Visible to nearby gym members</Text>
        </View>

        <View
          style={[styles.toggle, { borderColor: accentColor, backgroundColor: `${accentColor}24` }]}
          accessibilityRole="switch"
          accessibilityState={{ checked: true }}
        >
          <View style={[styles.toggleKnob, { backgroundColor: accentColor }]} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.elevated,
    marginBottom: theme.spacing.lg
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg
  },
  copy: {
    flex: 1,
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    lineHeight: 27,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.semibold,
    letterSpacing: 0
  },
  toggle: {
    width: 58,
    height: 34,
    borderRadius: 18,
    backgroundColor: "rgba(46, 242, 195, 0.18)",
    borderWidth: 1,
    borderColor: theme.colors.teal,
    padding: 3,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.teal
  }
});
