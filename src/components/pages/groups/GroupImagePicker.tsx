import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, View } from "react-native";
import { useColorScheme } from "nativewind";
import { ImagePlus, X } from "lucide-react-native";
import Text from "@/src/components/ui/Text";
import type { MediaUploadFile } from "@/src/features/media/types";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

type GroupImagePickerProps = {
  readonly image: MediaUploadFile | null;
  readonly onChange: (image: MediaUploadFile | null) => void;
  readonly label?: string;
  readonly hint?: string;
  readonly cover?: boolean;
};

export function GroupImagePicker({ image, onChange, label = "صورة الفريق", hint, cover = false }: GroupImagePickerProps) {
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      toast.error("اسمح للتطبيق بالوصول إلى الصور لاختيار صورة الفريق.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: cover ? [16, 9] : [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    onChange({ uri: asset.uri, name: asset.fileName ?? `group-${Date.now()}.jpg`, type: asset.mimeType ?? "image/jpeg" });
  };

  return (
    <View className="flex-row-reverse items-center gap-3">
      <Pressable onPress={pick} accessibilityRole="button" className={`${cover ? "h-20 w-32" : "size-20"} items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary-400/40 bg-primary-100 dark:bg-dark-350`}>
        {image ? <Image source={{ uri: image.uri }} className="size-full" resizeMode="cover" /> : <ImagePlus size={22} color={primaryColor} strokeWidth={2} />}
      </Pressable>
      <View className="flex-1 gap-1">
        <Text size="xs" weight="semibold">{label}</Text>
        <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">{hint ?? (image ? "تم اختيار الصورة ويمكن تغييرها." : "اختيارية ويمكن إضافتها الآن أو لاحقاً.")}</Text>
        <View className="mt-1 flex-row-reverse items-center gap-3">
          <Pressable onPress={pick} hitSlop={6}><Text size="2xs" weight="medium" className="text-primary-400">{image ? "تغيير الصورة" : "اختيار صورة"}</Text></Pressable>
          {image ? <Pressable onPress={() => onChange(null)} hitSlop={6} className="flex-row-reverse items-center gap-1"><X size={11} color="#9CA3AF" /><Text size="2xs" className="text-gray-500">إزالة</Text></Pressable> : null}
        </View>
      </View>
    </View>
  );
}
