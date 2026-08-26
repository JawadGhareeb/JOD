/**
 * InputIcons Component
 *
 * Custom reusable icon components for Input fields
 *
 * @TypeIcon - Shows type-specific icons based on input type (email, password, phone, etc.)
 * @StatusIcon - Shows animated status icons for text inputs (default, focused, success, error)
 *
 * Usage:
 * import { TypeIcon, StatusIcon } from "@/components/ui/InputIcons";
 *
 * <TypeIcon type="email" isFocused={true} hasError={false} isDark={false} size="medium" />
 * <StatusIcon isFocused={false} hasError={false} hasValue={true} isDark={false} size="small" animation={animValue} />
 */

import React from "react";
import { Animated } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { getPrimaryColor } from "@/src/theme";

export interface TypeIconProps {
  type?: string;
  isFocused: boolean;
  hasError: boolean;
  isDark: boolean;
  size: "small" | "medium";
}

export interface StatusIconProps {
  isFocused: boolean;
  hasError: boolean;
  hasValue: boolean;
  isDark: boolean;
  size: "small" | "medium";
  animation: Animated.Value;
}

/**
 * TypeIcon Component
 *
 * Displays context-specific icons based on input type
 * Supported types: email, password, phone, search, url, number, date, user, location, message
 */
export const TypeIcon: React.FC<TypeIconProps> = ({
  type,
  isFocused,
  hasError,
  isDark,
  size,
}) => {
  const iconSize = size === "small" ? 20 : 24;

  const getIconColor = () => {
    if (hasError) return "#EF4444";
    if (isFocused) return getPrimaryColor(isDark);
    return isDark ? "#9CA3AF" : "#6B7280";
  };

  switch (type) {
    case "email":
    case "email-address":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 8L10.89 13.26C11.567 13.72 12.433 13.72 13.11 13.26L21 8M5 19H19C20.105 19 21 18.105 21 17V7C21 5.895 20.105 5 19 5H5C3.895 5 3 5.895 3 7V17C3 18.105 3.895 19 5 19Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "password":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 15V17M6 21H18C19.105 21 20 20.105 20 19V13C20 11.895 19.105 11 18 11H6C4.895 11 4 11.895 4 13V19C4 20.105 4.895 21 6 21ZM16 11V7C16 4.791 14.209 3 12 3C9.791 3 8 4.791 8 7V11H16Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="16" r="1" fill={getIconColor()} />
        </Svg>
      );

    case "tel":
    case "phone":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "search":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "url":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997M14 11C13.5705 10.4258 13.0226 9.95078 12.3934 9.60703C11.7642 9.26327 11.0685 9.05885 10.3533 9.00763C9.63816 8.95641 8.92037 9.0596 8.24861 9.31018C7.57685 9.56077 6.96684 9.9529 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.542 3.52086 20.4691C4.44791 21.3961 5.70197 21.9219 7.01295 21.9333C8.32393 21.9447 9.58694 21.4408 10.53 20.53L12.24 18.82"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "number":
    case "numeric":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 3L7 9M7 9L5 15M7 9H17M17 9L15 3M17 9L19 15M14 12H10M10 12L8 18M10 12L12 6M14 12L16 18M14 12L12 6"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "date":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M8 2V5M16 2V5M3 9H21M5 21H19C20.105 21 21 20.105 21 19V7C21 5.895 20.105 5 19 5H5C3.895 5 3 5.895 3 7V19C3 20.105 3.895 21 5 21Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "user":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "location":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="12"
            cy="10"
            r="3"
            stroke={getIconColor()}
            strokeWidth="2"
          />
        </Svg>
      );

    case "message":
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    default:
      return null;
  }
};

/**
 * StatusIcon Component
 *
 * Displays animated status icons that change based on input state
 * States: default (dashed circle), focused (sparkle), success (checkmark), error (X mark)
 * Includes smooth rotation and color transitions
 */
export const StatusIcon: React.FC<StatusIconProps> = ({
  isFocused,
  hasError,
  hasValue,
  isDark,
  size,
  animation,
}) => {
  const iconSize = size === "small" ? 20 : 24;

  const getIconColor = () => {
    if (hasError) return "#EF4444";
    if (isFocused) return getPrimaryColor(isDark);
    if (hasValue) return "#10B981";
    return isDark ? "#6B7280" : "#9CA3AF";
  };

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (hasError) {
    // Error Icon (X in circle)
    return (
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="12"
            cy="12"
            r="10"
            stroke={getIconColor()}
            strokeWidth="2"
          />
          <Path
            d="M15 9L9 15M9 9L15 15"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    );
  }

  if (hasValue && !isFocused) {
    // Success Icon (Check in circle)
    return (
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="12"
            cy="12"
            r="10"
            stroke={getIconColor()}
            strokeWidth="2"
          />
          <Path
            d="M8 12L11 15L16 9"
            stroke={getIconColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    );
  }

  if (isFocused) {
    // Focused Icon (Sparkle/Star)
    return (
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill={getIconColor()}
            opacity="0.8"
          />
          <Path
            d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"
            fill={getIconColor()}
            opacity="0.6"
          />
        </Svg>
      </Animated.View>
    );
  }

  // Default Icon (Simple circle with dot)
  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={getIconColor()}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <Circle cx="12" cy="12" r="3" fill={getIconColor()} opacity="0.4" />
    </Svg>
  );
};
