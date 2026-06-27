import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeBackground } from "../home/HomeBackground";
import { Skeleton, SkeletonCard, SkeletonCircle } from "../shared/Skeleton";
import { theme } from "../../constants/theme";

function HeaderSkeleton() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Skeleton width={140} height={28} borderRadius={6} />
        <Skeleton width={190} height={12} style={styles.headerEyebrow} />
      </View>
      <View style={styles.headerActions}>
        <SkeletonCircle size={42} />
        <SkeletonCircle size={42} />
      </View>
    </View>
  );
}

function TrackBarSkeleton() {
  return (
    <SkeletonCard style={styles.trackCard}>
      <Skeleton width={130} height={10} borderRadius={5} />
      <View style={styles.trackRow}>
        <Skeleton width={48} height={48} borderRadius={8} />
        <View style={styles.trackCopy}>
          <Skeleton width="78%" height={14} />
          <Skeleton width="52%" height={12} style={styles.trackArtist} />
        </View>
        <Skeleton width={36} height={24} borderRadius={6} />
      </View>
    </SkeletonCard>
  );
}

function PulseSkeleton() {
  return (
    <SkeletonCard style={styles.pulseCard}>
      <View style={styles.pulseRow}>
        <View style={styles.pulseSection}>
          <Skeleton width={70} height={10} borderRadius={5} />
          <Skeleton width="85%" height={16} style={styles.pulseLine} />
          <Skeleton width="65%" height={12} />
        </View>
        <View style={styles.pulseDivider} />
        <View style={styles.pulseSection}>
          <Skeleton width={95} height={10} borderRadius={5} />
          <Skeleton width="80%" height={16} style={styles.pulseLine} />
          <Skeleton width="55%" height={12} />
        </View>
      </View>
    </SkeletonCard>
  );
}

function PeopleStripSkeleton() {
  return (
    <View style={styles.section}>
      <Skeleton width={90} height={10} borderRadius={5} />
      <Skeleton width={170} height={18} style={styles.sectionTitle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.peopleRow}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.personBubble}>
              <SkeletonCircle size={54} />
              <Skeleton width={56} height={10} style={styles.personName} />
              <Skeleton width={64} height={8} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function FeedRowSkeleton() {
  return (
    <SkeletonCard style={styles.feedRow}>
      <SkeletonCircle size={38} />
      <Skeleton width={44} height={44} borderRadius={8} />
      <View style={styles.feedCopy}>
        <Skeleton width="72%" height={14} />
        <Skeleton width="88%" height={12} style={styles.feedArtist} />
      </View>
      <Skeleton width={28} height={22} borderRadius={6} />
    </SkeletonCard>
  );
}

function FeedSkeleton() {
  return (
    <View style={styles.section}>
      <View style={styles.feedHeader}>
        <View>
          <Skeleton width={110} height={10} borderRadius={5} />
          <Skeleton width={150} height={18} style={styles.sectionTitle} />
        </View>
        <Skeleton width={78} height={28} borderRadius={theme.radius.pill} />
      </View>
      <View style={styles.feedRows}>
        <FeedRowSkeleton />
        <FeedRowSkeleton />
        <FeedRowSkeleton />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.root}>
      <HomeBackground />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <HeaderSkeleton />
          <TrackBarSkeleton />
          <PulseSkeleton />
          <PeopleStripSkeleton />
          <FeedSkeleton />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  headerLeft: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  headerEyebrow: {
    marginTop: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  trackCard: {
    marginBottom: theme.spacing.lg,
    gap: 12,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trackCopy: {
    flex: 1,
  },
  trackArtist: {
    marginTop: 6,
  },
  pulseCard: {
    marginBottom: theme.spacing.lg,
  },
  pulseRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  pulseSection: {
    flex: 1,
  },
  pulseDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  pulseLine: {
    marginTop: 8,
    marginBottom: 6,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: theme.spacing.md,
  },
  peopleRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
  personBubble: {
    width: 82,
    alignItems: "center",
    gap: 6,
  },
  personName: {
    marginTop: 4,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  feedRows: {
    gap: 10,
  },
  feedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  feedCopy: {
    flex: 1,
  },
  feedArtist: {
    marginTop: 6,
  },
});
