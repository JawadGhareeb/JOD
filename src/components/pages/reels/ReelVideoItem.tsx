import { useEffect, useMemo, useState } from "react";
import { Heart, Bookmark, Flag, Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "@/src/components/shared/Avatar";
import { VideoPlayer } from "@/src/components/shared/VideoPlayer";
import Dialog from "@/src/components/ui/Dialog";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { useReportReasons } from "@/src/features/lookups/queries";
import type { ReportReasonCode } from "@/src/features/lookups/types";
import { useLikeMedia, useReportMedia, useSaveMedia } from "@/src/features/media/queries";
import type { PublicMediaItem } from "@/src/features/media/types";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";

export function ReelVideoItem({
  video,
  active,
  height,
  onPlayRequest,
}: {
  video: PublicMediaItem;
  active: boolean;
  height: number;
  onPlayRequest: () => void;
}) {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const likeMutation = useLikeMedia();
  const saveMutation = useSaveMedia();
  const reportMutation = useReportMedia();
  const reportReasons = useReportReasons();
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [likesCount, setLikesCount] = useState(video.likesCount ?? 0);
  const [isSaved, setIsSaved] = useState(video.isSaved);
  const [reportPickerOpen, setReportPickerOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReasonCode | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [customReportOpen, setCustomReportOpen] = useState(false);

  useEffect(() => {
    setIsLiked(video.isLiked);
    setLikesCount(video.likesCount ?? 0);
    setIsSaved(video.isSaved);
  }, [video.isLiked, video.isSaved, video.likesCount]);

  const reportOptions = useMemo<SelectionOption[]>(
    () =>
      (reportReasons.data ?? []).map((reason) => ({
        label: reason.label,
        value: reason.code,
        hint: reason.hint,
      })),
    [reportReasons.data],
  );

  const toggleLike = async () => {
    if (!requireAuth() || likeMutation.isPending) return;
    const next = !isLiked;
    try {
      const result = await likeMutation.mutateAsync({ mediaId: video.id, like: next });
      setIsLiked(Boolean(result.isLiked));
      setLikesCount(result.likesCount ?? likesCount);
    } catch {
      toast.error("تعذر تحديث الإعجاب. حاول مرة أخرى.", "حدث خطأ");
    }
  };

  const toggleSave = async () => {
    if (!requireAuth() || saveMutation.isPending) return;
    const next = !isSaved;
    try {
      const result = await saveMutation.mutateAsync({ mediaId: video.id, save: next });
      setIsSaved(Boolean(result.isSaved));
      toast.success(next ? "تم حفظ الريل." : "تمت إزالة الريل من المحفوظات.");
    } catch {
      toast.error("تعذر تحديث الحفظ. حاول مرة أخرى.", "حدث خطأ");
    }
  };

  const chooseReportReason = (value: string) => {
    const reason = value as ReportReasonCode;
    setReportPickerOpen(false);
    if (reason === "other") {
      setSelectedReason(reason);
      setCustomReportOpen(true);
      return;
    }
    void submitReport(reason);
  };

  const submitReport = async (reason: ReportReasonCode, details?: string) => {
    if (!requireAuth() || reportMutation.isPending) return;
    try {
      await reportMutation.mutateAsync({ mediaId: video.id, reason, details });
      setCustomReportOpen(false);
      setCustomReason("");
      setSelectedReason(null);
      toast.success("تم إرسال البلاغ للمراجعة.", "تم استلام البلاغ");
    } catch {
      toast.error("تعذر إرسال البلاغ. حاول مرة أخرى.", "حدث خطأ");
    }
  };

  const organizationName = video.organization?.name || "منظمة على جود";
  const organizationImage = video.organization?.image || video.organization?.logo?.url || null;

  return (
    <View style={{ height }} className="bg-light-100 px-3 pb-3 dark:bg-dark-300">
      <View className="flex-1 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500">
        <View className="flex-row-reverse items-center justify-between px-4 py-3">
          <Pressable
            onPress={() => video.organization?.id && router.push(`/author/${video.organization.id}` as never)}
            className="flex-row-reverse items-center gap-2"
            accessibilityRole="button"
          >
            <Avatar name={organizationName} imageUrl={organizationImage} size={42} />
            <View className="items-end">
              <View className="flex-row-reverse items-center gap-1">
                <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                  {organizationName}
                </Text>
                <Check size={14} color={PRIMARY_COLOR_LIGHT} strokeWidth={2.7} />
              </View>
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">فيديو من جود</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              if (!requireAuth()) return;
              setReportPickerOpen(true);
            }}
            className="size-9 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-350"
            accessibilityLabel="الإبلاغ عن الريل"
          >
            <Flag size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        <View className="min-h-0 flex-1 bg-dark-500">
          <VideoPlayer
            url={video.url}
            active={active}
            onRequestPlay={onPlayRequest}
            loop
            showProgressControls
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        <View className="px-4 py-3">
          {video.description ? (
            <Text size="sm" className="mb-3 text-dark-100 dark:text-light-50" numberOfLines={3}>
              {video.description}
            </Text>
          ) : null}
          <View className="flex-row-reverse items-center gap-5 border-t border-gray-100 pt-3 dark:border-dark-400">
            <Pressable onPress={toggleLike} className="flex-row-reverse items-center gap-1.5" disabled={likeMutation.isPending}>
              <Heart
                size={22}
                color={isLiked ? "#E5484D" : "#9CA3AF"}
                fill={isLiked ? "#E5484D" : "transparent"}
              />
              <Text size="xs" className={isLiked ? "text-error-300" : "text-gray-500 dark:text-gray-300"}>
                {likesCount > 0 ? likesCount : "إعجاب"}
              </Text>
            </Pressable>
            <Pressable onPress={toggleSave} className="flex-row-reverse items-center gap-1.5" disabled={saveMutation.isPending}>
              <Bookmark size={21} color={isSaved ? PRIMARY_COLOR_LIGHT : "#9CA3AF"} fill={isSaved ? PRIMARY_COLOR_LIGHT : "transparent"} />
              <Text size="xs" className={isSaved ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}>
                {isSaved ? "محفوظ" : "حفظ"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (!requireAuth()) return;
                setReportPickerOpen(true);
              }}
              className="flex-row-reverse items-center gap-1.5"
            >
              <Flag size={20} color="#9CA3AF" />
              <Text size="xs" className="text-gray-500 dark:text-gray-300">إبلاغ</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <SelectionModal
        visible={reportPickerOpen}
        onClose={() => setReportPickerOpen(false)}
        title="سبب الإبلاغ"
        options={reportOptions}
        selectedValue={selectedReason ?? undefined}
        onSelect={chooseReportReason}
      />

      <Dialog
        visible={customReportOpen}
        title="سبب آخر"
        cancelable={!reportMutation.isPending}
        onClose={() => !reportMutation.isPending && setCustomReportOpen(false)}
        buttons={[
          { text: "إلغاء", variant: "outline", onPress: () => setCustomReportOpen(false) },
          {
            text: "إرسال البلاغ",
            loading: reportMutation.isPending,
            onPress: () => {
              const details = customReason.trim();
              if (details.length < 3) {
                toast.error("اكتب سبباً من 3 أحرف على الأقل.");
                return;
              }
              void submitReport("other", details);
            },
          },
        ]}
      >
        <View className="gap-3">
          <Text size="xs" className="text-center text-gray-500 dark:text-gray-300">اكتب باختصار سبب الإبلاغ عن هذا الريل.</Text>
          <Input value={customReason} onChangeText={setCustomReason} placeholder="اكتب سبب الإبلاغ..." multiline />
        </View>
      </Dialog>
    </View>
  );
}
