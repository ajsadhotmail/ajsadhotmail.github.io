# 工程笔记 · 个人技术博客

基于 [Astro](https://astro.build/) + [AstroPaper](https://github.com/satnaing/astro-paper) 主题搭建的静态博客，托管在 GitHub Pages。

- **栏目**：电力电子 / 动力工程及工程热物理 / 气象学 / 小玩意
- **数学公式**：KaTeX，构建期渲染为 HTML（无客户端 JS、无闪烁）
- **图表**：Mermaid，浏览器端按需加载渲染，跟随明暗主题
- **评论**：Giscus，评论存放在仓库的 GitHub Discussions
- **搜索**：Pagefind，构建期生成静态索引
- **中文界面**：`src/i18n/lang/zh.ts`

## 本地开发

需要 **Node.js ≥ 22.23.4**（主题与 Astro 7 的要求）与 pnpm。

```bash
pnpm install
pnpm dev        # 开发服务器 http://localhost:4321
pnpm build      # 构建到 dist/，并生成 Pagefind 搜索索引
pnpm preview    # 预览构建结果
pnpm check      # astro check（frontmatter 与类型校验）
```

## 写文章

文章放在 `src/content/posts/<栏目目录>/`，Markdown 或 MDX 均可：

```yaml
---
title: "标题"
pubDatetime: 2026-11-25T10:00:00+08:00
category: 电力电子 # 必须是 src/data/categories.ts 里定义的 name
description: "一句话摘要，会出现在列表、搜索与分享卡片里"
tags: ["buck", "control"]
# 可选
featured: false
draft: false
comments: true # 设为 false 可单独关闭本文评论
hideToc: false
---
正文从这里开始。行内公式 `$E = mc^2$`，也可以用 `$$` 写独立公式块。
```

栏目定义在 [`src/data/categories.ts`](src/data/categories.ts)：新增栏目只需在数组里加一项，导航、分类页、首页栏目卡与文章卡片会自动跟着变。`category` 写错时 `astro check` / 构建会直接报错。

### 数学公式

```markdown
行内：$\eta = \frac{W_{net}}{Q_{in}}$

独立公式：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

渲染由 `remark-math` + `rehype-katex` 完成（见 `astro.config.ts`），KaTeX 样式在 `src/custom/Head.astro` 引入。

### Mermaid 图表

````markdown
```mermaid
flowchart LR
  A["输入"] --> B["处理"] --> C["输出"]
```
````

`src/utils/rehypeMermaid.js` 会在构建期把这类代码块替换成占位元素，浏览器端由 `src/scripts/mermaid-render.ts` 渲染成 SVG。页面没有图表时不会下载 Mermaid（约 1 MB）。

## 站点配置

| 想改什么                         | 改哪里                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 标题、简介、作者、时区、社交链接 | [`astro-paper.config.ts`](astro-paper.config.ts)                                                         |
| Markdown 插件、i18n、base 路径   | [`astro.config.ts`](astro.config.ts)                                                                     |
| 评论                             | [`src/data/giscus.ts`](src/data/giscus.ts)                                                               |
| 栏目                             | [`src/data/categories.ts`](src/data/categories.ts)                                                       |
| 界面文案                         | [`src/i18n/lang/zh.ts`](src/i18n/lang/zh.ts)                                                             |
| 自定义样式                       | [`src/styles/custom.css`](src/styles/custom.css)                                                         |
| 额外 head / body 脚本            | [`src/custom/Head.astro`](src/custom/Head.astro)、[`src/custom/BodyEnd.astro`](src/custom/BodyEnd.astro) |

`src/custom/` 下的文件属于「升级主题也不会被覆盖」的区域，博客的评论、Mermaid 挂载都放在这里。

## 部署到 GitHub Pages

1. 新建仓库并推送代码（分支 `main`）。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送后 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 会自动安装、构建、发布。

工作流会根据仓库名自动推算地址与 `BASE_PATH`：

| 仓库类型               | 线上地址                         | 构建 base |
| ---------------------- | -------------------------------- | --------- |
| `<user>.github.io`     | `https://<user>.github.io/`      | `/`       |
| `blog`（任意项目仓库） | `https://<user>.github.io/blog/` | `/blog`   |

同时会用 `SITE_URL` 环境变量覆盖 `astro-paper.config.ts` 里的 `site.url`，因此**仓库改名后不需要改代码**。若要自定义域名，把仓库 Settings → Pages 的 Custom domain 设好，并在 `astro-paper.config.ts` 里把 `site.url` 改成域名即可（或给工作流加一个 `SITE_URL` 变量）。

本地验证项目仓库的子路径构建：

```bash
BASE_PATH=/blog SITE_URL=https://your-name.github.io pnpm build
```

## 启用评论（Giscus）

1. 仓库设为 **public**，在 Settings → General → Features 打开 **Discussions**。
2. 安装 [Giscus GitHub App](https://github.com/apps/giscus)。
3. 打开 [giscus.app](https://giscus.app/zh-CN)，填入 `用户名/仓库名`，选择分类（建议新建仅维护者可创建讨论的 `Announcements` 分类），记下生成的 `data-repo-id` 与 `data-category-id`。
4. 把值填进 [`src/data/giscus.ts`](src/data/giscus.ts)，或在构建时注入环境变量（推荐，ID 不进仓库）：

```bash
PUBLIC_GISCUS_REPO=your-name/blog \
PUBLIC_GISCUS_REPO_ID=R_kgDO... \
PUBLIC_GISCUS_CATEGORY=Announcements \
PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDO... \
pnpm build
```

在 GitHub Actions 中，这四个值可以从 **Settings → Secrets and variables → Actions → Variables** 读取（工作流已接好）。

未配置时，文章底部会显示一块提示卡片而不是空白区域。文章的 frontmatter 写 `comments: false` 可以单独关闭评论。

## 目录结构

```text
├── astro-paper.config.ts     # 站点元信息
├── astro.config.ts           # Markdown 插件链、i18n、base
├── public/                   # 静态资源（favicon、OG 图、.nojekyll）
├── scripts/make-og.py        # 生成 public/default-og.jpg
├── src/
│   ├── content/posts/        # 文章，按栏目分目录
│   ├── content/pages/        # 「关于」等独立页面
│   ├── data/                 # 栏目与评论配置
│   ├── components/           # 卡片、标签、栏目徽章等
│   ├── pages/categories/     # 分类总览与分页
│   ├── custom/               # 不会被主题覆盖的自定义文件
│   └── styles/custom.css     # 公式 / 图表 / 评论样式
└── .github/workflows/        # CI 与 Pages 部署
```

## 说明与取舍

- **正文使用系统字体栈**（见 `src/styles/theme.css` 的 `--font-app`），中文显示清晰且无需加载字体文件；想换回主题自带的 Google Sans Code，见 `astro.config.ts` 中的注释。
- **动态 OG 图已关闭**（`features.dynamicOgImage: false`），使用静态封面 `public/default-og.jpg`，可用 `scripts/make-og.py` 重新生成。需要每篇文章自动配图时，须先配置一套含中文字形的字体。
- **升级主题**：主题文件会被覆盖，`src/custom/`、`src/data/`、`src/content/` 与 `src/pages/categories/` 属于本项目自己的内容，升级时保留。

## 致谢

主题来自 [satnaing/astro-paper](https://github.com/satnaing/astro-paper)（MIT License），在其基础上做了中文化、栏目系统、KaTeX、Mermaid 与 Giscus 的集成。
