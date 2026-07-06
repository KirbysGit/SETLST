import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AnimatedWaveform } from "../shared/AnimatedWaveform";
import { InteractiveSurface } from "../shared/InteractiveSurface";
import { PulseDot } from "../shared/PulseDot";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

interface Props {
  presence: PresenceRow | null;
  gym: string | null;
}

export function YourTrackBar({ presence, gym }: Props) {
  const isPlaying = !!presence?.is_playing;

  return (
    <InteractiveSurface
      glowColor={theme.colors.purple}
      disabled
      style={[
        styles.container,
        isPlaying && styles.containerActive,
      ]}
    >
      {isPlaying && (
        <LinearGradient
          colors={["#8B5CF622", "#2EF2C308", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowOverlay}
          pointerEvents="none"
        />
      )}

      <View style={styles.gymRow}>
        <PulseDot color={theme.colors.purple} size={7} active={isPlaying} />
        <Text style={styles.gymText} numberOfLines={1}>
          {gym ?? "No gym set"} · You
        </Text>
        {isPlaying && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}
      </View>

      {presence ? (
        <View style={styles.trackRow}>
          <View style={[styles.albumWrap, isPlaying && styles.albumWrapActive]}>
            {presence.album_art ? (
              <Image source={{ uri: presence.album_art }} style={styles.albumArt} />
            ) : (
              <View style={[styles.albumArt, styles.albumArtFallback]}>
                <Text style={styles.albumArtText}>{presence.track_name[0]}</Text>
              </View>
            )}
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.trackName} numberOfLines={1}>
              {presence.track_name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {presence.artist}
            </Text>
          </View>

          <View style={styles.statusArea}>
            {isPlaying ? (
              <AnimatedWaveform active color={theme.colors.purple} />
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
    </InteractiveSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface + "EE",
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.purple + "45",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: 10,
    shadowColor: theme.colors.purple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  containerActive: {
    borderColor: theme.colors.purple + "90",
    shadowOpacity: 0.22,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.lg,
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gymText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 11,
    fontFamily: theme.fonts.extrabold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.purple + "22",
    borderWidth: 1,
    borderColor: theme.colors.purple + "55",
  },
  liveBadgeText: {
    color: theme.colors.purple,
    fontSize: 9,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 1.2,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  albumWrap: {
    borderRadius: 10,
    padding: 2,
  },
  albumWrapActive: {
    backgroundColor: theme.colors.purple + "35",
    shadowColor: theme.colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
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
    fontFamily: theme.fonts.extrabold,
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
  },
  trackName: {
    color: theme.colors.text,
    fontSize: 15,
    fontFamily: theme.fonts.extrabold,
  },
  artistName: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    marginTop: 2,
  },
  statusArea: {
    alignItems: "flex-end",
    justifyContent: "center",
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
    fontFamily: theme.fonts.bold,
  },
  emptyTrack: {
    paddingVertical: 4,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.medium,
  },
});
