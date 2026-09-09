import type { ComponentProps } from "react";
import { View } from "react-native";
import Input from "./Input";
import Text from "./Text";
import { getSyrianPhoneSubscriber, SYRIAN_PHONE_PREFIX } from "@/src/lib/syrian-phone";

const DEFAULT_HELPER_TEXT = "أدخل 9 أرقام فقط بعد +963 من دون صفر في البداية، ويجب أن يكون الرقم مرتبطاً بحساب واتساب.";

type SyrianPhoneInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChangeText" | "keyboardType" | "leftIcon" | "maxLength" | "inputContainerStyle"
> & {
  value: string;
  onChangeText: (value: string) => void;
};

export default function SyrianPhoneInput({
  value,
  onChangeText,
  placeholder = "9XXXXXXXX",
  helperText = DEFAULT_HELPER_TEXT,
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
      helperText={helperText}
      showStatusIcon={false}
      leftIcon={(
        <View style={{ flexDirection: "row" }}>
          <Text
            size="xs"
            weight="semibold"
            className="text-primary-400"
            style={{ writingDirection: "ltr" }}
          >
            +963
          </Text>
        </View>
      )}
      inputContainerStyle={{ flexDirection: "row" }}
      inputClassName="text-left"
      style={[{ textAlign: "left", writingDirection: "ltr" }, style]}
    />
  );
}
