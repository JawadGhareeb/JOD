import { Image, View } from "react-native";
import { CalendarDays, Globe2, Lock, MapPin, Users } from "lucide-react-native";
import { Avatar } from "@/src/components/shared/Avatar";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Text from "@/src/components/ui/Text";
import { GROUP_ROLE_LABELS, type GroupProfile } from "@/src/features/groups/types";
import { GroupAvatar } from "./GroupAvatar";
import { GroupJoinButton } from "./GroupJoinButton";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

const MUTED = "#9CA3AF";

type GroupProfileHeaderProps = {
  readonly group: GroupProfile;
};

export function GroupProfileHeader({ group }: GroupProfileHeaderProps) {
  const isPending = group.status === "pending";

  return (
    <View className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500">
      <GroupCover imageUrl={group.coverImageUrl} />

      <View className="gap-3 p-4">
        <View className="-mt-10 flex-row-reverse items-end justify-between gap-3">
          <View className="rounded-2xl border-4 border-white dark:border-dark-500">
            <GroupAvatar name={group.name} imageUrl={group.imageUrl} size={72} />
          </View>
          {group.myRole ? (
            <View className="mb-1 rounded-full bg-primary-400/10 px-3 py-1">
              <Text size="2xs" weight="semibold" className="text-primary-400">
                دورك: {GROUP_ROLE_LABELS[group.myRole]}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-1">
          <View className="flex-row-reverse items-center gap-1">
            <Text weight="bold" size="lg" className="text-dark-100 dark:text-light-50">
              {group.name}
            </Text>
            {group.isVerifiedOrganization ? <VerifiedBadge /> : null}
          </View>
          {group.organizationName ? (
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              تديرها {group.organizationName}
            </Text>
          ) : null}
        </View>

        <View className="flex-row-reverse flex-wrap items-center gap-2">
          <View className="rounded-full bg-primary-400/10 px-2.5 py-1">
            <Text size="2xs" className="text-primary-400">
              {group.category}
            </Text>
          </View>
          <MetaChip icon={<MapPin size={11} color={MUTED} strokeWidth={2.25} />} label={group.location} />
          <MetaChip
            icon={
              group.visibility === "private" ? (
                <Lock size={11} color={MUTED} strokeWidth={2.25} />
              ) : (
                <Globe2 size={11} color={MUTED} strokeWidth={2.25} />
              )
            }
            label={group.visibility === "private" ? "مجموعة خاصة" : "مجموعة عامة"}
          />
          <MetaChip
            icon={<CalendarDays size={11} color={MUTED} strokeWidth={2.25} />}
            label={group.createdAtLabel}
          />
        </View>

        <View className="flex-row-reverse items-center gap-4 border-y border-gray-100 py-3 dark:border-dark-400">
          <Stat value={formatCount(group.membersCount)} label="عضو" />
          <Stat value={formatCount(group.postsCount)} label="منشور" />
          <Stat value={formatCount(group.postsThisWeek)} label="هذا الأسبوع" />
        </View>

        <MembersPreview group={group} />

        {isPending ? (
          <View className="rounded-xl bg-warning-100/50 p-3 dark:bg-dark-350">
            <Text size="2xs" className="leading-5 text-warning-300">
              طلب إنشاء هذه المجموعة قيد المراجعة. لن تظهر للآخرين قبل موافقة الإدارة.
            </Text>
          </View>
        ) : (
          <GroupJoinButton group={group} size="medium" fullWidth memberLabel="مغادرة المجموعة" />
        )}
      </View>
    </View>
  );
}

function GroupCover({ imageUrl }: { readonly imageUrl: string | null }) {
  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} className="h-28 w-full" resizeMode="cover" />;
  }
  return <View className="h-28 w-full bg-primary-400/15 dark:bg-dark-350" />;
}

function MetaChip({ icon, label }: { readonly icon: React.ReactNode; readonly label: string }) {
  return (
    <View className="flex-row-reverse items-center gap-1">
      {icon}
      <Text size="2xs" className="text-gray-500 dark:text-gray-300">
        {label}
      </Text>
    </View>
  );
}

function Stat({ value, label }: { readonly value: string; readonly label: string }) {
  return (
    <View className="flex-row-reverse items-baseline gap-1">
      <Text weight="bold" size="sm" className="text-dark-100 dark:text-light-50">
        {value}
      </Text>
      <Text size="2xs" className="text-gray-500 dark:text-gray-300">
        {label}
      </Text>
    </View>
  );
}

function MembersPreview({ group }: { readonly group: GroupProfile }) {
  const remaining = group.membersCount - group.membersPreview.length;

  return (
    <View className="flex-row-reverse items-center gap-2">
      <View className="flex-row-reverse">
        {group.membersPreview.map((member, index) => (
          <View
            key={member.id}
            style={{ marginRight: index === 0 ? 0 : -10 }}
            className="rounded-full border-2 border-white dark:border-dark-500"
          >
            <Avatar name={member.name} imageUrl={member.avatarUrl} size={26} />
          </View>
        ))}
      </View>
      <Users size={12} color={MUTED} strokeWidth={2.25} />
      <Text size="2xs" className="flex-1 text-gray-500 dark:text-gray-300">
        {remaining > 0 ? `و${formatCount(remaining)} عضو آخر` : "كل الأعضاء"}
      </Text>
    </View>
  );
}
