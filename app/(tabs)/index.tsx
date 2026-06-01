import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/layout/AppHeader";
import { YourTrackBar } from "../../components/home/YourTrackBar";
import { GymPulse } from "../../components/home/GymPulse";
import { PeopleStrip } from "../../components/home/PeopleStrip";
import { GymFeed } from "../../components/home/GymFeed";
import { theme } from "../../constants/theme";
import { useGymPresence } from "../../hooks/useGymPresence";

export default function HomeScreen() {
  const { own, others, gym, loading, refreshing, refresh, cooldownSeconds } = useGymPresence();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.purple} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.purple}
            colors={[theme.colors.purple]}
          />
        }
      >
        <AppHeader eyebrow={gym ?? "Set your gym in profile"} accentColor={theme.colors.purple} />
        <YourTrackBar presence={own} gym={gym} />

        {cooldownSeconds > 0 && (
          <View style={styles.cooldownRow}>
            <Text style={styles.cooldownText}>
              Next refresh in {cooldownSeconds}s
            </Text>
          </View>
        )}

        <GymPulse own={own} others={others} gym={gym} />
        <PeopleStrip others={others} />
        <GymFeed others={others} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 120,
  },
  cooldownRow: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
    marginTop: -theme.spacing.sm,
  },
  cooldownText: {
    color: theme.colors.textSubtle,
    fontSize: 12,
    fontWeight: "600",
  },
});
