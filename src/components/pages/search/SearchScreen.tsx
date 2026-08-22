import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlidersHorizontal } from "lucide-react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { HOME_FILTER_ALL } from "@/src/constants/global";
import { mockHomePayload } from "@/src/data/mockHome";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import { getPostDisplayTitle } from "@/src/features/posts/contact";
import { useRTL } from "@/src/providers/RTLProvider";
import type { HomePost } from "@/src/features/posts/types";
import { HomePostCardSkeleton } from "../home/HomePostCardSkeleton";
import { HomeTypeSlider, type HomeFilterType } from "../home/HomeTypeSlider";

type SearchStatusFilter = "all" | "open" | "submitted" | "closed";
type SearchSortKey = "newest" | "most_engaged";
type ActiveFilter = {
  key: "category" | "status" | "location" | "sort";
  label: string;
  onRemove: () => void;
};

type FilterSectionProps<T extends string> = {
  title: string;
  items: SelectableChipItem<T>[];
  selectedKey: T;
  onSelect: (key: T) => void;
};

type FilterChipProps = {
  label: string;
  onRemove: () => void;
};

type SelectableChipItem<T extends string> = {
  key: T;
  label: string;
};

const PAGE_SIZE = 8;
const BackIcon = appIcons.chevronRight;
const ForwardIcon = appIcons.chevronLeft;
const SearchIcon = appIcons.search;
const ClearIcon = appIcons.close;
const FilterIcon = SlidersHorizontal;

const statusLabels: Record<SearchStatusFilter, string> = {
  all: "كل الحالات",
  open: "متاح",
  submitted: "تم التقديم",
  closed: "مغلق",
};

const sortLabels: Record<SearchSortKey, string> = {
  newest: "الأحدث",
  most_engaged: "الأكثر تفاعلًا",
};

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <Pressable
      onPress={onRemove}
      className="flex-row-reverse items-center gap-1 rounded-full bg-primary-400/12 px-3 py-2"
      accessibilityRole="button"
      accessibilityLabel={`إزالة فلتر ${label}`}
    >
      <ClearIcon size={14} color="#405d72" strokeWidth={2.25} />
      <Text size="xs" weight="medium" className="text-primary-400">
        {label}
      </Text>
    </Pressable>
  );
}

function SelectableChipRow<T extends string>({
  items,
  selectedKey,
  onSelect,
}: {
  items: SelectableChipItem<T>[];
  selectedKey: T;
  onSelect: (key: T) => void;
}) {
  return (
    <View className="flex-row-reverse flex-wrap gap-2">
      {items.map((item) => {
        const isActive = item.key === selectedKey;

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            className={`rounded-full border px-3 py-2 ${
              isActive
                ? "border-primary-400 bg-primary-400/12"
                : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
            }`}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Text
              size="xs"
              weight="medium"
              className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FilterSection<T extends string>({
  title,
  items,
  selectedKey,
  onSelect,
}: FilterSectionProps<T>) {
  return (
    <View className="gap-3">
      <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
        {title}
      </Text>
      <SelectableChipRow items={items} selectedKey={selectedKey} onSelect={onSelect} />
    </View>
  );
}

function SearchResultCard({
  post,
  onPress,
}: {
  post: HomePost;
  onPress: () => void;
}) {
  return (
    <Card
      padding="md"
      className="mb-3 gap-3 border-gray-200 dark:border-dark-400"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`فتح نتيجة ${getPostDisplayTitle(post)}`}
    >
      <View className="flex-row-reverse items-start gap-3">
        <Avatar name={post.publisher.name} size={42} />
        <View className="flex-1 gap-2">
          <View className="flex-row-reverse flex-wrap items-center gap-2">
            <View className="rounded-full bg-primary-400/12 px-3 py-1">
              <Text size="2xs" weight="medium" className="text-primary-400">
                {HOME_POST_TYPE_LABELS[post.postType]}
              </Text>
            </View>
            {post.cta.state ? (
              <View className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-350">
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                  {statusLabels[post.cta.state]}
                </Text>
              </View>
            ) : null}
          </View>

          <View>
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {getPostDisplayTitle(post)}
            </Text>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              {post.publisher.name}
              {post.publisher.city ? ` • ${post.publisher.city}` : ""}
              {` • ${formatHomePostRelativeDate(post.createdAt)}`}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            size="xs"
            className="leading-6 text-gray-600 dark:text-gray-200"
          >
            {post.content}
          </Text>

          <View className="flex-row-reverse items-center gap-4">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {post.stats.likes} إعجاب
            </Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {post.stats.comments} تعليق
            </Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {post.stats.shares} مشاركة
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HomeFilterType>(HOME_FILTER_ALL);
  const [selectedStatus, setSelectedStatus] = useState<SearchStatusFilter>("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSort, setSelectedSort] = useState<SearchSortKey>("newest");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [results, setResults] = useState<HomePost[]>([]);
  const BackButtonIcon = isRTL ? BackIcon : ForwardIcon;
  const rowClassName = isRTL ? "flex-row-reverse" : "flex-row";

  const locationItems = useMemo<SelectableChipItem<string>[]>(
    () => [
      { key: "all", label: "كل المدن" },
      ...Array.from(
        new Set(
          mockHomePayload.posts
            .map((post) => post.publisher.city)
            .filter((city): city is string => Boolean(city)),
        ),
      ).map((city) => ({ key: city, label: city })),
    ],
    [],
  );

  const statusItems = useMemo<SelectableChipItem<SearchStatusFilter>[]>(
    () => [
      { key: "all", label: statusLabels.all },
      { key: "open", label: statusLabels.open },
      { key: "submitted", label: statusLabels.submitted },
      { key: "closed", label: statusLabels.closed },
    ],
    [],
  );

  const sortItems = useMemo<SelectableChipItem<SearchSortKey>[]>(
    () => [
      { key: "newest", label: sortLabels.newest },
      { key: "most_engaged", label: sortLabels.most_engaged },
    ],
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);
    setLoadingMore(false);

    const timeout = setTimeout(() => {
      try {
        const normalizedQuery = debouncedQuery.toLowerCase();
        let nextResults = [...mockHomePayload.posts];

        if (normalizedQuery) {
          nextResults = nextResults.filter((post) =>
            [
              post.title,
              post.content,
              post.publisher.name,
              post.publisher.username,
              post.publisher.city,
            ]
              .filter(Boolean)
              .some((value) => value?.toLowerCase().includes(normalizedQuery)),
          );
        }

        if (selectedCategory !== HOME_FILTER_ALL) {
          nextResults = nextResults.filter((post) => post.postType === selectedCategory);
        }

        if (selectedStatus !== "all") {
          nextResults = nextResults.filter((post) => post.cta.state === selectedStatus);
        }

        if (selectedLocation !== "all") {
          nextResults = nextResults.filter((post) => post.publisher.city === selectedLocation);
        }

        nextResults.sort((left, right) => {
          if (selectedSort === "most_engaged") {
            const leftEngagement = left.stats.likes + left.stats.comments + left.stats.shares;
            const rightEngagement = right.stats.likes + right.stats.comments + right.stats.shares;
            return rightEngagement - leftEngagement;
          }

          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        });

        if (!isCancelled) {
          setResults(nextResults);
          setVisibleCount(PAGE_SIZE);
          setRefreshing(false);
          setIsLoading(false);
        }
      } catch {
        if (!isCancelled) {
          setResults([]);
          setVisibleCount(PAGE_SIZE);
          setRefreshing(false);
          setIsLoading(false);
          setError("تعذر تحميل نتائج البحث الآن. حاول مرة أخرى.");
        }
      }
    }, 180);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [
    debouncedQuery,
    refreshToken,
    selectedCategory,
    selectedLocation,
    selectedSort,
    selectedStatus,
  ]);

  const visibleResults = useMemo(() => results.slice(0, visibleCount), [results, visibleCount]);
  const hasMore = visibleCount < results.length;
  const hasActiveFilters =
    selectedCategory !== HOME_FILTER_ALL ||
    selectedStatus !== "all" ||
    selectedLocation !== "all" ||
    selectedSort !== "newest";

  const activeFilters = useMemo<ActiveFilter[]>(
    () => [
      selectedCategory !== HOME_FILTER_ALL
        ? {
            key: "category",
            label: HOME_POST_TYPE_LABELS[selectedCategory as keyof typeof HOME_POST_TYPE_LABELS],
            onRemove: () => setSelectedCategory(HOME_FILTER_ALL),
          }
        : null,
      selectedStatus !== "all"
        ? {
            key: "status",
            label: statusLabels[selectedStatus],
            onRemove: () => setSelectedStatus("all"),
          }
        : null,
      selectedLocation !== "all"
        ? {
            key: "location",
            label: selectedLocation,
            onRemove: () => setSelectedLocation("all"),
          }
        : null,
      selectedSort !== "newest"
        ? {
            key: "sort",
            label: sortLabels[selectedSort],
            onRemove: () => setSelectedSort("newest"),
          }
        : null,
    ].filter((filter): filter is ActiveFilter => Boolean(filter)),
    [selectedCategory, selectedLocation, selectedSort, selectedStatus],
  );

  const handleOpenResult = useCallback(
    (post: HomePost) => {
      if (post.cta.type === "donate") {
        router.push({ pathname: "/donate/[id]", params: { id: post.id } });
        return;
      }

      if (post.cta.type === "apply") {
        router.push({ pathname: "/apply/[id]", params: { id: post.id } });
        return;
      }

      router.push({ pathname: "/posts/[id]", params: { id: post.id } });
    },
    [router],
  );

  const handleLoadMore = () => {
    if (!hasMore || loadingMore || isLoading) return;

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((current) => Math.min(current + PAGE_SIZE, results.length));
      setLoadingMore(false);
    }, 350);
  };

  const clearAllFilters = () => {
    setSelectedStatus("all");
    setSelectedLocation("all");
    setSelectedSort("newest");
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const retrySearch = () => {
    setRefreshToken((current) => current + 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshToken((current) => current + 1);
  };

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <View className="px-4">
        <View
          style={{ paddingTop: Math.max(insets.top, 8) }}
          className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
        >
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-dark-500"
            accessibilityRole="button"
            accessibilityLabel="العودة"
          >
            <BackButtonIcon size={20} color="#405d72" strokeWidth={2.25} />
          </Pressable>
          <Text size="lg" weight="semibold" className="text-dark-100 dark:text-light-50">
            البحث
          </Text>
          <View className="h-10 w-10" />
        </View>

        <Card padding="md" className="mb-4 gap-4 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center gap-2">
            <View className="flex-1">
              <Input
                placeholder="ابحث في المنشورات، الجهات، المدن..."
                value={query}
                onChangeText={setQuery}
                leftIcon={<SearchIcon size={18} color="#405d72" strokeWidth={2.25} />}
                rightIcon={
                  query ? <ClearIcon size={16} color="#9CA3AF" strokeWidth={2.25} /> : undefined
                }
                onRightIconPress={() => setQuery("")}
                fullWidth
              />
            </View>
            <Pressable
              onPress={() => setIsFilterModalOpen(true)}
              className="h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
              accessibilityRole="button"
              accessibilityLabel="فتح الفلاتر"
            >
              <FilterIcon size={18} color="#405d72" strokeWidth={2.25} />
            </Pressable>
          </View>

          <View className="gap-3">
            <View className={`${rowClassName} items-center justify-between`}>
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                الفئات
              </Text>
              {hasActiveFilters ? (
                <Pressable onPress={clearAllFilters} accessibilityRole="button">
                  <Text size="xs" weight="semibold" className="text-primary-400">
                    مسح الفلاتر
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <HomeTypeSlider
              posts={mockHomePayload.posts}
              selectedType={selectedCategory}
              onSelectType={setSelectedCategory}
            />
          </View>

          {activeFilters.length > 0 ? (
            <View className={`${rowClassName} flex-wrap gap-2`}>
              {activeFilters.map((filter) => (
                <FilterChip key={filter.key} label={filter.label} onRemove={filter.onRemove} />
              ))}
            </View>
          ) : null}

          {!isLoading && !error ? (
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              {results.length} نتيجة {debouncedQuery ? `لـ "${debouncedQuery}"` : ""}
            </Text>
          ) : null}
        </Card>
      </View>

      <FlatList
        className="flex-1 bg-light-100 px-4 dark:bg-dark-300"
        contentContainerStyle={{
          paddingBottom: 28,
        }}
        data={error || isLoading ? [] : visibleResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchResultCard post={item} onPress={() => handleOpenResult(item)} />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#405d72" />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              <HomePostCardSkeleton />
              <HomePostCardSkeleton />
            </View>
          ) : error ? (
            <Card padding="lg" className="items-center gap-3 border-gray-200 dark:border-dark-400">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                حدث خطأ أثناء البحث
              </Text>
              <Text size="xs" className="text-center text-gray-500 dark:text-gray-300">
                {error}
              </Text>
              <Pressable
                onPress={retrySearch}
                className="rounded-xl bg-primary-400 px-4 py-3"
                accessibilityRole="button"
                accessibilityLabel="إعادة المحاولة"
              >
                <Text size="xs" weight="semibold" className="text-light-50">
                  إعادة المحاولة
                </Text>
              </Pressable>
            </Card>
          ) : (
            <Card padding="lg" className="items-center gap-3 border-gray-200 dark:border-dark-400">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                لا توجد نتائج مطابقة
              </Text>
              <Text size="xs" className="text-center text-gray-500 dark:text-gray-300">
                جرّب تعديل الكلمات المفتاحية أو إزالة بعض الفلاتر.
              </Text>
            </Card>
          )
        }
        ListFooterComponent={
          !error && !isLoading ? (
            loadingMore ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color="#405d72" />
              </View>
            ) : hasMore ? (
              <View className="py-3" />
            ) : results.length > 0 ? (
              <View className="items-center py-4">
                <Text size="xs" className="text-gray-500 dark:text-gray-300">
                  وصلت إلى آخر النتائج
                </Text>
              </View>
            ) : null
          ) : null
        }
      />
      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closeFilterModal}
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onPress={closeFilterModal}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="max-h-[78%] w-full rounded-t-3xl bg-white dark:bg-dark-500"
          >
            <View className="flex-row-reverse items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-400">
              <Pressable
                onPress={closeFilterModal}
                className="h-8 w-8 items-center justify-center rounded-lg"
                accessibilityRole="button"
                accessibilityLabel="إغلاق"
              >
                <ClearIcon size={18} color="#6B7280" strokeWidth={2.25} />
              </Pressable>
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                الفلاتر
              </Text>
              <Pressable onPress={clearAllFilters} accessibilityRole="button">
                <Text size="xs" weight="semibold" className="text-primary-400">
                  مسح الفلاتر
                </Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, gap: 16 }}
            >
              <FilterSection
                title="الحالة"
                items={statusItems}
                selectedKey={selectedStatus}
                onSelect={setSelectedStatus}
              />

              <FilterSection
                title="الموقع"
                items={locationItems}
                selectedKey={selectedLocation}
                onSelect={setSelectedLocation}
              />

              <FilterSection
                title="الترتيب"
                items={sortItems}
                selectedKey={selectedSort}
                onSelect={setSelectedSort}
              />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
