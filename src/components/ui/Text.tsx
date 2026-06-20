import { FONTS } from "@/src/constants/fonts";
import { cn } from "@/src/lib";
import { useRTL } from "@/src/providers/RTLProvider";
import { useColorScheme } from "nativewind";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

interface CustomTextProps extends RNTextProps {
  variant?: "heading" | "subheading" | "body" | "caption" | "label";
  color?:
    | "primary"
    | "secondary"
    | "light"
    | "dark"
    | "accent"
    | "error"
    | "success"
    | "warning";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "2xs";
  align?: "left" | "center" | "right" | "justify" | "auto";
  className?: string;
  // RTL-specific props
  rtlAlign?: "left" | "center" | "right" | "justify";
  forceRTL?: boolean;
}

export default function Text({
  variant = "body",
  color,
  weight = "regular",
  size,
  align = "auto",
  rtlAlign,
  forceRTL,
  style,
  className,
  children,
  ...props
}: CustomTextProps) {
  const { currentLanguage } = useRTL();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const getFamily = (
    weight: "light" | "regular" | "medium" | "semibold" | "bold" | "extraBold"
  ) => {
    const isArabic = currentLanguage === "ar";
    if (isArabic) {
      switch (weight) {
        case "light":
          return FONTS.noto.light;
        case "regular":
          return FONTS.noto.regular;
        case "medium":
          return FONTS.noto.medium;
        case "semibold":
          return FONTS.noto.semiBold;
        case "bold":
          return FONTS.noto.bold;
        case "extraBold":
          return FONTS.noto.extraBold;
        default:
          return FONTS.noto.regular;
      }
    }
    switch (weight) {
      case "light":
        return FONTS.inter.light;
      case "regular":
        return FONTS.inter.regular;
      case "medium":
        return FONTS.inter.medium;
      case "semibold":
        return FONTS.inter.semiBold;
      case "bold":
        return FONTS.inter.bold;
      case "extraBold":
        return FONTS.inter.extraBold;
      default:
        return FONTS.inter.regular;
    }
  };

  const getVariantStyles = (): TextStyle => {
    if (size) {
      return {};
    }

    switch (variant) {
      case "heading":
        return {
          fontSize: 24,
          fontFamily: getFamily("bold"),
        };
      case "subheading":
        return {
          fontSize: 20,
          fontFamily: getFamily("semibold"),
        };
      case "body":
        return {
          fontSize: 16,
          fontFamily: getFamily("regular"),
        };
      case "caption":
        return {
          fontSize: 12,
          fontFamily: getFamily("regular"),
        };
      case "label":
        return {
          fontSize: 14,
          fontFamily: getFamily("medium"),
        };
      default:
        return {
          fontSize: 16,
          fontFamily: getFamily("regular"),
        };
    }
  };

  const getColorStyles = (): TextStyle => {
    return {};
  };

  const getWeightStyles = (): TextStyle => {
    return { fontFamily: getFamily(weight) };
  };

  const getSizeStyles = (): TextStyle => {
    if (!size) return {};

    switch (size) {
      case "2xs":
        return { fontSize: 10 };
      case "xs":
        return { fontSize: 12 };
      case "sm":
        return { fontSize: 14 };
      case "base":
        return { fontSize: 16 };
      case "lg":
        return { fontSize: 18 };
      case "xl":
        return { fontSize: 20 };
      case "2xl":
        return { fontSize: 24 };
      case "3xl":
        return { fontSize: 30 };
      default:
        return { fontSize: 14 };
    }
  };

  const getAlignmentStyles = (): TextStyle => {
    const isArabic = currentLanguage === "ar";

    const alignment = rtlAlign || align;

    if (alignment === "auto") {
      return { textAlign: isArabic ? "right" : "left" };
    }

    switch (alignment) {
      case "left":
        return { textAlign: "left" };
      case "center":
        return { textAlign: "center" };
      case "right":
        return { textAlign: "right" };
      case "justify":
        return { textAlign: "justify" };
      default:
        return { textAlign: isArabic ? "right" : "left" };
    }
  };

  const combinedStyles = [
    getVariantStyles(),
    getColorStyles(),
    getWeightStyles(),
    getSizeStyles(),
    getAlignmentStyles(),
    style,
  ].filter(Boolean);

  const colorClasses = color
    ? {
        primary: "text-primary-400",
        secondary: "text-secondary-50",
        light: "text-light-50",
        dark: "text-dark-100",
        accent: "text-primary-200",
        error: "text-error-300",
        success: "text-success-100",
        warning: "text-warning-400",
      }[color]
    : isDark
      ? "text-light-50"
      : "text-dark-100";

  const baseTextClass = isDark ? "text-light-50" : "text-dark-100";

  const combinedClasses = color ? colorClasses : baseTextClass;

  return (
    <RNText
      style={combinedStyles}
      className={cn(combinedClasses, className)}
      {...props}
    >
      {children}
    </RNText>
  );
}

export const HeadingText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="heading" {...props} />
);

export const SubheadingText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="subheading" {...props} />
);

export const BodyText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="body" {...props} />
);

export const CaptionText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="caption" {...props} />
);

export const LabelText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="label" {...props} />
);

export const RTLText = (props: CustomTextProps) => (
  <Text {...props} align="auto" />
);

export const RTLHeadingText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="heading" {...props} align="auto" />
);

export const RTLBodyText = (props: Omit<CustomTextProps, "variant">) => (
  <Text variant="body" {...props} align="auto" />
);
