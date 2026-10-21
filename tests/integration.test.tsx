// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { SlotCore } from "@deepseek-ai/dsh-client-ui-slots";
import type { PropsRenderSlots } from "@deepseek-ai/dsh-client-ui-slots";
import { chatOverride, installChatTabDedup } from "../src/integration";

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});
const Original = () => null;
const Compact = () => null;
const Root = (_props: PropsRenderSlots<"conversation.view">) => null;
function fixture() {
  const slots = new SlotCore();
  slots.register(
    {
      name: "root",
      children: { "conversation.view": { kind: "list", scope: "session" } },
    },
    Root,
  );
  slots.register(
    { name: "conversation.view", id: "chat", order: 0, label: "对话" },
    Original,
  );
  slots.register(
    { name: "conversation.view", id: "trajectory", order: 1, label: "轨迹" },
    Original,
  );
  let enabled = true;
  const listeners = new Set<() => void>();
  const tools = {
    getSnapshot: () => enabled,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
  function renderTabs(deduplicated = false) {
    const entries = (
      deduplicated
        ? slots.entriesOfSlot("conversation.view")
        : slots.entries("conversation.view")
    ).filter((e) => enabled || e.options.id !== "trajectory");
    const strip = document.createElement("div");
    strip.dataset.conversationTabs = "";
    for (const entry of entries) {
      const button = document.createElement("button");
      button.setAttribute("role", "tab");
      button.textContent = entry.options.id === "chat" ? "对话" : "轨迹";
      strip.append(button);
    }
    document.body.replaceChildren(strip);
    return strip;
  }
  return {
    slots,
    tools,
    renderTabs,
    listeners,
    setTools(value: boolean) {
      enabled = value;
      listeners.forEach((l) => l());
    },
  };
}
const visible = (tabs: HTMLElement) =>
  [...tabs.children]
    .filter((e) => getComputedStyle(e).display !== "none")
    .map((e) => e.textContent);

it("replaces the existing chat cell and restores its original occupant on disposal", async () => {
  const f = fixture();
  const disposeStyle = installChatTabDedup(f.slots, f.tools);
  const disposeView = f.slots.register(
    { ...chatOverride, label: "对话" },
    Compact,
  );
  await Promise.resolve();
  expect(
    f.slots.entriesOfSlot("conversation.view").map((e) => e.options.id),
  ).toEqual(["chat", "trajectory"]);
  expect(f.slots.entriesOfSlot("conversation.view")[0].component).toBe(Compact);
  expect(visible(f.renderTabs())).toEqual(["对话", "轨迹"]);
  disposeView();
  disposeStyle();
  expect(f.slots.entriesOfSlot("conversation.view")[0].component).toBe(
    Original,
  );
  expect(document.querySelector("[data-dsh-compact-tabs]")).toBeNull();
  expect(f.listeners.size).toBe(0);
  expect(visible(f.renderTabs())).toEqual(["对话", "轨迹"]);
});
it("hides a redundant single-view strip and leaves a host that already deduplicates untouched", async () => {
  const f = fixture();
  f.slots.register({ ...chatOverride, label: "对话" }, Compact);
  const disposeStyle = installChatTabDedup(f.slots, f.tools);
  await Promise.resolve();
  expect(visible(f.renderTabs(true))).toEqual(["对话", "轨迹"]);
  f.setTools(false);
  const single = f.renderTabs();
  expect(getComputedStyle(single).display).toBe("none");
  f.setTools(true);
  expect(visible(f.renderTabs())).toEqual(["对话", "轨迹"]);
  disposeStyle();
});
