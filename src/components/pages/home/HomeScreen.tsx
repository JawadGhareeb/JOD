import { useState } from "react";
import { Pressable, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { FollowingFeedScreen } from "@/src/components/pages/follows/FollowingFeedScreen";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { HomeComposerBar } from "./HomeComposerBar";
import { HomeFeed } from "./HomeFeed";

type HomeTab = "forYou" | "following";

const TABS: { value: HomeTab; label: string }[] = [
  { value: "forYou", label: "لك" },
  { value: "following", label: "المتابَعون" },
];

export function HomeScreen() {
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();
  const [tab, setTab] = useState<HomeTab>("forYou");

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <View className="flex-row-reverse gap-2 px-4 pb-2 pt-3">
        {TABS.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setTab(item.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === item.value }}
            className={`flex-1 rounded-xl border px-3 py-2 ${
              tab === item.value
                ? "border-primary-400 bg-primary-400/10"
                : "border-gray-200 dark:border-dark-400"
            }`}
          >
            <Text
              size="xs"
              weight="medium"
              rtlAlign="center"
              className={tab === item.value ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "forYou" ? (
        <HomeFeed
          audience="general"
          onScroll={onScroll}
          onRefresh={resetHeader}
          listHeaderComponent={
            <View className="pb-3">
              <HomeComposerBar />
            </View>
          }
        />
      ) : (
        <FollowingFeedScreen />
      )}
    </View>
  );
}
