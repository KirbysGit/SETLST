import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../lib/supabase";
import { spotifyFetch } from "../../lib/spotify";
import { useSpotify } from "../../contexts/SpotifyContext";
import { useProfile, UserProfile } from "../../hooks/useProfile";
import { usePublicProfile } from "../../hooks/usePublicProfile";
import { PublicProfileView } from "../../components/profile/PublicProfileView";
import { ProfileSkeleton } from "../../components/skeletons/ProfileSkeleton";
import { theme } from "../../constants/theme";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ profile }: { profile: UserProfile }) {
  const initials = profile.display_name?.slice(0, 2).toUpperCase() ?? "??";
  if (profile.avatar_url) {
    return <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />;
  }
  return (
    <LinearGradient
      colors={["#2EF2C3", "#8B5CF6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatar}
    >
      <Text style={styles.avatarInitials}>{initials}</Text>
    </LinearGradient>
  );
}

function SectionHeader({
  title,
  privacyKey,
  isPublic,
  onToggle,
}: {
  title: string;
  privacyKey: string;
  isPublic: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.privacyToggle} onPress={onToggle} activeOpacity={0.7}>
        <Text style={[styles.privacyLabel, isPublic && styles.privacyLabelPublic]}>
          {isPublic ? "👁  Public" : "🔒  Only you"}
        </Text>
        <Switch
          value={isPublic}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.teal + "60" }}
          thumbColor={isPublic ? theme.colors.teal : theme.colors.textSubtle}
          style={styles.switch}
        />
      </TouchableOpacity>
    </View>
  );
}

function Chip({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[styles.chip, color ? { borderColor: color + "60", backgroundColor: color + "15" } : {}]}>
      <Text style={[styles.chipText, color ? { color } : {}]}>{label}</Text>
    </View>
  );
}

function EmptyField({ label }: { label: string }) {
  return <Text style={styles.emptyField}>{label} not set</Text>;
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, updatePrivacy } = useProfile();
  const { isConnected, disconnect } = useSpotify();
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch own public data for preview (reuses same hook as other profiles)
  const ownId = profile?.id ?? "";
  const { profile: previewProfile, presence: previewPresence } = usePublicProfile(ownId);

  // DEV: Spotify test state
  const [devOpen, setDevOpen] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function testNowPlaying() {
    setFetching(true); setApiError(null); setTrack(null);
    try {
      const data = await spotifyFetch("/me/player/currently-playing");
      if (!data || !data.item || data.currently_playing_type !== "track") {
        setApiError("Nothing playing — open Spotify and play something.");
      } else { setTrack(data.item); }
    } catch (e: any) { setApiError(e.message ?? "Failed"); }
    setFetching(false);
  }

  async function testRecentlyPlayed() {
    setFetching(true); setApiError(null); setTrack(null);
    try {
      const data = await spotifyFetch("/me/player/recently-played?limit=1");
      const item = data?.items?.[0]?.track;
      if (!item) { setApiError("No recently played tracks."); }
      else { setTrack(item); }
    } catch (e: any) { setApiError(e.message ?? "Failed"); }
    setFetching(false);
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Preview modal ──────────────────────────────────────────────────── */}
      <Modal
        visible={previewOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPreviewOpen(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your public profile</Text>
            <TouchableOpacity onPress={() => setPreviewOpen(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          {previewProfile && (
            <PublicProfileView
              profile={previewProfile}
              presence={previewPresence}
              isOwnProfile
            />
          )}
        </SafeAreaView>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Avatar profile={profile} />

          <View style={styles.headerInfo}>
            <Text style={styles.displayName}>
              {profile.display_name ?? "Unnamed Setlster"}
            </Text>
            {profile.username && (
              <Text style={styles.username}>@{profile.username}</Text>
            )}
            {profile.home_gym && (
              <View style={styles.gymRow}>
                <Text style={styles.gymIcon}>📍</Text>
                <Text style={styles.gymName}>{profile.home_gym}</Text>
              </View>
            )}
            {isConnected && (
              <View style={styles.spotifyBadge}>
                <Text style={styles.spotifyBadgeText}>♪  Spotify connected</Text>
              </View>
            )}
          </View>

          {/* Header buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => setPreviewOpen(true)}
            >
              <Text style={styles.previewButtonText}>👁 Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/(onboarding)/profile-setup")}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Training Profile ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Training Profile"
            privacyKey="goals_public"
            isPublic={profile.privacy.goals_public}
            onToggle={() => updatePrivacy("goals_public", !profile.privacy.goals_public)}
          />

          <View style={styles.card}>
            <Row label="Style" value={profile.training_style} />
            <Divider />
            <Row label="Goal" value={profile.primary_goal} />
            <Divider />
            <Row label="Frequency" value={profile.gym_frequency ? `${profile.gym_frequency} / week` : null} />
            <Divider />
            <Row label="Experience" value={profile.experience_level} />
          </View>
        </View>

        {/* ── Gym Vibe ────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Gym Vibe"
            privacyKey="vibe_public"
            isPublic={profile.privacy.vibe_public}
            onToggle={() => updatePrivacy("vibe_public", !profile.privacy.vibe_public)}
          />

          <View style={styles.card}>
            {profile.vibe ? (
              <Text style={styles.vibeText}>"{profile.vibe}"</Text>
            ) : (
              <EmptyField label="Vibe" />
            )}

            {profile.open_to && profile.open_to.length > 0 && (
              <>
                <Divider />
                <Text style={styles.openToLabel}>Open to</Text>
                <View style={styles.chips}>
                  {profile.open_to.map((o) => (
                    <Chip key={o} label={o} color={theme.colors.purple} />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* ── Stats placeholder ───────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Stats"
            privacyKey="stats_public"
            isPublic={profile.privacy.stats_public}
            onToggle={() => updatePrivacy("stats_public", !profile.privacy.stats_public)}
          />

          <View style={styles.statsRow}>
            <StatCard value="—" label="Streak" unit="days" />
            <StatCard value="—" label="This week" unit="sessions" />
            <StatCard value="—" label="All time" unit="sessions" />
          </View>
        </View>

        {/* ── Sign out ────────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        {/* ── DEV console ─────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.devToggle}
          onPress={() => setDevOpen((o) => !o)}
        >
          <Text style={styles.devToggleText}>
            {devOpen ? "▲ DEV console" : "▼ DEV console"}
          </Text>
        </TouchableOpacity>

        {devOpen && (
          <View style={styles.devConsole}>
            <Text style={styles.devLabel}>DEV</Text>

            <TouchableOpacity
              style={styles.devButton}
              onPress={() => router.push("/(onboarding)/profile-setup")}
            >
              <Text style={styles.devButtonText}>Full onboarding flow →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { borderColor: theme.colors.purple }]}
              onPress={() => router.push("/(onboarding)/goals-intro")}
            >
              <Text style={[styles.devButtonText, { color: theme.colors.purple }]}>Goals setup →</Text>
            </TouchableOpacity>

            <View style={styles.devRow}>
              <View style={[styles.devStatusDot, { backgroundColor: isConnected ? theme.colors.teal : theme.colors.danger }]} />
              <Text style={styles.devStatusText}>{isConnected ? "Spotify connected" : "Spotify not connected"}</Text>
              {isConnected && (
                <TouchableOpacity onPress={disconnect} style={styles.devDisconnect}>
                  <Text style={styles.devDisconnectText}>Disconnect</Text>
                </TouchableOpacity>
              )}
            </View>

            {isConnected && (
              <View style={styles.devTestRow}>
                <TouchableOpacity style={styles.devTestButton} onPress={testNowPlaying} disabled={fetching}>
                  <Text style={styles.devButtonText}>Now Playing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.devTestButton} onPress={testRecentlyPlayed} disabled={fetching}>
                  <Text style={styles.devButtonText}>Recently Played</Text>
                </TouchableOpacity>
              </View>
            )}

            {fetching && <ActivityIndicator color={theme.colors.teal} style={{ marginTop: 8 }} />}

            {apiError && <Text style={styles.devError}>{apiError}</Text>}

            {track && (
              <View style={styles.devTrackCard}>
                <Text style={styles.devTrackName}>{track.name}</Text>
                <Text style={styles.devTrackArtist}>{track.artists?.map((a: any) => a.name).join(", ")}</Text>
                <Text style={styles.devTrackAlbum}>{track.album?.name}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {value
        ? <Text style={styles.rowValue}>{value}</Text>
        : <Text style={styles.rowEmpty}>Not set</Text>
      }
    </View>
  );
}

function Divider() {
  return <View style={styles.rowDivider} />;
}

function StatCard({ value, label, unit }: { value: string; label: string; unit: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loader: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: theme.colors.background,
    fontSize: 24,
    fontWeight: "900",
  },
  headerInfo: {
    flex: 1,
    gap: 3,
    paddingTop: 2,
  },
  displayName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  username: {
    color: theme.colors.teal,
    fontSize: 13,
    fontWeight: "700",
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  gymIcon: {
    fontSize: 11,
  },
  gymName: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  spotifyBadge: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: "#1DB95420",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#1DB95440",
  },
  spotifyBadgeText: {
    color: "#1DB954",
    fontSize: 11,
    fontWeight: "700",
  },
  headerButtons: {
    gap: 6,
    alignItems: "flex-end",
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.purple + "20",
    borderWidth: 1,
    borderColor: theme.colors.purple + "50",
  },
  previewButtonText: {
    color: theme.colors.purple,
    fontSize: 12,
    fontWeight: "700",
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editButtonText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  // Modal
  modalSafe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  modalClose: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  modalCloseText: {
    color: theme.colors.teal,
    fontSize: 15,
    fontWeight: "700",
  },

  // Sections
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  privacyToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  privacyLabel: {
    color: theme.colors.textSubtle,
    fontSize: 11,
    fontWeight: "700",
  },
  privacyLabelPublic: {
    color: theme.colors.teal,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },

  // Card
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
    paddingVertical: 14,
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
  rowEmpty: {
    color: theme.colors.textSubtle,
    fontSize: 13,
    fontStyle: "italic",
  },
  rowDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },

  // Vibe
  vibeText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    paddingHorizontal: 16,
    paddingVertical: 14,
    lineHeight: 20,
  },
  openToLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyField: {
    color: theme.colors.textSubtle,
    fontSize: 13,
    fontStyle: "italic",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  statUnit: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
  statLabel: {
    color: theme.colors.textSubtle,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },

  // Sign out
  signOutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.danger + "50",
    backgroundColor: theme.colors.danger + "10",
    alignItems: "center",
  },
  signOutText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: "700",
  },

  // DEV console
  devToggle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  devToggleText: {
    color: theme.colors.textSubtle,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  devConsole: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.orange + "40",
    padding: 16,
    gap: 10,
  },
  devLabel: {
    color: theme.colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  devButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  devButtonText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  devRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  devStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  devStatusText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  devDisconnect: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.danger + "60",
  },
  devDisconnectText: {
    color: theme.colors.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  devTestRow: {
    flexDirection: "row",
    gap: 8,
  },
  devTestButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  devError: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: "600",
  },
  devTrackCard: {
    backgroundColor: theme.colors.elevated,
    borderRadius: 10,
    padding: 12,
    gap: 3,
  },
  devTrackName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  devTrackArtist: {
    color: theme.colors.teal,
    fontSize: 12,
    fontWeight: "600",
  },
  devTrackAlbum: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
});
