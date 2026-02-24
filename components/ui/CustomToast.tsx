import { ToastStyle } from "@/types/toast.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CustomToastProps {
  type: "success" | "error" | "warning" | "info";
  text1: string;
  text2: string;
  onPress?: () => void;
  onHide?: () => void;
  customIcon?: React.ReactNode;
}

const getNotificationStyle = (
  type: CustomToastProps["type"],
  colorScheme: "light" | "dark"
): ToastStyle & { gradientColors: [string, string]; borderWidth: number } => {
  const isDark = colorScheme === "dark";

  const styles: Record<
    CustomToastProps["type"],
    ToastStyle & { gradientColors: [string, string]; borderWidth: number }
  > = {
    success: {
      backgroundColor: isDark ? "#1f222b" : "#FFFFFF",
      borderColor: "#10B981",
      iconColor: "#10B981",
      textColor: isDark ? "#F9FAFB" : "#000000",
      icon: <Ionicons name="checkmark-circle" size={24} color="#10B981" />,
      gradientColors: ["#10B981", "#34D399"] as [string, string],
      borderWidth: 4,
    },
    error: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderColor: "#EF4444",
      iconColor: "#EF4444",
      textColor: isDark ? "#FFFFFF" : "#9CA3AF",
      icon: <Ionicons name="close-circle" size={24} color="#EF4444" />,
      gradientColors: ["#EF4444", "#F87171"] as [string, string],
      borderWidth: 4,
    },
    warning: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderColor: "#F59E0B",
      iconColor: "#F59E0B",
      textColor: isDark ? "#F9FAFB" : "#000000",
      icon: <Ionicons name="warning" size={24} color="#F59E0B" />,
      gradientColors: ["#F59E0B", "#FBBF24"] as [string, string],
      borderWidth: 4,
    },
    info: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderColor: "#3B82F6",
      iconColor: "#3B82F6",
      textColor: isDark ? "#F9FAFB" : "#000000",
      icon: <Ionicons name="information-circle" size={24} color="#3B82F6" />,
      gradientColors: ["#3B82F6", "#60A5FA"] as [string, string],
      borderWidth: 4,
    },
  };

  return styles[type];
};

export const CustomToast: React.FC<CustomToastProps> = ({
  type,
  text1,
  text2,
  onPress,
  onHide,
  customIcon,
}) => {
  const { colorScheme } = useColorScheme();
  const notificationStyle = getNotificationStyle(type, colorScheme || "light");

  return (
    <View className="flex-row rounded-xl shadow-lg overflow-hidden mb-2 mx-4">
      {/* Gradient Border (Left Side) */}
      <LinearGradient
        colors={notificationStyle.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ width: notificationStyle.borderWidth }}
      />

      {/* Content */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="flex-1"
        style={{
          backgroundColor: notificationStyle.backgroundColor,
        }}
      >
        <View className="flex-row items-start p-4">
          <View className="mr-3 mt-0.5">
            {customIcon || notificationStyle.icon}
          </View>

          <View className="flex-1">
            <Text
              className="text-base font-semibold mb-1"
              style={{ color: notificationStyle.textColor }}
            >
              {text1}
            </Text>
            <Text
              className="text-sm opacity-70 leading-5"
              style={{ color: notificationStyle.textColor }}
            >
              {text2}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onHide}
            className="ml-2 p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={20}
              color={notificationStyle.textColor}
              style={{ opacity: 0.8 }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};
