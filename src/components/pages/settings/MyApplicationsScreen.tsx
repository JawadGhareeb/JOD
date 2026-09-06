import { useMemo } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import Button from "@/src/components/ui/Button";
import { MenuPageHeader } from "./MenuPageHeader";
import { useApplications } from "@/src/features/applications/queries";
import type { CampaignApplication } from "@/src/features/applications/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  approved: "مقبول",
  accepted: "مقبول",
  rejected: "مرفوض",
  withdrawn: "مسحوب",
};

function ApplicationCard({ item, onPress }: { item: CampaignApplication; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-start justify-between gap-3">
          <View className="flex-1">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">{item.campaignTitle}</Text>
            <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">{item.organizationName ?? "المنظمة غير متاحة"}</Text>
          </View>
          <View className="rounded-full bg-primary-100 px-3 py-1 dark:bg-dark-350">
            <Text size="2xs" className="text-primary-500">{STATUS_LABELS[item.status] ?? item.status}</Text>
          </View>
        </View>
        {item.submittedAt ? <Text size="2xs" className="mt-3 text-gray-500 dark:text-gray-300">تاريخ التقديم: {new Date(item.submittedAt).toLocaleDateString("ar")}</Text> : null}
      </Card>
    </Pressable>
  );
}

export function MyApplicationsScreen() {
  const router = useRouter();
  const query = useApplications({ perPage: 20 });
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data?.pages]);
  const refreshing = query.isRefetching && !query.isFetchingNextPage;

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="طلباتي على الحملات" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void query.refetch()} />}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 120 && query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        scrollEventThrottle={16}
      >
        {query.isLoading ? <Text size="xs" className="py-8 text-center text-gray-500">جارِ تحميل الطلبات...</Text> : null}
        {query.isError ? <Card padding="md" className="border-error-300/30"><Text size="xs" className="text-error-300">تعذر تحميل طلباتك.</Text><View className="mt-3"><Button size="small" onPress={() => void query.refetch()}>إعادة المحاولة</Button></View></Card> : null}
        {!query.isLoading && !query.isError && items.length === 0 ? <Card padding="md"><Text size="sm" weight="semibold" className="text-center">لا توجد طلبات حالياً</Text><Text size="xs" className="mt-2 text-center text-gray-500">طلبات التطوع التي تقدمها على الحملات ستظهر هنا.</Text></Card> : null}
        {items.map((item) => <ApplicationCard key={item.id} item={item} onPress={() => router.push({ pathname: "/applications/[id]", params: { id: item.id } })} />)}
        {query.isFetchingNextPage ? <Text size="2xs" className="py-3 text-center text-gray-500">جارِ تحميل المزيد...</Text> : null}
      </ScrollView>
    </View>
  );
}
