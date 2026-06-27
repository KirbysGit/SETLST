import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PulseDot } from "../shared/PulseDot";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

interface Props {
  own: PresenceRow | null;
  others: PresenceRow[];
  gym: string | null;
}

export function GymPulse({ own, others, gym }: Props) {
  const allRows = own ? [own, ...others] : others;
  const activeCount = allRows.filter((r) => r.is_playing).length;
  const pausedCount = allRows.filter((r) => !r.is_playing).length;
  const totalCount = allRows.length;
  const hasActivity = activeCount > 0;

  const artistCounts: Record<string, number> = {};
  allRows.forEach((r) => {
    if (!r.artist) return;
    const primary = r.artist.split(",")[0].trim();
    artistCounts[primary] = (artistCounts[primary] ?? 0) + 1;
  });
  const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#111620F2", "#171D29E8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {hasActivity && (
        <LinearGradient
          colors={["#8B5CF618", "transparent", "#2EF2C310"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.activeSheen}
          pointerEvents="none"
        />
      )}

      <View style={styles.section}>
        <View style={styles.liveRow}>
          <PulseDot color={theme.colors.purple} size={7} active={hasActivity} />
          <Text style={styles.liveLabel}>Live now</Text>
        </View>
        <Text style={styles.countText}>
          {totalCount === 0 ? "Just you" : `${totalCount} at ${gym ?? "your gym"}`}
        </Text>
        {totalCount > 0 && (
          <Text style={styles.subText}>
            {activeCount} playing · {pausedCount} paused
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.liveLabel}>Trending artist</Text>
        {topArtist ? (
          <>
            <Text style={styles.countText} numberOfLines={1}>
              {topArtist[0]}
            </Text>
            <Text style={styles.subText}>
              {topArtist[1]} {topArtist[1] === 1 ? "listener" : "listeners"}
            </Text>
          </>
        ) : (
          <Text style={styles.countText}>—</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 3,
  },
  activeSheen: {
    ...StyleSheet.absoluteFillObject,
  },
  section: {
    flex: 1,
    gap: 3,
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  liveLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  countText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  subText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 2,
    opacity: 0.8,
  },
});
