
import { darkTheme, lightTheme, } from "@xefi/x-react/theme";

const extendedThemes = {
   light: {
      ...lightTheme,
      colors: {
         ...darkTheme,
         primary: {
            DEFAULT: "#your-color"
         }
      }
   }
};

export default extendedThemes;