import { View } from "react-native";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";

export function MyPostCardSkeleton() {
  return (
    <View className="mb-0 border-b border-gray-100 bg-transparent px-3 py-3 dark:border-dark-400">
      <View className="mb-3 flex-row-reverse items-start justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row-reverse items-center gap-2">
          <SkeletonBlock width={42} height={42} radius={21} />
          <View className="flex-1 items-end gap-2">
            <SkeletonBlock width="48%" height={12} radius={6} />
            <SkeletonBlock width="64%" height={9} radius={6} />
          </View>
        </View>
        <SkeletonBlock width={72} height={24} radius={999} />
      </View>

      <View className="mb-2 items-end">
        <SkeletonBlock width={68} height={22} radius={999} />
      </View>

      <View className="mb-3 items-end gap-2">
        <SkeletonBlock width="76%" height={14} radius={7} />
        <SkeletonBlock width="100%" height={11} radius={6} />
        <SkeletonBlock width="88%" height={11} radius={6} />
      </View>

      <View className="-mx-3">
        <SkeletonBlock width="100%" height={176} radius={0} />
      </View>

      <View className="mt-3 flex-row-reverse items-center justify-between pt-1">
        <View className="flex-row-reverse items-center gap-4">
          <SkeletonBlock width={48} height={20} radius={8} />
          <SkeletonBlock width={48} height={20} radius={8} />
        </View>
        <View className="flex-row-reverse items-center gap-2">
          <SkeletonBlock width={36} height={36} radius={18} />
          <SkeletonBlock width={36} height={36} radius={18} />
        </View>
      </View>
    </View>
  );
}
