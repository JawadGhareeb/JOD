import { Check } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getPrimaryColor } from "@/src/theme";

type VerifiedBadgeProps = {
  size?: number;
};

// Instagram-style scalloped "seal" badge, not a plain circle. Reuses
// lucide's BadgeCheck outline path, but drawn directly via react-native-svg
// instead of lucide's <Icon> wrapper — that wrapper applies one fill color
// to every child path, including the checkmark, which would make the
// checkmark disappear against a same-color seal (same problem as
// CircleHelp's "?" mark — see AppTopNav.tsx). Drawing the seal and the
// checkmark as two separate layers keeps the checkmark white on top.
export function VerifiedBadge({ size = 16 }: VerifiedBadgeProps) {
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  return (
    <View style={{ width: size, height: size }} accessibilityLabel="حساب موثق">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          fill={primaryColor}
        />
      </Svg>
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        className="items-center justify-center"
      >
        <Check size={size * 0.55} color="#FFFFFF" strokeWidth={3.5} />
      </View>
    </View>
  );
}
