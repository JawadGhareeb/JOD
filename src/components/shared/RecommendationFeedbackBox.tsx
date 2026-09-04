import { useState } from "react";
import { Check, X } from "lucide-react-native";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import Text from "@/src/components/ui/Text";
import { useRecommendationFeedback } from "@/src/features/personalization/queries";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";

type Props = {
  contentType: "post" | "campaign" | "media" | "article";
  contentId: string;
  visible?: boolean;
};

export function RecommendationFeedbackBox({ contentType, contentId, visible = true }: Props) {
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const mutation = useRecommendationFeedback();
  const [answered, setAnswered] = useState(false);

  if (!visible || answered) return null;

  const send = async (event: GestureResponderEvent, action: "interested" | "not_interested") => {
    event.stopPropagation();
    if (!requireAuth() || mutation.isPending) return;
    try {
      await mutation.mutateAsync({ contentType, contentId, action });
      setAnswered(true);
      toast.success(action === "interested" ? "سنقترح لك محتوى مشابهاً أكثر." : "سنقلل ظهور المحتوى المشابه.", "تم تحديث تفضيلاتك");
    } catch {
      toast.error("تعذر حفظ تفضيلك الآن. حاول مرة أخرى.");
    }
  };

  return (
    <View className="mt-3 rounded-2xl border border-primary-200 bg-primary-50 p-3 dark:border-primary-400/25 dark:bg-primary-400/10">
      <Text size="xs" weight="semibold" rtlAlign="right">هل هذا المحتوى يهمك؟</Text>
      <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300" rtlAlign="right">إجابتك تساعد جود على تحسين الاقتراحات القادمة.</Text>
      <View className="mt-3 flex-row-reverse gap-2">
        <Pressable onPress={(event) => void send(event, "interested")} disabled={mutation.isPending} className="flex-1 flex-row-reverse items-center justify-center gap-2 rounded-xl bg-primary-400 px-3 py-2" accessibilityRole="button" accessibilityLabel="مهتم بهذا المحتوى">
          <Check size={16} color="#FFFFFF" strokeWidth={2.7} />
          <Text size="xs" weight="semibold" className="text-white">مهتم</Text>
        </Pressable>
        <Pressable onPress={(event) => void send(event, "not_interested")} disabled={mutation.isPending} className="flex-1 flex-row-reverse items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-dark-400 dark:bg-dark-500" accessibilityRole="button" accessibilityLabel="غير مهتم بهذا المحتوى">
          <X size={16} color="#9CA3AF" strokeWidth={2.7} />
          <Text size="xs" weight="semibold" className="text-gray-600 dark:text-gray-200">غير مهتم</Text>
        </Pressable>
      </View>
    </View>
  );
}
