import { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { useDonations } from "@/src/features/donations/queries";
import type { DonationStatus } from "@/src/features/donations/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";
import { MenuPageHeader } from "./MenuPageHeader";

const HeartIcon = appIcons.myDonations;
const formatAmount = (amount: number) =>
  `${amount.toLocaleString("ar-SY", { maximumFractionDigits: 2 })} ل.س`;
const statusLabels: Record<DonationStatus, string> = {
  pending: "بانتظار التواصل",
  contacting: "جاري التواصل",
  agreed: "تم الاتفاق",
  completed: "مكتمل",
  cancelled: "ملغي",
};
const filters: { value: "all" | DonationStatus; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "بانتظار التواصل" },
  { value: "contacting", label: "جاري التواصل" },
  { value: "agreed", label: "تم الاتفاق" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

export function MyDonationsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"all" | DonationStatus>("all");
  const query = useDonations({ status: status === "all" ? undefined : status });
  const donations = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );
  const confirmedTotal = donations
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تبرعاتي" />
      <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-center justify-between">
          <View>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              إجمالي التبرعات المؤكدة ضمن النتائج
            </Text>
            <Text weight="semibold" size="base" className="mt-1 text-primary-400">
              {formatAmount(confirmedTotal)}
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
            <HeartIcon size={20} color="#405d72" strokeWidth={2.25} />
          </View>
        </View>
      </Card>
      <View className="mb-3 flex-row-reverse flex-wrap gap-2">
        {filters.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setStatus(item.value)}
            className={`rounded-full border px-3 py-2 ${
              status === item.value
                ? "border-primary-400 bg-primary-400/10"
                : "border-gray-200 dark:border-dark-400"
            }`}
          >
            <Text
              size="2xs"
              className={
                status === item.value
                  ? "text-primary-400"
                  : "text-gray-500 dark:text-gray-300"
              }
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void query.refetch()}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) {
            void query.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <Card
            padding="md"
            className="mb-3 gap-3 border-gray-200 dark:border-dark-400"
            onPress={() =>
              router.push({ pathname: "/donations/[id]", params: { id: item.id } })
            }
            accessibilityRole="button"
            accessibilityLabel={`تفاصيل التبرع لحملة ${item.campaignTitle}`}
          >
            <View className="flex-row-reverse items-start justify-between gap-3">
              <View className="flex-1">
                <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                  {item.campaignTitle}
                </Text>
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  {item.organizationName || item.organization || "منظمة غير محددة"}
                  {item.createdAt ? ` • ${formatRelativeDateAr(item.createdAt)}` : ""}
                </Text>
              </View>
              <View className="rounded-full bg-primary-400/10 px-3 py-1">
                <Text size="2xs" weight="medium" className="text-primary-400">
                  {statusLabels[item.status]}
                </Text>
              </View>
            </View>
            <View className="flex-row-reverse items-center justify-between">
              <Text size="sm" weight="semibold" className="text-primary-400">
                {formatAmount(item.amount)}
              </Text>
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                {item.contactMethod || "-"} / {item.paymentMethod || "-"}
              </Text>
            </View>
            <View className="gap-1 border-t border-gray-100 pt-3 dark:border-dark-400">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                ✓ تم إرسال طلب التبرع
              </Text>
              <Text size="2xs" className={item.contactedAt ? "text-primary-400" : "text-gray-400"}>
                {item.contactedAt ? "✓" : "○"} تم بدء التواصل
              </Text>
              <Text size="2xs" className={item.agreedAt ? "text-primary-400" : "text-gray-400"}>
                {item.agreedAt ? "✓" : "○"} تم الاتفاق
              </Text>
              <Text size="2xs" className={item.completedAt ? "text-success-100" : "text-gray-400"}>
                {item.completedAt ? "✓" : "○"} تم تأكيد استلام التبرع
              </Text>
              {item.status === "cancelled" ? (
                <Text size="2xs" className="text-error-300">
                  تم الإلغاء{item.cancelReason ? `: ${item.cancelReason}` : ""}
                </Text>
              ) : null}
            </View>
          </Card>
        )}
        ListEmptyComponent={
          query.isLoading ? (
            <View className="gap-3 py-2">
              {[0, 1, 2].map((item) => (
                <CardSkeleton key={item} height={140} margin={0} />
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                لا توجد طلبات تبرع ضمن هذا التصنيف.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? <CardSkeleton height={96} margin={0} /> : null
        }
      />
    </View>
  );
}
