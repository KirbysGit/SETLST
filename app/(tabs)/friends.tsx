import { StyleSheet, Text } from "react-native";

import { Screen } from "../../components/layout/Screen";
import { theme } from "../../constants/theme";

export default function FriendsScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={styles.title}>Friends</Text>
      <Text style={styles.description}>
        A light list of gym friends and active connections will live here.
      </Text>
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
    letterSpacing: 0
  }
});
