import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateSheet, PublisherFab } from "@/src/components";
import { useAppData } from "@/src/context";
import { colors, spacing } from "@/src/theme";
import { DonationsListScreen } from "./DonationsListScreen";
import { VolunteeringListScreen } from "./VolunteeringListScreen";

type CampaignTab = "donations" | "volunteering";

const resolveTab = (tab?: string): CampaignTab =>
  tab === "volunteering" ? "volunteering" : "donations";

export const DonationsTopTabsScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const createSheetRef = useRef<BottomSheet>(null);
  const initialTab = useMemo(() => resolveTab(params.tab), [params.tab]);
  const [activeTab, setActiveTab] = useState<CampaignTab>(initialTab);

  const {
    userRole,
    createDonationCampaign,
    createVolunteeringCampaign,
    createJob,
  } = useAppData();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.s }]}>
        <Text style={styles.headerTitle}>التبرعات والحملات</Text>
      </View>

      <View style={styles.tabsRow}>
        <TabButton
          label="التبرعات"
          isActive={activeTab === "donations"}
          onPress={() => setActiveTab("donations")}
        />
        <TabButton
          label="التطوع"
          isActive={activeTab === "volunteering"}
          onPress={() => setActiveTab("volunteering")}
        />
      </View>

      <View style={styles.content}>
        {activeTab === "donations" ? (
          <DonationsListScreen key="donations-tab" />
        ) : (
          <VolunteeringListScreen key="volunteering-tab" />
        )}
      </View>

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

const TabButton = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.tabButton, isActive ? styles.tabButtonActive : null]}
  >
    <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : null]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-Bold",
    textAlign: "right",
  },
  tabsRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.l,
  },
  tabButton: {
    flex: 1,
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  tabLabelActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
});
