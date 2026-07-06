import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
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
import { formatClockTime } from "../../lib/time";
import { Avatar } from "../../components/shared/Avatar";
import { GradientButton } from "../../components/shared/GradientButton";
import { text, theme } from "../../constants/theme";

// ─── Chat bubble with pop-in ──────────────────────────────────────────────────
function Bubble({
  message,
  mine,
  grouped,
  showTime,
  animate,
}: {
  message: Message;
  mine: boolean;
  grouped: boolean;
  showTime: boolean;
  animate: boolean;
}) {
  const scale = useRef(new Animated.Value(animate ? 0.5 : 1)).current;
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 13, stiffness: 260 }),
      Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        mine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
        { marginVertical: grouped ? 2 : 6, opacity, transform: [{ scale }] },
      ]}
    >
      <View
        style={[
          styles.bubble,
          mine ? styles.bubbleMine : styles.bubbleTheirs,
          grouped && (mine ? styles.bubbleMineGrouped : styles.bubbleTheirsGrouped),
        ]}
      >
        <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>
          {message.body}
        </Text>
      </View>
      {showTime && (
        <Text style={styles.bubbleTime}>{formatClockTime(message.created_at)}</Text>
      )}
    </Animated.View>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingBubble() {
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    const loops = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(dot, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 280, useNativeDriver: true }),
          Animated.delay((2 - i) * 140),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);

  return (
    <View style={[styles.bubbleRow, styles.bubbleRowTheirs, { marginVertical: 6 }]}>
      <View style={[styles.bubble, styles.bubbleTheirs, styles.typingBubble]}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { opacity: dot }]} />
        ))}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile, relationship, loading: profileLoading } = usePublicProfile(id);
  const { messages, myId, loading: chatLoading, peerTyping, send, notifyTyping, loadOlder } = useChat(id);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  // Messages created after this moment pop in; history loads static.
  const mountTimeRef = useRef(Date.now());

  const loading = profileLoading || chatLoading;
  const canChat = relationship === "friends";
  const friendName = profile?.display_name ?? "your gym friend";

  function onChangeDraft(value: string) {
    setDraft(value);
    if (value.length > 0) notifyTyping();
  }

  async function deliver(body: string) {
    try {
      await send(body);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Message failed to send.");
      throw e;
    }
  }

  async function handleSend() {
    if (!draft.trim() || sending) return;
    setSending(true);
    const value = draft;
    setDraft("");
    try {
      await deliver(value);
    } catch {
      setDraft(value);
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Ambient depth */}
      <LinearGradient
        colors={[theme.colors.purple + "14", "transparent"]}
        style={[styles.glow, styles.glowTop]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", theme.colors.teal + "0D"]}
        style={[styles.glow, styles.glowBottom]}
        pointerEvents="none"
      />

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
            <Avatar
              name={profile?.display_name ?? "??"}
              imageUrl={profile?.avatar_url}
              size={38}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {profile?.display_name ?? "Setlster"}
              </Text>
              <Text style={styles.headerStatus} numberOfLines={1}>
                {peerTyping ? "typing…" : profile?.username ? `@${profile.username}` : ""}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.purple} />
          </View>
        ) : messages.length === 0 ? (
          // Rendered outside the FlatList: the inverted list mirrors its
          // children, which flipped this text on Android.
          <View style={styles.emptyChat}>
            {canChat && (
              <>
                <Avatar
                  name={profile?.display_name ?? "??"}
                  imageUrl={profile?.avatar_url}
                  size={72}
                />
                <Text style={styles.emptyChatTitle}>{friendName}</Text>
                <Text style={styles.emptyChatText}>
                  No messages yet — break the ice.
                </Text>
                <GradientButton
                  size="md"
                  label="Say hey  👋"
                  onPress={() => deliver("👋").catch(() => {})}
                />
              </>
            )}
          </View>
        ) : (
          <FlatList
            data={messages}
            inverted
            keyExtractor={(m) => m.id}
            renderItem={({ item, index }) => {
              const mine = item.sender_id === myId;
              // Inverted list: index - 1 is the *newer* neighbor.
              const newer = messages[index - 1];
              const lastInGroup =
                !newer ||
                newer.sender_id !== item.sender_id ||
                new Date(newer.created_at).getTime() - new Date(item.created_at).getTime() > 4 * 60_000;
              return (
                <Bubble
                  message={item}
                  mine={mine}
                  grouped={!lastInGroup}
                  showTime={lastInGroup}
                  animate={new Date(item.created_at).getTime() > mountTimeRef.current}
                />
              );
            }}
            contentContainerStyle={styles.list}
            onEndReached={loadOlder}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={peerTyping ? <TypingBubble /> : null}
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
              onChangeText={onChangeDraft}
              multiline
              maxLength={2000}
            />
            <GradientButton
              size="icon"
              icon={<Ionicons name="arrow-up" size={18} color={theme.colors.background} />}
              onPress={handleSend}
              disabled={!draft.trim() || sending}
            />
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
  glow: {
    position: "absolute",
    left: -40,
    right: -40,
    height: 280,
  },
  glowTop: {
    top: 0,
  },
  glowBottom: {
    bottom: 0,
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
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    ...text.cardTitle,
    fontSize: 16,
  },
  headerStatus: {
    color: theme.colors.teal,
    fontSize: 12,
    fontFamily: theme.fonts.semibold,
    marginTop: 1,
  },

  // Messages
  list: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  bubbleRow: {
    maxWidth: "78%",
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
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
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
  bubbleMineGrouped: {
    borderTopRightRadius: 8,
  },
  bubbleTheirsGrouped: {
    borderTopLeftRadius: 8,
  },
  bubbleTextMine: {
    color: theme.colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.fonts.medium,
  },
  bubbleTextTheirs: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.fonts.medium,
  },
  bubbleTime: {
    ...text.caption,
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 4,
  },

  // Typing indicator
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 14,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },

  // Empty chat
  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 40,
  },
  emptyChatTitle: {
    ...text.emptyTitle,
    marginTop: 6,
  },
  emptyChatText: {
    ...text.emptySubtitle,
    marginBottom: 8,
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
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    maxHeight: 110,
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
    ...text.body,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
