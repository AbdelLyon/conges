import tailwindScrollbar from "tailwind-scrollbar";
import baseConfig from "x-react/tailwind.config";

const config = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, tailwindScrollbar({ nocompatible: true })],
  corePlugins: {
    preflight: false,
  },
};

export default config;
