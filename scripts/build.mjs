import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
const external = [
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "@deepseek-ai/cordis",
  "@deepseek-ai/dsh-client-store",
  "@deepseek-ai/dsh-client-ui-slots",
  "@deepseek-ai/dsh-client-ui-primitives",
];
await build({
  entryPoints: ["src/index.ts"],
  outdir: "lib",
  format: "esm",
  platform: "node",
});
for (const [entry, outdir, id] of [
  ["src/client.tsx", "lib", "dsh-compact-lane"],
  ["src/preview.tsx", "dev/lib", "dsh-compact-lane-preview"],
]) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: "cjs",
    platform: "browser",
    target: "es2022",
    external,
    loader: { ".css": "text" },
    write: false,
    jsx: "automatic",
  });
  await mkdir(outdir, { recursive: true });
  await writeFile(
    `${outdir}/client.js`,
    `window.__ModuleLoader__.load({id:${JSON.stringify(id)},factory:(require)=>{var module={exports:{}};var exports=module.exports;\n${result.outputFiles[0].text}\nreturn module.exports;}});\n`,
  );
}
await writeFile("dev/lib/index.js", "export function apply() {}\n");
