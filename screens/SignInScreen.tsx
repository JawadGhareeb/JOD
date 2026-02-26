import { Button, Input, Logo, PhoneNumberInput, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { NavigationHelper } from "@/lib/helpers";
import { useRTL } from "@/providers/RTLProvider";
import { setAuthToken } from "@/utils/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل")
  .refine(
    (password) => /[A-Z]/.test(password),
    "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل"
  )
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"
  );

const signInSchema = z.object({
  phoneNumber: z.string().min(8, "يرجى إدخال رقم هاتف صالح"),
  password: passwordSchema,
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInScreen = () => {
  const { isRTL } = useRTL();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  // const { loginMutation } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const handleForgotPassword = () => {
    NavigationHelper.goToResetPassword(router);
  };

  const handleSignUp = () => {
    NavigationHelper.goToSignUp(router);
  };

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await setAuthToken(`demo-${values.phoneNumber}`);
      NavigationHelper.goToHome(router);
    } catch {
      // Errors are surfaced through the global toast service
    }
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? "#181a20" : "#F9FAFB",
        flex: 1,
      }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
      >
        <View className="flex-1 px-6 pt-16 pb-8 gap-4">
          <View className="items-center">
            <Logo variant="large" />
            <Text
              size="xl"
              weight="bold"
              className={`${isDark ? "text-light-50" : "text-gray-900"} mb-2`}
            >
              مرحباً بك
            </Text>
            <Text
              size="xs"
              className={`${isDark ? "text-light-50" : "text-gray-600"} text-center`}
            >
              سجل دخولك للوصول إلى حسابك
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { value, onChange, onBlur } }) => (
                <PhoneNumberInput
                  label="رقم الهاتف"
                  placeholder="أدخل رقم هاتفك"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.phoneNumber?.message}
                  defaultCountry="SY"
                  leftIcon={
                    <icons.phone
                      size={18}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                      strokeWidth={2}
                    />
                  }
                  phoneInputProps={{
                    returnKeyType: "next",
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="كلمة المرور"
                  placeholder="أدخل كلمة المرور"
                  secureTextEntry={!passwordVisible}
                  fullWidth
                  returnKeyType="done"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  showStatusIcon={false}
                  leftIcon={
                    <icons.lock
                      size={18}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                      strokeWidth={2}
                    />
                  }
                  rightIcon={
                    passwordVisible ? (
                      <icons.eyeOff
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                        strokeWidth={2}
                      />
                    ) : (
                      <icons.eye
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                        strokeWidth={2}
                      />
                    )
                  }
                  onRightIconPress={() =>
                    setPasswordVisible((prev) => !prev)
                  }
                />
              )}
            />
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text
              size="xs"
              weight="medium"
              color="accent"
              rtlAlign={isRTL ? "left" : "right"}
            >
              نسيت كلمة المرور؟
            </Text>
          </TouchableOpacity>

          <Button
            variant="primary"
            size="medium"
            fullWidth
            className="mb-4"
           
            onPress={handleSubmit(onSubmit)}
          >
            تسجيل الدخول
          </Button>

          <View className="flex-row justify-center gap-1 items-center mt-8">
            <Text
              size="xs"
              color={isDark ? "light" : "dark"}
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              ليس لديك حساب؟
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text size="xs" weight="semibold" color="accent">
                إنشاء حساب
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignInScreen;
