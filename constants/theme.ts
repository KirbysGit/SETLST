import { TextStyle } from "react-native";

export const theme = {
  colors: {
    background: "#070A0F",
    surface: "#111620",
    elevated: "#171D29",
    border: "#252B38",
    text: "#F4F7FB",
    textMuted: "#8F98A8",
    textSubtle: "#677084",
    teal: "#2EF2C3",
    purple: "#8B5CF6",
    blue: "#4EA1FF",
    orange: "#FFB020",
    danger: "#FF5C7A",
    black: "#05070B",
    white: "#FFFFFF"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999
  },
  typography: {
    title: 28,
    section: 18,
    body: 15,
    small: 13,
    micro: 11
  },
  gradients: {
    brand: ["#2EF2C3", "#8B5CF6"]
  },
  // Manrope has no 900 — heaviest weight is ExtraBold 800
  fonts: {
    regular: "Manrope_400Regular",
    medium: "Manrope_500Medium",
    semibold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
    extrabold: "Manrope_800ExtraBold"
  }
} as const;

export type Theme = typeof theme;

// ─── Typography presets ─────────────────────────────────────────────────────
// Named text roles, composed into screen styles like CSS classes:
//   title: { ...text.pageTitle }                    — use as-is
//   name:  { ...text.cardTitle, color: colors.teal } — override per screen
export const text = {
  // Big screen heading ("Friends", "Messages", "Profile")
  pageTitle: {
    fontFamily: theme.fonts.extrabold,
    fontSize: 27,
    color: theme.colors.text,
    letterSpacing: -0.6,
  },
  // Hero-level name/title inside a card
  heroTitle: {
    fontFamily: theme.fonts.extrabold,
    fontSize: 21,
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  // Uppercase section label ("REQUESTS", "TRAINING PROFILE")
  eyebrow: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  // Primary line of a list card (person's name)
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  // Secondary line of a list card (track, gym, preview)
  cardSubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  // Paragraph copy
  body: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 21,
  },
  // Timestamps, counts, fine print
  caption: {
    fontFamily: theme.fonts.semibold,
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
  // Empty-state heading + copy
  emptyTitle: {
    fontFamily: theme.fonts.extrabold,
    fontSize: 17,
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 21,
  },
} as const satisfies Record<string, TextStyle>;
