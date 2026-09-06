import { View } from "react-native";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";

export function CampaignDonorRowSkeleton() {
  return (
    <View className="flex-row-reverse items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-dark-350">
      <SkeletonBlock width={40} height={40} radius={20} />
      <View className="flex-1 items-end gap-2">
        <SkeletonBlock width="42%" height={11} radius={6} />
        <SkeletonBlock width="58%" height={9} radius={6} />
      </View>
    </View>
  );
}

function CampaignMediaSkeleton() {
  return (
    <View className="mt-1 h-64 gap-0.5 overflow-hidden rounded-xl">
      <View className="flex-1 flex-row gap-0.5">
        <View className="flex-1">
          <SkeletonBlock width="100%" height={126} radius={0} />
        </View>
        <View className="flex-1">
          <SkeletonBlock width="100%" height={126} radius={0} />
        </View>
      </View>
      <View className="flex-1 flex-row gap-0.5">
        <View className="flex-1">
          <SkeletonBlock width="100%" height={126} radius={0} />
        </View>
        <View className="flex-1">
          <SkeletonBlock width="100%" height={126} radius={0} />
        </View>
      </View>
    </View>
  );
}

export function CampaignDetailsSkeleton() {
  return (
    <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تفاصيل الحملة" />
      <View className="gap-2 pb-8">
        <SkeletonBlock width={132} height={22} radius={8} />

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center gap-3">
            <SkeletonBlock width={52} height={52} radius={26} />
            <View className="flex-1 items-end gap-2">
              <SkeletonBlock width="46%" height={13} radius={7} />
              <SkeletonBlock width="34%" height={10} radius={6} />
            </View>
          </View>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="items-end gap-2">
            <SkeletonBlock width="72%" height={20} radius={8} />
          </View>
          <View className="flex-row-reverse items-center gap-2">
            <SkeletonBlock width={82} height={24} radius={999} />
            <SkeletonBlock width={74} height={24} radius={999} />
          </View>
          <View className="items-end gap-2">
            <SkeletonBlock width="94%" height={12} radius={6} />
            <SkeletonBlock width="100%" height={11} radius={6} />
            <SkeletonBlock width="91%" height={11} radius={6} />
            <SkeletonBlock width="63%" height={11} radius={6} />
          </View>
          <CampaignMediaSkeleton />
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between">
            <SkeletonBlock width={86} height={11} radius={6} />
            <SkeletonBlock width={42} height={14} radius={7} />
          </View>
          <SkeletonBlock width="100%" height={8} radius={999} />
          <SkeletonBlock width={142} height={13} radius={7} />
          <SkeletonBlock width={112} height={9} radius={6} />
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between">
            <SkeletonBlock width={118} height={13} radius={7} />
            <SkeletonBlock width={64} height={9} radius={6} />
          </View>
          <CampaignDonorRowSkeleton />
          <CampaignDonorRowSkeleton />
        </Card>

        <SkeletonBlock width="100%" height={48} radius={12} />
      </View>
    </Container>
  );
}
