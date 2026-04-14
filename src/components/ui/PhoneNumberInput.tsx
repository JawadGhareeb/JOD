import { useRTL } from "@/src/providers/RTLProvider";
import { useColorScheme } from "nativewind";
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { ICountrySelectStyle } from "react-native-country-select";
import PhoneInput, {
  getCountryByCca2,
  getCountryByPhoneNumber,
  type ICountry,
  type PhoneInputProps as RNPhoneInputProps,
} from "react-native-international-phone-number";
import type { IPhoneInputStyles } from "react-native-international-phone-number/lib/interfaces/phoneInputStyles";
import { FONTS } from "../../constants/fonts";
import Text from "./Text";

interface PhoneNumberInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  defaultCountry?: ICountry["cca2"] | string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  className?: string;
  inputContainerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  phoneInputProps?: Omit<
    Partial<RNPhoneInputProps>,
    | "value"
    | "defaultValue"
    | "selectedCountry"
    | "onChangeSelectedCountry"
    | "onChangePhoneNumber"
  >;
  onCountryChange?: (country: ICountry) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  error,
  helperText,
  value,
  onChange,
  onBlur,
  placeholder = "أدخل رقم هاتفك",
  defaultCountry = "SY",
  size = "small",
  fullWidth = false,
  className,
  inputContainerClassName = "",
  labelClassName,
  errorClassName,
  helperTextClassName,
  leftIcon,
  rightIcon,
  onRightIconPress,
  phoneInputProps,
  onCountryChange,
}) => {
  const { isRTL } = useRTL();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [nationalNumber, setNationalNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const focusAnimation = useRef(new Animated.Value(0)).current;
  const errorAnimation = useRef(new Animated.Value(0)).current;
  const labelAnimation = useRef(new Animated.Value(0)).current;
  const rightIconScale = useRef(new Animated.Value(1)).current;
  const iconColorAnimation = useRef(new Animated.Value(0)).current;

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
      Animated.spring(iconColorAnimation, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: false,
        tension: 100,
        friction: 5,
      }),
    ]).start();
  }, [focusAnimation, labelAnimation, iconColorAnimation, isFocused]);

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
  }, [error, errorAnimation]);

  const getContainerClasses = useCallback(() => {
    const baseClasses = fullWidth ? "w-full" : "w-auto";
    return `${baseClasses} ${className || ""}`.trim();
  }, [className, fullWidth]);

  const getInputContainerClasses = useCallback(() => {
    const baseClasses = "flex-row items-center gap-3 relative z-10";

    const sizeClasses = {
      small: "px-4 py-2",
      medium: "px-6 py-4",
    };

    const variantClasses = {
      default: `${
        isDark ? "bg-dark-500" : "bg-white"
      } border ${isDark ? "border-dark-400" : "border-gray-200"} rounded-xl shadow-sm`,
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
      variantClasses.default,
      focusClasses,
      errorClasses,
      inputContainerClassName,
    ]
      .filter(Boolean)
      .join(" ");
  }, [error, inputContainerClassName, isDark, isFocused, size]);

  const getAnimatedContainerStyle = useCallback(() => {
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

    return {
      borderColor,
      shadowColor: "#8B7FD7",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity,
      shadowRadius: 12,
      elevation: isFocused ? 5 : 2,
    };
  }, [error, focusAnimation, isDark, isFocused]);

  const getLabelProps = useCallback(
    () => ({
      size: "xs" as const,
      weight: "semibold" as const,
      color: "dark" as const,
      className: `mb-2 ${labelClassName || ""} ${
        isDark ? "text-light-50" : "text-dark-100"
      }`.trim(),
    }),
    [isDark, labelClassName]
  );

  const getLabelStyle = useCallback(() => {
    const translateY = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2],
    });

    return {
      transform: [{ translateY }],
    };
  }, [labelAnimation]);

  const getErrorProps = useCallback(
    () => ({
      size: "xs" as const,
      color: "error" as const,
      className: `mt-1 ${errorClassName || ""}`.trim(),
    }),
    [errorClassName]
  );

  const getHelperTextProps = useCallback(
    () => ({
      size: "xs" as const,
      color: "dark" as const,
      className: `mt-1 ${helperTextClassName || ""}`.trim(),
    }),
    [helperTextClassName]
  );

  const getErrorStyle = useCallback(() => {
    const translateX = errorAnimation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -10, 10, -5, 0],
    });

    return {
      transform: [{ translateX }],
    };
  }, [errorAnimation]);

  const normalizedDefaultCountry = useMemo(
    () => defaultCountry?.toUpperCase() ?? undefined,
    [defaultCountry]
  );

  const defaultCountryData = useMemo(() => {
    if (!normalizedDefaultCountry) {
      return undefined;
    }

    try {
      return getCountryByCca2(normalizedDefaultCountry);
    } catch {
      return undefined;
    }
  }, [normalizedDefaultCountry]);

  useEffect(() => {
    if (!selectedCountry && defaultCountryData) {
      setSelectedCountry(defaultCountryData);
    }
  }, [defaultCountryData, selectedCountry]);

  const extractNationalNumber = useCallback(
    (fullNumber: string, country?: ICountry) => {
      if (!fullNumber) {
        return "";
      }

      const condensed = fullNumber.replace(/\s/g, "");
      if (!country?.idd?.root) {
        return condensed.replace(/^\+/, "");
      }

      const callingCode = country.idd.root.replace(/\s/g, "");
      let remainder = condensed;

      if (callingCode && remainder.startsWith(callingCode)) {
        remainder = remainder.slice(callingCode.length);
      } else if (callingCode.startsWith("+")) {
        const withoutPlus = callingCode.slice(1);
        if (remainder.startsWith(withoutPlus)) {
          remainder = remainder.slice(withoutPlus.length);
        }
      }

      return remainder.replace(/^\+/, "");
    },
    []
  );

  useEffect(() => {
    if (!value) {
      setNationalNumber("");
      return;
    }

    const normalizedValue = value.startsWith("+") ? value : `+${value}`;
    const matchedCountry = getCountryByPhoneNumber(normalizedValue);
    const countryToUse =
      matchedCountry || selectedCountry || defaultCountryData;

    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
      onCountryChange?.(matchedCountry);
    }

    const national = extractNationalNumber(normalizedValue, countryToUse);
    setNationalNumber((prev) => (prev === national ? prev : national));
  }, [
    defaultCountryData,
    extractNationalNumber,
    onCountryChange,
    selectedCountry,
    value,
  ]);

  const applyFullNumber = useCallback(
    (country: ICountry | undefined, digits: string) => {
      if (!country?.idd?.root || !digits) {
        onChange("");
        return;
      }

      const callingCode = country.idd.root.replace(/\s/g, "");
      const prefix = callingCode.startsWith("+")
        ? callingCode
        : `+${callingCode}`;
      const composed = `${prefix}${digits}`;
      onChange(composed);
    },
    [onChange]
  );

  const handlePhoneChange = useCallback(
    (phone: string) => {
      setNationalNumber(phone);

      const digits = phone.replace(/\D/g, "");
      if (!digits) {
        onChange("");
        return;
      }

      applyFullNumber(selectedCountry || defaultCountryData, digits);
    },
    [applyFullNumber, defaultCountryData, onChange, selectedCountry]
  );

  const handleCountryChange = useCallback(
    (country: ICountry) => {
      setSelectedCountry(country);
      setNationalNumber("");
      onChange("");
      onCountryChange?.(country);
    },
    [onChange, onCountryChange]
  );

  const handleRightIconPress = useCallback(() => {
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
  }, [onRightIconPress, rightIconScale]);

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

  const containerBackgroundColor = useMemo(
    () => (isDark ? "#1f222b" : "#FFFFFF"),
    [isDark]
  );

  const dividerColor = useMemo(
    () => (isDark ? "#35383f" : "#E5E7EB"),
    [isDark]
  );

  const textColor = useMemo(() => (isDark ? "#E5E7EB" : "#111827"), [isDark]);

  const phoneInputStyles = useMemo<IPhoneInputStyles>(() => {
    const containerStyle: ViewStyle = {
      flex: 1,
      borderWidth: 0,
      backgroundColor: containerBackgroundColor,
      minHeight: size === "small" ? 36 : 44,
      paddingHorizontal: 0,
      paddingVertical: 0,
      justifyContent: "flex-start",
      borderRadius: 12,
    };

    const flagContainerStyle: ViewStyle = {
      backgroundColor: containerBackgroundColor,
      paddingHorizontal: 10,
      paddingVertical: 0,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    };

    const flagStyle: TextStyle = {
      fontSize: size === "small" ? 20 : 22,
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
    };

    const dividerStyle: ViewStyle = {
      height: "70%",
      marginLeft: isRTL ? 10 : 12,
      marginRight: isRTL ? 12 : 10,
      backgroundColor: dividerColor,
    };

    const callingCodeStyle: TextStyle = {
      fontFamily: FONTS.noto.medium,
      fontSize: size === "small" ? 12 : 14,
      color: textColor,
    };

    const inputStyle: TextStyle = {
      fontFamily: FONTS.noto.regular,
      fontSize: size === "small" ? 12 : 14,
      minHeight: size === "small" ? 36 : 44,
      color: textColor,
      textAlign: isRTL ? "right" : "left",
      paddingHorizontal: 0,
      paddingVertical: 0,
      backgroundColor: containerBackgroundColor,
    };

    return {
      container: containerStyle,
      flagContainer: flagContainerStyle,
      flag: flagStyle,
      divider: dividerStyle,
      callingCode: callingCodeStyle,
      input: inputStyle,
    };
  }, [containerBackgroundColor, dividerColor, isRTL, size, textColor]);

  const modalStyles = useMemo<ICountrySelectStyle>(() => {
    const surfaceColor = containerBackgroundColor;
    const borderColor = isDark ? "#35383f" : "#E5E7EB";

    const baseContainer: ViewStyle = {
      backgroundColor: surfaceColor,
    };

    const searchContainer: ViewStyle = {
      backgroundColor: surfaceColor,
      borderRadius: 12,
      borderWidth: 1,
      borderColor,
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    };

    const countryItemStyle: ViewStyle = {
      backgroundColor: surfaceColor,
      borderRadius: 12,
      borderWidth: 1,
      borderColor,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    };

    const searchTextStyle: TextStyle = {
      color: textColor,
      fontFamily: FONTS.noto.regular,
      textAlign: isRTL ? "right" : "left",
    };

    const countryNameStyle: TextStyle = {
      color: textColor,
      fontFamily: FONTS.noto.medium,
      fontSize: 12,
      textAlign: isRTL ? "left" : "right",
    };

    const callingCodeTextStyle: TextStyle = {
      color: isDark ? "#9CA3AF" : "#6B7280",
      fontFamily: FONTS.noto.regular,
      fontSize: 10,
      textAlign: isRTL ? "left" : "right",
    };

    const alphabetLetterStyle: ViewStyle = {
      backgroundColor: surfaceColor,
      borderRadius: 10,
      borderWidth: 1,
      borderColor,
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginBottom: 6,
    };

    const alphabetLetterActiveStyle: ViewStyle = {
      backgroundColor: isDark ? "#543acc" : "#e0d9ff",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? "#6b5ce6" : "#c7bcff",
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginBottom: 6,
    };

    const alphabetLetterTextStyle: TextStyle = {
      color: textColor,
      fontFamily: FONTS.noto.medium,
      fontSize: 12,
      textAlign: "center",
    };

    return {
      container: baseContainer,
      content: baseContainer,
      searchContainer,
      searchInput: searchTextStyle,
      list: {
        ...baseContainer,
        paddingHorizontal: 16,
      },
      countryItem: countryItemStyle,
      countryName: countryNameStyle,
      callingCode: callingCodeTextStyle,
      alphabetLetter: alphabetLetterStyle,
      alphabetLetterActive: alphabetLetterActiveStyle,
      alphabetLetterText: alphabetLetterTextStyle,
    };
  }, [containerBackgroundColor, isDark, isRTL, textColor]);

  type FocusEventType = Parameters<
    NonNullable<RNPhoneInputProps["onFocus"]>
  >[0];
  type BlurEventType = Parameters<NonNullable<RNPhoneInputProps["onBlur"]>>[0];

  const handleFocus = useCallback(
    (event: FocusEventType) => {
      setIsFocused(true);
      phoneInputProps?.onFocus?.(event);
    },
    [phoneInputProps]
  );

  const handleBlur = useCallback(
    (event: BlurEventType) => {
      setIsFocused(false);
      phoneInputProps?.onBlur?.(event);
      onBlur?.();
    },
    [onBlur, phoneInputProps]
  );

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
          className={getInputContainerClasses()}
          style={getAnimatedContainerStyle()}
        >
          {/* Custom Left Icon */}
          {leftIcon && <View>{renderIconWithColor(leftIcon)}</View>}

          <PhoneInput
            theme={isDark ? "dark" : "light"}
            rtl={isRTL}
            language={isRTL ? "ara" : "eng"}
            placeholder={placeholder}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleCountryChange}
            onChangePhoneNumber={handlePhoneChange}
            value={nationalNumber}
            defaultCountry={
              normalizedDefaultCountry as ICountry["cca2"] | undefined
            }
            phoneInputStyles={phoneInputStyles}
            modalStyles={modalStyles}
            showModalAlphabetFilter={false}
            phoneInputPlaceholderTextColor="#9CA3AF"
            phoneInputSelectionColor={
              isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
            }
            {...phoneInputProps}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Custom Right Icon */}
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

export default PhoneNumberInput;
