# Terminal Integration Architecture

## 背景

### 项目现状

**packages/web**

- React 19 + Vite 构建的 SPA 应用
- 使用 xterm.js 实现终端模拟器
- 通过 Socket.IO 连接本地 WebSocket 服务（4000 端口）
- 当前构建产物输出到 `packages/server/views/`

**packages/index**

- Next.js 16 官网项目（SSR/SSG）
- 已有用户认证系统
- 已有 Access Token 管理功能
- 需要集成终端访问功能

**packages/server**

- Express + Socket.IO 后端服务
- 管理本地 Claude CLI 进程
- 提供 WebSocket 连接桥接 stdin/stdout
- 服务静态文件（packages/web 的构建产物）

### 需求目标

**用户使用场景 1：本地模式**

```bash
# 用户本地运行
$ webcc
-> 本地启动 packages/server（端口 4000）
-> 自动打开浏览器访问 http://localhost:4000
-> WebSocket 连接本地服务
-> 本地 Claude CLI 处理请求
```

**用户使用场景 2：在线模式**

```bash
# 用户访问在线服务
$ webcc login
-> CLI 提示访问 webcc.dev 获取 Access Token
-> 用户登录后获得 token: abc123

$ webcc online abc123
-> 或者用户直接浏览器访问 https://webcc.dev/abc123
-> Next.js SSR 验证 token
-> 返回终端页面
-> WebSocket 连接在线服务 wss://ws.webcc.dev
-> 在线 WebSocket 服务处理请求
-> 本地 Claude CLI 通过 WebSocket 与在线服务对接
```

### 核心挑战

1. **xterm.js 必须运行在浏览器**：需要 DOM API，不能 SSR
2. **双模式支持**：同一套代码支持本地和在线两种模式
3. **构建产物复用**：packages/web 的产物需要被两个项目使用
   - packages/server：本地模式，Express 直接返回静态 HTML
   - packages/index：在线模式，Next.js 加 SSR 验证层后返回
4. **WebSocket 地址自动切换**：本地用 localhost:4000，在线用 wss://ws.webcc.dev

---

## 最终方案

### 架构设计

```
┌──────────────────────────────────────────────────────────────┐
│ packages/web (源码 - Vite SPA)                                 │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ src/App.jsx                                               │ │
│ │ - xterm.js 终端组件                                       │ │
│ │ - WebSocket 自动环境检测                                  │ │
│ │   • 本地模式: ws://localhost:4000                        │ │
│ │   • 在线模式: wss://ws.webcc.dev                         │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ npm run build
                            ↓
        ┌───────────────────┴────────────────────┐
        │                                        │
        ↓                                        ↓
┌──────────────────────┐              ┌──────────────────────────┐
│ packages/server      │              │ packages/index           │
│ /views/              │              │ /public/terminal/        │
│ ├── index.html       │              │ ├── index.html           │
│ └── assets/          │              │ └── assets/              │
│     ├── *.js         │              │     ├── *.js             │
│     └── *.css        │              │     └── *.css            │
│                      │              │                          │
│ 【本地模式】          │              │ 【在线模式】              │
│                      │              │                          │
│ Express 直接返回    │              │ Next.js 动态路由         │
│ GET /               │              │ GET /[token]             │
│ -> views/index.html │              │ ┌────────────────────┐  │
│                      │              │ │ 1. SSR 验证 token  │  │
│ WebSocket:           │              │ │    POST /ac/check  │  │
│ ws://localhost:4000 │              │ │ 2. 验证成功后返回  │  │
│ /ws                  │              │ │    /terminal/      │  │
│                      │              │ │    index.html      │  │
│ 管理本地 CLI 进程    │              │ └────────────────────┘  │
└──────────────────────┘              │                          │
                                      │ WebSocket:               │
                                      │ wss://ws.webcc.dev/ws    │
                                      │ (在线服务处理)            │
                                      └──────────────────────────┘
```

### 技术实现细节

#### 1. WebSocket 环境自动检测

```javascript
// packages/web/src/App.jsx
const getWebSocketConfig = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

  // 在线模式：检测是否在 webcc.dev 域名
  if (hostname === 'webcc.dev' || hostname === 'www.webcc.dev') {
    return {
      url: 'wss://ws.webcc.dev',
      path: '/ws',
    };
  }

  // 本地模式：localhost 或其他域名
  return {
    url: `${protocol}//${hostname}:4000`,
    path: '/ws',
  };
};

// Socket.IO 连接
const { url, path } = getWebSocketConfig();
const socket = io(url, { path });
```

#### 2. 构建配置

**方案：单次构建 + 脚本复制**

```json
// packages/web/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "postbuild": "node scripts/copy-dist.js"
  }
}
```

```javascript
// packages/web/scripts/copy-dist.js
const fs = require('fs-extra');
const path = require('path');

const serverDist = path.join(__dirname, '../server/views');
const indexDist = path.join(__dirname, '../index/public/terminal');

// 构建产物默认在 packages/server/views/
// 复制到 packages/index/public/terminal/
fs.copySync(serverDist, indexDist);
console.log('✓ Copied build output to packages/index/public/terminal/');
```

**Vite 配置：**

```javascript
// packages/web/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../server/views',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // 单文件输出，简化集成
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/ws': 'http://localhost:4000',
    },
  },
});
```

#### 3. Next.js 动态路由实现

```typescript
// packages/index/src/app/[token]/page.tsx
import { notFound, redirect } from 'next/navigation';

// Token 验证函数
async function verifyAccessToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.webcc.dev/ac/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: token,
      },
    });

    const data = await response.json();
    return data.type === 'success';
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

// 动态路由页面
export default async function TerminalPage({ params }: { params: { token: string } }) {
  const { token } = params;

  // SSR 层验证 token
  const isValid = await verifyAccessToken(token);

  if (!isValid) {
    notFound();
  }

  // 重定向到静态终端页面
  // Next.js 会自动服务 public/terminal/index.html
  redirect(`/terminal/index.html?token=${token}`);
}
```

**或者使用 iframe 方式（更灵活）：**

```typescript
// packages/index/src/app/[token]/page.tsx
export default async function TerminalPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const isValid = await verifyAccessToken(token);

  if (!isValid) notFound();

  return <TerminalClient />;
}

// packages/index/src/components/TerminalClient.tsx
'use client';

export default function TerminalClient() {
  return (
    <iframe
      src="/terminal/index.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
      title="Web Terminal"
    />
  );
}
```

#### 4. Next.js 配置

```javascript
// packages/index/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许访问 /terminal/ 下的静态资源
  async headers() {
    return [
      {
        source: '/terminal/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 5. 依赖管理

**packages/index 需要添加（仅用于构建产物，无需额外依赖）：**

- 无需添加 xterm.js 或 socket.io-client
- 构建产物是自包含的（bundled）

**packages/web 保持现有依赖：**

```json
{
  "dependencies": {
    "@xterm/xterm": "^6.0.0",
    "@xterm/addon-fit": "^0.11.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "socket.io-client": "^4.8.3"
  }
}
```

---

## 实施步骤

### Phase 1: 修改 packages/web

- [ ] 修改 `vite.config.js` 构建配置
- [ ] 创建 `scripts/copy-dist.js` 复制脚本
- [ ] 修改 `src/App.jsx` WebSocket 环境检测逻辑
- [ ] 更新 `package.json` 添加 postbuild 钩子
- [ ] 测试本地模式是否正常工作

### Phase 2: 集成到 packages/index

- [ ] 创建 `app/[token]/page.tsx` 动态路由
- [ ] 创建 `app/[token]/not-found.tsx` 错误页面
- [ ] 创建 Token 验证 API 调用函数
- [ ] 配置 `next.config.js` 处理静态资源
- [ ] 测试在线模式 token 验证流程

### Phase 3: 构建流程整合

- [ ] 更新根目录 `package.json` 构建脚本
- [ ] 配置 Lerna 构建顺序（web -> index）
- [ ] 测试完整构建流程
- [ ] 验证两个模式都正常工作

### Phase 4: 文档和清理

- [ ] 更新 CLAUDE.md 项目说明
- [ ] 添加使用文档
- [ ] 清理不必要的文件
- [ ] 提交代码

---

## API 接口规范

### Token 验证接口

**Endpoint:** `POST https://api.webcc.dev/ac/check`

**Request Headers:**

```
Content-Type: application/json
accessToken: {token}
```

**Response Success:**

```json
{
  "type": "success",
  "msg": "Token valid",
  "obj": {
    "userId": 123,
    "username": "user123"
  }
}
```

**Response Error:**

```json
{
  "type": "error",
  "msg": "Invalid or expired token"
}
```

---

## 测试场景

### 本地模式测试

1. 启动本地服务：`cd packages/server && npm start`
2. 访问：`http://localhost:4000`
3. 验证：
   - [x] 终端界面正常显示
   - [x] WebSocket 连接到 localhost:4000
   - [x] 可以输入命令并看到响应
   - [x] Claude CLI 进程正常工作

### 在线模式测试

1. 构建项目：`npm run build`
2. 启动 Next.js：`cd packages/index && npm start`
3. 访问：`https://webcc.dev/{valid-token}`
4. 验证：
   - [ ] Token 验证通过，显示终端
   - [ ] WebSocket 连接到 wss://ws.webcc.dev
   - [ ] 终端功能正常
   - [ ] 无效 token 显示 404

5. 访问：`https://webcc.dev/invalid-token`
6. 验证：
   - [ ] 显示 404 页面
   - [ ] 不加载终端组件

---

## 注意事项

1. **CORS 配置**：在线 WebSocket 服务需要配置 CORS 允许 webcc.dev 域名
2. **Token 安全**：Token 在 URL 中传递，建议设置短期有效期
3. **WebSocket 重连**：Socket.IO 自带重连机制，但需要处理 token 失效场景
4. **构建优化**：Vite 构建产物应该压缩并优化，减少加载时间
5. **错误处理**：WebSocket 连接失败时需要友好的错误提示
6. **移动端适配**：终端界面已支持响应式，需测试移动端体验

---

## 后续优化

1. **Token 刷新机制**：长时间使用时自动刷新 token
2. **会话持久化**：保存终端历史记录
3. **多标签页同步**：同一 token 多标签页共享会话
4. **性能监控**：WebSocket 延迟、消息丢失率统计
5. **限流保护**：防止单个 token 过度使用资源

---

## 相关文件

- `/packages/web/src/App.jsx` - 终端主组件
- `/packages/web/vite.config.js` - 构建配置
- `/packages/web/scripts/copy-dist.js` - 复制脚本
- `/packages/index/src/app/[token]/page.tsx` - Next.js 动态路由
- `/packages/server/src/index.js` - 本地服务入口
- `/packages/server/src/socket.js` - WebSocket 服务端
