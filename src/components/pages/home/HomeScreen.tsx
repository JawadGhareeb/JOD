import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { useAuthStatus } from "@/src/features/auth/queries";
import { usePersonalizationProfile } from "@/src/features/personalization/queries";
import type { PersonalizedFeedType } from "@/src/features/personalization/types";
import { HomeComposerBar } from "./HomeComposerBar";
import { HomeFeed } from "./HomeFeed";
import { HomeFeedTypeTabs } from "./HomeFeedTypeTabs";

export function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();
  const personalization = usePersonalizationProfile(isAuthenticated);
  const [feedType, setFeedType] = useState<PersonalizedFeedType>("for_you");
  const { onScroll, resetHeader } = useCollapsibleHeaderScreen();

  useEffect(() => {
    if (isAuthenticated && personalization.data && !personalization.data.onboardingCompleted) router.replace("/personalization");
  }, [isAuthenticated, personalization.data, router]);

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <HomeFeed
        audience={isAuthenticated ? undefined : "general"}
        feedType={feedType}
        onScroll={onScroll}
        onRefresh={resetHeader}
        listHeaderComponent={
          <View className="pb-3">
            {isAuthenticated && personalization.data?.onboardingCompleted ? (
              <HomeFeedTypeTabs value={feedType} onChange={setFeedType} />
            ) : null}
            <HomeComposerBar />
          </View>
        }
      />
    </View>
  );
}
