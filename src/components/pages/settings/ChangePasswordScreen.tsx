import { useMemo, useState } from "react";
import { Lock } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useToast } from "@/src/providers/ToastProvider";
import { useChangePassword } from "@/src/features/account/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { MenuPageHeader } from "./MenuPageHeader";

const MIN_PASSWORD_LENGTH = 8;
const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

export function ChangePasswordScreen() {
  const changePasswordMutation = useChangePassword();
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isStrongEnough = useMemo(
    () => newPassword.trim().length >= MIN_PASSWORD_LENGTH,
    [newPassword],
  );
  const isConfirmed = newPassword === confirmPassword;
  const isDifferentFromCurrent =
    currentPassword.trim().length > 0 && currentPassword !== newPassword;
  const canUpdate =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    isStrongEnough &&
    isConfirmed &&
    isDifferentFromCurrent;

  const handleUpdatePassword = async () => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success("تم تحديث كلمة المرور بنجاح.", "تم تغيير كلمة المرور");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      toast.error(message, "تعذر تغيير كلمة المرور");
    }
  };

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تغيير كلمة المرور" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-2 text-dark-100 dark:text-light-50">
            أمان الحساب
          </Text>
          <Text size="xs" className="mb-3 leading-6 text-gray-500 dark:text-gray-300">
            اختر كلمة مرور قوية وتجنب إعادة استخدام كلمة المرور الحالية.
          </Text>

          <View className="gap-2">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              كلمة المرور الحالية *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<Lock size={16} strokeWidth={2.25} />}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="أدخل كلمة المرور الحالية"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              كلمة المرور الجديدة *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<Lock size={16} strokeWidth={2.25} />}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="على الأقل 8 أحرف"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              تأكيد كلمة المرور الجديدة *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<Lock size={16} strokeWidth={2.25} />}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="أعد كتابة كلمة المرور الجديدة"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>
        </Card>

        <Button
          fullWidth
          size="small"
          disabled={!canUpdate || changePasswordMutation.isPending}
          loading={changePasswordMutation.isPending}
          onPress={handleUpdatePassword}
        >
          تحديث كلمة المرور
        </Button>

        {!isStrongEnough && newPassword.length > 0 ? (
          <Text size="2xs" className="mt-2 text-center text-error-300">
            كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.
          </Text>
        ) : null}
        {isStrongEnough && !isConfirmed && confirmPassword.length > 0 ? (
          <Text size="2xs" className="mt-1 text-center text-error-300">
            تأكيد كلمة المرور غير مطابق.
          </Text>
        ) : null}
        {newPassword.length > 0 && !isDifferentFromCurrent ? (
          <Text size="2xs" className="mt-1 text-center text-error-300">
            كلمة المرور الجديدة يجب أن تختلف عن الحالية.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
