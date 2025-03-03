import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/collector/",
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
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
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
});
