import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, PhoneCall } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { setMockAuth } from "@/src/lib/auth";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";

const loginSchema = z.object({
  phoneNumber: z.string().trim().min(1, "رقم الهاتف مطلوب"),
  password: z
    .string()
    .trim()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  phoneNumber: "0999999999",
  password: "Password123!",
};

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = handleSubmit(async (values) => {
    await setMockAuth({
      firstName: "مستخدم",
      lastName: "",
      phoneNumber: values.phoneNumber,
    });
    router.replace("/(tabs)/home");
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
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="رقم الهاتف"
                  placeholder="0999999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  error={errors.phoneNumber?.message}
                  leftIcon={<PhoneCall size={18} />}
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
