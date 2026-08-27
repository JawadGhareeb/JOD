import { useState } from "react";
import { View } from "react-native";
import Tabs from "@/src/components/ui/Tabs";
import type { ContentAudience } from "@/src/features/posts/types";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { HomeComposerBar } from "./HomeComposerBar";
import { HomeFeed } from "./HomeFeed";

const AUDIENCE_TABS = [
  { id: "general", label: "مساعدات عامة" },
  { id: "student", label: "مساعدات طلابية" },
];

export function HomeScreen() {
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();
  const [audience, setAudience] = useState<ContentAudience>("general");

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <HomeFeed
        audience={audience}
        onScroll={onScroll}
        onRefresh={resetHeader}
        listHeaderComponent={
          <View className="pb-3">
            <HomeComposerBar />
            <Tabs
              tabs={AUDIENCE_TABS}
              activeTab={audience}
              onTabChange={(id) => setAudience(id as ContentAudience)}
            />
          </View>
        }
      />
    </View>
  );
}
