export const FONTS = {
  // NotoKufiArabic font families
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

  // Inter font families (fallback)
  inter: {
    regular: "Inter",
    bold: "Inter-Bold",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    light: "Inter-Light",
    extraBold: "Inter-ExtraBold",
  },

  weights: {
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
} as const;

export type FontWeight = keyof typeof FONTS.weights;
export type FontFamily = keyof typeof FONTS.noto | keyof typeof FONTS.inter;
