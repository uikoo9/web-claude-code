# 域名修改总结

> 将所有 `webcc.dev` 修改为 `www.webcc.dev`
>
> 修改日期：2026-02-16

## 修改原因

由于使用 Vercel 部署，所有 `webcc.dev` 的请求会被转发到 `www.webcc.dev`，因此需要统一使用 `www.webcc.dev` 作为主域名。

## 修改文件清单

### 1. packages/online-server/src/server.js

**修改内容：**

- ✅ CORS 配置：`https://webcc.dev` → `https://www.webcc.dev`
- ✅ Public URL 生成：`https://webcc.dev/${token}` → `https://www.webcc.dev/${token}`
- ✅ 日志输出：`https://webcc.dev` → `https://www.webcc.dev`

**修改位置：**

```javascript
// Line ~10: CORS 配置
cors: {
  origin: NODE_ENV === 'production' ? 'https://www.webcc.dev' : '*',
}

// Line ~72: Public URL
const publicUrl = `https://www.webcc.dev/${token}`;

// Line ~156: 日志输出
console.log(`[Server] ✓ CORS: ${NODE_ENV === 'production' ? 'https://www.webcc.dev' : '*'}`);
```

### 2. packages/online-server/README.md

**修改内容：**

- ✅ 架构图中的域名：`webcc.dev/token` → `www.webcc.dev/token`
- ✅ Nginx 配置示例：`server_name webcc.dev` → `server_name www.webcc.dev`
- ✅ SSL 证书路径：`/etc/letsencrypt/live/webcc.dev/` → `/etc/letsencrypt/live/www.webcc.dev/`
- ✅ CORS 说明：`https://webcc.dev` → `https://www.webcc.dev`

**修改位置：**

```markdown
# Line 12: 架构图

Browser (www.webcc.dev/token)

# Line 201-205: Nginx 配置

server_name www.webcc.dev;
ssl_certificate /etc/letsencrypt/live/www.webcc.dev/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/www.webcc.dev/privkey.pem;

# Line 230: CORS 配置说明

- Production: Only allow `https://www.webcc.dev`
```

### 3. docs/online-mode-architecture.md

**修改内容：**

- ✅ 全局替换所有 `webcc.dev` 为 `www.webcc.dev`
- ✅ 共计 32 处修改

**涉及章节：**

- 概述 - 访问地址示例
- 架构设计 - 架构图中的所有域名
- 消息流转 - 所有流程中的 URL
- 实现细节 - 代码示例中的域名
- 部署方案 - Nginx 配置、SSL 证书
- 与本地模式对比 - 访问方式对比

**关键修改：**

```markdown
# 访问地址

https://www.webcc.dev/{token}

# WebSocket 连接

wss://www.webcc.dev/ws

# 服务器域名

www.webcc.dev (Next.js Server)
WebSocket Server (www.webcc.dev:4000)

# Nginx 配置

server_name www.webcc.dev;
ssl_certificate /etc/letsencrypt/live/www.webcc.dev/fullchain.pem;

# 代码中的域名

const serverUrl = 'https://www.webcc.dev';
origin: 'https://www.webcc.dev'
```

## 未来需要修改的文件

当实现其他组件时，以下文件也需要使用 `www.webcc.dev`：

### 1. packages/cli/src/online-client.js（待创建）

```javascript
// 默认服务器 URL
const serverUrl = this.options.serverUrl || 'https://www.webcc.dev';
```

### 2. packages/cli/bin/webcc.js（待修改）

```javascript
// 默认服务器 URL
serverUrl: process.env.WEBCC_SERVER_URL || 'https://www.webcc.dev';
```

### 3. packages/index/src/components/TerminalClient.tsx（待修改）

```typescript
// WebSocket 连接
const serverUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL || 'https://www.webcc.dev';
```

### 4. packages/index/.env.local（待创建）

```bash
# WebSocket 服务器地址
NEXT_PUBLIC_WS_SERVER_URL=https://www.webcc.dev
```

## 环境变量配置

### 开发环境

```bash
# packages/online-server/.env
NODE_ENV=development
PORT=4000
# 开发环境 CORS 允许所有来源
```

### 生产环境

```bash
# packages/online-server/.env
NODE_ENV=production
PORT=4000
# 生产环境 CORS 仅允许 https://www.webcc.dev
```

## 部署配置

### Nginx 配置文件

**文件位置：** `/etc/nginx/sites-available/www.webcc.dev`

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.webcc.dev;

    ssl_certificate /etc/letsencrypt/live/www.webcc.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.webcc.dev/privkey.pem;

    # WebSocket 路由
    location /ws {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Next.js 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
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

### SSL 证书

```bash
# 申请证书
sudo certbot --nginx -d www.webcc.dev

# 证书路径
/etc/letsencrypt/live/www.webcc.dev/fullchain.pem
/etc/letsencrypt/live/www.webcc.dev/privkey.pem
```

### Vercel 配置

如果使用 Vercel 部署 Next.js 应用（packages/index），需要配置域名转发：

**vercel.json:**

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "webcc.dev"
        }
      ],
      "destination": "https://www.webcc.dev/:path*",
      "permanent": true
    }
  ]
}
```

## 验证清单

部署后需要验证以下地址：

- [ ] https://www.webcc.dev - 首页正常访问
- [ ] https://www.webcc.dev/{token} - 终端页面正常访问
- [ ] wss://www.webcc.dev/ws - WebSocket 连接正常
- [ ] http://webcc.dev - 正确重定向到 https://www.webcc.dev
- [ ] CORS 配置正确（生产环境仅允许 www.webcc.dev）

## 总结

✅ 已完成修改：

- packages/online-server/src/server.js（3 处）
- packages/online-server/README.md（4 处）
- docs/online-mode-architecture.md（32 处）

📋 待完成修改：

- packages/cli/src/online-client.js（创建时使用 www.webcc.dev）
- packages/cli/bin/webcc.js（修改时使用 www.webcc.dev）
- packages/index/src/components/TerminalClient.tsx（修改时使用 www.webcc.dev）

🔐 安全配置：

- 生产环境 CORS 仅允许 https://www.webcc.dev
- 使用 Let's Encrypt SSL 证书
- Nginx 反向代理配置 WebSocket

---

**文档版本：** v1.0
**修改日期：** 2026-02-16
**修改人：** Claude Sonnet 4.5
