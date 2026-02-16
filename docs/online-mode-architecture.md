# Web Claude Code - 在线模式架构设计

> 在线模式（Online Mode）实现方案
>
> 创建时间：2026-02-16
> 状态：待实现

## 目录

- [概述](#概述)
- [架构设计](#架构设计)
- [组件清单](#组件清单)
- [消息流转](#消息流转)
- [实现细节](#实现细节)
- [部署方案](#部署方案)
- [安全考虑](#安全考虑)
- [与本地模式对比](#与本地模式对比)

## 概述

### 问题背景

当前 webcc 只支持本地模式：

- 用户运行 `webcc` 启动本地服务器
- 只能通过 `http://localhost:4000` 访问
- 无法从其他设备或远程位置访问

### 解决方案

**在线模式（Online Mode）**：

- 用户运行 `webcc --online` 启动在线客户端
- 本地 CLI 进程直接连接到远程 WebSocket 服务器
- 生成唯一 token，其他人通过 `https://www.webcc.dev/{token}` 访问
- 使用 Room 机制区分不同用户的会话

### 核心思路

```
❌ 不需要：本地 HTTP 服务器
❌ 不需要：本地 WebSocket 服务器
❌ 不需要：隧道代理层
✅ 只需要：远程 WebSocket 服务器 + Room 管理
```

## 架构设计

### 整体架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                           在线模式                                │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  访问者 Browser     │
│  www.webcc.dev/abc123   │
└──────────┬──────────┘
           │ HTTPS
           ↓
┌──────────────────────────────────────────────────────────────────┐
│  www.webcc.dev (Next.js Server)                                      │
│  packages/index                                                  │
│                                                                  │
│  路由: /[token]                                                  │
│    ↓ 渲染 TerminalClient 组件                                    │
│    ↓ 传递 token = abc123                                        │
└──────────┬───────────────────────────────────────────────────────┘
           │ WebSocket (wss://www.webcc.dev/ws)
           ↓
┌──────────────────────────────────────────────────────────────────┐
│  WebSocket Server (www.webcc.dev:4000)                              │
│  packages/online-server                                         │
│                                                                  │
│  Room Management:                                               │
│                                                                  │
│  Room: abc123                                                   │
│    ├─ cliSocket: Socket (本地 CLI 连接)                         │
│    └─ browserSockets: [Socket1, Socket2, ...] (浏览器连接)      │
│                                                                  │
│  消息转发:                                                       │
│    - Browser → cli-input → CLI Socket                           │
│    - CLI Socket → cli-output → All Browser Sockets              │
└──────────┬───────────────────────────────────────────────────────┘
           │ WebSocket (wss://www.webcc.dev/ws)
           ↓
┌──────────────────────────────────────────────────────────────────┐
│  本地机器                                                         │
│                                                                  │
│  $ webcc --online                                               │
│    ↓                                                            │
│  Online Client (packages/cli/online-client.js)                 │
│    - 连接 WebSocket 服务器                                       │
│    - 注册 token: abc123                                         │
│    - 启动本地 Claude CLI 进程                                    │
│    - 转发 stdin/stdout                                          │
│                                                                  │
│  Claude CLI Process                                             │
│    - 本地执行 Claude Code                                        │
│    - stdout → 通过 WS 推送到服务器                               │
│    - stdin ← 接收来自服务器的用户输入                            │
└──────────────────────────────────────────────────────────────────┘
```

### 本地模式 vs 在线模式

```
┌─────────────────────────────────────────────────────────────────┐
│                        本地模式（现有）                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser (localhost:3000)                                       │
│       ↓ WebSocket (localhost:4000/ws)                          │
│  Local WebSocket Server                                         │
│    packages/server (Express + Socket.IO)                       │
│       ↓ 进程通信 (stdin/stdout)                                 │
│  Claude CLI Process                                             │
│                                                                 │
│  访问方式: http://localhost:4000                                │
│  适用场景: 本地开发、私密使用                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        在线模式（新增）                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser (www.webcc.dev/abc123)                                    │
│    packages/index (Next.js)                                    │
│       ↓ WebSocket (wss://www.webcc.dev/ws)                        │
│  Remote WebSocket Server                                        │
│    packages/online-server (纯 Socket.IO)                       │
│    Room: abc123                                                │
│       ↓ WebSocket (wss://www.webcc.dev/ws)                        │
│  Local CLI Client                                              │
│    packages/cli/online-client.js                              │
│       ↓ 进程通信 (stdin/stdout)                                 │
│  Claude CLI Process                                             │
│                                                                 │
│  访问方式: https://www.webcc.dev/{token}                           │
│  适用场景: 远程访问、多设备使用、团队协作                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 组件清单

### 需要实现的组件

| 组件                 | 位置                                               | 状态    | 优先级 | 说明                          |
| -------------------- | -------------------------------------------------- | ------- | ------ | ----------------------------- |
| **WebSocket 服务器** | `packages/online-server/`                          | ❌ 新建 | P0     | 核心，管理 rooms 和消息转发   |
| **CLI 在线客户端**   | `packages/cli/src/online-client.js`                | ❌ 新建 | P0     | 连接 WS，启动本地 CLI         |
| **CLI 命令参数**     | `packages/cli/bin/webcc.js`                        | ❌ 修改 | P0     | 添加 `--online` 参数          |
| **终端组件**         | `packages/index/src/components/TerminalClient.tsx` | ❌ 修改 | P0     | 从 iframe 改为 WebSocket 连接 |

### 不需要修改的组件

| 组件             | 位置                                      | 说明                          |
| ---------------- | ----------------------------------------- | ----------------------------- |
| **本地服务器**   | `packages/server/`                        | ✅ 保持不变，仅用于本地模式   |
| **Web 前端**     | `packages/web/`                           | ✅ 保持不变，仅用于本地模式   |
| **官网首页**     | `packages/index/src/app/page.tsx`         | ✅ 保持不变                   |
| **终端页面路由** | `packages/index/src/app/[token]/page.tsx` | ✅ 保持不变（已存在动态路由） |

## 消息流转

### 1. 启动阶段

```
┌──────────────────────────────────────────────────────────────┐
│ 本地机器: 用户执行命令                                         │
└──────────────────────────────────────────────────────────────┘

$ webcc --online

  ↓ 1. 生成随机 token
  ↓    token = nanoid(16) → "abc123def456"
  ↓
  ↓ 2. 连接 WebSocket 服务器
  ↓    wss://www.webcc.dev/ws
  ↓
  ↓ 3. 发送注册消息
  ↓    emit('register', { type: 'cli', token: 'abc123def456' })
  ↓
┌──────────────────────────────────────────────────────────────┐
│ WebSocket Server: 处理注册                                    │
└──────────────────────────────────────────────────────────────┘

  ↓ 4. 检查 token 是否已被使用
  ↓    if (rooms.has(token) && room.cliSocket) {
  ↓      emit('error', { message: 'Token in use' })
  ↓      disconnect()
  ↓    }
  ↓
  ↓ 5. 创建/更新 room
  ↓    rooms.set(token, {
  ↓      cliSocket: socket,
  ↓      browserSockets: []
  ↓    })
  ↓
  ↓ 6. 返回注册成功
  ↓    emit('registered', {
  ↓      token: 'abc123def456',
  ↓      publicUrl: 'https://www.webcc.dev/abc123def456'
  ↓    })
  ↓
┌──────────────────────────────────────────────────────────────┐
│ 本地机器: 启动 CLI 进程                                        │
└──────────────────────────────────────────────────────────────┘

  ↓ 7. 启动 Claude CLI
  ↓    spawn('expect', [expectScript])
  ↓
  ↓ 8. 监听 stdout
  ↓    cliProcess.stdout.on('data', (data) => {
  ↓      socket.emit('cli-output', { token, data })
  ↓    })
  ↓
  ↓ 9. 显示访问地址
  ✓ Connected to online service
  ℹ Public URL: https://www.webcc.dev/abc123def456
  ℹ Share this URL to allow remote access
```

### 2. 访问阶段

```
┌──────────────────────────────────────────────────────────────┐
│ 访问者: 打开浏览器                                             │
└──────────────────────────────────────────────────────────────┘

访问: https://www.webcc.dev/abc123def456

  ↓ 1. Next.js 服务器（packages/index）
  ↓    匹配路由: /[token]
  ↓    提取参数: token = "abc123def456"
  ↓
  ↓ 2. 服务端渲染
  ↓    <TerminalClient token="abc123def456" />
  ↓
  ↓ 3. 浏览器加载页面
  ↓    挂载 TerminalClient 组件
  ↓
  ↓ 4. 连接 WebSocket
  ↓    const socket = io('https://www.webcc.dev', { path: '/ws' })
  ↓
  ↓ 5. 发送注册消息
  ↓    emit('register', { type: 'browser', token: 'abc123def456' })
  ↓
┌──────────────────────────────────────────────────────────────┐
│ WebSocket Server: 处理浏览器注册                               │
└──────────────────────────────────────────────────────────────┘

  ↓ 6. 检查 room 和 CLI 是否在线
  ↓    if (!rooms.has(token) || !room.cliSocket) {
  ↓      emit('error', { message: 'CLI not connected' })
  ↓      disconnect()
  ↓    }
  ↓
  ↓ 7. 将浏览器 socket 加入 room
  ↓    room.browserSockets.push(socket)
  ↓    socket.join(token)
  ↓
  ↓ 8. 返回注册成功
  ↓    emit('registered', { token })
  ↓
  ↓ 9. 浏览器显示连接成功
  ✓ Connected to session abc123def456
```

### 3. 交互阶段

#### 用户输入流（Browser → CLI）

```
Browser: 用户按下键盘 "ls" + Enter
  ↓
  terminal.onData((data) => {
    socket.emit('cli-input', { token: 'abc123def456', data: 'ls\n' })
  })
  ↓
WebSocket Server: 接收 cli-input 事件
  ↓
  socket.on('cli-input', ({ token, data }) => {
    const room = rooms.get(token)
    if (room && room.cliSocket) {
      room.cliSocket.emit('cli-input', { data })  // 转发给 CLI
    }
  })
  ↓
Local CLI Client: 接收并写入 stdin
  ↓
  socket.on('cli-input', ({ data }) => {
    cliProcess.stdin.write(data)  // 写入 Claude CLI 进程
  })
  ↓
Claude CLI Process: 执行命令
  ↓
  接收 "ls\n"
  执行命令
  输出结果到 stdout
```

#### CLI 输出流（CLI → Browser）

```
Claude CLI Process: 输出到 stdout
  ↓
  "file1.txt\nfile2.txt\n"
  ↓
Local CLI Client: 监听 stdout
  ↓
  cliProcess.stdout.on('data', (data) => {
    socket.emit('cli-output', {
      token: 'abc123def456',
      data: 'file1.txt\nfile2.txt\n'
    })
  })
  ↓
WebSocket Server: 接收 cli-output 事件
  ↓
  socket.on('cli-output', ({ token, data }) => {
    const room = rooms.get(token)
    if (room) {
      room.browserSockets.forEach(bs => {
        bs.emit('cli-output', { data })  // 广播给所有浏览器
      })
    }
  })
  ↓
Browser: 接收并显示
  ↓
  socket.on('cli-output', ({ data }) => {
    terminal.write(data)  // 写入 xterm.js 终端
  })
  ↓
用户看到输出:
file1.txt
file2.txt
```

### 4. 断开阶段

```
情况 1: CLI 断开（用户 Ctrl+C）
  ↓
  cliProcess.on('exit', () => {
    socket.disconnect()
  })
  ↓
  WebSocket Server: 检测到 CLI socket 断开
  ↓
  socket.on('disconnect', () => {
    room.cliSocket = null
    room.browserSockets.forEach(bs => {
      bs.emit('cli-disconnected')  // 通知所有浏览器
    })
  })
  ↓
  Browser: 显示断开消息
  ↓
  socket.on('cli-disconnected', () => {
    terminal.write('\r\n[CLI disconnected]\r\n')
  })

情况 2: 浏览器断开（用户关闭标签页）
  ↓
  Browser: 关闭连接
  ↓
  WebSocket Server: 从 room 中移除
  ↓
  socket.on('disconnect', () => {
    const index = room.browserSockets.indexOf(socket)
    room.browserSockets.splice(index, 1)
  })
```

## 实现细节

### 1. WebSocket 服务器

**位置：** `packages/online-server/`

**package.json:**

```json
{
  "name": "@webccc/online-server",
  "version": "0.0.1",
  "description": "WebSocket server for online mode",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "socket.io": "^4.8.3",
    "dotenv": "^16.4.7"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**src/server.js:**

```javascript
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

// 创建 HTTP 服务器
const httpServer = createServer();

// 创建 Socket.IO 服务器
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 生产环境应该限制为 www.webcc.dev
    methods: ['GET', 'POST'],
  },
  path: '/ws',
});

// Room 管理
// rooms: Map<token, { cliSocket: Socket, browserSockets: Socket[] }>
const rooms = new Map();

// 连接事件
io.on('connection', (socket) => {
  console.log('[Server] New connection:', socket.id);

  // 注册事件
  socket.on('register', ({ type, token }) => {
    console.log(`[Server] Register request: type=${type}, token=${token}`);

    if (type === 'cli') {
      // CLI 连接
      handleCliRegister(socket, token);
    } else if (type === 'browser') {
      // 浏览器连接
      handleBrowserRegister(socket, token);
    } else {
      socket.emit('error', { message: 'Invalid type' });
      socket.disconnect();
    }
  });

  // Browser → CLI: 转发用户输入
  socket.on('cli-input', ({ token, data }) => {
    const room = rooms.get(token);
    if (room && room.cliSocket) {
      room.cliSocket.emit('cli-input', { data });
    }
  });

  // CLI → Browser: 广播 CLI 输出
  socket.on('cli-output', ({ token, data }) => {
    const room = rooms.get(token);
    if (room) {
      room.browserSockets.forEach((bs) => {
        bs.emit('cli-output', { data });
      });
    }
  });
});

// 处理 CLI 注册
function handleCliRegister(socket, token) {
  // 检查 token 是否已被使用
  if (rooms.has(token)) {
    const room = rooms.get(token);
    if (room.cliSocket) {
      socket.emit('error', { message: 'Token already in use by another CLI' });
      socket.disconnect();
      return;
    }
  } else {
    // 创建新 room
    rooms.set(token, {
      cliSocket: null,
      browserSockets: [],
    });
  }

  const room = rooms.get(token);
  room.cliSocket = socket;
  socket.join(token);

  // 返回注册成功
  const publicUrl = `https://www.webcc.dev/${token}`;
  socket.emit('registered', { token, publicUrl });
  console.log(`[Server] CLI registered: token=${token}, url=${publicUrl}`);

  // CLI 断开时清理
  socket.on('disconnect', () => {
    console.log(`[Server] CLI disconnected: token=${token}`);
    if (room.cliSocket === socket) {
      room.cliSocket = null;

      // 通知所有浏览器 CLI 已断开
      room.browserSockets.forEach((bs) => {
        bs.emit('cli-disconnected');
      });

      // 如果没有浏览器连接，删除 room
      if (room.browserSockets.length === 0) {
        rooms.delete(token);
        console.log(`[Server] Room deleted: token=${token}`);
      }
    }
  });
}

// 处理浏览器注册
function handleBrowserRegister(socket, token) {
  const room = rooms.get(token);

  // 检查 room 是否存在且 CLI 是否在线
  if (!room || !room.cliSocket) {
    socket.emit('error', {
      message: 'Invalid token or CLI not connected',
    });
    socket.disconnect();
    return;
  }

  // 将浏览器 socket 加入 room
  room.browserSockets.push(socket);
  socket.join(token);

  // 返回注册成功
  socket.emit('registered', { token });
  console.log(`[Server] Browser connected: token=${token}`);

  // 浏览器断开时清理
  socket.on('disconnect', () => {
    console.log(`[Server] Browser disconnected: token=${token}`);
    const index = room.browserSockets.indexOf(socket);
    if (index > -1) {
      room.browserSockets.splice(index, 1);
    }

    // 如果没有浏览器连接且 CLI 已断开，删除 room
    if (room.browserSockets.length === 0 && !room.cliSocket) {
      rooms.delete(token);
      console.log(`[Server] Room deleted: token=${token}`);
    }
  });
}

// 启动服务器
httpServer.listen(PORT, () => {
  console.log(`[Server] WebSocket server running on port ${PORT}`);
  console.log(`[Server] Path: /ws`);
});

// 优雅退出
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});
```

**环境变量（.env）:**

```bash
PORT=4000
```

### 2. CLI 在线客户端

**位置：** `packages/cli/src/online-client.js`

```javascript
const { spawn } = require('child_process');
const { io } = require('socket.io-client');
const { nanoid } = require('nanoid');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { generateExpectScript } = require('../../server/src/expect-template');

class OnlineClient {
  constructor(options) {
    this.options = options;
    this.token = nanoid(16); // 生成 16 位随机 token
    this.socket = null;
    this.cliProcess = null;
  }

  /**
   * 连接到在线服务器
   * @returns {Promise<string>} 公网访问 URL
   */
  async connect() {
    const serverUrl = this.options.serverUrl || 'https://www.webcc.dev';

    console.log(chalk.blue('ℹ Connecting to online service...'));

    return new Promise((resolve, reject) => {
      // 1. 连接 WebSocket 服务器
      this.socket = io(serverUrl, {
        path: '/ws',
        transports: ['websocket'],
      });

      // 2. 连接成功
      this.socket.on('connect', () => {
        console.log(chalk.green('✓ Connected to server'));

        // 3. 注册为 CLI 类型
        this.socket.emit('register', {
          type: 'cli',
          token: this.token,
        });
      });

      // 4. 注册成功
      this.socket.on('registered', ({ token, publicUrl }) => {
        console.log(chalk.green('✓ Registration successful'));
        console.log();
        console.log(chalk.cyan('═'.repeat(60)));
        console.log(chalk.bold.green('  Public Access URL:'));
        console.log(chalk.bold.cyan(`  ${publicUrl}`));
        console.log(chalk.cyan('═'.repeat(60)));
        console.log();
        console.log(chalk.gray('  Share this URL to allow remote access'));
        console.log(chalk.gray('  Press Ctrl+C to stop'));
        console.log();

        // 5. 启动本地 Claude CLI
        this.startCLI();

        // 6. 监听来自 Browser 的输入
        this.socket.on('cli-input', ({ data }) => {
          if (this.cliProcess && this.cliProcess.stdin.writable) {
            this.cliProcess.stdin.write(data);
          }
        });

        resolve(publicUrl);
      });

      // 错误处理
      this.socket.on('error', ({ message }) => {
        console.error(chalk.red('✖ Error:'), message);
        reject(new Error(message));
      });

      this.socket.on('connect_error', (error) => {
        console.error(chalk.red('✖ Connection error:'), error.message);
        reject(error);
      });
    });
  }

  /**
   * 启动本地 Claude CLI 进程
   */
  startCLI() {
    const {
      claudePath = 'claude',
      workDir = process.env.HOME,
      anthropicBaseUrl,
      anthropicAuthToken,
      anthropicModel,
      anthropicSmallFastModel,
    } = this.options;

    // 1. 生成 expect 脚本
    const expectScript = generateExpectScript({
      claudePath,
      workDir,
      env: {
        TERM: 'xterm-256color',
        ANTHROPIC_BASE_URL: anthropicBaseUrl,
        ANTHROPIC_AUTH_TOKEN: anthropicAuthToken,
        ANTHROPIC_MODEL: anthropicModel,
        ANTHROPIC_SMALL_FAST_MODEL: anthropicSmallFastModel,
      },
    });

    const tmpDir = os.tmpdir();
    const scriptPath = path.join(tmpDir, `webcc-online-${this.token}.exp`);
    fs.writeFileSync(scriptPath, expectScript);
    fs.chmodSync(scriptPath, '755');

    console.log(chalk.blue('ℹ Starting Claude CLI...'));

    // 2. 启动 expect 进程
    this.cliProcess = spawn('expect', [scriptPath], {
      cwd: workDir,
    });

    console.log(chalk.green('✓ Claude CLI started'));

    // 3. 监听 stdout 并推送到 WebSocket
    this.cliProcess.stdout.on('data', (data) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('cli-output', {
          token: this.token,
          data: data.toString(),
        });
      }
    });

    // 4. 监听 stderr
    this.cliProcess.stderr.on('data', (data) => {
      console.error(chalk.yellow('[CLI stderr]:'), data.toString());
      if (this.socket && this.socket.connected) {
        this.socket.emit('cli-output', {
          token: this.token,
          data: data.toString(),
        });
      }
    });

    // 5. 监听进程退出
    this.cliProcess.on('exit', (code) => {
      console.log(chalk.yellow(`\n[CLI] Process exited with code: ${code}`));

      // 清理临时脚本
      try {
        fs.unlinkSync(scriptPath);
      } catch (err) {
        // 忽略错误
      }

      // 断开 WebSocket
      this.disconnect();
    });

    // 6. 监听进程错误
    this.cliProcess.on('error', (err) => {
      console.error(chalk.red('✖ Failed to start CLI:'), err.message);
      this.disconnect();
    });
  }

  /**
   * 断开连接并清理资源
   */
  disconnect() {
    console.log(chalk.blue('ℹ Disconnecting...'));

    if (this.cliProcess) {
      this.cliProcess.kill('SIGTERM');
      this.cliProcess = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    console.log(chalk.green('✓ Disconnected'));
  }
}

module.exports = { OnlineClient };
```

**添加依赖到 packages/cli/package.json:**

```json
{
  "dependencies": {
    "socket.io-client": "^4.8.3",
    "nanoid": "^3.3.7"
  }
}
```

### 3. CLI 命令参数

**位置：** `packages/cli/bin/webcc.js`

**修改部分：**

```javascript
const { Command } = require('commander');
const { startClaudeCodeServer } = require('../../server/src/index');
const { OnlineClient } = require('../src/online-client');
const { loadConfig } = require('../src/config');
const { showBanner } = require('../src/banner');
const { logger } = require('../src/logger');

const program = new Command();

program
  .name('webcc')
  .description('Web Claude Code - Run Claude Code in your web browser')
  .version(require('../package.json').version)
  .option('--online', 'Start in online mode with public access')
  .action(async (options) => {
    showBanner();

    // 加载配置
    const config = await loadConfig();

    if (options.online) {
      // ============ 在线模式 ============
      logger.info('Starting in online mode...');

      try {
        const client = new OnlineClient({
          claudePath: config.CLAUDE_PATH,
          workDir: config.WORK_DIR,
          anthropicBaseUrl: config.ANTHROPIC_BASE_URL,
          anthropicAuthToken: config.ANTHROPIC_AUTH_TOKEN,
          anthropicModel: config.ANTHROPIC_MODEL,
          anthropicSmallFastModel: config.ANTHROPIC_SMALL_FAST_MODEL,
          serverUrl: process.env.WEBCC_SERVER_URL || 'https://www.webcc.dev',
        });

        const publicUrl = await client.connect();

        // 处理退出信号
        process.on('SIGINT', () => {
          console.log('\n');
          logger.info('Shutting down...');
          client.disconnect();
          process.exit(0);
        });

        process.on('SIGTERM', () => {
          logger.info('Shutting down...');
          client.disconnect();
          process.exit(0);
        });
      } catch (error) {
        logger.error('Failed to start online mode:', error.message);
        process.exit(1);
      }
    } else {
      // ============ 本地模式 ============
      logger.info('Starting in local mode...');

      try {
        const { httpServer } = startClaudeCodeServer({
          port: config.PORT,
          host: config.HOST,
          claudePath: config.CLAUDE_PATH,
          workDir: config.WORK_DIR,
          anthropicBaseUrl: config.ANTHROPIC_BASE_URL,
          anthropicAuthToken: config.ANTHROPIC_AUTH_TOKEN,
          anthropicModel: config.ANTHROPIC_MODEL,
          anthropicSmallFastModel: config.ANTHROPIC_SMALL_FAST_MODEL,
        });

        logger.success('Server started successfully!');
        logger.info('');
        logger.info('Access URLs:');
        logger.info(`  Local: http://localhost:${config.PORT}`);
        logger.info(`  Network: http://<your-ip>:${config.PORT}`);
        logger.info('');
        logger.info('Press Ctrl+C to stop the server');

        // 处理退出信号
        process.on('SIGINT', () => {
          console.log('\n');
          logger.info('Shutting down server...');
          httpServer.close(() => {
            logger.success('Server stopped');
            process.exit(0);
          });
        });
      } catch (error) {
        logger.error('Failed to start server:', error.message);
        process.exit(1);
      }
    }
  });

program.parse();
```

### 4. 终端组件（Browser）

**位置：** `packages/index/src/components/TerminalClient.tsx`

**完整实现：**

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';

interface TerminalClientProps {
  token: string;
}

export default function TerminalClient({ token }: TerminalClientProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // 1. 创建终端实例
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      scrollback: 10000,
      theme: {
        background: '#1e1e1e',
        foreground: '#e8e8e8',
        cursor: '#6bcf7f',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff',
      },
    });

    // 2. 添加 Fit 插件（自动适配窗口大小）
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // 3. 打开终端
    term.open(terminalRef.current);
    fitAddon.fit();

    // 4. 监听窗口大小变化
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    setTerminal(term);

    // 5. 连接 WebSocket 服务器
    const serverUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL || 'https://www.webcc.dev';

    term.writeln('\x1b[36mConnecting to session...\x1b[0m');

    const newSocket = io(serverUrl, {
      path: '/ws',
      transports: ['websocket', 'polling'],
    });

    // 6. 注册为 Browser
    newSocket.on('connect', () => {
      term.writeln('\x1b[32m✓ Connected to server\x1b[0m');

      newSocket.emit('register', {
        type: 'browser',
        token,
      });
    });

    // 7. 注册成功
    newSocket.on('registered', () => {
      setConnected(true);
      term.writeln('\x1b[32m✓ Joined session\x1b[0m');
      term.writeln('\x1b[36mWaiting for CLI output...\x1b[0m');
      term.writeln('');
    });

    // 8. 接收 CLI 输出
    newSocket.on('cli-output', ({ data }) => {
      term.write(data);
    });

    // 9. CLI 断开
    newSocket.on('cli-disconnected', () => {
      setConnected(false);
      term.writeln('\r\n\x1b[33m[CLI disconnected]\x1b[0m');
      term.writeln('\x1b[36mThe remote CLI session has ended.\x1b[0m');
    });

    // 10. 错误处理
    newSocket.on('error', ({ message }) => {
      setError(message);
      term.writeln(`\r\n\x1b[31m✖ Error: ${message}\x1b[0m`);
    });

    newSocket.on('connect_error', (err) => {
      setError(err.message);
      term.writeln(`\r\n\x1b[31m✖ Connection error: ${err.message}\x1b[0m`);
    });

    // 11. 发送用户输入
    term.onData((data) => {
      if (connected) {
        newSocket.emit('cli-input', { token, data });
      }
    });

    setSocket(newSocket);

    // 12. 清理
    return () => {
      term.dispose();
      newSocket.disconnect();
      resizeObserver.disconnect();
    };
  }, [token]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 状态栏 */}
      <div
        style={{
          padding: '10px 20px',
          backgroundColor: '#252526',
          borderBottom: '1px solid #3e3e42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#cccccc',
          fontSize: '14px',
        }}
      >
        <div>
          <span style={{ fontWeight: 'bold' }}>Session: </span>
          <span style={{ fontFamily: 'monospace', color: '#6bcf7f' }}>{token}</span>
        </div>
        <div>
          {connected ? (
            <span style={{ color: '#6bcf7f' }}>● Connected</span>
          ) : error ? (
            <span style={{ color: '#f14c4c' }}>● {error}</span>
          ) : (
            <span style={{ color: '#e5e510' }}>● Connecting...</span>
          )}
        </div>
      </div>

      {/* 终端区域 */}
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          padding: '10px',
        }}
      />
    </div>
  );
}
```

**添加依赖到 packages/index/package.json:**

```json
{
  "dependencies": {
    "socket.io-client": "^4.8.3",
    "@xterm/xterm": "^6.0.0",
    "@xterm/addon-fit": "^0.11.0"
  }
}
```

**环境变量（.env.local）:**

```bash
# WebSocket 服务器地址
NEXT_PUBLIC_WS_SERVER_URL=https://www.webcc.dev

# 开发环境
# NEXT_PUBLIC_WS_SERVER_URL=http://localhost:4000
```

## 部署方案

### 1. WebSocket 服务器部署

**环境要求：**

- Node.js >= 18.0.0
- Linux 服务器（推荐 Ubuntu 22.04）
- 域名：www.webcc.dev
- SSL 证书（Let's Encrypt）

**部署步骤：**

```bash
# 1. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 克隆代码
git clone https://github.com/uikoo9/web-claude-code.git
cd web-claude-code/packages/online-server

# 3. 安装依赖
npm install

# 4. 配置环境变量
cat > .env << EOF
PORT=4000
NODE_ENV=production
EOF

# 5. 使用 PM2 启动
npm install -g pm2
pm2 start src/server.js --name webcc-ws-server

# 6. 设置开机自启
pm2 startup
pm2 save

# 7. 查看日志
pm2 logs webcc-ws-server
```

**Nginx 反向代理配置：**

```nginx
# /etc/nginx/sites-available/www.webcc.dev

# WebSocket 服务器
upstream webcc_ws_server {
    server 127.0.0.1:4000;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.webcc.dev;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/www.webcc.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.webcc.dev/privkey.pem;

    # WebSocket 路由
    location /ws {
        proxy_pass http://webcc_ws_server;
        proxy_http_version 1.1;

        # WebSocket 升级
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 代理头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    # Next.js 应用（packages/index）
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name www.webcc.dev;
    return 301 https://$host$request_uri;
}
```

**启用配置：**

```bash
sudo ln -s /etc/nginx/sites-available/www.webcc.dev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Next.js 应用部署（packages/index）

```bash
# 1. 构建应用
cd packages/index
npm run build

# 2. 使用 PM2 启动
pm2 start npm --name webcc-nextjs -- start

# 3. 设置开机自启
pm2 startup
pm2 save
```

### 3. SSL 证书（Let's Encrypt）

```bash
# 1. 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 2. 获取证书
sudo certbot --nginx -d www.webcc.dev

# 3. 自动续期
sudo certbot renew --dry-run
```

## 安全考虑

### 1. Token 安全

**当前实现：**

- 使用 nanoid 生成 16 位随机字符串
- 熵：62^16 ≈ 4.7 × 10^28（足够安全）

**可选增强：**

```javascript
// 添加 Token 过期时间
const rooms = new Map(); // token -> { cliSocket, browserSockets, createdAt }

// 定期清理过期 room
setInterval(
  () => {
    const now = Date.now();
    for (const [token, room] of rooms.entries()) {
      if (now - room.createdAt > 24 * 60 * 60 * 1000) {
        // 24 小时
        // 清理过期 room
        if (room.cliSocket) room.cliSocket.disconnect();
        room.browserSockets.forEach((bs) => bs.disconnect());
        rooms.delete(token);
      }
    }
  },
  60 * 60 * 1000,
); // 每小时检查一次
```

### 2. 连接限制

```javascript
// 限制单个 token 的浏览器连接数
const MAX_BROWSER_CONNECTIONS = 10;

function handleBrowserRegister(socket, token) {
  const room = rooms.get(token);

  if (room.browserSockets.length >= MAX_BROWSER_CONNECTIONS) {
    socket.emit('error', { message: 'Too many connections' });
    socket.disconnect();
    return;
  }

  // ... 正常注册逻辑
}
```

### 3. CORS 配置

**开发环境：**

```javascript
cors: {
  origin: '*',
}
```

**生产环境：**

```javascript
cors: {
  origin: 'https://www.webcc.dev',
  methods: ['GET', 'POST'],
}
```

### 4. 速率限制

```javascript
const rateLimit = require('socket.io-rate-limit');

io.use(
  rateLimit({
    tokensPerInterval: 100, // 每个间隔允许 100 条消息
    interval: 1000, // 1 秒
    fireImmediately: true,
  }),
);
```

### 5. 数据加密

- ✅ 使用 HTTPS/WSS 加密传输
- ✅ 敏感数据（API Token）不经过服务器
- ✅ 本地 CLI 直接连接 Anthropic API

## 与本地模式对比

| 特性           | 本地模式                | 在线模式                      |
| -------------- | ----------------------- | ----------------------------- |
| **访问方式**   | http://localhost:4000   | https://www.webcc.dev/{token} |
| **网络要求**   | 本地网络                | 公网访问                      |
| **需要启动**   | HTTP Server + WS Server | 仅 CLI Client                 |
| **多设备访问** | ❌ 不支持               | ✅ 支持                       |
| **团队协作**   | ❌ 不支持               | ✅ 支持（多人同时访问）       |
| **数据隐私**   | ✅ 完全本地             | ⚠️ 经过中转服务器             |
| **性能延迟**   | 极低（本地通信）        | 较低（取决于网络）            |
| **适用场景**   | 开发、测试、私密使用    | 远程访问、演示、协作          |

## 后续优化

### 短期（MVP）

- ✅ 基础功能实现（上述 4 个组件）
- ✅ 本地开发测试
- ✅ 服务器部署和配置

### 中期（增强）

- [ ] Token 过期机制
- [ ] 连接数限制
- [ ] 访问日志记录
- [ ] 监控和告警
- [ ] 错误重试机制

### 长期（增值功能）

- [ ] **自定义域名**（付费）
  - 用户可设置 `yourname.www.webcc.dev`
  - 需要用户认证系统

- [ ] **持久化隧道**（付费）
  - 固定 token，不随重启变化
  - 支持自定义短链接

- [ ] **访问控制**
  - 密码保护
  - IP 白名单
  - OAuth 登录

- [ ] **协作功能**
  - 实时光标显示
  - 多人同步输入
  - 权限管理（只读/读写）

- [ ] **监控和统计**
  - Dashboard 显示连接数
  - 流量统计
  - 性能分析

## 总结

### 核心优势

1. **架构简洁**：没有隧道代理层，直接 WebSocket 通信
2. **实现简单**：只需 4 个文件修改/新建
3. **性能优秀**：减少一层转发，延迟更低
4. **易于扩展**：Room 机制天然支持多人协作

### 技术要点

- **服务端**：纯 Socket.IO 服务器，管理 rooms 和消息转发
- **客户端**：本地 CLI 直接连接远程 WS，启动 Claude CLI 进程
- **前端**：packages/index 的 TerminalClient 组件连接远程 WS
- **部署**：Nginx 反向代理，PM2 进程管理，Let's Encrypt SSL

### 关键决策

- ✅ 使用 nanoid 生成 token（安全性足够）
- ✅ 使用 Socket.IO room 管理多连接
- ✅ 复用 packages/index 的终端页面路由
- ✅ 不修改 packages/web 和 packages/server（本地模式独立）

---

**文档版本：** v1.0
**创建日期：** 2026-02-16
**作者：** Claude Sonnet 4.5
**审阅状态：** 待审阅
