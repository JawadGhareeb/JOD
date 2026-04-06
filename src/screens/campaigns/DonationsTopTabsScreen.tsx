import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateSheet, PublisherFab } from "@/src/components";
import { useAppData } from "@/src/context";
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
    <View className="flex-1 bg-jod-background">
      <View className="bg-jod-background px-4 pb-2" style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-right font-noto-bold text-xl text-jod-text">
          التبرعات والحملات
        </Text>
      </View>

      <View className="flex-row-reverse border-b border-jod-border bg-jod-surface px-4">
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

      <View className="flex-1">
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
    className={`flex-1 items-center justify-center border-b-2 py-3 ${
      isActive ? "border-jod-primary" : "border-transparent"
    }`}
    onPress={onPress}
  >
    <Text
      className={`font-noto-semibold text-sm ${
        isActive ? "text-jod-primary" : "text-jod-text-secondary"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);
