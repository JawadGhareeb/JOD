import { View } from "react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import {
  GROUP_ROLE_LABELS,
  type GroupMember,
  type GroupProfile,
} from "@/src/features/groups/types";

type GroupAboutSectionProps = {
  readonly group: GroupProfile;
};

export function GroupAboutSection({ group }: GroupAboutSectionProps) {
  const staff = [group.owner, ...group.admins];

  return (
    <View className="gap-3">
      <Card padding="lg" className="gap-2 border-gray-200 dark:border-dark-400">
        <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
          عن المجموعة
        </Text>
        <Text size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
          {group.description}
        </Text>
      </Card>

      <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
        <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
          قوانين المجموعة
        </Text>
        <View className="gap-2">
          {group.rules.map((rule, index) => (
            <View key={rule} className="flex-row-reverse items-start gap-2">
              <Text size="2xs" weight="semibold" className="text-primary-400">
                {index + 1}.
              </Text>
              <Text size="2xs" className="flex-1 leading-5 text-gray-600 dark:text-gray-200">
                {rule}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
        <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
          فريق الإدارة
        </Text>
        <View className="gap-3">
          {staff.map((member) => (
            <StaffRow key={member.id} member={member} />
          ))}
        </View>
      </Card>
    </View>
  );
}

function StaffRow({ member }: { readonly member: GroupMember }) {
  return (
    <View className="flex-row-reverse items-center gap-2">
      <Avatar name={member.name} imageUrl={member.avatarUrl} size={34} />
      <View className="flex-1">
        <Text size="xs" weight="medium" className="text-dark-100 dark:text-light-50">
          {member.name}
        </Text>
        <Text size="2xs" className="text-gray-500 dark:text-gray-300">
          @{member.username}
        </Text>
      </View>
      <View className="rounded-full bg-primary-400/10 px-2.5 py-1">
        <Text size="2xs" weight="medium" className="text-primary-400">
          {GROUP_ROLE_LABELS[member.role]}
        </Text>
      </View>
    </View>
  );
}
