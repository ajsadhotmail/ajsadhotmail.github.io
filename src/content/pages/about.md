---
title: "关于"
description: "这个博客写些什么，以及它用什么搭起来。"
---

## 关于我

一个同时关心「电」「热」和「天气」的工程师。白天在实验室里调电源、算循环、看探空图，晚上把这些东西整理成能复现的笔记。

## 这个博客写什么

博客分成四个栏目，顺序大致对应我花时间的比例：

- **电力电子**：变换器拓扑、小信号建模与控制环路、磁性元件、功率器件。
- **动力工程及工程热物理**：热力循环与㶲分析、传热传质、燃烧与流体机械。
- **气象学**：天气系统、大气热力学、数值预报与再分析资料的应用。
- **小玩意**：自己折腾的小工具、脚本和实验，包括这个博客本身。

写作原则很简单：**公式要有来处，结论要有边界条件**。能复现的计算，尽量附上代码；拿不准的，明确写出来。

## 技术栈

站点用 [Astro](https://astro.build/) 与 [AstroPaper](https://github.com/satnaing/astro-paper) 主题构建，托管在 GitHub Pages 上：

| 能力     | 方案                                                            |
| -------- | --------------------------------------------------------------- |
| 内容     | Markdown / MDX，内容集合（Content Collections）校验 frontmatter |
| 数学公式 | KaTeX，构建期渲染                                               |
| 图表     | Mermaid，浏览器端按需渲染                                       |
| 搜索     | Pagefind，构建期生成静态索引                                    |
| 评论     | Giscus，评论存储在仓库的 GitHub Discussions                     |
| 部署     | GitHub Actions → GitHub Pages                                   |

整套站点没有服务端，也没有数据库：文章是仓库里的文件，评论是 GitHub Discussions 里的对话。

## 联系

- GitHub：[@your-name](https://github.com/your-name)
- 邮箱：you@example.com

想讨论某篇文章的内容，直接在那篇文章下面用 GitHub 账号留言即可——评论会同步到这个仓库的 Discussions 里。
