import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appIcons } from "@/src/components/layout/iconMap";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { Avatar } from "@/src/components/shared/Avatar";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useGlobalSearch } from "@/src/features/search/queries";
import type { GlobalSearchType } from "@/src/features/search/types";

const BackIcon = appIcons.chevronRight;
const SearchIcon = appIcons.search;
const TYPES: { value: GlobalSearchType; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "accounts", label: "الحسابات" },
  { value: "posts", label: "المنشورات" },
  { value: "campaigns", label: "الحملات" },
];

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
  const result = query.data?.data;
  const counts = query.data?.meta.counts;
  const total = useMemo(() => (counts?.accounts ?? 0) + (counts?.posts ?? 0) + (counts?.campaigns ?? 0), [counts]);

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <View style={{ paddingTop: Math.max(insets.top, 8) }} className="mb-3 flex-row-reverse items-center justify-between border-b border-gray-200 py-3 dark:border-dark-400">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100"><BackIcon size={20} color="#405d72" strokeWidth={2.25} /></Pressable>
        <Text weight="semibold" size="lg" className="text-dark-100 dark:text-light-50">البحث</Text><View className="h-10 w-10" />
      </View>

      <Input fullWidth showStatusIcon={false} rightIcon={<SearchIcon size={18} color="#405d72" />} value={search} onChangeText={setSearch} placeholder="ابحث عن حساب أو منشور أو حملة" placeholderTextColor="#9CA3AF" autoCapitalize="none" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {TYPES.map((item) => <Pressable key={item.value} onPress={() => setType(item.value)} className={`rounded-full border px-4 py-2 ${type === item.value ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}><Text size="xs" className={type === item.value ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}>{item.label}</Text></Pressable>)}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {!debouncedSearch ? <View className="items-center py-16"><SearchIcon size={30} color="#9CA3AF" /><Text size="sm" className="mt-3 text-gray-500 dark:text-gray-300">ابدأ بكتابة كلمة البحث.</Text></View> : query.isLoading ? <View className="items-center py-16"><ActivityIndicator /><Text size="xs" className="mt-3 text-gray-500 dark:text-gray-300">جارِ البحث...</Text></View> : query.isError ? <View className="items-center py-16"><Text size="sm" className="text-error-300">تعذر تنفيذ البحث. حاول مرة أخرى.</Text></View> : total === 0 ? <View className="items-center py-16"><Text size="sm" className="text-gray-500 dark:text-gray-300">لا توجد نتائج مطابقة.</Text></View> : (
          <>
            {(type === "all" || type === "accounts") && (result?.accounts.length ?? 0) > 0 ? <View className="mb-4"><Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">الحسابات ({counts?.accounts ?? 0})</Text>{result?.accounts.map((account) => <Card key={account.id} padding="md" className="mb-2 border-gray-200 dark:border-dark-400" onPress={() => router.push({ pathname: "/author/[id]", params: { id: account.id } })}><View className="flex-row-reverse items-center gap-3"><Avatar name={account.name} size={42} /><View className="flex-1"><Text weight="semibold" size="sm">{account.name}</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">@{account.username}{account.city ? ` • ${account.city}` : ""}</Text></View>{account.verified ? <Text size="2xs" className="text-primary-400">موثق</Text> : null}</View></Card>)}</View> : null}

            {(type === "all" || type === "posts") && (result?.posts.length ?? 0) > 0 ? <View className="mb-4"><Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">المنشورات ({counts?.posts ?? 0})</Text>{result?.posts.map((post) => <HomePostCard key={post.id} post={post} />)}</View> : null}

            {(type === "all" || type === "campaigns") && (result?.campaigns.length ?? 0) > 0 ? <View className="mb-4"><Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">الحملات ({counts?.campaigns ?? 0})</Text>{result?.campaigns.map((campaign) => {
              const progress = campaign.goalAmount > 0 ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100) : 0;
              return <Card key={campaign.id} padding="md" className="mb-2 border-gray-200 dark:border-dark-400"><Text weight="semibold" size="sm">{campaign.title}</Text><Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">{campaign.organizationName || campaign.publisher.name}{campaign.location ? ` • ${campaign.location}` : ""}</Text>{campaign.summary ? <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">{campaign.summary}</Text> : null}<View className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-350"><View style={{ width: `${progress}%` }} className="h-full bg-primary-400" /></View><Text size="2xs" className="mt-2 text-gray-500 dark:text-gray-300">{campaign.raisedAmount.toLocaleString("ar-SY")} / {campaign.goalAmount.toLocaleString("ar-SY")}</Text></Card>;
            })}</View> : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
