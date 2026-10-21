import type { ImageAttachmentRef } from "@deepseek-ai/dsh-attachment";
export type ToolKind = "bash" | "read" | "edit" | "write" | "other";
export type DiffRow = {
  kind: "add" | "del" | "ctx" | "gap";
  gutter: string;
  text: string;
};
export interface FileDiff {
  path: string;
  rows: DiffRow[];
}
export interface ToolTrace {
  id: string;
  name: string;
  kind: ToolKind;
  status: "running" | "done" | "error" | "interrupted";
  phase: "preparing" | "start" | "result";
  neutralWrite?: boolean;
  activity: {
    command?: string;
    path?: string;
    body?: string;
    diffs: FileDiff[];
    plan?: { text: string; status: "pending" | "in_progress" | "completed" }[];
    agent?: { description: string; prompt: string; candidateId?: string };
  };
}
export interface AssistantMessage {
  id: string;
  thinking: string;
  text: string;
  tools: ToolTrace[];
  active: boolean;
}
export type LaneItem =
  | {
      type: "user";
      id: string;
      text: string;
      time?: number;
      images: { id: string; attachment: ImageAttachmentRef }[];
      files?: { name: string; bytes: number }[];
    }
  | { type: "assistant"; id: string; message: AssistantMessage }
  | { type: "notice"; id: string; text: string };
export interface TurnModel {
  id: string;
  items: LaneItem[];
  running: boolean;
  startedAt?: number;
  endedAt?: number;
  forkSeq?: number;
  interleaved: boolean;
}

export function splitPath(path: string) {
  const n = path.replaceAll("\\", "/"),
    i = n.lastIndexOf("/");
  return i <= 0
    ? { name: path, dir: "" }
    : { name: n.slice(i + 1), dir: n.slice(0, i) };
}
export function splitToolRuns(tools: ToolTrace[]): ToolTrace[][] {
  const runs: ToolTrace[][] = [];
  for (const t of tools) {
    const last = runs.at(-1);
    if (t.kind !== "other" && last?.[0].kind !== "other" && last) last.push(t);
    else runs.push([t]);
  }
  return runs;
}
export function compactSummaryParts(tools: ToolTrace[]) {
  const counts = new Map<
      string,
      { kind: ToolKind; neutral: boolean; count: number }
    >(),
    seen = new Set<string>();
  for (const t of tools) {
    if (t.kind === "other") continue;
    const group = t.neutralWrite ? "neutral-write" : t.kind;
    const path = t.activity.path?.trim().replaceAll("\\", "/");
    if (t.kind !== "bash" && path) {
      const key = `${group}:${path}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    const part = counts.get(group) ?? {
      kind: t.kind,
      neutral: !!t.neutralWrite,
      count: 0,
    };
    part.count++;
    counts.set(group, part);
  }
  return [...counts.values()];
}
export function diffStat(rows: DiffRow[]) {
  const added = rows.filter((r) => r.kind === "add").length,
    removed = rows.filter((r) => r.kind === "del").length;
  return added || removed ? { added, removed } : null;
}
export function fileChanges(tools: ToolTrace[]) {
  const files = new Map<
    string,
    { path: string; added: number; removed: number }
  >();
  for (const t of tools) {
    if (t.status !== "done") continue;
    for (const d of t.activity.diffs) {
      const stat = diffStat(d.rows);
      if (!stat) continue;
      const key = d.path.replaceAll("\\", "/");
      const file = files.get(key) ?? { path: d.path, added: 0, removed: 0 };
      file.added += stat.added;
      file.removed += stat.removed;
      files.set(key, file);
    }
  }
  return [...files.values()];
}
export function totalDiffStat(tools: ToolTrace[]) {
  const files = fileChanges(tools);
  return files.length
    ? files.reduce(
        (s, f) => ({
          added: s.added + f.added,
          removed: s.removed + f.removed,
        }),
        { added: 0, removed: 0 },
      )
    : null;
}
export function collapseDiffContext(rows: DiffRow[]): DiffRow[] {
  const out: DiffRow[] = [];
  let before = false,
    i = 0;
  while (i < rows.length) {
    if (rows[i].kind !== "ctx") {
      before ||= rows[i].kind === "add" || rows[i].kind === "del";
      out.push(rows[i++]);
      continue;
    }
    const start = i;
    while (i < rows.length && rows[i].kind === "ctx") i++;
    const context = rows.slice(start, i);
    if (
      before &&
      context.length > 3 &&
      rows.slice(i).some((r) => r.kind === "add" || r.kind === "del")
    )
      out.push(
        context[0],
        { kind: "gap", gutter: "", text: "" },
        context.at(-1)!,
      );
    else out.push(...context);
  }
  return out;
}
export function formatElapsed(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 1) return "不到 1 秒";
  if (s < 60) return `${s} 秒`;
  if (s < 3600) return `${Math.floor(s / 60)} 分 ${s % 60} 秒`;
  return `${Math.floor(s / 3600)} 小时 ${Math.floor((s % 3600) / 60)} 分 ${s % 60} 秒`;
}
