import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        50: "rgb(var(--tw-color-primary-50) / <alpha-value>)",
        100: "rgb(var(--tw-color-primary-100) / <alpha-value>)",
        200: "rgb(var(--tw-color-primary-200) / <alpha-value>)",
        300: "rgb(var(--tw-color-primary-300) / <alpha-value>)",
        400: "rgb(var(--tw-color-primary-400) / <alpha-value>)",
        500: "rgb(var(--tw-color-primary-500) / <alpha-value>)",
        600: "rgb(var(--tw-color-primary-600) / <alpha-value>)",
        700: "rgb(var(--tw-color-primary-700) / <alpha-value>)",
        800: "rgb(var(--tw-color-primary-800) / <alpha-value>)",
        900: "rgb(var(--tw-color-primary-900) / <alpha-value>)",
        950: "rgb(var(--tw-color-primary-950) / <alpha-value>)",
      },
      fontFamily: {
        inter: "var(--font-inter)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
