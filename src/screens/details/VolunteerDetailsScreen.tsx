import { useLocalSearchParams } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { colors, radius, shadows, spacing } from "@/src/theme";

export const VolunteerDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { volunteeringCampaigns } = useAppData();
  const campaign = volunteeringCampaigns.find((item) => item.id === id);

  if (!campaign) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>الحملة غير موجودة</Text>
      </View>
    );
  }

  const remainingSeats = Math.max(
    campaign.requiredVolunteers - campaign.joinedVolunteers,
    0,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.s }]}> 
      <View style={styles.headRow}>
        <TypeChip type="volunteer" />
        <StatusBadge status={campaign.statusTag} />
      </View>

      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.description}>{campaign.description}</Text>

      <View style={styles.card}>
        <Text style={styles.meta}>{`المدينة: ${campaign.city}`}</Text>
        <Text style={styles.meta}>{`التاريخ: ${campaign.date}`}</Text>
        <Text style={styles.meta}>{`الوقت: ${campaign.time}`}</Text>
        <Text style={styles.meta}>{`المطلوب: ${campaign.requiredVolunteers}`}</Text>
        <Text style={styles.meta}>{`المنضمون: ${campaign.joinedVolunteers}`}</Text>
        <Text style={styles.meta}>{`المقاعد المتبقية: ${remainingSeats}`}</Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => Alert.alert("الانضمام", "تم إرسال طلب الانضمام")}
      >
        <Text style={styles.primaryButtonText}>انضم للحملة</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  headRow: {
    flexDirection: "row-reverse",
    gap: spacing.s,
  },
  title: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.l,
    gap: spacing.s,
    ...shadows.card,
  },
  meta: {
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "NotoKufiArabic-Bold",
  },
});
