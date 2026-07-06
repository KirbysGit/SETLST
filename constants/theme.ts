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
  }
} as const;

export type Theme = typeof theme;
