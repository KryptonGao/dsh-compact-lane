// @vitest-environment jsdom
import { useSyncExternalStore } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { AssistantMessage } from "../src/adapter/model";
import { Config } from "../src/index";
import { iconColorOf } from "../src/client";
import { normalizeIconColor } from "../src/settings";
import { FoldModeContext, IconColorContext } from "../src/ui/fold";
import { Lane } from "../src/ui/lane";
import { SettingsSection } from "../src/ui/settings";
import { Turn, type TurnActions } from "../src/ui/turn";

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
const root = (container: HTMLElement) =>
  container.querySelector("[data-dsh-compact-lane]")!;

type Snapshot = {
  status: "ready";
  writable: boolean;
  value?: { iconColor?: unknown };
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

it("treats a missing or invalid iconColor as on and only false as off", () => {
  expect(normalizeIconColor(undefined)).toBe(true);
  expect(normalizeIconColor(null)).toBe(true);
  expect(normalizeIconColor("false")).toBe(true);
  expect(normalizeIconColor(0)).toBe(true);
  expect(normalizeIconColor(true)).toBe(true);
  expect(normalizeIconColor(false)).toBe(false);
});
it("defaults the Config schema to icon color on and keeps fold mode folded", () => {
  const read = (config: ReturnType<typeof Config>) => ({
    iconColor: (config.iconColor as unknown as { get(): boolean }).get(),
    foldMode: (config.foldMode as unknown as { get(): string }).get(),
  });
  expect(read(Config({}))).toEqual({ iconColor: true, foldMode: "folded" });
  expect(read(Config({ iconColor: false })).iconColor).toBe(false);
});
it("marks the plugin root with the icon color switch", () => {
  const lane = () => <Lane identity="s">{null}</Lane>;
  const standalone = render(lane());
  expect(root(standalone.container).getAttribute("data-tool-icon-color")).toBe(
    "true",
  );
  standalone.unmount();
  for (const on of [true, false]) {
    const view = render(
      <IconColorContext.Provider value={on}>
        {lane()}
      </IconColorContext.Provider>,
    );
    expect(root(view.container).getAttribute("data-tool-icon-color")).toBe(
      String(on),
    );
    view.unmount();
  }
});
it("updates a mounted lane when the setting changes, without remounting it", () => {
  const form = fakeForm({ status: "ready", writable: true });
  const source = iconColorOf(form);
  const Live = () => {
    const on = useSyncExternalStore(source.subscribe, source.getSnapshot);
    return (
      <IconColorContext.Provider value={on}>
        <Lane identity="s">
          <span data-testid="child" />
        </Lane>
      </IconColorContext.Provider>
    );
  };
  const view = render(<Live />);
  const node = root(view.container);
  const child = screen.getByTestId("child");
  expect(node.getAttribute("data-tool-icon-color")).toBe("true");
  act(() =>
    form.emit({ status: "ready", writable: true, value: { iconColor: false } }),
  );
  expect(node.getAttribute("data-tool-icon-color")).toBe("false");
  act(() =>
    form.emit({
      status: "ready",
      writable: true,
      value: { iconColor: "garbage" },
    }),
  );
  expect(node.getAttribute("data-tool-icon-color")).toBe("true");
  expect(root(view.container)).toBe(node);
  expect(screen.getByTestId("child")).toBe(child);
});
it("notifies the icon color observable only on a normalized change", () => {
  const form = fakeForm({ status: "ready", writable: true });
  const source = iconColorOf(form);
  const seen = vi.fn();
  source.subscribe(seen);
  form.emit({ status: "ready", writable: true, value: { iconColor: true } });
  form.emit({ status: "ready", writable: true, value: { iconColor: "x" } });
  expect(seen).not.toHaveBeenCalled();
  form.emit({ status: "ready", writable: true, value: { iconColor: false } });
  expect(seen).toHaveBeenCalledTimes(1);
  expect(source.getSnapshot()).toBe(false);
});

const message = (active: boolean): AssistantMessage => ({
  id: "m",
  active,
  thinking: "先看一下重试逻辑。",
  text: active ? "" : "完成",
  tools: [],
});
it("puts a decorative thinking icon before the 思考 and 思考中 titles", () => {
  for (const [active, title] of [
    [false, "思考"],
    [true, "思考中"],
  ] as const) {
    const model = {
      id: "1",
      running: active,
      startedAt: 1,
      endedAt: active ? undefined : 2,
      interleaved: false,
      items: [{ type: "assistant", id: "m", message: message(active) }],
    } as never;
    const view = render(
      <FoldModeContext.Provider value="unfolded">
        <Turn model={model} actions={actions} />
      </FoldModeContext.Provider>,
    );
    const trigger = view.container.querySelector(".thinking-header button")!;
    const icon = trigger.querySelector(".thinking-icon")!;
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("svg")).not.toBeNull();
    expect(icon.nextElementSibling?.textContent).toBe(title);
    expect(trigger.firstElementChild).toBe(icon);
    view.unmount();
  }
});

function section(
  snapshot: Snapshot,
  setIconColor = vi.fn().mockResolvedValue(true),
) {
  const form = fakeForm(snapshot);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Section = SettingsSection as React.ComponentType<any>;
  render(
    <Section
      useForm={(select: (s: unknown) => unknown) => select(form.getSnapshot())}
      setFoldMode={vi.fn().mockResolvedValue(true)}
      setIconColor={setIconColor}
      close={() => {}}
    />,
  );
  return setIconColor;
}
const iconTab = (name: string) =>
  screen.getAllByRole("tab", { name })[0] as HTMLButtonElement;
it("shows the icon color row on, writes the chosen value and reports a refusal", async () => {
  expect(screen.queryByText("工具图标配色")).toBeNull();
  const setIconColor = vi.fn().mockResolvedValue(false);
  section({ status: "ready", writable: true }, setIconColor);
  expect(screen.getAllByText("工具图标配色").length).toBeGreaterThan(0);
  expect(
    screen.getByText(
      "开启后，每类工具调用的左侧图标使用各自的颜色；关闭则统一为灰色。",
    ),
  ).not.toBeNull();
  expect(iconTab("开启").getAttribute("aria-selected")).toBe("true");
  fireEvent.click(iconTab("关闭"));
  expect(setIconColor).toHaveBeenCalledWith(false);
  expect((await screen.findByRole("alert")).textContent).toContain("未能保存");
});
it("reflects a stored false and locks a read-only document", () => {
  section({ status: "ready", writable: false, value: { iconColor: false } });
  expect(iconTab("关闭").getAttribute("aria-selected")).toBe("true");
  expect(iconTab("关闭").disabled).toBe(true);
});
