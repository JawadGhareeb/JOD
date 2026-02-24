import { Button, Logo, Text, VerificationCodeInput } from "@/components/ui";
import { NavigationHelper } from "@/lib/helpers";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const VerifyCode = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const handleResendCode = () => {
    console.log("Resending code...");
  };

  const handleBackToReset = () => {
    NavigationHelper.goToResetPassword(router);
  };

  const handleVerifyCode = () => {
    // Handle verify code logic here
    console.log("Code verified successfully");
    NavigationHelper.goToSignIn(router);
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
              تأكيد الرمز
            </Text>
            <Text
              size="xs"
              className={`${isDark ? "text-light-50" : "text-gray-600"} text-center leading-6`}
            >
              أدخل الرمز المكون من 4 أرقام الذي تم إرساله إلى رقم هاتفك
            </Text>
          </View>

          <View className="items-center mb-8">
            <Text
              size="xs"
              weight="medium"
              className={`${isDark ? "text-light-50" : "text-gray-700"} mb-4`}
            >
              رمز التحقق
            </Text>
            <VerificationCodeInput length={4} />
          </View>

          <Button
            variant="primary"
            size="medium"
            fullWidth
            onPress={handleVerifyCode}
          >
            تأكيد الرمز
          </Button>

          <View className="items-center mt-8 ">
            <Text
              size="xs"
              color="secondary"
              className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-2`}
            >
              لم تستلم الرمز؟
            </Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text size="xs" weight="semibold" color="accent">
                إعادة إرسال الرمز
              </Text>
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <Text
              size="xs"
              color="secondary"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              يمكنك طلب رمز جديد خلال 60 ثانية
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleBackToReset}
            className="items-center"
          >
            <Text size="xs" weight="medium" color="accent">
              العودة لإعادة تعيين كلمة المرور
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default VerifyCode;
