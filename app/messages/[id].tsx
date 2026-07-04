import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { usePublicProfile } from "../../hooks/usePublicProfile";
import { useChat } from "../../hooks/useChat";
import { Message } from "../../lib/messages";
import { theme } from "../../constants/theme";

function formatTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${m} ${ampm}`;
}

function Bubble({ message, mine }: { message: Message; mine: boolean }) {
  return (
    <View style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>
          {message.body}
        </Text>
      </View>
      <Text style={styles.bubbleTime}>{formatTime(message.created_at)}</Text>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile, relationship, loading: profileLoading } = usePublicProfile(id);
  const { messages, myId, loading: chatLoading, send, loadOlder } = useChat(id);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const loading = profileLoading || chatLoading;
  const canChat = relationship === "friends";
  const initials = profile?.display_name?.slice(0, 2).toUpperCase() ?? "??";

  async function handleSend() {
    if (!draft.trim() || sending) return;
    setSending(true);
    const text = draft;
    setDraft("");
    try {
      await send(text);
    } catch (e: any) {
      setDraft(text);
      Alert.alert("Error", e?.message ?? "Message failed to send.");
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerProfile}
            onPress={() => router.push(`/user/${id}`)}
            activeOpacity={0.75}
          >
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.headerAvatar} />
            ) : (
              <LinearGradient
                colors={["#2EF2C3", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerAvatar}
              >
                <Text style={styles.headerInitials}>{initials}</Text>
              </LinearGradient>
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {profile?.display_name ?? "Setlster"}
              </Text>
              {profile?.username && (
                <Text style={styles.headerUsername}>@{profile.username}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.purple} />
          </View>
        ) : (
          <FlatList
            data={messages}
            inverted
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <Bubble message={item} mine={item.sender_id === myId} />}
            contentContainerStyle={styles.list}
            onEndReached={loadOlder}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>
                  {canChat
                    ? `Say hey to ${profile?.display_name ?? "your gym friend"} 👋`
                    : ""}
                </Text>
              </View>
            }
          />
        )}

        {/* Composer / guard */}
        {!loading && !canChat ? (
          <View style={styles.guard}>
            <Text style={styles.guardText}>
              You can only message friends. Connect with{" "}
              {profile?.display_name ?? "this user"} first.
            </Text>
          </View>
        ) : (
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor={theme.colors.textMuted}
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!draft.trim() || sending}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#2EF2C3", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendGradient}
              >
                <Ionicons name="arrow-up" size={18} color={theme.colors.background} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 4,
  },
  backButton: {
    padding: 6,
  },
  headerProfile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInitials: {
    color: theme.colors.background,
    fontSize: 13,
    fontWeight: "900",
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  headerUsername: {
    color: theme.colors.teal,
    fontSize: 12,
    fontWeight: "600",
  },

  // Messages
  list: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  bubbleRow: {
    maxWidth: "80%",
  },
  bubbleRowMine: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  bubbleRowTheirs: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: theme.colors.purple,
    borderBottomRightRadius: 6,
  },
  bubbleTheirs: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 6,
  },
  bubbleTextMine: {
    color: theme.colors.white,
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextTheirs: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTime: {
    color: theme.colors.textSubtle,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 3,
    marginHorizontal: 4,
  },
  emptyChat: {
    // Inverted list flips children — flip back so the prompt reads upright.
    transform: [{ scaleY: -1 }],
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyChatText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },

  // Composer
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 110,
  },
  sendButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendGradient: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Guard
  guard: {
    margin: 14,
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  guardText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 19,
  },
});
