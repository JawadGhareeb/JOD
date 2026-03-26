import Dialog from "@/components/ui/Dialog";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { colors, radius, shadows, spacing } from "@/src/theme";

export const JobDetailsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isApplyDialogVisible, setIsApplyDialogVisible] = useState(false);

  const { jobs, currentPublisherId } = useAppData();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>الوظيفة غير موجودة</Text>
      </View>
    );
  }

  const publisherName =
    job.orgName || (job.publisherId === currentPublisherId ? "الناشر الحالي" : "جهة خيرية");

  return (
    <>
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
            <TypeChip type="job" />
            <StatusBadge status={job.statusTag} />
          </View>

          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.description}>{job.description}</Text>

          <Pressable
            style={styles.publisherCard}
            onPress={() => router.push(ROUTES.publisherProfile(job.publisherId))}
          >
            <View style={styles.publisherTextWrap}>
              <Text style={styles.publisherName}>{publisherName}</Text>
              <Text style={styles.publisherHint}>الجهة الناشرة - عرض الملف والمنشورات</Text>
            </View>
            <Text style={styles.publisherAction}>عرض الملف</Text>
          </Pressable>

          <View style={styles.card}>
            <Text style={styles.meta}>{`الجهة: ${job.orgName}`}</Text>
            <Text style={styles.meta}>{`المدينة: ${job.city}`}</Text>
            <Text style={styles.meta}>{`نوع العمل: ${job.workType}`}</Text>
            <Text style={styles.meta}>{`سنوات الخبرة: ${job.experienceYears}`}</Text>
            <Text style={styles.meta}>{`تاريخ النشر: ${job.postedAt}`}</Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => setIsApplyDialogVisible(true)}
          >
            <Text style={styles.primaryButtonText}>قدّم الآن</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Dialog
        visible={isApplyDialogVisible}
        onClose={() => setIsApplyDialogVisible(false)}
        title="تأكيد التقديم"
        message="تم تجهيز طلبك للتقديم على هذه الوظيفة. هل تريد المتابعة؟"
        buttons={[
          {
            text: "إلغاء",
            variant: "outline",
            onPress: () => setIsApplyDialogVisible(false),
          },
          {
            text: "متابعة",
            onPress: () => setIsApplyDialogVisible(false),
          },
        ]}
      />
    </>
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
