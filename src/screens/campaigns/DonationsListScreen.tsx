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

type ListStatusFilter = "all" | "active" | "completed";

export const DonationsListScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DonationFilters>(initialFilters);
  const [listStatus, setListStatus] = useState<ListStatusFilter>("all");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    donations,
    userRole,
    currentPublisherId,
    closeItem,
    toggleFollowDonation,
    followedDonationIds,
  } = useAppData();

  const cities = useMemo(
    () => Array.from(new Set(donations.map((item) => item.city))),
    [donations],
  );

  const filteredItems = useMemo(() => {
    const base = filterDonations(donations, query, filters);
    if (listStatus === "all") return base;
    return base.filter((item) => item.campaignStatus === listStatus);
  }, [donations, query, filters, listStatus]);

  const activeFilters = donationActiveFiltersCount(filters);

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
            type="donation"
            data={item}
            onPrimaryAction={() => router.push(ROUTES.donationDetails(item.id))}
            onShare={() => Alert.alert("مشاركة", "تم تجهيز رابط مشاركة الحملة")}
            onSave={() => {
              const isFollowing = followedDonationIds.includes(item.id);
              toggleFollowDonation(item.id);
              Alert.alert(
                isFollowing ? "إلغاء المتابعة" : "تمت المتابعة",
                isFollowing
                  ? "تمت إزالة الحملة من متابعتك."
                  : "ستصلك تحديثات هذه الحملة.",
              );
            }}
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
          <View className="bg-jod-background pb-2">
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="ابحث في حملات التبرع"
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
