/** Host entry: declares the settings form; all other contributions belong to the browser plugin. */
import type {} from "@deepseek-ai/dsh-settings";
import type { Context, Volatile } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import type { FoldMode } from "./settings";

export interface Config {
  /** Whether the process row and tool groups start open. */
  foldMode: Volatile<FoldMode>;
}

export const Config = z.object({
  foldMode: z
    .union([z.const("folded"), z.const("unfolded")])
    .default("folded")
    .volatile(),
});

/** The plugin ships its own settings page, so the generated form stays off. */
export function apply(ctx: Context): void {
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}
