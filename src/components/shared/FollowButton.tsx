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
  appearance?: "default" | "overlay";
};

export function FollowButton({
  targetType,
  targetId,
  isFollowing,
  size = "small",
  fullWidth = false,
  appearance = "default",
}: FollowButtonProps) {
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const follow = useFollowPublisher();
  const unfollow = useUnfollowPublisher();
  const isPending = follow.isPending || unfollow.isPending;
  const isOverlay = appearance === "overlay";

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
      variant={isOverlay ? "primary" : isFollowing ? "tertiary" : "primary"}
      style={isOverlay ? { alignSelf: "center" } : undefined}
      className={isOverlay ? "h-8 min-h-0 min-w-[72px] rounded-lg border border-white/80 bg-black/20 px-2.5 py-0 shadow-none" : undefined}
      loading={isPending}
      disabled={isPending}
      onPress={() => void onPress()}
      accessibilityLabel={isFollowing ? "إلغاء المتابعة" : "متابعة"}
      accessibilityState={{ selected: isFollowing, disabled: isPending }}
      leftIcon={
        isOverlay ? undefined : isFollowing ? (
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
