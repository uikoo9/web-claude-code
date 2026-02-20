# Web Claude Code 推广计划

> 创建时间: 2026-02-19
> 状态: 待执行

---

## ✅ 已完成

- [x] Google Search Console 提交网站和网站地图
- [x] Bing Webmaster Tools 提交网站和网站地图
- [x] 优化 npm 包页面（README、keywords、description、homepage）
- [x] 优化 GitHub README（badges、结构、删除冗余内容）
- [x] 删除中文 README，使用英文统一文档
- [x] 更新 demo 图片地址
- [x] 修正 README 中的过时信息（交互式向导、使用示例）
- [x] 根目录 README 改为软链接，统一维护
- [x] 推送代码到 GitHub
- [x] 设置 GitHub Repository Topics
- [x] 发布新版本到 npm

---

## 🎯 立即可做（优先级最高）

### 1. ~~npm 包页面优化~~ ✅ 已完成

- [x] 优化 @webccc/cli 的 README
- [x] 添加项目截图
- [x] 突出核心功能和使用场景
- [x] 添加快速开始指南
- [x] 完善 package.json 配置（keywords、description、homepage）

### 2. ~~GitHub 仓库优化~~ ✅ 已完成

- [x] 完善 README.md
- [x] 设置 Repository Topics
- [x] 检查 About 部分（Description、Website）

---

## 🌟 开发者社区推广（影响力最大） ⬅️ **当前阶段**

### Hacker News (Show HN)

- [x] 注册 Hacker News 账号
- [x] 准备 Show HN 帖子内容（详见 docs/SHOW_HN_POST.md）
- [x] 编写 HN 使用指南（详见 docs/HACKER_NEWS_GUIDE.md）
- [ ] 积累 karma 到 50（发表有质量的评论）
- [ ] 选择发布时间（周二-周四，美国东部上午 8-10 点）
- [ ] 发布 Show HN 帖子
- [ ] 快速回复评论（前 2 小时内）
- [ ] 链接: https://news.ycombinator.com/submit

**帖子准备**:

- ✅ 标题: `Show HN: Web Claude Code – Run Claude Code in your browser`
- ✅ 3 个版本的正文（技术向、简短版、问题导向）
- ✅ 常见评论应对策略
- ✅ 最佳发布时间表

### Reddit

- [x] 准备 Reddit 帖子内容（详见 docs/REDDIT_POSTS.md）
- [x] 编写 Reddit 使用指南（详见 docs/REDDIT_GUIDE.md）
- [x] 针对 r/ClaudeAI Rule 7 优化帖子内容
- [x] 注册 Reddit 账号
- [x] 实际测试发现账号年龄限制（需等待 7 天）
- [ ] **等待期（7 天）**: 每日参与评论积累 karma（目标 10-20）
- [ ] **第 8 天**: r/ClaudeAI - 发布项目介绍
- [ ] **第 10 天**: r/LocalLLaMA - 分享工具
- [ ] **第 12 天**: r/commandline 或 r/webdev

**实际测试结果**:

- ❌ r/ClaudeAI AutoModerator 拦截新账号
- ✅ 已添加详细的 7 天准备期策略
- ✅ 包含每日行动计划和 karma 积累技巧

**帖子准备**:

- ✅ 为 4 个 subreddit 定制不同版本的帖子
- ✅ r/ClaudeAI 帖子符合 Rule 7 要求（强调教育价值、免费开源）
- ✅ 添加 Flair 选择指导
- ✅ 发布时间建议和评论应对策略
- ✅ 各社区文化和注意事项

**当前优先级调整**:
由于 Reddit 需要 7 天等待期，建议这段时间专注于:

1. Hacker News karma 积累（需要 50 karma 发 Show HN）
2. GitHub 仓库优化（stars, topics）
3. 准备 Product Hunt 发布

### Product Hunt

- [ ] 创建 Product Hunt 账号
- [ ] 准备产品页面
  - [ ] 产品名称、标语、描述
  - [ ] 截图/视频
  - [ ] Logo
- [ ] 选择发布日期（周二/周三效果最好）
- [ ] 链接: https://www.producthunt.com/posts/create

### DEV.to

- [ ] 撰写技术文章
  - [ ] 标题建议: "Building a Web-based Terminal for Claude Code"
  - [ ] 内容: 技术架构、为什么选择 Socket.IO、开发心得
  - [ ] 标签: #ai #claude #webdev #opensource
- [ ] 链接: https://dev.to/new

---

## 📋 AI 工具目录提交

### 主流 AI 工具目录

- [ ] **Product Hunt** (prioritize)
  - URL: https://www.producthunt.com

- [ ] **AlternativeTo**
  - URL: https://alternativeto.net/suggest/
  - 提交为 "Claude Code" 的 alternative

- [ ] **Toolify.ai**
  - URL: https://www.toolify.ai/submit-tool
  - 分类: Developer Tools / AI CLI

- [ ] **There's An AI For That**
  - URL: https://theresanaiforthat.com/submit/

- [ ] **Futurepedia**
  - URL: https://www.futurepedia.io/submit-tool

- [ ] **AI Tool Directory**
  - URL: https://aitoolsdirectory.com/submit

- [ ] **AI Tools List**
  - URL: https://aitoolslist.io/submit

### GitHub Awesome 列表

- [ ] 搜索并提交 PR 到相关 awesome 列表
  - [ ] awesome-claude
  - [ ] awesome-ai-tools
  - [ ] awesome-cli
  - [ ] awesome-terminal
  - [ ] awesome-developer-tools

---

## 🔍 SEO 优化检查清单

### webcc.dev 网站检查

- [ ] 检查 meta 标签
  - [ ] `<title>` 标签是否包含关键词
  - [ ] `<meta name="description">` 是否完整（150-160字符）
  - [ ] `<meta name="keywords">` 是否合理

- [ ] 检查 Open Graph 标签（社交媒体分享）

  ```html
  <meta property="og:title" content="Web Claude Code" />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="https://webcc.dev/og-image.png" />
  <meta property="og:url" content="https://webcc.dev" />
  <meta property="og:type" content="website" />
  ```

- [ ] 检查 Twitter Card 标签

  ```html
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Web Claude Code" />
  <meta name="twitter:description" content="..." />
  <meta name="twitter:image" content="https://webcc.dev/twitter-card.png" />
  ```

- [ ] 检查 robots.txt
  - [ ] 确保允许爬虫访问
  - [ ] 包含 sitemap 链接

- [ ] 检查 sitemap.xml
  - [ ] 所有重要页面都包含在内
  - [ ] 已在 Google Search Console 和 Bing 提交

- [ ] 生成 og:image 和 twitter:card 图片
  - [ ] 尺寸: 1200x630px (Open Graph)
  - [ ] 包含项目 logo 和简短描述

---

## 📝 内容营销（长期）

### 技术博客文章

- [ ] "How I Built a Web Interface for Claude Code"
- [ ] "WebSocket + xterm.js: Building a Real-time Terminal"
- [ ] "Monorepo Best Practices with Lerna + Nx"
- [ ] 可发布平台: Medium, DEV.to, Hashnode, 自己的博客

### 视频内容

- [ ] 录制产品 demo 视频（2-3分钟）
- [ ] 上传到 YouTube
- [ ] 嵌入到官网和 GitHub README

### 社交媒体

- [ ] Twitter/X: 发布产品介绍
- [ ] LinkedIn: 分享技术文章
- [ ] Discord: 加入 Claude/AI 开发者社区，适时分享

---

## 🚫 暂时不建议做的

- ❌ 付费广告（Google Ads, Facebook Ads）- ROI 低
- ❌ 大量低质量目录提交 - 效果差且可能影响 SEO
- ❌ 购买 backlinks - 违反搜索引擎政策
- ❌ 黑帽 SEO 技术 - 风险高

---

## 📊 效果追踪

### 分析工具设置

- [ ] Google Analytics 4
- [ ] npm 下载量监控
- [ ] GitHub Star 和 Fork 数量
- [ ] 网站流量来源分析

### 关键指标

- npm weekly downloads
- GitHub stars 增长
- 官网访问量
- 搜索引擎排名（关键词: "claude code web", "claude browser terminal"）

---

## 💡 执行建议

1. **第一周**: 完成"立即可做"部分（npm + GitHub 优化）
2. **第二周**: Hacker News Show HN + Reddit 发布
3. **第三周**: Product Hunt 发布（选周二/周三）
4. **第四周**: DEV.to 文章 + AI 工具目录提交
5. **持续**: 内容营销，社交媒体互动

**最高优先级**: GitHub README 优化 + Hacker News Show HN
**预期效果**: 开发者工具在 HN 获得好评后，通常能带来数百 stars 和显著的 npm 下载增长

---

## 📞 需要帮助？

如果执行过程中需要：

- 撰写 Show HN 帖子
- 优化 README 文案
- 生成 og:image 图片
- 撰写技术文章

随时告诉我！
