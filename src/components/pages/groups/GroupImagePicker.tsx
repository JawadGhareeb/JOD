import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { useColorScheme } from "nativewind";
import { ImagePlus, X } from "lucide-react-native";
import { ImageSourceDialog } from "@/src/components/shared/ImageSourceDialog";
import Text from "@/src/components/ui/Text";
import type { MediaUploadFile } from "@/src/features/media/types";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type GroupImagePickerProps = {
  readonly image: MediaUploadFile | null;
  readonly onChange: (image: MediaUploadFile | null) => void;
  readonly label?: string;
  readonly hint?: string;
};

export function GroupImagePicker({ image, onChange, label = "شعار الفريق", hint }: GroupImagePickerProps) {
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false);

  const applyAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const mime = asset.mimeType?.toLowerCase();
    const typeAllowed = !mime || mime === "image/jpeg" || mime === "image/png" || mime === "image/webp";
    const sizeAllowed = !asset.fileSize || asset.fileSize <= MAX_IMAGE_BYTES;
    if (!typeAllowed || !sizeAllowed) {
      toast.error("يجب أن يكون شعار الفريق JPEG أو PNG أو WebP وبحجم لا يتجاوز 5MB.");
      return;
    }
    onChange({
      uri: asset.uri,
      name: asset.fileName ?? `group-logo-${Date.now()}.jpg`,
      type: asset.mimeType ?? "image/jpeg",
    });
  };

  const chooseFromGallery = async () => {
    setSourceDialogOpen(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      toast.error("اسمح للتطبيق بالوصول إلى الصور لاختيار شعار الفريق.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    applyAsset(result.assets[0]);
  };

  const takePhoto = async () => {
    setSourceDialogOpen(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      toast.error("اسمح للتطبيق باستخدام الكاميرا لالتقاط شعار الفريق.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    applyAsset(result.assets[0]);
  };

  const openSourceDialog = () => setSourceDialogOpen(true);

  return (
    <>
      <View className="flex-row-reverse items-center gap-3">
        <Pressable
          onPress={openSourceDialog}
          accessibilityRole="button"
          accessibilityLabel="اختيار شعار الفريق"
          className="size-20 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary-400/40 bg-primary-100 dark:bg-dark-350"
        >
          {image ? <Image source={{ uri: image.uri }} className="size-full" resizeMode="cover" /> : <ImagePlus size={22} color={primaryColor} strokeWidth={2} />}
        </Pressable>
        <View className="flex-1 gap-1">
          <Text size="xs" weight="semibold">{label}</Text>
          <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">{hint ?? (image ? "تم اختيار الشعار ويمكن تغييره." : "اختر شعاراً واضحاً للفريق.")}</Text>
          <View className="mt-1 flex-row-reverse items-center gap-3">
            <Pressable onPress={openSourceDialog} hitSlop={6}>
              <Text size="2xs" weight="medium" className="text-primary-400">{image ? "تغيير الصورة" : "اختيار صورة"}</Text>
            </Pressable>
            {image ? (
              <Pressable onPress={() => onChange(null)} hitSlop={6} className="flex-row-reverse items-center gap-1">
                <X size={11} color="#9CA3AF" />
                <Text size="2xs" className="text-gray-500">إزالة</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      <ImageSourceDialog
        visible={sourceDialogOpen}
        title="شعار الفريق"
        onClose={() => setSourceDialogOpen(false)}
        onChooseGallery={() => void chooseFromGallery()}
        onTakePhoto={() => void takePhoto()}
        onRemove={image ? () => { onChange(null); setSourceDialogOpen(false); } : undefined}
        removeLabel="إزالة شعار الفريق"
      />
    </>
  );
}
