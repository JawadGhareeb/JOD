import { useColorScheme } from "nativewind";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Text from "./Text";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...props
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconScale = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (!loading && !disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(iconScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, disabled]);

  const getButtonClasses = (): string => {
    const baseClasses =
      "flex-row items-center justify-center gap-2 rounded-md";

    const sizeClasses = {
      small: "px-5 py-2 min-h-[36px]",
      medium: "px-7 py-3 min-h-[44px]",
      large: "px-9 py-4 min-h-[52px]",
    };

    const variantClasses = {
      primary: "bg-primary-400 shadow-lg shadow-primary-400/30",
      tertiary: isDark
        ? "border border-dark-400 bg-dark-500 shadow-lg shadow-dark-400/30"
        : "border border-gray-200 bg-white shadow-lg shadow-gray-200/50",
      secondary: isDark
        ? "bg-primary-400/20 shadow-lg shadow-dark-400/30"
        : "bg-primary-100 shadow-lg shadow-gray-200/50",
      outline: isDark
        ? "border border-primary-200 bg-dark-200 shadow-lg shadow-dark-300/30"
        : "border border-primary-200 bg-light-100 shadow-lg shadow-gray-200/50",
    } as const;

    const fullWidthClasses = fullWidth ? "w-full" : "";

    return [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidthClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getTextProps = () => {
    const sizeProps = {
      small: { size: "2xs" as const },
      medium: { size: "xs" as const },
      large: { size: "sm" as const },
    };

    const variantProps: Record<
      NonNullable<ButtonProps["variant"]>,
      {
        color?:
          | "primary"
          | "secondary"
          | "light"
          | "dark"
          | "accent"
          | "error"
          | "success"
          | "warning";
      }
    > = {
      primary: { color: "light" },
      outline: { color: "primary" },
      secondary: { color: "primary" },
      tertiary: { color: isDark ? "light" : "dark" },
    };

    return {
      weight: "semibold" as const,
      align: "center" as const,
      ...sizeProps[size],
      ...variantProps[variant],
    };
  };

  const getSpinnerColor = (): string => {
    const spinnerColors = {
      primary: "#FFFFFF",
      tertiary: isDark ? "#FFFFFF" : "#212121",
      secondary: "#405d72",
      outline: "#405d72",
    } as const;
    return spinnerColors[variant];
  };

  return (
    <TouchableOpacity
      className={`${disabled || loading ? "opacity-60" : "opacity-100"}`}
      disabled={disabled || loading}
      activeOpacity={0.95}
      {...props}
    >
      <View className={getButtonClasses()}>
        {loading ? (
          <ActivityIndicator size="small" color={getSpinnerColor()} />
        ) : (
          <>
            {leftIcon && (
              <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                {leftIcon}
              </Animated.View>
            )}
            <Text {...getTextProps()} className="flex-1 text-center">
              {children}
            </Text>
            {rightIcon && (
              <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                {rightIcon}
              </Animated.View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
