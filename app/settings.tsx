import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { Screen } from "../components/layout/Screen";
import { ActionButton } from "../components/shared/ActionButton";
import { theme } from "../constants/theme";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        Notification, visibility, music, and gym preferences can be connected here later.
      </Text>
      <ActionButton label="Back" variant="primary" onPress={() => router.back()} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center"
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: theme.spacing.sm
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: 0,
    marginBottom: theme.spacing.xl
  },
  button: {
    alignSelf: "flex-start"
  }
});
