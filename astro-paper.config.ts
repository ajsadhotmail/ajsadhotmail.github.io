import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    /**
     * 站点绝对地址（协议 + 主机名，不含子路径）。
     * 用于 canonical、sitemap、RSS 与 OG 图。
     *
     * - 用户主页仓库 `<user>.github.io`：`https://<user>.github.io`
     * - 项目仓库 `blog`：`https://<user>.github.io`（子路径由 BASE_PATH 提供）
     *
     * 也可以在构建时用环境变量覆盖：`SITE_URL=https://example.com pnpm build`。
     */
    url: "https://ajsadhotmail.github.io",
    title: "AJSAD Home",
    description:
      "个人博客。",
    author: "ajsadhotmail",
    profile: "https://github.com/ajsadhotmail",
    ogImage: "default-og.jpg",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 5,
  },
  features: {
    lightAndDarkMode: true,
    /**
     * 动态 OG 图需要一套含中文字形的字体文件，静态站点用 public/default-og.jpg
     * 更省事；需要每篇文章自动配图时再改为 true，并在 astro.config.ts 里配置
     * 字体（见 astro.config.ts 中的注释）。
     */
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      // 改成你的仓库地址后，文章末尾会出现「编辑此页」链接
      url: "https://github.com/ajsadhotmail/ajsadhotmail.github.io/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/ajsadhotmail" },
    { name: "mail", url: "mailto:ajsadhot@gmail.com" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
