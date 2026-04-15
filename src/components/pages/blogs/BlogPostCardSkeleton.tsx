import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useColorScheme } from "nativewind";
import Card from "@/src/components/ui/Card";

function SkeletonBlock({
  width,
  height,
  radius = 8,
}: {
  width: number | `${number}%` | "auto";
  height: number;
  radius?: number;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        opacity,
        backgroundColor: isDark ? "#3B3C47" : "#E4E8F0",
      }}
    />
  );
}

export function BlogPostCardSkeleton() {
  return (
    <Card padding="none" className="mb-3 overflow-hidden border-gray-200 dark:border-dark-400">
      <SkeletonBlock width="100%" height={176} radius={0} />

      <View className="p-4">
        <View className="mb-3 flex-row-reverse items-center justify-between">
          <SkeletonBlock width={86} height={24} radius={999} />
          <SkeletonBlock width={78} height={10} radius={6} />
        </View>

        <View className="gap-2">
          <SkeletonBlock width="80%" height={13} radius={7} />
          <SkeletonBlock width="100%" height={12} radius={7} />
          <SkeletonBlock width="92%" height={12} radius={7} />
        </View>

        <View className="mt-4 flex-row-reverse items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-400">
          <SkeletonBlock width={72} height={10} radius={6} />
          <SkeletonBlock width={64} height={10} radius={6} />
        </View>
      </View>
    </Card>
  );
}
