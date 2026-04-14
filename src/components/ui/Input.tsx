import { useRTL } from "@/src/providers/RTLProvider";
import { useColorScheme } from "nativewind";
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "../../constants/fonts";
import { StatusIcon } from "./InputIcons";
import Text from "./Text";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: "default";
  size?: "small" | "medium";
  fullWidth?: boolean;
  showStatusIcon?: boolean;
  className?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = "default",
  size = "small",
  fullWidth = false,
  showStatusIcon = true,
  className,
  inputClassName,
  inputContainerClassName,
  labelClassName,
  errorClassName,
  helperTextClassName,
  secureTextEntry,
  value,
  keyboardType,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation values
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const errorAnimation = useRef(new Animated.Value(0)).current;
  const labelAnimation = useRef(new Animated.Value(0)).current;
  const leftIconScale = useRef(new Animated.Value(1)).current;
  const rightIconScale = useRef(new Animated.Value(1)).current;
  const statusIconAnimation = useRef(new Animated.Value(0)).current;

  // Track value for status icon
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue && currentValue.length > 0;

  // Handle focus animations
  useEffect(() => {
    Animated.parallel([
      Animated.spring(focusAnimation, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: false,
        tension: 80,
        friction: 8,
      }),
      Animated.spring(labelAnimation, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 7,
      }),
      Animated.spring(leftIconScale, {
        toValue: isFocused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Handle error animations
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(errorAnimation, {
          toValue: 0,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Animate status icon on state change
  useEffect(() => {
    Animated.spring(statusIconAnimation, {
      toValue: isFocused || error || hasValue ? 1 : 0,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, error, hasValue]);

  // Handle right icon press animation
  const handleRightIconPress = () => {
    Animated.sequence([
      Animated.spring(rightIconScale, {
        toValue: 0.85,
        useNativeDriver: true,
        tension: 200,
        friction: 3,
      }),
      Animated.spring(rightIconScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
      }),
    ]).start();
    onRightIconPress?.();
  };

  const getIconColor = useCallback(() => {
    const defaultColor = isDark ? "#9CA3AF" : "#6B7280";
    const focusedColor = "#8B7FD7"; // Primary color
    return isFocused ? focusedColor : defaultColor;
  }, [isDark, isFocused]);

  const renderIconWithColor = useCallback(
    (icon: React.ReactNode) => {
      if (!icon || !isValidElement(icon)) {
        return icon;
      }

      const iconColor = getIconColor();
      return cloneElement(icon as React.ReactElement<any>, {
        color: iconColor,
      });
    },
    [getIconColor]
  );

  const getContainerClasses = (): string => {
    const baseClasses = fullWidth ? "w-full" : "w-auto";
    return `${baseClasses} ${className || ""}`.trim();
  };

  const getInputContainerClasses = (): string => {
    const baseClasses = "flex-row items-center gap-3 relative z-10";

    const sizeClasses = {
      small: "px-4 py-2",
      medium: "px-6 py-4",
    };

    const variantClasses = {
      default: `${isDark ? "bg-dark-500" : "bg-white"} border ${isDark ? "border-dark-400" : "border-gray-200"} rounded-xl shadow-sm`,
    };

    const focusClasses = isFocused
      ? "border-primary-400"
      : isDark
        ? "border-dark-400"
        : "border-gray-200";

    const errorClasses = error ? "border-error-400" : "";

    return [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      focusClasses,
      errorClasses,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getAnimatedContainerStyle = () => {
    const borderColor = focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        error ? "#EF4444" : isDark ? "#374151" : "#E5E7EB",
        error ? "#EF4444" : "#8B7FD7",
      ],
    });

    const shadowOpacity = focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.15],
    });

    const scale = focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.01],
    });

    return {
      borderColor,
      shadowColor: "#8B7FD7",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity,
      shadowRadius: 12,
      elevation: isFocused ? 5 : 2,
      transform: [{ scale }],
    };
  };

  const getInputClasses = (): string => {
    const baseClasses = `flex-1 ${isDark ? "text-light-50" : "text-gray-900"}`;

    const sizeClasses = {
      small: "text-xs min-h-[36px]",
      medium: "text-sm min-h-[44px]",
    };

    return [baseClasses, sizeClasses[size], inputClassName]
      .filter(Boolean)
      .join(" ");
  };

  const getInputStyle = () => {
    return {
      fontFamily: FONTS.noto.regular,
      textAlign: (isRTL ? "right" : "left") as "right" | "left",
    };
  };

  const getLabelProps = () => ({
    size: "xs" as const,
    weight: "semibold" as const,
    color: "dark" as const,
    className:
      `mb-2 ${labelClassName || ""} ${isDark ? "text-light-50" : "text-dark-100"}`.trim(),
  });

  const getLabelStyle = () => {
    const translateY = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2],
    });

    return {
      transform: [{ translateY }],
    };
  };

  const getErrorProps = () => ({
    size: "xs" as const,
    color: "error" as const,
    className: `mt-1 ${errorClassName || ""}`.trim(),
  });

  const getHelperTextProps = () => ({
    size: "xs" as const,
    color: "dark" as const,
    className: `mt-1 ${helperTextClassName || ""}`.trim(),
  });

  const getErrorStyle = () => {
    const translateX = errorAnimation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -10, 10, -5, 0],
    });

    return {
      transform: [{ translateX }],
    };
  };

  return (
    <View className={getContainerClasses()}>
      {label && (
        <Animated.View style={getLabelStyle()}>
          <Text {...getLabelProps()} rtlAlign={isRTL ? "left" : "right"}>
            {label}
          </Text>
        </Animated.View>
      )}

      <View className="relative">
        <Animated.View
          className={getInputContainerClasses() + " " + inputContainerClassName}
          style={getAnimatedContainerStyle()}
        >
          {/* Status Icon */}
          {showStatusIcon && !leftIcon && (
            <Animated.View
              style={{
                transform: [
                  { scale: leftIconScale },
                  {
                    scale: statusIconAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: statusIconAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              }}
            >
              <StatusIcon
                isFocused={isFocused}
                hasError={!!error}
                hasValue={!!hasValue}
                isDark={isDark}
                size={size}
                animation={statusIconAnimation}
              />
            </Animated.View>
          )}

          {/* Custom Left Icon */}
          {leftIcon && <View>{renderIconWithColor(leftIcon)}</View>}

          <TextInput
            className={getInputClasses()}
            style={getInputStyle()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => {
              setInternalValue(text);
              props.onChangeText?.(text);
            }}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              onPress={handleRightIconPress}
              disabled={!onRightIconPress}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: rightIconScale }] }}>
                {rightIcon}
              </Animated.View>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {error && (
        <Animated.View style={getErrorStyle()}>
          <Text
            {...getErrorProps()}
            className=""
            rtlAlign={isRTL ? "left" : "right"}
          >
            {error}
          </Text>
        </Animated.View>
      )}
      {helperText && !error && (
        <Text {...getHelperTextProps()} rtlAlign={isRTL ? "left" : "right"}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
