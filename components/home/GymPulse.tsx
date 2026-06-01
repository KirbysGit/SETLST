import { StyleSheet, Text, View } from "react-native";
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

  // Top artist across all presence rows
  const artistCounts: Record<string, number> = {};
  allRows.forEach((r) => {
    if (!r.artist) return;
    const primary = r.artist.split(",")[0].trim();
    artistCounts[primary] = (artistCounts[primary] ?? 0) + 1;
  });
  const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <View style={styles.container}>
      {/* Left — live count */}
      <View style={styles.section}>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
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

      {/* Right — top artist */}
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  section: {
    flex: 1,
    gap: 3,
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.purple,
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
  },
});
