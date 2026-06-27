import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Skeleton, SkeletonCard, SkeletonCircle } from "../shared/Skeleton";
import { theme } from "../../constants/theme";

export function PublicProfileSkeleton({ showActions = true }: { showActions?: boolean }) {
  return (
    <SafeAreaView style={styles.safe}>
      <Skeleton width={64} height={16} borderRadius={6} style={styles.back} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.hero}>
          <SkeletonCircle size={88} />
          <Skeleton width="58%" height={22} borderRadius={8} style={styles.heroLine} />
          <Skeleton width="36%" height={14} borderRadius={6} />
          <View style={styles.metaRow}>
            <Skeleton width={120} height={28} borderRadius={theme.radius.pill} />
            <Skeleton width={96} height={28} borderRadius={theme.radius.pill} />
          </View>
          {showActions && (
            <View style={styles.actions}>
              <Skeleton width="38%" height={42} borderRadius={12} />
              <Skeleton width="58%" height={42} borderRadius={12} />
            </View>
          )}
        </View>

        <SkeletonCard style={styles.nowPlaying}>
          <Skeleton width={110} height={10} borderRadius={5} />
          <View style={styles.nowPlayingRow}>
            <Skeleton width={52} height={52} borderRadius={8} />
            <View style={styles.nowPlayingCopy}>
              <Skeleton width="75%" height={14} />
              <Skeleton width="50%" height={12} style={styles.nowPlayingArtist} />
            </View>
            <Skeleton width={24} height={20} borderRadius={6} />
          </View>
        </SkeletonCard>

        <View style={styles.section}>
          <Skeleton width={130} height={14} borderRadius={6} style={styles.sectionTitle} />
          <SkeletonCard>
            <View style={styles.row}>
              <Skeleton width="30%" height={12} />
              <Skeleton width="34%" height={12} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Skeleton width="24%" height={12} />
              <Skeleton width="40%" height={12} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Skeleton width="32%" height={12} />
              <Skeleton width="28%" height={12} />
            </View>
          </SkeletonCard>
        </View>

        <View style={styles.section}>
          <Skeleton width={90} height={14} borderRadius={6} style={styles.sectionTitle} />
          <SkeletonCard>
            <Skeleton width="88%" height={14} />
            <View style={styles.chips}>
              <Skeleton width={72} height={28} borderRadius={theme.radius.pill} />
              <Skeleton width={96} height={28} borderRadius={theme.radius.pill} />
            </View>
          </SkeletonCard>
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
  back: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  heroLine: {
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 12,
  },
  nowPlaying: {
    marginBottom: 24,
    gap: 12,
  },
  nowPlayingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nowPlayingCopy: {
    flex: 1,
  },
  nowPlayingArtist: {
    marginTop: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
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
  chips: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
  },
});
