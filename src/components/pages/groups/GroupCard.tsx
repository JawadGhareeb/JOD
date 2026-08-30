import { useState } from "react";
import { View } from "react-native";
import { Lock, MapPin } from "lucide-react-native";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import type { Group } from "@/src/features/groups/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

export function GroupCard({ group, showJoin = true }: { group: Group; showJoin?: boolean }) {
  const { requireAuth } = useAuthGuard();
  // Local-only until the join endpoint exists.
  const [isMember, setIsMember] = useState(group.isMember);

  const toggleMembership = () => {
    if (!requireAuth()) return;
    setIsMember((current) => !current);
  };

  return (
    <Card padding="md" className="mb-3 gap-3 border-gray-200 dark:border-dark-400">
      <View className="flex-row-reverse items-start gap-3">
        <View className="size-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
          <Text weight="bold" size="base" className="text-primary-400">
            {group.name.charAt(0)}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row-reverse items-center gap-1">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {group.name}
            </Text>
            {group.isVerifiedOrganization ? <VerifiedBadge /> : null}
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
          {formatCount(group.membersCount)} عضو · {formatCount(group.postsThisWeek)} منشور هذا الأسبوع
        </Text>

        {showJoin ? (
          <Button
            size="small"
            variant={isMember ? "tertiary" : "primary"}
            onPress={toggleMembership}
            accessibilityLabel={isMember ? `مغادرة ${group.name}` : `الانضمام إلى ${group.name}`}
            accessibilityState={{ selected: isMember }}
          >
            {isMember ? "عضو" : group.visibility === "private" ? "طلب انضمام" : "انضمام"}
          </Button>
        ) : (
          <View className="rounded-full bg-primary-400/10 px-3 py-1">
            <Text size="2xs" weight="medium" className="text-primary-400">
              عضو
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}
