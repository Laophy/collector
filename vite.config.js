import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/collector/", // Updated for laophy's repository
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings in CI
        if (
          warning.code === "CIRCULAR_DEPENDENCY" ||
          warning.code === "THIS_IS_UNDEFINED"
        ) {
          return;
        }
        // Use default for everything else
        warn(warning);
      },
    },
  },
});
