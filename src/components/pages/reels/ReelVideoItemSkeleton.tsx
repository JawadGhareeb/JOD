import { View } from "react-native";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";

export function ReelVideoItemSkeleton({ height }: { height: number }) {
  return (
    <View style={{ height }}>
      <View className="relative flex-1 overflow-hidden bg-dark-500">
        <View className="absolute inset-0 bg-dark-350" />

        <View className="absolute bottom-24 right-3 items-center gap-4">
          {[0, 1, 2, 3].map((item) => (
            <View key={item} className="items-center gap-1">
              <SkeletonBlock width={26} height={26} radius={5} />
              {item < 3 ? <SkeletonBlock width={28} height={9} radius={5} /> : null}
            </View>
          ))}
        </View>

        <View className="absolute bottom-8 left-3 right-20">
          <View className="flex-row-reverse items-center gap-2">
            <SkeletonBlock width={38} height={38} radius={19} />
            <View className="flex-1 items-end gap-2">
              <SkeletonBlock width={110} height={12} radius={6} />
              <SkeletonBlock width={72} height={9} radius={6} />
            </View>
            <SkeletonBlock width={68} height={32} radius={8} />
          </View>
          <View className="mt-2 gap-2">
            <SkeletonBlock width="82%" height={10} radius={5} />
            <SkeletonBlock width="58%" height={10} radius={5} />
          </View>
        </View>
      </View>
    </View>
  );
}
