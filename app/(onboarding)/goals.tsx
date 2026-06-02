import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../lib/supabase";
import { theme } from "../../constants/theme";

const { width } = Dimensions.get("window");

// ─── Question definitions ─────────────────────────────────────────────────────
const STEPS = [
  {
    key: "training_style",
    emoji: "🏋️",
    question: "How do you train?",
    subtitle: "Pick the style that best describes your sessions.",
    multi: false,
    options: [
      "Powerlifting",
      "Bodybuilding",
      "Olympic Weightlifting",
      "CrossFit / Functional",
      "Calisthenics",
      "Cardio / Endurance",
      "Sports Performance",
      "General Fitness",
      "Weight Loss",
      "Rehab / Recovery",
    ],
  },
  {
    key: "primary_goal",
    emoji: "🎯",
    question: "What's your main goal?",
    subtitle: "What are you working toward right now?",
    multi: false,
    options: [
      "Build Strength",
      "Lose Weight",
      "Build Muscle",
      "Improve Endurance",
      "Improve Flexibility",
      "Maintain Fitness",
      "Train for Competition",
      "Mental Health",
      "Build a Habit",
    ],
  },
  {
    key: "gym_frequency",
    emoji: "📅",
    question: "How often do you aim to go?",
    subtitle: "Your target — not necessarily your current streak.",
    multi: false,
    options: [
      "2 days / week",
      "3 days / week",
      "4 days / week",
      "5 days / week",
      "6+ days / week",
    ],
  },
  {
    key: "experience_level",
    emoji: "📈",
    question: "How long have you been training?",
    subtitle: "Helps others know where you're at.",
    multi: false,
    options: [
      "Just Starting Out",
      "Some Experience (6mo–2yr)",
      "Intermediate (2–5yr)",
      "Advanced (5yr+)",
      "Competitive Athlete",
    ],
  },
  {
    key: "open_to",
    emoji: "🤝",
    question: "What are you open to?",
    subtitle: "Select all that apply.",
    multi: true,
    options: [
      "Workout Partners",
      "Friendly Competition",
      "Coaching / Being Coached",
      "Spotting",
      "Just Here for the Music",
      "Keeping to Myself",
    ],
  },
  {
    key: "vibe",
    emoji: "🎧",
    question: "What's your gym vibe?",
    subtitle: "Others will see this on your profile.",
    multi: false,
    options: [
      "Headphones in, don't talk to me",
      "Happy to chat between sets",
      "Hype each other up",
      "Here to grind silently",
      "Open to new gym friends",
    ],
  },
];

// ─── Option chip ──────────────────────────────────────────────────────────────
function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  if (selected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.chipWrapper}>
        <LinearGradient
          colors={["#2EF2C3", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.chipGradient}
        >
          <Text style={styles.chipTextSelected}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[styles.chipWrapper, styles.chipUnselected]}>
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function Goals() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const answer = answers[current.key];

  function isSelected(option: string): boolean {
    if (current.multi) {
      return Array.isArray(answer) && answer.includes(option);
    }
    return answer === option;
  }

  function toggle(option: string) {
    if (current.multi) {
      const prev = Array.isArray(answer) ? answer : [];
      const next = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      setAnswers((a) => ({ ...a, [current.key]: next }));
    } else {
      setAnswers((a) => ({ ...a, [current.key]: option }));
    }
  }

  function hasAnswer(): boolean {
    if (current.multi) return Array.isArray(answer) && answer.length > 0;
    return !!answer;
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function finish() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        ...answers,
        goals_complete: true,
      });
    }

    setSaving(false);
    router.replace("/(tabs)");
  }

  function skip() {
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        {STEPS.map((_, i) => (
          <View key={i} style={styles.progressSegment}>
            {i <= step ? (
              <LinearGradient
                colors={["#2EF2C3", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressFill}
              />
            ) : (
              <View style={styles.progressEmpty} />
            )}
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepCount}>
          {step + 1} of {STEPS.length}
        </Text>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.question}>{current.question}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      {/* Options */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.options}
      >
        {current.options.map((option) => (
          <OptionChip
            key={option}
            label={option}
            selected={isSelected(option)}
            onPress={() => toggle(option)}
          />
        ))}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Next / Finish */}
        <TouchableOpacity
          style={[styles.nextWrapper, !hasAnswer() && styles.nextDisabled]}
          onPress={isLast ? finish : next}
          disabled={!hasAnswer() || saving}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={hasAnswer() ? ["#2EF2C3", "#8B5CF6"] : [theme.colors.border, theme.colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextText}>
                {isLast ? "Finish →" : "Next →"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Back + Skip row */}
        <View style={styles.secondaryRow}>
          {step > 0 ? (
            <TouchableOpacity onPress={back} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity onPress={skip}>
            <Text style={styles.skipText}>Skip all</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  progressTrack: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 28,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    flex: 1,
    borderRadius: 2,
  },
  progressEmpty: {
    flex: 1,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  header: {
    marginBottom: 24,
    gap: 6,
  },
  stepCount: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  question: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 16,
  },
  chipWrapper: {
    borderRadius: theme.radius.pill,
    overflow: "hidden",
  },
  chipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  chipUnselected: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "700",
  },
  actions: {
    gap: 8,
    paddingBottom: 12,
    paddingTop: 8,
  },
  nextWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  nextDisabled: {
    opacity: 0.5,
  },
  nextButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  nextText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  skipText: {
    color: theme.colors.textSubtle,
    fontSize: 14,
    fontWeight: "600",
  },
});
