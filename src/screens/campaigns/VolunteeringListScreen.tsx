import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CampaignCard,
  EmptyState,
  FilterBottomSheet,
  SearchBar,
} from "@/src/components";
import { useAppData } from "@/src/context";
import { ROUTES } from "@/src/navigation";
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

type ListStatusFilter = "all" | "active" | "completed";

export const VolunteeringListScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<VolunteeringFilters>(initialFilters);
  const [listStatus, setListStatus] = useState<ListStatusFilter>("all");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { volunteeringCampaigns, userRole, currentPublisherId, closeItem } =
    useAppData();

  const cities = useMemo(
    () => Array.from(new Set(volunteeringCampaigns.map((item) => item.city))),
    [volunteeringCampaigns],
  );

  const filteredItems = useMemo(() => {
    const base = filterVolunteering(volunteeringCampaigns, query, filters);
    if (listStatus === "all") return base;
    return base.filter((item) => item.campaignStatus === listStatus);
  }, [volunteeringCampaigns, query, filters, listStatus]);

  const activeFilters = volunteeringActiveFiltersCount(filters);

  return (
    <View className="flex-1 bg-jod-background pt-2">
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 72,
          paddingHorizontal: 16,
          gap: 12,
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
          <View className="bg-jod-background pb-2">
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="ابحث في الحملات التطوعية"
              onPressFilter={() => setIsFilterModalVisible(true)}
              activeFiltersCount={activeFilters}
            />

            <View className="mt-2 flex-row-reverse gap-2">
              <StatusPill
                label="الكل"
                active={listStatus === "all"}
                onPress={() => setListStatus("all")}
              />
              <StatusPill
                label="نشطة"
                active={listStatus === "active"}
                onPress={() => setListStatus("active")}
              />
              <StatusPill
                label="مكتملة"
                active={listStatus === "completed"}
                onPress={() => setListStatus("completed")}
              />
            </View>
          </View>
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

const StatusPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    className={`rounded-full border px-3 py-2 ${
      active
        ? "border-jod-primary bg-jod-primary"
        : "border-jod-border bg-jod-surface"
    }`}
    onPress={onPress}
  >
    <Text
      className={`font-noto-semibold text-xs ${
        active ? "text-white" : "text-jod-text-secondary"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);
