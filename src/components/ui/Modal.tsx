import { icons } from "@/src/constants/icons";
import { useColorScheme } from "nativewind";
import React from "react";
import {
  Pressable,
  Modal as RNModal,
  ModalProps as RNModalProps,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./Text";

interface ModalProps extends RNModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
  visible,
  ...props
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const XIcon = icons.x;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      {...props}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className={`rounded-t-3xl w-full h-[65%] ${
            isDark ? "bg-dark-500" : "bg-white"
          }`}
        >
          {title && (
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-dark-400">
              <Text size="sm" weight="semibold" rtlAlign="left">
                {title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <XIcon size={18} color={isDark ? "#E5E7EB" : "#6B7280"} />
              </TouchableOpacity>
            </View>
          )}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={true}
          >
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

export default Modal;
