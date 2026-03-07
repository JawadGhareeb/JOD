import { Header } from "@/components/sections";
import { Card, KeyboardAvoider } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView, View } from "react-native";
import { toastService } from "@/services/toastService";
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

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "يرجى إدخال كلمة المرور الحالية"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "كلمتا المرور الجديدتان غير متطابقتين",
      });
    }

    if (data.newPassword === data.oldPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "يجب أن تكون كلمة المرور الجديدة مختلفة عن الحالية",
      });
    }
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (_values: ChangePasswordFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      toastService.success("تم بنجاح", "تم تغيير كلمة المرور بنجاح.");
      router.back();
    } catch {
      toastService.error("حدث خطأ", "تعذر تغيير كلمة المرور، حاول مرة أخرى.");
    }
  };

  return (
    <KeyboardAvoider
      className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}
      offsetIOS={64}
      offsetAndroid={0}
    >
      <View className="flex-1">
        <Header pageTitle="تغيير كلمة المرور" showBackButton={true} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <View className="px-4">
            <Text
              size="sm"
              className={`${isDark ? "text-light-50" : "text-gray-500"} mb-6 leading-6`}
              rtlAlign="left"
            >
              يرجى إدخال كلمة المرور الحالية وكلمة المرور الجديدة لتحديث حسابك.
            </Text>

            <Card className="gap-2" elevated={Platform.OS === "android"}>
              <Controller
                control={control}
                name="oldPassword"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label="كلمة المرور الحالية"
                    placeholder="أدخل كلمة المرور الحالية"
                    secureTextEntry={!oldPasswordVisible}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.oldPassword?.message}
                    showStatusIcon={false}
                    leftIcon={
                      <icons.lock
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                        strokeWidth={2}
                      />
                    }
                    rightIcon={
                      oldPasswordVisible ? (
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
                      setOldPasswordVisible((prev) => !prev)
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label="كلمة المرور الجديدة"
                    placeholder="أدخل كلمة المرور الجديدة"
                    secureTextEntry={!newPasswordVisible}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.newPassword?.message}
                    showStatusIcon={false}
                    leftIcon={
                      <icons.lock
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                        strokeWidth={2}
                      />
                    }
                    rightIcon={
                      newPasswordVisible ? (
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
                      setNewPasswordVisible((prev) => !prev)
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label="أعد إدخال كلمة المرور الجديدة"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    secureTextEntry={!confirmPasswordVisible}
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
            </Card>

            <Card
              className={`my-6 ${isDark ? "bg-dark-500" : "!bg-primary-300"}`}
              elevated={Platform.OS === "android"}
            >
              <View className="flex-row items-center gap-2">
                <icons.info size={20} color="#6949ff" />
                <Text
                  size="xs"
                  weight="semibold"
                  className="text-primary-400"
                  rtlAlign="left"
                >
                  متطلبات كلمة المرور
                </Text>
              </View>
              <View className="mt-2 gap-1">
                <Text
                  size="xs"
                  color="secondary"
                  className="text-primary-400"
                  rtlAlign="left"
                >
                  • يجب أن تكون 8 أحرف على الأقل
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  className="text-primary-400"
                  rtlAlign="left"
                >
                  • يجب أن تحتوي على حرف كبير واحد على الأقل
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  className="text-primary-400"
                  rtlAlign="left"
                >
                  • يجب أن تحتوي على رمز خاص واحد على الأقل
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  className="text-primary-400"
                  rtlAlign="left"
                >
                  • يجب أن تكون مختلفة عن كلمة المرور الحالية
                </Text>
              </View>
            </Card>

            <Button
              variant="primary"
              onPress={handleSubmit(onSubmit)}
            >
              تغيير كلمة المرور
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoider>
  );
};

export default ChangePassword;
