import type {
  ChatNode,
  ChatSnapshot,
  ToolCallBlock,
} from "@deepseek-ai/dsh-client-ui-chat/client";
import { adaptTool } from "./tools";
import type { LaneItem, TurnModel } from "./model";

export function adaptTurn(chat: ChatSnapshot, turn: number): TurnModel {
  const location = chat.timeline.turns.get(turn);
  const nodes = chat.locations
    .getTurn(turn)
    .map((key) => chat.nodes.get(key))
    .filter((n) => n !== undefined) as ChatNode[];
  const tools = new Map<string, ToolCallBlock>();
  for (const n of nodes)
    if (n.kind === "tool-call") tools.set(n.data.root.callId, n.data.root);
  const owners = new Set(
    nodes.flatMap((n) =>
      n.kind === "assistant-step"
        ? n.data.blocks.flatMap((b) =>
            b.kind === "tool-call" ? [b.callId] : [],
          )
        : [],
    ),
  );
  const claimed = new Set<string>(),
    items: LaneItem[] = [];
  let outputSeen = false,
    interleaved = false,
    forkSeq: number | undefined;
  for (const node of nodes) {
    if (node.kind === "user" || node.kind === "steering") {
      interleaved ||= outputSeen;
      items.push({
        type: "user",
        id: node.key,
        time: node.data.time,
        text: node.data.content
          .flatMap((b) => (b.type === "text" ? [b.text] : []))
          .join("\n"),
        images: node.data.content.flatMap((b, i) =>
          b.type === "image"
            ? [{ id: `${node.key}:${i}`, attachment: b.attachment }]
            : [],
        ),
        files: node.data.content.flatMap((b) =>
          b.type === "file"
            ? [{ name: b.attachment.name, bytes: b.attachment.bytes }]
            : [],
        ),
      });
    } else if (node.kind === "assistant-step") {
      outputSeen = true;
      const { blocks, status } = node.data;
      const owned = blocks.flatMap((block) => {
        if (block.kind !== "tool-call" || claimed.has(block.callId)) return [];
        claimed.add(block.callId);
        const call = tools.get(block.callId);
        // Missing lifecycle evidence stays missing; never infer from neighboring events.
        return call
          ? [
              adaptTool(
                call,
                location?.status === "closed" || status === "interrupted",
              ),
            ]
          : [];
      });
      items.push({
        type: "assistant",
        id: node.key,
        message: {
          id: node.key,
          thinking: blocks
            .flatMap((b) => (b.kind === "reasoning" ? [b.text] : []))
            .join("\n\n"),
          text: blocks
            .flatMap((b) => (b.kind === "text" ? [b.text] : []))
            .join("\n\n"),
          tools: owned,
          active: status === "running" && location?.status !== "closed",
        },
      });
    } else if (
      node.kind === "tool-call" &&
      !owners.has(node.data.root.callId)
    ) {
      items.push({
        type: "assistant",
        id: node.key,
        message: {
          id: node.key,
          thinking: "",
          text: "",
          active: false,
          tools: [adaptTool(node.data.root, location?.status === "closed")],
        },
      });
    } else if (node.kind === "turn-tail" && !node.data.branchUnavailable)
      forkSeq = node.data.seq;
    else if (node.kind === "turn-error")
      items.push({ type: "notice", id: node.key, text: node.data.message });
    else if (node.kind === "turn-max-tokens")
      items.push({ type: "notice", id: node.key, text: "已达到本轮输出限制" });
  }
  const reason = location?.end?.data.reason.kind;
  if (reason === "aborted" || reason === "interrupted" || reason === "blocked")
    items.push({
      type: "notice",
      id: `turn:${turn}:end`,
      text:
        reason === "aborted"
          ? "已停止"
          : reason === "interrupted"
            ? "本轮已中断"
            : "本轮已阻止",
    });
  return {
    id: String(turn),
    items,
    running: location?.status === "open",
    startedAt: location?.start?.time,
    endedAt: location?.end?.time,
    forkSeq,
    interleaved,
  };
}
