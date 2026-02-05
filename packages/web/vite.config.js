import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // 代理 WebSocket 连接到后端服务器
    proxy: {
      '/ws': {
        target: 'http://localhost:4000',
        ws: true, // 启用 WebSocket 代理
        changeOrigin: true,
      },
    },
  },
});
