import { Check, UserPlus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import Button from "@/src/components/ui/Button";
import { useFollowPublisher, useUnfollowPublisher } from "@/src/features/follows/queries";
import type { FollowTargetType } from "@/src/features/follows/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

type FollowButtonProps = {
  targetType: FollowTargetType;
  targetId: string;
  isFollowing: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
};

export function FollowButton({
  targetType,
  targetId,
  isFollowing,
  size = "small",
  fullWidth = false,
}: FollowButtonProps) {
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const follow = useFollowPublisher();
  const unfollow = useUnfollowPublisher();
  // Disabling during the request is what prevents a double-tap from firing twice.
  const isPending = follow.isPending || unfollow.isPending;

  const onPress = async () => {
    if (!requireAuth() || isPending) return;
    const mutation = isFollowing ? unfollow : follow;
    try {
      await mutation.mutateAsync({ targetType, targetId });
    } catch {
      toast.error(
        isFollowing ? "تعذر إلغاء المتابعة. حاول مرة أخرى." : "تعذر إتمام المتابعة. حاول مرة أخرى.",
      );
    }
  };

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      variant={isFollowing ? "tertiary" : "primary"}
      loading={isPending}
      disabled={isPending}
      onPress={() => void onPress()}
      accessibilityLabel={isFollowing ? "إلغاء المتابعة" : "متابعة"}
      accessibilityState={{ selected: isFollowing, disabled: isPending }}
      leftIcon={
        isFollowing ? (
          <Check size={15} color={primaryColor} strokeWidth={2.5} />
        ) : (
          <UserPlus size={15} color="#FFFFFF" strokeWidth={2.25} />
        )
      }
    >
      {isFollowing ? "متابَع" : "متابعة"}
    </Button>
  );
}
