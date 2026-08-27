import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "@/src/components/layout/iconMap";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { HomePostCardSkeleton } from "@/src/components/pages/home/HomePostCardSkeleton";
import { Avatar } from "@/src/components/shared/Avatar";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useGlobalSearch } from "@/src/features/search/queries";
import type { GlobalSearchType, SearchAccount } from "@/src/features/search/types";
import { getPrimaryColor } from "@/src/theme";

const BackIcon = appIcons.chevronRight;
const SearchIcon = appIcons.search;
const TYPES: { value: GlobalSearchType; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "accounts", label: "الحسابات" },
  { value: "posts", label: "المنشورات" },
  { value: "campaigns", label: "الحملات" },
];

function OrganizationCard({ account, onPress }: { account: SearchAccount; onPress: () => void }) {
  const initials = account.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  return (
    <Card padding="none" className="w-[220px] overflow-hidden border-gray-200 dark:border-dark-400">
      <View className="items-center px-4 pb-4 pt-4">
        {account.avatarUrl ? (
          <Image source={{ uri: account.avatarUrl }} className="h-28 w-28 rounded-2xl bg-gray-100 dark:bg-dark-350" resizeMode="cover" />
        ) : (
          <View className="h-28 w-28 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-400/15">
            <Text weight="bold" size="lg" className="text-primary-400">{initials || "ج"}</Text>
          </View>
        )}
        <View className="mt-3 w-full items-center">
          <View className="max-w-full flex-row-reverse items-center gap-1.5">
            <Text numberOfLines={1} weight="semibold" size="sm" className="max-w-[165px] text-dark-100 dark:text-light-50">{account.name}</Text>
            {account.verified ? <VerifiedBadge /> : null}
          </View>
          <Text numberOfLines={1} size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">{account.city || `@${account.username}`}</Text>
          <View className="h-12 w-full justify-center">
            <Text numberOfLines={2} ellipsizeMode="tail" size="2xs" rtlAlign="center" className="leading-5 text-gray-500 dark:text-gray-300">
              {account.bio || "منظمة مسجلة على منصة جود."}
            </Text>
          </View>
        </View>
        <View className="mt-2 w-full"><Button fullWidth size="small" variant="tertiary" onPress={onPress}>زيارة الملف</Button></View>
      </View>
    </Card>
  );
}

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<GlobalSearchType>("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useGlobalSearch(
    { search: debouncedSearch || undefined, type, sort: "newest", perType: 20 },
    debouncedSearch.length > 0,
  );
  const organizationsQuery = useGlobalSearch(
    { type: "accounts", sort: "newest", perType: 12 },
    debouncedSearch.length === 0,
  );

  const result = query.data?.data;
  const counts = query.data?.meta.counts;
  const total = useMemo(
    () => (counts?.accounts ?? 0) + (counts?.posts ?? 0) + (counts?.campaigns ?? 0),
    [counts],
  );
  const organizations = useMemo(
    () =>
      (organizationsQuery.data?.data.accounts ?? [])
        .filter((account) => account.accountType === "organization")
        .slice(0, 10),
    [organizationsQuery.data],
  );

  const openAccount = (id: string) => router.push({ pathname: "/author/[id]", params: { id } });

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <View
        style={{ paddingTop: Math.max(insets.top, 8) }}
        className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"
          accessibilityRole="button"
          accessibilityLabel="رجوع"
        >
          <BackIcon size={20} color={primaryColor} strokeWidth={2.25} />
        </Pressable>
        <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">
          البحث
        </Text>
        <View className="h-10 w-10" />
      </View>

      <Input
        fullWidth
        showStatusIcon={false}
        rightIcon={<SearchIcon size={18} color={primaryColor} />}
        value={search}
        onChangeText={setSearch}
        placeholder="ابحث عن حساب أو منشور أو حملة"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
      />

      <View className="flex-row-reverse flex-wrap items-center justify-start gap-2 py-3">
        {TYPES.map((item) => {
          const active = type === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => setType(item.value)}
              className={`rounded-full border px-4 py-2 ${
                active
                  ? "border-primary-400 bg-primary-400/10"
                  : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text size="xs" className={active ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {!debouncedSearch ? (
          <View>
            <View className="w-full items-center px-4 pb-7 pt-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/15">
                <SearchIcon size={30} color={primaryColor} strokeWidth={2.1} />
              </View>
              <Text weight="bold" size="base" rtlAlign="center" className="mt-3 text-dark-100 dark:text-light-50">
                ابحث
              </Text>
              <Text size="xs" rtlAlign="center" className="mt-2 w-full max-w-[340px] leading-6 text-gray-500 dark:text-gray-300">
                ابحث عن المحتوى الذي يهمك، أو تعرّف على منظمات موجودة على جود.
              </Text>
            </View>

            <View className="mb-3 flex-row-reverse items-center justify-between">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                منظمات على جود
              </Text>
              <Text size="2xs" className="text-gray-400 dark:text-gray-300">
                استكشف الملفات
              </Text>
            </View>

            {organizationsQuery.isLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
                {[0, 1, 2].map((item) => <CardSkeleton key={item} width={220} height={250} margin={0} />)}
              </ScrollView>
            ) : organizations.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
                {organizations.map((account) => <OrganizationCard key={account.id} account={account} onPress={() => openAccount(account.id)} />)}
              </ScrollView>
            ) : (
              <Card padding="md" className="border-gray-200 dark:border-dark-400">
                <Text size="xs" rtlAlign="center" className="text-gray-500 dark:text-gray-300">
                  لا توجد منظمات متاحة للعرض حالياً.
                </Text>
              </Card>
            )}
          </View>
        ) : query.isLoading ? (
          <View>
            {[0, 1, 2].map((item) => (
              <HomePostCardSkeleton key={item} />
            ))}
          </View>
        ) : query.isError ? (
          <View className="items-center py-16">
            <Text size="sm" className="text-error-300">
              تعذر تنفيذ البحث. حاول مرة أخرى.
            </Text>
          </View>
        ) : total === 0 ? (
          <View className="items-center py-16">
            <SearchIcon size={36} color="#9CA3AF" />
            <Text size="sm" className="mt-3 text-gray-500 dark:text-gray-300">
              لا توجد نتائج مطابقة.
            </Text>
          </View>
        ) : (
          <>
            {(type === "all" || type === "accounts") && (result?.accounts.length ?? 0) > 0 ? (
              <View className="mb-4">
                <Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">
                  الحسابات ({counts?.accounts ?? 0})
                </Text>
                {(result?.accounts.some((account) => account.accountType === "organization")) ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 12 }}>
                    {result?.accounts.filter((account) => account.accountType === "organization").map((account) => <OrganizationCard key={account.id} account={account} onPress={() => openAccount(account.id)} />)}
                  </ScrollView>
                ) : null}
                {result?.accounts.filter((account) => account.accountType !== "organization").map((account) => (
                  <Card key={account.id} padding="md" className="mb-2 border-gray-200 dark:border-dark-400" onPress={() => openAccount(account.id)}>
                    <View className="flex-row-reverse items-center gap-3">
                      <Avatar name={account.name} imageUrl={account.avatarUrl} size={46} />
                      <View className="flex-1"><Text weight="semibold" size="sm">{account.name}</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">@{account.username}{account.city ? ` • ${account.city}` : ""}</Text></View>
                      {account.verified ? <VerifiedBadge /> : null}
                    </View>
                  </Card>
                ))}
              </View>
            ) : null}

            {(type === "all" || type === "posts") && (result?.posts.length ?? 0) > 0 ? (
              <View className="mb-4">
                <Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">
                  المنشورات ({counts?.posts ?? 0})
                </Text>
                {result?.posts.map((post) => <HomePostCard key={post.id} post={post} />)}
              </View>
            ) : null}

            {(type === "all" || type === "campaigns") && (result?.campaigns.length ?? 0) > 0 ? (
              <View className="mb-4">
                <Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">
                  الحملات ({counts?.campaigns ?? 0})
                </Text>
                {result?.campaigns.map((campaign) => {
                  const progress =
                    campaign.goalAmount > 0
                      ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)
                      : 0;
                  return (
                    <Card key={campaign.id} padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
                      <Text weight="semibold" size="sm">
                        {campaign.title}
                      </Text>
                      <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
                        {campaign.organizationName || campaign.publisher.name}
                        {campaign.location ? ` • ${campaign.location}` : ""}
                      </Text>
                      {campaign.summary ? (
                        <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
                          {campaign.summary}
                        </Text>
                      ) : null}
                      <View className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-350">
                        <View style={{ width: `${progress}%` }} className="h-full bg-primary-400" />
                      </View>
                      <Text size="2xs" className="mt-2 text-gray-500 dark:text-gray-300">
                        {campaign.raisedAmount.toLocaleString("ar-SY")} / {campaign.goalAmount.toLocaleString("ar-SY")}
                      </Text>
                    </Card>
                  );
                })}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
