/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  corePlugins: {
    direction: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["NotoKufiArabic-Regular", "system-ui", "sans-serif"],
        noto: ["NotoKufiArabic-Regular", "system-ui", "sans-serif"],
        "noto-thin": ["NotoKufiArabic-Thin", "system-ui", "sans-serif"],
        "noto-light": ["NotoKufiArabic-Light", "system-ui", "sans-serif"],
        "noto-medium": ["NotoKufiArabic-Medium", "system-ui", "sans-serif"],
        "noto-semibold": ["NotoKufiArabic-SemiBold", "system-ui", "sans-serif"],
        "noto-bold": ["NotoKufiArabic-Bold", "system-ui", "sans-serif"],
        "noto-extrabold": [
          "NotoKufiArabic-ExtraBold",
          "system-ui",
          "sans-serif",
        ],
        "noto-black": ["NotoKufiArabic-Black", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#e8f5f1",
          200: "#8fc4b5",
          400: "rgb(var(--color-primary) / <alpha-value>)",
        },

        secondary: {
          50: "#f0edff",
        },

        light: {
          50: "#FFFFFF",
          100: "#FAFAFA",
          200: "#F4F2FF",
          300: "#F8F8F8",
          400: "#EEEEEE",
          500: "#E0E0E0",
        },

        dark: {
          50: "#646464",
          100: "#212121",
          200: "#1e1e1e",
          300: "#181a20",
          350: "#262934",
          400: "#35383f",
          500: "#1f222b",
        },

        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },

        success: {
          100: "#16A34A",
          300: "#10B981",
          400: "#059669",
          500: "#047857",
        },
        warning: {
          100: "#FEF3C7",
          300: "#FBBF24",
          400: "#F59E0B",
          500: "#D97706",
        },
        error: {
          100: "#FEE2E2",
          200: "#FCA5A5",
          300: "#DC2626",
          400: "#B91C1C",
          500: "#991B1B",
        },
        info: {
          100: "#E0F2FE",
          300: "#38BDF8",
          400: "#0284C7",
        },
      },
    },
  },
  plugins: [],
};
