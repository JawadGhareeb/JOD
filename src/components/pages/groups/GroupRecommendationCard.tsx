import { useRouter } from "expo-router";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { HeartHandshake, MapPin, Sparkles, UsersRound } from "lucide-react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type {
  GroupRecommendation,
  GroupRecommendationKind,
} from "@/src/features/groups/types";
import { getPrimaryColor } from "@/src/theme";

const MUTED = "#9CA3AF";

const KIND_LABELS: Record<GroupRecommendationKind, string> = {
  group: "فريق تطوعي",
  opportunity: "فرصة",
  campaign: "حملة",
};

type GroupRecommendationCardProps = {
  readonly recommendation: GroupRecommendation;
};

/**
 * A single "because of this group" suggestion. Only group rows are navigable —
 * the rest stay inert until opportunities and campaigns are linked to groups.
 */
export function GroupRecommendationCard({ recommendation }: GroupRecommendationCardProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  const targetGroupId = recommendation.targetGroupId;
  const openTarget = targetGroupId
    ? () => router.push(`/groups/${targetGroupId}` as never)
    : undefined;

  return (
    <Card
      padding="md"
      className="mb-3 gap-3 border-gray-200 dark:border-dark-400"
      onPress={openTarget}
      accessibilityRole={openTarget ? "button" : undefined}
      accessibilityLabel={openTarget ? `فتح ملف ${recommendation.title}` : undefined}
    >
      <View className="flex-row-reverse items-start gap-3">
        <View className="size-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
          <RecommendationIcon kind={recommendation.kind} color={primaryColor} />
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row-reverse items-center gap-2">
            <Text size="xs" weight="semibold" className="flex-1 text-dark-100 dark:text-light-50">
              {recommendation.title}
            </Text>
            <View className="rounded-full bg-primary-400/10 px-2 py-0.5">
              <Text size="2xs" className="text-primary-400">
                {KIND_LABELS[recommendation.kind]}
              </Text>
            </View>
          </View>

          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            {recommendation.subtitle}
          </Text>

          <View className="mt-0.5 flex-row-reverse items-center gap-3">
            <View className="flex-row-reverse items-center gap-1">
              <MapPin size={11} color={MUTED} strokeWidth={2.25} />
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                {recommendation.location}
              </Text>
            </View>
            {recommendation.metaLabel ? (
              <Text size="2xs" weight="medium" className="text-primary-400">
                {recommendation.metaLabel}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View className="flex-row-reverse items-center gap-1.5 border-t border-gray-100 pt-2.5 dark:border-dark-400">
        <Sparkles size={11} color={MUTED} strokeWidth={2.25} />
        <Text size="2xs" className="flex-1 text-gray-500 dark:text-gray-300">
          {recommendation.reason}
        </Text>
      </View>
    </Card>
  );
}

function RecommendationIcon({
  kind,
  color,
}: {
  readonly kind: GroupRecommendationKind;
  readonly color: string;
}) {
  if (kind === "group") return <UsersRound size={18} color={color} strokeWidth={2.25} />;
  if (kind === "campaign") return <HeartHandshake size={18} color={color} strokeWidth={2.25} />;
  return <Sparkles size={18} color={color} strokeWidth={2.25} />;
}
