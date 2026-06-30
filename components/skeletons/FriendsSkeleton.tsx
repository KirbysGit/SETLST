import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Skeleton, SkeletonCard, SkeletonCircle } from "../shared/Skeleton";
import { theme } from "../../constants/theme";

function FriendRowSkeleton() {
  return (
    <SkeletonCard style={styles.friendRow}>
      <SkeletonCircle size={48} />
      <View style={styles.friendCopy}>
        <View style={styles.nameRow}>
          <Skeleton width="42%" height={14} />
          <Skeleton width="28%" height={11} />
        </View>
        <View style={styles.trackRow}>
          <Skeleton width={16} height={16} borderRadius={3} />
          <Skeleton width="70%" height={11} />
        </View>
      </View>
      <SkeletonCircle size={36} />
    </SkeletonCard>
  );
}

export function FriendsSkeleton() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Skeleton width={120} height={28} borderRadius={8} />
        <Skeleton width={34} height={24} borderRadius={12} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Skeleton width={120} height={10} borderRadius={5} style={styles.sectionLabel} />
        <FriendRowSkeleton />
        <FriendRowSkeleton />
        <FriendRowSkeleton />

        <Skeleton
          width={80}
          height={10}
          borderRadius={5}
          style={styles.sectionLabelMuted}
        />
        <FriendRowSkeleton />
        <FriendRowSkeleton />
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  sectionLabelMuted: {
    marginTop: 14,
    marginBottom: 4,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  friendCopy: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
