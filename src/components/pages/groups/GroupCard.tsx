import { useRouter } from "expo-router";
import { View } from "react-native";
import { Clock3, Lock, MapPin } from "lucide-react-native";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type { Group } from "@/src/features/groups/types";
import { GroupAvatar } from "./GroupAvatar";
import { GroupJoinButton } from "./GroupJoinButton";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

type GroupCardProps = {
  readonly group: Group;
  readonly showJoin?: boolean;
};

export function GroupCard({ group, showJoin = true }: GroupCardProps) {
  const router = useRouter();
  const isPending = group.status === "pending";

  return (
    <Card
      padding="md"
      className="mb-3 gap-3 border-gray-200 dark:border-dark-400"
      onPress={() => router.push(`/groups/${group.id}` as never)}
      accessibilityRole="button"
      accessibilityLabel={`فتح ملف ${group.name}`}
    >
      <View className="flex-row-reverse items-start gap-3">
        <GroupAvatar name={group.name} imageUrl={group.imageUrl} />

        <View className="flex-1">
          <View className="flex-row-reverse items-center gap-1">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {group.name}
            </Text>
            {group.isVerifiedOrganization ? <VerifiedBadge /> : null}
            {isPending ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-warning-100/60 px-2 py-0.5 dark:bg-dark-350">
                <Clock3 size={10} color="#B45309" strokeWidth={2.5} />
                <Text size="2xs" className="text-warning-300">
                  بانتظار الموافقة
                </Text>
              </View>
            ) : null}
          </View>

          <View className="mt-1 flex-row-reverse items-center gap-2">
            <View className="rounded-full bg-primary-400/10 px-2 py-0.5">
              <Text size="2xs" className="text-primary-400">
                {group.category}
              </Text>
            </View>
            <View className="flex-row-reverse items-center gap-1">
              <MapPin size={11} color="#9CA3AF" strokeWidth={2.25} />
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                {group.location}
              </Text>
            </View>
            {group.visibility === "private" ? (
              <View className="flex-row-reverse items-center gap-1">
                <Lock size={11} color="#9CA3AF" strokeWidth={2.25} />
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                  خاصة
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Text size="xs" numberOfLines={2} className="leading-6 text-gray-600 dark:text-gray-200">
        {group.description}
      </Text>

      <View className="flex-row-reverse items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-dark-400">
        <Text size="2xs" className="flex-1 text-gray-500 dark:text-gray-300">
          {isPending
            ? "لن تظهر المجموعة للآخرين قبل موافقة الإدارة."
            : `${formatCount(group.membersCount)} عضو · ${formatCount(group.postsThisWeek)} منشور هذا الأسبوع`}
        </Text>

        {isPending ? null : (
          <GroupJoinButton group={group} readOnlyWhenMember={!showJoin} />
        )}
      </View>
    </Card>
  );
}

