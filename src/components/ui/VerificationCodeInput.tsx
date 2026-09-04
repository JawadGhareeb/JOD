import { useColorScheme } from "nativewind";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TextInput, View } from "react-native";

export type VerificationCodeInputHandle = {
  clear: () => void;
  focus: () => void;
};

type VerificationCodeInputProps = {
  length?: number;
  value?: string;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
};

const digitsOnly = (value: string, length: number) => value.replace(/\D/g, "").slice(0, length);

const VerificationCodeInput = forwardRef<VerificationCodeInputHandle, VerificationCodeInputProps>(function VerificationCodeInput(
  {
    length = 6,
    value,
    onComplete,
    onChange,
    disabled = false,
    error = false,
    autoFocus = true,
    className,
    inputClassName,
  },
  ref,
) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [internalValue, setInternalValue] = useState(() => digitsOnly(value ?? "", length));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const resolvedValue = value === undefined ? internalValue : digitsOnly(value, length);
  const code = Array.from({ length }, (_, index) => resolvedValue[index] ?? "");

  useEffect(() => {
    if (value !== undefined) setInternalValue(digitsOnly(value, length));
  }, [length, value]);

  useEffect(() => {
    if (!autoFocus || disabled) return;
    const timer = setTimeout(() => inputRefs.current[0]?.focus(), 80);
    return () => clearTimeout(timer);
  }, [autoFocus, disabled]);

  const publish = (next: string) => {
    const normalized = digitsOnly(next, length);
    if (value === undefined) setInternalValue(normalized);
    onChange?.(normalized);
    if (normalized.length === length) onComplete?.(normalized);
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      publish("");
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    },
    focus: () => inputRefs.current[Math.min(resolvedValue.length, length - 1)]?.focus(),
  }));

  const handleChangeText = (text: string, index: number) => {
    const pasted = digitsOnly(text, length);
    if (!pasted && text) return;

    if (pasted.length > 1) {
      const prefix = resolvedValue.slice(0, index);
      const next = `${prefix}${pasted}`.slice(0, length);
      publish(next);
      requestAnimationFrame(() => inputRefs.current[Math.min(next.length, length - 1)]?.focus());
      return;
    }

    const nextCode = [...code];
    nextCode[index] = pasted;
    publish(nextCode.join(""));
    if (pasted && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (index: number) => {
    const nextCode = [...code];
    if (nextCode[index]) {
      nextCode[index] = "";
      publish(nextCode.join(""));
      return;
    }
    if (index > 0) {
      nextCode[index - 1] = "";
      publish(nextCode.join(""));
      inputRefs.current[index - 1]?.focus();
    }
  };

  const borderClass = error
    ? "border-error-300"
    : isDark
      ? "border-dark-400"
      : "border-gray-200";

  return (
    <View className={`flex-row justify-center gap-2 ${className ?? ""}`} style={{ direction: "ltr" }}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(node) => { inputRefs.current[index] = node; }}
          className={`h-12 w-12 rounded-xl border text-center text-xl font-bold ${borderClass} ${isDark ? "bg-dark-500 text-light-50" : "bg-white text-gray-900"} ${inputClassName ?? ""}`}
          value={digit}
          editable={!disabled}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace") handleBackspace(index);
          }}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={length}
          selectTextOnFocus
          accessibilityLabel={`رقم ${index + 1} من رمز التحقق`}
          accessibilityState={{ disabled }}
        />
      ))}
    </View>
  );
});

export default VerificationCodeInput;
