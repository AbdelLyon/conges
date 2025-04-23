import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
   plugins: [react(), tsconfigPaths()],

   test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["vitest.setup.ts"],
      include: ["**/?(*.)test.ts?(x)"],
      coverage: {
         provider: "v8",
         reporter: ["text", "json", "html"],
      },
   },
});