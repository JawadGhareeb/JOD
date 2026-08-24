import { useMemo } from "react";
import { FlatList, View } from "react-native";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { useDonations } from "@/src/features/donations/queries";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { MenuPageHeader } from "./MenuPageHeader";

const HeartIcon = appIcons.myDonations;
const formatAmount = (amount: number) => `${amount.toLocaleString("ar-SY", { maximumFractionDigits: 2 })} ل.س`;

export function MyDonationsScreen() {
  const query = useDonations();
  const donations = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const totalAmount = donations.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تبرعاتي" />
      <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-center justify-between"><View><Text size="xs" className="text-gray-500 dark:text-gray-300">إجمالي مساهماتي المعروضة</Text><Text weight="semibold" size="base" className="mt-1 text-primary-400">{formatAmount(totalAmount)}</Text></View><View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350"><HeartIcon size={20} color="#405d72" strokeWidth={2.25} /></View></View>
      </Card>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void query.refetch()}
        onEndReached={() => { if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage(); }}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">{item.campaignTitle}</Text>
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">{item.organizationName || "منظمة غير محددة"}{item.donatedAt ? ` • ${formatRelativeDateAr(item.donatedAt)}` : ""}</Text>
            <View className="mt-3 flex-row-reverse items-center justify-between"><Text size="sm" weight="semibold" className="text-primary-400">{formatAmount(item.amount)}</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">{item.paymentMethod || "طريقة غير محددة"}</Text></View>
          </Card>
        )}
        ListEmptyComponent={query.isLoading ? <View className="gap-3 py-2">{[0, 1, 2].map((item) => <CardSkeleton key={item} height={120} margin={0} />)}</View> : <View className="items-center py-8"><Text size="sm" className="text-gray-500 dark:text-gray-300">لا توجد مساهمات مسجلة حالياً.</Text></View>}
        ListFooterComponent={query.isFetchingNextPage ? <CardSkeleton height={96} margin={0} /> : null}
      />
    </View>
  );
}
