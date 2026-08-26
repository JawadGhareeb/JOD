import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { useHelpOffers } from "@/src/features/help-offers/queries";
import type { HelpOfferStatus } from "@/src/features/help-offers/types";

const STATUS_LABELS: Record<HelpOfferStatus, string> = {
  pending: "بانتظار الرد",
  accepted: "مقبول",
  contacting: "جاري التواصل",
  agreed: "تم الاتفاق",
  completed: "مكتمل",
  rejected: "مرفوض",
  cancelled: "ملغي",
};

const FLOW_TABS = [
  { value: "made", label: "العروض التي قدمتها" },
  { value: "received", label: "العروض الواردة" },
] as const;

export function HelpOffersScreen() {
  const router = useRouter();
  const [flow, setFlow] = useState<"made" | "received">("made");
  const query = useHelpOffers({ flow });
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  return (
    <View className="flex-1 bg-light-100 px-4 pt-6 dark:bg-dark-300">
      <Text variant="heading" weight="bold" rtlAlign="right">
        عروض المساعدة
      </Text>

      <View className="my-4 flex-row-reverse gap-2">
        {FLOW_TABS.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => setFlow(tab.value)}
            className={`flex-1 rounded-xl border px-3 py-3 ${
              flow === tab.value
                ? "border-primary-400 bg-primary-400/10"
                : "border-gray-200 dark:border-dark-400"
            }`}
          >
            <Text
              size="xs"
              weight="medium"
              rtlAlign="center"
              className={flow === tab.value ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => void query.refetch()}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        renderItem={({ item }) => (
          <Card
            padding="md"
            className="mb-3 gap-2 border-gray-200 dark:border-dark-400"
            onPress={() => router.push({ pathname: "/help-offers/[id]", params: { id: item.id } })}
          >
            <View className="flex-row-reverse items-center justify-between">
              <Text size="sm" weight="semibold" className="flex-1 text-dark-100 dark:text-light-50">
                {item.post?.title || "طلب مساعدة"}
              </Text>
              <View className="rounded-full bg-primary-400/10 px-3 py-1">
                <Text size="2xs" className="text-primary-400">
                  {STATUS_LABELS[item.status]}
                </Text>
              </View>
            </View>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              {flow === "received" ? `من ${item.helper.name}` : `نوع المساعدة: ${item.type}`}
            </Text>
            {item.amount ? (
              <Text size="xs" weight="semibold" className="text-primary-400">
                {item.amount.toLocaleString("ar-SY")} ل.س
              </Text>
            ) : null}
          </Card>
        )}
        ListEmptyComponent={
          query.isLoading ? (
            <View className="gap-3">
              {[0, 1, 2].map((index) => (
                <CardSkeleton key={index} height={110} margin={0} />
              ))}
            </View>
          ) : (
            <View className="items-center py-10">
              <Text size="sm" className="text-gray-500 dark:text-gray-300">
                لا توجد عروض مساعدة حالياً.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
