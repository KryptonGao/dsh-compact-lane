// Writes only .dev-home through the installed DSH persistence API. No provider or key.
import { createRequire } from "node:module";
import { realpathSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
const bin = realpathSync(
  execFileSync("which", ["dsh"], { encoding: "utf8" }).trim(),
);
const require = createRequire(bin);
const { Context } = require("@deepseek-ai/cordis");
const Persistence = require("@deepseek-ai/dsh-session-persistence-jsonl");
const {
  SessionId,
  SESSION_FORMAT_VERSION,
} = require("@deepseek-ai/dsh-session");
const long = process.argv.includes("--long");
const ctx = new Context(),
  id = SessionId(long ? "compact-lane-pagination" : "compact-lane-recording"),
  cwd = resolve("dev/workspace"),
  start = Date.now() - (long ? 1000000 : 74000);
mkdirSync(resolve(cwd, "src"), { recursive: true });
writeFileSync(
  resolve(cwd, "src/session-host.ts"),
  "export const retryCount = 4;\nconst delay = 200;\n",
);
writeFileSync(resolve(cwd, "src/retry.ts"), "export const retries = 4;\n");
writeFileSync(resolve(cwd, "src/runtime.ts"), "// Runtime fixture\n");
await ctx.plugin(Persistence, { root: resolve(".dev-home/sessions") });
const events = [];
const push = (type, data, surface = false) =>
  events.push({
    type,
    data,
    seq: events.length,
    time: start + events.length * 1200,
    ...(surface ? { surfaceOp: "append" } : {}),
  });
push("turn/start", { turn: 1 });
push("step/start", { turn: 1, step: 1 });
push(
  "user/message",
  {
    id: "user-1",
    role: "user",
    source: { kind: "user" },
    content: [{ type: "text", text: "检查重试逻辑，更新策略并运行测试。" }],
  },
  true,
);
const calls = [
  [
    "r1",
    "read",
    { file_path: "src/session-host.ts" },
    "export const retryCount = 3;",
    { path: "src/session-host.ts" },
  ],
  [
    "r2",
    "read",
    { file_path: "src/runtime.ts" },
    "Runtime source",
    { path: "src/runtime.ts" },
  ],
  [
    "e1",
    "edit",
    { file_path: "src/session-host.ts", old_string: "3", new_string: "4" },
    "Updated",
    {
      path: "src/session-host.ts",
      diffs: [
        {
          path: "src/session-host.ts",
          oldText: "export const retryCount = 3;\n",
          newText: "export const retryCount = 4;\n",
        },
        {
          path: "src/session-host.ts",
          oldText: "const delay = 100;\n",
          newText: "const delay = 200;\n",
        },
      ],
    },
  ],
  [
    "w1",
    "write",
    { file_path: "src/retry.ts", content: "export const retries = 4;" },
    "Created",
    { path: "src/retry.ts", operation: "create", diffs: [] },
  ],
  [
    "b1",
    "bash",
    { command: "pnpm test -- retry" },
    "✓ 8 tests passed\nTest Files 1 passed (1)\nDuration 1.42s",
    { cwd },
  ],
  [
    "todo",
    "todo_write",
    {
      todos: [
        { content: "检查调用点", status: "completed" },
        { content: "更新策略", status: "completed" },
        { content: "运行测试", status: "completed" },
      ],
    },
    "Updated checklist",
    {},
  ],
];
push(
  "assistant/message",
  {
    turn: 1,
    step: 1,
    message: {
      id: "assistant-1",
      role: "assistant",
      source: { kind: "model", provider: "recording", model: "fixture" },
      content: [
        { type: "reasoning", text: "先检查调用点，再更新策略并验证。" },
        ...calls.map(([id, name, args]) => ({
          type: "tool-call",
          id,
          name,
          arguments: JSON.stringify(args),
        })),
      ],
    },
    stream: [],
  },
  true,
);
for (const [callId, name, args, text, meta] of calls) {
  push("tool/call", {
    turn: 1,
    step: 1,
    callId,
    name,
    arguments: JSON.stringify(args),
  });
  push(
    "tool/result",
    {
      turn: 1,
      step: 1,
      message: {
        id: `result-${callId}`,
        role: "tool",
        source: { kind: "tool", callId },
        toolCallId: callId,
        content: [{ type: "text", text }],
        isError: false,
      },
      meta,
    },
    true,
  );
}
push("step/end", { turn: 1, step: 1 });
push("step/start", { turn: 1, step: 2 });
push(
  "assistant/message",
  {
    turn: 1,
    step: 2,
    message: {
      id: "assistant-2",
      role: "assistant",
      source: { kind: "model", provider: "recording", model: "fixture" },
      content: [
        {
          type: "text",
          text: "已更新重试策略，**8 项测试通过**。\n\n- 检查了两个文件。\n- 修改了 `src/session-host.ts`。\n- 创建了 `src/retry.ts`。",
        },
      ],
    },
    stream: [],
  },
  true,
);
push("step/end", { turn: 1, step: 2 });
push("turn/end", { turn: 1, reason: { kind: "completed" } });
if (long) {
  events.length = 0;
  for (let turn = 1; turn <= 100; turn++) {
    push("turn/start", { turn });
    push("step/start", { turn, step: 1 });
    push(
      "user/message",
      {
        id: `u-${turn}`,
        role: "user",
        source: { kind: "user" },
        content: [{ type: "text", text: `分页验证第 ${turn} 轮` }],
      },
      true,
    );
    push(
      "assistant/message",
      {
        turn,
        step: 1,
        message: {
          id: `a-${turn}`,
          role: "assistant",
          source: { kind: "model", provider: "recording", model: "fixture" },
          content: [
            {
              type: "text",
              text: `第 ${turn} 轮已完成。这是一条用于验证分页与滚动位置的历史消息。`,
            },
          ],
        },
        stream: [],
      },
      true,
    );
    push("step/end", { turn, step: 1 });
    push("turn/end", { turn, reason: { kind: "completed" } });
  }
}
try {
  const h = await ctx.sessionPersistence.create({
    id,
    version: SESSION_FORMAT_VERSION,
    createdAt: start,
    cwd,
    delegationDepth: 0,
    isSeeded: false,
  });
  await h.append(events);
  await h.close();
  process.stdout.write(`Seeded ${id}\n`);
} finally {
  await ctx.fiber.dispose();
}
