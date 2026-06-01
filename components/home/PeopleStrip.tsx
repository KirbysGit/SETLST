import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

interface Props {
  others: PresenceRow[];
}

function PersonBubble({ row }: { row: PresenceRow }) {
  const initials = row.display_name?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <TouchableOpacity style={styles.bubble} activeOpacity={0.75}>
      {/* Avatar */}
      <View style={[styles.avatar, row.is_playing && styles.avatarActive]}>
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={[
          styles.statusDot,
          row.is_playing ? styles.statusActive : styles.statusPaused
        ]} />
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {row.display_name?.split(" ")[0] ?? "User"}
      </Text>

      {/* Track */}
      <Text style={styles.track} numberOfLines={1}>
        {row.track_name}
      </Text>
    </TouchableOpacity>
  );
}

export function PeopleStrip({ others }: Props) {
  if (others.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>At your gym</Text>
        <Text style={styles.title}>People Listening</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {others.map((row) => (
          <PersonBubble key={row.user_id} row={row} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  kicker: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    fontWeight: "900",
  },
  strip: {
    gap: 14,
    paddingRight: theme.spacing.lg,
  },
  bubble: {
    width: 76,
    alignItems: "center",
    gap: 5,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.elevated,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarActive: {
    borderColor: theme.colors.purple,
    backgroundColor: theme.colors.purple + "25",
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  statusDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  statusActive: {
    backgroundColor: theme.colors.purple,
  },
  statusPaused: {
    backgroundColor: theme.colors.textSubtle,
  },
  name: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    width: "100%",
  },
  track: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
});
