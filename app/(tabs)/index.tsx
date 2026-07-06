import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "../../components/layout/AppHeader";
import { GymFeed } from "../../components/home/GymFeed";
import { GymPulse } from "../../components/home/GymPulse";
import { HomeBackground } from "../../components/home/HomeBackground";
import { PeopleStrip } from "../../components/home/PeopleStrip";
import { YourTrackBar } from "../../components/home/YourTrackBar";
import { HomeSkeleton } from "../../components/skeletons/HomeSkeleton";
import { GradientButton } from "../../components/shared/GradientButton";
import { useSpotify } from "../../contexts/SpotifyContext";
import { theme } from "../../constants/theme";
import { useGymPresence } from "../../hooks/useGymPresence";

function SpotifyReconnectCard({ onConnect }: { onConnect: () => void }) {
  return (
    <View style={styles.reconnectCard}>
      <View style={styles.reconnectInfo}>
        <Text style={styles.reconnectTitle}>Spotify disconnected</Text>
        <Text style={styles.reconnectSubtitle}>
          Reconnect to share your track and appear in the gym feed.
        </Text>
      </View>
      <GradientButton size="sm" label="Reconnect" onPress={onConnect} />
    </View>
  );
}

export default function HomeScreen() {
  const { own, others, gym, loading, refreshing, refresh, cooldownSeconds } = useGymPresence();
  const { isConnected, connect } = useSpotify();

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.colors.purple}
              colors={[theme.colors.purple]}
              progressBackgroundColor={theme.colors.surface}
            />
          }
        >
          <AppHeader eyebrow={gym ?? "Set your gym in profile"} accentColor={theme.colors.purple} />
          {isConnected ? (
            <YourTrackBar presence={own} gym={gym} />
          ) : (
            <SpotifyReconnectCard onConnect={connect} />
          )}

          {cooldownSeconds > 0 && (
            <View style={styles.cooldownRow}>
              <View style={styles.cooldownPill}>
                <Text style={styles.cooldownText}>Next refresh in {cooldownSeconds}s</Text>
              </View>
            </View>
          )}

          <GymPulse own={own} others={others} gym={gym} />
          <PeopleStrip others={others} />
          <GymFeed others={others} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 120,
  },
  reconnectCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  reconnectInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  reconnectTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.extrabold,
  },
  reconnectSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    lineHeight: 17,
  },
  cooldownRow: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
    marginTop: -theme.spacing.sm,
  },
  cooldownPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface + "CC",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cooldownText: {
    color: theme.colors.textSubtle,
    fontSize: 11,
    fontFamily: theme.fonts.bold,
    letterSpacing: 0.3,
  },
});
