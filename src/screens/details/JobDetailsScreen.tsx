import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge, TypeChip } from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";

const applicationStatusLabel = {
  submitted: "تم الإرسال",
  in_review: "قيد المراجعة",
  accepted: "مقبول",
  rejected: "مرفوض",
} as const;

export const JobDetailsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { jobs, currentPublisherId, jobApplications, applyToJob, blockEntity } =
    useAppData();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <View className="flex-1 items-center justify-center bg-jod-background px-4">
        <Text className="text-right font-noto-bold text-lg text-jod-text">
          الوظيفة غير موجودة
        </Text>
      </View>
    );
  }

  const publisherName =
    job.orgName || (job.publisherId === currentPublisherId ? "الناشر الحالي" : "جهة خيرية");
  const application = jobApplications.find((item) => item.jobId === job.id);

  const onApply = () => {
    if (application) {
      Alert.alert("تم التقديم مسبقاً", `حالة طلبك الحالية: ${applicationStatusLabel[application.status]}`);
      return;
    }

    applyToJob(job.id);
    Alert.alert("تم التقديم", "تم إرسال طلبك بنجاح ويمكنك متابعة حالته من صفحة طلباتي.");
  };

  return (
    <ScrollView
      className="flex-1 bg-jod-background"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 px-4">
        <View className="flex-row-reverse items-center gap-2">
          <TypeChip type="job" />
          <StatusBadge status={job.statusTag} />
        </View>

        <Text className="text-right font-noto-bold text-xl text-jod-text">{job.title}</Text>
        <Text className="text-right font-noto leading-7 text-jod-text-secondary">
          {job.description}
        </Text>

        <Pressable
          className="flex-row-reverse items-center justify-between rounded-xl border border-jod-border bg-jod-surface p-4"
          onPress={() => router.push(ROUTES.publisherProfile(job.publisherId))}
        >
          <View className="flex-1">
            <Text className="text-right font-noto-bold text-sm text-jod-text">
              {publisherName}
            </Text>
            <Text className="text-right font-noto text-xs text-jod-muted">
              الجهة الناشرة - عرض الملف والمنشورات
            </Text>
          </View>
          <Text className="font-noto-semibold text-xs text-jod-primary">عرض الملف</Text>
        </Pressable>

        <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto text-sm text-jod-text">{`الجهة: ${job.orgName}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`المدينة: ${job.city}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`نوع العمل: ${job.workType}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`سنوات الخبرة: ${job.experienceYears}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`نوع الوظيفة: ${job.employmentTypeLabel}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`تاريخ النشر: ${job.postedAt}`}</Text>
          <Text className="text-right font-noto text-sm text-jod-text">{`آخر موعد للتقديم: ${new Date(job.deadline).toLocaleDateString("ar-SA")}`}</Text>
        </View>

        <View className="gap-2 rounded-xl border border-jod-border bg-jod-surface p-4">
          <Text className="text-right font-noto-semibold text-sm text-jod-text">
            المتطلبات
          </Text>
          {job.requirements.map((requirement) => (
            <Text
              key={requirement}
              className="text-right font-noto text-sm leading-7 text-jod-text-secondary"
            >
              • {requirement}
            </Text>
          ))}
        </View>

        {application ? (
          <View className="rounded-xl border border-jod-border bg-[#F7FAFD] p-4">
            <Text className="text-right font-noto-semibold text-sm text-jod-primary">
              حالة طلبك: {applicationStatusLabel[application.status]}
            </Text>
          </View>
        ) : null}

        <Pressable
          className={`items-center justify-center rounded-xl px-4 py-3 ${
            application ? "bg-[#C8D5DB]" : "bg-jod-primary"
          }`}
          onPress={onApply}
        >
          <Text className="font-noto-bold text-sm text-white">
            {application ? "تم التقديم" : "قدّم الآن"}
          </Text>
        </Pressable>

        <Pressable
          className="items-center justify-center rounded-xl border border-jod-border bg-jod-surface px-4 py-3"
          onPress={() => router.push(ROUTES.myApplications)}
        >
          <Text className="font-noto-semibold text-sm text-jod-text">
            عرض طلباتي
          </Text>
        </Pressable>

        <View className="flex-row-reverse gap-2">
          <Pressable
            className="flex-1 items-center justify-center rounded-xl border border-jod-border bg-jod-surface px-4 py-3"
            onPress={() => router.push(ROUTES.reportIssue("job", job.id))}
          >
            <Text className="font-noto-semibold text-sm text-jod-text">إبلاغ</Text>
          </Pressable>

          <Pressable
            className="flex-1 items-center justify-center rounded-xl border border-jod-danger bg-jod-surface px-4 py-3"
            onPress={() => {
              blockEntity({ entityType: "organization", id: job.publisherId });
              Alert.alert("تم الحظر", "تم حظر الجهة ولن تظهر لك وظائفها.");
            }}
          >
            <Text className="font-noto-semibold text-sm text-jod-danger">حظر الجهة</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};
