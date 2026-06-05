import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../constants/theme";

export default function ForumScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Icon */}
        <LinearGradient
          colors={["#2EF2C320", "#8B5CF620"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrap}
        >
          <Text style={styles.icon}>#</Text>
        </LinearGradient>

        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>In development</Text>
        </View>

        <Text style={styles.title}>Forum</Text>
        <Text style={styles.subtitle}>
          A space to talk training, music, and gym life with other Setlsters. Threads, reactions, and gym-specific boards — coming soon.
        </Text>

        {/* Teaser chips */}
        <View style={styles.chips}>
          {[
            "💬  Gym threads",
            "🎵  Music talk",
            "🏋️  Training tips",
            "📍  Local boards",
          ].map((label) => (
            <View key={label} style={styles.chip}>
              <Text style={styles.chipText}>{label}</Text>
            </View>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 4,
  },
  icon: {
    fontSize: 36,
    color: theme.colors.teal,
    fontWeight: "900",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.orange,
  },
  badgeText: {
    color: theme.colors.orange,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  chip: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
});
