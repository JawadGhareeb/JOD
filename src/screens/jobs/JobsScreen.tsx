import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CampaignCard,
  CreateSheet,
  EmptyState,
  FilterBottomSheet,
  PublisherFab,
  SearchBar,
} from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { colors, spacing } from "@/src/theme";
import type { JobFilters } from "@/src/types/filters";
import { filterJobs, jobsActiveFiltersCount } from "@/src/utils/filtering";

const initialFilters: JobFilters = {
  city: null,
  workType: null,
  experienceYears: null,
};

export const JobsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createSheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    jobs,
    userRole,
    currentPublisherId,
    closeItem,
    createDonationCampaign,
    createVolunteeringCampaign,
    createJob,
  } = useAppData();

  const cities = useMemo(
    () => Array.from(new Set(jobs.map((item) => item.city))),
    [jobs],
  );

  const filteredItems = useMemo(
    () => filterJobs(jobs, query, filters),
    [jobs, query, filters],
  );

  const activeFilters = jobsActiveFiltersCount(filters);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.s }]}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: spacing.l,
          gap: spacing.m,
        }}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CampaignCard
            type="job"
            data={item}
            onPrimaryAction={() => router.push(ROUTES.jobDetails(item.id))}
            onSave={() => Alert.alert("حفظ", "تم حفظ الوظيفة")}
            showPublisherMenu={
              userRole === "publisher" && item.publisherId === currentPublisherId
            }
            onEdit={() => Alert.alert("تعديل", "واجهة التعديل قيد التنفيذ")}
            onClose={() => {
              closeItem("job", item.id);
              Alert.alert("تم الإغلاق", "تم تغيير حالة الوظيفة إلى مكتملة");
            }}
            onStats={() => Alert.alert("الإحصاءات", "عرض إحصاءات الإعلان")}
            onManage={() => Alert.alert("الإدارة", "إدارة المتقدمين")}
          />
        )}
        ListHeaderComponent={
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث في الوظائف"
            onPressFilter={() => setIsFilterModalVisible(true)}
            activeFiltersCount={activeFilters}
          />
        }
        ListEmptyComponent={<EmptyState message="لا توجد وظائف مطابقة" />}
      />

      {userRole === "publisher" ? (
        <PublisherFab onPress={() => createSheetRef.current?.snapToIndex(0)} />
      ) : null}

      <FilterBottomSheet
        variant="job"
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        cities={cities}
        jobFilters={filters}
        onJobFiltersChange={setFilters}
      />

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
});
