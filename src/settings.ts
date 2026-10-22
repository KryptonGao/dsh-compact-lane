/** Settings namespace shared by the Host Config and the browser settings page. */

/** Profile entry id in `cordis.patch.yml`; the Host serves the form under it. */
export const NAMESPACE = "compact-lane";

/** `folded` keeps the process row and tool groups closed; `unfolded` opens them by default. */
export type FoldMode = "folded" | "unfolded";

export const FOLD_MODES: readonly FoldMode[] = ["folded", "unfolded"];

export function normalizeFoldMode(value: unknown): FoldMode {
  return value === "unfolded" ? "unfolded" : "folded";
}

/** Whether each tool kind's leading icon uses its own color; a missing or invalid value keeps the default. */
export function normalizeIconColor(value: unknown): boolean {
  return value !== false;
}
