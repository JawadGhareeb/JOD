/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  corePlugins: {
    direction: true,
  },
  theme: {
    extend: {
      fontFamily: {
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
          100: "#eaedef",
          200: "#9faeb8",
          400: "#405d72",
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

        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#EF4444",
          400: "#DC2626",
          500: "#B91C1C",
        },

        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#86EFAC",
          300: "#16A34A",
        },

        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
        },

        warning: {
          50: "#FEFCE8",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F59E0B",
        },

        purple: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#A855F7",
        },
      },
    },
  },
  plugins: [],
};
