require('dotenv').config();
const { startClaudeCodeServer } = require('./src/index');

// 从环境变量读取配置
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  claudePath: process.env.CLAUDE_PATH,
  workDir: process.env.WORK_DIR,
  anthropicBaseUrl: process.env.ANTHROPIC_BASE_URL,
  anthropicAuthToken: process.env.ANTHROPIC_AUTH_TOKEN,
  anthropicModel: process.env.ANTHROPIC_MODEL,
  anthropicSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL,
};

// 启动服务器
const server = startClaudeCodeServer(config);

// 处理进程退出
process.on('SIGINT', () => {
  server.stop();
  process.exit(0);
});
