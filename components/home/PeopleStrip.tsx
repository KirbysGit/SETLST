import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { InteractiveSurface } from "../shared/InteractiveSurface";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

interface Props {
  others: PresenceRow[];
}

function PersonBubble({ row }: { row: PresenceRow }) {
  const initials = row.display_name?.slice(0, 2).toUpperCase() ?? "??";
  const router = useRouter();
  const isPlaying = row.is_playing;

  return (
    <InteractiveSurface
      onPress={() => router.push(`/user/${row.user_id}`)}
      glowColor={isPlaying ? theme.colors.purple : theme.colors.blue}
      style={styles.bubble}
      pressedStyle={styles.bubblePressed}
    >
      <View style={[styles.avatar, isPlaying && styles.avatarActive]}>
        {isPlaying && (
          <LinearGradient
            colors={["#8B5CF640", "#2EF2C320"]}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={styles.avatarText}>{initials}</Text>
        <View
          style={[
            styles.statusDot,
            isPlaying ? styles.statusActive : styles.statusPaused,
          ]}
        />
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {row.display_name?.split(" ")[0] ?? "User"}
      </Text>

      <Text style={[styles.track, isPlaying && styles.trackActive]} numberOfLines={1}>
        {row.track_name}
      </Text>
    </InteractiveSurface>
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
        decelerationRate="fast"
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
    gap: 12,
    paddingRight: theme.spacing.lg,
    paddingVertical: 4,
  },
  bubble: {
    width: 82,
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface + "AA",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bubblePressed: {
    backgroundColor: theme.colors.elevated,
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
    overflow: "hidden",
  },
  avatarActive: {
    borderColor: theme.colors.purple,
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
  trackActive: {
    color: theme.colors.purple,
    fontWeight: "700",
  },
});
