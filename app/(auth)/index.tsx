import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedWaveform } from "../../components/shared/AnimatedWaveform";
import { Avatar } from "../../components/shared/Avatar";
import { GradientButton } from "../../components/shared/GradientButton";
import { theme } from "../../constants/theme";

const stacked = require("../../images/v1_stacked.png");

// Faux gym feed used purely as a product preview on the landing screen.
const PREVIEW = [
  { name: "Jordan Blake", track: "Blinding Lights", artist: "The Weeknd" },
  { name: "Maya Chen", track: "POWER", artist: "Kanye West" },
];

function PreviewRow({ person }: { person: (typeof PREVIEW)[number] }) {
  return (
    <View style={styles.previewRow}>
      <Avatar name={person.name} size={40} />

      <View style={styles.previewInfo}>
        <Text style={styles.previewName} numberOfLines={1}>{person.name}</Text>
        <Text style={styles.previewTrack} numberOfLines={1}>
          {person.track} · {person.artist}
        </Text>
      </View>

      <AnimatedWaveform active color={theme.colors.teal} />
    </View>
  );
}

export default function Landing() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient background glows */}
      <LinearGradient
        colors={[theme.colors.teal + "22", "transparent"]}
        style={[styles.glow, styles.glowTop]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", theme.colors.purple + "26"]}
        style={[styles.glow, styles.glowBottom]}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.logoArea}>
          <Image source={stacked} style={styles.stacked} resizeMode="contain" />
        </View>

        {/* Tagline */}
        <View style={styles.taglineArea}>
          <Text style={styles.tagline}>GYM RHYTHM.</Text>
          <LinearGradient
            colors={theme.gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.taglineGradientBox}
          >
            <Text style={styles.taglineGradient}>REAL CONNECTION.</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>
            See who's at your gym. Discover their vibe.{"\n"}Connect through the music.
          </Text>
        </View>

        {/* Product preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.liveDot} />
            <Text style={styles.previewHeaderText}>LIVE AT CRUNCH FITNESS</Text>
            <Text style={styles.previewCount}>12 active</Text>
          </View>
          {PREVIEW.map((p) => (
            <PreviewRow key={p.name} person={p} />
          ))}
        </View>

        {/* Feature pills */}
        <View style={styles.pills}>
          {[
            { icon: "📍", label: "Live presence" },
            { icon: "🎧", label: "Music match" },
            { icon: "🤝", label: "Gym friends" },
          ].map((f) => (
            <View key={f.label} style={styles.pill}>
              <Text style={styles.pillIcon}>{f.icon}</Text>
              <Text style={styles.pillText}>{f.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Actions pinned at the bottom */}
      <View style={styles.actions}>
        <GradientButton
          label="GET STARTED  →"
          onPress={() => router.push("/(auth)/signup")}
          textStyle={styles.getStartedText}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
  },
  glow: {
    position: "absolute",
    left: -60,
    right: -60,
    height: 320,
  },
  glowTop: {
    top: -80,
  },
  glowBottom: {
    bottom: -40,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },

  // Brand
  logoArea: {
    alignItems: "center",
  },
  stacked: {
    width: 132,
    height: 132,
  },

  // Tagline
  taglineArea: {
    alignItems: "center",
    gap: 6,
  },
  tagline: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  taglineGradientBox: {
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  taglineGradient: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#000",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 6,
  },

  // Preview card
  previewCard: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    gap: 12,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.teal,
  },
  previewHeaderText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  previewCount: {
    color: theme.colors.teal,
    fontSize: 11,
    fontWeight: "700",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewInfo: {
    flex: 1,
    minWidth: 0,
  },
  previewName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  previewTrack: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },

  // Feature pills
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillIcon: {
    fontSize: 12,
  },
  pillText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },

  // Actions
  actions: {
    width: "100%",
    alignItems: "center",
    gap: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  getStartedText: {
    letterSpacing: 2,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginPrompt: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.teal,
    fontSize: 14,
    fontWeight: "600",
  },
});
