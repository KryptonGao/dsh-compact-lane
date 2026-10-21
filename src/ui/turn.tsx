import { memo, useEffect, useRef, useState } from "react";
import {
  fileChanges,
  formatElapsed,
  type AssistantMessage,
  type LaneItem,
  type TurnModel,
} from "../adapter/model";
import { Collapse, Copy, Fade, Icon, Loader, Prose } from "./primitives";
import { ToolList, type ToolActions } from "./tools";

function Thinking({ message: m }: { message: AssistantMessage }) {
  const active = m.active && !m.text && !m.tools.length;
  const [open, setOpen] = useState(active);
  useEffect(() => setOpen(active), [active]);
  return (
    <div
      className={`thinking-block time-spent-collapsible${open ? " expanded" : ""}`}
    >
      <div className="thinking-header">
        <button
          type="button"
          className={`time-spent-trigger${active ? " is-running" : ""}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{active ? "思考中" : "思考"}</span>
          <Icon name="chevron" className="time-spent-trigger-arrow" size={12} />
          {active && <Loader />}
        </button>
      </div>
      <Collapse open={open} process>
        <Fade contentClass="process-thinking-text">
          <Prose text={m.thinking} streaming={active} />
        </Fade>
      </Collapse>
    </div>
  );
}
function Message({
  message: m,
  actions,
  showText = true,
}: {
  message: AssistantMessage;
  actions: ToolActions;
  showText?: boolean;
}) {
  return (
    <article
      className="assistant-block assistant-turn-process-item"
      data-message={m.id}
    >
      {m.thinking && <Thinking message={m} />}
      {m.tools.length > 0 && <ToolList tools={m.tools} actions={actions} />}
      {showText && m.text && (
        <div className="agent-reply-prose">
          <Prose text={m.text} streaming={m.active} />
        </div>
      )}
    </article>
  );
}
function UserImage({
  image,
  actions,
}: {
  image: Extract<LaneItem, { type: "user" }>["images"][number];
  actions: ToolActions;
}) {
  const [url, setUrl] = useState(""),
    [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    actions.loadImage?.(image.attachment).then(
      (value) => {
        if (alive) setUrl(value);
      },
      () => {
        if (alive) setError(true);
      },
    );
    return () => {
      alive = false;
    };
  }, [image.attachment, actions.loadImage]);
  return url ? (
    <a
      className="user-attachment-thumb"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="查看图片"
    >
      <img src={url} alt="消息附件" />
    </a>
  ) : (
    <span className="lane-notice">
      {error ? "图片加载失败" : "正在加载图片…"}
    </span>
  );
}
function User({
  item,
  actions,
}: {
  item: Extract<LaneItem, { type: "user" }>;
  actions: ToolActions;
}) {
  return (
    <div className="user-msg-container message-enter">
      {(item.images.length > 0 || !!item.files?.length) && (
        <div className="user-attachments">
          {item.images.map((image) => (
            <UserImage key={image.id} image={image} actions={actions} />
          ))}
          {item.files?.map((file, i) => (
            <span className="lane-file-attachment" key={i}>
              {file.name} · {file.bytes} B
            </span>
          ))}
        </div>
      )}
      {item.text && (
        <div className="user-bubble">
          <Prose text={item.text} />
        </div>
      )}
      <div className="user-message-actions">
        {item.time !== undefined && (
          <time>
            {new Date(item.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}
        <Copy
          text={item.text}
          label="复制消息"
          iconOnly
          className="reply-action user-message-action"
        />
      </div>
    </div>
  );
}
function Elapsed({
  start,
  end,
  running,
}: {
  start?: number;
  end?: number;
  running: boolean;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running || start === undefined) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running, start]);
  const duration =
    start !== undefined && (running || end !== undefined)
      ? Math.max(0, (running ? now : end!) - start)
      : undefined;
  return (
    <>
      {running ? "已处理" : "用时"}
      {duration === undefined ? "" : ` ${formatElapsed(duration)}`}
    </>
  );
}
function Changes({
  model,
  actions,
}: {
  model: TurnModel;
  actions: ToolActions;
}) {
  const [all, setAll] = useState(false);
  const files = fileChanges(
    model.items.flatMap((i) => (i.type === "assistant" ? i.message.tools : [])),
  );
  if (!files.length) return null;
  const added = files.reduce((n, f) => n + f.added, 0),
    removed = files.reduce((n, f) => n + f.removed, 0);
  return (
    <section className="turn-changes" aria-label="本轮文件变更统计">
      <header className="turn-changes-header">
        <span className="turn-changes-icon">
          <Icon name="write" size={18} />
        </span>
        <div className="turn-changes-summary">
          <strong>已编辑 {files.length} 个文件</strong>
          <span className="turn-changes-total">
            <span className="turn-changes-added">+{added}</span>
            <span className="turn-changes-removed">−{removed}</span>
          </span>
        </div>
      </header>
      <div className="turn-changes-body">
        {(all ? files : files.slice(0, 3)).map((f) => (
          <div className="turn-changes-file" key={f.path}>
            <button
              type="button"
              className="turn-changes-path"
              onClick={() => actions.openFile(f.path)}
            >
              {f.path}
            </button>
            <span className="turn-changes-file-stat">
              <span className="turn-changes-added">+{f.added}</span>
              <span className="turn-changes-removed">−{f.removed}</span>
            </span>
          </div>
        ))}
        {files.length > 3 && (
          <button
            type="button"
            className="turn-changes-more"
            aria-expanded={all}
            onClick={() => setAll((v) => !v)}
          >
            {all ? "收起文件" : `再显示 ${files.length - 3} 个文件`}
            <Icon name="down" />
          </button>
        )}
      </div>
    </section>
  );
}
export interface TurnActions extends ToolActions {
  fork(seq: number): Promise<void>;
}
export const Turn = memo(function Turn({
  model,
  actions,
  initialOpen = false,
}: {
  model: TurnModel;
  actions: TurnActions;
  initialOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(model.running || initialOpen),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const wasRunning = useRef(model.running);
  useEffect(() => {
    if (wasRunning.current !== model.running) setExpanded(model.running);
    wasRunning.current = model.running;
  }, [model.running]);
  const assistants = model.items.filter(
    (i): i is Extract<LaneItem, { type: "assistant" }> =>
      i.type === "assistant",
  );
  const final = [...assistants].reverse().find((i) => i.message.text.trim());
  const hasProcess = assistants.some(
    (i) => i.message.thinking || i.message.tools.length || i !== final,
  );
  const renderItem = (item: LaneItem) =>
    item.type === "user" ? (
      <User key={item.id} item={item} actions={actions} />
    ) : item.type === "notice" ? (
      <div key={item.id} role="status" className="lane-notice">
        {item.text}
      </div>
    ) : (
      <Message
        key={item.id}
        message={item.message}
        actions={actions}
        showText={model.interleaved || item.id !== final?.id}
      />
    );
  const inputs = model.interleaved
    ? []
    : model.items.filter((i) => i.type === "user");
  const process = model.interleaved
    ? model.items
    : model.items.filter((i) => i.type === "assistant");
  if (!assistants.length)
    return (
      <>
        {model.items.map(renderItem)}
        {model.running && (
          <article className="assistant-block assistant-live-turn">
            <span className="time-spent-trigger assistant-turn-trigger">
              <Elapsed start={model.startedAt} running />
              <Loader />
            </span>
          </article>
        )}
      </>
    );
  return (
    <>
      {inputs.map(renderItem)}
      <article
        className={`assistant-block assistant-turn${model.running ? " assistant-live-turn" : ""}`}
        data-turn={model.id}
      >
        {model.interleaved ? (
          process.map(renderItem)
        ) : (
          <>
            <div
              className={`time-spent-collapsible${expanded ? " expanded" : ""}`}
            >
              {(hasProcess || model.startedAt !== undefined) && (
                <button
                  type="button"
                  className="time-spent-trigger assistant-turn-trigger"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                >
                  <span>
                    <Elapsed
                      start={model.startedAt}
                      end={model.endedAt}
                      running={model.running}
                    />
                  </span>
                  {hasProcess && (
                    <Icon
                      name="chevron"
                      size={12}
                      className="time-spent-trigger-arrow"
                    />
                  )}
                </button>
              )}
              <Collapse open={expanded} process>
                {process.map(renderItem)}
              </Collapse>
            </div>
            {final && (
              <div className="agent-reply-prose" data-final-message={final.id}>
                <Prose
                  text={final.message.text}
                  streaming={final.message.active}
                />
              </div>
            )}
            {model.items.filter((i) => i.type === "notice").map(renderItem)}
          </>
        )}
        {!model.running && final && (
          <div className="reply-actions">
            <Copy text={final.message.text} />
            {model.forkSeq !== undefined && (
              <button
                type="button"
                className="reply-action"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await actions.fork(model.forkSeq!);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Icon name="branch" />
                <span>分支到新聊天</span>
              </button>
            )}
            {model.endedAt !== undefined && (
              <time className="reply-time">
                {new Date(model.endedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
          </div>
        )}
        {error && (
          <div role="alert" className="lane-action-error">
            {error}
          </div>
        )}
        <Changes model={model} actions={actions} />
      </article>
    </>
  );
});
