import { useMemo, useRef, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import VerificationCodeInput, { type VerificationCodeInputHandle } from "@/src/components/ui/VerificationCodeInput";
import { useToast } from "@/src/providers/ToastProvider";
import { useChangePassword, useRequestPasswordChangeCode } from "@/src/features/account/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { MenuPageHeader } from "./MenuPageHeader";

const MIN_PASSWORD_LENGTH = 8;
const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

type Step = "password" | "verify";

export function ChangePasswordScreen() {
  const requestCodeMutation = useRequestPasswordChangeCode();
  const changePasswordMutation = useChangePassword();
  const toast = useToast();
  const codeRef = useRef<VerificationCodeInputHandle>(null);
  const [step, setStep] = useState<Step>("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);

  const isStrongEnough = useMemo(() => newPassword.trim().length >= MIN_PASSWORD_LENGTH, [newPassword]);
  const isConfirmed = newPassword === confirmPassword;
  const isDifferentFromCurrent = currentPassword.trim().length > 0 && currentPassword !== newPassword;
  const canRequestCode = currentPassword.trim().length > 0 && newPassword.trim().length > 0 && confirmPassword.trim().length > 0 && isStrongEnough && isConfirmed && isDifferentFromCurrent;

  const requestCode = async () => {
    try {
      const result = await requestCodeMutation.mutateAsync(currentPassword);
      setExpiresIn(result.expiresIn);
      setCode("");
      setCodeError("");
      setStep("verify");
      toast.success("تم إرسال رمز تحقق من 6 أرقام.", "تحقق من العملية");
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      toast.error(message, "تعذر إرسال رمز التحقق");
    }
  };

  const handleUpdatePassword = async () => {
    if (code.length !== 6) return;
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, code, password: newPassword, password_confirmation: confirmPassword });
      toast.success("تم تحديث كلمة المرور بنجاح.", "تم تغيير كلمة المرور");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCode("");
      setCodeError("");
      setStep("password");
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE;
      if (error instanceof ApiClientError && error.code === "invalid_verification_code") {
        setCodeError("رمز التحقق غير صحيح أو منتهي الصلاحية.");
        codeRef.current?.clear();
        setCode("");
      } else {
        toast.error(message, "تعذر تغيير كلمة المرور");
      }
    }
  };

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تغيير كلمة المرور" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <View className="mb-3 flex-row-reverse items-center gap-2">
            {step === "verify" ? <ShieldCheck size={20} color="#4A9782" /> : <Lock size={20} color="#4A9782" />}
            <Text weight="semibold" size="sm">{step === "verify" ? "تحقق من رمز الأمان" : "أمان الحساب"}</Text>
          </View>

          {step === "password" ? (
            <View className="gap-2">
              <Text size="xs" className="mb-2 leading-6 text-gray-500 dark:text-gray-300">بعد إدخال كلمة المرور الحالية والجديدة سنرسل رمز تحقق من 6 أرقام لتأكيد العملية.</Text>
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">كلمة المرور الحالية *</Text>
              <Input fullWidth showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<Lock size={16} strokeWidth={2.25} />} value={currentPassword} onChangeText={setCurrentPassword} placeholder="أدخل كلمة المرور الحالية" placeholderTextColor="#9CA3AF" secureTextEntry />
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">كلمة المرور الجديدة *</Text>
              <Input fullWidth showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<Lock size={16} strokeWidth={2.25} />} value={newPassword} onChangeText={setNewPassword} placeholder="على الأقل 8 أحرف" placeholderTextColor="#9CA3AF" secureTextEntry />
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">تأكيد كلمة المرور الجديدة *</Text>
              <Input fullWidth showStatusIcon={false} inputClassName="font-noto text-xs" rightIcon={<Lock size={16} strokeWidth={2.25} />} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="أعد كتابة كلمة المرور الجديدة" placeholderTextColor="#9CA3AF" secureTextEntry />
              {!isStrongEnough && newPassword.length > 0 ? <Text size="2xs" className="text-center text-error-300">كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.</Text> : null}
              {isStrongEnough && !isConfirmed && confirmPassword.length > 0 ? <Text size="2xs" className="text-center text-error-300">تأكيد كلمة المرور غير مطابق.</Text> : null}
              {newPassword.length > 0 && !isDifferentFromCurrent ? <Text size="2xs" className="text-center text-error-300">كلمة المرور الجديدة يجب أن تختلف عن الحالية.</Text> : null}
            </View>
          ) : (
            <View className="items-center gap-4 py-2">
              <Text size="xs" rtlAlign="center" className="leading-6 text-gray-500 dark:text-gray-300">أدخل رمز التحقق المكوّن من 6 أرقام. صلاحية الرمز {Math.max(1, Math.round(expiresIn / 60))} دقيقة تقريباً.</Text>
              <VerificationCodeInput ref={codeRef} value={code} onChange={(value) => { setCode(value); setCodeError(""); }} error={Boolean(codeError)} disabled={changePasswordMutation.isPending} />
              {codeError ? <Text size="2xs" color="error" rtlAlign="center">{codeError}</Text> : null}
              <Button fullWidth variant="tertiary" disabled={requestCodeMutation.isPending} loading={requestCodeMutation.isPending} onPress={requestCode}>إعادة إرسال رمز التحقق</Button>
            </View>
          )}
        </Card>

        {step === "password" ? (
          <Button fullWidth size="small" disabled={!canRequestCode || requestCodeMutation.isPending} loading={requestCodeMutation.isPending} onPress={requestCode}>متابعة وإرسال رمز التحقق</Button>
        ) : (
          <View className="gap-2">
            <Button fullWidth size="small" disabled={code.length !== 6 || changePasswordMutation.isPending} loading={changePasswordMutation.isPending} onPress={handleUpdatePassword}>تحقق وحدّث كلمة المرور</Button>
            <Button fullWidth size="small" variant="tertiary" disabled={changePasswordMutation.isPending} onPress={() => { setStep("password"); setCode(""); setCodeError(""); }}>تعديل البيانات</Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
