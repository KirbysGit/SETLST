import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";

const appIcon = require("../../images/v1_app_icon.png");
const horizLockup = require("../../images/v1_horiz_lockup.png");

const { width } = Dimensions.get("window");

function SoundWave() {
  const bars = [18, 32, 52, 44, 64, 80, 56, 72, 48, 88, 64, 76, 52, 68, 44, 56, 72, 40, 60, 48, 36, 52, 68, 44, 56, 40, 28];
  return (
    <View style={styles.waveContainer}>
      {bars.map((h, i) => (
        <LinearGradient
          key={i}
          colors={["#2EF2C3", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bar, { height: h }]}
        />
      ))}
    </View>
  );
}

export default function Landing() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <Image source={appIcon} style={styles.appIcon} resizeMode="contain" />
        <Image source={horizLockup} style={styles.horizLockup} resizeMode="contain" />
      </View>

      {/* Tagline */}
      <View style={styles.taglineArea}>
        <Text style={styles.tagline}>GYM RHYTHM.</Text>
        <LinearGradient
          colors={["#2EF2C3", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.taglineGradientBox}
        >
          <Text style={styles.taglineGradient}>REAL CONNECTION.</Text>
        </LinearGradient>
        <Text style={styles.subtitle}>
          See who's at your gym.{"\n"}Discover their vibe.{"\n"}Connect through the music.
        </Text>
      </View>

      {/* Sound wave */}
      <SoundWave />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.getStartedWrapper}
          onPress={() => router.push("/(auth)/signup")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#2EF2C3", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.getStartedButton}
          >
            <Text style={styles.getStartedText}>GET STARTED</Text>
          </LinearGradient>
        </TouchableOpacity>

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
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  appIcon: {
    width: 72,
    height: 72,
  },
  horizLockup: {
    height: 22,
    width: 130,
  },
  taglineArea: {
    alignItems: "center",
    gap: 8,
  },
  tagline: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  taglineGradientBox: {
    borderRadius: 4,
    paddingHorizontal: 2,
  },
  taglineGradient: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#000",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 8,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    width: width - 48,
    justifyContent: "center",
  },
  bar: {
    width: 5,
    borderRadius: 3,
    opacity: 0.85,
  },
  actions: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  getStartedWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  getStartedButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  getStartedText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "800",
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
