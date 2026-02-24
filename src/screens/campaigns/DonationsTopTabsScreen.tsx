import BottomSheet from "@gorhom/bottom-sheet";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateSheet, PublisherFab } from "@/src/components";
import { useAppData } from "@/src/context";
import type { DonationsTopTabsParamList } from "@/src/navigation";
import { colors, spacing } from "@/src/theme";
import { DonationsListScreen } from "./DonationsListScreen";
import { VolunteeringListScreen } from "./VolunteeringListScreen";

const TopTabs = createMaterialTopTabNavigator<DonationsTopTabsParamList>();

export const DonationsTopTabsScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const createSheetRef = useRef<BottomSheet>(null);

  const {
    userRole,
    createDonationCampaign,
    createVolunteeringCampaign,
    createJob,
  } = useAppData();

  const initialRouteName = useMemo<keyof DonationsTopTabsParamList>(
    () => (params.tab === "volunteering" ? "VolunteeringTab" : "DonationsTab"),
    [params.tab],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.s }]}> 
        <Text style={styles.headerTitle}>التبرعات والحملات</Text>
      </View>

      <TopTabs.Navigator
        key={initialRouteName}
        initialRouteName={initialRouteName}
        screenOptions={{
          tabBarStyle: styles.topTabs,
          tabBarIndicatorStyle: styles.indicator,
          tabBarLabelStyle: styles.topTabLabel,
        }}
      >
        <TopTabs.Screen
          name="DonationsTab"
          component={DonationsListScreen}
          options={{ title: "التبرعات" }}
        />
        <TopTabs.Screen
          name="VolunteeringTab"
          component={VolunteeringListScreen}
          options={{ title: "التطوع" }}
        />
      </TopTabs.Navigator>

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
  topTabs: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  indicator: {
    backgroundColor: colors.primary,
    height: 3,
  },
  topTabLabel: {
    fontSize: 13,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
});
