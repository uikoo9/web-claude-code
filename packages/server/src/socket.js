const { Server } = require('socket.io');

/**
 * 配置 Socket.IO 服务器
 * @param {Object} httpServer - HTTP 服务器实例
 * @param {Object} cliManager - CLI 管理器实例
 * @param {Object} options - 配置选项
 * @param {string} options.corsOrigin - CORS 允许的源
 * @returns {Object} Socket.IO 实例
 */
function setupSocketIO(httpServer, cliManager, options = {}) {
  const { corsOrigin = 'http://localhost:3000' } = options;

  // 创建 Socket.IO 服务器
  const io = new Server(httpServer, {
    path: '/ws',
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  // 连接事件
  io.on('connection', (socket) => {
    console.log('客户端已连接:', socket.id);

    // 如果 CLI 还没启动，则启动它
    if (!cliManager.isRunning()) {
      cliManager.start();
    }

    // 接收客户端输入，发送到 CLI
    socket.on('cli-input', (data) => {
      console.log('收到客户端输入:', JSON.stringify(data));
      const success = cliManager.write(data);
      if (!success) {
        socket.emit('cli-output', {
          type: 'error',
          data: 'CLI 进程未运行或无法写入\n',
          time: new Date().toISOString(),
        });
      }
    });

    // 重启 CLI
    socket.on('cli-restart', () => {
      console.log('重启 CLI');
      cliManager.stop();
      setTimeout(() => {
        cliManager.start();
      }, 500);
    });

    // 断开连接事件
    socket.on('disconnect', () => {
      console.log('客户端已断开:', socket.id);
    });
  });

  return io;
}

module.exports = {
  setupSocketIO,
};
