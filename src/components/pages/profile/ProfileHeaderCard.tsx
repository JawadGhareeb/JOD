import { View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import type { ProfileSummary } from "@/src/types/profile";

type ProfileHeaderCardProps = {
  summary: ProfileSummary;
};

const statLabels = {
  postsCount: "المنشورات",
  savedCount: "المحفوظات",
  donationsCount: "تبرعاتي",
} as const;

export function ProfileHeaderCard({ summary }: ProfileHeaderCardProps) {
  const metaParts = [`@${summary.username}`, summary.city].filter(Boolean);

  return (
    <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
      <View className="flex-row-reverse items-start gap-3">
        <Avatar name={summary.name} size={56} />

        <View className="flex-1">
          <View className="flex-row-reverse items-center gap-1">
            <Text weight="semibold" size="base" className="text-dark-100 dark:text-light-50">
              {summary.name}
            </Text>
            {summary.verified ? (
              <Text size="2xs" className="text-primary-400">
                موثق
              </Text>
            ) : null}
          </View>

          {metaParts.length > 0 ? (
            <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
              {metaParts.join(" • ")}
            </Text>
          ) : null}

          {summary.bio ? (
            <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
              {summary.bio}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="mt-4 flex-row-reverse justify-between gap-2 border-t border-gray-100 pt-3 dark:border-dark-400">
        {(Object.keys(statLabels) as (keyof typeof statLabels)[]).map((key) => (
          <View key={key} className="flex-1 items-center rounded-xl bg-primary-100/70 py-2 dark:bg-dark-350">
            <Text weight="semibold" size="sm" className="text-primary-400">
              {summary.stats[key]}
            </Text>
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              {statLabels[key]}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
