import { useState } from "react";
import { View } from "react-native";
import { useRouter, type Href } from "expo-router";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
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

  const showPersonalizationReminder = Boolean(
    isAuthenticated &&
    personalization.data?.onboardingCompleted &&
    (personalization.data.missingFields?.length ?? 0) > 0,
  );

  return (
    <View className="flex-1 bg-light-100 dark:bg-dark-300">
      <HomeFeed
        audience={isAuthenticated ? undefined : "general"}
        feedType={feedType}
        onScroll={onScroll}
        onRefresh={resetHeader}
        listHeaderComponent={
          <View className="gap-3 pb-3">
            {isAuthenticated && personalization.data?.onboardingCompleted ? (
              <HomeFeedTypeTabs value={feedType} onChange={setFeedType} />
            ) : null}
            {showPersonalizationReminder ? (
              <Card padding="md" className="mx-4 gap-2 border-primary-200 bg-primary-50 dark:border-primary-400/30 dark:bg-primary-400/10">
                <Text size="sm" weight="semibold">حسّن الاقتراحات التي تظهر لك</Text>
                <Text size="xs" className="leading-6 text-gray-600 dark:text-gray-300">أكمل بعض تفضيلاتك لتحصل على محتوى ومساعدات أقرب لاهتماماتك. التطبيق يبقى متاحاً بالكامل حتى لو تركتها ناقصة.</Text>
                <Button size="small" variant="tertiary" onPress={() => router.push("/personalization-settings" as Href)}>تخصيص المحتوى</Button>
              </Card>
            ) : null}
            <HomeComposerBar />
          </View>
        }
      />
    </View>
  );
}
