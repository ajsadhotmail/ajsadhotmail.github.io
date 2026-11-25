import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首页",
    posts: "文章",
    categories: "分类",
    tags: "标签",
    about: "关于",
    archives: "归档",
    search: "搜索",
  },
  post: {
    publishedAt: "发布于",
    updatedAt: "更新于",
    sharePostIntro: "分享这篇文章：",
    sharePostOn: "分享到 {{platform}}",
    sharePostViaEmail: "通过邮件分享",
    tagLabel: "标签",
    backToTop: "回到顶部",
    tableOfContents: "目录",
    goBack: "返回",
    editPage: "编辑此页",
    previousPost: "上一篇",
    nextPost: "下一篇",
    comments: "评论",
    commentsHint:
      "评论由 Giscus 提供，使用 GitHub 账号登录后即可发言，内容保存在仓库的 Discussions 中。",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: "第",
  },
  home: {
    socialLinks: "联系方式",
    featured: "精选",
    recentPosts: "最新文章",
    allPosts: "全部文章",
    categories: "栏目",
  },
  footer: {
    copyright: "版权所有",
    allRightsReserved: "保留所有权利。",
  },
  pages: {
    tagTitle: "标签",
    tagDesc: "所有带有该标签的文章",

    tagsTitle: "标签",
    tagsDesc: "文章中出现的全部标签。",

    postsTitle: "文章",
    postsDesc: "我已经发布的全部文章。",

    categoriesTitle: "分类",
    categoriesDesc: "按研究方向整理的栏目。",

    categoryPostCount: "{{count}} 篇文章",

    archivesTitle: "归档",
    archivesDesc: "按时间排列的全部文章。",

    searchTitle: "搜索",
    searchDesc: "输入关键词搜索文章……",
  },
  a11y: {
    skipToContent: "跳到正文",
    skipTableOfContents: "跳到目录之后",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换主题",
    searchPlaceholder: "搜索文章……",
    noResults: "没有找到结果",
    goToPreviousPage: "上一页",
    goToNextPage: "下一页",
  },
  notFound: {
    title: "404 页面不存在",
    message: "页面走丢了",
    goHome: "回到首页",
  },
} satisfies UIStrings;
