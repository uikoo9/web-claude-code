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

**Flair 选择**:

推荐选择 **"Productivity"** - 强调这是一个提高效率的工具，符合社区教育价值导向，而不是纯粹的推广。

备选: **"Promotion"** - 如果你想更透明地标识这是项目展示。

**标题**:

```
I built a free browser-based terminal for Claude Code users (open source)
```

**正文**:

````markdown
Hey everyone! 👋

As a Claude Code user, I found myself wanting to use it on devices without terminal access (iPad, shared computers, etc.). So I built a free, open-source web interface that might help others in similar situations.

**Note:** This is built FOR Claude Code (Anthropic's CLI tool), not WITH Claude as an AI assistant. It's a tool to help the community access Claude Code more easily.

**Who this might help:**

- **Mobile users** - Use Claude Code on tablets/phones
- **Educators/Team leads** - Share live Claude sessions for teaching or demos
- **Beginners** - No terminal setup required, just install and run
- **Remote workers** - Access your Claude Code session from any browser

**What it does:**

- Provides a web-based terminal that connects to Claude Code CLI
- Two modes: local (runs on localhost) or online (session sharing)
- Saves terminal history across page refreshes
- Free forever, no paid tiers, fully open source

**Quick start:**

```bash
npm install -g @webccc/cli
webcc
# Opens at http://localhost:4000
```
````

**Technical implementation:**

- Express + Socket.IO for WebSocket communication
- React + xterm.js for terminal emulation
- Available as npm package

**100% free and open source:**

- GitHub: https://github.com/uikoo9/web-claude-code
- Website: https://webcc.dev
- npm: https://www.npmjs.com/package/@webccc/cli

Happy to answer questions about the implementation or how it might help your workflow!

```

---

### 2. r/LocalLLaMA（AI 爱好者社区）

**Flair 选择**:

推荐选择 **"Project"** 或 **"Show and Tell"** - 这个社区鼓励分享开源项目。

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

**Flair 选择**:

推荐选择 **"CLI Tool"** 或 **"Showcase"** - 符合这个社区展示命令行工具的文化。

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

**Flair 选择**:

推荐选择 **"Project"** 或 **"Show & Tell"** - 适合展示技术项目和架构设计。

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

## 🎯 账号准备期策略（7 天等待期）

### 目标
在账号满足发帖要求前，积累 karma 并融入社区。

### 每日行动计划

**Day 1-2: 了解社区**
- 浏览 r/ClaudeAI 的热门帖子
- 阅读置顶帖和规则
- 了解社区讨论风格和热点话题

**Day 3-5: 参与评论（关键期）**

找到这些类型的帖子进行评论：
- **Question 帖子** - 如果你知道答案，提供帮助性回复
- **Bug 帖子** - 如果你遇到过类似问题，分享解决方案
- **Discussion 帖子** - 分享你的使用经验和观点
- **Show HN 帖子** - 给予建设性反馈

**评论建议**：
```markdown
✅ 好的评论示例:
"I've had this issue before. Try running `claude --reset` to clear the cache."
"Great idea! One thing to consider is error handling for network failures."
"This is helpful. Does it work with the latest Claude CLI version?"

❌ 差的评论示例:
"Cool"
"Nice project!"（太简短）
"Check out my tool at..."（推广自己的项目）
```

**Day 6-7: 确认准备就绪**
- 检查你的 karma（建议 10+）
- 确认账号年龄（7 天+）
- 准备好发帖内容（已在 REDDIT_POSTS.md 中）

### Karma 积累技巧

1. **回答问题**: r/ClaudeAI 经常有人问使用问题，提供帮助性答案
2. **分享经验**: "I use Claude for X, here's what works for me..."
3. **技术讨论**: 参与关于 Claude API、MCP、工作流的讨论
4. **早期评论**: 在帖子发布后 1-2 小时内评论，更容易获得 upvotes
5. **质量 > 数量**: 10 个有深度的评论 > 100 个"Nice!"

### 禁忌行为（会被 shadowban）

❌ 不要在这 7 天内:
- 在评论里提及你的项目
- 在无关帖子里贴你的链接
- 发大量低质量评论刷 karma
- 用多个账号互相投票

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
1. **账号准备期（Day 1-7）**: 积累 karma，融入社区（详见上文"账号准备期策略"）
2. **第 8 天**: r/ClaudeAI（最相关）
3. **第 10 天**: r/LocalLLaMA（如果第 1 个反响好）
4. **第 12 天**: r/commandline 或 r/webdev（选其一）

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
- 教育价值和社区帮助（Rule 7 要求）

❌ **避免**:
- 过度技术细节
- 批评 Anthropic
- 纯粹的推广语言

**Flair 选择**: 使用 "Productivity"（推荐）而不是 "Promotion"，强调这是帮助用户提高效率的工具。

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
- [ ] **选择合适的 Flair（标签）** - 发布时必选，否则可能被删除
- [ ] 准备好回复常见问题
- [ ] 确保所有链接可访问

### 账号要求

**⚠️ 实际测试结果（r/ClaudeAI）**:
- ❌ 新账号（< 几天）会被 AutoModerator 自动拦截
- ✅ 建议等待至少 **7 天**后再发帖
- ✅ 期间可以评论其他帖子积累 karma

**各 subreddit 要求**:

| Subreddit     | 账号年龄 | Karma 要求 | 邮箱验证 | 测试状态 |
| ------------- | -------- | ---------- | -------- | -------- |
| r/ClaudeAI    | ~7 天    | 不明确     | 推荐     | ❌ 已确认拦��新账号 |
| r/LocalLLaMA  | 未知     | 未知       | 推荐     | 未测试   |
| r/commandline | 7天+     | 10+        | 必须     | 未测试   |
| r/webdev      | 7天+     | 20+        | 必须     | 未测试   |

**建议行动方案**:

1. **等待期（7 天）**:
   - ✅ 验证邮箱
   - ✅ 每天浏览 r/ClaudeAI，找到感兴趣的帖子发表评论
   - ✅ 参与讨论，提供有价值的回复（不要提自己的项目）
   - ✅ 目标：积累 10-20 karma

2. **7 天后**:
   - ✅ 再次尝试发帖到 r/ClaudeAI
   - ✅ 如果成功，等待 1-2 天后发到其他 subreddit

3. **备选方案**:
   - 如果你有其他更老的 Reddit 账号，可以使用那个账号发帖

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

很多 subreddit 要求选择 flair（发帖前必选）：

| Subreddit | 推荐 Flair | 备选 | 说明 |
|-----------|-----------|------|------|
| r/ClaudeAI | **Productivity** | Promotion | 强调效率工具，符合教育价值导向 |
| r/LocalLLaMA | **Project** | Show and Tell | 开源项目展示 |
| r/commandline | **CLI Tool** | Showcase | CLI 工具社区标准分类 |
| r/webdev | **Project** | Show & Tell | 技术项目展示 |

**重要提示**:
- Flair 选择会影响帖子的可见度和社区接受度
- r/ClaudeAI 使用 "Productivity" 比 "Promotion" 更受欢迎（Rule 7 要求）
- 某些 subreddit 未选择 Flair 会被 automod 自动删除

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
