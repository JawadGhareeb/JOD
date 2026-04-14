import { Images } from "@/src/constants/images";
import React from "react";
import { Image, ImageStyle, View } from "react-native";

interface LogoProps {
  variant?: "small" | "medium" | "large" | "x-large";
  width?: number;
  height?: number;
  style?: ImageStyle;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
  className?: string;
  showName?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = "medium",
  width,
  height,
  style,
  resizeMode = "contain",
  className,
  showName = false,
}) => {
  const getVariantDimensions = () => {
    switch (variant) {
      case "small":
        return { width: 40, height: 40 };
      case "medium":
        return { width: 80, height: 80 };
      case "large":
        return { width: 120, height: 120 };
      case "x-large":
        return { width: 160, height: 160 };
      default:
        return { width: 80, height: 80 };
    }
  };

  const variantDimensions = getVariantDimensions();

  const finalWidth = width ?? variantDimensions.width;
  const finalHeight = height ?? variantDimensions.height;

  const logoStyle: ImageStyle = {
    width: finalWidth,
    height: finalHeight,
    ...style,
  };

  const logoSource = showName ? Images.subLogo : Images.logo;

  return (
    <View
      style={{ alignItems: "center", justifyContent: "center" }}
      className={className}
    >
      <Image source={logoSource} style={logoStyle} resizeMode={resizeMode} />
    </View>
  );
};

export default Logo;
