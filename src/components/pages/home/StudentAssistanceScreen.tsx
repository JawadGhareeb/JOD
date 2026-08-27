import { View } from "react-native";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { HomeComposerBar } from "./HomeComposerBar";
import { HomeFeed } from "./HomeFeed";

export function StudentAssistanceScreen() {
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <HomeFeed
        audience="student"
        onScroll={onScroll}
        onRefresh={resetHeader}
        listHeaderComponent={
          <View className="pb-3">
            <HomeComposerBar />
          </View>
        }
      />
    </View>
  );
}
