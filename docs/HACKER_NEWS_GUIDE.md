# Hacker News 使用指南

> 面向首次使用 Hacker News 的用户

---

## 📖 什么是 Hacker News？

**Hacker News (HN)** 是一个由 Y Combinator 运营的技术新闻和讨论社区。

**特点**:

- 🎯 **受众**: 程序员、创业者、技术爱好者
- 📈 **影响力**: 在技术圈有极高的影响力
- 🔥 **流量**: 头条帖子能带来数万访问
- 💎 **质量**: 社区质量高，评论有深度

**官网**: https://news.ycombinator.com

---

## 🆕 如何注册

### 步骤 1: 访问注册页面

打开浏览器，访问:

```
https://news.ycombinator.com
```

### 步骤 2: 点击注册链接

在页面右上角找到 **"login"** 链接，点击进入登录页面。

在登录页面底部，你会看到:

```
New user? Create account
```

点击 **"Create account"**

### 步骤 3: 填写注册信息

你需要填写 3 个字段:

| 字段         | 说明                 | 示例          |
| ------------ | -------------------- | ------------- |
| **username** | 用户名（不能修改！） | `vincent_dev` |
| **password** | 密码                 | 自己设置      |

**重要提示**:

- ⚠️ 用户名一旦创建**不能修改**，请慎重选择
- ✅ 建议用真名或 GitHub 用户名
- ✅ 密码要足够强，账号很宝贵
- ❌ 不要用临时邮箱

### 步骤 4: 提交注册

点击 **"create account"** 按钮。

**注册成功后**:

- 你会自动登录
- 右上角显示你的用户名
- 初始 karma（声望）为 1

---

## 🎮 Hacker News 基本操作

### 1. 浏览帖子

**首页**: https://news.ycombinator.com

- 显示最热门的帖子
- 按投票数和时间排序
- 点击标题可以打开链接

**其他页面**:

- **new**: 最新提交的帖子
- **past**: 历史帖子搜索
- **ask**: 提问帖
- **show**: Show HN（展示项目）
- **jobs**: 招聘信息

### 2. 投票（Upvote）

- 点击帖子左侧的 **▲** 可以投票支持
- 只能投 upvote（赞），不能 downvote
- 投票会增加帖子的排名
- 每个帖子只能投一次票

**注意**: 新账号需要一定 karma 才能 downvote 评论。

### 3. 评论

点击帖子下方的 **"comments"** 进入评论页面:

**发表评论**:

1. 在评论框输入内容（支持纯文本）
2. 点击 **"add comment"**

**回复评论**:

1. 点击评论下方的 **"reply"**
2. 输入回复内容
3. 点击 **"add comment"**

**评论格式**:

- 纯文本，无 Markdown
- 链接会自动转换
- 可以用空行分段
- 用 `code` 表示代码

### 4. Karma（声望系统）

**什么是 Karma?**

- 你在 HN 的声望值
- 通过获得 upvote 增加
- karma 越高，权限越多

**Karma 的作用**:

- 500+ karma: 可以 downvote 评论
- 50+ karma: 可以发 Show HN
- 高 karma 的用户评论权重更高

**如何增加 Karma?**

- 发有质量的评论
- 提交好的链接
- 帮助别人解答问题

---

## 📮 如何提交 Show HN

### 什么是 Show HN？

**Show HN** 是 Hacker News 的特殊分类，用于:

- 展示你做的项目
- 获取社区反馈
- 吸引早期用户

### 提交要求

✅ **必须满足**:

- 账号 karma >= 50（新账号需要先积累）
- 项目必须是你自己做的
- 必须有实际可用的产品/代码
- 标题必须以 "Show HN:" 开头

### 提交步骤

#### 1. 点击 "submit"

在 HN 首页右上角，点击 **"submit"** 链接。

#### 2. 填写提交表单

你会看到一个表单，有 3 个字段:

| 字段      | 说明             | 示例                                                         |
| --------- | ---------------- | ------------------------------------------------------------ |
| **title** | 帖子标题（必填） | `Show HN: Web Claude Code – Run Claude Code in your browser` |
| **url**   | 项目链接（可选） | `https://webcc.dev`                                          |
| **text**  | 说明文字（可选） | 项目介绍、技术栈、背景故事等                                 |

**重要**:

- `url` 和 `text` 只能填一个
- 如果填 `url`，用户点击标题会跳转到你的网站
- 如果填 `text`，用户点击标题会看到你的说明文字
- **推荐**: 填 `url` 指向官网，在评论里补充详细说明

#### 3. 选择类型

对于 Show HN，确保:

- 标题以 `Show HN:` 开头
- 如果填了 `text`，帖子会自动归类为 Show HN

#### 4. 提交

点击 **"submit"** 按钮。

**提交后**:

- 帖子立即发布
- 出现在 /newest 页面
- 如果获得投票，会上升到首页

---

## 💡 Show HN 成功秘诀

### 标题技巧

✅ **好标题**:

```
Show HN: Web Claude Code – Run Claude Code in your browser
Show HN: WebCC – Browser-based interface for Claude Code
```

❌ **差标题**:

```
Show HN: Revolutionary AI Tool That Will Change Everything
Show HN: My Awesome Project (Check it out!)
Show HN: I made a thing
```

**要点**:

- 简洁明了（50-70 字符）
- 说清楚是什么（不要卖关子）
- 突出核心价值
- 避免营销用语

### 发帖时间

**最佳时间** (美国东部时间):

- 周二-周四
- 上午 8:00-10:00

**为什么**:

- HN 主要用户在美国
- 工作日上午流量最高
- 新帖需要快速获得投票

### 首条评论

**建议**: 发帖后立即发一条评论，说明:

- 你为什么做这个项目
- 技术栈和架构亮点
- 目前的状态（alpha? beta? 稳定？）
- 欢迎反馈和问题

**示例**:

```
Hi! Creator here.

I built this because I wanted to use Claude Code on my iPad
but the CLI wasn't accessible. So I wrapped it in a web
interface with Socket.IO and xterm.js.

It's fully open source and published to npm. The online mode
uses a relay server I host (ws.webcc.dev) for session sharing.

Happy to answer any questions about the architecture!
```

### 回复策略

**黄金法则**:

1. ⚡ **快速回复**（前 2 小时最关键）
2. 😊 **友好谦逊**（不要防御性）
3. 🧠 **展示深度**（分享技术细节）
4. 🙏 **感谢反馈**（包括批评）
5. ❌ **不要争论**（即使不同意）

---

## 🚫 HN 的禁忌

### 绝对不要做

❌ **操纵投票**

- 用多个账号投票
- 要求朋友投票
- 在其他平台号召投票
- **后果**: 被永久 ban

❌ **垃圾信息**

- 重复发同一个项目
- 过度营销
- 到处贴项目链接
- **后果**: 帖子被删除，账号受限

❌ **不礼貌**

- 攻击其他用户
- 争论不休
- 防御性回复
- **后果**: karma 下降，失去信任

### 社区文化

HN 的文化特点:

- 🎓 **注重技术深度**（而非市场营销）
- 🤔 **批判性思考**（会有很多质疑）
- 📖 **长篇讨论**（评论经常很长）
- 🙅 **反感炒作**（不要夸大其词）

---

## 📊 查看统计

### 你的个人页面

点击右上角你的用户名，可以看到:

- karma 值
- 你发表的帖子
- 你的评论
- 账号创建时间

### 帖子统计

每个帖子显示:

- **points**: 投票数（你的得分）
- **comments**: 评论数
- **时间**: 发布时间

---

## 🔗 有用的链接

- **HN 首页**: https://news.ycombinator.com
- **登录/注册**: https://news.ycombinator.com/login
- **提交帖子**: https://news.ycombinator.com/submit
- **Show HN 专区**: https://news.ycombinator.com/shownew
- **HN 指南**: https://news.ycombinator.com/newsguidelines.html
- **Show HN 指南**: https://news.ycombinator.com/showhn.html

---

## ❓ 常见问题

**Q: 新账号可以立即发 Show HN 吗？**
A: 需要至少 50 karma。建议先发一些有质量的评论积累 karma。

**Q: 多久可以发一次 Show HN？**
A: 同一个项目建议间隔至少 3 个月。频繁发会被认为是 spam。

**Q: 帖子没人看怎么办？**
A: 可能是时机不对或标题不够吸引人。可以过几周用不同角度再试。

**Q: 遇到负面评论怎么办？**
A: 冷静回应，承认不足，展示你在改进。不要争论。

**Q: 可以编辑已发布的帖子吗？**
A: 标题和链接不能改。评论可以在发布后短时间内编辑。

---

## 🎓 更多资源

想深入了解 HN 文化，可以阅读:

- Paul Graham 的文章（HN 创始人）
- HN 的 FAQ 和指南
- 观察高票帖子的讨论风格

**祝你在 HN 上取得成功！** 🚀
