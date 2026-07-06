import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { GYMS } from "../../constants/gyms";
import { theme } from "../../constants/theme";

export default function ChooseGym() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        home_gym: selected,
        onboarding_complete: true,
      });
    }

    setSaving(false);
    router.replace("/(onboarding)/goals-intro");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Step indicator */}
      <View style={styles.stepRow}>
        <View style={styles.stepDotDone} />
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={[styles.stepDot, styles.stepDotActive]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Home Gym</Text>
        <Text style={styles.subtitle}>
          Choose your primary gym so nearby members can find you.
        </Text>
      </View>

      {/* Gym list */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {GYMS.map((gym) => {
          const isSelected = selected === gym;
          return (
            <TouchableOpacity
              key={gym}
              style={[styles.gymRow, isSelected && styles.gymRowSelected]}
              onPress={() => setSelected(gym)}
              activeOpacity={0.75}
            >
              <View style={[styles.gymIcon, isSelected && styles.gymIconSelected]}>
                <Text style={styles.gymIconText}>{gym[0]}</Text>
              </View>
              <Text style={[styles.gymName, isSelected && styles.gymNameSelected]}>
                {gym}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Action */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.finishWrapper, !selected && styles.finishWrapperDisabled]}
          onPress={handleFinish}
          disabled={!selected || saving}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={selected ? theme.gradients.brand : [theme.colors.border, theme.colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishButton}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.finishText}>
                {selected ? `Let's go →` : "Select a gym to continue"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.skipButton}>
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
    paddingTop: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
  },
  stepDotDone: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.teal,
  },
  stepDotActive: {
    backgroundColor: theme.colors.purple,
    width: 24,
    borderRadius: 5,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
  },
  stepLineDone: {
    backgroundColor: theme.colors.teal,
  },
  header: {
    gap: 8,
    marginBottom: 24,
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
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 16,
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  gymRowSelected: {
    borderColor: theme.colors.purple,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
  gymIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  gymIconSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: theme.colors.purple,
  },
  gymIconText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  gymName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  gymNameSelected: {
    fontWeight: "800",
    color: theme.colors.text,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  actions: {
    gap: 8,
    paddingBottom: 16,
    paddingTop: 12,
  },
  finishWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  finishWrapperDisabled: {
    opacity: 0.6,
  },
  finishButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  finishText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
});
