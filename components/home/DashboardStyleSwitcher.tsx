import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";
import { DashboardStyle, useDashboardStyle } from "../../contexts/DashboardStyleContext";

const options: Array<{ label: string; value: DashboardStyle }> = [
  { label: "Map", value: "map" },
  { label: "Music", value: "music" }
];

export function DashboardStyleSwitcher() {
  const { dashboardStyle, setDashboardStyle } = useDashboardStyle();
  const activeColor = dashboardStyle === "music" ? theme.colors.purple : theme.colors.teal;

  return (
    <View style={[styles.container, { borderColor: activeColor }]}>
      <Text style={styles.label}>Dev layout</Text>
      <View style={styles.controls}>
        {options.map((option) => {
          const active = dashboardStyle === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              onPress={() => setDashboardStyle(option.value)}
              style={[
                styles.option,
                active && { backgroundColor: activeColor, borderColor: activeColor }
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 14,
    bottom: 98,
    zIndex: 20,
    width: 142,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: "rgba(5, 7, 11, 0.92)",
    padding: theme.spacing.sm
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
    marginBottom: theme.spacing.xs
  },
  controls: {
    flexDirection: "row",
    gap: theme.spacing.xs
  },
  option: {
    flex: 1,
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface
  },
  optionText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  optionTextActive: {
    color: theme.colors.black
  }
});
