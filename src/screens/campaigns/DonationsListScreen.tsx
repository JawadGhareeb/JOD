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
import type { DonationFilters } from "@/src/types/filters";
import {
  donationActiveFiltersCount,
  filterDonations,
} from "@/src/utils/filtering";

const initialFilters: DonationFilters = {
  city: null,
  status: null,
  minGoal: null,
  endingSoon: false,
};

export const DonationsListScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DonationFilters>(initialFilters);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { donations, userRole, currentPublisherId, closeItem } = useAppData();

  const cities = useMemo(
    () => Array.from(new Set(donations.map((item) => item.city))),
    [donations],
  );

  const filteredItems = useMemo(
    () => filterDonations(donations, query, filters),
    [donations, query, filters],
  );

  const activeFilters = donationActiveFiltersCount(filters);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 72,
          paddingHorizontal: spacing.l,
          gap: spacing.m,
        }}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CampaignCard
            type="donation"
            data={item}
            onPrimaryAction={() => router.push(ROUTES.donationDetails(item.id))}
            onShare={() => Alert.alert("مشاركة", "تم تجهيز رابط مشاركة الحملة")}
            onSave={() => Alert.alert("حفظ", "تم حفظ الحملة")}
            showPublisherMenu={
              userRole === "publisher" && item.publisherId === currentPublisherId
            }
            onEdit={() => Alert.alert("تعديل", "واجهة التعديل قيد التنفيذ")}
            onClose={() => {
              closeItem("donation", item.id);
              Alert.alert("تم الإغلاق", "تم تغيير حالة الحملة إلى مكتملة");
            }}
            onStats={() => Alert.alert("الإحصاءات", "عرض إحصاءات الحملة")}
            onManage={() => Alert.alert("الإدارة", "إدارة قائمة المتبرعين")}
          />
        )}
        ListHeaderComponent={
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث في حملات التبرع"
            onPressFilter={() => setIsFilterModalVisible(true)}
            activeFiltersCount={activeFilters}
          />
        }
        ListEmptyComponent={
          <EmptyState message="لا توجد حملات مطابقة للبحث أو الفلترة" />
        }
      />

      <FilterBottomSheet
        variant="donation"
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        cities={cities}
        donationFilters={filters}
        onDonationFiltersChange={setFilters}
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
