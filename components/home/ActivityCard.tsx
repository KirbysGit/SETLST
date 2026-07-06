import { StyleSheet, Text, View } from "react-native";

import { activityStats } from "../../constants/mockData";
import { theme } from "../../constants/theme";
import { Card } from "../shared/Card";

export function ActivityCard() {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Today on SETLST</Text>
        <Text style={styles.helper}>Light social signals only</Text>
      </View>

      <View style={styles.stats}>
        {activityStats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={[styles.value, { color: stat.accentColor }]}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    lineHeight: 23,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.semibold,
    letterSpacing: 0,
    marginTop: 4
  },
  stats: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  stat: {
    flex: 1,
    minHeight: 78,
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.elevated,
    paddingHorizontal: theme.spacing.sm
  },
  value: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0,
    marginBottom: 3
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    lineHeight: 14,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  }
});
