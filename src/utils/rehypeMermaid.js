/**
 * Rehype plugin that turns a ```mermaid fenced code block into a placeholder
 * element the browser can render with the Mermaid client bundle.
 *
 * Astro would otherwise hand the block to Shiki, which paints it as regular
 * source code. Running this plugin first means the diagram source never reaches
 * Shiki, and the post's copy-code button never attaches to a diagram.
 *
 * Output: `<div class="mermaid-block" data-mermaid><pre class="mermaid-source">
 * ...source...</pre></div>`. The source stays in a `<pre>` so readers still see
 * readable code when JavaScript is disabled.
 */
export const rehypeMermaid = () => tree => {
  const walk = node => {
    if (!node.children) return;

    node.children = node.children.map(child => {
      const diagram = child.type === "element" ? toDiagram(child) : null;
      if (diagram) return diagram;
      walk(child);
      return child;
    });
  };

  walk(tree);
};

function toDiagram(pre) {
  if (pre.tagName !== "pre") return null;

  const code = pre.children?.find(
    child => child.type === "element" && child.tagName === "code"
  );
  if (!code) return null;

  const classNames = (properties = {}) => {
    const value = properties.className;
    return Array.isArray(value) ? value : [];
  };
  // Depending on where in the pipeline this runs, Shiki may already have
  // tagged the block with `data-language` / `astro-code`.
  const isMermaid =
    classNames(code.properties).includes("language-mermaid") ||
    classNames(pre.properties).includes("language-mermaid") ||
    pre.properties?.dataLanguage === "mermaid";
  if (!isMermaid) return null;

  const source = textContent(code).replace(/\n+$/, "");

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["mermaid-block"],
      dataMermaid: "",
    },
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: { className: ["mermaid-source"] },
        children: [{ type: "text", value: source }],
      },
    ],
  };
}

function textContent(node) {
  if (node.type === "text") return node.value;
  if (!node.children) return "";
  return node.children.map(textContent).join("");
}
