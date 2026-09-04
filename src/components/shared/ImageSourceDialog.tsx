import { Camera, Image as ImageIcon, Trash2 } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import Dialog from "@/src/components/ui/Dialog";
import Text from "@/src/components/ui/Text";
import { getPrimaryColor } from "@/src/theme";

type ImageSourceDialogProps = {
  visible: boolean;
  onClose: () => void;
  onChooseGallery: () => void;
  onTakePhoto: () => void;
  title?: string;
  disabled?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
};

export function ImageSourceDialog({
  visible,
  onClose,
  onChooseGallery,
  onTakePhoto,
  title = "اختيار مصدر الصورة",
  disabled = false,
  onRemove,
  removeLabel = "حذف الصورة الحالية",
}: ImageSourceDialogProps) {
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  return (
    <Dialog visible={visible} title={title} onClose={onClose} showCloseButton cancelable={!disabled}>
      <View className="gap-3">
        <Pressable
          onPress={onChooseGallery}
          disabled={disabled}
          className="flex-row-reverse items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 disabled:opacity-50 dark:border-dark-400"
          accessibilityRole="button"
          accessibilityLabel="اختيار صورة من المعرض"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-400/10">
            <ImageIcon size={20} color={primaryColor} />
          </View>
          <View className="flex-1 items-end">
            <Text size="sm" weight="semibold">اختيار من المعرض</Text>
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">اختر صورة موجودة على جهازك</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onTakePhoto}
          disabled={disabled}
          className="flex-row-reverse items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 disabled:opacity-50 dark:border-dark-400"
          accessibilityRole="button"
          accessibilityLabel="التقاط صورة بالكاميرا"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-400/10">
            <Camera size={20} color={primaryColor} />
          </View>
          <View className="flex-1 items-end">
            <Text size="sm" weight="semibold">التقاط صورة</Text>
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">استخدم كاميرا الجهاز لالتقاط صورة جديدة</Text>
          </View>
        </Pressable>

        {onRemove ? (
          <Pressable
            onPress={onRemove}
            disabled={disabled}
            className="flex-row-reverse items-center gap-3 rounded-2xl border border-error-300/25 px-4 py-4 disabled:opacity-50"
            accessibilityRole="button"
            accessibilityLabel={removeLabel}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-error-300/10">
              <Trash2 size={20} color="#DC2626" />
            </View>
            <Text size="sm" weight="semibold" className="flex-1 text-right text-error-300">{removeLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </Dialog>
  );
}
