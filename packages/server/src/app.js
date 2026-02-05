const express = require('express');
const cors = require('cors');
const path = require('path');

/**
 * 创建 Express 应用
 * @param {Object} options - 配置选项
 * @param {string} options.viewsDir - views 目录路径
 * @returns {Object} Express 应用实例
 */
function createExpressApp(options = {}) {
  const { viewsDir } = options;

  const app = express();

  // 配置 CORS
  app.use(cors());

  // 配置静态文件服务 - 直接将 views 目录作为根静态目录
  app.use(
    express.static(viewsDir, {
      setHeaders: (res, filePath) => {
        // 为 .js 文件设置正确的 Content-Type
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
        // 为 .css 文件设置正确的 Content-Type
        if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }
      },
    }),
  );

  // 根路径返回 index.html（确保 SPA 路由正常工作）
  app.get('/', (req, res) => {
    res.sendFile(path.join(viewsDir, 'index.html'));
  });

  return app;
}

module.exports = {
  createExpressApp,
};
