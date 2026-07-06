import { ScrollView, StyleSheet, Text, View } from "react-native";

import { MockUser, activityStats, mockUsers, weeklyProgress } from "../../constants/mockData";
import { theme } from "../../constants/theme";
import { AppHeader } from "../layout/AppHeader";
import { ActionButton } from "../shared/ActionButton";
import { Avatar } from "../shared/Avatar";
import { Card } from "../shared/Card";
import { Pill } from "../shared/Pill";
import { StatusCard } from "./StatusCard";

const waveformBars = [10, 16, 12, 22, 15, 26, 18, 30, 21, 17, 24, 14, 20, 12];

const mapPositions = [
  { top: 30, left: 34 },
  { top: 42, right: 36 },
  { top: 116, left: 138 },
  { bottom: 48, left: 52 },
  { bottom: 36, right: 60 }
];

export function MapFocusedDashboard() {
  return (
    <>
      <AppHeader eyebrow="Crunch Fitness - Sunset" accentColor={theme.colors.teal} />
      <GymStatusRow accentColor={theme.colors.teal} />
      <StatusCard accentColor={theme.colors.teal} accentTone="teal" />
      <MapPresenceCard users={mockUsers} />

      <SectionHeader
        kicker="Nearby"
        title="People Around You"
        action="See all"
        accentColor={theme.colors.teal}
      />
      <NearbyPeopleStrip users={mockUsers} accentColor={theme.colors.teal} showActions />

      <CompactStatsRow accentColor={theme.colors.teal} accentTone="teal" />
      <ActivityPreview accentColor={theme.colors.teal} />
    </>
  );
}

export function MusicFocusedDashboard() {
  return (
    <>
      <AppHeader eyebrow="Crunch Fitness - Sunset" accentColor={theme.colors.purple} />
      <GymStatusRow accentColor={theme.colors.purple} />
      <StatusCard accentColor={theme.colors.purple} accentTone="purple" />

      <SectionHeader
        kicker="Now playing"
        title="Live Gym Setlist"
        action="See all"
        accentColor={theme.colors.purple}
      />
      <MusicFeed users={mockUsers} />

      <SectionHeader
        kicker="Listeners"
        title="People Listening"
        action="See all"
        accentColor={theme.colors.purple}
      />
      <NearbyPeopleStrip users={mockUsers} accentColor={theme.colors.purple} />

      <CompactStatsRow accentColor={theme.colors.purple} accentTone="purple" />
      <ActivityPreview accentColor={theme.colors.purple} />
    </>
  );
}

function GymStatusRow({ accentColor }: { accentColor: string }) {
  return (
    <View style={styles.gymRow}>
      <View style={styles.locationChip}>
        <Text style={styles.locationIcon}>O</Text>
        <Text style={styles.locationText} numberOfLines={1}>
          Crunch Fitness - Sunset
        </Text>
        <Text style={styles.chevron}>v</Text>
      </View>
      <View style={styles.activeChip}>
        <View style={[styles.activeDot, { backgroundColor: accentColor }]} />
        <Text style={[styles.activeText, { color: accentColor }]}>Active</Text>
      </View>
    </View>
  );
}

function SectionHeader({
  kicker,
  title,
  action,
  accentColor
}: {
  kicker: string;
  title: string;
  action: string;
  accentColor: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={[styles.sectionAction, { color: accentColor }]}>{action}</Text>
    </View>
  );
}

function MapPresenceCard({ users }: { users: MockUser[] }) {
  return (
    <Card style={styles.mapCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.kicker}>Approximate zones</Text>
          <Text style={styles.cardTitle}>Live Presence Map</Text>
        </View>
        <Pill label={`${users.length} active`} tone="teal" />
      </View>

      <View style={styles.mapCanvas}>
        <View style={[styles.mapLine, styles.mapLineOne]} />
        <View style={[styles.mapLine, styles.mapLineTwo]} />
        <View style={[styles.mapLine, styles.mapLineThree]} />
        <View style={[styles.mapLine, styles.mapLineFour]} />
        <View style={styles.zoneRingOuter} />
        <View style={styles.zoneRingInner} />
        <View style={styles.centerMarker}>
          <Avatar
            name="You"
            color="#25323C"
            accentColor={theme.colors.teal}
            size={50}
          />
          <View style={styles.youPulse} />
        </View>

        {users.slice(0, 5).map((user, index) => (
          <View key={user.id} style={[styles.mapMarker, mapPositions[index] ?? mapPositions[0]]}>
            <Avatar
              name={user.displayName}
              color={user.avatarColor}
              accentColor={theme.colors.teal}
              size={42}
            />
            <View style={styles.markerStatusDot} />
          </View>
        ))}
      </View>

      <Text style={styles.mapNote}>
        Built as a social presence board, not exact location tracking.
      </Text>
    </Card>
  );
}

function NearbyPeopleStrip({
  users,
  accentColor,
  showActions = false
}: {
  users: MockUser[];
  accentColor: string;
  showActions?: boolean;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.peopleStrip}
    >
      {users.map((user) => (
        <View key={user.id} style={styles.personPreview}>
          <Avatar
            name={user.displayName}
            color={user.avatarColor}
            accentColor={accentColor}
            size={54}
          />
          <Text style={styles.personName} numberOfLines={1}>
            {user.displayName}
          </Text>
          <Text style={styles.personSong} numberOfLines={1}>
            {user.song}
          </Text>
          {showActions ? (
            <ActionButton
              label={user.status === "Open" ? "Wave" : "Add"}
              variant={user.status === "Open" ? "primary" : "ghost"}
              style={styles.personAction}
              textStyle={styles.personActionText}
            />
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

function MusicFeed({ users }: { users: MockUser[] }) {
  return (
    <View style={styles.musicFeed}>
      {users.slice(0, 4).map((user) => (
        <Card key={user.id} style={styles.musicRow}>
          <View style={[styles.albumArt, { borderColor: user.accentColor }]}>
            <Text style={styles.albumInitial}>{user.song[0]}</Text>
          </View>

          <View style={styles.musicCopy}>
            <Text style={styles.musicSong} numberOfLines={1}>
              {user.song}
            </Text>
            <Text style={styles.musicArtist} numberOfLines={1}>
              {user.artist} - {user.displayName}
            </Text>
          </View>

          <Waveform color={user.accentColor} />
          <Avatar
            name={user.displayName}
            color={user.avatarColor}
            accentColor={user.accentColor}
            size={42}
          />
        </Card>
      ))}
    </View>
  );
}

function Waveform({ color }: { color: string }) {
  return (
    <View style={styles.waveform}>
      {waveformBars.map((height, index) => (
        <View
          key={`${height}-${index}`}
          style={[styles.waveformBar, { height, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

function CompactStatsRow({
  accentColor,
  accentTone
}: {
  accentColor: string;
  accentTone: "teal" | "purple";
}) {
  return (
    <View style={styles.statsRow}>
      <Card style={[styles.statCard, { borderColor: `${accentColor}80` }]}>
        <Pill label="Gym streak" tone={accentTone} />
        <Text style={styles.statValue}>14</Text>
        <Text style={styles.statLabel}>days</Text>
        <View style={styles.bars}>
          {[18, 30, 42, 54].map((height, index) => (
            <View
              key={`${height}-${index}`}
              style={[styles.statBar, { height }, index === 3 && { backgroundColor: accentColor }]}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.statCard}>
        <Text style={styles.weekTitle}>This week</Text>
        <Text style={styles.weekValue}>4/5</Text>
        <Text style={styles.statLabel}>workouts</Text>
        <View style={styles.weekDots}>
          {weeklyProgress.map((item, index) => (
            <View key={`${item.day}-${index}`} style={styles.weekDay}>
              <View
                style={[
                  styles.weekDot,
                  item.done && { backgroundColor: accentColor, borderColor: accentColor }
                ]}
              />
              <Text style={styles.weekDayText}>{item.day}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function ActivityPreview({ accentColor }: { accentColor: string }) {
  return (
    <Card style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.cardTitle}>Activity</Text>
        <Text style={[styles.sectionAction, { color: accentColor }]}>See all</Text>
      </View>

      {activityStats.map((stat, index) => (
        <View key={stat.label} style={styles.activityRow}>
          <View style={[styles.activityIcon, { borderColor: stat.accentColor }]} />
          <View style={styles.activityCopy}>
            <Text style={styles.activityText}>
              {stat.value} {stat.label}
            </Text>
            <View style={styles.activityLine} />
          </View>
          <Text style={styles.activityTime}>{index === 0 ? "2m" : index === 1 ? "18m" : "31m"}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  gymRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  locationChip: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md
  },
  locationIcon: {
    color: theme.colors.text,
    fontSize: 13,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  locationText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  chevron: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  activeChip: {
    minWidth: 92,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md
  },
  activeDot: {
    width: 9,
    height: 9,
    borderRadius: 5
  },
  activeText: {
    fontSize: theme.typography.small,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  kicker: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    fontFamily: theme.fonts.extrabold,
    textTransform: "uppercase",
    letterSpacing: 0,
    marginBottom: 4
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    lineHeight: 23,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  sectionAction: {
    fontSize: theme.typography.small,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    lineHeight: 23,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  mapCard: {
    marginBottom: theme.spacing.xl
  },
  mapCanvas: {
    height: 278,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.black
  },
  mapLine: {
    position: "absolute",
    height: 1,
    backgroundColor: "rgba(143, 152, 168, 0.18)"
  },
  mapLineOne: {
    width: 380,
    top: 56,
    left: -34,
    transform: [{ rotate: "-14deg" }]
  },
  mapLineTwo: {
    width: 360,
    top: 140,
    left: 18,
    transform: [{ rotate: "21deg" }]
  },
  mapLineThree: {
    width: 320,
    bottom: 64,
    left: -18,
    transform: [{ rotate: "-32deg" }]
  },
  mapLineFour: {
    width: 280,
    top: 28,
    right: -60,
    transform: [{ rotate: "74deg" }]
  },
  zoneRingOuter: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 130,
    height: 130,
    marginLeft: -65,
    marginTop: -65,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: "rgba(46, 242, 195, 0.24)",
    backgroundColor: "rgba(46, 242, 195, 0.04)"
  },
  zoneRingInner: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 80,
    height: 80,
    marginLeft: -40,
    marginTop: -40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(46, 242, 195, 0.42)"
  },
  centerMarker: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 70,
    height: 70,
    marginLeft: -35,
    marginTop: -35,
    alignItems: "center",
    justifyContent: "center"
  },
  youPulse: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.teal
  },
  mapMarker: {
    position: "absolute"
  },
  markerStatusDot: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.black,
    backgroundColor: theme.colors.teal
  },
  mapNote: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.semibold,
    letterSpacing: 0,
    marginTop: theme.spacing.md
  },
  peopleStrip: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  personPreview: {
    width: 86,
    alignItems: "center"
  },
  personName: {
    width: "100%",
    color: theme.colors.text,
    fontSize: theme.typography.small,
    lineHeight: 17,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0,
    textAlign: "center",
    marginTop: theme.spacing.sm
  },
  personSong: {
    width: "100%",
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: theme.fonts.bold,
    letterSpacing: 0,
    textAlign: "center"
  },
  personAction: {
    minHeight: 30,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm
  },
  personActionText: {
    fontSize: 11
  },
  musicFeed: {
    marginBottom: theme.spacing.lg
  },
  musicRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  albumArt: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.elevated
  },
  albumInitial: {
    color: theme.colors.text,
    fontSize: 20,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  musicCopy: {
    flex: 1,
    minWidth: 0
  },
  musicSong: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    lineHeight: 19,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  musicArtist: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.semibold,
    letterSpacing: 0,
    marginTop: 3
  },
  waveform: {
    width: 84,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
    opacity: 0.74
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  statCard: {
    flex: 1,
    minHeight: 146,
    overflow: "hidden"
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0,
    marginTop: theme.spacing.lg
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.semibold,
    letterSpacing: 0
  },
  bars: {
    position: "absolute",
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    height: 58,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm
  },
  statBar: {
    width: 10,
    borderRadius: 5,
    backgroundColor: "rgba(143, 152, 168, 0.32)"
  },
  weekTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  weekValue: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 33,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0,
    marginTop: theme.spacing.md
  },
  weekDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginTop: theme.spacing.md
  },
  weekDay: {
    alignItems: "center",
    gap: 4
  },
  weekDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.elevated
  },
  weekDayText: {
    color: theme.colors.textMuted,
    fontSize: 9,
    lineHeight: 11,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  activityCard: {
    marginBottom: theme.spacing.xl
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md
  },
  activityRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(143, 152, 168, 0.12)"
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    backgroundColor: theme.colors.elevated
  },
  activityCopy: {
    flex: 1,
    gap: 7
  },
  activityText: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    lineHeight: 18,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  },
  activityLine: {
    width: "70%",
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(143, 152, 168, 0.22)"
  },
  activityTime: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.micro,
    fontFamily: theme.fonts.extrabold,
    letterSpacing: 0
  }
});
