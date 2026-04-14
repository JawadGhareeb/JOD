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

export function HomePostCardSkeleton() {
  return (
    <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="mb-3 flex-row-reverse items-center justify-between">
        <View className="flex-row-reverse items-center gap-2">
          <SkeletonBlock width={42} height={42} radius={21} />
          <View>
            <View className="mb-1.5 flex-row-reverse items-center gap-1">
              <SkeletonBlock width={110} height={10} radius={6} />
              <SkeletonBlock width={34} height={10} radius={6} />
            </View>
            <SkeletonBlock width={145} height={9} radius={6} />
          </View>
        </View>

        <SkeletonBlock width={78} height={24} radius={999} />
      </View>

      <View className="mb-2 gap-2">
        <SkeletonBlock width="100%" height={13} radius={7} />
        <SkeletonBlock width="85%" height={13} radius={7} />
      </View>

      <View className="mt-2">
        <SkeletonBlock width="100%" height={176} radius={12} />
      </View>
    </Card>
  );
}
