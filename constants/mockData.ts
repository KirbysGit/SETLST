import { theme } from "./theme";

export type PresenceStatus = "Open" | "Focused";

export type MockUser = {
  id: string;
  username: string;
  displayName: string;
  song: string;
  artist: string;
  status: PresenceStatus;
  streakWeeks: number;
  avatarColor: string;
  accentColor: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "luis",
    username: "LiftingLuis",
    displayName: "Luis",
    song: "Go Flex",
    artist: "Post Malone",
    status: "Open",
    streakWeeks: 5,
    avatarColor: "#214C44",
    accentColor: theme.colors.teal
  },
  {
    id: "maya",
    username: "sweat.beats",
    displayName: "Maya",
    song: "Water",
    artist: "Tyla",
    status: "Focused",
    streakWeeks: 2,
    avatarColor: "#31254B",
    accentColor: theme.colors.purple
  },
  {
    id: "andre",
    username: "GymReaper",
    displayName: "Andre",
    song: "Till I Collapse",
    artist: "Eminem",
    status: "Open",
    streakWeeks: 8,
    avatarColor: "#263B56",
    accentColor: theme.colors.blue
  },
  {
    id: "kay",
    username: "fit.with.kay",
    displayName: "Kay",
    song: "Good Days",
    artist: "SZA",
    status: "Open",
    streakWeeks: 4,
    avatarColor: "#3E2C44",
    accentColor: theme.colors.purple
  },
  {
    id: "dre",
    username: "andre.sets",
    displayName: "Andre",
    song: "Like That",
    artist: "Future",
    status: "Focused",
    streakWeeks: 3,
    avatarColor: "#4B3A1F",
    accentColor: theme.colors.orange
  }
];

export const weeklyProgress = [
  { day: "M", done: true },
  { day: "T", done: true },
  { day: "W", done: true },
  { day: "T", done: false },
  { day: "F", done: false },
  { day: "S", done: false },
  { day: "S", done: false }
];

export const activityStats = [
  { label: "new waves", value: "2", accentColor: theme.colors.teal },
  { label: "message request", value: "1", accentColor: theme.colors.purple },
  { label: "friends active", value: "3", accentColor: theme.colors.blue }
];
