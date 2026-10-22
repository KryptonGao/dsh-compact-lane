import { useMemo, useState } from "react";
import type { ImageAttachmentRef } from "@deepseek-ai/dsh-attachment";
import type {} from "@deepseek-ai/dsh-subagent/client";
import type { Context } from "@deepseek-ai/cordis";
import type {} from "@deepseek-ai/dsh-client-ui-chat/client";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import type {} from "@deepseek-ai/dsh-client-ui-session/client";
import type {} from "@deepseek-ai/dsh-client-ui-renderer/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-sidebar-right/client";
import type {} from "@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client";
import type {} from "@deepseek-ai/dsh-client-ui-workspace/client";
import type {} from "@deepseek-ai/dsh-api-session-controller/client";
import type {
  PropsRuntime,
  InjectFace,
} from "@deepseek-ai/dsh-client-ui-slots";
import { resolveSlotLabel } from "@deepseek-ai/dsh-client-ui-slots";
import type { ObservableSnapshot } from "@deepseek-ai/dsh-client-store";
import type { SessionId } from "@deepseek-ai/dsh-session/types";
import { MarkdownDelegateProvider } from "@deepseek-ai/dsh-client-ui-primitives";
import { fileAddressFor } from "@deepseek-ai/dsh-util-workspace-path";
import { turnSource } from "./adapter/source";
import type { TurnModel } from "./adapter/model";
import { Lane } from "./ui/lane";
import { Turn, type TurnActions } from "./ui/turn";
import velaCss from "./styles/vela-compact.css";
import hostCss from "./styles/host.css";
import { chatOverride, installChatTabDedup } from "./integration";
import { FoldModeContext } from "./ui/fold";
import {
  SECTION_LABEL,
  SettingsSection,
  type CompactSettingsForm,
} from "./ui/settings";
import { NAMESPACE, normalizeFoldMode, type FoldMode } from "./settings";

interface Injected {
  hooks: { foldMode: ObservableSnapshot<FoldMode> };
  keyedHooks: { turn: (key: string) => ObservableSnapshot<TurnModel> };
  openFile(path: string): void;
  openAgent(id: string, mode: string): void;
  fork(seq: number): Promise<void>;
  loadOlder(): Promise<void>;
  loadImage(attachment: ImageAttachmentRef): Promise<string>;
}
type ViewProps = PropsRuntime<"conversation.view"> & InjectFace<Injected>;
type UseTurn = InjectFace<Injected>["useTurn"];
function TurnSeat({
  turn,
  useTurn,
  actions,
}: {
  turn: number;
  useTurn: UseTurn;
  actions: TurnActions;
}) {
  const model = useTurn(String(turn));
  return model ? <Turn model={model} actions={actions} /> : null;
}
function CompactView({
  sessionId,
  useFoldMode,
  useChat,
  useTurn,
  useSession,
  useSessions,
  useSessionStatus,
  openFile,
  openAgent,
  fork,
  loadOlder,
  loadImage,
}: ViewProps) {
  const foldMode = useFoldMode((m) => m);
  const order = useChat((s) => s.timeline.turnOrder);
  const more = useSession((s) => s.hasMore),
    loading = useSession((s) => s.loadingOlder),
    openError = useSession((s) => s.openError);
  const projections = useSessions(
    (s) => s.projectionsBySession[sessionId]?.values,
  );
  const summaries = useSessions((s) => s.byId);
  const statuses = useSessionStatus((s) => s);
  const [error, setError] = useState("");
  const actions = useMemo<TurnActions>(() => {
    const catalog = projections?.subagentCatalog;
    const agents = new Map<string, { running?: boolean; mode: string }>();
    if (Array.isArray(catalog))
      for (const entry of catalog)
        if (entry.mode !== "external")
          agents.set(entry.id, {
            mode: entry.mode,
            running:
              statuses.get(entry.id)?.running ??
              summaries[entry.id as SessionId]?.running,
          });
    return {
      openFile,
      fork,
      agents,
      loadImage,
      openAgent: (id) => {
        const a = agents.get(id);
        if (a) openAgent(id, a.mode);
      },
    };
  }, [projections, summaries, statuses, openFile, openAgent, fork, loadImage]);
  return (
    <MarkdownDelegateProvider
      openFile={async (path) => openFile(path)}
      openExternalLink={(url) => {
        window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <FoldModeContext.Provider value={foldMode}>
        <Lane
          identity={sessionId}
          page={
            more
              ? {
                  loading,
                  load: async () => {
                    setError("");
                    try {
                      await loadOlder();
                    } catch (e) {
                      setError(String(e));
                    }
                  },
                }
              : undefined
          }
          header={
            <>
              {(error || openError) && (
                <div role="alert" className="lane-action-error">
                  {error || String(openError)}
                </div>
              )}
              {!order.length && (
                <div className="lane-notice">
                  开始对话后，工具调用会显示在这里。
                </div>
              )}
            </>
          }
        >
          {order.map((turn) => (
            <TurnSeat
              key={turn}
              turn={turn}
              useTurn={useTurn}
              actions={actions}
            />
          ))}
        </Lane>
      </FoldModeContext.Provider>
    </MarkdownDelegateProvider>
  );
}
export const inject = [
  "slots",
  "sessions",
  "uiConversation",
  "uiWorkspace",
  "sidebarRight",
  "configForms",
];
export function installStyles(ctx: Context) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.dshCompactLaneStyles = "";
    style.textContent = velaCss + "\n" + hostCss;
    document.head.append(style);
    return () => style.remove();
  });
}
/** Accepted fold mode; an unserved or unloaded namespace keeps the folded default. */
export function foldModeOf(
  form: Pick<CompactSettingsForm, "getSnapshot" | "subscribe">,
): ObservableSnapshot<FoldMode> {
  const read = () => normalizeFoldMode(form.getSnapshot().value?.foldMode);
  return {
    getSnapshot: read,
    subscribe: (listener) => {
      let previous = read();
      return form.subscribe(() => {
        const next = read();
        if (next === previous) return;
        previous = next;
        listener();
      });
    },
  };
}
export function apply(ctx: Context): void {
  installStyles(ctx);
  const form = ctx.configForms.get<{ foldMode?: FoldMode }>(NAMESPACE);
  const foldMode = foldModeOf(form);
  ctx.effect(() =>
    ctx.configForms.whileServed([NAMESPACE], () =>
      ctx.slots.inject("settings.section", () =>
        ctx.slots.register(
          {
            name: "settings.section",
            id: "compact-lane",
            order: 30,
            label: SECTION_LABEL,
            inject: () => ({
              hooks: { form },
              setFoldMode: (mode: FoldMode) => form.set("foldMode", mode),
            }),
          },
          SettingsSection,
        ),
      ),
    ),
  );
  ctx.effect(() =>
    installChatTabDedup(ctx.slots, ctx.configForms.developerTools.enabled),
  );
  ctx.slots.inject("conversation.view", () =>
    ctx.slots.register(
      {
        ...chatOverride,
        label: () => {
          const original = ctx.slots
            .entries("conversation.view")
            .find(
              (entry) =>
                entry.options.id === "chat" && entry.component !== CompactView,
            );
          return resolveSlotLabel(original?.options.label) ?? "对话";
        },
        inject: (sessionId: SessionId): Injected => {
          const binding = ctx.sessions.binding(sessionId);
          if (!binding)
            throw new Error(`compact: unknown session ${sessionId}`);
          const target = ctx.uiConversation.binding(binding).target("chat");
          const source = {
            getSnapshot: () => {
              const value = target.getSnapshot();
              if (!value) throw new Error("compact: Chat target unavailable");
              return value;
            },
            subscribe: target.subscribe.bind(target),
          };
          const sources = new Map<string, ObservableSnapshot<TurnModel>>();
          return {
            hooks: { foldMode },
            keyedHooks: {
              turn: (key) => {
                let s = sources.get(key);
                if (!s) {
                  s = turnSource(source, Number(key));
                  sources.set(key, s);
                }
                return s;
              },
            },
            openFile: (path) => {
              const cwd = ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd;
              ctx.sidebarRight.openResource(
                fileAddressFor(sessionId, cwd, path),
              );
            },
            openAgent: (id, mode) =>
              ctx.sidebarRight.openResource(
                `dsh-resource://subagentchat/session/${encodeURIComponent(id)}?parent=${encodeURIComponent(sessionId)}&mode=${encodeURIComponent(mode)}`,
                { kind: "subagentchat", preferNewPane: true },
              ),
            fork: async (seq) => {
              const child = await ctx.sessions.fork({
                sessionId,
                atSeq: seq,
                increaseTitle: true,
              });
              ctx.uiWorkspace.openSession(child);
            },
            loadOlder: async () => {
              await binding.session.loadOlder();
            },
            loadImage: (attachment) =>
              ctx.uiConversation.imageUrl(sessionId, attachment),
          };
        },
      },
      CompactView,
    ),
  );
}
