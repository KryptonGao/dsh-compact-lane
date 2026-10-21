import { diffLines } from "diff";
import type { ToolCallBlock } from "@deepseek-ai/dsh-client-ui-chat/client";
import type { DiffRow, FileDiff, ToolKind, ToolTrace } from "./model";

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
export function toolKind(name: string): ToolKind {
  if (name === "pwsh" || name === "bash") return "bash";
  return name === "read" || name === "edit" || name === "write"
    ? name
    : "other";
}
/** One card per file; retain unrecorded intervals as gaps, never infer offsets. */
export function appliedDiffs(meta: unknown): FileDiff[] {
  const diffs = record(meta)?.diffs;
  if (!Array.isArray(diffs)) return [];
  const files = new Map<string, FileDiff>();
  for (const value of diffs) {
    const d = record(value);
    if (
      !d ||
      typeof d.path !== "string" ||
      typeof d.newText !== "string" ||
      !(d.oldText === null || typeof d.oldText === "string")
    )
      continue;
    const rows: DiffRow[] = diffLines(d.oldText ?? "", d.newText).flatMap(
      (part) => {
        const lines = part.value.split("\n");
        if (lines.at(-1) === "") lines.pop();
        return lines.map((text) => ({
          kind: part.added ? "add" : part.removed ? "del" : "ctx",
          gutter: "",
          text,
        }));
      },
    );
    if (!rows.some((r) => r.kind === "add" || r.kind === "del")) continue;
    const key = d.path.replaceAll("\\", "/");
    const file = files.get(key);
    if (file) file.rows.push({ kind: "gap", gutter: "", text: "" }, ...rows);
    else files.set(key, { path: d.path, rows });
  }
  return [...files.values()];
}
export function adaptTool(root: ToolCallBlock, interrupted = false): ToolTrace {
  const settled = "kind" in root;
  const meta = settled ? record(root.meta) : undefined;
  const name = root.name || "未知工具";
  let kind = toolKind(name);
  const neutralWrite =
    name === "write" &&
    meta?.operation !== "create" &&
    meta?.operation !== "update";
  if (name === "write" && meta?.operation === "update") kind = "edit";
  // Read the lazy view on every node notification, including in-place streamed arguments.
  const path =
    typeof meta?.path === "string" ? meta.path : root.args.text("file_path");
  const body = settled
    ? [
        root.content
          .map((b) => (b.type === "text" ? b.text : JSON.stringify(b)))
          .join("\n"),
        root.isError ? root.error?.reason : undefined,
      ]
        .filter(Boolean)
        .join("\n")
    : undefined;
  const todos = root.args.value("todos");
  const plan =
    name === "todo_write" && Array.isArray(todos)
      ? todos.flatMap((todo) => {
          const item = record(todo);
          if (
            !item ||
            typeof item.content !== "string" ||
            !["pending", "in_progress", "completed"].includes(
              String(item.status),
            )
          )
            return [];
          return [
            {
              text: item.content,
              status: item.status as "pending" | "in_progress" | "completed",
            },
          ];
        })
      : undefined;
  const candidateId =
    settled && !root.isError
      ? /^started subagent ([^\s]+)$/.exec(body?.trim() ?? "")?.[1]
      : undefined;
  return {
    id: root.callId,
    name,
    kind,
    neutralWrite,
    phase: settled ? "result" : root.phase,
    status: settled
      ? root.isError
        ? "error"
        : "done"
      : interrupted
        ? "interrupted"
        : "running",
    activity: {
      command: root.args.text("command"),
      path,
      body,
      diffs: settled && !root.isError ? appliedDiffs(root.meta) : [],
      plan,
      agent:
        name === "subagent" || name === "subagent_fork"
          ? {
              description: root.args.text("description") ?? name,
              prompt: root.args.text("prompt") ?? "",
              candidateId,
            }
          : undefined,
    },
  };
}
