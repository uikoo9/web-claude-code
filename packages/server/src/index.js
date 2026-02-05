const { createServer } = require('http');
const path = require('path');
const { createExpressApp } = require('./app');
const { setupSocketIO } = require('./socket');
const { createCLIManager } = require('./cli');

/**
 * 启动 Claude Code Web 服务器
 * @param {Object} options - 配置选项
 * @param {number} options.port - 服务器端口，默认 4000
 * @param {string} options.host - 服务器主机，默认 '0.0.0.0'
 * @param {string} options.claudePath - Claude CLI 路径，默认 'claude'（从 PATH 查找）
 * @param {string} options.anthropicBaseUrl - Anthropic API Base URL（必填）
 * @param {string} options.anthropicAuthToken - Anthropic Auth Token（必填）
 * @param {string} options.anthropicModel - Anthropic Model，默认 'claude-sonnet-4-5-20250929'
 * @param {string} options.anthropicSmallFastModel - Anthropic Small Fast Model，默认 'claude-sonnet-4-5-20250929'
 * @returns {Object} 返回服务器实例和控制方法
 */
function startClaudeCodeServer(options = {}) {
  const {
    port = 4000,
    host = '0.0.0.0',
    claudePath = 'claude',
    anthropicBaseUrl,
    anthropicAuthToken,
    anthropicModel = 'claude-sonnet-4-5-20250929',
    anthropicSmallFastModel = 'claude-sonnet-4-5-20250929',
  } = options;

  // 内部固定配置
  const viewsDir = path.join(__dirname, '../views');
  const corsOrigin = 'http://localhost:3000';

  // 验证必填参数
  if (!anthropicBaseUrl) {
    console.error('❌ 错误: anthropicBaseUrl 参数是必填的');
    console.error('请在启动时提供 Anthropic API Base URL');
    process.exit(1);
  }

  if (!anthropicAuthToken) {
    console.error('❌ 错误: anthropicAuthToken 参数是必填的');
    console.error('请在启动时提供 Anthropic Auth Token');
    process.exit(1);
  }

  // 创建 Express 应用
  const app = createExpressApp({ viewsDir });

  // 创建 HTTP 服务器
  const httpServer = createServer(app);

  // 创建占位 IO（用于 CLI 管理器）
  let io;

  // 创建 CLI 管理器
  const cliManager = createCLIManager({
    claudePath,
    anthropicBaseUrl,
    anthropicAuthToken,
    anthropicModel,
    anthropicSmallFastModel,
    get io() {
      return io;
    },
  });

  // 配置 Socket.IO
  io = setupSocketIO(httpServer, cliManager, { corsOrigin });

  // 启动服务器
  httpServer.listen(port, host, () => {
    console.log(`WebSocket 服务器运行在 http://${host}:${port}`);
  });

  // 停止服务器的方法
  function stop() {
    console.log('\n正在关闭服务器...');
    cliManager.stop();
    httpServer.close();
  }

  // 返回控制接口
  return {
    app,
    httpServer,
    io,
    stop,
  };
}

module.exports = {
  startClaudeCodeServer,
};
