import { View } from "react-native";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";

export function ReelVideoItemSkeleton({ height }: { height: number }) {
  const videoHeight = Math.max(250, height - 154);

  return (
    <View style={{ height }} className="bg-light-100 px-3 pb-3 dark:bg-dark-300">
      <View className="flex-1 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500">
        <View className="flex-row-reverse items-center justify-between px-4 py-3">
          <View className="flex-row-reverse items-center gap-2">
            <SkeletonBlock width={42} height={42} radius={21} />
            <View className="items-end gap-2">
              <SkeletonBlock width={110} height={12} radius={6} />
              <SkeletonBlock width={72} height={9} radius={6} />
            </View>
          </View>
          <SkeletonBlock width={36} height={36} radius={18} />
        </View>

        <SkeletonBlock width="100%" height={videoHeight} radius={0} />

        <View className="px-4 py-3">
          <View className="mb-3 gap-2">
            <SkeletonBlock width="92%" height={11} radius={6} />
            <SkeletonBlock width="68%" height={11} radius={6} />
          </View>
          <View className="flex-row-reverse items-center gap-3 border-t border-gray-100 pt-3 dark:border-dark-400">
            <SkeletonBlock width={62} height={26} radius={999} />
            <SkeletonBlock width={70} height={26} radius={999} />
            <SkeletonBlock width={58} height={26} radius={999} />
          </View>
        </View>
      </View>
    </View>
  );
}
