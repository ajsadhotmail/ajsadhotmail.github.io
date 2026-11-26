---
name: astro-paper-blog
description: 维护「AJSAD Home」个人博客——Astro 7 + AstroPaper 主题，中文界面、栏目（分类）系统、KaTeX 公式、Mermaid 图表、Giscus 评论、Pagefind 搜索，部署在 GitHub Pages 用户主页仓库。修改内容、布局、配色、字体、评论、搜索或部署时先读本 skill。
---

# 这个项目是什么

一个纯静态中文技术博客。没有服务端、没有数据库：文章是仓库里的 Markdown，评论存在 GitHub Discussions，搜索索引由构建生成。

| 层 | 选型 | 备注 |
| --- | --- | --- |
| 框架 | Astro 7.4（静态输出） | 要求 **Node ≥ 22.23.4** |
| 主题 | AstroPaper v7（`main` 分支快照） | 上游项目：github.com/satnaing/astro-paper |
| 样式 | Tailwind CSS v4（`@theme inline` 注册设计令牌） | 无 tailwind.config |
| 公式 | remark-math + rehype-katex | **构建期**渲染，无客户端 JS |
| 图表 | mermaid | **浏览器端**渲染，按需加载 chunk |
| 评论 | Giscus（自写客户端逻辑） | 挂在 GitHub Discussions |
| 搜索 | Pagefind | 构建期生成，中文可检索 |
| 部署 | GitHub Actions → Pages | 用户主页仓库 `<user>.github.io` |

部署目标：仓库 `ajsadhotmail/ajsadhotmail.github.io`，线上 `https://ajsadhotmail.github.io/`（根域，`base = "/"`）。

# 权威文件（改之前先看这里）

| 想改什么 | 唯一入口 |
| --- | --- |
| 站名、简介、作者、社交链接、每页文章数、功能开关 | `astro-paper.config.ts` |
| Markdown 插件链、i18n locale、`base`（部署子路径）、字体下载 | `astro.config.ts` |
| 栏目（分类）定义 | `src/data/categories.ts` |
| 文章 frontmatter 校验规则 | `src/content.config.ts` |
| 配色、字体变量 | `src/styles/theme.css` |
| 公式 / 图表 / 评论的专属样式 | `src/styles/custom.css` |
| 界面文案（中文 / 英文） | `src/i18n/lang/zh.ts`、`en.ts` |
| 评论配置 | `src/data/giscus.ts` |
| `head` 里的第三方脚本（统计、验证） | `src/custom/Head.astro` |
| `</body>` 前的全局脚本 | `src/custom/BodyEnd.astro` |
| 文章页末尾（评论区） | `src/custom/PostEnd.astro` |

`src/custom/` 是主题明确承诺「升级不覆盖」的区域，博客的自定义都应优先放这里。

# 目录要点

```
src/
├── content/posts/<栏目目录>/*.md     文章（目录名只影响 URL，栏目由 frontmatter 决定）
├── content/pages/about.md            「关于」页
├── data/categories.ts                栏目数据源（slug / name / description）
├── data/giscus.ts                    评论配置
├── i18n/lang/{zh,en}.ts              界面文案
├── components/                       Card / CategoryBadge / Datetime / Header / Footer …
├── pages/index.astro                 首页（hero、栏目卡、精选、最新）
├── pages/categories/                 栏目总览 + 分页
├── custom/{Head,BodyEnd,PostEnd}.astro
├── scripts/mermaid-render.ts         图表渲染 + 主题重绘
├── styles/{theme,custom,typography,global}.css
└── utils/rehypeMermaid.js            构建期把 mermaid 代码块换成占位元素
```

# 内容模型

frontmatter 必填：`title`、`pubDatetime`、`category`、`description`；可选：`tags`、`featured`、`draft`、`modDatetime`、`ogImage`、`comments`、`hideToc`、`author`、`timezone`。

- `category` 是**枚举**，取值必须逐字等于 `categories.ts` 里的 `name`（当前：电力电子技术 / 动力工程及工程热物理 / 气象学 / 杂项）。写错会在 `astro check` 阶段报错。
- `draft: true` 永不显示；`pubDatetime` 晚于构建当天时，**生产构建**会隐藏、`dev` 不隐藏（`src/utils/postFilter.ts`）。
- `comments: false` 单独关闭某篇文章的评论。
- 发布日期按 `site.timezone`（Asia/Shanghai）计算，日期展示格式在 `src/components/Datetime.astro`（`YYYY[年]M[月]D[日]`）。

# 渲染链路（改之前必须理解）

- **公式**：`astro.config.ts` 的 `markdown.processor` 里 `remarkMath` → `rehypeKatex`，构建期输出 HTML + MathML；KaTeX 样式在 `src/custom/Head.astro` 引入。行内 `$...$`，独立公式 `$$` 需**独占行**（写成一行会变成行内）。
- **Mermaid**：`rehypeMermaid` 先把 ` ```mermaid ` 代码块换成 `<div data-mermaid><pre class="mermaid-source">`，再由 `src/scripts/mermaid-render.ts` 在浏览器渲染成 SVG。`useMaxWidth: false`（自然尺寸，超宽横向滚动），主题切换会重绘，图表字体由脚本里的 `FONT_FAMILY` 单独控制。
- **Giscus**：`src/custom/PostEnd.astro` 注入官方脚本，读 `giscus.ts`；用 `||` 而不是 `??` 取环境变量（CI 未设置的 Variables 会传空字符串）。主题通过 `postMessage` 同步，改 `data-theme` 不会丢评论。
- **搜索**：`build` 脚本里 `pagefind --site dist` 生成索引；`src/pages/search.astro` 覆盖了中文 UI 文案。`dev` 模式下搜索页显示「需要先构建」的提示。
- **OG 图**：`features.dynamicOgImage` 为 **false**，全站用 `public/default-og.jpg`；每篇自动配图需要中文字形字体，未启用。

# 设计系统

- `theme.css` 里 `@theme inline` 只做「令牌 → Tailwind 工具类」的映射，真正取值在下面两段：`:root/[data-theme=light]` 与 `[data-theme=dark]`。7 个颜色令牌：`--background / --foreground / --accent / --accent-foreground / --muted / --muted-foreground / --border`。
- 明暗切换靠 `<html data-theme>`，暗色变体在 `src/styles/global.css` 用 `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` 定义——**不要**用 `prefers-color-scheme` 媒体查询做主题相关逻辑。
- 字体：`--font-app` 引用 `var(--font-roboto)`（拉丁）与 `var(--font-noto-sc)`（中文），由 `astro.config.ts` 的 `fonts` 数组在**构建时**从 Google 下载并自托管。`--font-mono` 管代码。
- 圆角、字号都是 Tailwind 类名，散落在模板里（卡片 `rounded-*`、标题 `text-*`），没有集中配置；需要统一时在 `@theme` 里覆盖对应刻度。

# 命令

```bash
pnpm dev        # 开发服务器 :4321
pnpm build      # astro check → astro build → pagefind → dist/
pnpm preview    # 预览 dist（注意：内容是上次构建的，不是实时）
pnpm check      # 仅类型/frontmatter 校验
pnpm lint       # eslint（CI 会跑）
pnpm format     # prettier 写入（CI 用 format:check，提交前必跑）
```

`pnpm build` 已包含 `astro check`，所以「能构建」就等于「类型与 frontmatter 通过」。

# 部署

- 推送 `main` 触发 `.github/workflows/deploy.yml`；工作流按仓库名推算 `BASE_PATH` 与 `SITE_URL`：`<user>.github.io` → `/` + 根域；其他仓库 → `/<repo>` + `https://<user>.github.io`。因此**换仓库名不需要改代码**。
- 仓库 Settings → Pages → Source 必须是 **GitHub Actions**。
- 若报 `Branch "main" is not allowed to deploy to github-pages due to environment protection rules`，去 Settings → Environments → `github-pages` → Deployment branches 改成 No restriction 或加入 `main`，然后 Re-run。
- 覆盖历史前务必先备份旧状态（分支 + tag），force-push 到 `main` 是切换整站的最快方式。

# 改动纪律

1. 中文文案保持一致；新增界面文字走 `src/i18n/lang/zh.ts`（必要时同步 `en.ts` 与 `src/i18n/types.ts`）。
2. 只改 `src/data`、`src/custom`、`src/styles`、`src/pages`、内容文件；避免直接改 `node_modules`、`dist`、`.astro`。
3. 任何改动后至少跑 `pnpm format` + `pnpm lint` + `pnpm build`。
4. 行为/配置有变化时同步更新 `README.md`。
5. 详细配方见 `reference/tasks.md`，故障排查见 `reference/pitfalls.md`。
