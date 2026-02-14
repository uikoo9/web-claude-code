import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // 使用相对路径，适配多个部署位置
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
  build: {
    // 构建产物输出到 server/views 目录
    outDir: resolve(__dirname, '../server/views'),
    emptyOutDir: true, // 构建前清空目录
    assetsDir: 'assets', // 资源文件放到 assets 子目录
  },
});
