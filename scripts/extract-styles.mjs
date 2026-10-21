// Read-only extraction. Run explicitly when updating the Vela reference.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
const source = await readFile(
  process.argv[2] ??
    "/Users/chenkaigao/Documents/Program/VelaHarness/docs/compact-chat-ui/compact-chat-ui.html",
  "utf8",
);
const css = source.match(
  /^<style id="vela-extracted">\n([\s\S]*?)<\/style>/m,
)?.[1];
if (!css) throw new Error("Missing Vela extracted style");
const root = "[data-dsh-compact-lane]";
const ast = postcss.parse(css);
ast.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && /keyframes$/.test(rule.parent.name))
    return;
  rule.selector = selectorParser((selectors) => {
    selectors.each((selector) => {
      const s = selector.toString().trim();
      if (s === ":root" || s === '[data-scheme="light"]') {
        selector.replaceWith(selectorParser().astSync(root).first);
      } else {
        const scoped = s.startsWith('[data-scheme="light"] ')
          ? s.replace('[data-scheme="light"]', root + '[data-scheme="light"]')
          : /^(html|body)(\s|$)/.test(s)
            ? s.replace(/^(html|body)/, root)
            : `${root} ${s}`;
        selector.replaceWith(selectorParser().astSync(scoped).first);
      }
    });
  }).processSync(rule.selector);
});
const demo = postcss.parse(
  source.match(/^<style id="demo-chrome">\n([\s\S]*?)<\/style>/m)[1],
);
const dotRules = demo.nodes.filter(
  (n) =>
    (n.type === "rule" && n.selector.startsWith(".dot-loader")) ||
    (n.type === "atrule" && n.name === "keyframes" && n.params === "dot-wave"),
);
for (const n of dotRules)
  if (n.type === "rule") n.selector = root + " " + n.selector;
const dots = dotRules.map((n) => n.toString()).join("\n");
await mkdir("src/styles", { recursive: true });
await writeFile(
  "src/styles/vela-compact.css",
  `/* Vela compact-chat-ui.html: vela-extracted. Declarations preserved; selectors scoped.\n * Regenerate: node scripts/extract-styles.mjs [reference.html]\n */\n${ast.toString()}\n${dots}\n`,
);
