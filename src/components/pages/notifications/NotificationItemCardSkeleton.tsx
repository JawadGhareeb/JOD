import { View } from "react-native";
import Card from "@/src/components/ui/Card";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";

export function NotificationItemCardSkeleton() {
  return (
    <Card padding="md" className="mb-2 border border-gray-200 dark:border-dark-400">
      <View className="flex-row-reverse items-start gap-3">
        <SkeletonBlock width={40} height={40} radius={12} />
        <View className="flex-1">
          <View className="flex-row-reverse items-start justify-between gap-2">
            <View className="flex-1 items-end gap-2">
              <SkeletonBlock width="62%" height={12} radius={6} />
              <SkeletonBlock width={74} height={18} radius={999} />
            </View>
            <SkeletonBlock width={10} height={10} radius={5} />
          </View>
          <View className="mt-3 gap-2">
            <SkeletonBlock width="100%" height={10} radius={6} />
            <SkeletonBlock width="86%" height={10} radius={6} />
          </View>
          <View className="mt-3 flex-row-reverse items-center justify-between">
            <SkeletonBlock width={58} height={9} radius={6} />
            <SkeletonBlock width={72} height={10} radius={6} />
          </View>
        </View>
      </View>
    </Card>
  );
}
