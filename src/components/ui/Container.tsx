import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, ScrollViewProps, View, ViewProps } from "react-native";

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
}

const Container: React.FC<ContainerProps> = ({
  children,
  scrollable = false,
  scrollViewProps,
  className,
  style,
  ...rest
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const baseClassName = `flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`;
  const containerClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  if (scrollable) {
    return (
      <View className={containerClassName} style={style} {...rest}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
            paddingTop: 8,
            paddingHorizontal: 16,
            gap: 8,
          }}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={containerClassName} style={style} {...rest}>
      {children}
    </View>
  );
};

export default Container;
