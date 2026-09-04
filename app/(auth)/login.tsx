import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react-native";
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
import { useAuthStatus, useLogin } from "@/src/features/auth/queries";
import { applyApiFormErrors } from "@/src/lib/api-error-utils";
import { ApiClientError } from "@/src/lib/api-client";
import { useToast } from "@/src/providers/ToastProvider";

const loginSchema = z.object({
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string().trim().min(1, "كلمة المرور مطلوبة").min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const loginMutation = useLogin();
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/(tabs)/home");
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError("");
    try {
      await loginMutation.mutateAsync(values);
      toast.success("أهلاً بعودتك إلى جود.", "تم تسجيل الدخول");
      router.replace("/(tabs)/home");
    } catch (error) {
      if (error instanceof ApiClientError && error.code === "verification_required") {
        router.push({ pathname: "/(auth)/verify-account", params: { login: values.email.trim() } });
        return;
      }
      const message = applyApiFormErrors(error, setError);
      if (message) { setFormError(message); toast.error(message, "تعذر تسجيل الدخول"); }
    }
  });

  if (isLoading || isAuthenticated) return null;

  return (
    <KeyboardAvoider className="flex-1">
      <Container scrollable className="bg-light-100 dark:bg-dark-300" scrollViewProps={{ contentContainerStyle: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 36, justifyContent: "center" } }}>
        <View className="gap-5">
          <View className="absolute -right-24 -top-20 h-52 w-52 rounded-full bg-primary-100/60 dark:bg-primary-400/10" />
          <FadeInUp><View className="items-center gap-3"><Logo variant="medium" showName /><View className="items-center gap-2 px-4"><Text variant="heading" weight="bold" rtlAlign="center">أهلاً بعودتك</Text><Text size="sm" rtlAlign="center" className="leading-6 text-gray-600 dark:text-gray-300">سجّل دخولك للوصول إلى حسابك والتفاعل مع مجتمع جود.</Text></View></View></FadeInUp>
          <FadeInUp delay={90}>
            <Card padding="lg" className="gap-4 rounded-3xl border-gray-200 dark:border-dark-400">
              <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <Input label="البريد الإلكتروني" placeholder="ahmad@example.com" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" error={errors.email?.message} leftIcon={<Mail size={18} />} fullWidth />} />
              <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => <Input label="كلمة المرور" placeholder="أدخل كلمة المرور" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry={!isPasswordVisible} autoComplete="password" textContentType="password" error={errors.password?.message} leftIcon={<LockKeyhole size={18} />} rightIcon={isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />} onRightIconPress={() => setIsPasswordVisible((v) => !v)} fullWidth />} />
              {formError ? <Text size="sm" color="error" rtlAlign="center">{formError}</Text> : null}
              <Button fullWidth loading={isSubmitting} onPress={onSubmit}>تسجيل الدخول</Button>
            </Card>
          </FadeInUp>
          <FadeInUp delay={150}><View className="items-center gap-3"><Text size="sm" rtlAlign="center" className="text-gray-600 dark:text-gray-300">ليس لديك حساب؟ <Text size="sm" weight="semibold" color="primary" onPress={() => router.push("/(auth)/register")}>إنشاء حساب</Text></Text><Text size="sm" weight="semibold" color="primary" onPress={() => router.push("/(auth)/reset-password")}>نسيت كلمة المرور؟</Text></View></FadeInUp>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
