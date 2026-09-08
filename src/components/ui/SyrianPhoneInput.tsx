import type { ComponentProps } from "react";
import { PhoneCall } from "lucide-react-native";
import { View } from "react-native";
import Input from "./Input";
import Text from "./Text";
import { getSyrianPhoneSubscriber, SYRIAN_PHONE_PREFIX } from "@/src/lib/syrian-phone";

type SyrianPhoneInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChangeText" | "keyboardType" | "leftIcon" | "maxLength"
> & {
  value: string;
  onChangeText: (value: string) => void;
};

export default function SyrianPhoneInput({
  value,
  onChangeText,
  placeholder = "9XXXXXXXX",
  style,
  ...props
}: SyrianPhoneInputProps) {
  const subscriber = getSyrianPhoneSubscriber(value);

  return (
    <Input
      {...props}
      value={subscriber}
      onChangeText={(text) => {
        const digits = text.replace(/\D/g, "").slice(0, 9);
        onChangeText(digits ? `${SYRIAN_PHONE_PREFIX}${digits}` : "");
      }}
      keyboardType="phone-pad"
      maxLength={9}
      placeholder={placeholder}
      leftIcon={(
        <View className="flex-row items-center gap-1">
          <Text size="xs">🇸🇾</Text>
          <Text size="xs" weight="semibold" className="text-primary-400">+963</Text>
          <PhoneCall size={16} />
        </View>
      )}
      inputContainerClassName="flex-row"
      inputClassName="text-left"
      style={[{ textAlign: "left", writingDirection: "ltr" }, style]}
    />
  );
}
