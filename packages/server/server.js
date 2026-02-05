const { startClaudeCodeServer } = require('./index');

// 启动服务器
const server = startClaudeCodeServer({
  port: 4000,
});

// 处理进程退出
process.on('SIGINT', () => {
  server.stop();
  process.exit(0);
});
