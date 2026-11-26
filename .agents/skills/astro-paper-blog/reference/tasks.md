# 常用改动配方

每条都按「改哪些文件 → 验证方式」写。行号会漂移，以文件名与符号名为准。

## 1. 写一篇新文章

新建 `src/content/posts/<任意目录>/<slug>.md`，目录名只影响 URL，不影响栏目：

```yaml
---
title: "标题"
pubDatetime: 2026-11-26T10:00:00+08:00
category: 电力电子技术        # 必须与 src/data/categories.ts 的 name 逐字一致
description: "一句话摘要，会进列表、搜索与分享卡片"
tags: ["buck", "control"]
# 可选：featured / draft / modDatetime / ogImage / comments: false / hideToc
---
```

正文写法：

- 行内公式 `$E=mc^2$`；独立公式必须**独占行**（`$$` 单独一行），否则会按行内渲染。
- 图表用 ` ```mermaid ` 代码块，支持 flowchart / sequence / class 等。
- 表格、引用、代码块（带复制按钮）都开箱可用。

验证：`pnpm dev` 打开文章 → `pnpm build` 确认 frontmatter 通过。

## 2. 新增栏目

1. `src/data/categories.ts` 追加 `{ slug, name, description }`（slug 用英文短横线）。
2. 在文章 frontmatter 用新的 `name`。
3. 不需要改导航、分类页、首页栏目卡——它们都由这个数组派生。
4. 若要调整栏目顺序，直接挪数组元素。

## 3. 栏目改名（最容易漏）

按顺序检查：

1. `src/data/categories.ts` 的 `name`；
2. **所有已发布文章的 `category`**（枚举校验会让不一致的文章在构建时报错或消失）；
3. `src/pages/index.astro` 的 hero 文案里可能提到栏目名；
4. `src/content/pages/about.md` 的栏目列表；
5. `astro-paper.config.ts` 的 `description`；
6. `README.md` 与 `package.json` 的 `description`；
7. `scripts/make-og.py` 里 OG 图上的说明文字（改完重跑脚本）。

URL 由 `slug` 决定，只改 `name` 不会让旧链接 404；改 `slug` 才会。

改完如果分类页显示「0 篇文章」，先看 `reference/pitfalls.md` 的缓存条目。

## 4. 改配色

只动 `src/styles/theme.css` 的两段变量（浅色 `:root/[data-theme=light]`、深色 `[data-theme=dark]`）：

| 变量 | 影响 |
| --- | --- |
| `--background` | 页面底色 |
| `--foreground` | 正文、标题默认色 |
| `--accent` | 链接、悬停、导航激活下划线、徽章、图表外的强调元素 |
| `--accent-foreground` | 强调色块上的文字（选区文字） |
| `--muted` | 行内代码底色、表格斑马纹 |
| `--muted-foreground` | 日期、摘要、次要说明 |
| `--border` | 分割线、卡片描边、表格线 |

注意：

- `--accent` 与 `--foreground` 取相同值会让整站失去唯一强调色，视觉上会「变素」；这不是 bug，是配色选择。
- 深色主题里 `--muted` 若调得过亮，行内代码（`bg-muted/75` + `text-foreground`）会变成浅底浅字，对比度不足。
- **Mermaid 图表配色独立**：在 `src/scripts/mermaid-render.ts` 的 `THEME_SOURCES`（`neutral` / `dark`）与 `themeVariables` 里，想跟随站点色需手动加 `primaryColor`、`lineColor` 等。
- favicon（`public/favicon.svg`）与 OG 图（`scripts/make-og.py`）里的颜色是写死的。

## 5. 改字体

1. `src/styles/theme.css` 的 `--font-app`（正文）与 `--font-mono`（代码）。
2. 想用 Web 字体：在 `astro.config.ts` 的 `fonts` 数组里增删条目，`cssVariable` 与 `--font-app` 里的 `var(...)` 对应。当前是 Latin 用 `Roboto`、中文用 `Noto Sans SC`，顺序即优先级（浏览器按字形逐个回退）。
3. 中文字体体积大，`Noto Sans SC` 不加 `subsets` 是为了保留按 unicode-range 分块、只加载用到的字块。
4. 图表字体不受 `--font-app` 影响，要改 `src/scripts/mermaid-render.ts` 的 `FONT_FAMILY`。
5. KaTeX 有自带字体，不要动。

## 6. 改首页

`src/pages/index.astro`：

- hero 标题 / logo：`<h1>` 块（logo 用 `?url` 导入 SVG 后 `<img class="h-* w-auto dark:hidden / dark:block">` 切换）；
- 介绍段落：hero 里的 `<p>`；
- 栏目卡：`#categories` 区块，标题来自 `t.home.categories`；
- 精选 / 最新文章：`#featured`、`#recent-posts`，条数由 `astro-paper.config.ts` 的 `posts.perIndex` 控制。

## 7. 改导航

- 项目与顺序：`src/components/Header.astro` 的 `<ul id="menu-items">`；
- 文字：`src/i18n/lang/zh.ts` 的 `nav`；
- 显示开关：`astro-paper.config.ts` 的 `features.showArchives` / `features.search` / `features.lightAndDarkMode`；
- 新增一项：Header 加 `<li>` → 新建 `src/pages/<name>.astro` → 在 `src/components/Breadcrumb.astro` 的 `navLabels` 加中文标签（否则面包屑显示英文路径）。

## 8. 改日期显示

`src/components/Datetime.astro`：`dateFormat` 里 `zh` 分支的 dayjs 格式串，字面量用方括号（如 `"YYYY [年] M [月] D [日]"`）。

## 9. 评论

- ID 在 `src/data/giscus.ts`，支持环境变量覆盖（CI 变量：`GISCUS_REPO`、`GISCUS_REPO_ID`、`GISCUS_CATEGORY`、`GISCUS_CATEGORY_ID`）。
- 单篇关闭：frontmatter `comments: false`。
- 深色配色：`theme.dark` 可改成 `transparent_dark` 与深色背景融合。
- 未配置时评论位置显示配置指引卡片，不会留白。
- Giscus 前提：仓库 public、开启 Discussions、安装 Giscus App、ID 与仓库绑定（换仓库要重新取）。

## 10. 加访问统计（GA4）

1. 在 `src/custom/Head.astro` 加 gtag 脚本，读 `import.meta.env.PUBLIC_GA_ID`，为空则不渲染。
2. **本主题是客户端路由**：必须关闭默认 `send_page_view`，改在 `astro:page-load` 事件里手动上报，并按 URL 去重；否则只有首屏计一次、或首屏计两次。
3. 本地放 `.env`（`PUBLIC_GA_ID=G-...`），线上去 Actions Variables 建 `GA_ID` 并在 `deploy.yml` 的 `env:` 加 `PUBLIC_GA_ID: ${{ vars.GA_ID }}`。
4. 不要再开 GA4 的「基于浏览器历史记录跟踪页面更改」，会和手动上报重复计数。
5. 现实限制：`googletagmanager.com` 在中国大陆不可达，国内访客统计不到；可考虑 Cloudflare Web Analytics / Umami。

## 11. 换 logo

- 两张图（深色版给浅色主题、白色版给深色主题）：用 `?url` 导入 + `<img class="dark:hidden" / "hidden dark:block">`，或放 `public/` 用 `getAssetPath()`。
- **不要**把两个导出 SVG 直接内联：If they share class names（如 `.cls-1`）且各自带 `<style>`，后渲染的样式会覆盖前者，导致某一主题下图标隐形。要么用 `<img>`，要么把类名改成唯一，要么改成 `fill="currentColor"` 只保留一份。
- 尺寸只在 `<img>` 上给 `h-*`（`w-auto` 保持比例），两张图的类必须一致，否则切换主题会跳高。

## 12. 改 OG 图

- 静态封面：`public/default-og.jpg`，由 `scripts/make-og.py` 生成（改颜色/文字后重跑）。
- 每篇自动配图：`features.dynamicOgImage` 打开 + 在 `astro.config.ts` 配含中文字形的字体，否则 satori 渲染中文会缺字。

## 13. 发布前自检

```bash
pnpm format && pnpm lint && pnpm build
```

再手动过一遍：首页 / 一篇文章 / 分类页 / 标签页 / 搜索（`?q=关键词`）/ 移动端宽度（390px 不应横向溢出）/ 明暗切换（含 Mermaid 与评论框）。
