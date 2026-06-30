import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Skeleton, SkeletonCard, SkeletonCircle } from "../shared/Skeleton";
import { theme } from "../../constants/theme";

function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Skeleton width={130} height={16} borderRadius={6} />
        <Skeleton width={88} height={22} borderRadius={theme.radius.pill} />
      </View>
      <SkeletonCard style={styles.sectionCard}>
        {Array.from({ length: rows }).map((_, index) => (
          <View key={index}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.row}>
              <Skeleton width="28%" height={12} />
              <Skeleton width="36%" height={12} />
            </View>
          </View>
        ))}
      </SkeletonCard>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <SkeletonCircle size={72} />
          <View style={styles.headerInfo}>
            <Skeleton width="68%" height={18} />
            <Skeleton width="42%" height={12} style={styles.headerLine} />
            <Skeleton width="55%" height={12} />
            <Skeleton width={120} height={22} borderRadius={6} style={styles.badge} />
          </View>
          <View style={styles.headerButtons}>
            <Skeleton width={72} height={28} borderRadius={8} />
            <Skeleton width={52} height={28} borderRadius={8} />
          </View>
        </View>

        <SectionSkeleton rows={4} />
        <SectionSkeleton rows={2} />
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Skeleton width={60} height={16} borderRadius={6} />
            <Skeleton width={88} height={22} borderRadius={theme.radius.pill} />
          </View>
          <View style={styles.statsRow}>
            <SkeletonCard style={styles.statCard}>
              <Skeleton width={28} height={24} borderRadius={6} />
              <Skeleton width={48} height={10} style={styles.statLine} />
              <Skeleton width={56} height={10} />
            </SkeletonCard>
            <SkeletonCard style={styles.statCard}>
              <Skeleton width={28} height={24} borderRadius={6} />
              <Skeleton width={48} height={10} style={styles.statLine} />
              <Skeleton width={56} height={10} />
            </SkeletonCard>
            <SkeletonCard style={styles.statCard}>
              <Skeleton width={28} height={24} borderRadius={6} />
              <Skeleton width={48} height={10} style={styles.statLine} />
              <Skeleton width={56} height={10} />
            </SkeletonCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  headerInfo: {
    flex: 1,
    paddingTop: 2,
  },
  headerLine: {
    marginTop: 6,
    marginBottom: 6,
  },
  badge: {
    marginTop: 8,
  },
  headerButtons: {
    gap: 6,
    alignItems: "flex-end",
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
  },
  statLine: {
    marginTop: 2,
  },
});
