const gluestackPlugin = require('@gluestack-ui/nativewind-utils/tailwind-plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./App.{tsx,jsx,ts,js}",
    "./app/**/*.{tsx,jsx,ts,js}",
    "./components/**/*.{tsx,jsx,ts,js}"
  ],
  presets: [require('nativewind/preset')],
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF5F5",
          100: "#FFE3E3",
          200: "#FFC9C9",
          300: "#FFA8A8",
          400: "#FF8787",
          500: "#FF6B6B",
          600: "#FA5252",
          700: "#F03E3E",
          800: "#E03131",
          900: "#C92A2A",
        },
        secondary: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        tertiary: {
          50: 'rgb(var(--color-tertiary-50)/<alpha-value>)',
          100: 'rgb(var(--color-tertiary-100)/<alpha-value>)',
          200: 'rgb(var(--color-tertiary-200)/<alpha-value>)',
          300: 'rgb(var(--color-tertiary-300)/<alpha-value>)',
          400: 'rgb(var(--color-tertiary-400)/<alpha-value>)',
          500: 'rgb(var(--color-tertiary-500)/<alpha-value>)',
          600: 'rgb(var(--color-tertiary-600)/<alpha-value>)',
          700: 'rgb(var(--color-tertiary-700)/<alpha-value>)',
          800: 'rgb(var(--color-tertiary-800)/<alpha-value>)',
          900: 'rgb(var(--color-tertiary-900)/<alpha-value>)',
          950: 'rgb(var(--color-tertiary-950)/<alpha-value>)',
        },
        error: {
          0: 'rgb(var(--color-error-0)/<alpha-value>)',
          50: 'rgb(var(--color-error-50)/<alpha-value>)',
          100: 'rgb(var(--color-error-100)/<alpha-value>)',
          200: 'rgb(var(--color-error-200)/<alpha-value>)',
          300: 'rgb(var(--color-error-300)/<alpha-value>)',
          400: 'rgb(var(--color-error-400)/<alpha-value>)',
          500: 'rgb(var(--color-error-500)/<alpha-value>)',
          600: 'rgb(var(--color-error-600)/<alpha-value>)',
          700: 'rgb(var(--color-error-700)/<alpha-value>)',
          800: 'rgb(var(--color-error-800)/<alpha-value>)',
          900: 'rgb(var(--color-error-900)/<alpha-value>)',
          950: 'rgb(var(--color-error-950)/<alpha-value>)',
        },
        success: {
          0: 'rgb(var(--color-success-0)/<alpha-value>)',
          50: 'rgb(var(--color-success-50)/<alpha-value>)',
          100: 'rgb(var(--color-success-100)/<alpha-value>)',
          200: 'rgb(var(--color-success-200)/<alpha-value>)',
          300: 'rgb(var(--color-success-300)/<alpha-value>)',
          400: 'rgb(var(--color-success-400)/<alpha-value>)',
          500: 'rgb(var(--color-success-500)/<alpha-value>)',
          600: 'rgb(var(--color-success-600)/<alpha-value>)',
          700: 'rgb(var(--color-success-700)/<alpha-value>)',
          800: 'rgb(var(--color-success-800)/<alpha-value>)',
          900: 'rgb(var(--color-success-900)/<alpha-value>)',
          950: 'rgb(var(--color-success-950)/<alpha-value>)',
        },
        warning: {
          0: 'rgb(var(--color-warning-0)/<alpha-value>)',
          50: 'rgb(var(--color-warning-50)/<alpha-value>)',
          100: 'rgb(var(--color-warning-100)/<alpha-value>)',
          200: 'rgb(var(--color-warning-200)/<alpha-value>)',
          300: 'rgb(var(--color-warning-300)/<alpha-value>)',
          400: 'rgb(var(--color-warning-400)/<alpha-value>)',
          500: 'rgb(var(--color-warning-500)/<alpha-value>)',
          600: 'rgb(var(--color-warning-600)/<alpha-value>)',
          700: 'rgb(var(--color-warning-700)/<alpha-value>)',
          800: 'rgb(var(--color-warning-800)/<alpha-value>)',
          900: 'rgb(var(--color-warning-900)/<alpha-value>)',
          950: 'rgb(var(--color-warning-950)/<alpha-value>)',
        },
        info: {
          0: 'rgb(var(--color-info-0)/<alpha-value>)',
          50: 'rgb(var(--color-info-50)/<alpha-value>)',
          100: 'rgb(var(--color-info-100)/<alpha-value>)',
          200: 'rgb(var(--color-info-200)/<alpha-value>)',
          300: 'rgb(var(--color-info-300)/<alpha-value>)',
          400: 'rgb(var(--color-info-400)/<alpha-value>)',
          500: 'rgb(var(--color-info-500)/<alpha-value>)',
          600: 'rgb(var(--color-info-600)/<alpha-value>)',
          700: 'rgb(var(--color-info-700)/<alpha-value>)',
          800: 'rgb(var(--color-info-800)/<alpha-value>)',
          900: 'rgb(var(--color-info-900)/<alpha-value>)',
          950: 'rgb(var(--color-info-950)/<alpha-value>)',
        },
        typography: {
          0: 'rgb(var(--color-typography-0)/<alpha-value>)',
          50: 'rgb(var(--color-typography-50)/<alpha-value>)',
          100: 'rgb(var(--color-typography-100)/<alpha-value>)',
          200: 'rgb(var(--color-typography-200)/<alpha-value>)',
          300: 'rgb(var(--color-typography-300)/<alpha-value>)',
          400: 'rgb(var(--color-typography-400)/<alpha-value>)',
          500: 'rgb(var(--color-typography-500)/<alpha-value>)',
          600: 'rgb(var(--color-typography-600)/<alpha-value>)',
          700: 'rgb(var(--color-typography-700)/<alpha-value>)',
          800: 'rgb(var(--color-typography-800)/<alpha-value>)',
          900: 'rgb(var(--color-typography-900)/<alpha-value>)',
          950: 'rgb(var(--color-typography-950)/<alpha-value>)',
          white: '#FFFFFF',
          gray: '#D4D4D4',
          black: '#181718',
        },
        outline: {
          0: 'rgb(var(--color-outline-0)/<alpha-value>)',
          50: 'rgb(var(--color-outline-50)/<alpha-value>)',
          100: 'rgb(var(--color-outline-100)/<alpha-value>)',
          200: 'rgb(var(--color-outline-200)/<alpha-value>)',
          300: 'rgb(var(--color-outline-300)/<alpha-value>)',
          400: 'rgb(var(--color-outline-400)/<alpha-value>)',
          500: 'rgb(var(--color-outline-500)/<alpha-value>)',
          600: 'rgb(var(--color-outline-600)/<alpha-value>)',
          700: 'rgb(var(--color-outline-700)/<alpha-value>)',
          800: 'rgb(var(--color-outline-800)/<alpha-value>)',
          900: 'rgb(var(--color-outline-900)/<alpha-value>)',
          950: 'rgb(var(--color-outline-950)/<alpha-value>)',
        },
        background: {
          0: 'rgb(var(--color-background-0)/<alpha-value>)',
          50: "#FFFFFF",
          100: "#F8F9FA",
          200: "#F1F3F5",
          300: "#E9ECEF",
          400: "#DEE2E6",
          500: "#CED4DA",
          600: 'rgb(var(--color-background-600)/<alpha-value>)',
          700: 'rgb(var(--color-background-700)/<alpha-value>)',
          800: 'rgb(var(--color-background-800)/<alpha-value>)',
          900: 'rgb(var(--color-background-900)/<alpha-value>)',
          950: 'rgb(var(--color-background-950)/<alpha-value>)',
          error: 'rgb(var(--color-background-error)/<alpha-value>)',
          warning: 'rgb(var(--color-background-warning)/<alpha-value>)',
          muted: 'rgb(var(--color-background-muted)/<alpha-value>)',
          success: 'rgb(var(--color-background-success)/<alpha-value>)',
          info: 'rgb(var(--color-background-info)/<alpha-value>)',
          light: '#FBFBFB',
          dark: '#181719',
        },
        indicator: {
          primary: 'rgb(var(--color-indicator-primary)/<alpha-value>)',
          info: 'rgb(var(--color-indicator-info)/<alpha-value>)',
          error: 'rgb(var(--color-indicator-error)/<alpha-value>)',
        },
        custom: {
          purple: '#320062',
          blue: '#0800D',
          yellow: '#EAFE00',
          white: '#FDFEFF',
        },
        accent: {
          50: "#E7F5FF",
          100: "#D0EBFF",
          200: "#A5D8FF",
          300: "#74C0FC",
          400: "#4DABF7",
          500: "#339AF0",
          600: "#228BE6",
          700: "#1C7ED6",
          800: "#1971C2",
          900: "#1864AB",
        },
      },
      fontFamily: {
        sans: ["System", "sans-serif"],
        heading: ["System", "sans-serif"],
        body: undefined,
        mono: undefined,
        roboto: ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        full: "9999px",
      },
    },
  },
  plugins: [gluestackPlugin],
}; 