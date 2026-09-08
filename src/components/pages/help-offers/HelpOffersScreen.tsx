import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { FilterCountSlider } from "@/src/components/shared";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useHelpOffers } from "@/src/features/help-offers/queries";
import type { HelpOffer, HelpOfferStatus } from "@/src/features/help-offers/types";

const STATUS_LABELS: Record<HelpOfferStatus, string> = {
  pending: "بانتظار الموافقة",
  accepted: "تم القبول",
  contacting: "جاري التواصل",
  agreed: "تم الاتفاق",
  completed: "مكتمل",
  rejected: "مرفوض",
  cancelled: "ملغي",
};
const STATUS_TABS: { value: HelpOfferStatus | "all"; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "بانتظار الموافقة" },
  { value: "accepted", label: "تم القبول" },
  { value: "contacting", label: "جاري التواصل" },
  { value: "agreed", label: "تم الاتفاق" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

function ProgressLine({ done, text }: { done: boolean; text: string }) {
  return <Text size="2xs" className={done ? "text-primary-400" : "text-gray-400"}>{done ? "✓" : "○"} {text}</Text>;
}

function OfferCard({ offer }: { offer: HelpOffer }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push({ pathname: "/help-offers/[id]", params: { id: offer.id } })}>
      <Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-start justify-between gap-2">
          <View className="min-w-0 flex-1 items-end">
            <Text numberOfLines={1} weight="semibold" size="sm">{offer.post?.title || "طلب مساعدة"}</Text>
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">المساعد: {offer.helper.name}</Text>
          </View>
          <View className="rounded-full bg-primary-400/10 px-2.5 py-1"><Text size="2xs" className="text-primary-400">{STATUS_LABELS[offer.status]}</Text></View>
        </View>
        <View className="mt-1 border-t border-gray-100 pt-2 dark:border-dark-400">
          <ProgressLine done={Boolean(offer.createdAt)} text="تم إرسال عرض المساعدة" />
          <ProgressLine done={Boolean(offer.acceptedAt)} text="تم قبول العرض" />
          <ProgressLine done={Boolean(offer.contactedAt)} text="تم بدء التواصل" />
          <ProgressLine done={Boolean(offer.agreedAt)} text="تم تأكيد الاتفاق من الطرفين" />
          <ProgressLine done={Boolean(offer.completedAt)} text="تم تقديم واستلام المساعدة" />
        </View>
      </Card>
    </Pressable>
  );
}

export function HelpOffersScreen() {
  const [flow, setFlow] = useState<"made" | "received">("made");
  const [status, setStatus] = useState<HelpOfferStatus | "all">("all");
  const query = useHelpOffers({ flow, status: status === "all" ? undefined : status, perPage: 20 });
  const offers = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="طلبات المساعدة" />
      <View className="mb-3 flex-row-reverse gap-2">
        <View className="flex-1">
          <Button fullWidth size="small" variant={flow === "made" ? "primary" : "tertiary"} onPress={() => { setFlow("made"); setStatus("all"); }}>العروض التي قدمتها</Button>
        </View>
        <View className="flex-1">
          <Button fullWidth size="small" variant={flow === "received" ? "primary" : "tertiary"} onPress={() => { setFlow("received"); setStatus("all"); }}>العروض الواردة</Button>
        </View>
      </View>

      <FilterCountSlider
        items={STATUS_TABS.map((tab) => ({ key: tab.value, label: tab.label }))}
        selectedKey={status}
        onSelect={setStatus}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ gap: 10, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {query.isLoading ? <><CardSkeleton /><CardSkeleton /></> : null}
        {!query.isLoading && query.isError ? (
          <View className="items-center gap-3 py-10"><Text size="sm" className="text-gray-500">تعذر تحميل طلبات المساعدة.</Text><Button size="small" onPress={() => void query.refetch()}>إعادة المحاولة</Button></View>
        ) : null}
        {!query.isLoading && !query.isError && offers.length === 0 ? <View className="items-center py-12"><Text size="sm" className="text-gray-500 dark:text-gray-300">لا توجد عروض ضمن هذا القسم.</Text></View> : null}
        {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
        {query.hasNextPage ? <Button variant="tertiary" loading={query.isFetchingNextPage} onPress={() => void query.fetchNextPage()}>عرض المزيد</Button> : null}
      </ScrollView>
    </View>
  );
}
