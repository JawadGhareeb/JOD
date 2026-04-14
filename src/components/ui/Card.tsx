import { useColorScheme } from "nativewind";
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";

type CardPadding = "none" | "sm" | "md" | "lg";
type CardRadius = "sm" | "md" | "lg" | "xl" | "2xl";

interface CardProps extends ViewProps {
  padding?: CardPadding;
  radius?: CardRadius;
  bordered?: boolean;
  elevated?: boolean;
  background?: string;
  className?: string;
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
}

const paddingToClass: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const radiusToClass: Record<CardRadius, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  "2xl": "rounded-2xl",
};

const Card: React.FC<CardProps> = ({
  children,
  padding = "md",
  radius = "xl",
  bordered = true,
  elevated = false,
  background,
  className,
  style,
  onPress,
  activeOpacity = 0.7,
  disabled,
  ...rest
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const baseSurface = isDark ? "bg-dark-500" : "bg-white";
  const baseBorder = isDark ? "border-dark-400" : "border-gray-100";

  const classes = [
    background || baseSurface,
    radiusToClass[radius],
    paddingToClass[padding],
    bordered ? `border ${baseBorder}` : "",
    elevated ? "shadow-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onPress) {
    const touchableProps = rest as TouchableOpacityProps;
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        disabled={disabled}
        className={classes}
        style={style}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={classes} style={style} {...rest}>
      {children}
    </View>
  );
};

export default Card;
