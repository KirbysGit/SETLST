import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../lib/supabase";
import { theme } from "../../constants/theme";

export default function ProfileSetup() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Prefill from the existing profile so editing doesn't start from blank fields
  useEffect(() => {
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, onboarding_complete")
        .eq("id", user.id)
        .single();

      if (!data) return;
      if (data.display_name) setDisplayName(data.display_name);
      if (data.username) setUsername(data.username);
      if (data.avatar_url) {
        setAvatarUri(data.avatar_url);
        setSavedAvatarUrl(data.avatar_url);
      }
      setIsEditing(!!data.onboarding_complete);
    }
    loadExisting();
  }, []);

  const canContinue = displayName.trim().length >= 2 && username.trim().length >= 2;

  // ─── Avatar picker ───────────────────────────────────────────────────────────
  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to set a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS === "ios", // Android crop UI is broken on many devices
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  // ─── Upload avatar to Supabase Storage ───────────────────────────────────────
  async function uploadAvatar(userId: string): Promise<string | null> {
    if (!avatarUri) return null;
    setUploadingAvatar(true);

    try {
      const ext = avatarUri.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;

      const response = await fetch(avatarUri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { upsert: true, contentType: `image/${ext}` });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      console.warn("Avatar upload failed:", e);
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  }

  // ─── Save profile ────────────────────────────────────────────────────────────
  async function save() {
    if (!canContinue) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // Check username availability
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.trim().toLowerCase())
      .neq("id", user.id)
      .single();

    if (existing) {
      Alert.alert("Username taken", "That username is already in use. Try another.");
      setSaving(false);
      return;
    }

    // Only re-upload when the user actually picked a new image
    const avatarChanged = avatarUri !== null && avatarUri !== savedAvatarUrl;
    const avatarUrl = avatarChanged ? await uploadAvatar(user.id) : null;

    await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName.trim(),
      username: username.trim().toLowerCase(),
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    setSaving(false);
    if (isEditing) {
      router.back();
    } else {
      router.replace("/(onboarding)/connect-spotify");
    }
  }

  const initials = displayName.trim().slice(0, 2).toUpperCase() || "?";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Back button — only when editing an already-complete profile */}
        {isEditing && (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹  Back to profile</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>
            {isEditing ? "EDIT PROFILE" : "ACCOUNT SETUP · STEP 1"}
          </Text>
          <Text style={styles.title}>
            {isEditing ? "Update your\nprofile" : "Set up your\nprofile"}
          </Text>
          <Text style={styles.subtitle}>
            Choose how you'll appear to other Setlsters — your name and photo are public and visible on your profile, in the gym feed, and when you connect with others.
          </Text>
        </View>

        {/* Avatar picker */}
        <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} activeOpacity={0.8}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <LinearGradient
              colors={theme.gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarPlaceholder}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
          )}
          <View style={styles.avatarEditBadge}>
            {uploadingAvatar
              ? <ActivityIndicator size="small" color={theme.colors.background} />
              : <Text style={styles.avatarEditText}>+</Text>
            }
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to add a photo</Text>

        {/* Fields */}
        <View style={styles.fields}>
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <View style={styles.visibleBadge}>
                <Text style={styles.visibleBadgeText}>👁  Publicly visible</Text>
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Alex Rivera"
              placeholderTextColor={theme.colors.textMuted}
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={32}
              returnKeyType="next"
            />
            <Text style={styles.fieldHint}>
              Your full name or nickname — shown on your profile and in the gym feed
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View style={styles.visibleBadge}>
                <Text style={styles.visibleBadgeText}>👁  Publicly visible</Text>
              </View>
            </View>
            <View style={styles.usernameRow}>
              <Text style={styles.atSign}>@</Text>
              <TextInput
                style={[styles.input, styles.usernameInput]}
                placeholder="yourhandle"
                placeholderTextColor={theme.colors.textMuted}
                value={username}
                onChangeText={(t) => setUsername(t.replace(/[^a-z0-9_.]/gi, "").toLowerCase())}
                autoCapitalize="none"
                maxLength={20}
                returnKeyType="done"
              />
            </View>
            <Text style={styles.fieldHint}>
              Used to find and tag you — letters, numbers and underscores only
            </Text>
          </View>

          {/* Public info notice */}
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeText}>
              🔒  Your email address is never shown to other users.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaWrapper, !canContinue && styles.ctaDisabled]}
          onPress={save}
          disabled={!canContinue || saving}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={canContinue ? theme.gradients.brand : [theme.colors.border, theme.colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            {saving
              ? <ActivityIndicator color={theme.colors.background} />
              : <Text style={styles.ctaText}>{isEditing ? "Save changes" : "Continue →"}</Text>
            }
          </LinearGradient>
        </TouchableOpacity>
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
  inner: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: -8,
  },
  backButtonText: {
    color: theme.colors.teal,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
  header: {
    gap: 6,
  },
  stepLabel: {
    color: theme.colors.teal,
    fontSize: 11,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontFamily: theme.fonts.extrabold,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: theme.fonts.medium,
  },
  avatarWrap: {
    alignSelf: "center",
    marginTop: 4,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: theme.colors.background,
    fontSize: 28,
    fontFamily: theme.fonts.extrabold,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.purple,
    borderWidth: 2,
    borderColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    lineHeight: 20,
  },
  avatarHint: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    marginTop: -12,
  },
  fields: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: theme.colors.text,
    fontSize: 15,
    fontFamily: theme.fonts.medium,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingLeft: 14,
  },
  atSign: {
    color: theme.colors.teal,
    fontSize: 16,
    fontFamily: theme.fonts.extrabold,
    marginRight: 2,
  },
  usernameInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingLeft: 0,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  visibleBadge: {
    backgroundColor: theme.colors.elevated,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  visibleBadgeText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.fonts.semibold,
  },
  fieldHint: {
    color: theme.colors.textSubtle,
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    marginTop: 4,
    lineHeight: 15,
  },
  noticeBanner: {
    backgroundColor: theme.colors.elevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 4,
  },
  noticeText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    lineHeight: 18,
  },
  ctaWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaButton: {
    paddingVertical: 17,
    alignItems: "center",
    borderRadius: 14,
  },
  ctaText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0.5,
  },
});
