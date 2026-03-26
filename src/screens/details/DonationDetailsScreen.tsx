import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { colors, radius, shadows, spacing } from "@/src/theme";
import { daysUntil } from "@/src/utils/date";
import { formatCurrency, toPercent } from "@/src/utils/formatters";

export const DonationDetailsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { donations, jobs, currentPublisherId } = useAppData();
  const donation = donations.find((item) => item.id === id);

  if (!donation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>الحملة غير موجودة</Text>
      </View>
    );
  }

  const percent = toPercent(donation.raisedAmount, donation.goalAmount);
  const remainingDays = daysUntil(donation.endDate);
  const fallbackPublisherName = jobs.find(
    (item) => item.publisherId === donation.publisherId,
  )?.orgName;
  const publisherName =
    donation.orgName ||
    fallbackPublisherName ||
    (donation.publisherId === currentPublisherId ? "الناشر الحالي" : "جهة خيرية");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.s,
        paddingBottom: spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <View style={styles.headRow}>
          <TypeChip type="donation" />
          <StatusBadge status={donation.statusTag} />
        </View>

        <Text style={styles.title}>{donation.title}</Text>
        <Text style={styles.description}>{donation.description}</Text>

        <Pressable
          style={styles.publisherCard}
          onPress={() => router.push(ROUTES.publisherProfile(donation.publisherId))}
        >
          <View style={styles.publisherTextWrap}>
            <Text style={styles.publisherName}>{publisherName}</Text>
            <Text style={styles.publisherHint}>الجهة الناشرة - عرض الملف والمنشورات</Text>
          </View>
          <Text style={styles.publisherAction}>عرض الملف</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.meta}>{`الجهة: ${donation.orgName}`}</Text>
          <Text style={styles.meta}>{`المدينة: ${donation.city}`}</Text>
          <Text style={styles.meta}>{`ينتهي في: ${new Date(donation.endDate).toLocaleDateString("ar-SA")}`}</Text>
          <Text style={styles.meta}>{`المتبقي: ${remainingDays >= 0 ? `${remainingDays} أيام` : "انتهت"}`}</Text>
          <Text style={styles.meta}>{`تم جمع ${formatCurrency(donation.raisedAmount)} من ${formatCurrency(donation.goalAmount)} (${percent}%)`}</Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => Alert.alert("تبرّع", "تم فتح مسار التبرع")}
        >
          <Text style={styles.primaryButtonText}>تبرّع الآن</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
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
  publisherCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F7FAFD",
    padding: spacing.m,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.card,
  },
  publisherTextWrap: {
    flex: 1,
    gap: 2,
  },
  publisherName: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  publisherHint: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  publisherAction: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: "NotoKufiArabic-SemiBold",
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
