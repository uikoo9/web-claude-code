# 技术决策记录

## 远程访问方案决策

**日期**: 2026-02-06
**状态**: 已决策，待实现

### 背景与问题

用户通过 `webcc` 在本地启动 Claude Code Web 服务后，只能在本地网络访问（`http://localhost:4000`）。如果需要从其他设备或远程位置访问，需要一个公网访问方案。

### 考虑的方案

#### 方案 1: Cloudflare Quick Tunnels（已放弃）

**实现方式**:

- 使用 cloudflared 工具创建临时隧道
- 自动生成 `https://random-name.trycloudflare.com` 域名
- 零配置，开箱即用

**优势**:

- ✅ 实现简单，调用 cloudflared 命令即可
- ✅ 免费，无需额外服务器
- ✅ Cloudflare 的基础设施稳定可靠

**劣势**:

- ❌ 每次启动域名都变化，不固定
- ❌ 域名不可自定义（random-name.trycloudflare.com）
- ❌ 依赖第三方工具（cloudflared）
- ❌ 无法控制和监控流量
- ❌ 无法添加自定义功能（认证、统计等）
- ❌ 品牌体验不佳

**结论**: 不适合作为长期方案

#### 方案 2: 自建反向代理隧道服务（✅ 采用）

**实现方式**:

- 在 [webcc.dev](https://webcc.dev) 域名下搭建隧道代理服务器
- 用户本地 webcc 通过 WebSocket 连接到服务器
- 用户访问 `https://webcc.dev/t/xxxxxx` 时，服务器转发请求到本地

**架构设计**:

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Browser   │ HTTPS   │  webcc.dev       │  WS     │  Local webcc    │
│             │────────>│  Proxy Server    │<───────>│  (user machine) │
│  访问者      │         │  (你的服务器)     │         │                 │
└───────��─────┘         └──────────────────┘         └─────────────────┘
                              │
                              ├─ Token管理
                              ├─ 路由映射
                              └─ 请求转发
```

**流程**:

1. **本地启动阶段**:

   ```
   用户执行: webcc
   → CLI 询问是否需要公网访问
   → 如选择"是":
     - 生成唯一 token (如: abc123def456)
     - 建立到 [webcc.dev](https://webcc.dev) 的 WebSocket 长连接
     - 注册 token 到服务器
     - 显示访问地址: https://webcc.dev/t/abc123def456
   ```

2. **外部访问阶段**:
   ```
   访问者打开: https://webcc.dev/t/abc123def456
   → [webcc.dev](https://webcc.dev) 服务器:
     - 根据 token 查找对应的 WebSocket 连接
     - 将 HTTP/WS 请求通过 WebSocket 转发给本地
   → 本地 webcc:
     - 接收代理请求
     - 转发给本地 Express 服务 (localhost:4000)
     - 获取响应并返回给服务器
   → [webcc.dev](https://webcc.dev) 服务器:
     - 将响应返回给访问者浏览器
   ```

**优势**:

- ✅ 固定域名品牌（[webcc.dev](https://webcc.dev)）
- ✅ 可自定义短链接（/t/xxx）
- ✅ 完全自主可控
- ✅ 可添加增值功能：
  - 访问统计和日志
  - 访问认证和授权
  - 流量限制和监控
  - 自定义子域名（付费功能）
- ✅ 更好的用户体验
- ✅ 更稳定可靠

**劣势**:

- ❌ 需要开发和维护服务端
- ❌ 需要服务器资源
- ❌ 需要考虑安全性和性能

**结论**: 长期方案，更适合产品化

### 最终决策

**采用方案 2: 自建反向代理隧道服务**

**理由**:

1. 品牌统一：使用 [webcc.dev](https://webcc.dev) 域名，提升产品专业度
2. 用户体验：固定域名，可分享和保存
3. 可扩展性：为未来增值功能预留空间
4. 商业化潜力：可基于此提供 Pro 功能

### 实现要点

#### 本地客户端 (packages/server/src/tunnel.js)

**功能**:

1. WebSocket 客户端连接管理
   - 连接到 wss://webcc.dev/tunnel
   - 心跳保活机制
   - 断线重连逻辑

2. Token 生成和管理
   - 生成唯一标识符 (UUID/nanoid)
   - 注册到服务器

3. 请求转发
   - 接收服务器转发的 HTTP 请求
   - 转发给本地 Express 服务
   - 返回响应

**接口设计**:

```javascript
// tunnel.js
class TunnelClient {
  constructor(localPort) {
    this.localPort = localPort;
    this.token = null;
    this.ws = null;
  }

  async connect() {
    // 连接到 [webcc.dev](https://webcc.dev)
    // 生成 token
    // 注册连接
    // 返回公网访问地址
  }

  handleProxyRequest(request) {
    // 转发到本地服务
    // 返回响应
  }

  disconnect() {
    // 关闭连接
  }
}
```

#### 服务端 ([webcc.dev](https://webcc.dev))

**功能**:

1. WebSocket 服务管理
   - 接受客户端连接
   - 维护 token -> connection 映射
   - 清理过期连接

2. HTTP/WS 代理入口
   - 路由 /t/:token
   - 根据 token 转发请求
   - 返回响应

3. 管理功能
   - 连接状态监控
   - 访问日志记录
   - 流量统计

**技术栈建议**:

- Node.js + Express
- ws 或 socket.io (WebSocket)
- Redis (连接映射和状态管理)

### CLI 集成

**用户交互流程**:

```bash
$ webcc

  # ... 配置步骤 ...

? 是否需要公网域名方便远程访问？ (y/N) y

ℹ 正在连接到 [webcc.dev](https://webcc.dev) 隧道服务...
✓ 连接成功！

✓ 服务器启动成功！

ℹ 访问地址:
ℹ   本地: http://localhost:4000
ℹ   公网: https://webcc.dev/t/abc123def456
ℹ
ℹ 提示: 公网地址仅在服务运行期间有效
```

### 安全性考虑

1. **Token 安全**:
   - 使用加密强度高的随机字符串
   - 可选：添加有效期限制
   - 可选：添加访问密码保护

2. **连接验证**:
   - WebSocket 连接需要验证
   - 防止未授权的 token 注册

3. **流量控制**:
   - 限制单个 token 的请求频率
   - 防止滥用和 DDoS

4. **数据加密**:
   - 全程 HTTPS/WSS 加密
   - 敏感数据不经过服务器

### 未来扩展

1. **自定义域名** (付费功能):
   - 用户可设置 `yourname.webcc.dev`
   - 需要用户认证和付费

2. **持久化隧道** (付费功能):
   - 固定 token，不随重启变化
   - 支持自定义短链接

3. **访问控制**:
   - 密码保护
   - IP 白名单
   - OAuth 认证

4. **协作功能**:
   - 多人同时访问
   - 权限管理

5. **监控和统计**:
   - 访问量统计
   - 性能监控
   - 错误日志

### 参考资料

- [ngrok 工作原理](https://ngrok.com/docs/how-ngrok-works)
- [frp 反向代理](https://github.com/fatedier/frp)
- WebSocket 代理实践

### 相关提交

- ❌ 已回退: `19306af` feat: add Cloudflare Tunnel support for remote access
- ❌ 已回退: `92f489e` refactor: change tunnel prompt to post-config interactive question

### 后续任务

- [ ] 服务端实现 ([webcc.dev](https://webcc.dev))
- [ ] 本地客户端实现 (tunnel.js)
- [ ] CLI 集成和用户交互
- [ ] 安全性和性能测试
- [ ] 文档更新
