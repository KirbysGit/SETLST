import { Alert, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePublicProfile } from "../../hooks/usePublicProfile";
import { PublicProfileView } from "../../components/profile/PublicProfileView";
import { PublicProfileSkeleton } from "../../components/skeletons/PublicProfileSkeleton";
import { sendFriendRequest, acceptFriendRequest } from "../../lib/friends";
import { theme } from "../../constants/theme";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile, presence, relationship, friendshipId, loading, reload } = usePublicProfile(id);

  async function handleConnect() {
    try {
      await sendFriendRequest(id);
      await reload();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not send request.");
    }
  }

  async function handleAccept() {
    if (!friendshipId) return;
    try {
      await acceptFriendRequest(friendshipId);
      await reload();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not accept request.");
    }
  }

  if (loading) {
    return <PublicProfileSkeleton />;
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Profile not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <PublicProfileView
        profile={profile}
        presence={presence}
        isOwnProfile={false}
        relationship={relationship}
        onWave={() => {
          // Wave is a V2 feature (push-notification gated) — no-op for now.
        }}
        onConnect={handleConnect}
        onAccept={handleAccept}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
});
