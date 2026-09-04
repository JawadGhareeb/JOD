import { useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { FileText, Mail, MapPin, Pencil, Phone } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import { ImageSourceDialog } from "@/src/components/shared/ImageSourceDialog";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { useCities } from "@/src/features/lookups/queries";
import { useUpdateProfile } from "@/src/features/account/queries";
import { useAuthStatus, useRemoveAvatar, useUpdateAvatar } from "@/src/features/auth/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { useToast } from "@/src/providers/ToastProvider";
import { MenuPageHeader } from "./MenuPageHeader";

const UserIcon = appIcons.profile;
const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

export function EditInformationScreen() {
  const { user, isLoading } = useAuthStatus();
  const toast = useToast();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();
  const removeAvatarMutation = useRemoveAvatar();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isAvatarSourceDialogOpen, setIsAvatarSourceDialogOpen] = useState(false);
  const citiesQuery = useCities();
  const cityOptions: SelectionOption[] = useMemo(
    () => (citiesQuery.data ?? []).map((item) => ({ label: item.name, value: item.name })),
    [citiesQuery.data],
  );

  useEffect(() => {
    if (!user) return;
    setFullName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phone ?? "");
    setCity(user.city ?? "");
    setBio(user.bio ?? "");
  }, [user]);

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const isPhoneValid = phoneNumber.trim().length === 0 || phoneNumber.trim().length >= 8;
  const canSave = fullName.trim().length > 2 && isEmailValid && isPhoneValid && !updateProfileMutation.isPending;

  const uploadAvatarAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      await updateAvatarMutation.mutateAsync({
        uri: asset.uri,
        name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
      });
      toast.success("تم تحديث صورة الملف الشخصي.");
    } catch {
      toast.error("تعذر تحديث صورة الملف الشخصي.");
    }
  };

  const chooseAvatarFromGallery = async () => {
    setIsAvatarSourceDialogOpen(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      toast.error("اسمح للتطبيق بالوصول إلى الصور لتغيير صورة الملف الشخصي.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) await uploadAvatarAsset(result.assets[0]);
  };

  const takeAvatarPhoto = async () => {
    setIsAvatarSourceDialogOpen(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      toast.error("اسمح للتطبيق باستخدام الكاميرا لالتقاط صورة الملف الشخصي.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) await uploadAvatarAsset(result.assets[0]);
  };

  const removeAvatar = async () => {
    try {
      await removeAvatarMutation.mutateAsync();
      toast.success("تم حذف صورة الملف الشخصي.");
    } catch {
      toast.error("تعذر حذف الصورة.");
    }
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: fullName.trim(),
        email: email.trim(),
        phone: phoneNumber.trim() || null,
        city: city.trim() || null,
        bio: bio.trim() || null,
      });
      toast.success("تم تحديث بيانات الحساب بنجاح.", "تم حفظ المعلومات");
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      toast.error(message, "تعذر حفظ المعلومات");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
        <MenuPageHeader title="تعديل المعلومات الشخصية" />
        <CardSkeleton height={360} margin={0} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تعديل المعلومات الشخصية" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <Card padding="lg" className="mb-3 overflow-hidden rounded-3xl border-primary-200 bg-primary-100/50 dark:border-dark-400 dark:bg-dark-500">
          <View className="items-center">
            <View className="relative">
              <View className="rounded-full border-4 border-white bg-white p-1 shadow-sm dark:border-dark-350 dark:bg-dark-350">
                <Avatar name={user?.name ?? "مستخدم"} imageUrl={user?.avatarUrl} size={92} />
              </View>
              <Pressable
                onPress={() => setIsAvatarSourceDialogOpen(true)}
                disabled={updateAvatarMutation.isPending || removeAvatarMutation.isPending}
                accessibilityRole="button"
                accessibilityLabel="تعديل صورة الملف الشخصي"
                className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-400 shadow-sm dark:border-dark-350"
              >
                <Pencil size={16} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text weight="bold" size="base" className="mt-3 text-dark-100 dark:text-light-50">{user?.name ?? "مستخدم جود"}</Text>
            <Text size="2xs" rtlAlign="center" className="mt-1 text-gray-500 dark:text-gray-300">اضغط على أيقونة القلم لتحديث صورة حسابك.</Text>
          </View>
        </Card>

        <Card padding="lg" className="mb-3 rounded-3xl border-gray-200 dark:border-dark-400">
          <View className="mb-4">
            <Text weight="bold" size="sm" className="text-dark-100 dark:text-light-50">بيانات الحساب</Text>
            <Text size="2xs" className="mt-1 leading-5 text-gray-500 dark:text-gray-300">تأكد أن معلومات التواصل والنبذة محدثة وواضحة.</Text>
          </View>
          <View className="gap-3">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">الاسم الكامل *</Text>
            <Input fullWidth showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<UserIcon size={16} strokeWidth={2.25} />} value={fullName} onChangeText={setFullName} placeholder="أدخل الاسم الكامل" placeholderTextColor="#9CA3AF" />
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">البريد الإلكتروني *</Text>
            <Input fullWidth showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<Mail size={16} strokeWidth={2.25} />} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="example@jod.org" placeholderTextColor="#9CA3AF" />
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">رقم الجوال (اختياري)</Text>
            <Input fullWidth showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<Phone size={16} strokeWidth={2.25} />} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="+9639XXXXXXXX" placeholderTextColor="#9CA3AF" />
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">المحافظة</Text>
            <Pressable onPress={() => setIsCityModalOpen(true)} accessibilityRole="button" accessibilityLabel="اختر المحافظة"><View pointerEvents="none"><Input fullWidth editable={false} showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<MapPin size={16} strokeWidth={2.25} />} value={city} placeholder="اختر المحافظة" placeholderTextColor="#9CA3AF" /></View></Pressable>
            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">نبذة تعريفية</Text>
            <Input fullWidth showStatusIcon={false} inputClassName="min-h-[64px] font-noto text-xs" inputContainerClassName="min-h-[88px] py-2" rightIcon={<FileText size={16} strokeWidth={2.25} />} value={bio} onChangeText={setBio} placeholder="اكتب نبذة مختصرة عنك" placeholderTextColor="#9CA3AF" multiline textAlignVertical="top" maxLength={180} />
            <Text size="2xs" className="self-start text-gray-400 dark:text-gray-300">{bio.trim().length}/180</Text>
          </View>
        </Card>

        <Button fullWidth size="medium" disabled={!canSave} loading={updateProfileMutation.isPending} onPress={handleSave}>حفظ التعديلات</Button>
        {!isEmailValid ? <Text size="2xs" className="mt-2 text-center text-error-300">البريد الإلكتروني غير صالح.</Text> : null}
        {!isPhoneValid ? <Text size="2xs" className="mt-2 text-center text-error-300">رقم الجوال قصير جداً.</Text> : null}
      </ScrollView>
      <ImageSourceDialog
        visible={isAvatarSourceDialogOpen}
        title="تعديل صورة الملف الشخصي"
        onClose={() => setIsAvatarSourceDialogOpen(false)}
        onChooseGallery={() => void chooseAvatarFromGallery()}
        onTakePhoto={() => void takeAvatarPhoto()}
        disabled={updateAvatarMutation.isPending || removeAvatarMutation.isPending}
        onRemove={user?.avatarUrl ? () => {
          setIsAvatarSourceDialogOpen(false);
          void removeAvatar();
        } : undefined}
      />
      <SelectionModal visible={isCityModalOpen} title="اختر المحافظة السورية" options={cityOptions} selectedValue={city} onSelect={(value) => { setCity(value); setIsCityModalOpen(false); }} onClose={() => setIsCityModalOpen(false)} />
    </View>
  );
}
