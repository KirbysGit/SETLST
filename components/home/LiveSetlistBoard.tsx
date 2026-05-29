import { StyleSheet, Text, View } from "react-native";

import { MockUser } from "../../constants/mockData";
import { theme } from "../../constants/theme";
import { Avatar } from "../shared/Avatar";
import { Card } from "../shared/Card";
import { Pill } from "../shared/Pill";

type LiveSetlistBoardProps = {
  users: MockUser[];
};

const bubblePositions = [
  { top: 36, left: 18 },
  { top: 24, right: 18 },
  { top: 118, left: 86 },
  { bottom: 26, left: 18 },
  { bottom: 30, right: 18 }
];

export function LiveSetlistBoard({ users }: LiveSetlistBoardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Presence board</Text>
          <Text style={styles.title}>Your Gym's Live Setlist</Text>
        </View>
        <Pill label={`${users.length} active`} tone="blue" />
      </View>

      <View style={styles.board}>
        <View style={[styles.decorDot, styles.decorDotOne]} />
        <View style={[styles.decorDot, styles.decorDotTwo]} />
        <View style={[styles.decorDot, styles.decorDotThree]} />
        <View style={styles.boardLine} />

        {users.slice(0, 5).map((user, index) => (
          <View key={user.id} style={[styles.userBubble, bubblePositions[index]]}>
            <Avatar
              name={user.displayName}
              color={user.avatarColor}
              accentColor={user.accentColor}
              size={48}
            />
            <View style={styles.songTag}>
              <Text style={styles.songText} numberOfLines={1}>
                {user.displayName} - {user.song}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.lg
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
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
  board: {
    height: 282,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.black
  },
  boardLine: {
    position: "absolute",
    left: 46,
    right: 46,
    top: 140,
    height: 1,
    backgroundColor: "rgba(143, 152, 168, 0.16)"
  },
  decorDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.12)"
  },
  decorDotOne: {
    top: 58,
    left: "48%"
  },
  decorDotTwo: {
    right: 70,
    bottom: 92,
    backgroundColor: "rgba(78, 161, 255, 0.24)"
  },
  decorDotThree: {
    left: 58,
    bottom: 96,
    backgroundColor: "rgba(46, 242, 195, 0.22)"
  },
  userBubble: {
    position: "absolute",
    width: 128,
    alignItems: "center",
    gap: theme.spacing.sm
  },
  songTag: {
    maxWidth: 128,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(17, 22, 32, 0.92)",
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  songText: {
    color: theme.colors.text,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    letterSpacing: 0
  }
});
