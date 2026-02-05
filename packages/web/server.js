import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// 配置 CORS
app.use(cors());

// 创建 Socket.IO 服务器
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// 启动 claude CLI
let cliProcess = null;

function startCLI() {
  console.log('正在启动 claude CLI...');

  try {
    // 使用 expect 脚本来运行 claude，这样可以创建真正的 PTY
    const expectScript = join(__dirname, 'run-claude.exp');

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

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket 服务器运行在 http://localhost:${PORT}`);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  if (cliProcess) {
    cliProcess.kill();
  }
  process.exit(0);
});
