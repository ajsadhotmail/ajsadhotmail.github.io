/**
 * Giscus 评论系统配置。
 *
 * 开启步骤（一次性）：
 *  1. 博客仓库必须是 **public**，并在 Settings → General → Features 里勾选 Discussions。
 *  2. 安装 Giscus GitHub App：https://github.com/apps/giscus
 *  3. 打开 https://giscus.app/ ，填入 `用户名/仓库名`，选择 Discussion 分类
 *     （建议新建一个 Announcements 类型的分类，只允许维护者创建讨论）。
 *  4. 把页面下方生成的 `data-repo-id` 和 `data-category-id` 填到下面。
 *
 * 也可以用环境变量注入（适合 CI，不必把 ID 写进仓库）：
 *  PUBLIC_GISCUS_REPO / PUBLIC_GISCUS_REPO_ID / PUBLIC_GISCUS_CATEGORY / PUBLIC_GISCUS_CATEGORY_ID
 */
export interface GiscusSettings {
  /** 仓库全名，例如 "your-name/blog" */
  repo: string;
  /** giscus.app 生成的仓库 ID（R_kgDO...） */
  repoId: string;
  /** Discussions 分类名，例如 "Announcements" */
  category: string;
  /** giscus.app 生成的分类 ID（DIC_kwDO...） */
  categoryId: string;
  /** 文章与 Discussion 的映射方式：pathname 最稳妥 */
  mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  reactionsEnabled: "0" | "1";
  emitMetadata: "0" | "1";
  inputPosition: "top" | "bottom";
  /** 界面语言，中文用 zh-CN */
  lang: string;
  /** 跟随站点明暗主题的配色 */
  theme: { light: string; dark: string };
}

const env = import.meta.env;

export const giscusSettings: GiscusSettings = {
  repo: env.PUBLIC_GISCUS_REPO || "ajsadhotmail/ajsadhotmail.github.io",
  repoId: env.PUBLIC_GISCUS_REPO_ID || "MDEwOlJlcG9zaXRvcnkxNDUxOTg3ODU=",
  category: env.PUBLIC_GISCUS_CATEGORY || "Announcements",
  categoryId: env.PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOCKeOwc4DL_me",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "zh-CN",
  theme: { light: "light", dark: "dark" },
};

/** 三个必填项齐全才注入 Giscus，否则显示配置提示 */
export const isGiscusConfigured = Boolean(
  giscusSettings.repo && giscusSettings.repoId && giscusSettings.categoryId
);
