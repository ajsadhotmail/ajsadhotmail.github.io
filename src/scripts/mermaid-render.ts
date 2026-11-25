/**
 * Client-side Mermaid renderer.
 *
 * The rehype plugin (`src/utils/rehypeMermaid.ts`) turns each ```mermaid fence
 * into `<div class="mermaid-block" data-mermaid><pre class="mermaid-source">…`
 * at build time. This module upgrades those placeholders to SVG diagrams in the
 * browser, which keeps diagrams out of the build (no headless browser needed on
 * CI) and lets them follow the light/dark theme switch.
 *
 * The Mermaid bundle is loaded lazily: pages without diagrams never download it.
 */
import type { MermaidConfig } from "mermaid";

const THEME_SOURCES: Record<"light" | "dark", Pick<MermaidConfig, "theme">> = {
  light: { theme: "neutral" },
  dark: { theme: "dark" },
};

const FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';

let mermaidModule: typeof import("mermaid").default | null = null;
let initializedTheme: "light" | "dark" | null = null;
let rendering = false;

/** Diagram element → theme it was last rendered with. */
const renderedTheme = new WeakMap<HTMLElement, "light" | "dark">();

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function diagramSource(host: HTMLElement): string {
  // The source is stashed on the element the first time we render, because
  // Mermaid replaces the element's children with an <svg>.
  const cached = host.dataset.mermaidSrc;
  if (cached) return cached;

  const sourceNode = host.querySelector(".mermaid-source");
  const source = (sourceNode?.textContent ?? host.textContent ?? "").trim();
  if (source) host.dataset.mermaidSrc = source;
  return source;
}

async function loadMermaid() {
  if (!mermaidModule) {
    const mod = await import("mermaid");
    mermaidModule = mod.default;
  }
  return mermaidModule;
}

async function renderDiagrams() {
  const hosts = Array.from(
    document.querySelectorAll<HTMLElement>("[data-mermaid]")
  );
  if (!hosts.length) return;

  const theme = currentTheme();
  const pending = hosts.filter(host => {
    if (!diagramSource(host)) return false;
    return renderedTheme.get(host) !== theme;
  });
  if (!pending.length) return;
  if (rendering) return;

  rendering = true;
  try {
    const mermaid = await loadMermaid();

    if (initializedTheme !== theme) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        ...THEME_SOURCES[theme],
        fontFamily: FONT_FAMILY,
        // 按自然尺寸渲染：缩放到容器宽度会让宽图的字号小到看不清。
        // 超宽图表由 .mermaid-block 横向滚动。
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          useMaxWidth: false,
          // 默认间距偏松，纵向流程图会拉得很长
          nodeSpacing: 30,
          rankSpacing: 34,
        },
        sequence: { useMaxWidth: false },
        class: { useMaxWidth: false },
        state: { useMaxWidth: false },
        er: { useMaxWidth: false },
        pie: { useMaxWidth: false },
        gantt: { useMaxWidth: false },
        journey: { useMaxWidth: false },
        timeline: { useMaxWidth: false },
        mindmap: { useMaxWidth: false },
        gitGraph: { useMaxWidth: false },
        themeVariables: {
          fontFamily: FONT_FAMILY,
          fontSize: "14px",
        },
      });
      initializedTheme = theme;
    }

    // Put the saved source back so a theme switch re-renders cleanly.
    for (const host of pending) {
      host.removeAttribute("data-processed");
      host.innerHTML = "";
      host.textContent = diagramSource(host);
    }

    await mermaid.run({ nodes: pending, suppressErrors: true });

    for (const host of pending) {
      renderedTheme.set(host, theme);
      host.classList.add("is-rendered");
    }

    // 渲染完成后再判断是否超出容器：超宽图表横向滚动，并给出提示。
    requestAnimationFrame(() => {
      for (const host of pending) markOverflow(host);
    });
  } finally {
    rendering = false;
  }
}

function scheduleRender() {
  // Let the browser paint the page before doing diagram layout work.
  requestAnimationFrame(() => {
    renderDiagrams().catch(error => {
      // 图表渲染失败不应阻塞页面，把源码留在页面上并记录原因
      // eslint-disable-next-line no-console
      console.error("[mermaid] failed to render diagrams", error);
    });
  });
}

const OVERFLOW_HINT = "图表较宽，可左右滑动查看";

/** 标记超宽图表：显示滚动提示，并把它滚动到中间位置 */
function markOverflow(host: HTMLElement) {
  const overflows = host.scrollWidth > host.clientWidth + 8;
  host.classList.toggle("is-scrollable", overflows);

  const next = host.nextElementSibling;
  const existingHint =
    next instanceof HTMLElement && next.classList.contains("mermaid-hint")
      ? next
      : null;

  if (!overflows) {
    existingHint?.remove();
    return;
  }

  host.scrollLeft = (host.scrollWidth - host.clientWidth) / 2;

  if (!existingHint) {
    const hint = document.createElement("p");
    hint.className = "mermaid-hint";
    hint.textContent = OVERFLOW_HINT;
    host.after(hint);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleRender, { once: true });
} else {
  scheduleRender();
}

document.addEventListener("astro:page-load", scheduleRender);

// Follow the site's light/dark switch.
new MutationObserver(mutations => {
  if (mutations.some(m => m.attributeName === "data-theme")) scheduleRender();
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});
