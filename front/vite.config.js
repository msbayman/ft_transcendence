import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
    // https: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    // https: true,
    origin: "http://0.0.0.0:5173",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
