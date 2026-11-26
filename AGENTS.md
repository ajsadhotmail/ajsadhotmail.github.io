# Agent 指引

本仓库是「AJSAD Home」个人技术博客：Astro 7 + AstroPaper 主题、中文界面、栏目系统、KaTeX、Mermaid、Giscus，部署在 GitHub Pages 用户主页仓库（`https://ajsadhotmail.github.io/`）。

**完整操作手册：** [`.agents/skills/astro-paper-blog/SKILL.md`](.agents/skills/astro-paper-blog/SKILL.md)
**改动配方：** [`reference/tasks.md`](.agents/skills/astro-paper-blog/reference/tasks.md)
**故障排查：** [`reference/pitfalls.md`](.agents/skills/astro-paper-blog/reference/pitfalls.md)

动手前先读 SKILL.md；遇到「文章不显示 / 分类是 0 篇 / 部署失败」先查 pitfalls。

## 硬性约束

- **Node ≥ 22.23.4**（`.node-version` = 24），包管理器 pnpm。版本不够时 Astro 会直接拒绝运行。
- 提交前必须：`pnpm format && pnpm lint && pnpm build`（CI 会跑 `format:check`、`lint`、`build`）。
- 文章 frontmatter 的 `category` 必须逐字等于 `src/data/categories.ts` 里的 `name`，否则构建报错。
- 不要手改 `dist/`、`.astro/`、`node_modules/`（前两者是产物/缓存，已 gitignore）。
- 界面文案走 `src/i18n/lang/zh.ts`（同步 `en.ts`、`src/i18n/types.ts`）；自定义脚本/样式优先放 `src/custom/`。

## 三个最常用的命令

```bash
pnpm dev     # 本地开发 :4321
pnpm check   # 类型 + frontmatter 校验
pnpm build   # check → build → pagefind → dist/
```

## 键路径速查

| 目的 | 文件 |
| --- | --- |
| 站名 / 简介 / 社交 / 开关 | `astro-paper.config.ts` |
| 插件链 / i18n / base / 字体 | `astro.config.ts` |
| 栏目数据源 | `src/data/categories.ts` |
| frontmatter 规则 | `src/content.config.ts` |
| 配色 / 字体变量 | `src/styles/theme.css` |
| 评论 | `src/data/giscus.ts`、`src/custom/PostEnd.astro` |
| 图表渲染 | `src/scripts/mermaid-render.ts`、`src/utils/rehypeMermaid.js` |
| 首页 | `src/pages/index.astro` |
| 导航 | `src/components/Header.astro` |
| 部署 | `.github/workflows/deploy.yml` |

面向站长的中文说明在 [`README.md`](README.md)，与本文件互补（README 讲「怎么用」，本文件讲「怎么改」）。
