import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  PhoneCall,
  UserRound,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { useAuthStatus, useRegister } from "@/src/features/auth/queries";
import { applyApiFormErrors } from "@/src/lib/api-error-utils";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "الاسم مطلوب"),
    email: z
      .string()
      .trim()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("صيغة البريد الإلكتروني غير صحيحة"),
    phoneNumber: z.string().trim().optional(),
    password: z
      .string()
      .trim()
      .min(1, "كلمة المرور مطلوبة")
      .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string().trim().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const defaultValues: RegisterFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const registerMutation = useRegister();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError("");

    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phoneNumber?.trim() || undefined,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });

      router.replace("/(tabs)/home");
    } catch (error) {
      const message = applyApiFormErrors(error, setError, {
        password_confirmation: "confirmPassword",
      });
      if (message) setFormError(message);
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
                إنشاء حساب
              </Text>
              <Text size="sm" color="secondary" rtlAlign="center">
                أنشئ حسابك في JOD للوصول إلى التحديثات والفرص والمبادرات.
              </Text>
            </View>
          </View>

          <Card padding="lg" className="gap-4 border-gray-200 dark:border-dark-400">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="الاسم الكامل"
                  placeholder="أحمد محمد"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoComplete="name"
                  textContentType="name"
                  error={errors.name?.message}
                  leftIcon={<UserRound size={18} />}
                  fullWidth
                />
              )}
            />

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
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="رقم الهاتف (اختياري)"
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
                  autoComplete="new-password"
                  textContentType="newPassword"
                  error={errors.password?.message}
                  leftIcon={<LockKeyhole size={18} />}
                  rightIcon={isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconPress={() => setIsPasswordVisible((currentValue) => !currentValue)}
                  fullWidth
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="تأكيد كلمة المرور"
                  placeholder="أعد إدخال كلمة المرور"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  error={errors.confirmPassword?.message}
                  leftIcon={<LockKeyhole size={18} />}
                  rightIcon={
                    isConfirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />
                  }
                  onRightIconPress={() =>
                    setIsConfirmPasswordVisible((currentValue) => !currentValue)
                  }
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
              إنشاء الحساب
            </Button>
          </Card>

          <View className="items-center">
            <Text size="sm" color="secondary" rtlAlign="center">
              لديك حساب بالفعل؟{" "}
              <Text
                size="sm"
                weight="semibold"
                color="primary"
                onPress={() => router.push("/(auth)/login")}
              >
                تسجيل الدخول
              </Text>
            </Text>
          </View>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
