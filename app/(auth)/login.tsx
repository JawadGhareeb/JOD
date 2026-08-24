import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { useAuthStatus, useLogin } from "@/src/features/auth/queries";
import { applyApiFormErrors } from "@/src/lib/api-error-utils";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { useToast } from "@/src/providers/ToastProvider";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z
    .string()
    .trim()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const loginMutation = useLogin();
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, router, toast]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError("");

    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      toast.success("أهلاً بعودتك إلى جود.", "تم تسجيل الدخول");
      router.replace("/(tabs)/home");
    } catch (error) {
      const message = applyApiFormErrors(error, setError);
      if (message) {
        setFormError(message);
        toast.error(message, "تعذر تسجيل الدخول");
      }
    }
  });

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <KeyboardAvoider className="flex-1">
      <Container
        scrollable
        className="bg-light-100 dark:bg-dark-300"
        scrollViewProps={{
          contentContainerStyle: {
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 28,
            paddingBottom: 36,
            justifyContent: "center",
          },
        }}
      >
        <View className="gap-6">
          <View className="items-center gap-3">
            <Logo variant="large" showName />
            <View className="items-center gap-2">
              <Text variant="heading" weight="bold" rtlAlign="center">
                تسجيل الدخول
              </Text>
              <Text size="sm" color="secondary" rtlAlign="center">
                سجّل دخولك لمتابعة آخر التحديثات والفرص المتاحة على JOD.
              </Text>
            </View>
          </View>

          <Card padding="lg" className="gap-4 border-gray-200 dark:border-dark-400">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="البريد الإلكتروني"
                  placeholder="ahmad@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} />}
                  fullWidth
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="كلمة المرور"
                  placeholder="أدخل كلمة المرور"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  textContentType="password"
                  error={errors.password?.message}
                  leftIcon={<LockKeyhole size={18} />}
                  rightIcon={isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconPress={() => setIsPasswordVisible((currentValue) => !currentValue)}
                  fullWidth
                />
              )}
            />

            {formError ? (
              <Text size="sm" color="error" rtlAlign="center">
                {formError}
              </Text>
            ) : null}

            <Button fullWidth loading={isSubmitting} onPress={onSubmit}>
              تسجيل الدخول
            </Button>
          </Card>

          <View className="items-center">
            <Text size="sm" color="secondary" rtlAlign="center">
              ليس لديك حساب؟{" "}
              <Text
                size="sm"
                weight="semibold"
                color="primary"
                onPress={() => router.push("/(auth)/register")}
              >
                إنشاء حساب
              </Text>
            </Text>
            <Text
              size="sm"
              weight="semibold"
              color="primary"
              className="mt-3"
              onPress={() => router.push("/(auth)/reset-password")}
            >
              نسيت كلمة المرور؟
            </Text>
          </View>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
