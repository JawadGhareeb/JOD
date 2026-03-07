import { Button, Input, Logo, PhoneNumberInput, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { NavigationHelper } from "@/lib/helpers";
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

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "يرجى إدخال الاسم الأول"),
    lastName: z.string().min(2, "يرجى إدخال اسم العائلة"),
    email: z.string().email("يرجى إدخال بريد إلكتروني صالح"),
    phoneNumber: z.string().min(8, "يرجى إدخال رقم هاتف صالح"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "كلمتا المرور غير متطابقتين",
      });
    }
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  // const { registerMutation } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = () => {
    NavigationHelper.goToSignIn(router);
  };

  const onSubmit = async (values: SignUpFormValues) => {
    NavigationHelper.goToVerifyCode(router, {
      phoneNumber: values.phoneNumber,
      flow: "register",
    });
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? "#181a20" : "#F9FAFB",
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
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
              إنشاء حساب جديد
            </Text>
            <Text
              size="xs"
              className={`${isDark ? "text-light-50" : "text-gray-600"} text-center`}
            >
              أنشئ حسابك للبدء بالمشاركة في منصة عطاء
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="firstName"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="الاسم الأول"
                  placeholder="أدخل اسمك الأول"
                  fullWidth
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  showStatusIcon={false}
                  leftIcon={
                    <icons.user
                      size={18}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                      strokeWidth={2}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="اسم العائلة"
                  placeholder="أدخل اسم العائلة"
                  fullWidth
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  showStatusIcon={false}
                  leftIcon={
                    <icons.user
                      size={18}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                      strokeWidth={2}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="البريد الإلكتروني"
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  fullWidth
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  showStatusIcon={false}
                  leftIcon={
                    <icons.mail
                      size={18}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                      strokeWidth={2}
                    />
                  }
                />
              )}
            />

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
                  returnKeyType="next"
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
                  onRightIconPress={() => setPasswordVisible((prev) => !prev)}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="تأكيد كلمة المرور"
                  placeholder="أعد إدخال كلمة المرور"
                  secureTextEntry={!confirmPasswordVisible}
                  fullWidth
                  returnKeyType="done"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  showStatusIcon={false}
                  leftIcon={
                    <icons.lock
                      size={18}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                      strokeWidth={2}
                    />
                  }
                  rightIcon={
                    confirmPasswordVisible ? (
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
                    setConfirmPasswordVisible((prev) => !prev)
                  }
                />
              )}
            />
          </View>

          <Button
            variant="primary"
            size="medium"
            fullWidth
            // loading={registerMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            // disabled={registerMutation.isPending}
          >
            إنشاء الحساب
          </Button>

          <View className="flex-row justify-center gap-1 items-center mt-8">
            <Text
              size="xs"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              لديك حساب بالفعل؟
            </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text size="xs" weight="semibold" color="accent">
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
