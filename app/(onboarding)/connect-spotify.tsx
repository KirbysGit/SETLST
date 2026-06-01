import { useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useSpotify } from "../../contexts/SpotifyContext";

export default function ConnectSpotify() {
  const router = useRouter();
  const { connect, isConnected, isLoading } = useSpotify();

  // Auto-advance when connected
  useEffect(() => {
    if (isConnected) {
      router.replace("/(onboarding)/choose-gym");
    }
  }, [isConnected]);

  async function handleConnect() {
    await connect();
  }

  function handleSkip() {
    router.push("/(onboarding)/choose-gym");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Step indicator */}
      <View style={styles.stepRow}>
        <View style={[styles.stepDot, styles.stepDotActive]} />
        <View style={styles.stepLine} />
        <View style={styles.stepDot} />
      </View>

      {/* Icon */}
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={["#1DB954", "#158a3e"]}
          style={styles.iconGradient}
        >
          <Text style={styles.iconText}>♪</Text>
        </LinearGradient>
      </View>

      {/* Copy */}
      <View style={styles.copy}>
        <Text style={styles.title}>Connect Spotify</Text>
        <Text style={styles.subtitle}>
          SETLST uses your Spotify to show what you're listening to at the gym and help others discover your vibe.
        </Text>

        <View style={styles.featureList}>
          {[
            "Show your now playing track to nearby gym-goers",
            "Discover what others are listening to",
            "Build connections through shared music taste",
          ].map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.featureDot}>✦</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.teal} />
        ) : (
          <>
            <TouchableOpacity
              style={styles.connectWrapper}
              onPress={handleConnect}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#1DB954", "#158a3e"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.connectButton}
              >
                <Text style={styles.connectText}>Connect Spotify</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
  },
  stepDotActive: {
    backgroundColor: theme.colors.teal,
    width: 24,
    borderRadius: 5,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
  },
  iconWrap: {
    alignSelf: "flex-start",
    marginBottom: 32,
  },
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 36,
    color: "#fff",
  },
  copy: {
    flex: 1,
    gap: 16,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  featureList: {
    gap: 12,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  featureDot: {
    color: theme.colors.teal,
    fontSize: 12,
    marginTop: 3,
  },
  featureText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  actions: {
    gap: 12,
    paddingBottom: 16,
  },
  connectWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  connectButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  connectText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
});
