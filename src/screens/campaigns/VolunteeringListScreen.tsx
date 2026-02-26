import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CampaignCard,
  EmptyState,
  FilterBottomSheet,
  SearchBar,
} from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
import { colors, spacing } from "@/src/theme";
import type { VolunteeringFilters } from "@/src/types/filters";
import {
  filterVolunteering,
  volunteeringActiveFiltersCount,
} from "@/src/utils/filtering";

const initialFilters: VolunteeringFilters = {
  city: null,
  dateRange: "all",
  seatsAvailable: false,
};

export const VolunteeringListScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<VolunteeringFilters>(initialFilters);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { volunteeringCampaigns, userRole, currentPublisherId, closeItem } =
    useAppData();

  const cities = useMemo(
    () => Array.from(new Set(volunteeringCampaigns.map((item) => item.city))),
    [volunteeringCampaigns],
  );

  const filteredItems = useMemo(
    () => filterVolunteering(volunteeringCampaigns, query, filters),
    [volunteeringCampaigns, query, filters],
  );

  const activeFilters = volunteeringActiveFiltersCount(filters);

  return (
    <View style={styles.container}>
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
            type="volunteer"
            data={item}
            onPrimaryAction={() => router.push(ROUTES.volunteerDetails(item.id))}
            onSave={() => Alert.alert("حفظ", "تم حفظ الحملة التطوعية")}
            onAddToCalendar={() => Alert.alert("التقويم", "تمت إضافة الحملة للتقويم")}
            showPublisherMenu={
              userRole === "publisher" && item.publisherId === currentPublisherId
            }
            onEdit={() => Alert.alert("تعديل", "واجهة التعديل قيد التنفيذ")}
            onClose={() => {
              closeItem("volunteer", item.id);
              Alert.alert("تم الإغلاق", "تم تغيير حالة الحملة إلى مكتملة");
            }}
            onStats={() => Alert.alert("الإحصاءات", "عرض إحصاءات الحملة")}
            onManage={() => Alert.alert("الإدارة", "إدارة المتطوعين")}
          />
        )}
        ListHeaderComponent={
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث في الحملات التطوعية"
            onPressFilter={() => setIsFilterModalVisible(true)}
            activeFiltersCount={activeFilters}
          />
        }
        ListEmptyComponent={<EmptyState message="لا توجد حملات مطابقة" />}
      />

      <FilterBottomSheet
        variant="volunteer"
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        cities={cities}
        volunteeringFilters={filters}
        onVolunteeringFiltersChange={setFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.s,
  },
});
