import { StyleSheet, Text } from "react-native";

import { Screen } from "../../components/layout/Screen";
import { theme } from "../../constants/theme";

export default function MessagesScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.description}>
        Message requests and low-pressure chats will be added after auth and presence.
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
