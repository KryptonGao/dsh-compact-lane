import type { ObservableSnapshot } from "@deepseek-ai/dsh-client-store";

export const chatOverride = {
  name: "conversation.view",
  id: "chat",
  order: 0,
  priority: -100,
} as const;

interface ViewEntry {
  options: { id?: string };
}
interface ViewRegistry {
  entries(key: "conversation.view"): readonly ViewEntry[];
  subscribe(key: "conversation.view", listener: () => void): () => void;
}

/** rc.2's header reads the raw ledger, whereas its view outlet elects one winner per id. */
export function chatTabDedupCss(
  entries: readonly ViewEntry[],
  developerTools: boolean,
) {
  const tabs = entries.filter(
    (e) =>
      e.options.id !== undefined &&
      (developerTools || e.options.id !== "trajectory"),
  );
  let seenChat = false;
  const hidden: number[] = [];
  tabs.forEach((entry, i) => {
    if (entry.options.id !== "chat") return;
    if (seenChat) hidden.push(i + 1);
    seenChat = true;
  });
  const strip = `[data-conversation-tabs]:has(> [role="tab"]:nth-child(${tabs.length}):last-child)`;
  if (hidden.length && tabs.length - hidden.length === 1)
    return `${strip} { display: none; }`;
  // If a future host deduplicates the header itself, its smaller row count disables this fix.
  return hidden
    .map(
      (index) =>
        `${strip} > [role="tab"]:nth-child(${index}) { display: none; }`,
    )
    .join("\n");
}

/** Own only the compatibility sheet and subscriptions; never mutate the host's registrations. */
export function installChatTabDedup(
  slots: ViewRegistry,
  developerTools: ObservableSnapshot<boolean>,
) {
  const style = document.createElement("style");
  style.dataset.dshCompactTabs = "";
  const update = () => {
    style.textContent = chatTabDedupCss(
      slots.entries("conversation.view"),
      developerTools.getSnapshot(),
    );
  };
  const stopSlots = slots.subscribe("conversation.view", update);
  const stopTools = developerTools.subscribe(update);
  update();
  document.head.append(style);
  return () => {
    stopSlots();
    stopTools();
    style.remove();
  };
}
