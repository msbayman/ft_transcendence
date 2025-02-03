import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Get the environment variable for the host (use a default if undefined)
const host = process.env.VITE_HOST_URL || "0.0.0.0"; // Fallback to 0.0.0.0 if no environment variable is set
const port = 5173; // Fallback to 5173 if no environment variable is set

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: port,
    strictPort: true,
    // https: true,
  },
  server: {
    port: port,
    strictPort: true,
    host: true, // Allow external access
    // https: true,
    origin: `http://${host}:${port}`, // Dynamically set the origin using the environment variable
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
        rollupOptions: {
            output:{
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
});
