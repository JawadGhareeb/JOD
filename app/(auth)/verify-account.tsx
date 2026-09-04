import { useLocalSearchParams, useRouter } from "expo-router";
import { MailCheck } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import VerificationCodeInput, { type VerificationCodeInputHandle } from "@/src/components/ui/VerificationCodeInput";
import { useResendAccountVerification, useVerifyAccount } from "@/src/features/auth/queries";
import { ApiClientError } from "@/src/lib/api-client";
import { useToast } from "@/src/providers/ToastProvider";

const readParam = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;
const asSeconds = (value?: string) => Math.max(0, Number.parseInt(value ?? "0", 10) || 0);

export default function VerifyAccountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ login?: string | string[]; expiresIn?: string | string[]; resendAvailableIn?: string | string[] }>();
  const login = readParam(params.login) ?? "";
  const inputRef = useRef<VerificationCodeInputHandle>(null);
  const verifyMutation = useVerifyAccount();
  const resendMutation = useResendAccountVerification();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [expiresIn, setExpiresIn] = useState(() => asSeconds(readParam(params.expiresIn)));
  const [resendIn, setResendIn] = useState(() => asSeconds(readParam(params.resendAvailableIn)));

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((value) => Math.max(0, value - 1));
      setResendIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!login) router.replace("/(auth)/login");
  }, [login, router]);

  const verify = async () => {
    if (code.length !== 6 || !login) return;
    setError("");
    try {
      await verifyMutation.mutateAsync({ login, code });
      toast.success("تم تفعيل حسابك بنجاح.", "مرحباً بك في جود");
      router.replace("/(tabs)/home");
    } catch (caught) {
      if (caught instanceof ApiClientError) {
        if (caught.code === "verification_code_expired" || caught.code === "verification_attempts_exceeded") {
          inputRef.current?.clear();
          setCode("");
          setExpiresIn(0);
        }
        if (caught.code === "account_already_verified") {
          router.replace("/(auth)/login");
          return;
        }
        setError(caught.code === "invalid_verification_code" ? "رمز التحقق غير صحيح." : caught.message);
      } else {
        setError("تعذر التحقق من الرمز. حاول مرة أخرى.");
      }
    }
  };

  const resend = async () => {
    if (!login || resendIn > 0) return;
    setError("");
    try {
      const result = await resendMutation.mutateAsync(login);
      inputRef.current?.clear();
      setCode("");
      setExpiresIn(result.expiresIn);
      setResendIn(result.resendAvailableIn);
      toast.success("تم إرسال رمز تحقق جديد.");
    } catch (caught) {
      if (caught instanceof ApiClientError) {
        const retryAfter = Number(caught.details?.retryAfter ?? 0);
        if (caught.code === "verification_throttled" && retryAfter > 0) setResendIn(retryAfter);
        if (caught.code === "account_already_verified") {
          router.replace("/(auth)/login");
          return;
        }
        setError(caught.message);
      } else {
        setError("تعذر إعادة إرسال الرمز.");
      }
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <KeyboardAvoider className="flex-1">
      <Container scrollable className="bg-light-100 dark:bg-dark-300" scrollViewProps={{ contentContainerStyle: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 16, paddingVertical: 32 } }}>
        <View className="gap-5">
          <View className="items-center gap-3">
            <Logo variant="medium" showName />
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-400/15"><MailCheck size={28} color="#4A9782" /></View>
            <Text variant="heading" weight="bold" rtlAlign="center">تفعيل الحساب</Text>
            <Text size="sm" rtlAlign="center" className="leading-6 text-gray-600 dark:text-gray-300">أدخل رمز التحقق المكوّن من 6 أرقام المرسل إلى {login}.</Text>
          </View>
          <Card padding="lg" className="gap-5 rounded-3xl border-gray-200 dark:border-dark-400">
            <VerificationCodeInput ref={inputRef} value={code} onChange={(value) => { setCode(value); setError(""); }} onComplete={setCode} disabled={verifyMutation.isPending} error={Boolean(error)} />
            {error ? <Text size="xs" color="error" rtlAlign="center">{error}</Text> : null}
            <Text size="xs" rtlAlign="center" className="text-gray-500 dark:text-gray-300">{expiresIn > 0 ? `تنتهي صلاحية الرمز خلال ${formatTime(expiresIn)}` : "انتهت صلاحية رمز التحقق. اطلب رمزاً جديداً."}</Text>
            <Button fullWidth disabled={code.length !== 6 || expiresIn === 0 || verifyMutation.isPending} loading={verifyMutation.isPending} onPress={verify}>تحقق من الرمز</Button>
            <Button fullWidth variant="tertiary" disabled={resendIn > 0 || resendMutation.isPending} loading={resendMutation.isPending} onPress={resend}>{resendIn > 0 ? `إعادة الإرسال بعد ${formatTime(resendIn)}` : "إعادة إرسال الرمز"}</Button>
            <Text size="xs" color="primary" rtlAlign="center" onPress={() => router.replace("/(auth)/login")}>العودة إلى تسجيل الدخول</Text>
          </Card>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
