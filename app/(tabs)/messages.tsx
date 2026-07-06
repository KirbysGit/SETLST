import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useConversations, ConversationRow } from "../../hooks/useConversations";
import { useFriends } from "../../hooks/useFriends";
import { timeAgo } from "../../lib/time";
import { Avatar } from "../../components/shared/Avatar";
import { theme } from "../../constants/theme";

function ConversationCard({ row }: { row: ConversationRow }) {
  const router = useRouter();
  const unread = row.unread_count > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/messages/${row.user_id}`)}
      activeOpacity={0.75}
    >
      <Avatar name={row.display_name} imageUrl={row.avatar_url} size={50} />

      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, unread && styles.cardNameUnread]} numberOfLines={1}>
          {row.display_name}
        </Text>
        <Text
          style={[styles.cardPreview, unread && styles.cardPreviewUnread]}
          numberOfLines={1}
        >
          {row.last_from_me ? `You: ${row.last_body}` : row.last_body}
        </Text>
      </View>

      <View style={styles.cardMeta}>
        <Text style={styles.cardTime}>{timeAgo(row.last_at)}</Text>
        {unread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {row.unread_count > 99 ? "99+" : row.unread_count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations, loading, reload } = useConversations();
  const { friends } = useFriends();
  const [refreshing, setRefreshing] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }

  function startChat(userId: string) {
    setShowNewChat(false);
    router.push(`/messages/${userId}`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => setShowNewChat(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Conversation list */}
      <FlatList
        data={conversations}
        keyExtractor={(c) => c.user_id}
        renderItem={({ item }) => <ConversationCard row={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.purple}
          />
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySubtitle}>
                Say hey to a gym friend — tap the ✎ button to start a chat.
              </Text>
            </View>
          )
        }
      />

      {/* New chat modal */}
      <Modal
        visible={showNewChat}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNewChat(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New chat</Text>
              <TouchableOpacity onPress={() => setShowNewChat(false)}>
                <Ionicons name="close" size={22} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {friends.length === 0 ? (
              <Text style={styles.modalEmpty}>
                No friends yet — connect with someone from the gym feed first.
              </Text>
            ) : (
              <FlatList
                data={friends}
                keyExtractor={(f) => f.friend_id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.friendRow}
                    onPress={() => startChat(item.friend_id)}
                    activeOpacity={0.75}
                  >
                    <Avatar name={item.display_name} imageUrl={item.avatar_url} size={42} />
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName} numberOfLines={1}>
                        {item.display_name}
                      </Text>
                      {item.username && (
                        <Text style={styles.friendUsername}>@{item.username}</Text>
                      )}
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={17}
                      color={theme.colors.textSubtle}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
    flexGrow: 1,
  },

  // Conversation card
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  cardName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  cardNameUnread: {
    fontWeight: "900",
  },
  cardPreview: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  cardPreviewUnread: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  cardMeta: {
    alignItems: "flex-end",
    gap: 6,
  },
  cardTime: {
    color: theme.colors.textSubtle,
    fontSize: 12,
    fontWeight: "600",
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: theme.colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "800",
  },

  // Empty
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 60,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  emptySubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
  },

  // New chat modal
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.black + "B0",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    maxHeight: "70%",
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  modalEmpty: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    paddingVertical: 16,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  friendInfo: {
    flex: 1,
    minWidth: 0,
  },
  friendName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  friendUsername: {
    color: theme.colors.teal,
    fontSize: 12,
    fontWeight: "600",
  },
});
