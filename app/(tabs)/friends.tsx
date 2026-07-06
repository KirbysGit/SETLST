import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFriends, FriendRow } from "../../hooks/useFriends";
import { useFriendRequests, RequestRow } from "../../hooks/useFriendRequests";
import { FriendsSkeleton } from "../../components/skeletons/FriendsSkeleton";
import { Avatar } from "../../components/shared/Avatar";
import { GradientButton } from "../../components/shared/GradientButton";
import { text, theme } from "../../constants/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ icon, label, count }: { icon: IoniconsName; label: string; count?: number }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Ionicons name={icon} size={13} color={theme.colors.textSubtle} />
      <Text style={styles.sectionLabel}>{label}</Text>
      {count != null && <Text style={styles.sectionCount}>{count}</Text>}
    </View>
  );
}

// ─── Gym line ─────────────────────────────────────────────────────────────────
function GymLine({ gym }: { gym: string }) {
  return (
    <View style={styles.gymRow}>
      <Ionicons name="location-outline" size={11} color={theme.colors.textSubtle} />
      <Text style={styles.gymText} numberOfLines={1}>{gym}</Text>
    </View>
  );
}

// ─── Request row ──────────────────────────────────────────────────────────────
function RequestCard({
  row,
  onAccept,
  onDecline,
}: {
  row: RequestRow;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.requestMain}
        onPress={() => router.push(`/user/${row.requester_id}`)}
        activeOpacity={0.75}
      >
        <Avatar name={row.display_name} imageUrl={row.avatar_url} size={48} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName} numberOfLines={1}>{row.display_name}</Text>
            {row.username && <Text style={styles.username}>@{row.username}</Text>}
          </View>
          {row.home_gym ? (
            <GymLine gym={row.home_gym} />
          ) : (
            <Text style={styles.gymText}>Wants to connect</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.requestActions}>
        <GradientButton size="sm" label="Accept" onPress={onAccept} />
        <TouchableOpacity style={styles.declineButton} onPress={onDecline} activeOpacity={0.8}>
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Friend row ───────────────────────────────────────────────────────────────
function FriendCard({ row }: { row: FriendRow }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/user/${row.friend_id}`)}
      activeOpacity={0.75}
    >
      {/* Avatar with status dot */}
      <View style={styles.avatarWrap}>
        <Avatar name={row.display_name} imageUrl={row.avatar_url} size={48} />
        <View style={[
          styles.statusDot,
          row.is_playing ? styles.statusDotActive : styles.statusDotIdle,
        ]} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName} numberOfLines={1}>
            {row.display_name}
          </Text>
          {row.username && (
            <Text style={styles.username}>@{row.username}</Text>
          )}
        </View>

        {/* Now playing / gym */}
        {row.track_name ? (
          <View style={styles.trackRow}>
            {row.album_art && (
              <Image source={{ uri: row.album_art }} style={styles.albumThumb} />
            )}
            <Text
              style={[styles.trackText, !row.is_playing && styles.trackTextPaused]}
              numberOfLines={1}
            >
              {row.track_name}
              {row.artist ? ` · ${row.artist}` : ""}
            </Text>
            {row.is_playing && (
              <View style={styles.liveWave}>
                {[5, 10, 7].map((h, i) => (
                  <View key={i} style={[styles.waveBit, { height: h }]} />
                ))}
              </View>
            )}
          </View>
        ) : row.home_gym ? (
          <GymLine gym={row.home_gym} />
        ) : null}
      </View>

      {/* Message button */}
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push(`/messages/${row.friend_id}`)}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="people-outline" size={30} color={theme.colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No connections yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap Connect on someone's profile in the gym feed to start building your network.
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function FriendsScreen() {
  const { friends, loading, reload } = useFriends();
  const { requests, reload: reloadRequests, accept, decline } = useFriendRequests();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadRequests();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([reload(), reloadRequests()]);
    setRefreshing(false);
  }

  async function onAccept(friendshipId: string) {
    try {
      await accept(friendshipId);
      await reload();
    } catch (e: any) {
      Alert.alert("Couldn't accept request", e?.message ?? "Try again.");
    }
  }

  async function onDecline(friendshipId: string) {
    try {
      await decline(friendshipId);
    } catch (e: any) {
      Alert.alert("Couldn't decline request", e?.message ?? "Try again.");
    }
  }

  const playing = friends.filter((f) => f.is_playing);
  const idle = friends.filter((f) => !f.is_playing);

  if (loading) {
    return <FriendsSkeleton />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        {friends.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{friends.length}</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.purple}
          />
        }
      >
          {/* Incoming requests */}
          {requests.length > 0 && (
            <View style={styles.section}>
              <SectionLabel icon="person-add-outline" label="Requests" count={requests.length} />
              {requests.map((r) => (
                <RequestCard
                  key={r.friendship_id}
                  row={r}
                  onAccept={() => onAccept(r.friendship_id)}
                  onDecline={() => onDecline(r.friendship_id)}
                />
              ))}
            </View>
          )}

          {friends.length === 0 && requests.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Currently playing */}
              {playing.length > 0 && (
                <View style={styles.section}>
                  <SectionLabel icon="musical-notes-outline" label="Listening now" count={playing.length} />
                  {playing.map((f) => <FriendCard key={f.friend_id} row={f} />)}
                </View>
              )}

              {/* Not playing */}
              {idle.length > 0 && (
                <View style={styles.section}>
                  <SectionLabel icon="people-outline" label="All friends" count={idle.length} />
                  {idle.map((f) => <FriendCard key={f.friend_id} row={f} />)}
                </View>
              )}
            </>
          )}
        </ScrollView>
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
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    ...text.pageTitle,
  },
  countBadge: {
    backgroundColor: theme.colors.purple + "25",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.purple + "50",
  },
  countText: {
    color: theme.colors.purple,
    fontSize: 13,
    fontFamily: theme.fonts.extrabold,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionLabel: {
    ...text.eyebrow,
  },
  sectionCount: {
    color: theme.colors.purple,
    fontSize: 11,
    fontFamily: theme.fonts.extrabold,
    marginLeft: 2,
  },

  // Card
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
  avatarWrap: {
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  statusDotActive: {
    backgroundColor: theme.colors.purple,
  },
  statusDotIdle: {
    backgroundColor: theme.colors.textSubtle,
  },

  // Info
  info: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  displayName: {
    ...text.cardTitle,
  },
  username: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.semibold,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  albumThumb: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  trackText: {
    flex: 1,
    color: theme.colors.purple,
    fontSize: 12,
    fontFamily: theme.fonts.semibold,
  },
  trackTextPaused: {
    color: theme.colors.textMuted,
  },
  liveWave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  waveBit: {
    width: 2.5,
    borderRadius: 2,
    backgroundColor: theme.colors.purple,
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gymText: {
    ...text.cardSubtitle,
  },

  // Message button
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // Request card
  requestMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  requestActions: {
    alignItems: "stretch",
    gap: 6,
  },
  declineButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  declineText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.bold,
  },

  // Empty
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    ...text.emptyTitle,
  },
  emptySubtitle: {
    ...text.emptySubtitle,
    maxWidth: 280,
  },
});
