import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Avatar } from "../../components/shared/Avatar";
import { Screen } from "../../components/layout/Screen";
import { theme } from "../../constants/theme";
import { useSpotify } from "../../contexts/SpotifyContext";
import { spotifyFetch } from "../../lib/spotify";

export default function ProfileScreen() {
  const router = useRouter();
  const { isConnected, disconnect } = useSpotify();
  const [track, setTrack] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function testNowPlaying() {
    setFetching(true);
    setError(null);
    setTrack(null);
    try {
      const data = await spotifyFetch("/me/player/currently-playing");
      if (!data || !data.item || data.currently_playing_type !== "track") {
        setError("Nothing playing right now — open Spotify on your phone and play something, then try again.");
      } else {
        setTrack(data.item);
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch");
    }
    setFetching(false);
  }

  async function testRecentlyPlayed() {
    setFetching(true);
    setError(null);
    setTrack(null);
    try {
      const data = await spotifyFetch("/me/player/recently-played?limit=1");
      const item = data?.items?.[0]?.track;
      if (!item) {
        setError("No recently played tracks found.");
      } else {
        setTrack(item);
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch");
    }
    setFetching(false);
  }

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.profileTop}>
        <Avatar name="SETLST User" color="#214C44" accentColor={theme.colors.teal} size={70} />
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.handle}>@setlst.member</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Streaks, favorite training tracks, and discoverability controls will live here.
      </Text>

      {/* DEV — remove before launch */}
      <View style={styles.devSection}>
        <Text style={styles.devLabel}>DEV</Text>

        <TouchableOpacity
          style={styles.setupWrapper}
          onPress={() => router.push("/(onboarding)/connect-spotify")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#2EF2C3", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.setupButton}
          >
            <Text style={styles.setupText}>Go through account setup →</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Spotify status + disconnect */}
        <View style={styles.testRow}>
          <View style={[styles.testButton, { backgroundColor: isConnected ? "rgba(46,242,195,0.08)" : "rgba(255,92,122,0.08)", borderColor: isConnected ? theme.colors.teal : theme.colors.danger }]}>
            <Text style={{ color: isConnected ? theme.colors.teal : theme.colors.danger, fontSize: 13, fontWeight: "700" }}>
              {isConnected ? "✓ Spotify Connected" : "✗ Spotify Not Connected"}
            </Text>
          </View>
          {isConnected && (
            <TouchableOpacity
              style={[styles.testButton, { borderColor: theme.colors.danger }]}
              onPress={disconnect}
            >
              <Text style={{ color: theme.colors.danger, fontSize: 13, fontWeight: "700" }}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Spotify API test */}
        {isConnected && (
          <View style={styles.testGroup}>
            <Text style={styles.testGroupLabel}>Spotify API</Text>
            <View style={styles.testRow}>
              <TouchableOpacity
                style={styles.testButton}
                onPress={testNowPlaying}
                disabled={fetching}
              >
                <Text style={styles.testButtonText}>Now Playing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.testButton}
                onPress={testRecentlyPlayed}
                disabled={fetching}
              >
                <Text style={styles.testButtonText}>Recently Played</Text>
              </TouchableOpacity>
            </View>

            {fetching && <ActivityIndicator color={theme.colors.teal} style={{ marginTop: 12 }} />}

            {error && (
              <View style={styles.resultCard}>
                <Text style={styles.resultError}>{error}</Text>
              </View>
            )}

            {track && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTrack}>{track.name}</Text>
                <Text style={styles.resultArtist}>
                  {track.artists?.map((a: any) => a.name).join(", ")}
                </Text>
                <Text style={styles.resultAlbum}>{track.album?.name}</Text>
                <Text style={styles.resultMeta}>
                  {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")} · {track.popularity}% popularity
                </Text>
              </View>
            )}
          </View>
        )}

        {!isConnected && (
          <View style={styles.resultCard}>
            <Text style={styles.resultError}>Spotify not connected — go through account setup first.</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  handle: {
    color: theme.colors.teal,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: 0,
  },
  devSection: {
    marginTop: 40,
    gap: 10,
  },
  devLabel: {
    color: theme.colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  setupWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  setupButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  setupText: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "800",
  },
  testGroup: {
    gap: 8,
    marginTop: 4,
  },
  testGroupLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  testRow: {
    flexDirection: "row",
    gap: 8,
  },
  testButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  testButtonText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultTrack: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  resultArtist: {
    color: theme.colors.teal,
    fontSize: 14,
    fontWeight: "600",
  },
  resultAlbum: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  resultMeta: {
    color: theme.colors.textSubtle,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  resultError: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
});
