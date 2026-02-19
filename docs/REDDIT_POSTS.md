# Reddit 推广帖子准备

> 创建时间: 2026-02-19
> 平台: Reddit (reddit.com)

---

## 📝 目标 Subreddit

根据项目特点，选择以下 4 个 subreddit：

| Subreddit     | 订阅数 | 适合度     | 规则严格度 |
| ------------- | ------ | ---------- | ---------- |
| r/ClaudeAI    | 100K+  | ⭐⭐⭐⭐⭐ | 中等       |
| r/LocalLLaMA  | 200K+  | ⭐⭐⭐⭐   | 中等       |
| r/commandline | 50K+   | ⭐⭐⭐     | 较松       |
| r/webdev      | 1.5M+  | ⭐⭐⭐     | 严格       |

---

## 📄 帖子内容（按 Subreddit）

### 1. r/ClaudeAI（最合适）

**标题**:

```
[Tool] Web Claude Code - Run Claude Code in your browser
```

**正文**:

````markdown
Hey everyone! 👋

I built a web interface for Claude Code CLI that lets you use it directly in your browser.

**Why I made this:**

- I wanted to use Claude Code on my iPad, but there's no native terminal app
- Sometimes I need to share a Claude session with teammates
- Setting up Claude CLI can be tricky for non-technical users

**What it does:**

- Wraps Claude Code CLI in a web terminal (xterm.js)
- Two modes: local (localhost) or online (session sharing via webcc.dev)
- Terminal history persists across page refreshes
- Works on any device with a browser

**Quick start:**

```bash
npm install -g @webccc/cli
webcc
# Opens at http://localhost:4000
```
````

**Tech stack:**

- Express + Socket.IO for real-time communication
- React + xterm.js for terminal emulation
- Published as npm packages

**Links:**

- Website: https://webcc.dev
- GitHub: https://github.com/uikoo9/web-claude-code
- npm: https://www.npmjs.com/package/@webccc/cli

Would love to hear your feedback or suggestions! Happy to answer any questions.

```

---

### 2. r/LocalLLaMA（AI 爱好者社区）

**标题**:
```

[Project] Built a browser-based interface for Claude Code CLI

````

**正文**:
```markdown
Hi r/LocalLLaMA!

I've been using Claude Code CLI a lot and wanted a more accessible way to use it, so I built a web interface for it.

**Problem it solves:**
- No terminal needed - runs in any browser
- Works on mobile devices (phones, tablets)
- Can share Claude sessions remotely (online mode)
- Persistent history across sessions

**How it works:**
The tool spawns a Claude CLI process and bridges it with a web terminal via WebSocket. You get the full Claude Code experience in your browser.

**Installation:**
```bash
npm install -g @webccc/cli
webcc
````

**Features:**

- Local mode: runs on localhost:4000
- Online mode: connects to relay server for session sharing
- Full xterm.js terminal with proper ANSI colors
- History saved to localStorage

**Open source:**

- Code: https://github.com/uikoo9/web-claude-code
- Site: https://webcc.dev

It's particularly useful if you want to use Claude Code on devices without terminal access, or if you need to demo Claude to someone remotely.

Feedback and contributions welcome! 🚀

```

---

### 3. r/commandline（CLI 工具社区）

**标题**:
```

[Tool] webcc - Access Claude Code CLI from any browser

````

**正文**:
```markdown
Created a CLI tool that wraps Claude Code in a web terminal.

**Use case:**
Sometimes you want to use a CLI tool but don't have terminal access (e.g., on iPad, shared machine, or showing someone remotely). This tool solves that for Claude Code.

**Installation:**
```bash
npm install -g @webccc/cli
webcc
````

Opens a web terminal at localhost:4000 connected to Claude Code CLI via WebSocket.

**Architecture:**

- Express server spawns Claude CLI with expect (for PTY)
- Socket.IO bridges stdin/stdout to browser
- xterm.js for terminal emulation
- Supports TERM=xterm-256color

**Two modes:**

1. Local: standalone server on your machine
2. Online: connects to relay server (ws.webcc.dev) for remote access

**Links:**

- GitHub: https://github.com/uikoo9/web-claude-code
- npm: https://www.npmjs.com/package/@webccc/cli

Built as a monorepo with Lerna + Nx. The CLI and server are published to npm.

Happy to discuss the implementation or answer questions!

```

---

### 4. r/webdev（Web 开发社区）

**标题**:
```

Built a web-based terminal for Claude Code CLI with React + Socket.IO

````

**正文**:
```markdown
**Project:** Web Claude Code

**What it is:**
A web interface that lets you run Claude Code CLI in your browser. Think of it as a hosted terminal specifically for Claude Code.

**Why:**
- Mobile support (iPads, phones)
- Easy sharing (online mode with session tokens)
- No terminal setup required for end users

**Tech stack:**
- **Backend:** Express 5 + Socket.IO + expect (for PTY)
- **Frontend:** React 19 + xterm.js + Vite
- **Monorepo:** Lerna + Nx
- **Architecture:** WebSocket bridge between browser and CLI process

**Interesting challenges:**
1. Getting proper PTY support with expect script instead of node-pty (better cross-platform)
2. Terminal history persistence with localStorage (5MB / 10K lines limit)
3. Two-mode architecture: local vs relay server

**Install:**
```bash
npm install -g @webccc/cli
webcc
````

**Open source:**

- Repo: https://github.com/uikoo9/web-claude-code
- Live demo: https://webcc.dev

Built this as a side project to scratch my own itch. Feedback welcome!

**Questions for the community:**

- How would you approach PTY in a cross-platform Node.js app?
- Any suggestions for improving the WebSocket reliability?

````

---

## 🕐 发布时机建议

### 最佳发布时间

| Subreddit | 最佳时间（北京时间） | 原因 |
|-----------|---------------------|------|
| r/ClaudeAI | 周二-周四 晚上 9-11 点 | 美国用户活跃时段 |
| r/LocalLLaMA | 周二-周六 任意时间 | 全球用户，时区分散 |
| r/commandline | 周一-周五 上午 10 点-晚上 10 点 | 工作日活跃 |
| r/webdev | 周二-周四 晚上 8-11 点 | 美国开发者下班后 |

### 发布间隔

- ⚠️ **不要同一天发布到所有 subreddit**
- ✅ 建议间隔 1-2 天
- ✅ 避免被认为是 spam

**推荐顺序**:
1. **第1天**: r/ClaudeAI（最相关）
2. **第3天**: r/LocalLLaMA（如果第1个反响好）
3. **第5天**: r/commandline 或 r/webdev（选其一）

---

## 💬 评论回复策略

### Reddit 评论文化

Reddit 和 HN 不同：
- 更随意、友好
- 可以用 emoji
- 支持 Markdown 格式
- 可以编辑评论（但会显示 "edited"）

### 常见问题预判

**Q: 为什么不直接用 SSH？**
A: SSH 需要服务器配置和端口暴露。这个工具更像是"Claude Code as a Service"，对非技术用户更友好。另外，online 模式的 relay server 我已经部署好了，开箱即用。

**Q: 安全性如何？**
A: 本地模式只在 localhost 运行，不对外暴露。在线模式使用 token 认证，relay server 不存储任何对话内容，只转发 WebSocket 消息。代码是开源的，可以审查。

**Q: 能用于其他 CLI 工具吗？**
A: 架构上可以，但目前专门为 Claude Code 优化（配置管理、环境变量等）。如果有兴趣可以 fork 改造。

**Q: 为什么用 expect 而不是 node-pty？**
A: node-pty 需要编译，在某些环境下（特别是 Windows）会有问题。expect 是跨平台的标准工具，在 macOS/Linux 上开箱即用。

**Q: 有 Docker 版本吗？**
A: 目前没有，但是个好主意！可以加到 roadmap 里。（然后真的考虑做一个）

---

## 🎯 各 Subreddit 注意事项

### r/ClaudeAI
✅ **适合强调**:
- Claude 特有功能
- 使用场景和体验改进
- 与 Claude Desktop 的对比

❌ **避免**:
- 过度技术细节
- 批评 Anthropic

### r/LocalLLaMA
✅ **适合强调**:
- 开源、自托管
- 技术架构
- 扩展性（可用于其他 LLM CLI）

❌ **避免**:
- 商业化内容
- 闭源功能

### r/commandline
✅ **适合强调**:
- CLI 设计哲学
- PTY 实现细节
- 跨平台兼容性

❌ **避免**:
- GUI/Web 是"更好"的说法（这个社区喜欢纯 CLI）
- 过度简化技术

### r/webdev
✅ **适合强调**:
- 技术栈选择
- 架构挑战
- 开源贡献机会

❌ **避免**:
- "look at my project" 风格
- 缺少技术细节

---

## 📋 发布前检查清单

### 每个帖子发布前

- [ ] 检查 subreddit 规则（侧边栏）
- [ ] 搜索是否已有类似帖子（避免重复）
- [ ] 确认标题格式符合该 subreddit 习惯
- [ ] 准备好回复常见问题
- [ ] 确保所有链接可访问

### 账号要求

- [ ] 账号年龄 > 7 天（某些 subreddit 要求）
- [ ] Karma > 10（某些 subreddit 要求）
- [ ] 验证邮箱（推荐）

---

## 🚫 Reddit 的禁忌

### 绝对不要

❌ **Self-promotion spam**
- 连续发多个帖子
- 只发自己的项目，不参与讨论
- 在无关帖子里插入项目链接

❌ **投票操作**
- 用多账号投票
- 要求别人投票（brigading）
- 到其他平台号召投票

❌ **违反 subreddit 规则**
- 不看规则就发帖
- 发布商业广告（很多 subreddit 禁止）

### 可能被删的情况

- 新账号（< 7 天）
- Karma 太低（< 10）
- 标题格式不对
- 被 automod 误判为 spam

---

## 📊 成功指标

### 好的表现

| Subreddit | Upvotes | Comments | 停留时间 |
|-----------|---------|----------|----------|
| r/ClaudeAI | 50-100+ | 10-20+ | 12-24h |
| r/LocalLLaMA | 100-200+ | 20-50+ | 24-48h |
| r/commandline | 20-50+ | 5-15+ | 12-24h |
| r/webdev | 50-100+ | 15-30+ | 12-24h |

### 优秀表现

- 进入 subreddit 的 "Top" (本周/本月)
- 被 pin 到顶部
- 收到 Reddit awards (Gold, Silver)
- 引发深度技术讨论

---

## 🎁 Reddit 特有技巧

### 使用 Flair（标签）

很多 subreddit 要求选择 flair：
- r/ClaudeAI: 选 "Tools" 或 "Discussion"
- r/LocalLLaMA: 选 "Project" 或 "Show and Tell"
- r/commandline: 选 "CLI Tool" 或 "Showcase"
- r/webdev: 选 "Project" 或 "Show & Tell"

### Markdown 格式

Reddit 支持 Markdown：
```markdown
**粗体**
*斜体*
[链接](url)
`代码`
- 列表项

> 引用

    缩进代码块
````

### 在评论中补充

如果帖子正文有字数限制，可以在**第一条评论**补充：

- 详细的技术细节
- 更多链接
- 开发背景故事

---

## 🔗 相关链接

- **Reddit 主页**: https://reddit.com
- **r/ClaudeAI**: https://reddit.com/r/ClaudeAI
- **r/LocalLLaMA**: https://reddit.com/r/LocalLLaMA
- **r/commandline**: https://reddit.com/r/commandline
- **r/webdev**: https://reddit.com/r/webdev
- **项目 GitHub**: https://github.com/uikoo9/web-claude-code
- **项目官网**: https://webcc.dev

---

## 📝 额外提示

### 回复频率

- 前 1-2 小时：快速回复所有评论
- 第一天：至少每 2-3 小时检查一次
- 后续：每天检查 1-2 次

### 利用交叉发帖

如果一个 subreddit 反响很好：

- 可以在其他相关 subreddit **提及**（不是直接转发）
- 例如："之前在 r/ClaudeAI 分享过，有朋友建议我来这里..."

### 长期维护

Reddit 帖子会一直存在：

- 定期回复后续评论
- 如果有更新，可以编辑原帖添加 "Edit: 更新内容"
- 几个月后可以用新角度再发一次

---

祝 Reddit 推广顺利！🚀
