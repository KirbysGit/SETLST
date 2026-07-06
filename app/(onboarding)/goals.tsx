import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
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

const appIcon = require("../../images/v1_app_icon.png");

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  {
    key: "training_style",
    label: "Training Style",
    question: "What's your\ntraining style?",
    subtitle: "Choose the style that fits you best.",
    layout: "grid",
    multi: false,
    options: [
      { label: "Powerlifting",   icon: "🏋️" },
      { label: "Bodybuilding",   icon: "💪" },
      { label: "Functional",     icon: "⚡" },
      { label: "Cardio",         icon: "🏃" },
      { label: "Calisthenics",   icon: "🤸" },
      { label: "General Fitness",icon: "🏅" },
      { label: "Olympic Lifting",icon: "🥇" },
      { label: "Sports Perf.",   icon: "⚽" },
      { label: "Rehab",          icon: "🩺" },
      { label: "Weight Loss",    icon: "🔥" },
    ],
  },
  {
    key: "primary_goal",
    label: "Primary Goal",
    question: "What are you\nworking toward?",
    subtitle: "We'll use this to personalize your profile and tracking.",
    layout: "list",
    multi: false,
    options: [
      { label: "Build Strength",      icon: "⚡" },
      { label: "Build Muscle",        icon: "💪" },
      { label: "Improve Endurance",   icon: "🏃" },
      { label: "Build a Habit",       icon: "📅" },
      { label: "Lose Weight",         icon: "🔥" },
      { label: "General Health",      icon: "❤️" },
      { label: "Train for a Competition", icon: "🏆" },
      { label: "Mental Health",       icon: "🧠" },
      { label: "Maintain Fitness",    icon: "⚖️" },
    ],
  },
  {
    key: "gym_frequency",
    label: "Weekly Target",
    question: "How often do you\nwant to train?",
    subtitle: "Set a realistic weekly goal.",
    hint: "You can change this anytime",
    layout: "list-centered",
    multi: false,
    options: [
      { label: "2 days", icon: "" },
      { label: "3 days", icon: "" },
      { label: "4 days", icon: "" },
      { label: "5 days", icon: "" },
      { label: "6+ days", icon: "" },
    ],
  },
  {
    key: "open_to",
    label: "Open To",
    question: "What are you\nopen to?",
    subtitle: "Help others understand your vibe at the gym.",
    layout: "list",
    multi: true,
    options: [
      { label: "Workout partners",     icon: "🤝" },
      { label: "Friendly competition", icon: "🏆" },
      { label: "Spotting",             icon: "🙌" },
      { label: "Just here for music",  icon: "🎧" },
      { label: "Keeping to myself",    icon: "🎯" },
      { label: "Coaching others",      icon: "📣" },
    ],
  },
];

// ─── Grid card (training style) ───────────────────────────────────────────────
function GridCard({
  icon, label, selected, onPress,
}: { icon: string; label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.gridCard, selected && styles.gridCardSelected]}
    >
      <Text style={styles.gridIcon}>{icon}</Text>
      <Text style={[styles.gridLabel, selected && styles.gridLabelSelected]} numberOfLines={2}>
        {label}
      </Text>
      {selected && <View style={styles.gridCheck}><Text style={styles.gridCheckText}>✓</Text></View>}
    </TouchableOpacity>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────
function ListRow({
  icon, label, selected, centered, onPress,
}: { icon: string; label: string; selected: boolean; centered?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.listRow, selected && styles.listRowSelected]}
    >
      {!centered && icon ? <Text style={styles.listIcon}>{icon}</Text> : null}
      <Text style={[
        styles.listLabel,
        selected && styles.listLabelSelected,
        centered && styles.listLabelCentered,
      ]}>
        {label}
      </Text>
      {selected && (
        <View style={styles.listCheck}>
          <Text style={styles.listCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Summary card (final step preview) ───────────────────────────────────────
function SummaryCard({ answers }: { answers: Record<string, any> }) {
  const parts = [
    answers.training_style,
    answers.primary_goal,
    answers.gym_frequency,
  ].filter(Boolean);

  const openTo = Array.isArray(answers.open_to) ? answers.open_to[0] : null;

  if (!parts.length) return null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLine} numberOfLines={1}>
        {parts.join("  ·  ")}
      </Text>
      {answers.gym_frequency && (
        <Text style={styles.summaryFreq}>{answers.gym_frequency} / week</Text>
      )}
      {openTo && (
        <Text style={styles.summaryOpen}>
          <Text style={styles.summaryOpenLabel}>Open to </Text>
          {openTo.toLowerCase()}
        </Text>
      )}
    </View>
  );
}

// ─── Bottom step labels ───────────────────────────────────────────────────────
function StepLabels({ current }: { current: number }) {
  const labels = [...STEPS.map((s) => s.label), "You're All Set"];
  return (
    <View style={styles.stepLabels}>
      {labels.map((label, i) => (
        <View key={label} style={styles.stepLabelItem}>
          <View style={[styles.stepCircle, i <= current && styles.stepCircleActive]}>
            <Text style={[styles.stepNum, i <= current && styles.stepNumActive]}>
              {i + 1}
            </Text>
          </View>
          {i < labels.length - 1 && (
            <View style={[styles.stepConnector, i < current && styles.stepConnectorActive]} />
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function Goals() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);

  // Prefill from the existing profile so re-entering doesn't start from scratch
  useEffect(() => {
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const keys = STEPS.map((s) => s.key);
      const { data } = await supabase
        .from("profiles")
        .select(keys.join(", "))
        .eq("id", user.id)
        .single();

      if (!data) return;
      const row = data as unknown as Record<string, unknown>;
      const prefill: Record<string, string | string[]> = {};
      for (const key of keys) {
        const value = row[key];
        if (typeof value === "string" || Array.isArray(value)) prefill[key] = value as string | string[];
      }
      if (Object.keys(prefill).length) setAnswers((a) => ({ ...prefill, ...a }));
    }
    loadExisting();
  }, []);

  // Early exit: keep whatever has been answered so far
  async function saveAndExit() {
    if (Object.keys(answers).length) {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({ id: user.id, ...answers });
      }
      setSaving(false);
    }
    router.replace("/(tabs)");
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const answer = answers[current?.key ?? ""];
  const totalSteps = STEPS.length + 1; // +1 for finish

  function isSelected(label: string): boolean {
    if (current.multi) return Array.isArray(answer) && answer.includes(label);
    return answer === label;
  }

  function toggle(label: string) {
    if (current.multi) {
      const prev = Array.isArray(answer) ? answer : [];
      const next = prev.includes(label)
        ? prev.filter((o) => o !== label)
        : [...prev, label];
      setAnswers((a) => ({ ...a, [current.key]: next }));
    } else {
      setAnswers((a) => ({ ...a, [current.key]: label }));
    }
  }

  function hasAnswer(): boolean {
    if (current.multi) return Array.isArray(answer) && answer.length > 0;
    return !!answer;
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Image source={appIcon} style={styles.logoSmall} resizeMode="contain" />
        <View style={styles.topBarRight}>
          <Text style={styles.stepCounter}>Step {step + 1} of {STEPS.length}</Text>
          <TouchableOpacity onPress={saveAndExit} style={styles.exitButton} disabled={saving}>
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={theme.gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${((step + 1) / totalSteps) * 100}%` }]}
        />
      </View>

      {/* Question header */}
      <View style={styles.header}>
        <Text style={styles.question}>{current.question}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      {/* Options */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.optionsContainer,
          current.layout === "grid" && styles.optionsGrid,
        ]}
      >
        {current.options.map((opt) => {
          if (current.layout === "grid") {
            return (
              <GridCard
                key={opt.label}
                icon={opt.icon}
                label={opt.label}
                selected={isSelected(opt.label)}
                onPress={() => toggle(opt.label)}
              />
            );
          }
          return (
            <ListRow
              key={opt.label}
              icon={opt.icon}
              label={opt.label}
              selected={isSelected(opt.label)}
              centered={current.layout === "list-centered"}
              onPress={() => toggle(opt.label)}
            />
          );
        })}

        {/* Hint text (frequency step) */}
        {"hint" in current && (
          <View style={styles.hintRow}>
            <Text style={styles.hintText}>ⓘ  {current.hint}</Text>
          </View>
        )}

        {/* Summary preview on last step */}
        {isLast && <SummaryCard answers={answers} />}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.continueWrapper, !hasAnswer() && styles.continueDisabled]}
          onPress={isLast ? finish : () => setStep((s) => s + 1)}
          disabled={!hasAnswer() || saving}
          activeOpacity={0.85}
        >
          {isLast ? (
            <LinearGradient
              colors={["#8B5CF6", "#6D28D9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.continueText}>Finish setup</Text>
              }
            </LinearGradient>
          ) : (
            <View style={[styles.continueButton, styles.continueTeal, !hasAnswer() && styles.continueTealDisabled]}>
              <Text style={styles.continueText}>Continue</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          {step > 0 ? (
            <TouchableOpacity onPress={() => setStep((s) => s - 1)}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
            <Text style={styles.skipText}>Skip all</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Step label strip */}
      <StepLabels current={step} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exitButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exitButtonText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.extrabold,
  },
  logoSmall: {
    width: 28,
    height: 28,
  },
  stepCounter: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  progressTrack: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  header: {
    gap: 6,
    marginBottom: 20,
  },
  question: {
    color: theme.colors.text,
    fontSize: 28,
    fontFamily: theme.fonts.extrabold,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  optionsContainer: {
    gap: 10,
    paddingBottom: 12,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  // Grid cards
  gridCard: {
    width: "47%",
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: 14,
    gap: 6,
    minHeight: 90,
    justifyContent: "center",
  },
  gridCardSelected: {
    borderColor: theme.colors.teal,
    backgroundColor: theme.colors.teal + "12",
  },
  gridIcon: {
    fontSize: 24,
  },
  gridLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    lineHeight: 17,
  },
  gridLabelSelected: {
    color: theme.colors.text,
  },
  gridCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  gridCheckText: {
    color: theme.colors.background,
    fontSize: 11,
    fontFamily: theme.fonts.extrabold,
  },
  // List rows
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  listRowSelected: {
    borderColor: theme.colors.teal,
    backgroundColor: theme.colors.teal + "10",
  },
  listIcon: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  listLabel: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 15,
    fontFamily: theme.fonts.semibold,
  },
  listLabelSelected: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  listLabelCentered: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  listCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  listCheckText: {
    color: theme.colors.background,
    fontSize: 12,
    fontFamily: theme.fonts.extrabold,
  },
  hintRow: {
    alignItems: "center",
    marginTop: 4,
  },
  hintText: {
    color: theme.colors.teal,
    fontSize: 12,
    fontFamily: theme.fonts.semibold,
  },
  // Summary card
  summaryCard: {
    backgroundColor: theme.colors.elevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.purple + "50",
    padding: 16,
    gap: 4,
    marginTop: 8,
  },
  summaryLine: {
    color: theme.colors.text,
    fontSize: 13,
    fontFamily: theme.fonts.bold,
  },
  summaryFreq: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.medium,
  },
  summaryOpen: {
    color: theme.colors.purple,
    fontSize: 13,
    fontFamily: theme.fonts.semibold,
  },
  summaryOpenLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.medium,
  },
  // Actions
  actions: {
    gap: 6,
    paddingTop: 8,
  },
  continueWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  continueDisabled: {
    opacity: 0.45,
  },
  continueButton: {
    paddingVertical: 17,
    alignItems: "center",
    borderRadius: 14,
  },
  continueTeal: {
    backgroundColor: theme.colors.teal,
  },
  continueTealDisabled: {
    backgroundColor: theme.colors.border,
  },
  continueText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.extrabold,
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  backText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontFamily: theme.fonts.semibold,
  },
  skipText: {
    color: theme.colors.textSubtle,
    fontSize: 14,
    fontFamily: theme.fonts.semibold,
  },
  // Step label strip
  stepLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
    paddingTop: 4,
  },
  stepLabelItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: theme.colors.teal,
    borderColor: theme.colors.teal,
  },
  stepNum: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.fonts.extrabold,
  },
  stepNumActive: {
    color: theme.colors.background,
  },
  stepConnector: {
    width: 20,
    height: 1.5,
    backgroundColor: theme.colors.border,
  },
  stepConnectorActive: {
    backgroundColor: theme.colors.teal,
  },
});
