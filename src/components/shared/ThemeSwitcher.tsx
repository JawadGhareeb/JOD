import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import Text from "@/src/components/ui/Text";
import { applyColorScheme, type AppColorScheme } from "@/src/lib/theme";
import { getPrimaryColor } from "@/src/theme";

const LightModeIcon = appIcons.lightMode;
const DarkModeIcon = appIcons.darkMode;

type ThemeOption = {
  id: AppColorScheme;
  label: string;
  Icon: typeof LightModeIcon;
  previewBg: string;
  cardBg: string;
  headerBg: string;
  lineColors: [string, string, string];
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    label: "فاتح",
    Icon: LightModeIcon,
    previewBg: "#E5E7EB",
    cardBg: "#FFFFFF",
    headerBg: "#4A9782",
    lineColors: ["#D1D5DB", "#E5E7EB", "#F3F4F6"],
  },
  {
    id: "dark",
    label: "داكن",
    Icon: DarkModeIcon,
    previewBg: "#111827",
    cardBg: "#1f222b",
    headerBg: "#4A9782",
    lineColors: ["#4B5563", "#374151", "#35383f"],
  },
];

function ThemePreviewMock({ option }: { option: ThemeOption }) {
  return (
    <View
      className="overflow-hidden rounded-xl p-2"
      style={{ backgroundColor: option.previewBg }}
    >
      <View className="mb-2 h-3 rounded-sm" style={{ backgroundColor: option.headerBg }} />
      <View className="rounded-lg p-2" style={{ backgroundColor: option.cardBg }}>
        <View
          className="mb-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: option.lineColors[0], width: "72%" }}
        />
        <View
          className="mb-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: option.lineColors[1], width: "92%" }}
        />
        <View
          className="h-1.5 rounded-full"
          style={{ backgroundColor: option.lineColors[2], width: "58%" }}
        />
      </View>
    </View>
  );
}

type ThemeOptionCardProps = {
  option: ThemeOption;
  selected: boolean;
  primaryColor: string;
  onSelect: (scheme: AppColorScheme) => void;
};

function ThemeOptionCard({ option, selected, primaryColor, onSelect }: ThemeOptionCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: selected ? 1 : 0,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [checkScale, selected]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onSelect(option.id);
  };

  return (
    <Pressable
      className="flex-1"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${option.label}${selected ? "، محدّد" : ""}`}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          borderColor: selected ? primaryColor : "transparent",
          borderWidth: 2,
        }}
        className="rounded-2xl bg-light-50 p-2 dark:bg-dark-400"
      >
        <View className="relative">
          <ThemePreviewMock option={option} />
          <Animated.View
            style={{
              transform: [{ scale: checkScale }],
              opacity: checkScale,
              backgroundColor: primaryColor,
            }}
            className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full"
          >
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
          </Animated.View>
        </View>

        <View className="mt-2 flex-row-reverse items-center justify-center gap-1.5">
          <option.Icon
            size={15}
            color={selected ? primaryColor : "#9CA3AF"}
            strokeWidth={2.25}
          />
          <Text
            weight={selected ? "semibold" : "medium"}
            size="xs"
            className={selected ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
          >
            {option.label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function ThemeSwitcher() {
  const { colorScheme } = useColorScheme();
  const themeMode: AppColorScheme = colorScheme === "dark" ? "dark" : "light";
  const primaryColor = getPrimaryColor(themeMode === "dark");

  const handleSelect = (scheme: AppColorScheme) => {
    if (scheme === themeMode) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    applyColorScheme(scheme);
  };

  return (
    <View className="flex-row-reverse gap-3">
      {THEME_OPTIONS.map((option) => (
        <ThemeOptionCard
          key={option.id}
          option={option}
          selected={themeMode === option.id}
          primaryColor={primaryColor}
          onSelect={handleSelect}
        />
      ))}
    </View>
  );
}
