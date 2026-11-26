# 故障排查手册

按「症状 → 原因 → 处理」组织。

## 构建直接失败：Node 版本

症状：`Node.js vX is not supported by Astro! Please upgrade Node.js to a supported version: ">=22.23.4"`。

处理：换 Node 22.23.4+（仓库有 `.node-version` = 24）。若机器上 PATH 里的 Node 太旧，可临时把新版 Node 的目录前置到 PATH 再执行 `pnpm ...`。

## 改了栏目名，分类页显示「0 篇文章」

原因：Astro 内容缓存（`.astro/data-store.json`、`.astro/collections/*.schema.json`）还是旧的枚举，而文章 frontmatter 已是新名，条目被判为不合法或元数据过期。

处理：重启 `pnpm dev`；仍不行则删除 `.astro/` 后重跑（该目录是构建缓存，已 gitignore）。

判断依据：`posts.schema.json` 的 `enum` 里是否是旧名；data-store 里是否还有旧类别字符串。

## 文章在本地可见、线上不见

原因：生产构建会隐藏 `pubDatetime` 晚于「构建当天」的文章（按 `site.timezone`，day-granular），`dev` 不隐藏。也可能是 `draft: true`，或文件/目录名以 `_` 开头（glob 规则 `**/[^_]*` 会整目录忽略）。

处理：检查 frontmatter 日期与时区、draft，以及路径里是否有下划线开头的段。

## 部署后 CSS/图片 404 或跳转错地址

原因：`base` 与仓库类型不匹配。工作流按仓库名自动推导：`<user>.github.io` → `/`；其他 → `/<repo>`。本地手动构建不会自动带 base。

处理：本地复现子路径站点用 `BASE_PATH=/repo pnpm build`；确认 `astro-paper.config.ts` 的 `site.url` 是**纯 origin**（不带仓库子路径），子路径由 `base` 负责。

## 内联两个 SVG 后，某个主题下图标消失

原因：两个导出文件共用同一个 class（常见 `.cls-1`）且各自带 `<style>`，同时内联进一个页面时，后出现的规则覆盖前者（同权重，后者胜）。表现是浅色模式下白图白底。

处理（三选一）：

1. 用 `<img src={...}>`（`?url` 导入或 `public/`），各自独立文档，不冲突；
2. 内联但把两个文件的 class 改成唯一名，`<style>` 同步；
3. 若图形完全一致，只保留一份并把 `fill` 改成 `currentColor`，跟随 `--foreground`，不再需要两张图。

## 评论在 CI 构建后消失（本地正常）

原因：`giscus.ts` 用 `??` 取环境变量，而 CI 里未设置的 `${{ vars.X }}` 会解析成**空字符串**，`??` 认为有值，把仓库名覆盖成 `""`。

处理：用 `||`；或确保四个变量都配置。

## Pages 部署报 `Branch "main" is not allowed to deploy to github-pages due to environment protection rules`

原因：`github-pages` 环境残留旧部署方式（曾用 Deploy from a branch）留下的 Deployment branches 限制。

处理：Settings → Environments → `github-pages` → Deployment branches and tags → No restriction 或加入 `main` → 保存后 Re-run。若环境不存在，先把 Pages 的 Source 设为 GitHub Actions。

## Mermaid 图表过小 / 过大 / 文字看不清

原因：Mermaid 默认 `useMaxWidth: true` 会缩放到容器宽度，宽图字号会被压小；反之窄图会被拉满。

处理：`src/scripts/mermaid-render.ts` 已设 `flowchart.useMaxWidth: false` 等，按自然尺寸渲染；超宽图表由 `.mermaid-block` 横向滚动并插入 `.mermaid-hint` 提示。新增图表类型（sequence/class 等）时确认对应配置也有 `useMaxWidth: false`。

另外：图表字体不跟随站点字体，需要改同一文件里的 `FONT_FAMILY`。

## 搜索页在 dev 下没有结果

原因：Pagefind 索引只在 `pnpm build` 后存在。`src/pages/search.astro` 在 dev 下会显示「需要先构建」的提示。

处理：`pnpm build` 后用 `pnpm preview` 验证搜索。

## 公式显示为源码或渲染报错

原因：独立公式的 `$$` 必须各占一行；`$$...$$` 写成一行会被当作行内公式。KaTeX 语法错误在 `strict:false` 下渲染成红色文本，不会中断构建。

## 深色主题下正文发灰、行内代码看不清

原因：把 `--accent` 设成与 `--foreground` 相同会失去强调色；把 `--muted` 设成浅灰会让行内代码（浅底 + 近白字）对比度不足。

处理：在 `theme.css` 里为深色主题选深色 `--muted`；强调色保留一点色相。

## 构建报 `missing public/default-og.jpg`

原因：`dynamicOgImage: false` 时，`resolveDefaultOgImagePath` 要求 `public/{site.ogImage}` 必须存在。

处理：补文件，或用 `scripts/make-og.py` 重新生成，或开启动态 OG。

## CI 失败在 format/lint，但本地能构建

原因：CI 跑 `prettier --check` 与 `eslint`。手改模板/样式后没格式化。

处理：提交前 `pnpm format`，再 `pnpm lint`。

## 首页/分类页新加的文字没有生效

排查顺序：文件是否保存 → `dev` 是否有 HMR 报错（终端）→ 是否改的是 `src/i18n/lang/zh.ts` 而不是模板里的字面量 → 内容缓存是否更新（重启 dev）。

## 推送旧仓库失败（历史不相关）

原因：新项目只有一个提交，与旧仓库没有共同祖先。

处理：先备份旧状态（分支 + tag），再 `git push --force -u origin main`。回滚用 `git push --force origin <backup-branch>:main`。
