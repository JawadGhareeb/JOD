import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { LockKeyhole, PhoneCall } from "lucide-react-native";
import { Fragment, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import VerificationCodeInput from "@/src/components/ui/VerificationCodeInput";

const VERIFICATION_CODE_LENGTH = 4;

enum ResetPasswordStep {
  Phone = 1,
  Code = 2,
  Password = 3,
  Success = 4,
}

const buildResetPasswordSchema = (step: ResetPasswordStep) =>
  z
    .object({
      phoneNumber: z.string().trim().optional(),
      code: z.string().trim().optional(),
      newPassword: z.string().trim().optional(),
      confirmPassword: z.string().trim().optional(),
    })
    .superRefine((values, context) => {
      if (step === ResetPasswordStep.Phone) {
        if (!values.phoneNumber?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phoneNumber"],
            message: "رقم الهاتف مطلوب",
          });
        }
        return;
      }

      if (step === ResetPasswordStep.Code) {
        if (!values.code?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["code"],
            message: "رمز التحقق مطلوب",
          });
          return;
        }

        if (values.code.trim().length !== VERIFICATION_CODE_LENGTH) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["code"],
            message: `رمز التحقق يجب أن يتكون من ${VERIFICATION_CODE_LENGTH} أرقام`,
          });
        }
        return;
      }

      if (step === ResetPasswordStep.Password) {
        if (!values.newPassword?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["newPassword"],
            message: "كلمة المرور الجديدة مطلوبة",
          });
        } else if (values.newPassword.trim().length < 8) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["newPassword"],
            message: "كلمة المرور يجب ألا تقل عن 8 أحرف",
          });
        }

        if (!values.confirmPassword?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["confirmPassword"],
            message: "تأكيد كلمة المرور مطلوب",
          });
        }

        if (
          values.newPassword?.trim() &&
          values.confirmPassword?.trim() &&
          values.newPassword.trim() !== values.confirmPassword.trim()
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["confirmPassword"],
            message: "كلمتا المرور غير متطابقتين",
          });
        }
      }
    });

type ResetPasswordFormValues = z.infer<
  ReturnType<typeof buildResetPasswordSchema>
>;

const defaultValues: ResetPasswordFormValues = {
  phoneNumber: "0999999999",
  code: "",
  newPassword: "Password123!",
  confirmPassword: "Password123!",
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<ResetPasswordStep>(ResetPasswordStep.Phone);
  const resetPasswordSchema = useMemo(
    () => buildResetPasswordSchema(step),
    [step],
  );

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: "onTouched",
  });

  const phoneNumber = watch("phoneNumber");

  const goToCodeStep = async () => {
    const isPhoneValid = await trigger("phoneNumber");
    if (!isPhoneValid) {
      return;
    }

    setStep(ResetPasswordStep.Code);
  };

  const goToPasswordStep = async () => {
    const isCodeValid = await trigger("code");
    if (!isCodeValid) {
      return;
    }

    setStep(ResetPasswordStep.Password);
  };

  const submitNewPassword = handleSubmit(async () => {
    setStep(ResetPasswordStep.Success);
  });

  const renderStepIndicator = () => {
    const steps = [
      { id: ResetPasswordStep.Phone, label: "رقم الهاتف" },
      { id: ResetPasswordStep.Code, label: "الرمز" },
      { id: ResetPasswordStep.Password, label: "كلمة المرور" },
      { id: ResetPasswordStep.Success, label: "النتيجة" },
    ];

    return (
      <View className="flex-row-reverse items-start">
        {steps.map((item, index) => {
          const isReached = item.id <= step;

          return (
            <Fragment key={item.id}>
              <View key={item.id} className="flex-1 items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isReached
                      ? "bg-primary-400"
                      : "bg-gray-200 dark:bg-dark-400"
                  }`}
                >
                  <Text
                    size="xs"
                    weight="bold"
                    color={isReached ? "light" : "dark"}
                  >
                    {item.id}
                  </Text>
                </View>
                <Text
                  size="2xs"
                  weight="medium"
                  rtlAlign="center"
                  className={`mt-2 ${
                    isReached
                      ? "text-primary-600 dark:text-primary-300"
                      : "text-gray-500 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  className={`mt-4 h-px flex-1 self-start rounded-full ${
                    step > item.id
                      ? "bg-primary-400"
                      : "bg-gray-200 dark:bg-dark-400"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </View>
    );
  };

  const renderPhoneStep = () => (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="heading" weight="bold" rtlAlign="center">
          إعادة تعيين كلمة المرور
        </Text>
        <Text size="sm" color="secondary" rtlAlign="center">
          أدخل رقم الهاتف لإرسال رمز التحقق.
        </Text>
      </View>

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

      <Button fullWidth loading={isSubmitting} onPress={goToCodeStep}>
        إرسال رمز التحقق
      </Button>
    </View>
  );

  const renderCodeStep = () => (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="heading" weight="bold" rtlAlign="center">
          تحقق من الرمز
        </Text>
        <Text size="sm" color="secondary" rtlAlign="center">
          أدخل الرمز المرسل إلى {phoneNumber || "رقم الهاتف"}.
        </Text>
      </View>

      <Controller
        control={control}
        name="code"
        render={({ field: { onChange } }) => (
          <View className="gap-2">
            <VerificationCodeInput
              key={step}
              length={VERIFICATION_CODE_LENGTH}
              onChange={(code) => {
                setValue("code", code, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: false,
                });
                onChange(code);
              }}
              onComplete={(code) => {
                setValue("code", code, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: false,
                });
                onChange(code);
              }}
            />
            {errors.code?.message ? (
              <Text size="xs" color="error" rtlAlign="center">
                {errors.code.message}
              </Text>
            ) : null}
            <Text size="xs" color="secondary" rtlAlign="center">
              رمز مكون من {VERIFICATION_CODE_LENGTH} أرقام.
            </Text>
          </View>
        )}
      />

      <View className="flex-row-reverse gap-3">
        <View className="flex-1">
          <Button
            fullWidth
            variant="tertiary"
            onPress={() => setStep(ResetPasswordStep.Phone)}
          >
            رجوع
          </Button>
        </View>
        <View className="flex-1">
          <Button fullWidth loading={isSubmitting} onPress={goToPasswordStep}>
            التحقق من الرمز
          </Button>
        </View>
      </View>
    </View>
  );

  const renderPasswordStep = () => (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="heading" weight="bold" rtlAlign="center">
          تعيين كلمة مرور جديدة
        </Text>
        <Text size="sm" color="secondary" rtlAlign="center">
          اختر كلمة مرور جديدة وآمنة لحسابك.
        </Text>
      </View>

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="كلمة المرور الجديدة"
            placeholder="Password123!"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.newPassword?.message}
            leftIcon={<LockKeyhole size={18} />}
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
            placeholder="Password123!"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.confirmPassword?.message}
            leftIcon={<LockKeyhole size={18} />}
            fullWidth
          />
        )}
      />

      <View className="flex-row-reverse gap-3">
        <View className="flex-1">
          <Button
            fullWidth
            variant="tertiary"
            onPress={() => setStep(ResetPasswordStep.Code)}
          >
            رجوع
          </Button>
        </View>
        <View className="flex-1">
          <Button fullWidth loading={isSubmitting} onPress={submitNewPassword}>
            تغيير كلمة المرور
          </Button>
        </View>
      </View>
    </View>
  );

  const renderSuccessStep = () => (
    <View className="items-center gap-4 py-4">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-success-100/15">
        <LockKeyhole size={28} color="#16A34A" />
      </View>
      <View className="gap-2">
        <Text variant="heading" weight="bold" rtlAlign="center">
          تم تغيير كلمة المرور بنجاح
        </Text>
        <Text size="sm" color="secondary" rtlAlign="center">
          يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
        </Text>
      </View>

      <Button
        fullWidth
        variant="primary"
        onPress={() => {
          router.replace("/(auth)/login");
        }}
      >
        الذهاب إلى تسجيل الدخول
      </Button>
    </View>
  );

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
                استعادة كلمة المرور
              </Text>
              <Text size="sm" color="secondary" rtlAlign="center">
                اتبع الخطوات التالية لإعادة تعيين كلمة المرور.
              </Text>
            </View>
          </View>

          <Card padding="lg" className="gap-5 border-gray-200 dark:border-dark-400">
            {renderStepIndicator()}
            {step === ResetPasswordStep.Phone && renderPhoneStep()}
            {step === ResetPasswordStep.Code && renderCodeStep()}
            {step === ResetPasswordStep.Password && renderPasswordStep()}
            {step === ResetPasswordStep.Success && renderSuccessStep()}
          </Card>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
