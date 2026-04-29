import { useMemo, useState } from "react";
import { FileText, Mail, MapPin, Phone } from "lucide-react-native";
import { Alert, ScrollView, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

const UserIcon = appIcons.profile;

export function EditInformationScreen() {
  const [fullName, setFullName] = useState("جواد");
  const [email, setEmail] = useState("jawad.user@jod.org");
  const [phoneNumber, setPhoneNumber] = useState("0999999999");
  const [city, setCity] = useState("دمشق");
  const [bio, setBio] = useState(
    "مهتم بالعمل الإنساني والتطوعي، وبشارك منشورات وحملات لدعم المجتمع المحلي.",
  );

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const canSave =
    fullName.trim().length > 2 &&
    isEmailValid &&
    phoneNumber.trim().length >= 8 &&
    city.trim().length > 1;

  const handleSave = () => {
    Alert.alert("تم حفظ المعلومات", "تم تحديث بيانات الحساب بنجاح.");
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
              المدينة *
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
          </View>
        </Card>

        <Button fullWidth size="small" disabled={!canSave} onPress={handleSave}>
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
