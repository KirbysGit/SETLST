import { Alert, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePublicProfile } from "../../hooks/usePublicProfile";
import { PublicProfileView } from "../../components/profile/PublicProfileView";
import { PublicProfileSkeleton } from "../../components/skeletons/PublicProfileSkeleton";
import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest } from "../../lib/friends";
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

  function handleMessage() {
    router.push(`/messages/${id}`);
  }

  async function removeFriendship(successMessage?: string) {
    if (!friendshipId) return;
    try {
      await cancelFriendRequest(friendshipId);
      await reload();
      if (successMessage) Alert.alert(successMessage);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Something went wrong.");
    }
  }

  function handleFriendOptions() {
    const name = profile?.display_name ?? "this Setlster";
    Alert.alert(name, "What would you like to do?", [
      { text: "Message", onPress: handleMessage },
      {
        text: "Remove friend",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            "Remove friend?",
            `You and ${name} will no longer be connected — they won't be notified.`,
            [
              { text: "Keep friend", style: "cancel" },
              { text: "Remove", style: "destructive", onPress: () => removeFriendship() },
            ]
          ),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  function handleCancelRequest() {
    Alert.alert("Cancel request?", "You can always send a new one later.", [
      { text: "Keep it", style: "cancel" },
      { text: "Cancel request", style: "destructive", onPress: () => removeFriendship() },
    ]);
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
        onConnect={handleConnect}
        onAccept={handleAccept}
        onMessage={handleMessage}
        onFriendOptions={handleFriendOptions}
        onCancelRequest={handleCancelRequest}
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
    fontFamily: theme.fonts.bold,
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
