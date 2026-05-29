import { StyleSheet, Text, View } from "react-native";

import { weeklyProgress } from "../../constants/mockData";
import { theme } from "../../constants/theme";
import { Card } from "../shared/Card";

export function StreakCard() {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Training rhythm</Text>
          <Text style={styles.title}>4-week streak</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3/4</Text>
        </View>
      </View>

      <Text style={styles.helper}>This week: 3/4 visits</Text>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.days}>
        {weeklyProgress.map((item, index) => (
          <View
            key={`${item.day}-${index}`}
            style={[styles.day, item.done && styles.dayDone]}
          >
            <Text style={[styles.dayLabel, item.done && styles.dayLabelDone]}>{item.day}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  kicker: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0,
    marginBottom: 4
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    lineHeight: 23,
    fontWeight: "900",
    letterSpacing: 0
  },
  badge: {
    minWidth: 48,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255, 176, 32, 0.14)",
    borderWidth: 1,
    borderColor: theme.colors.orange
  },
  badgeText: {
    color: theme.colors.orange,
    fontSize: theme.typography.small,
    fontWeight: "900",
    letterSpacing: 0
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "600",
    letterSpacing: 0,
    marginBottom: theme.spacing.md
  },
  progressTrack: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.elevated,
    overflow: "hidden",
    marginBottom: theme.spacing.md
  },
  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: theme.colors.orange,
    borderRadius: theme.radius.pill
  },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm
  },
  day: {
    flex: 1,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  dayDone: {
    borderColor: theme.colors.orange,
    backgroundColor: "rgba(255, 176, 32, 0.13)"
  },
  dayLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    fontWeight: "900",
    letterSpacing: 0
  },
  dayLabelDone: {
    color: theme.colors.orange
  }
});
