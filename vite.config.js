import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/collector/", // Updated for laophy's repository
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
