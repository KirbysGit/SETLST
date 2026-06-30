import { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFriends, FriendRow } from "../../hooks/useFriends";
import { FriendsSkeleton } from "../../components/skeletons/FriendsSkeleton";
import { theme } from "../../constants/theme";

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ row }: { row: FriendRow }) {
  const initials = row.display_name.slice(0, 2).toUpperCase();
  if (row.avatar_url) {
    return <Image source={{ uri: row.avatar_url }} style={styles.avatar} />;
  }
  return (
    <LinearGradient
      colors={["#2EF2C3", "#8B5CF6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatar}
    >
      <Text style={styles.avatarInitials}>{initials}</Text>
    </LinearGradient>
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
        <Avatar row={row} />
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
          <Text style={styles.gymText} numberOfLines={1}>
            📍 {row.home_gym}
          </Text>
        ) : null}
      </View>

      {/* Message button */}
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push(`/messages/${row.friend_id}`)}
        activeOpacity={0.8}
      >
        <Text style={styles.messageIcon}>✉</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🏋️</Text>
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
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
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
          {friends.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Currently playing */}
              {playing.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>🎧  Listening now</Text>
                  {playing.map((f) => <FriendCard key={f.friend_id} row={f} />)}
                </View>
              )}

              {/* Not playing */}
              {idle.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>All friends</Text>
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
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
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
    fontWeight: "800",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "900",
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
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  username: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
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
    fontWeight: "600",
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
  gymText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
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
  messageIcon: {
    fontSize: 15,
  },

  // Empty
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
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
});
