import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { useAuthStatus } from "@/src/features/auth/queries";
import { usePersonalizationProfile } from "@/src/features/personalization/queries";
import { HomeComposerBar } from "./HomeComposerBar";
import { HomeFeed } from "./HomeFeed";

export function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();
  const personalization = usePersonalizationProfile(isAuthenticated);
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();

  useEffect(() => {
    if (isAuthenticated && personalization.data && !personalization.data.onboardingCompleted) router.replace("/personalization");
  }, [isAuthenticated, personalization.data, router]);

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
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
    </View>
  );
}
