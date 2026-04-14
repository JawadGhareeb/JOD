import { useColorScheme } from "nativewind";
import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface VerificationCodeInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  className?: string;
  inputClassName?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 4,
  onComplete,
  onChange,
  className,
  inputClassName,
}) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<TextInput[]>([]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleChangeText = (text: string, index: number) => {
    // Only allow single digit
    if (text.length > 1) {
      text = text.slice(-1);
    }

    // Update code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Call onChange if provided
    if (onChange) {
      onChange(newCode.join(""));
    }

    // Move to next input if digit entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all digits filled
    if (newCode.every((digit) => digit !== "") && onComplete) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Clear current input when focused
    const newCode = [...code];
    newCode[index] = "";
    setCode(newCode);
  };

  return (
    <View className={`flex-row justify-center gap-2 ${className || ""}`}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          className={`
            w-12 h-12 
            text-center 
            text-xl 
            font-bold 
            rounded-lg 
            border
            ${isDark ? "bg-dark-500 border-dark-400 text-light-50" : "bg-white border-gray-200 text-gray-900"}
            ${inputClassName || ""}
          `}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          onFocus={() => handleFocus(index)}
          keyboardType="number-pad"
          maxLength={1}
          placeholder={"•"}
          placeholderTextColor={isDark ? "#6B7280" : "#A0A0A0"}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default VerificationCodeInput;
