export const spacing = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
} as const;

export const radius = {
  card: 12,
  pill: 999,
} as const;

export const colors = {
  background: "#F3F6F8",
  surface: "#FFFFFF",
  textPrimary: "#12202F",
  textSecondary: "#4F6375",
  textMuted: "#6E8190",
  border: "#D4DEE6",
  primary: "#15616D",
  primaryDark: "#0E4A53",
  accent: "#F08A24",
  success: "#2E7D32",
  warning: "#C97A00",
  danger: "#C23B22",
  chipDonation: "#E3F2FD",
  chipVolunteer: "#E8F5E9",
  chipJob: "#FFF3E0",
} as const;

export const shadows = {
  card: {
    shadowColor: "#16324A",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
} as const;
