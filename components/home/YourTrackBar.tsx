import { Image, StyleSheet, Text, View } from "react-native";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

interface Props {
  presence: PresenceRow | null;
  gym: string | null;
}

function Waveform({ active }: { active: boolean }) {
  const bars = [10, 18, 14, 22, 16, 26, 20, 14, 18, 12];
  return (
    <View style={styles.waveform}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={[
            styles.waveBar,
            {
              height: active ? h : 4,
              backgroundColor: active ? theme.colors.purple : theme.colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function YourTrackBar({ presence, gym }: Props) {
  return (
    <View style={styles.container}>
      {/* Gym label */}
      <View style={styles.gymRow}>
        <View style={[styles.dot, presence?.is_playing && styles.dotActive]} />
        <Text style={styles.gymText} numberOfLines={1}>
          {gym ?? "No gym set"} · You
        </Text>
      </View>

      {presence ? (
        <View style={styles.trackRow}>
          {/* Album art */}
          {presence.album_art ? (
            <Image source={{ uri: presence.album_art }} style={styles.albumArt} />
          ) : (
            <View style={[styles.albumArt, styles.albumArtFallback]}>
              <Text style={styles.albumArtText}>{presence.track_name[0]}</Text>
            </View>
          )}

          {/* Track info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackName} numberOfLines={1}>
              {presence.track_name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {presence.artist}
            </Text>
          </View>

          {/* Waveform / paused */}
          <View style={styles.statusArea}>
            {presence.is_playing ? (
              <Waveform active />
            ) : (
              <View style={styles.pausedBadge}>
                <Text style={styles.pausedText}>paused</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.emptyTrack}>
          <Text style={styles.emptyText}>Open Spotify to share your track</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.purple + "60",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: 10,
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    backgroundColor: theme.colors.purple,
  },
  gymText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  albumArtFallback: {
    backgroundColor: theme.colors.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  albumArtText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
  },
  trackName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0,
  },
  artistName: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  statusArea: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 28,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    opacity: 0.9,
  },
  pausedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pausedText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  emptyTrack: {
    paddingVertical: 4,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
});
