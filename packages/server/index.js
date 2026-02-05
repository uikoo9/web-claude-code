const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

/**
 * 启动 Claude Code Web 服务器
 * @param {Object} options - 配置选项
 * @param {number} options.port - 服务器端口，默认 4000
 * @param {string} options.host - 服务器主机，默认 '0.0.0.0'
 * @param {string} options.viewsDir - views 目录路径，默认为当前目录下的 views
 * @param {string} options.expectScript - expect 脚本路径，默认为当前目录下的 run-claude.exp
 * @param {string} options.corsOrigin - CORS 允许的源，默认 'http://localhost:3000'
 * @returns {Object} 返回服务器实例和控制方法
 */
function startClaudeCodeServer(options = {}) {
  const {
    port = 4000,
    host = '0.0.0.0',
    viewsDir = path.join(__dirname, 'views'),
    expectScript = path.join(__dirname, 'run-claude.exp'),
    corsOrigin = 'http://localhost:3000',
  } = options;

  const app = express();
  const httpServer = createServer(app);

  // 配置 CORS
  app.use(cors());

  // 配置静态文件服务 - /static 路径指向 views 目录
  app.use(
    '/static',
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

  // 根路径返回 index.html
  app.get('/', (req, res) => {
    res.sendFile(path.join(viewsDir, 'index.html'));
  });

  // 创建 Socket.IO 服务器
  const io = new Server(httpServer, {
    path: '/ws',
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  // 启动 claude CLI
  let cliProcess = null;

  function startCLI() {
    console.log('正在启动 claude CLI...');

    try {
      cliProcess = spawn(expectScript, [], {
        cwd: process.env.HOME,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      console.log('Claude CLI 已启动（通过 expect），PID:', cliProcess.pid);

      // 设置编码
      if (cliProcess.stdout) {
        cliProcess.stdout.setEncoding('utf8');
      }
      if (cliProcess.stderr) {
        cliProcess.stderr.setEncoding('utf8');
      }

      // 监听标准输出
      cliProcess.stdout.on('data', (data) => {
        console.log('=== CLI 输出 ===');
        console.log(data);
        console.log('=== 输出结束 ===');
        io.emit('cli-output', {
          type: 'stdout',
          data: data,
          time: new Date().toISOString(),
        });
      });

      // 监听错误输出
      cliProcess.stderr.on('data', (data) => {
        console.log('=== CLI 错误 ===');
        console.log(data);
        console.log('=== 输出结束 ===');
        io.emit('cli-output', {
          type: 'stderr',
          data: data,
          time: new Date().toISOString(),
        });
      });

      // 监听进程退出
      cliProcess.on('close', (code) => {
        console.log(`CLI 进程退出，退出码: ${code}`);
        io.emit('cli-output', {
          type: 'exit',
          data: `\n进程已退出，退出码: ${code}\n`,
          time: new Date().toISOString(),
        });
        cliProcess = null;
      });

      // 监听进程错误
      cliProcess.on('error', (err) => {
        console.error('CLI 进程错误:', err);
        io.emit('cli-output', {
          type: 'error',
          data: `错误: ${err.message}\n`,
          time: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error('启动 CLI 失败:', error);
      io.emit('cli-output', {
        type: 'error',
        data: `启动失败: ${error.message}\n`,
        time: new Date().toISOString(),
      });
    }
  }

  // 连接事件
  io.on('connection', (socket) => {
    console.log('客户端已连接:', socket.id);

    // 如果 CLI 还没启动，则启动它
    if (!cliProcess) {
      startCLI();
    }

    // 接收客户端输入，发送到 CLI
    socket.on('cli-input', (data) => {
      console.log('收到客户端输入:', JSON.stringify(data));
      if (cliProcess && cliProcess.stdin.writable) {
        // 直接写入原始数据，不添加换行符
        cliProcess.stdin.write(data);
      } else {
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
      if (cliProcess) {
        cliProcess.kill();
      }
      setTimeout(() => {
        startCLI();
      }, 500);
    });

    // 断开连接事件
    socket.on('disconnect', () => {
      console.log('客户端已断开:', socket.id);
    });
  });

  // 启动服务器
  httpServer.listen(port, host, () => {
    console.log(`WebSocket 服务器运行在 http://${host}:${port}`);
  });

  // 停止服务器的方法
  function stop() {
    console.log('\n正在关闭服务器...');
    if (cliProcess) {
      cliProcess.kill();
    }
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
