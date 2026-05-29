import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { theme } from "../../constants/theme";

type AppHeaderProps = {
  eyebrow?: string;
  accentColor?: string;
};

export function AppHeader({
  eyebrow = "Crunch Fitness - Active Now",
  accentColor = theme.colors.teal
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.wordmark}>SETLST</Text>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={styles.iconButton}>
          <View style={[styles.notificationDot, { backgroundColor: accentColor }]} />
          <Text style={styles.iconText}>!</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push("/settings")}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>ST</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  },
  wordmark: {
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: 0
  },
  eyebrow: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "600",
    letterSpacing: 0
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  iconText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.teal
  }
});
