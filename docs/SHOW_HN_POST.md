# Show HN: Web Claude Code 帖子准备

> 创建时间: 2026-02-19
> 平台: Hacker News (news.ycombinator.com)

---

## 📝 帖子标题

**主标题（推荐）**:

```
Show HN: Web Claude Code – Run Claude Code in your browser
```

**备选标题**:

```
Show HN: WebCC – Browser-based interface for Claude Code CLI
Show HN: Access Claude Code from any device via web browser
```

**标题要点**:

- 必须以 "Show HN:" 开头
- 简洁明了（50-70 字符）
- 突出核心价值（"in your browser"）
- 不要过度营销

---

## 📄 帖子正文

### 版本 1（推荐 - 偏技术向）

```
Hi HN!

I built Web Claude Code (https://webcc.dev) - a tool that lets you run Claude Code CLI in your web browser.

**Why I made this:**
- Claude Code CLI is powerful but requires terminal setup
- Wanted to use it on tablets/phones or devices without CLI access
- Needed a way to share Claude sessions remotely (online mode)

**How it works:**
- Install: `npm install -g @webccc/cli`
- Run: `webcc`
- Opens a web terminal connected to Claude Code via WebSocket
- Terminal history persists across page refreshes
- Two modes: local (standalone) or online (session sharing via ws.webcc.dev)

**Tech stack:**
- Express + Socket.IO server
- React + xterm.js for terminal emulation
- expect script for PTY support
- Monorepo with Lerna + Nx

The CLI and server are published to npm. Source code: https://github.com/uikoo9/web-claude-code

Would love feedback on the architecture or ideas for improvement!
```

### 版本 2（更简短）

```
Hi HN!

I made Web Claude Code - a web interface for Claude Code CLI.

Instead of opening a terminal, you install `npm install -g @webccc/cli`, run `webcc`, and access Claude Code in your browser. Works on any device (phones, tablets, remote machines).

It uses Socket.IO to bridge a web terminal (xterm.js) with the Claude CLI process. Also supports session sharing mode so multiple browsers can connect.

Built as a monorepo with Express/React. Published to npm and fully open source.

Live at: https://webcc.dev
Code: https://github.com/uikoo9/web-claude-code

Happy to answer questions!
```

### 版本 3（问题导向）

````
Hi HN! Ever wanted to use Claude Code on your iPad or share a Claude session with a colleague?

I built Web Claude Code to solve this. It wraps Claude Code CLI in a web interface so you can access it from any browser.

Quick start:
```bash
npm install -g @webccc/cli
webcc
# Opens browser at localhost:4000
````

Key features:

- Full terminal emulation with xterm.js
- History persistence across refreshes
- Local mode or online mode (session sharing)
- Cross-platform (uses expect for PTY)

Tech: Express, Socket.IO, React, TypeScript
Monorepo: Published CLI + server to npm
Open source: https://github.com/uikoo9/web-claude-code

Feedback welcome!

```

---

## 🕐 最佳发布时间

### 推荐时间窗口

| 时区 | 日期 | 时间 |
|------|------|------|
| **美国东部时间 (EST)** | 周二-周四 | 上午 8:00-10:00 |
| **北京时间 (GMT+8)** | 周三-周五 | 晚上 9:00-11:00 |
| **UTC** | 周二-周四 | 下午 1:00-3:00 |

### 为什么这个时间？

- ✅ HN 流量高峰在美国工作日上午
- ✅ 周二到周四是最活跃的时段
- ✅ 避开周末（流量低）和周一（竞争激烈）
- ✅ 新帖需要在发布后 1-2 小时内获得投票才能上首页

---

## 📋 发布前检查清单

### 网站和代码
- [x] GitHub README 完整且专业
- [x] demo 图片可正常访问（https://static-small.vincentqiao.com/webcc-demo.png）
- [x] 官网 webcc.dev 正常运行
- [x] npm 包页面显示正确
- [ ] 测试安装流程（确保用户能顺利安装）
- [ ] 准备 demo 视频（可选，但很加分）

### 你的准备
- [ ] Hacker News 账号已创建（需要至少 50 karma 才能发 Show HN）
- [ ] 准备好快速回复评论（前 2 小时很关键）
- [ ] 浏览器开着 HN 页面，能及时看到评论
- [ ] 预期可能的问题和批评

---

## 💬 常见评论及应对策略

### 技术问题

**Q: 为什么用 expect 而不是 node-pty？**
A: 跨平台兼容性更好，expect 在 macOS/Linux 上开箱即用，而 node-pty 有时需要编译。

**Q: 安全性如何？只在本地运行吗？**
A: 默认是本地模式（localhost:4000），只有你选择 online 模式才会连接到 ws.webcc.dev。Online 模式用 token 认证，不存储任何对话内容。

**Q: 性能如何？有延迟吗？**
A: WebSocket 延迟很低（通常 <50ms），和本地终端体验基本一致。

### 功能问题

**Q: 为什么不直接用 VS Code 的终端？**
A: 这个针对需要在浏览器访问的场景，比如 iPad、手机、或远程分享会话。

**Q: 支持其他 CLI 工具吗？**
A: 目前专门针对 Claude Code 优化，但架构可以扩展到其他 CLI 工具。

### 批评

**Q: 这不就是个 web terminal 吗？**
A: 是的核心是 web terminal，但集成了 Claude Code 特定的配置、模式选择、历史持久化等功能，让它开箱即用。

**Q: 已经有很多 web terminal 了**
A: 确实，但这个专门为 Claude Code 设计，包含了配置管理、两种连接模式、npm 一键安装等，降低了使用门槛。

---

## 🎯 回复评论的黄金法则

1. **快速响应**（前 2 小时内回复所有评论）
2. **友好谦逊**（"Great point!", "Thanks for the feedback!"）
3. **技术深度**（展示你的技术理解，但不炫技）
4. **承认不足**（如果有人指出问题，不要防御性，说"You're right, I'll improve that"）
5. **引导讨论**（问对方的想法，"What would you suggest?"）
6. **不要争论**（即使遇到不公平批评）

---

## 📊 成功指标

**首页标准**（通常需要）:
- 20-30 upvotes（前 2 小时）
- 5-10 条评论（有互动）

**好的表现**:
- 100+ upvotes
- 50+ 评论
- 停留在首页 6-12 小时

**优秀表现**:
- 200+ upvotes
- 100+ 评论
- 停留在首页 24 小时以上
- 被 HN newsletter 收录

---

## 🔗 相关链接

- **提交页面**: https://news.ycombinator.com/submit
- **Show HN 指南**: https://news.ycombinator.com/showhn.html
- **HN 规则**: https://news.ycombinator.com/newsguidelines.html
- **项目 GitHub**: https://github.com/uikoo9/web-claude-code
- **项目官网**: https://webcc.dev
- **npm 包**: https://www.npmjs.com/package/@webccc/cli

---

## 📝 注意事项

### ✅ 应该做的

- 诚实透明（不夸大功能）
- 主动提及限制和不足
- 感谢每一条反馈
- 回答所有技术问题
- 分享技术细节和决策过程

### ❌ 不应该做的

- 用多个账号投票（会被 ban）
- 过度营销（"revolutionary", "game-changing"）
- 忽略负面评论
- 争论或防御性回复
- 要求别人投票

---

## 🎬 发布步骤（详见注册指南）

1. 注册/登录 Hacker News
2. 点击顶部 "submit"
3. 填写表单:
   - title: 使用上面的标题
   - url: https://webcc.dev （或 GitHub）
   - text: 使用上面的正文
4. 点击 submit
5. 立即开始回复评论

---

祝发布顺利！🚀
```
