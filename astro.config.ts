import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeCallouts from "rehype-callouts";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { rehypeTableWrapper } from "./src/utils/rehypeTableWrapper";
import {
  inlineTocDeprecation,
  rehypeInlineToc,
} from "./src/utils/rehypeInlineToc";
import { rehypeMermaid } from "./src/utils/rehypeMermaid";
import config from "./astro-paper.config";

/**
 * Deployment path (Astro `base`).
 *
 * GitHub Pages serves a *project* site from `https://<user>.github.io/<repo>/`,
 * so such a site must be built with that sub-path as its base. The deploy
 * workflow in `.github/workflows/deploy.yml` sets `BASE_PATH` for you and keeps
 * it "/" for `<user>.github.io` repositories. Local builds default to "/".
 *
 * Override manually with e.g. `BASE_PATH=/my-blog pnpm build`.
 */
const base = (() => {
  const raw = (process.env.BASE_PATH ?? "/").trim();
  if (!raw || raw === "/") return "/";
  return `/${raw.replace(/^\/+/, "").replace(/\/+$/, "")}`;
})();

/** Absolute origin used for canonical URLs, sitemap and RSS. */
const site = (process.env.SITE_URL?.trim() || config.site.url).trim();

export default defineConfig({
  site,
  base,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !/\/archives\/?$/.test(page),
    }),
    inlineTocDeprecation(),
  ],
  i18n: {
    // The blog ships a Chinese UI. Add another file under src/i18n/lang/ and
    // list its locale here to switch or add a language.
    locales: ["zh", "en"],
    defaultLocale: "zh",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    // Math: `$...$` inline and `$$...$$` block equations, rendered to HTML at
    // build time by KaTeX (no client-side JS, no FOUC).
    //
    // Deprecated: the theme no longer uses remark-toc or remark-collapse. They
    // stay in package.json so a customised config importing them still builds,
    // and are removed in v8.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        // Turn ```mermaid blocks into client-rendered diagram hosts before
        // any other plugin sees them.
        rehypeMermaid,
        rehypeHeadingIds,
        rehypeKatex,
        rehypeInlineToc,
        rehypeCallouts,
        rehypeTableWrapper,
      ],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // Optional: self-host a web font with the Astro Fonts API, e.g. to keep the
  // theme's original "Google Sans Code" body font. The blog uses a system font
  // stack (see `--font-app` in src/styles/theme.css) so Chinese text renders
  // sharply and the build needs no network access.
  //
  // fonts: [
  //   {
  //     name: "Google Sans Code",
  //     cssVariable: "--font-body",
  //     provider: fontProviders.google(),
  //     fallbacks: ["monospace"],
  //     weights: [300, 400, 500, 600, 700],
  //     styles: ["normal", "italic"],
  //   },
  // ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
