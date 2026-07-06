import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { GradientButton } from "../../components/shared/GradientButton";
import { theme } from "../../constants/theme";

const stacked = require("../../images/v1_stacked.png");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to connect with your gym</Text>
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
            placeholder="Password"
            placeholderTextColor={theme.colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.inputIcon}>{showPassword ? "🙈" : "👁"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Log in button */}
        <GradientButton
          label={loading ? "LOGGING IN..." : "LOG IN"}
          onPress={signIn}
          disabled={loading}
          style={styles.loginButton}
          textStyle={styles.loginText}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        {/* Social options — not wired up yet, shown as roadmap */}
        {[
          { icon: "🍎", label: "Continue with Apple" },
          { icon: "G", label: "Continue with Google" },
          { icon: "📱", label: "Continue with Phone" },
        ].map((s) => (
          <View key={s.label} style={styles.socialButton}>
            <Text style={styles.socialIcon}>{s.icon}</Text>
            <Text style={styles.socialText}>{s.label}</Text>
            <View style={styles.soonPill}>
              <Text style={styles.soonPillText}>SOON</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>New to SETLST? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.footerLink}>Create account</Text>
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
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },
  stacked: {
    width: 110,
    height: 110,
  },
  appName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 6,
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
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    color: theme.colors.teal,
    fontSize: 13,
  },
  loginButton: {
    marginTop: 4,
  },
  loginText: {
    fontSize: 15,
    letterSpacing: 2,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    opacity: 0.55,
  },
  socialIcon: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  socialText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  soonPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  soonPillText: {
    color: theme.colors.textMuted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingVertical: 24,
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
