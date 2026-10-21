import { useMemo, useState } from "react";
import type { Context } from "@deepseek-ai/cordis";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import { installStyles } from "./client";
import { Lane } from "./ui/lane";
import { Turn, type TurnActions } from "./ui/turn";
import type { ToolTrace, TurnModel } from "./adapter/model";
const tool = (
  id: string,
  kind: ToolTrace["kind"],
  path: string,
  status: ToolTrace["status"] = "done",
): ToolTrace => ({
  id,
  name: kind,
  kind,
  status,
  phase: status === "running" ? "start" : "result",
  activity: {
    path,
    command: kind === "bash" ? path : undefined,
    body:
      kind === "bash"
        ? "✓ 8 tests passed\nTest Files  1 passed (1)\nDuration  1.42s"
        : undefined,
    diffs: [],
  },
});
const sample: TurnModel = {
  id: "demo",
  running: false,
  startedAt: 1770000000000,
  endedAt: 1770000074000,
  interleaved: false,
  items: [
    {
      type: "user",
      id: "u1",
      text: "把 `session-host.ts` 里的重试逻辑抽成独立模块，补上单元测试并跑通。",
      time: 1770000000000,
      images: [],
    },
    {
      type: "assistant",
      id: "a1",
      message: {
        id: "a1",
        active: false,
        thinking:
          "先看现有的重试逻辑在哪里，再决定怎么拆。\n\n需要确认 `retryOnce` 的调用点、现有测试覆盖，以及运行时是否也依赖它。",
        text: "`retryOnce` 有 3 处调用，没有独立测试。开始抽取。",
        tools: [
          tool("r1", "read", "apps/desktop/src/main/session-host.ts"),
          tool("r2", "read", "packages/agent/src/runtime.ts"),
          tool("r3", "read", "apps/desktop/test/session-host.test.ts"),
          tool("b1", "bash", 'rg -n "retryOnce" apps packages'),
        ],
      },
    },
    {
      type: "assistant",
      id: "a2",
      message: {
        id: "a2",
        active: false,
        thinking: "新模块只负责重试策略，不碰会话状态。",
        text: "",
        tools: [
          {
            ...tool("e1", "edit", "apps/desktop/src/main/session-host.ts"),
            activity: {
              path: "apps/desktop/src/main/session-host.ts",
              diffs: [
                {
                  path: "apps/desktop/src/main/session-host.ts",
                  rows: [
                    {
                      kind: "ctx",
                      gutter: "",
                      text: 'import { Session } from "./session";',
                    },
                    {
                      kind: "add",
                      gutter: "",
                      text: 'import { defaultPolicy } from "./retry-policy";',
                    },
                    { kind: "gap", gutter: "", text: "" },
                    {
                      kind: "del",
                      gutter: "",
                      text: "  return retryOnce(() => this.start(), 3);",
                    },
                    {
                      kind: "add",
                      gutter: "",
                      text: "  return withRetry(() => this.start(), defaultPolicy);",
                    },
                  ],
                },
              ],
            },
          },
          tool("w1", "write", "apps/desktop/src/main/retry-policy.ts"),
          {
            ...tool("todo", "other", ""),
            name: "todo_write",
            activity: {
              diffs: [],
              plan: [
                { text: "抽取重试策略", status: "completed" },
                { text: "补充单元测试", status: "completed" },
                { text: "运行测试并检查变更", status: "in_progress" },
              ],
            },
          },
          {
            ...tool("agent", "other", ""),
            name: "subagent",
            activity: {
              diffs: [],
              agent: {
                description: "检查运行时重试调用",
                prompt: "检查 runtime.ts 中的重试调用，并给出兼容性建议。",
              },
            },
          },
          tool("b2", "bash", "pnpm test -- retry-policy"),
          {
            ...tool("b3", "bash", "pnpm lint", "error"),
            activity: {
              command: "pnpm lint",
              body: "ESLint: unused import detected",
              diffs: [],
            },
          },
        ],
      },
    },
    {
      type: "assistant",
      id: "a3",
      message: {
        id: "a3",
        active: false,
        thinking: "",
        tools: [],
        text: "已抽取重试策略模块，并补充单元测试。\n\n- 保留原有重试次数与退避行为。\n- **8 项测试通过**。\n\n`session-host.ts` 现在通过统一策略执行重试。",
      },
    },
  ],
};
export const inject = ["slots"];
export function apply(ctx: Context) {
  installStyles(ctx);
  function Preview() {
    const [notice, setNotice] = useState(""),
      [model, setModel] = useState(sample);
    const actions = useMemo<TurnActions>(
      () => ({
        openFile: (p) => setNotice(`开发预览：${p}`),
        openAgent: (id) => setNotice(id),
        fork: async () => {},
        agents: new Map(),
      }),
      [],
    );
    return (
      <Lane
        identity="preview"
        header={
          <div className="lane-notice">
            固定数据开发预览 ·{" "}
            <button
              type="button"
              onClick={() =>
                setModel((v) => ({
                  ...v,
                  running: !v.running,
                  startedAt: Date.now(),
                }))
              }
            >
              切换运行状态
            </button>
            {notice && <span role="status"> · {notice}</span>}
          </div>
        }
      >
        <Turn model={model} actions={actions} initialOpen />
      </Lane>
    );
  }
  ctx.slots.inject("conversation.view", () =>
    ctx.slots.register(
      {
        name: "conversation.view",
        id: "compact",
        order: 10,
        label: () => "紧凑预览",
      },
      Preview,
    ),
  );
}
