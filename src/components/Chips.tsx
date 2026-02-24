import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/src/theme";

type CardType = "donation" | "volunteer" | "job";

const typeLabel: Record<CardType, string> = {
  donation: "حملة تبرعات",
  volunteer: "حملة تطوعية",
  job: "وظيفة",
};

const typeColors: Record<CardType, string> = {
  donation: colors.chipDonation,
  volunteer: colors.chipVolunteer,
  job: colors.chipJob,
};

export const TypeChip = ({ type }: { type: CardType }) => (
  <View style={[styles.chip, { backgroundColor: typeColors[type] }]}>
    <Text style={styles.chipText}>{typeLabel[type]}</Text>
  </View>
);

export const StatusBadge = ({ status }: { status: string }) => {
  const backgroundColor =
    status === "عاجلة"
      ? "#FCE8E6"
      : status === "اقتربت من الاكتمال"
        ? "#FFF4E3"
        : status === "اكتملت"
          ? "#E8F6EB"
          : "#EDF3F8";

  const color =
    status === "عاجلة"
      ? colors.danger
      : status === "اقتربت من الاكتمال"
        ? colors.warning
        : status === "اكتملت"
          ? colors.success
          : colors.textSecondary;

  return (
    <View style={[styles.chip, { backgroundColor }]}> 
      <Text style={[styles.chipText, { color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: 28,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
});
