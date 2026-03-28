import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          25: "#fafafa",
          50: "#f5f5f5",
          100: "#f0f0f0",
          200: "#e3e3e3",
          300: "#cfcfcf",
          400: "#b5b5b5",
          500: "#858585",
          600: "#696969",
          700: "#474747",
          800: "#2c2c2c",
          900: "#11232f",
        },
        brand: {
          900: "#451e00",
          600: "#D6001C",
          500: "#E73226",
          100: "#ffdca7",
          50: "#f8f4ed",
        },
        base: {
          white: "#ffffff",
          black: "#000000",
        },
      },
      fontFamily: {
        RGNDark: ["RightGrotesk-NarrowDark", "sans-serif"],
        RGNBold: ["RightGrotesk-NarrowBold", "sans-serif"],
        RGCRegular: ["RightGrotesk-CompactRegular", "sans-serif"],
        RGRegular: ["RightGrotesk-Regular", "sans-serif"],
        HBold: ["Henriette-Bold", "sans-serif"],
        HMedium: ["Henriette-Medium", "sans-serif"],
        HRegular: ["Henriette-Regular", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
