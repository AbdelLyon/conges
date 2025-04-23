import { heroui } from "@heroui/theme";
import { darkTheme } from "./src/theme/darkTheme";
import { lightTheme } from "./src/theme/lightTheme";

const config = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",

  plugins: [
    heroui({
      themes: {
        light: {
          colors: lightTheme,
        },
        dark: {
          colors: darkTheme,
        },
      },
    }),
  ],
};

export default config;
