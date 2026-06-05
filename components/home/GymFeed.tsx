import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyGymState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyFace}>:(</Text>
      <Text style={styles.emptyTitle}>No other Setlsters here yet</Text>
      <Text style={styles.emptySubtitle}>
        Invite friends to join so you can see what everyone's lifting to.
      </Text>
      <View style={styles.inviteChip}>
        <Text style={styles.inviteText}>✉  Invite friends</Text>
      </View>
    </View>
  );
}

// ─── Single feed row ──────────────────────────────────────────────────────────
function FeedRow({ row }: { row: PresenceRow }) {
  const initials = row.display_name?.slice(0, 2).toUpperCase() ?? "??";
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.row, !row.is_playing && styles.rowPaused]}
      onPress={() => router.push(`/user/${row.user_id}`)}
      activeOpacity={0.75}
    >
      {/* Avatar */}
      <View style={[styles.avatar, !row.is_playing && styles.avatarPaused]}>
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={[styles.statusDot, row.is_playing ? styles.statusDotActive : styles.statusDotPaused]} />
      </View>

      {/* Album art */}
      {row.album_art ? (
        <Image
          source={{ uri: row.album_art }}
          style={[styles.albumArt, !row.is_playing && styles.albumArtPaused]}
        />
      ) : (
        <View style={[styles.albumArt, styles.albumArtFallback, !row.is_playing && styles.albumArtPaused]}>
          <Text style={styles.albumFallbackText}>{row.track_name?.[0] ?? "♪"}</Text>
        </View>
      )}

      {/* Track info */}
      <View style={styles.info}>
        <Text style={[styles.trackName, !row.is_playing && styles.textPaused]} numberOfLines={1}>
          {row.track_name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {row.artist} · {row.display_name}
        </Text>
      </View>

      {/* Status */}
      {row.is_playing ? (
        <Waveform />
      ) : (
        <View style={styles.pausedBadge}>
          <Text style={styles.pausedText}>paused</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function Waveform() {
  const bars = [8, 16, 12, 20, 14, 24, 18, 12];
  return (
    <View style={styles.waveform}>
      {bars.map((h, i) => (
        <View key={i} style={[styles.waveBar, { height: h }]} />
      ))}
    </View>
  );
}

// ─── Full feed ────────────────────────────────────────────────────────────────
interface Props {
  others: PresenceRow[];
}

export function GymFeed({ others }: Props) {
  return (
    <View style={styles.feed}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Live at your gym</Text>
          <Text style={styles.title}>Fellow Setlsters</Text>
        </View>
        <View style={styles.countBadge}>
          <View style={styles.countDot} />
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
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  countDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.purple,
  },
  countText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  rows: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rowPaused: {
    opacity: 0.55,
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
    fontWeight: "800",
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
    fontWeight: "900",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  trackName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  textPaused: {
    color: theme.colors.textMuted,
  },
  artistName: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 26,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.purple,
    opacity: 0.85,
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
    fontWeight: "700",
  },
  // ── Empty state ──────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyFace: {
    fontSize: 40,
    color: theme.colors.textMuted,
    fontWeight: "900",
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  emptySubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
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
    backgroundColor: theme.colors.purple + "15",
  },
  inviteText: {
    color: theme.colors.purple,
    fontSize: 14,
    fontWeight: "700",
  },
});
