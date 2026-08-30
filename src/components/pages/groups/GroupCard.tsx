import { useState } from "react";
import { View } from "react-native";
import { Clock3, Lock, MapPin } from "lucide-react-native";
import { VerifiedBadge } from "@/src/components/shared/VerifiedBadge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { useJoinGroup, useLeaveGroup } from "@/src/features/groups/queries";
import type { Group } from "@/src/features/groups/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { GroupJoinDialog } from "./GroupJoinDialog";

const formatCount = (value: number) => value.toLocaleString("ar-SY");

export function GroupCard({ group, showJoin = true }: { group: Group; showJoin?: boolean }) {
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const join = useJoinGroup();
  const leave = useLeaveGroup();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const isMember = group.isMember;
  const isPending = group.status === "pending";
  const isBusy = join.isPending || leave.isPending;

  const handlePress = () => {
    if (!requireAuth() || isBusy) return;
    // Leaving needs no rules acknowledgement — only joining does.
    if (isMember) {
      leave.mutate(group.id);
      return;
    }
    setIsJoinDialogOpen(true);
  };

  const confirmJoin = () => {
    setIsJoinDialogOpen(false);
    join.mutate(group.id, {
      onSuccess: () =>
        toast.success(
          group.visibility === "private"
            ? "تم إرسال طلب الانضمام. بانتظار موافقة المشرفين."
            : `انضممت إلى ${group.name}.`,
        ),
      onError: () => toast.error("تعذر إتمام الانضمام. حاول مرة أخرى."),
    });
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

        {isPending ? null : showJoin ? (
          <Button
            size="small"
            variant={isMember ? "tertiary" : "primary"}
            loading={isBusy}
            disabled={isBusy}
            onPress={handlePress}
            accessibilityLabel={isMember ? `مغادرة ${group.name}` : `الانضمام إلى ${group.name}`}
            accessibilityState={{ selected: isMember, disabled: isBusy }}
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

      <GroupJoinDialog
        group={group}
        visible={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onConfirm={confirmJoin}
      />
    </Card>
  );
}
