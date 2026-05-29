import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "../../components/shared/Avatar";
import { Screen } from "../../components/layout/Screen";
import { theme } from "../../constants/theme";

export default function ProfileScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.profileTop}>
        <Avatar name="SETLST User" color="#214C44" accentColor={theme.colors.teal} size={70} />
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.handle}>@setlst.member</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Streaks, favorite training tracks, and discoverability controls will live here.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center"
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: 0
  },
  handle: {
    color: theme.colors.teal,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontWeight: "800",
    letterSpacing: 0
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: 0
  }
});
