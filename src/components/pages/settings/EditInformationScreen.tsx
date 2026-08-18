import { useEffect, useMemo, useState } from "react";
import { FileText, Mail, MapPin, Phone } from "lucide-react-native";
import { Alert, ScrollView, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { ApiClientError } from "@/src/lib/api-client";
import { meApi } from "@/src/lib/me-api";
import { MenuPageHeader } from "./MenuPageHeader";

const UserIcon = appIcons.profile;
const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

export function EditInformationScreen() {
  const { user, refreshAuthStatus } = useAuthStatus();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // City and bio have no field in the real profile contract (name/email/phone
  // only) — kept as local inputs for now, but not sent or persisted anywhere.
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phone ?? "");
  }, [user]);

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const canSave =
    fullName.trim().length > 2 &&
    isEmailValid &&
    phoneNumber.trim().length >= 8 &&
    !isSubmitting;

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      await meApi.updateProfile({
        name: fullName.trim(),
        email: email.trim(),
        phone: phoneNumber.trim() || undefined,
      });
      await refreshAuthStatus();
      Alert.alert("تم حفظ المعلومات", "تم تحديث بيانات الحساب بنجاح.");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      Alert.alert("تعذر حفظ المعلومات", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تعديل المعلومات الشخصية" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">
            بيانات الحساب
          </Text>

          <View className="gap-2">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              الاسم الكامل *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<UserIcon size={16} strokeWidth={2.25} />}
              value={fullName}
              onChangeText={setFullName}
              placeholder="أدخل الاسم الكامل"
              placeholderTextColor="#9CA3AF"
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              البريد الإلكتروني *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<Mail size={16} strokeWidth={2.25} />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="example@jod.org"
              placeholderTextColor="#9CA3AF"
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              رقم الجوال *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<Phone size={16} strokeWidth={2.25} />}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="09xxxxxxxx"
              placeholderTextColor="#9CA3AF"
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              المدينة
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<MapPin size={16} strokeWidth={2.25} />}
              value={city}
              onChangeText={setCity}
              placeholder="مثال: دمشق"
              placeholderTextColor="#9CA3AF"
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              نبذة تعريفية
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="min-h-[64px] font-noto text-xs"
              inputContainerClassName="min-h-[88px] py-2"
              rightIcon={<FileText size={16} strokeWidth={2.25} />}
              value={bio}
              onChangeText={setBio}
              placeholder="اكتب نبذة مختصرة عنك"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              maxLength={180}
            />
            <Text size="2xs" className="self-start text-gray-400 dark:text-gray-300">
              {bio.trim().length}/180
            </Text>
            <Text size="2xs" className="text-gray-400 dark:text-gray-300">
              المدينة والنبذة غير مرتبطتين بالخادم بعد، ولا يتم حفظهما حالياً.
            </Text>
          </View>
        </Card>

        <Button
          fullWidth
          size="small"
          disabled={!canSave}
          loading={isSubmitting}
          onPress={handleSave}
        >
          حفظ التعديلات
        </Button>

        {!isEmailValid ? (
          <Text size="2xs" className="mt-2 text-center text-error-300">
            البريد الإلكتروني غير صالح.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
