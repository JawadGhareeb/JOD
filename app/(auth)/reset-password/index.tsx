import { Button, Logo, PhoneNumberInput, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { NavigationHelper } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { z } from "zod";

const resetSchema = z.object({
  phoneNumber: z.string().min(8, "يرجى إدخال رقم هاتف صالح"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const handleBackToSignIn = () => {
    NavigationHelper.goToSignIn(router);
  };

  const onSubmit = async (values: ResetFormValues) => {
    try {
      NavigationHelper.goToVerifyCode(router, {
        phoneNumber: values.phoneNumber,
        flow: "reset",
      });
    } catch {
      // Errors handled globally via interceptors/toasts
    }
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
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
              إعادة تعيين كلمة المرور
            </Text>
            <Text
              size="xs"
              className={`${isDark ? "text-light-50" : "text-gray-600"} text-center leading-6`}
            >
              أدخل رقم هاتفك وسنرسل لك رمزاً لإعادة تعيين كلمة المرور
            </Text>
          </View>

          <View className="space-y-6">
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
                    returnKeyType: "done",
                  }}
                />
              )}
            />
          </View>

          <Button
            variant="primary"
            size="medium"
            fullWidth
         
            onPress={handleSubmit(onSubmit)}
          >
            إرسال رمز إعادة التعيين
          </Button>
          <Button
            variant="tertiary"
            size="medium"
            fullWidth
            onPress={handleBackToSignIn}
          >
            العودة لتسجيل الدخول
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetPassword;
