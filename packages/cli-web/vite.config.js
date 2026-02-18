import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative path to support multiple deployment targets
  server: {
    port: 3000,
    open: true,
    // Proxy WebSocket connections to the backend server
    proxy: {
      '/ws': {
        target: 'http://localhost:4000',
        ws: true, // Enable WebSocket proxy
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output build artifacts to server/views directory
    outDir: resolve(__dirname, '../server/views'),
    emptyOutDir: true, // Clear directory before build
    assetsDir: 'assets', // Place assets in assets subdirectory
  },
});
