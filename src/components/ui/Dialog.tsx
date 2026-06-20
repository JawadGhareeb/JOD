import { icons } from "@/src/constants";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "./Button";
import Card from "./Card";
import Text from "./Text";

type DialogTextColor =
  | "primary"
  | "secondary"
  | "light"
  | "dark"
  | "accent"
  | "error"
  | "success"
  | "warning";

export interface DialogButton {
  text: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "secondary" | "tertiary";
  loading?: boolean;
  className?: string;
}

export interface DialogProps {
  visible: boolean;
  title?: string;
  titleColor?: DialogTextColor;
  titleClassName?: string;
  message?: string;
  icon?: React.ReactNode;
  buttons?: DialogButton[];
  onClose?: () => void;
  cancelable?: boolean;
  showCloseButton?: boolean;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  titleColor,
  titleClassName,
  message,
  icon,
  buttons,
  onClose,
  cancelable = true,
  showCloseButton = false,
  children,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (cancelable && onClose) {
            onClose();
            return true;
          }
          return false;
        },
      );

      return () => backHandler.remove();
    }
  }, [visible, cancelable, onClose]);

  const handleBackdropPress = () => {
    if (cancelable && onClose) {
      onClose();
    }
  };

  const defaultButtons: DialogButton[] =
    buttons ||
    (children
      ? []
      : [
          {
            text: "موافق",
            onPress: () => {
              if (onClose) onClose();
            },
            variant: "primary",
          },
        ]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {
        if (cancelable && onClose) {
          onClose();
        }
      }}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="flex-1 items-center justify-center px-4">
          <Animated.View
            className="absolute inset-0"
            style={{
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
              opacity,
            }}
          />
        </View>
      </TouchableWithoutFeedback>

      <View className="absolute inset-0 items-center justify-center px-4">
        <TouchableWithoutFeedback>
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
            }}
            className="w-full max-w-sm"
          >
            <Card
              padding="lg"
              radius="xl"
              className={`${isDark ? "bg-dark-500" : "bg-white"} border-0 shadow-2xl`}
            >
              {showCloseButton && onClose && (
                <View className="absolute left-4 top-4 z-10">
                  <TouchableOpacity
                    onPress={onClose}
                    className={`h-8 w-8 items-center justify-center rounded-full ${isDark ? "bg-dark-400" : "bg-gray-100"}`}
                    activeOpacity={0.7}
                  >
                    <icons.x size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  </TouchableOpacity>
                </View>
              )}

              {icon && <View className="mb-4 items-center">{icon}</View>}

              {title && (
                <Text
                  size="lg"
                  weight="bold"
                  color={titleColor || (isDark ? "light" : "dark")}
                  rtlAlign="center"
                  className={["mb-3", titleClassName].filter(Boolean).join(" ")}
                >
                  {title}
                </Text>
              )}

              {children ? (
                children
              ) : (
                <Text
                  size="base"
                  weight="regular"
                  color={isDark ? "light" : "dark"}
                  rtlAlign="center"
                  className={`${title ? "" : "mb-4"} ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  {message}
                </Text>
              )}

              {defaultButtons.length > 0 && (
                <View
                  className={`mt-6 flex-row gap-3 ${defaultButtons.length === 1 ? "justify-center" : ""}`}
                >
                  {defaultButtons.map((button, index) => (
                    <View key={`${button.text}-${index}`} className={defaultButtons.length === 1 ? "" : "flex-1"}>
                      <Button
                        variant={button.variant || "primary"}
                        onPress={button.onPress}
                        loading={button.loading}
                        className={button.className}
                        fullWidth={defaultButtons.length === 1 ? false : true}
                      >
                        {button.text}
                      </Button>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default Dialog;
