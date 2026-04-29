import { useColorScheme } from "nativewind";
import React from "react";
import { Modal as RNModal, Pressable, ScrollView, View } from "react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Text from "./Text";

export type SelectionOption = {
  label: string;
  value: string;
  hint?: string;
  disabled?: boolean;
};

type SelectionModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  options: SelectionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

const CloseIcon = appIcons.close;

export default function SelectionModal({
  visible,
  title,
  description,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectionModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className={`max-h-[72%] w-full rounded-t-3xl ${
            isDark ? "bg-dark-500" : "bg-white"
          }`}
        >
          <View className="flex-row-reverse items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-400">
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-lg"
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
            >
              <CloseIcon size={18} color={isDark ? "#E5E7EB" : "#6B7280"} strokeWidth={2.25} />
            </Pressable>
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {title}
            </Text>
            <View className="h-8 w-8" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            {description ? (
              <Text size="xs" className="mb-3 leading-6 text-gray-500 dark:text-gray-300">
                {description}
              </Text>
            ) : null}

            <View className="gap-2">
              {options.map((option) => {
                const isSelected = selectedValue === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => onSelect(option.value)}
                    disabled={option.disabled}
                    className={`rounded-xl border px-3 py-3 ${
                      isSelected
                        ? "border-primary-400 bg-primary-400/10"
                        : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
                    } ${option.disabled ? "opacity-50" : "opacity-100"}`}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                  >
                    <View className="flex-row-reverse items-center justify-between gap-2">
                      <View className="flex-1">
                        <Text
                          size="xs"
                          weight={isSelected ? "semibold" : "regular"}
                          className={
                            isSelected
                              ? "text-primary-400"
                              : "text-dark-100 dark:text-light-50"
                          }
                        >
                          {option.label}
                        </Text>
                        {option.hint ? (
                          <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                            {option.hint}
                          </Text>
                        ) : null}
                      </View>
                      {isSelected ? (
                        <Text size="2xs" weight="medium" className="text-primary-400">
                          محدد
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
