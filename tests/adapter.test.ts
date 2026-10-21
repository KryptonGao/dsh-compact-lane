import { describe, expect, it } from "vitest";
import { PartialArguments } from "@deepseek-ai/dsh-util-values";
import type {
  ToolCallBlock,
  ChatSnapshot,
  ChatNode,
} from "@deepseek-ai/dsh-client-ui-chat/client";
import { adaptTool, appliedDiffs, toolKind } from "../src/adapter/tools";
import {
  compactSummaryParts,
  splitToolRuns,
  fileChanges,
  collapseDiffContext,
} from "../src/adapter/model";
import { adaptTurn } from "../src/adapter/turn";
import { turnSource } from "../src/adapter/source";
function call(
  id = "c1",
  name = "read",
  args: object = { file_path: "a.ts" },
): ToolCallBlock {
  return {
    phase: "start",
    callId: id,
    name,
    turn: 1,
    step: 1,
    time: 10,
    args: PartialArguments.fromObject(args),
    argsRaw: JSON.stringify(args),
    subCalls: [],
  } as ToolCallBlock;
}
function result(name: string, meta?: unknown, isError = false): ToolCallBlock {
  return {
    kind: "tool-result",
    seq: 4,
    time: 20,
    callId: "c1",
    name,
    args: PartialArguments.fromObject({
      file_path: "a.ts",
      content: "DO NOT INVENT DIFF",
    }),
    call: null,
    callTime: 10,
    content: [{ type: "text", text: "result" }],
    isError,
    meta,
    subCalls: [],
  } as ToolCallBlock;
}
describe("tool evidence", () => {
  it("maps only approved names", () => {
    expect(
      [
        "bash",
        "pwsh",
        "read",
        "edit",
        "write",
        "read_image",
        "terminal_exec",
        "str_replace_editor",
        "run_code",
        "mcp_x",
      ].map(toolKind),
    ).toEqual([
      "bash",
      "bash",
      "read",
      "edit",
      "write",
      "other",
      "other",
      "other",
      "other",
      "other",
    ]);
  });
  it("keeps write creation, overwrite and unknown distinct without inventing diffs", () => {
    expect(
      adaptTool(result("write", { operation: "create", diffs: [] })),
    ).toMatchObject({
      kind: "write",
      neutralWrite: false,
      activity: { diffs: [] },
    });
    expect(adaptTool(result("write", { operation: "update" })).kind).toBe(
      "edit",
    );
    expect(adaptTool(result("write")).neutralWrite).toBe(true);
  });
  it("uses successful contextual fragments with blank gutters and no failed statistics", () => {
    const meta = {
      diffs: [
        { path: "a.ts", oldText: "same\nold\n", newText: "same\nnew\n" },
        { path: "a.ts", oldText: null, newText: "tail\n" },
      ],
    };
    const t = adaptTool(result("edit", meta));
    expect(t.activity.diffs).toHaveLength(1);
    expect(t.activity.diffs[0].rows.map((r) => r.kind)).toEqual([
      "ctx",
      "del",
      "add",
      "gap",
      "add",
    ]);
    expect(
      t.activity.diffs.flatMap((d) => d.rows).every((r) => r.gutter === ""),
    ).toBe(true);
    expect(fileChanges([t])).toEqual([{ path: "a.ts", added: 2, removed: 1 }]);
    expect(fileChanges([adaptTool(result("edit", meta, true))])).toEqual([]);
    expect(
      appliedDiffs({ diffs: [{ path: "a", oldText: 42, newText: "x" }] }),
    ).toEqual([]);
  });
  it("combines same-file fragments in order, preserves file boundaries and skips unchanged fragments", () => {
    const diffs = appliedDiffs({
      diffs: [
        { path: "src/a.ts", oldText: "old\n", newText: "new\n" },
        { path: "b.ts", oldText: "before\n", newText: "after\n" },
        { path: "src/a.ts", oldText: "same\n", newText: "same\n" },
        { path: "src\\a.ts", oldText: "gone\n", newText: "" },
      ],
    });
    expect(diffs.map((d) => d.path)).toEqual(["src/a.ts", "b.ts"]);
    expect(diffs[0].rows.map((r) => [r.kind, r.text])).toEqual([
      ["del", "old"],
      ["add", "new"],
      ["gap", ""],
      ["del", "gone"],
    ]);
    expect(diffs[1].rows.map((r) => r.kind)).toEqual(["del", "add"]);
  });
  it("reads in-place argument updates and preserves interrupted lifecycle", () => {
    const args = new PartialArguments();
    args.append('{"command":"pn');
    const root = { ...call("c1", "bash"), args };
    expect(adaptTool(root).activity.command).toBe("pn");
    args.append('pm test"}');
    expect(adaptTool(root).activity.command).toBe("pnpm test");
    expect(adaptTool(root, true).status).toBe("interrupted");
  });
  it("deduplicates paths by kind, counts each command and lets other interrupt", () => {
    const ts = [
      adaptTool(call()),
      adaptTool(call("c2", "read", { file_path: "a.ts" })),
      adaptTool(call("c3", "bash")),
      adaptTool(call("c4", "todo_write")),
      adaptTool(call("c5", "read")),
    ];
    expect(splitToolRuns(ts).map((r) => r.length)).toEqual([3, 1, 1]);
    expect(compactSummaryParts(ts.slice(0, 3))).toEqual([
      { kind: "read", neutral: false, count: 1 },
      { kind: "bash", neutral: false, count: 1 },
    ]);
  });
  it("collapses only context between changes", () => {
    const rows = Array.from(
      { length: 9 },
      (_, i) =>
        ({
          kind: i === 0 ? "add" : i === 8 ? "del" : "ctx",
          text: String(i),
          gutter: "",
        }) as const,
    );
    expect(collapseDiffContext(rows).map((r) => r.kind)).toEqual([
      "add",
      "ctx",
      "gap",
      "ctx",
      "del",
    ]);
  });
});
function fixture() {
  const listeners = new Set<() => void>(),
    nodeListeners = new Map<string, Set<() => void>>();
  const nodes = new Map<string, ChatNode>();
  const node = (key: string, kind: string, data: object) =>
    ({
      key,
      kind,
      data,
      anchorSeq: 0,
      target: "chat",
      visibility: "visible",
      location: { kind: "unresolved" },
    }) as ChatNode;
  nodes.set(
    "a1",
    node("a1", "assistant-step", {
      status: "running",
      turn: 1,
      step: 1,
      time: 1,
      blocks: [
        { kind: "tool-call", callId: "c1", name: "read", argsRaw: "{}" },
      ],
    }),
  );
  nodes.set("t1", node("t1", "tool-call", { root: call() }));
  nodes.set(
    "a2",
    node("a2", "assistant-step", {
      status: "running",
      turn: 1,
      step: 2,
      time: 1,
      blocks: [
        { kind: "tool-call", callId: "c2", name: "read", argsRaw: "{}" },
      ],
    }),
  );
  nodes.set("t2", node("t2", "tool-call", { root: call("c2") }));
  const keys = [...nodes.keys()];
  const chat = Object.assign({} as ChatSnapshot, {
    order: keys,
    navigation: { items: () => [] },
    legacy: {} as ChatSnapshot["legacy"],
    locations: { getTurn: () => keys },
    timeline: { turns: new Map([[1, { status: "open" }]]) },
    nodes: {
      get: (key: string) => nodes.get(key),
      source: (key: string) => ({
        getSnapshot: () => nodes.get(key),
        subscribe: (l: () => void) => {
          const ls = nodeListeners.get(key) ?? new Set();
          nodeListeners.set(key, ls);
          ls.add(l);
          return () => {
            ls.delete(l);
          };
        },
      }),
    } as ChatSnapshot["nodes"],
  });
  return {
    chat,
    nodes,
    node,
    listeners,
    nodeListeners,
    source: {
      getSnapshot: () => chat,
      subscribe: (l: () => void) => {
        listeners.add(l);
        return () => listeners.delete(l);
      },
    },
  };
}
describe("message ownership and subscriptions", () => {
  it("never groups across assistant messages", () => {
    const f = fixture(),
      m = adaptTurn(f.chat, 1);
    expect(
      m.items.flatMap((i) =>
        i.type === "assistant" ? [i.message.tools.map((t) => t.id)] : [],
      ),
    ).toEqual([["c1"], ["c2"]]);
    expect(m.startedAt).toBeUndefined();
    expect(m.endedAt).toBeUndefined();
  });
  it("updates from node notifications even when message order stays identical and disposes", () => {
    const f = fixture(),
      source = turnSource(f.source, 1);
    let updates = 0;
    const stop = source.subscribe(() => updates++);
    const before = source.getSnapshot();
    f.nodes.set("t1", f.node("t1", "tool-call", { root: result("read") }));
    f.nodeListeners.get("t1")?.forEach((l) => l());
    expect(source.getSnapshot()).not.toBe(before);
    expect(source.getSnapshot().items[0]).toMatchObject({
      message: { tools: [{ status: "done" }] },
    });
    expect(updates).toBeGreaterThan(1);
    stop();
    expect(f.listeners.size).toBe(0);
    expect([...f.nodeListeners.values()].every((s) => s.size === 0)).toBe(true);
  });
});
