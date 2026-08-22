import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Check, LockKeyhole, Mail } from "lucide-react-native";
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
import {
  useForgotPassword,
  useResetPassword,
  useVerifyResetCode,
} from "@/src/features/auth/queries";
import { applyApiFormErrors } from "@/src/lib/api-error-utils";

// Server requires exactly 6 characters for the reset code (see
// VerifyResetCodeRequest / ResetPasswordRequest in MOBILE_API_CONTRACT.md).
const VERIFICATION_CODE_LENGTH = 6;
const emailSchema = z.string().trim().email();

enum ResetPasswordStep {
  Email = 1,
  Code = 2,
  Password = 3,
  Success = 4,
}

const buildResetPasswordSchema = (step: ResetPasswordStep) =>
  z
    .object({
      login: z.string().trim().optional(),
      code: z.string().trim().optional(),
      newPassword: z.string().trim().optional(),
      confirmPassword: z.string().trim().optional(),
    })
    .superRefine((values, context) => {
      if (step === ResetPasswordStep.Email) {
        if (!values.login?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["login"],
            message: "البريد الإلكتروني مطلوب",
          });
          return;
        }

        if (!emailSchema.safeParse(values.login.trim()).success) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["login"],
            message: "صيغة البريد الإلكتروني غير صحيحة",
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
  login: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<ResetPasswordStep>(ResetPasswordStep.Email);
  const [stepError, setStepError] = useState("");
  const forgotPasswordMutation = useForgotPassword();
  const verifyResetCodeMutation = useVerifyResetCode();
  const resetPasswordMutation = useResetPassword();
  const resetPasswordSchema = useMemo(
    () => buildResetPasswordSchema(step),
    [step],
  );

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: "onTouched",
  });

  const login = watch("login");

  const goBackToStep = (previousStep: ResetPasswordStep) => {
    setStepError("");
    setStep(previousStep);
  };

  const goToCodeStep = handleSubmit(async (values) => {
    setStepError("");

    try {
      await forgotPasswordMutation.mutateAsync(values.login!.trim());
      setStep(ResetPasswordStep.Code);
    } catch (error) {
      const message = applyApiFormErrors(error, setError, { login: "login" });
      if (message) setStepError(message);
    }
  });

  const goToPasswordStep = handleSubmit(async (values) => {
    setStepError("");

    try {
      await verifyResetCodeMutation.mutateAsync({
        login: values.login!.trim(),
        code: values.code!.trim(),
      });
      setStep(ResetPasswordStep.Password);
    } catch (error) {
      const message = applyApiFormErrors(error, setError, { login: "login" });
      if (message) setStepError(message);
    }
  });

  const submitNewPassword = handleSubmit(async (values) => {
    setStepError("");

    try {
      await resetPasswordMutation.mutateAsync({
        login: values.login!.trim(),
        code: values.code!.trim(),
        password: values.newPassword!,
        password_confirmation: values.confirmPassword!,
      });
      setStep(ResetPasswordStep.Success);
    } catch (error) {
      const message = applyApiFormErrors(error, setError, {
        password_confirmation: "confirmPassword",
      });
      if (message) setStepError(message);
    }
  });

  const renderStepIndicator = () => {
    const steps = [
      { id: ResetPasswordStep.Email, label: "البريد الإلكتروني" },
      { id: ResetPasswordStep.Code, label: "الرمز" },
      { id: ResetPasswordStep.Password, label: "كلمة المرور" },
      { id: ResetPasswordStep.Success, label: "النتيجة" },
    ];

    return (
      <View className="flex-row-reverse items-start">
        {steps.map((item, index) => {
          const isActive = item.id === step;
          const isCompleted = item.id < step;
          const isFinished = step === ResetPasswordStep.Success && item.id <= ResetPasswordStep.Password;
          const shouldHighlight = isActive || isCompleted || isFinished;

          return (
            <Fragment key={item.id}>
              <View key={item.id} className="flex-1 items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-primary-400"
                      : shouldHighlight
                        ? "bg-success-500"
                        : "bg-gray-200 dark:bg-dark-400"
                  }`}
                >
                  {shouldHighlight && !isActive ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Text
                      size="xs"
                      weight="bold"
                      color={isActive || shouldHighlight ? "light" : "dark"}
                    >
                      {item.id}
                    </Text>
                  )}
                </View>
                <Text
                  size="2xs"
                  weight="medium"
                  rtlAlign="center"
                  className={`mt-2 ${
                    shouldHighlight
                      ? "text-success-600 dark:text-success-400"
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
                      ? "bg-success-500"
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

  const renderEmailStep = () => (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="heading" weight="bold" rtlAlign="center">
          إعادة تعيين كلمة المرور
        </Text>
        <Text size="sm" color="secondary" rtlAlign="center">
          أدخل بريدك الإلكتروني لإرسال رمز التحقق.
        </Text>
      </View>

      <Controller
        control={control}
        name="login"
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
            error={errors.login?.message}
            leftIcon={<Mail size={18} />}
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
          أدخل الرمز المرسل إلى {login || "بريدك الإلكتروني"}.
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
            onPress={() => goBackToStep(ResetPasswordStep.Email)}
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
            placeholder="أدخل كلمة المرور الجديدة"
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
            placeholder="أعد إدخال كلمة المرور الجديدة"
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
            onPress={() => goBackToStep(ResetPasswordStep.Code)}
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

            {stepError ? (
              <Text size="sm" color="error" rtlAlign="center">
                {stepError}
              </Text>
            ) : null}

            {step === ResetPasswordStep.Email && renderEmailStep()}
            {step === ResetPasswordStep.Code && renderCodeStep()}
            {step === ResetPasswordStep.Password && renderPasswordStep()}
            {step === ResetPasswordStep.Success && renderSuccessStep()}
          </Card>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
