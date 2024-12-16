import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow access from outside the container
    port: 5173, // Ensure it's the correct port
  },
});
