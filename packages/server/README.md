# @webccc/server

Web Claude Code Server - 为 Claude Code 提供 Web 界面的服务器端实现。

## 简介

这是一个基于 Express 和 Socket.IO 的服务器，它：

- 启动并管理 Claude CLI 进程
- 提供 WebSocket 接口供前端通过浏览器与 Claude CLI 交互
- 托管静态 Web 界面文件

## 安装

```bash
npm install @webccc/server
```

## 使用方法

```javascript
const { startClaudeCodeServer } = require('@webccc/server');

// 使用默认配置启动服务器（推荐）
const server = startClaudeCodeServer();

// 或者自定义端口和主机
const server = startClaudeCodeServer({
  port: 8080, // 自定义端口
  host: '0.0.0.0', // 监听所有网络接口
});

// 在需要时停止服务器
process.on('SIGINT', () => {
  server.stop();
  process.exit(0);
});
```

## API 接口

### startClaudeCodeServer(options)

启动 Claude Code Web 服务器。

**参数：**

- `options` (Object) - 可选配置对象
  - `port` (number) - 服务器端口，默认 `4000`
  - `host` (string) - 服务器主机，默认 `'0.0.0.0'`

**返回值：**

返回一个对象，包含以下属性：

- `app` - Express 应用实例
- `httpServer` - HTTP 服务器实例
- `io` - Socket.IO 实例
- `stop()` - 停止服务器的方法

## HTTP 路由

- `GET /` - 返回 Web 界面的 index.html
- `GET /assets/*` - 静态资源文件（CSS、JS 等）

## WebSocket 事件

**路径：** `/ws`

### 客户端 → 服务器

- `cli-input` - 发送输入到 Claude CLI
- `cli-restart` - 重启 Claude CLI 进程

### 服务器 → 客户端

- `cli-output` - Claude CLI 的输出
  ```javascript
  {
    type: 'stdout' | 'stderr' | 'exit' | 'error',
    data: string,
    time: string // ISO 8601 格式
  }
  ```

## 目录结构

```
packages/server/
├── index.js           # 主模块，导出 startClaudeCodeServer
├── server.js          # 独立运行的服务器入口
├── run-claude.exp     # expect 脚本，用于启动 Claude CLI
├── views/             # Web 界面静态文件（构建产物）
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
├── package.json
└── README.md
```

## 环境要求

- Node.js >= 14.0.0
- Claude CLI 已安装在系统中
- expect 工具（用于 PTY 支持）

## 跨平台说明

目前 `run-claude.exp` 脚本使用 expect（Unix/Linux/macOS）来提供 PTY 支持。在不同平台上需要：

- **macOS/Linux**: 需要安装 expect 工具

  ```bash
  # macOS
  brew install expect

  # Ubuntu/Debian
  sudo apt-get install expect
  ```

- **Windows**: 需要使用替代方案，如 WSL 或 node-pty

## 依赖

- `express` - Web 框架
- `socket.io` - WebSocket 通信
- `cors` - 跨域资源共享

## License

MIT
