import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { GradientButton } from "../../components/shared/GradientButton";
import { theme } from "../../constants/theme";

const stacked = require("../../images/v1_stacked.png");

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD = 8;

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= MIN_PASSWORD;
  const confirmValid = confirm === password && confirm.length > 0;
  const canSubmit = emailValid && passwordValid && confirmValid && !loading;

  const errors: string[] = [];
  if (touched) {
    if (!emailValid) errors.push("Enter a valid email address.");
    if (!passwordValid) errors.push(`Password must be at least ${MIN_PASSWORD} characters.`);
    if (passwordValid && !confirmValid) errors.push("Passwords don't match.");
  }

  async function signUp() {
    if (!canSubmit) {
      setTouched(true);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) {
      Alert.alert("Error", error.message);
    } else if (!data.session) {
      // Email confirmation is enabled in Supabase — no session until the link is clicked.
      Alert.alert("Check your email", "We sent you a confirmation link.");
    }
    // With confirmation disabled, a session comes back immediately and the
    // root layout redirects into onboarding on its own.
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoArea}>
            <Image source={stacked} style={styles.stacked} resizeMode="contain" />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join the setlist at your gym</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={theme.colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder={`Password (min ${MIN_PASSWORD} characters)`}
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>{showPassword ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={theme.colors.textMuted}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showPassword}
              />
            </View>

            {errors.length > 0 && (
              <View style={styles.errorBox}>
                {errors.map((e) => (
                  <Text key={e} style={styles.errorText}>• {e}</Text>
                ))}
              </View>
            )}

            <GradientButton
              label={loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              onPress={signUp}
              disabled={touched && !canSubmit}
              style={styles.submitButton}
              textStyle={styles.submitText}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  back: {
    marginTop: 8,
    width: 36,
  },
  backText: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 32,
  },
  logoArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  stacked: {
    width: 100,
    height: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  form: {
    gap: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: theme.colors.textMuted,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    paddingVertical: 14,
  },
  errorBox: {
    backgroundColor: theme.colors.danger + "12",
    borderWidth: 1,
    borderColor: theme.colors.danger + "40",
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },
  submitButton: {
    marginTop: 4,
  },
  submitText: {
    fontSize: 15,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.teal,
    fontSize: 14,
    fontWeight: "600",
  },
});
