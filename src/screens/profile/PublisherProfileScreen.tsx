import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { colors, radius, shadows, spacing } from "@/src/theme";

interface PublisherContentCardProps {
  typeLabel: string;
  title: string;
  description: string;
  meta: string;
  status?: string;
  onPress?: () => void;
}

const PublisherContentCard = ({
  typeLabel,
  title,
  description,
  meta,
  status,
  onPress,
}: PublisherContentCardProps) => (
  <Pressable
    style={[styles.feedCard, !onPress ? styles.feedCardStatic : null]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.feedHead}>
      {status ? <Text style={styles.feedStatus}>{status}</Text> : <View />}
      <Text style={styles.feedType}>{typeLabel}</Text>
    </View>
    <Text style={styles.feedTitle}>{title}</Text>
    <Text style={styles.feedDescription} numberOfLines={2}>
      {description}
    </Text>
    <Text style={styles.feedMeta}>{meta}</Text>
  </Pressable>
);

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const PublisherProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { donations, volunteeringCampaigns, jobs, posts, currentPublisherId } = useAppData();

  if (!id) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>لم يتم العثور على الناشر</Text>
      </View>
    );
  }

  const publisherDonations = donations.filter((item) => item.publisherId === id);
  const publisherVolunteering = volunteeringCampaigns.filter(
    (item) => item.publisherId === id,
  );
  const publisherJobs = jobs.filter((item) => item.publisherId === id);
  const publisherPosts = posts.filter((item) => item.ownerId === id);

  const totalPublishedItems =
    publisherDonations.length +
    publisherVolunteering.length +
    publisherJobs.length +
    publisherPosts.length;

  const publisherName =
    publisherDonations[0]?.orgName ||
    publisherJobs[0]?.orgName ||
    (id === currentPublisherId ? "الناشر الحالي" : "جهة خيرية");

  const publisherCity =
    publisherDonations[0]?.city ||
    publisherVolunteering[0]?.city ||
    publisherJobs[0]?.city ||
    publisherPosts[0]?.city ||
    "غير محدد";

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
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{publisherName}</Text>
          <Text style={styles.profileHint}>
            {id === currentPublisherId ? "هذا ملفك كناشر" : "ملف الجهة الناشرة"}
          </Text>
          <Text style={styles.profileMeta}>{`المدينة: ${publisherCity}`}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="تبرعات" value={publisherDonations.length} />
          <StatCard label="تطوع" value={publisherVolunteering.length} />
          <StatCard label="وظائف" value={publisherJobs.length} />
          <StatCard label="منشورات" value={publisherPosts.length} />
        </View>

        {totalPublishedItems === 0 ? (
          <Text style={styles.emptyText}>لا توجد منشورات أو حملات لهذا الناشر حالياً.</Text>
        ) : null}

        {publisherDonations.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>حملات التبرع</Text>
            {publisherDonations.map((item) => (
              <PublisherContentCard
                key={item.id}
                typeLabel="تبرع"
                status={item.statusTag}
                title={item.title}
                description={item.description}
                meta={`${item.city} - ${item.orgName}`}
                onPress={() => router.push(ROUTES.donationDetails(item.id))}
              />
            ))}
          </>
        ) : null}

        {publisherVolunteering.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>فرص التطوع</Text>
            {publisherVolunteering.map((item) => (
              <PublisherContentCard
                key={item.id}
                typeLabel="تطوع"
                status={item.statusTag}
                title={item.title}
                description={item.description}
                meta={`${item.city} - ${item.date}`}
                onPress={() => router.push(ROUTES.volunteerDetails(item.id))}
              />
            ))}
          </>
        ) : null}

        {publisherJobs.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>الوظائف</Text>
            {publisherJobs.map((item) => (
              <PublisherContentCard
                key={item.id}
                typeLabel="وظيفة"
                status={item.statusTag}
                title={item.title}
                description={item.description}
                meta={`${item.city} - ${item.workType}`}
                onPress={() => router.push(ROUTES.jobDetails(item.id))}
              />
            ))}
          </>
        ) : null}

        {publisherPosts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>المنشورات</Text>
            {publisherPosts.map((item) => (
              <PublisherContentCard
                key={item.id}
                typeLabel="منشور"
                title={item.title}
                description={item.description}
                meta={`${item.city}${item.area ? ` - ${item.area}` : ""}`}
                status={item.status}
              />
            ))}
          </>
        ) : null}
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
  profileCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.l,
    gap: 4,
    ...shadows.card,
  },
  profileName: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  profileHint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  profileMeta: {
    fontSize: 12,
    color: colors.primary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  statsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.s,
  },
  statCard: {
    width: "48%",
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F7FAFD",
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-Bold",
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-Regular",
  },
  sectionTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  feedCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.m,
    gap: 6,
    ...shadows.card,
  },
  feedCardStatic: {
    opacity: 0.92,
  },
  feedHead: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedType: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  feedStatus: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: "NotoKufiArabic-Regular",
  },
  feedTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  feedDescription: {
    fontSize: 12,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  feedMeta: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
});
