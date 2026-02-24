import BottomSheet from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CreateSheet,
  PublisherFab,
  SearchBar,
  StatusBadge,
  TypeChip,
} from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { colors, radius, shadows, spacing } from "@/src/theme";
import { formatCurrency } from "@/src/utils/formatters";

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createSheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState("");

  const {
    donations,
    volunteeringCampaigns,
    jobs,
    userRole,
    createDonationCampaign,
    createVolunteeringCampaign,
    createJob,
  } = useAppData();

  const normalizedQuery = query.trim().toLowerCase();

  const featuredDonations = useMemo(
    () =>
      donations
        .filter((item) => {
          if (!normalizedQuery) return true;
          return (
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.orgName.toLowerCase().includes(normalizedQuery) ||
            item.city.toLowerCase().includes(normalizedQuery)
          );
        })
        .slice(0, 6),
    [donations, normalizedQuery],
  );

  const nearbyVolunteering = useMemo(
    () =>
      volunteeringCampaigns
        .filter((item) => {
          if (!normalizedQuery) return true;
          return (
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.city.toLowerCase().includes(normalizedQuery)
          );
        })
        .slice(0, 6),
    [volunteeringCampaigns, normalizedQuery],
  );

  const newJobs = useMemo(
    () =>
      jobs
        .filter((item) => {
          if (!normalizedQuery) return true;
          return (
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.orgName.toLowerCase().includes(normalizedQuery) ||
            item.city.toLowerCase().includes(normalizedQuery)
          );
        })
        .slice(0, 6),
    [jobs, normalizedQuery],
  );

  const totalDonationsAmount = useMemo(
    () => donations.reduce((sum, item) => sum + item.raisedAmount, 0),
    [donations],
  );

  const campaignsCount = donations.length + volunteeringCampaigns.length;

  const quickActions = useMemo<QuickAction[]>(() => {
    const actions: QuickAction[] = [
      {
        id: "donate",
        label: "تبرع",
        icon: "heart-outline",
        onPress: () => router.push(ROUTES.donationsTab),
      },
      {
        id: "volunteer",
        label: "تطوع",
        icon: "people-outline",
        onPress: () => router.push(ROUTES.volunteeringTab),
      },
      {
        id: "jobs",
        label: "وظائف",
        icon: "briefcase-outline",
        onPress: () => router.push(ROUTES.jobs),
      },
    ];

    if (userRole === "publisher") {
      actions.push({
        id: "publish",
        label: "نشر",
        icon: "add-circle-outline",
        onPress: () => createSheetRef.current?.snapToIndex(0),
      });
    }

    return actions;
  }, [router, userRole]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.s,
          paddingBottom: insets.bottom + 120,
          gap: spacing.l,
        }}
      >
        <View style={styles.pagePadding}>
          <Text style={styles.greeting}>مرحباً بك في منصة جود</Text>
          <Text style={styles.subGreeting}>تبرعات، تطوع، وظائف خيرية في مكان واحد</Text>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث عن مبادرة، جهة، أو مدينة"
        />

        <View style={styles.pagePadding}>
          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <Pressable key={action.id} style={styles.quickAction} onPress={action.onPress}>
                <Ionicons name={action.icon} size={22} color={colors.primary} />
                <Text style={styles.quickActionText}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.pagePadding}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>عدد الحملات</Text>
              <Text style={styles.statValue}>{campaignsCount}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>إجمالي التبرعات (مبلغ)</Text>
              <Text style={styles.statValue}>{formatCurrency(totalDonationsAmount)}</Text>
            </View>
          </View>
        </View>

        <SectionHeader
          title="تبرعات مميزة"
          onPress={() => router.push(ROUTES.donationsTab)}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          data={featuredDonations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.horizontalCard}
              onPress={() => router.push(ROUTES.donationDetails(item.id))}
            >
              <View style={styles.horizontalHead}>
                <TypeChip type="donation" />
                <StatusBadge status={item.statusTag} />
              </View>
              <Text style={styles.horizontalTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.horizontalDesc}>
                {item.description}
              </Text>
              <Text style={styles.horizontalMeta}>{`${item.city} - ${item.orgName}`}</Text>
            </Pressable>
          )}
        />

        <SectionHeader
          title="تطوع قريب منك"
          onPress={() => router.push(ROUTES.volunteeringTab)}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          data={nearbyVolunteering}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.horizontalCard}
              onPress={() => router.push(ROUTES.volunteerDetails(item.id))}
            >
              <View style={styles.horizontalHead}>
                <TypeChip type="volunteer" />
                <StatusBadge status={item.statusTag} />
              </View>
              <Text style={styles.horizontalTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.horizontalDesc}>
                {item.description}
              </Text>
              <Text style={styles.horizontalMeta}>{`${item.city} - ${item.date}`}</Text>
            </Pressable>
          )}
        />

        <SectionHeader title="وظائف جديدة" onPress={() => router.push(ROUTES.jobs)} />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          data={newJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.horizontalCard}
              onPress={() => router.push(ROUTES.jobDetails(item.id))}
            >
              <View style={styles.horizontalHead}>
                <TypeChip type="job" />
                <StatusBadge status={item.statusTag} />
              </View>
              <Text style={styles.horizontalTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.horizontalDesc}>
                {item.description}
              </Text>
              <Text style={styles.horizontalMeta}>{`${item.city} - ${item.workType}`}</Text>
            </Pressable>
          )}
        />
      </ScrollView>

      {userRole === "publisher" ? (
        <PublisherFab onPress={() => createSheetRef.current?.snapToIndex(0)} />
      ) : null}

      <CreateSheet
        sheetRef={createSheetRef}
        onCreateDonation={createDonationCampaign}
        onCreateVolunteer={createVolunteeringCampaign}
        onCreateJob={createJob}
      />
    </View>
  );
};

const SectionHeader = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <View style={[styles.pagePadding, styles.sectionHeader]}>
    <Pressable onPress={onPress}>
      <Text style={styles.sectionAction}>عرض الكل</Text>
    </Pressable>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pagePadding: {
    paddingHorizontal: spacing.l,
  },
  greeting: {
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  subGreeting: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  quickGrid: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.s,
  },
  quickAction: {
    width: "48%",
    minHeight: 88,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.card,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  statsRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    gap: spacing.s,
  },
  statCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    paddingHorizontal: spacing.m,
    ...shadows.card,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  statValue: {
    marginTop: 2,
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  sectionHeader: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-Bold",
  },
  sectionAction: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  horizontalListContent: {
    paddingHorizontal: spacing.l,
    gap: spacing.s,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
  horizontalCard: {
    width: 260,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.m,
    gap: spacing.s,
    ...shadows.card,
  },
  horizontalHead: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horizontalTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  horizontalDesc: {
    fontSize: 12,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  horizontalMeta: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
});
