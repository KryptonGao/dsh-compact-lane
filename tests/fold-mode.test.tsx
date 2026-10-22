// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ToolTrace, TurnModel } from "../src/adapter/model";
import { FoldModeContext } from "../src/ui/fold";
import { ToolList } from "../src/ui/tools";
import { Turn, type TurnActions } from "../src/ui/turn";
import { SettingsSection } from "../src/ui/settings";
import { foldModeOf } from "../src/client";
import { normalizeFoldMode, type FoldMode } from "../src/settings";

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
const bash = (id: string): ToolTrace => ({
  id,
  name: "bash",
  kind: "bash",
  status: "done",
  phase: "result",
  activity: { command: `echo ${id}`, diffs: [] },
});
const finished: TurnModel = {
  id: "1",
  running: false,
  startedAt: 1,
  endedAt: 1234,
  interleaved: false,
  items: [
    {
      type: "assistant",
      id: "a",
      message: {
        id: "a",
        active: false,
        thinking: "",
        text: "",
        tools: [bash("t1"), bash("t2")],
      },
    },
    {
      type: "assistant",
      id: "b",
      message: {
        id: "b",
        active: false,
        thinking: "",
        text: "完成",
        tools: [],
      },
    },
  ],
};
const withMode = (mode: FoldMode, node: React.ReactNode) => (
  <FoldModeContext.Provider value={mode}>{node}</FoldModeContext.Provider>
);
const group = (container: HTMLElement) =>
  container.querySelector(".tool-compact-summary") as HTMLElement;

it("keeps tool groups closed by default and opens them when unfolded", () => {
  const folded = render(
    <ToolList tools={[bash("t1"), bash("t2")]} actions={actions} />,
  );
  expect(group(folded.container).getAttribute("aria-expanded")).toBe("false");
  folded.unmount();
  const unfolded = render(
    withMode(
      "unfolded",
      <ToolList tools={[bash("t1"), bash("t2")]} actions={actions} />,
    ),
  );
  expect(group(unfolded.container).getAttribute("aria-expanded")).toBe("true");
});
it("opens a finished turn's process row only when unfolded", () => {
  const folded = render(<Turn model={finished} actions={actions} />);
  expect(
    screen
      .getByRole("button", { name: "用时 1 秒" })
      .getAttribute("aria-expanded"),
  ).toBe("false");
  folded.unmount();
  render(withMode("unfolded", <Turn model={finished} actions={actions} />));
  expect(
    screen
      .getByRole("button", { name: "用时 1 秒" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
});
it("re-applies a changed mode to mounted disclosures without remounting tools", () => {
  const turn = <Turn model={finished} actions={actions} />;
  const process = () =>
    screen
      .getByRole("button", { name: "用时 1 秒" })
      .getAttribute("aria-expanded");
  const view = render(withMode("unfolded", turn));
  const node = view.container.querySelector('[data-tool="t1"]');
  expect(node).not.toBeNull();
  view.rerender(withMode("folded", turn));
  expect(process()).toBe("false");
  expect(view.container.querySelector('[data-tool="t1"]')).toBe(node);
  view.rerender(withMode("unfolded", turn));
  expect(process()).toBe("true");
  expect(group(view.container).getAttribute("aria-expanded")).toBe("true");
  expect(view.container.querySelector('[data-tool="t1"]')).toBe(node);
  fireEvent.click(group(view.container));
  expect(group(view.container).getAttribute("aria-expanded")).toBe("false");
});
it("keeps a running turn's process open after it finishes while unfolded", () => {
  const running = { ...finished, running: true, endedAt: undefined };
  const view = render(
    withMode("unfolded", <Turn model={running} actions={actions} />),
  );
  view.rerender(
    withMode("unfolded", <Turn model={finished} actions={actions} />),
  );
  expect(
    screen
      .getByRole("button", { name: "用时 1 秒" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
});

type Snapshot = {
  status: "ready";
  writable: boolean;
  value?: { foldMode?: string };
};
function fakeForm(initial: Snapshot) {
  let snapshot = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => snapshot as never,
    subscribe: (l: () => void) => (listeners.add(l), () => listeners.delete(l)),
    emit(next: Snapshot) {
      snapshot = next;
      listeners.forEach((l) => l());
    },
  };
}
it("normalizes unknown values to folded and only notifies on a real change", () => {
  expect(normalizeFoldMode(undefined)).toBe("folded");
  expect(normalizeFoldMode("other")).toBe("folded");
  expect(normalizeFoldMode("unfolded")).toBe("unfolded");
  const form = fakeForm({ status: "ready", writable: true });
  const mode = foldModeOf(form);
  const seen = vi.fn();
  mode.subscribe(seen);
  expect(mode.getSnapshot()).toBe("folded");
  form.emit({ status: "ready", writable: true, value: { foldMode: "folded" } });
  expect(seen).not.toHaveBeenCalled();
  form.emit({
    status: "ready",
    writable: true,
    value: { foldMode: "unfolded" },
  });
  expect(seen).toHaveBeenCalledTimes(1);
  expect(mode.getSnapshot()).toBe("unfolded");
});

function section(
  snapshot: Snapshot,
  setFoldMode = vi.fn().mockResolvedValue(true),
) {
  const form = fakeForm(snapshot);
  // The slot renderer supplies the owner and hook props this fixture fakes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Section = SettingsSection as React.ComponentType<any>;
  render(
    <Section
      useForm={(select: (s: unknown) => unknown) => select(form.getSnapshot())}
      setFoldMode={setFoldMode}
      close={() => {}}
    />,
  );
  return setFoldMode;
}
it("writes the chosen mode from the settings page", async () => {
  const setFoldMode = section({ status: "ready", writable: true });
  expect(
    screen.getByRole("tab", { name: "折叠" }).getAttribute("aria-selected"),
  ).toBe("true");
  fireEvent.click(screen.getByRole("tab", { name: "不折叠" }));
  expect(setFoldMode).toHaveBeenCalledWith("unfolded");
});
it("reports a refused write and locks a read-only document", async () => {
  const refused = vi.fn().mockResolvedValue(false);
  section({ status: "ready", writable: true }, refused);
  fireEvent.click(screen.getByRole("tab", { name: "不折叠" }));
  expect((await screen.findByRole("alert")).textContent).toContain("未能保存");
  cleanup();
  section({
    status: "ready",
    writable: false,
    value: { foldMode: "unfolded" },
  });
  const unfolded = screen.getByRole("tab", {
    name: "不折叠",
  }) as HTMLButtonElement;
  expect(unfolded.getAttribute("aria-selected")).toBe("true");
  expect(unfolded.disabled).toBe(true);
});
