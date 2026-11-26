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
    name: "电力电子技术",
    description: "电力电子变换器拓扑、控制策略、仿真分析与实践。",
  },
  {
    slug: "thermal-engineering",
    name: "动力工程及工程热物理",
    description: "传热传质分析与实验、电力电子器件及其热管理。",
  },
  {
    slug: "meteorology",
    name: "气象学",
    description: "经典教材学习、热带气旋与大气环流分析。",
  },
  {
    slug: "playground",
    name: "杂项",
    description: "不成文的想法。",
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
