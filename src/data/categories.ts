/**
 * 博客栏目（分类）定义。
 *
 * 这里是唯一的数据源：frontmatter 的 `category` 字段、导航、分类页、
 * 文章卡片上的标签都由它派生。新增栏目时只需在此追加一项，然后在文章
 * frontmatter 里写对应的 `name`。
 */
export interface Category {
  /** URL 片段，建议用英文短横线风格 */
  slug: string;
  /** 展示名，同时是 frontmatter `category` 要填的值 */
  name: string;
  /** 栏目简介，显示在分类页 */
  description: string;
}

export const CATEGORIES = [
  {
    slug: "power-electronics",
    name: "电力电子",
    description:
      "变换器拓扑、小信号建模与控制环路、磁性元件、功率器件与驱动设计。",
  },
  {
    slug: "thermal-engineering",
    name: "动力工程及工程热物理",
    description:
      "热力循环与㶲分析、传热传质、燃烧与流体机械，以及它们在工程中的权衡。",
  },
  {
    slug: "meteorology",
    name: "气象学",
    description:
      "天气系统与锋面、大气热力学与稳定度、数值预报与再分析资料的应用。",
  },
  {
    slug: "playground",
    name: "小玩意",
    description: "自己折腾的小工具、脚本、硬件实验和那些不够成文的想法。",
  },
] as const satisfies readonly Category[];

export type CategoryName = (typeof CATEGORIES)[number]["name"];

/** 供 zod schema 使用的非空元组 */
export const CATEGORY_NAMES = CATEGORIES.map(category => category.name) as [
  CategoryName,
  ...CategoryName[],
];

/** 按展示名查栏目 */
export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find(category => category.name === name);
}

/** 按 URL 片段查栏目 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(category => category.slug === slug);
}
