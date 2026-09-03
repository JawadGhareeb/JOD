import { useState } from "react";
import { View } from "react-native";
import Button from "@/src/components/ui/Button";
import Text from "@/src/components/ui/Text";
import { useJoinGroup, useLeaveGroup } from "@/src/features/groups/queries";
import type { Group } from "@/src/features/groups/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { GroupJoinDialog } from "./GroupJoinDialog";

type GroupJoinButtonProps = {
  readonly group: Group;
  readonly size?: "small" | "medium";
  readonly fullWidth?: boolean;
  /** Label while the viewer is already a member — pressing it leaves the group. */
  readonly memberLabel?: string;
  /** Renders a static "عضو" chip instead of a leave button. */
  readonly readOnlyWhenMember?: boolean;
};

/**
 * Shared by the group card and the group profile so joining behaves identically
 * in both places — rules must be acknowledged before joining, never before
 * leaving.
 */
export function GroupJoinButton({
  group,
  size = "small",
  fullWidth = false,
  memberLabel = "عضو",
  readOnlyWhenMember = false,
}: GroupJoinButtonProps) {
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const join = useJoinGroup();
  const leave = useLeaveGroup();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const isMember = group.isMember;
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
      onSuccess: () => toast.success(`انضممت إلى ${group.name}.`),
      onError: () => toast.error("تعذر إتمام الانضمام. حاول مرة أخرى."),
    });
  };

  if (isMember && readOnlyWhenMember) {
    return (
      <View className="rounded-full bg-primary-400/10 px-3 py-1">
        <Text size="2xs" weight="medium" className="text-primary-400">
          عضو
        </Text>
      </View>
    );
  }

  return (
    <>
      <Button
        size={size}
        fullWidth={fullWidth}
        variant={isMember ? "tertiary" : "primary"}
        loading={isBusy}
        disabled={isBusy}
        onPress={handlePress}
        accessibilityLabel={isMember ? `مغادرة ${group.name}` : `الانضمام إلى ${group.name}`}
        accessibilityState={{ selected: isMember, disabled: isBusy }}
      >
        {isMember ? memberLabel : "انضمام"}
      </Button>

      <GroupJoinDialog
        group={group}
        visible={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onConfirm={confirmJoin}
      />
    </>
  );
}
