import { ThemeColors } from "@heroui/theme";

export interface Colors extends Partial<ThemeColors> {
   outline: {
      DEFAULT: string;
      foreground: string;
   };
   border: {
      DEFAULT: string;
      foreground: string;
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
   };
   shadow: {
      DEFAULT: string;
      foreground: string;
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
   };
   skeleton: {
      DEFAULT: string;
      foreground: string;
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
   };
}
