// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Collapse } from "../src/ui/primitives";
import { ToolList } from "../src/ui/tools";
import { Turn, type TurnActions } from "../src/ui/turn";
import type { ToolTrace, TurnModel } from "../src/adapter/model";
import { appliedDiffs } from "../src/adapter/tools";
beforeEach(() =>
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  ),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const actions: TurnActions = {
  openFile: () => {},
  openAgent: () => {},
  fork: async () => {},
  agents: new Map(),
};
const tool: ToolTrace = {
  id: "t1",
  name: "bash",
  kind: "bash",
  status: "running",
  phase: "preparing",
  activity: { command: "pnpm test", diffs: [] },
};
it("renders same-file hunks in one diff card with a gap and combined statistics", () => {
  const edit: ToolTrace = {
    ...tool,
    name: "edit",
    kind: "edit",
    status: "done",
    phase: "result",
    activity: {
      path: "a.ts",
      diffs: appliedDiffs({
        diffs: [
          { path: "a.ts", oldText: "old\n", newText: "new\n" },
          { path: "a.ts", oldText: "before\n", newText: "after\n" },
        ],
      }),
    },
  };
  const view = render(<ToolList tools={[edit]} actions={actions} />);
  fireEvent.click(screen.getByRole("button", { name: "展开文件详情" }));
  expect(view.container.querySelectorAll(".compact-diff-card")).toHaveLength(1);
  expect(
    screen.getByRole("separator", { name: "省略的上下文" }),
  ).not.toBeNull();
  const card = view.container.querySelector(".compact-diff-card")!;
  expect(card.querySelector(".compact-diff-card-stat")?.textContent).toBe(
    "+2−2",
  );
  expect(
    [...card.querySelectorAll(".tool-gutter")].map((g) => g.textContent),
  ).toEqual(["−", "+", "−", "+"]);
});
it("mounts a disclosure lazily and keeps its DOM while inert", () => {
  const view = render(
    <Collapse open={false}>
      <button>详情</button>
    </Collapse>,
  );
  expect(screen.queryByText("详情")).toBeNull();
  view.rerender(
    <Collapse open>
      <button>详情</button>
    </Collapse>,
  );
  const button = screen.getByText("详情");
  view.rerender(
    <Collapse open={false}>
      <button>详情</button>
    </Collapse>,
  );
  expect(button.closest("[inert]")).not.toBeNull();
  view.rerender(
    <Collapse open>
      <button>详情</button>
    </Collapse>,
  );
  expect(screen.getByText("详情")).toBe(button);
});
it("retains a single tool row when the message grows into a folded group", () => {
  const view = render(<ToolList tools={[tool]} actions={actions} />);
  const row = view.container.querySelector('[data-tool="t1"]');
  view.rerender(
    <ToolList
      tools={[
        { ...tool, phase: "start" },
        { ...tool, id: "t2" },
      ]}
      actions={actions}
    />,
  );
  expect(view.container.querySelector('[data-tool="t1"]')).toBe(row);
  expect(
    row?.closest(".tool-compact-group")?.classList.contains("no-enter"),
  ).toBe(true);
  expect(row?.closest("[inert]")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /已运行 2 条命令/ }));
  expect(row?.closest("[inert]")).toBeNull();
});
it("auto-closes thinking and the completed process without remounting tool nodes", () => {
  const model: TurnModel = {
    id: "1",
    running: true,
    startedAt: 1,
    interleaved: false,
    items: [
      {
        type: "assistant",
        id: "a",
        message: {
          id: "a",
          active: true,
          thinking: "检查调用点",
          text: "",
          tools: [],
        },
      },
    ],
  };
  const view = render(<Turn model={model} actions={actions} />);
  expect(
    screen
      .getByRole("button", { name: /思考中/ })
      .getAttribute("aria-expanded"),
  ).toBe("true");
  const next: TurnModel = {
    ...model,
    items: [
      {
        type: "assistant",
        id: "a",
        message: {
          id: "a",
          active: true,
          thinking: "检查调用点",
          text: "",
          tools: [tool],
        },
      },
    ],
  };
  view.rerender(<Turn model={next} actions={actions} />);
  expect(
    screen.getByRole("button", { name: "思考" }).getAttribute("aria-expanded"),
  ).toBe("false");
  const node = view.container.querySelector('[data-tool="t1"]');
  const done: TurnModel = {
    ...next,
    running: false,
    endedAt: 1234,
    items: [
      ...next.items,
      {
        type: "assistant",
        id: "b",
        message: {
          id: "b",
          active: false,
          thinking: "",
          tools: [],
          text: "完成",
        },
      },
    ],
  };
  view.rerender(<Turn model={done} actions={actions} />);
  const process = screen.getByRole("button", { name: "用时 1 秒" });
  expect(process.getAttribute("aria-expanded")).toBe("false");
  expect(view.container.querySelector('[data-tool="t1"]')).toBe(node);
  fireEvent.click(process);
  expect(
    screen.getByRole("button", { name: "思考" }).getAttribute("aria-expanded"),
  ).toBe("false");
});
