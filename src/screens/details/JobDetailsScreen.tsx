import { useLocalSearchParams } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { colors, radius, shadows, spacing } from "@/src/theme";

export const JobDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { jobs } = useAppData();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>الوظيفة غير موجودة</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.s }]}> 
      <View style={styles.headRow}>
        <TypeChip type="job" />
        <StatusBadge status={job.statusTag} />
      </View>

      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.description}>{job.description}</Text>

      <View style={styles.card}>
        <Text style={styles.meta}>{`الجهة: ${job.orgName}`}</Text>
        <Text style={styles.meta}>{`المدينة: ${job.city}`}</Text>
        <Text style={styles.meta}>{`نوع العمل: ${job.workType}`}</Text>
        <Text style={styles.meta}>{`سنوات الخبرة: ${job.experienceYears}`}</Text>
        <Text style={styles.meta}>{`تاريخ النشر: ${job.postedAt}`}</Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => Alert.alert("التقديم", "تم بدء نموذج التقديم")}
      >
        <Text style={styles.primaryButtonText}>قدّم الآن</Text>
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
