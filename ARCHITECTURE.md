# Web Claude Code - Architecture Documentation

> 项目架构和实现详细说明文档
>
> 更新时间：2026-02-09

## 目录

- [项目概览](#项目概览)
- [Monorepo 结构](#monorepo-结构)
- [各包详细说明](#各包详细说明)
- [架构设计](#架构设计)
- [技术栈](#技术栈)
- [配置文件](#配置文件)
- [开发流程](#开发流程)
- [已完成功能](#已完成功能)
- [待实现功能](#待实现功能)

## 项目概览

**项目名称**: web-claude-code
**项目类型**: Monorepo (Lerna + Nx)
**项目目标**: 为 Claude Code CLI 提供 Web 浏览器界面
**仓库地址**: https://github.com/uikoo9/web-claude-code
**官方网站**: https://webcc.dev

### 核心价值

- 🌐 在任何设备的浏览器中使用 Claude Code
- 🚀 零配置启动（交互式配置向导）
- 💻 完整的终端体验（基于 xterm.js）
- 🎨 Mac 风格的优雅 UI 设计
- ⚡ WebSocket 实时双向通信

## Monorepo 结构

项目使用 Lerna (独立版本管理) + Nx (构建缓存) 管理 5 个包：

```
web-claude-code/
├── packages/
│   ├── cli/           # @webccc/cli (v0.1.3) - 命令行入口 ✅ 将发布
│   ├── cli-server/    # @webccc/cli-server (v0.1.0) - 服务器核心 ✅ 将发布
│   ├── cli-web/       # @webccc/cli-web (v0.0.7) - Web 界面 ❌ 不发布
│   ├── ui-terminal/   # @webccc/ui-terminal (v0.1.2) - 终端组件 ❌ 不发布
│   └── index/         # @webccc/index (v0.0.2) - 官方网站 ❌ 不发布
├── CLAUDE.md          # Claude Code 指南
├── TECHNICAL_DECISIONS.md  # 技术决策记录
├── ARCHITECTURE.md    # 本文档
├── lerna.json         # Lerna 配置
├── nx.json            # Nx 配置
└── package.json       # 根配置
```

### 包依赖关系

```
@webccc/cli (0.1.3)
    └─> @webccc/cli-server (0.1.0)

@webccc/cli-web (0.0.7, private)
    └─> @webccc/ui-terminal (0.1.2)
    └─> build output → @webccc/cli-server/views/

@webccc/ui-terminal (0.1.2, private)
    └─> 共享终端组件（React + xterm.js）

@webccc/index (0.0.2, private)
    └─> 独立部署到 webcc.dev
```

## 各包详细说明

### 1. @webccc/cli (packages/cli)

**版本**: 0.0.8
**状态**: ✅ 已完成
**是否发布**: 是

#### 目录结构

```
packages/cli/
├── bin/
│   └── webcc.js              # CLI 入口（shebang: #!/usr/bin/env node）
├── src/
│   ├── banner.js             # ASCII Banner（使用 figlet）
│   ├── config.js             # 配置管理（dotenv + inquirer）
│   └── logger.js             # 彩色日志（chalk）
├── package.json
├── README.md
└── README.zh-CN.md
```

#### 核心功能

1. **命令行入口**:
   - 全局安装后可用 `webcc` 命令
   - 使用 Commander.js 解析命令行参数
   - 支持 `-h/--help`、`-v/--version` 参数

2. **配置管理** (`config.js`):

   ```javascript
   // 配置加载流程
   检查 .env 文件
       ├─> 存在：加载配置 → 启动服务器
       └─> 不存在：启动交互式问答 → 收集配置 → 启动服务器
   ```

   - 必填项：`ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN`
   - 可选项：`CLAUDE_PATH`、`WORK_DIR`、`PORT`、`HOST`、模型配置

3. **ASCII Banner**:

   ```
     _    _      _      _____ _____
    | |  | |    | |    /  __ /  __ \
    | |  | | ___| |__  | /  \| /  \/
    | |/\| |/ _ | '_ \ | |   | |
    \  /\  |  __| |_) || \__/| \__/\
     \/  \/ \___|_.__/  \____/\____/

     webcc.dev: web-claude-code
     Version: 0.0.8
   ```

4. **服务器启动**:
   - 调用 `@webccc/cli-server` 的 `startClaudeCodeServer()` 方法
   - 传递配置参数
   - 处理启动错误和进程退出

#### 关键依赖

- `@webccc/cli-server`: ^0.1.0
- `commander`: ^14.0.3
- `inquirer`: ^8.2.6
- `chalk`: ^4.1.2
- `figlet`: ^1.10.0
- `dotenv`: ^16.4.7

### 2. @webccc/cli-server (packages/cli-server)

**版本**: 0.1.0
**状态**: ✅ 已完成
**是否发布**: 是

#### 目录结构

```
packages/cli-server/
├── src/
│   ├── index.js              # 导出主函数 startClaudeCodeServer()
│   ├── app.js                # Express 应用配置
│   ├── socket.js             # Socket.IO 服务器配置
│   ├── cli.js                # Claude CLI 进程管理器
│   ├── expect-template.js    # expect 脚本模板生成器
│   └── logger.js             # 日志工具
├── views/                    # Web 静态文件（来自 @webccc/cli-web 构建）
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
├── server.js                 # 开发用启动脚本
└── package.json
```

#### 核心功能

##### 1. Express 静态服务器 (`app.js`)

```javascript
// 功能
- 提供静态文件服务（views 目录）
- CORS 配置（开发环境支持 localhost:3000）
- 正确的 MIME 类型设置
- 错误处理中间件
```

##### 2. Socket.IO 实时通信 (`socket.js`)

```javascript
// WebSocket 配置
路径: /ws
CORS: 允许所有来源

// 事件处理
socket.on('connection', (socket) => {
  // 客户端连接 → 自动启动 Claude CLI
  startCLI()

  socket.on('cli-input', (data) => {
    // 接收用户输入 → 写入 CLI stdin
    cliProcess.stdin.write(data)
  })

  socket.on('cli-restart', () => {
    // 重启 CLI 进程
    stopCLI()
    startCLI()
  })
})

// 向客户端推送输出
socket.emit('cli-output', data)
```

##### 3. Claude CLI 进程管理 (`cli.js`)

```javascript
// 使用 expect 脚本封装 Claude CLI
const expectScript = generateExpectScript({
  claudePath: 'claude',
  workDir: process.env.HOME,
  env: {
    TERM: 'xterm-256color',
    ANTHROPIC_BASE_URL: '...',
    ANTHROPIC_AUTH_TOKEN: '...',
    // ... 其他环境变量
  },
});

// 通过 spawn 启动 expect 脚本
const cliProcess = spawn('expect', [expectScript]);

// 流管理
cliProcess.stdout.on('data', (data) => {
  // 推送到客户端
  io.emit('cli-output', data.toString());
});

cliProcess.on('exit', () => {
  // 清理临时文件
  fs.unlinkSync(expectScript);
});
```

##### 4. expect 脚本生成 (`expect-template.js`)

```tcl
#!/usr/bin/expect -f
# 设置超时
set timeout -1

# 启动 Claude CLI
spawn /path/to/claude

# 交互模式：直接转发输入输出
interact
```

#### 配置参数

```javascript
{
  port: 4000,                  // 服务器端口
  host: '0.0.0.0',            // 监听地址
  claudePath: 'claude',        // Claude CLI 路径
  workDir: process.env.HOME,   // 工作目录
  anthropicBaseUrl: '',        // API Base URL（必填）
  anthropicAuthToken: '',      // Auth Token（必填）
  anthropicModel: 'claude-sonnet-4-5-20250929',
  anthropicSmallFastModel: 'claude-sonnet-4-5-20250929'
}
```

#### 关键依赖

- `express`: ^5.2.1
- `socket.io`: ^4.8.3
- `cors`: ^2.8.6
- `chalk`: ^4.1.2
- `dotenv`: ^16.4.7
- **系统依赖**: `expect` 工具（PTY 支持）

### 3. @webccc/cli-web (packages/cli-web)

**版本**: 0.0.7
**状态**: ✅ 已完成
**是否发布**: 否（构建产物集成到 cli-server）

#### 目录结构

```
packages/cli-web/
├── src/
│   ├── main.jsx              # React 应用入口
│   ├── App.jsx               # 主组件
│   └── App.css               # 样式
├── index.html                # HTML 模板
├── vite.config.js            # Vite 配置
└── package.json
```

#### 核心功能

##### 1. 终端模拟器（xterm.js）

```javascript
// 终端配置
const terminal = new Terminal({
  cursorBlink: true, // 光标闪烁
  cursorStyle: 'block', // 块状光标
  fontSize: 14, // 字体大小
  fontFamily: 'Menlo, Monaco, monospace',
  scrollback: 10000, // 10000 行回滚缓冲
  theme: {
    background: '#1e1e1e',
    foreground: '#e8e8e8',
    cursor: '#6bcf7f',
    // ... 完整 16 色配置
  },
});

// FitAddon 自动适配窗口大小
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
fitAddon.fit();

// 监听窗口大小变化
const resizeObserver = new ResizeObserver(() => {
  fitAddon.fit();
});
resizeObserver.observe(terminalRef.current);
```

##### 2. Socket.IO 客户端

```javascript
// 连接配置
const socketUrl = import.meta.env.DEV
  ? 'http://localhost:4000' // 开发环境
  : window.location.origin; // 生产环境

const socket = io(socketUrl, {
  path: '/ws',
  transports: ['websocket', 'polling'],
});

// 事件监听
socket.on('connect', () => {
  setConnected(true);
});

socket.on('cli-output', (data) => {
  terminal.write(data);
});

// 发送用户输入
terminal.onData((data) => {
  socket.emit('cli-input', data);
});
```

##### 3. Mac 风格 UI

```css
/* 窗口容器 */
.terminal-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Mac 三色按钮 */
.window-controls {
  display: flex;
  gap: 8px;
}
.control-button.red {
  background: #ff5f56;
}
.control-button.yellow {
  background: #ffbd2e;
}
.control-button.green {
  background: #27c93f;
}

/* 工具栏 */
.toolbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

##### 4. 用户功能

- **清空终端**: 调用 `terminal.clear()`
- **重启 CLI**: 发送 `cli-restart` 事件
- **连接状态**: 实时显示连接/断开状态
- **响应式设计**: 适配各种屏幕尺寸

#### Vite 配置

```javascript
// vite.config.js
export default {
  base: '/',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../cli-server/views', // 输出到 cli-server 包
    emptyOutDir: true,
  },
};
```

#### 关键依赖

- `react`: ^19.2.4
- `react-dom`: ^19.2.4
- `@webccc/ui-terminal`: ^0.1.2
- `vite`: ^7.3.1

### 4. @webccc/ui-terminal (packages/ui-terminal)

**版本**: 0.1.2
**状态**: ✅ 已完成
**是否发布**: 否（供 cli-web 使用）

#### 目录结构

```
packages/ui-terminal/
├── src/
│   ├── Terminal.jsx          # 终端组件
│   ├── Terminal.css          # 样式
│   └── index.js              # 导出入口
├── dist/                     # 构建输出
│   ├── index.js
│   ├── index.esm.js
│   └── index.css
├── rollup.config.js          # Rollup 配置
└── package.json
```

#### 核心功能

##### 1. 终端组件封装

```javascript
// 支持本地和在线两种模式
<TerminalComponent
  mode="local" // 本地模式
  // mode="online"          // 在线模式
  // token="xxx"            // 在线模式需要 token
  // wsUrl="https://..."    // 在线模式需要 WebSocket URL
/>
```

##### 2. 终端模拟器（xterm.js）

```javascript
// 终端配置
const terminal = new Terminal({
  cursorBlink: true, // 光标闪烁
  fontSize: 14, // 字体大小
  fontFamily: 'Cascadia Code, Fira Code, monospace',
  scrollback: 10000, // 10000 行回滚缓冲
  theme: {
    background: '#1e1e1e',
    foreground: '#e8e8e8',
    cursor: '#6bcf7f',
    // ... 完整 16 色配置
  },
});
```

##### 3. 历史记录持久化

- 自动保存终端输出到 localStorage
- 支持 5MB 大小限制和 10000 行限制
- 刷新页面自动恢复历史记录
- 本地和在线模式分别存储（基于 token）
- 清空终端时同时清空历史记录

##### 4. Socket.IO 客户端

```javascript
// 连接配置
const socket = io(wsUrl, {
  path: '/ws',
  transports: ['websocket'],
});

// 事件监听
socket.on('connect', () => {
  setIsConnected(true);
});

socket.on('cli-output', (data) => {
  terminal.write(data.data);
  saveHistory(data.data); // 保存到 localStorage
});

// 发送用户输入
terminal.onData((data) => {
  socket.emit('cli-input', data);
});
```

#### 关键依赖

- `react`: ^18.0.0 || ^19.0.0
- `@xterm/xterm`: ^6.0.0
- `@xterm/addon-fit`: ^0.11.0
- `socket.io-client`: ^4.8.3

### 5. @webccc/index (packages/index)

**版本**: 0.0.2
**状态**: ✅ 已完成
**是否发布**: 否（独立部署）

#### 技术栈

- **框架**: Next.js 16.1.6 (App Router)
- **UI 库**: Chakra UI v3 (3.32.0)
- **语言**: TypeScript 5.9.3
- **国际化**: next-intl 4.8.2
- **主题**: next-themes 0.4.6
- **动画**: Framer Motion 12.33.0

#### 目录结构

```
packages/index/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # 根布局（Provider、SEO）
│   │   ├── page.tsx          # 首页
│   │   ├── providers.tsx     # 所有 Provider 配置
│   │   ├── robots.ts         # robots.txt 生成
│   │   └── sitemap.ts        # sitemap.xml 生成
│   ├── components/
│   │   ├── Header.tsx        # 导航栏（语言/主题切换）
│   │   ├── Hero.tsx          # Hero 区域
│   │   ├── Steps.tsx         # 安装步骤说明
│   │   ├── Footer.tsx        # 页脚
│   │   └── ...
│   ├── contexts/
│   │   └── ThemeContext.tsx  # 主题状态管理
│   ├── i18n/                 # 国际化配置
│   └── lib/
│       └── themes.ts         # Chakra UI 主题定义
├── messages/
│   ├── en.json               # 英文翻译
│   └── zh.json               # 中文翻译
└── public/                   # 静态资源
```

#### 核心功能

1. **双语支持**:
   - 中文（zh）和英文（en）
   - 基于 next-intl 实现
   - URL 路径自动切换（/、/en）

2. **主题切换**:
   - 亮色/暗色模式
   - 基于 next-themes
   - 持久化保存用户偏好

3. **SEO 优化**:
   - Metadata API（title, description, keywords）
   - Open Graph（社交分享）
   - Twitter Card
   - Sitemap 和 robots.txt
   - Schema.org 结构化数据

4. **响应式设计**:
   - 移动端/平板/桌面适配
   - Chakra UI 响应式断点

## 架构设计

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      Web Terminal (@webccc/ui-terminal component)     │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Terminal UI     Socket.IO Client    Controls   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/WebSocket
                          │ (localhost:3000 → :4000)
┌─────────────────────────┴───────────────────────────────────┐
│              Express Server (:4000) @webccc/cli-server      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Static File Server (views/)    Socket.IO Server      │ │
│  └───────────��─────────┬────────────────┬─────────────────┘ │
└────────────────────────┼────────────────┼───────────────────┘
                         │                │
            ┌────────────┴────────┐       │ socket events
            │ Express Middleware  │       │ (cli-input/cli-output)
            │   - CORS            │       │
            │   - Static          │       │
            └─────────────────────┘       │
                                          │
┌─────────────────────────────────────────┴───────────────────┐
│                   CLI Process Manager                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  spawn('expect', [expectScript])                       │ │
│  │    ↓                                                   │ │
│  │  expect script (PTY wrapper)                           │ │
│  │    ↓                                                   │ │
│  │  Claude CLI Process                                    │ │
│  │    - stdin:  socket input                              │ │
│  │    - stdout: → socket output                           │ │
│  │    - stderr: → logger                                  │ │
│  │    - env:    ANTHROPIC_*, TERM=xterm-256color          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP API
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      Anthropic API                           │
│                 (ANTHROPIC_BASE_URL)                         │
└─────────────────────────────────────────────────────────────┘
```

### 数据流

#### 1. 用户输入流

```
用户键盘输入
  → xterm.js terminal.onData()
  → socket.emit('cli-input', data)
  → Socket.IO 服务器接收
  → cliProcess.stdin.write(data)
  → Claude CLI 处理
```

#### 2. CLI 输出流

```
Claude CLI 输出
  → cliProcess.stdout.on('data')
  → io.emit('cli-output', data)
  → Socket.IO 客户端接收
  → terminal.write(data)
  → 浏览器显示
```

#### 3. 进程生命周期

```
客户端连接
  → socket.on('connection')
  → startCLI()
      → 生成 expect 脚本
      → spawn('expect', [script])
      → 监听 stdout/stderr
      → 设置 cliProcess 引用
  → 等待用户输入

客户端断开
  → socket.on('disconnect')
  → stopCLI()
      → cliProcess.kill()
      → 清理临时文件
      → 清除引用
```

## 技术栈

### 前端

| 技术             | 版本   | 用途             |
| ---------------- | ------ | ---------------- |
| React            | 19.2.4 | UI 框架          |
| xterm.js         | 6.0.0  | 终端模拟器       |
| Socket.IO Client | 4.8.3  | WebSocket 客户端 |
| Vite             | 7.3.1  | 构建工具         |
| Next.js          | 16.1.6 | 官网框架         |
| Chakra UI        | 3.32.0 | 官网 UI 库       |

### 后端

| 技术      | 版本  | 用途                    |
| --------- | ----- | ----------------------- |
| Express   | 5.2.1 | Web 服务器              |
| Socket.IO | 4.8.3 | WebSocket 服务器        |
| node-pty  | -     | PTY 支持（通过 expect） |
| expect    | -     | 伪终端封装              |

### 工程化

| 技术        | 版本   | 用途          |
| ----------- | ------ | ------------- |
| Lerna       | 8.2.1  | Monorepo 管理 |
| Nx          | 22.1.1 | 构建缓存      |
| Husky       | 9.2.2  | Git Hooks     |
| lint-staged | 15.3.0 | 预提交检查    |
| Commitlint  | 19.9.0 | 提交规范      |
| ESLint      | 9.20.0 | 代码检查      |
| Prettier    | 3.5.2  | 代码格式化    |

## 配置文件

### Lerna 配置 (lerna.json)

```json
{
  "version": "independent",
  "command": {
    "version": {
      "allowBranch": "main"
    },
    "publish": {
      "allowBranch": "main",
      "message": "chore(release): publish"
    }
  }
}
```

**说明**:

- `independent`: 各包独立版本管理
- `allowBranch: main`: 只允许在 main 分支发布

### Nx 配置 (nx.json)

```json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  },
  "defaultBase": "main"
}
```

**说明**:

- `cache: true`: 启用构建缓存
- `dependsOn: ["^build"]`: 构建前先构建依赖

### lint-staged 配置 (.lintstagedrc.js)

```javascript
module.exports = {
  '**/*': () => ['npm run prettier', 'npm run eslint'],
};
```

### commitlint 配置 (.commitlintrc.js)

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

**提交格式**:

```
<type>(<scope>): <subject>

feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 开发流程

### 开发环境启动

#### 方式 1: 分别启动（开发模式）

```bash
# 终端 1: 启动 WebSocket 服务器
cd packages/cli-server
npm start

# 终端 2: 启动前端开发服务器
cd packages/cli-web
npm run dev
```

访问: http://localhost:3000

#### 方式 2: 使用根命令（推荐）

```bash
# Web 开发
npm run web:dev

# Server 启动（包含 Web 构建）
npm run server:start

# CLI 启动
npm run cli:start
```

### 构建流程

```bash
# 1. 构建 Web 包（输出到 server/views/）
npm run web:build

# 2. 构建所有包
npm run build

# 3. 发布包（只发布 cli 和 server）
npm run pb
```

### 代码提交流程

```bash
# 1. 添加文件
git add .

# 2. 提交（会自动运行 prettier + eslint）
npm run cz
# 或
git commit -m "feat: xxx"

# 3. 推送
git push
```

### Git Hooks

**.husky/pre-commit**:

```bash
npx lint-staged
```

**.husky/commit-msg**:

```bash
npx --no -- commitlint --edit $1
```

## 已完成功能

### CLI 包 ✅

- [x] 命令行入口和参数解析
- [x] .env 配置文件自动检测
- [x] 交互式配置向导（inquirer）
- [x] ASCII Banner 显示
- [x] 彩色日志输出（chalk）
- [x] 优雅的进程退出处理
- [x] npm 发布配置

### CLI Server 包 ✅

- [x] Express 静态文件服务
- [x] Socket.IO 实时通信
- [x] Claude CLI 进程管理
- [x] expect 脚本封装（PTY 支持）
- [x] 环境变量注入
- [x] 错误处理和日志
- [x] Web 静态文件集成
- [x] CORS 配置
- [x] npm 发布配置

### CLI Web 包 ✅

- [x] React 应用框架
- [x] 集成 ui-terminal 组件
- [x] Vite 构建配置
- [x] 输出到 cli-server/views

### UI Terminal 包 ✅

- [x] xterm.js 终端模拟器
- [x] Socket.IO 客户端连接
- [x] Mac 风格 UI 设计
- [x] 响应式布局
- [x] 连接状态显示
- [x] 清空终端功能
- [x] 自动窗口大小适配
- [x] 10000 行回滚缓冲
- [x] 完整的终端主题配置
- [x] localStorage 历史记录持久化
- [x] 本地/在线双模式支持

### Index 包 ✅

- [x] Next.js App Router 架构
- [x] Chakra UI v3 组件库
- [x] 双语国际化（中文/英文）
- [x] 亮色/暗色主题切换
- [x] SEO 优化（metadata, sitemap, robots.txt）
- [x] 响应式设计
- [x] Open Graph 和 Twitter Card
- [x] 安装步骤说明
- [x] 独立部署到 webcc.dev

### 工程化 ✅

- [x] Lerna + Nx monorepo 管理
- [x] 独立版本管理
- [x] Husky + lint-staged 代码质量控制
- [x] Commitlint 提交规范
- [x] ESLint + Prettier 代码风格
- [x] npm 发布流程
- [x] 构建缓存优化

## 待实现功能

根据 `TECHNICAL_DECISIONS.md`，以下功能已规划：

### 远程访问功能 ❌

**目标**: 让其他设备通过公网访问本地 Web Claude Code

**技术方案**: 自建反向代理隧道服务（基于 webcc.dev）

**需要实现**:

1. **服务端（webcc.dev）**:
   - [ ] 隧道代理服务器
   - [ ] Token 认证系统
   - [ ] 连接管理
   - [ ] 负载均衡
   - [ ] 监控和日志

2. **客户端（@webccc/cli-server）**:
   - [ ] 隧道客户端 (`tunnel.js`)
   - [ ] WebSocket 持久连接
   - [ ] 心跳保活机制
   - [ ] 断线重连
   - [ ] Token 管理

3. **CLI 集成**:
   - [ ] `webcc --tunnel` 命令
   - [ ] Token 配置（.env 或交互式）
   - [ ] 显示公网访问 URL
   - [ ] 状态监控界面

4. **安全机制**:
   - [ ] Token 认证
   - [ ] 流量加密（TLS/SSL）
   - [ ] 访问日志记录
   - [ ] 速率限制

**技术栈**:

- 隧道协议: WebSocket + HTTP 代理
- 反向代理: Nginx 或 Node.js 服务
- 认证: JWT Token
- 部署: Docker + 云服务器

### 未来增值功能 💡

- [ ] **自定义域名**（付费）
  - 用户可绑定自己的域名
  - 自动 SSL 证书配置

- [ ] **持久化隧道**（付费）
  - 固定的公网 URL
  - 不会因重启而变化

- [ ] **访问控制**
  - 密码保护
  - IP 白名单
  - OAuth 登录

- [ ] **协作功能**
  - 多人同时访问
  - 实时协作
  - 权限管理

- [ ] **监控和统计**
  - 访问量统计
  - 流量监控
  - 性能分析

### 其他优化 🔧

- [ ] **性能优化**
  - 减少首屏加载时间
  - WebSocket 连接优化
  - 终端渲染性能优化

- [ ] **用户体验**
  - 更多终端主题
  - 自定义字体和颜色
  - 快捷键支持
  - 历史记录

- [ ] **文档完善**
  - API 文档
  - 开发指南
  - 贡献指南
  - 常见问题

## 环境要求

### 运行环境

- **Node.js**: >= 14.0.0
- **Claude CLI**: 已安装并可用
- **expect 工具**: PTY 支持
  - macOS: `brew install expect`
  - Ubuntu/Debian: `sudo apt-get install expect`
  - Windows: 使用 WSL

### 开发环境

- **Git**: 版本控制
- **npm**: >= 7.0.0
- **编辑器**: VS Code（推荐）

### Anthropic API

- **API Base URL**: 必填
- **Auth Token**: 必填
- **支持的模型**:
  - claude-sonnet-4-5-20250929（默认）
  - 其他 Claude 模型

## 项目统计

- **总代码行数**: 约 3,000 行（不含 node_modules）
- **包数量**: 5 个
- **配置文件**: 9 个核心配置
- **Git Hooks**: 2 个（pre-commit, commit-msg）
- **npm 脚本**: 13 个

## 项目特色

1. **开箱即用**: 全局安装后直接运行 `webcc`
2. **零配置启动**: 交互式配置向导
3. **完整终端体验**: 基于 xterm.js 的完整仿真
4. **Mac 风格设计**: 精美的 UI，类似原生应用
5. **实时通信**: WebSocket 双向通信，低延迟
6. **Monorepo 架构**: 清晰的包划分和依赖管理
7. **工程化完善**: Git hooks、代码规范、自动化发布
8. **国际化支持**: 官网支持中英文双语
9. **SEO 优化**: 完善的 SEO 配置
10. **响应式设计**: 适配所有设备

## 相关链接

- **GitHub**: https://github.com/uikoo9/web-claude-code
- **官网**: https://webcc.dev
- **Issues**: https://github.com/uikoo9/web-claude-code/issues
- **npm - @webccc/cli**: https://www.npmjs.com/package/@webccc/cli
- **npm - @webccc/cli-server**: https://www.npmjs.com/package/@webccc/cli-server

## 更新日志

- **2026-02-18**: 包重命名（server→cli-server, web→cli-web, terminal-component→ui-terminal），新增 ui-terminal 包，优化 terminal UI
- **2026-02-09**: 创建架构文档，记录完整项目结��和实现细节
- **2026-01-XX**: 完成核心功能（CLI、CLI Server、CLI Web、UI Terminal）
- **2026-01-XX**: 官网上线（webcc.dev）
- **2026-01-XX**: 发布到 npm（@webccc/cli、@webccc/cli-server）

---

文档维护者: Claude Code
最后更新: 2026-02-18
