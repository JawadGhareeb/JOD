export const FONTS = {
  noto: {
    thin: "NotoKufiArabic-Thin",
    extraLight: "NotoKufiArabic-ExtraLight",
    light: "NotoKufiArabic-Light",
    regular: "NotoKufiArabic-Regular",
    medium: "NotoKufiArabic-Medium",
    semiBold: "NotoKufiArabic-SemiBold",
    bold: "NotoKufiArabic-Bold",
    extraBold: "NotoKufiArabic-ExtraBold",
    black: "NotoKufiArabic-Black",
  },
  inter: {
    light: "NotoKufiArabic-Light",
    regular: "NotoKufiArabic-Regular",
    medium: "NotoKufiArabic-Medium",
    semiBold: "NotoKufiArabic-SemiBold",
    bold: "NotoKufiArabic-Bold",
    extraBold: "NotoKufiArabic-ExtraBold",
  },
  weights: {
    light: "300",
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
    extraBold: "800",
  },
} as const;

export type FontWeight = keyof typeof FONTS.weights;
