import { useRef } from "react";
import { View } from "react-native";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { useOnTabReselect } from "@/src/lib/tab-reselect";
import { HomeComposerBar } from "./HomeComposerBar";
import { HomeFeed, type HomeFeedHandle } from "./HomeFeed";

export function StudentAssistanceScreen() {
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();
  const feedRef = useRef<HomeFeedHandle>(null);

  useOnTabReselect("student", () => {
    resetHeader();
    feedRef.current?.scrollToTopAndRefresh();
  });

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <HomeFeed
        ref={feedRef}
        audience="student"
        onScroll={onScroll}
        onRefresh={resetHeader}
        listHeaderComponent={
          <View className="border-b border-gray-200/80 bg-light-100 px-3 pb-3 pt-1 dark:border-dark-400 dark:bg-dark-300">
            <HomeComposerBar />
          </View>
        }
      />
    </View>
  );
}
