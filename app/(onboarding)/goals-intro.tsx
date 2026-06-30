import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../constants/theme";

const wordmark = require("../../images/v1_wordmark_white.png");

export default function GoalsIntro() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Image source={wordmark} style={styles.lockup} resizeMode="contain" />
      </View>

      {/* Main content */}
      <View style={styles.body}>
        <Text style={styles.eyebrow}>YOU'RE ALMOST IN</Text>

        <Text style={styles.heading}>
          Now, let's hear{"\n"}a bit about{"\n"}
          <Text style={styles.headingAccent}>your journey.</Text>
        </Text>

        <Text style={styles.subtitle}>
          A few quick questions about your training — we'll use your answers to personalize your experience and help others get to know you at the gym.
        </Text>

        <View style={styles.pills}>
          {["Takes under a minute", "Always editable", "Shown on your profile"].map((t) => (
            <View key={t} style={styles.pill}>
              <Text style={styles.pillText}>✦  {t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.ctaWrapper}
          onPress={() => router.push("/(onboarding)/goals")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#2EF2C3", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Let's do it →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.skip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  logoRow: {
    alignItems: "center",
    marginBottom: 40,
  },
  lockup: {
    height: 22,
    width: 130,
  },
  logoText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 6,
  },
  body: {
    flex: 1,
    gap: 16,
  },
  eyebrow: {
    color: theme.colors.teal,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  headingAccent: {
    color: theme.colors.purple,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    maxWidth: 320,
  },
  pills: {
    gap: 8,
    marginTop: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
  },
  pillText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    gap: 8,
    paddingBottom: 16,
  },
  ctaWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  ctaButton: {
    paddingVertical: 17,
    alignItems: "center",
    borderRadius: 14,
  },
  ctaText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  skip: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: {
    color: theme.colors.textSubtle,
    fontSize: 14,
    fontWeight: "600",
  },
});
