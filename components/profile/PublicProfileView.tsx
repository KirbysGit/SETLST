import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserProfile } from "../../hooks/useProfile";
import { PresenceRow } from "../../hooks/useGymPresence";
import { theme } from "../../constants/theme";

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ profile, size = 80 }: { profile: UserProfile; size?: number }) {
  const initials = profile.display_name?.slice(0, 2).toUpperCase() ?? "??";
  const radius = size / 2;

  if (profile.avatar_url) {
    return (
      <Image
        source={{ uri: profile.avatar_url }}
        style={{ width: size, height: size, borderRadius: radius }}
      />
    );
  }
  return (
    <LinearGradient
      colors={["#2EF2C3", "#8B5CF6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: radius, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ color: theme.colors.background, fontSize: size * 0.32, fontWeight: "900" }}>
        {initials}
      </Text>
    </LinearGradient>
  );
}

// ─── Now playing card ─────────────────────────────────────────────────────────
function NowPlayingCard({ presence }: { presence: PresenceRow }) {
  return (
    <View style={styles.nowPlayingCard}>
      <View style={styles.nowPlayingHeader}>
        <View style={[styles.liveDot, !presence.is_playing && styles.liveDotPaused]} />
        <Text style={[styles.nowPlayingLabel, !presence.is_playing && styles.nowPlayingLabelPaused]}>
          {presence.is_playing ? "Listening now" : "Last played"}
        </Text>
      </View>

      <View style={styles.nowPlayingTrack}>
        {presence.album_art ? (
          <Image source={{ uri: presence.album_art }} style={styles.albumArt} />
        ) : (
          <View style={[styles.albumArt, styles.albumArtFallback]}>
            <Text style={styles.albumArtText}>{presence.track_name?.[0] ?? "♪"}</Text>
          </View>
        )}

        <View style={styles.trackInfo}>
          <Text style={styles.trackName} numberOfLines={1}>{presence.track_name}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{presence.artist}</Text>
        </View>

        {presence.is_playing && (
          <View style={styles.waveform}>
            {[10, 18, 12, 22, 16].map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: h }]} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function RowDivider() {
  return <View style={styles.rowDivider} />;
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

// ─── Main public profile view ─────────────────────────────────────────────────
interface Props {
  profile: UserProfile;
  presence: PresenceRow | null;
  isOwnProfile?: boolean;
  onWave?: () => void;
  onConnect?: () => void;
}

export function PublicProfileView({
  profile,
  presence,
  isOwnProfile = false,
  onWave,
  onConnect,
}: Props) {
  const privacy = profile.privacy ?? {
    goals_public: true,
    vibe_public: true,
    stats_public: true,
  };

  const hasTraining =
    profile.training_style ||
    profile.primary_goal ||
    profile.gym_frequency ||
    profile.experience_level;

  const hasVibe = profile.vibe || (profile.open_to && profile.open_to.length > 0);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <Avatar profile={profile} size={88} />

        <Text style={styles.displayName}>
          {profile.display_name ?? "Setlster"}
        </Text>

        {profile.username && (
          <Text style={styles.username}>@{profile.username}</Text>
        )}

        <View style={styles.metaRow}>
          {profile.home_gym && (
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>📍 {profile.home_gym}</Text>
            </View>
          )}
          {profile.experience_level && (
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>📈 {profile.experience_level}</Text>
            </View>
          )}
        </View>

        {/* Action buttons — only shown on other people's profiles */}
        {!isOwnProfile && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.waveButton} onPress={onWave} activeOpacity={0.8}>
              <Text style={styles.waveText}>👋  Wave</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.connectButton} onPress={onConnect} activeOpacity={0.8}>
              <LinearGradient
                colors={["#2EF2C3", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.connectGradient}
              >
                <Text style={styles.connectText}>Connect</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Own profile preview banner */}
        {isOwnProfile && (
          <View style={styles.previewBanner}>
            <Text style={styles.previewBannerText}>
              👁  This is how others see your profile
            </Text>
          </View>
        )}
      </View>

      {/* ── Now playing ──────────────────────────────────────────────────── */}
      {presence && <NowPlayingCard presence={presence} />}

      {/* ── Training profile ─────────────────────────────────────────────── */}
      {privacy.goals_public && hasTraining && (
        <Section title="Training Profile">
          <Row label="Style" value={profile.training_style} />
          {profile.training_style && profile.primary_goal && <RowDivider />}
          <Row label="Goal" value={profile.primary_goal} />
          {profile.primary_goal && profile.gym_frequency && <RowDivider />}
          <Row
            label="Frequency"
            value={profile.gym_frequency ? `${profile.gym_frequency} / week` : null}
          />
        </Section>
      )}

      {/* ── Gym vibe ─────────────────────────────────────────────────────── */}
      {privacy.vibe_public && hasVibe && (
        <Section title="Gym Vibe">
          {profile.vibe && (
            <Text style={styles.vibeText}>"{profile.vibe}"</Text>
          )}
          {profile.open_to && profile.open_to.length > 0 && (
            <View style={styles.chipsSection}>
              {profile.vibe && <View style={styles.rowDivider} />}
              <Text style={styles.openToLabel}>Open to</Text>
              <View style={styles.chips}>
                {profile.open_to.map((o) => (
                  <Chip key={o} label={o} />
                ))}
              </View>
            </View>
          )}
        </Section>
      )}

      {/* ── Nothing public notice ─────────────────────────────────────────── */}
      {!hasTraining && !hasVibe && !presence && (
        <View style={styles.emptyNotice}>
          <Text style={styles.emptyNoticeText}>
            {isOwnProfile
              ? "Complete your profile setup so others can get to know you."
              : "This user hasn't filled out their profile yet."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 20,
  },

  // Hero
  hero: {
    alignItems: "center",
    gap: 8,
  },
  displayName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 4,
  },
  username: {
    color: theme.colors.teal,
    fontSize: 14,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 4,
  },
  metaChip: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  waveButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  waveText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  connectButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  connectGradient: {
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 12,
  },
  connectText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
  previewBanner: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.purple + "15",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.purple + "40",
  },
  previewBannerText: {
    color: theme.colors.purple,
    fontSize: 12,
    fontWeight: "600",
  },

  // Now playing
  nowPlayingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    gap: 10,
  },
  nowPlayingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.purple,
  },
  liveDotPaused: {
    backgroundColor: theme.colors.textSubtle,
  },
  nowPlayingLabel: {
    color: theme.colors.purple,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  nowPlayingLabelPaused: {
    color: theme.colors.textMuted,
  },
  nowPlayingTrack: {
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
  },
  trackArtist: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 24,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.purple,
    opacity: 0.85,
  },

  // Sections
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  rowValue: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    maxWidth: "60%",
    textAlign: "right",
  },
  rowDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  vibeText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    paddingHorizontal: 16,
    paddingVertical: 14,
    lineHeight: 21,
  },
  chipsSection: {
    gap: 0,
  },
  openToLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.purple + "15",
    borderWidth: 1,
    borderColor: theme.colors.purple + "40",
  },
  chipText: {
    color: theme.colors.purple,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyNotice: {
    padding: 24,
    alignItems: "center",
  },
  emptyNoticeText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 21,
  },
});
