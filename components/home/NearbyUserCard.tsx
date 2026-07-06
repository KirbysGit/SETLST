import { StyleSheet, Text, View } from "react-native";

import { MockUser } from "../../constants/mockData";
import { theme } from "../../constants/theme";
import { ActionButton } from "../shared/ActionButton";
import { Avatar } from "../shared/Avatar";
import { Card } from "../shared/Card";
import { Pill } from "../shared/Pill";

type NearbyUserCardProps = {
  user: MockUser;
};

export function NearbyUserCard({ user }: NearbyUserCardProps) {
  const isOpen = user.status === "Open";

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Avatar
          name={user.displayName}
          color={user.avatarColor}
          accentColor={user.accentColor}
          size={50}
        />

        <View style={styles.copy}>
          <View style={styles.nameRow}>
            <Text style={styles.username} numberOfLines={1}>
              {user.username}
            </Text>
            <Pill label={user.status} tone={isOpen ? "teal" : "muted"} />
          </View>
          <Text style={styles.song} numberOfLines={1}>
            {user.song}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {user.artist}
          </Text>
        </View>

        <ActionButton label={isOpen ? "Wave" : "Add"} variant={isOpen ? "primary" : "ghost"} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: 5
  },
  username: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body,
    lineHeight: 19,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  song: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.bold,
    letterSpacing: 0
  },
  artist: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.semibold,
    letterSpacing: 0
  }
});
