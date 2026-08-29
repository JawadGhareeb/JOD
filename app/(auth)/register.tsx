import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail, PhoneCall, UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { FadeInUp } from "@/src/components/shared/FadeInUp";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useAuthStatus, useRegister } from "@/src/features/auth/queries";
import { applyApiFormErrors } from "@/src/lib/api-error-utils";
import { useToast } from "@/src/providers/ToastProvider";

const registerSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب"),
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
  phoneNumber: z.string().trim().min(1, "رقم الموبايل مطلوب").regex(/^\+9639\d{8}$/, "أدخل رقم موبايل سوري صحيحاً بصيغة +9639XXXXXXXX"),
  password: z.string().trim().min(1, "كلمة المرور مطلوبة").min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
  confirmPassword: z.string().trim().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((values) => values.password === values.confirmPassword, { message: "كلمتا المرور غير متطابقتين", path: ["confirmPassword"] });
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const registerMutation = useRegister();
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", phoneNumber: "", password: "", confirmPassword: "" } });

  useEffect(() => { if (!isLoading && isAuthenticated) router.replace("/(tabs)/home"); }, [isAuthenticated, isLoading, router]);
  const onSubmit = handleSubmit(async (values) => {
    setFormError("");
    try {
      await registerMutation.mutateAsync({ name: values.name, email: values.email, phone: values.phoneNumber, password: values.password, password_confirmation: values.confirmPassword });
      toast.success("تم إنشاء حسابك ويمكنك الآن استخدام جميع ميزات جود.", "أهلاً بك في جود");
      router.replace("/(tabs)/home");
    } catch (error) {
      const message = applyApiFormErrors(error, setError, { password_confirmation: "confirmPassword" });
      if (message) { setFormError(message); toast.error(message, "تعذر إنشاء الحساب"); }
    }
  });
  if (isLoading || isAuthenticated) return null;

  return (
    <KeyboardAvoider className="flex-1">
      <Container scrollable className="bg-light-100 dark:bg-dark-300" scrollViewProps={{ contentContainerStyle: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 36, justifyContent: "center" } }}>
        <View className="gap-5">
          <View className="absolute -left-24 -top-20 h-52 w-52 rounded-full bg-primary-100/60 dark:bg-primary-400/10" />
          <FadeInUp><View className="items-center gap-3"><Logo variant="medium" showName /><View className="items-center gap-2 px-4"><Text variant="heading" weight="bold" rtlAlign="center">ابدأ رحلتك مع جود</Text><Text size="sm" rtlAlign="center" className="leading-6 text-gray-600 dark:text-gray-300">أنشئ حساباً لتطلب المساعدة أو تقدمها وتتابع الحملات.</Text></View></View></FadeInUp>
          <FadeInUp delay={90}>
            <Card padding="lg" className="gap-4 rounded-3xl border-gray-200 dark:border-dark-400">
              <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => <Input label="الاسم الكامل" placeholder="أحمد محمد" value={value} onChangeText={onChange} onBlur={onBlur} autoComplete="name" textContentType="name" error={errors.name?.message} leftIcon={<UserRound size={18} />} fullWidth />} />
              <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <Input label="البريد الإلكتروني" placeholder="ahmad@example.com" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" error={errors.email?.message} leftIcon={<Mail size={18} />} fullWidth />} />
              <Controller control={control} name="phoneNumber" render={({ field: { onChange, onBlur, value } }) => <Input label="رقم الموبايل" placeholder="9XXXXXXXX" value={value.replace(/^\+963/, "")} onChangeText={(text) => { const digits = text.replace(/\D/g, "").slice(0, 9); onChange(digits ? `+963${digits}` : ""); }} onBlur={onBlur} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" error={errors.phoneNumber?.message} leftIcon={<View className="flex-row items-center gap-1"><Text size="xs">🇸🇾</Text><Text size="xs" weight="semibold" className="text-primary-400">+963</Text><PhoneCall size={16} /></View>} fullWidth />} />
              <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => <Input label="كلمة المرور" placeholder="أدخل كلمة المرور" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry={!isPasswordVisible} autoComplete="new-password" textContentType="newPassword" error={errors.password?.message} leftIcon={<LockKeyhole size={18} />} rightIcon={isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />} onRightIconPress={() => setIsPasswordVisible((v) => !v)} fullWidth />} />
              <Controller control={control} name="confirmPassword" render={({ field: { onChange, onBlur, value } }) => <Input label="تأكيد كلمة المرور" placeholder="أعد إدخال كلمة المرور" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry={!isConfirmPasswordVisible} autoComplete="new-password" textContentType="newPassword" error={errors.confirmPassword?.message} leftIcon={<LockKeyhole size={18} />} rightIcon={isConfirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />} onRightIconPress={() => setIsConfirmPasswordVisible((v) => !v)} fullWidth />} />
              {formError ? <Text size="sm" color="error" rtlAlign="center">{formError}</Text> : null}
              <Button fullWidth loading={isSubmitting} onPress={onSubmit}>إنشاء الحساب</Button>
            </Card>
          </FadeInUp>
          <FadeInUp delay={150}><View className="items-center gap-3"><Text size="sm" rtlAlign="center" className="text-gray-600 dark:text-gray-300">لديك حساب بالفعل؟ <Text size="sm" weight="semibold" color="primary" onPress={() => router.push("/(auth)/login")}>تسجيل الدخول</Text></Text></View></FadeInUp>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
