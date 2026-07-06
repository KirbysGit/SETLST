import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { AnimatedWaveform } from "../shared/AnimatedWaveform";
import { InteractiveSurface } from "../shared/InteractiveSurface";
import { PulseDot } from "../shared/PulseDot";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

export function EmptyGymState() {
  return (
    <InteractiveSurface
      glowColor={theme.colors.teal}
      style={styles.emptyContainer}
      pressedStyle={styles.emptyPressed}
    >
      <LinearGradient
        colors={["#8B5CF612", "#2EF2C308"]}
        style={styles.emptyGlow}
        pointerEvents="none"
      />
      <Text style={styles.emptyEmoji}>♪</Text>
      <Text style={styles.emptyTitle}>No other Setlsters here yet</Text>
      <Text style={styles.emptySubtitle}>
        Invite friends to join so you can see what everyone's lifting to.
      </Text>
      <View style={styles.inviteChip}>
        <Text style={styles.inviteText}>Invite friends</Text>
      </View>
    </InteractiveSurface>
  );
}

function FeedRow({ row }: { row: PresenceRow }) {
  const initials = row.display_name?.slice(0, 2).toUpperCase() ?? "??";
  const router = useRouter();
  const isPlaying = row.is_playing;

  return (
    <InteractiveSurface
      onPress={() => router.push(`/user/${row.user_id}`)}
      glowColor={isPlaying ? theme.colors.purple : theme.colors.blue}
      style={[styles.row, !isPlaying && styles.rowPaused]}
      pressedStyle={styles.rowPressed}
    >
      {isPlaying && (
        <LinearGradient
          colors={["#8B5CF614", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.rowSheen}
          pointerEvents="none"
        />
      )}

      <View style={[styles.avatar, !isPlaying && styles.avatarPaused]}>
        <Text style={styles.avatarText}>{initials}</Text>
        <View
          style={[
            styles.statusDot,
            isPlaying ? styles.statusDotActive : styles.statusDotPaused,
          ]}
        />
      </View>

      {row.album_art ? (
        <Image
          source={{ uri: row.album_art }}
          style={[styles.albumArt, !isPlaying && styles.albumArtPaused]}
        />
      ) : (
        <View
          style={[
            styles.albumArt,
            styles.albumArtFallback,
            !isPlaying && styles.albumArtPaused,
          ]}
        >
          <Text style={styles.albumFallbackText}>{row.track_name?.[0] ?? "♪"}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text
          style={[styles.trackName, !isPlaying && styles.textPaused]}
          numberOfLines={1}
        >
          {row.track_name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {row.artist} · {row.display_name}
        </Text>
      </View>

      {isPlaying ? (
        <AnimatedWaveform active color={theme.colors.purple} />
      ) : (
        <View style={styles.pausedBadge}>
          <Text style={styles.pausedText}>paused</Text>
        </View>
      )}
    </InteractiveSurface>
  );
}

interface Props {
  others: PresenceRow[];
}

export function GymFeed({ others }: Props) {
  const activeCount = others.filter((r) => r.is_playing).length;

  return (
    <View style={styles.feed}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Live at your gym</Text>
          <Text style={styles.title}>Fellow Setlsters</Text>
        </View>
        <View style={styles.countBadge}>
          <PulseDot color={theme.colors.purple} size={6} active={activeCount > 0} />
          <Text style={styles.countText}>{others.length} active</Text>
        </View>
      </View>

      {others.length === 0 ? (
        <EmptyGymState />
      ) : (
        <View style={styles.rows}>
          {others.map((row) => (
            <FeedRow key={row.user_id} row={row} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {
    marginBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  kicker: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    fontFamily: theme.fonts.extrabold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    fontFamily: theme.fonts.extrabold,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.surface + "DD",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  countText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  rows: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surface + "EE",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  rowPaused: {
    opacity: 0.72,
  },
  rowPressed: {
    backgroundColor: theme.colors.elevated,
  },
  rowSheen: {
    ...StyleSheet.absoluteFillObject,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.purple + "30",
    borderWidth: 1.5,
    borderColor: theme.colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPaused: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.elevated,
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: 13,
    fontFamily: theme.fonts.extrabold,
  },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  statusDotActive: {
    backgroundColor: theme.colors.purple,
  },
  statusDotPaused: {
    backgroundColor: theme.colors.textSubtle,
  },
  albumArt: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  albumArtPaused: {
    opacity: 0.5,
  },
  albumArtFallback: {
    backgroundColor: theme.colors.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  albumFallbackText: {
    color: theme.colors.text,
    fontSize: 18,
    fontFamily: theme.fonts.extrabold,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  trackName: {
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.extrabold,
  },
  textPaused: {
    color: theme.colors.textMuted,
  },
  artistName: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    marginTop: 2,
  },
  pausedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pausedText: {
    color: theme.colors.textSubtle,
    fontSize: 10,
    fontFamily: theme.fonts.bold,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    gap: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    backgroundColor: theme.colors.surface + "88",
    overflow: "hidden",
  },
  emptyPressed: {
    borderColor: theme.colors.teal + "80",
  },
  emptyGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  emptyEmoji: {
    fontSize: 36,
    color: theme.colors.purple,
    fontFamily: theme.fonts.extrabold,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.extrabold,
    textAlign: "center",
  },
  emptySubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
  inviteChip: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    borderWidth: 1.5,
    borderColor: theme.colors.purple,
    backgroundColor: theme.colors.purple + "18",
  },
  inviteText: {
    color: theme.colors.purple,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
});
