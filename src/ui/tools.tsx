import { useRef, useState } from "react";
import type { ImageAttachmentRef } from "@deepseek-ai/dsh-attachment";
import {
  collapseDiffContext,
  compactSummaryParts,
  diffStat,
  splitPath,
  splitToolRuns,
  totalDiffStat,
  type FileDiff,
  type ToolTrace,
} from "../adapter/model";
import {
  Collapse,
  CodeText,
  Copy,
  Fade,
  FileBadge,
  Icon,
  Loader,
  Prose,
  Status,
} from "./primitives";
import { useApplyFoldMode, useUnfolded } from "./fold";
export interface ToolActions {
  openFile(path: string): void;
  openAgent(id: string): void;
  agents: ReadonlyMap<string, { running?: boolean; mode: string }>;
  loadImage?(attachment: ImageAttachmentRef): Promise<string>;
}
const action = (t: ToolTrace) =>
  t.neutralWrite
    ? "已写入"
    : {
        bash: "已运行",
        read: "已读取",
        edit: "已编辑",
        write: "已创建",
        other: "",
      }[t.kind];
export function Stat({
  stat,
  className = "tool-compact-stat",
}: {
  stat: { added: number; removed: number } | null;
  className?: string;
}) {
  return (
    stat && (
      <span className={className}>
        {stat.added > 0 && <span className="tool-stat-add">+{stat.added}</span>}
        {stat.removed > 0 && (
          <span className="tool-stat-del">−{stat.removed}</span>
        )}
      </span>
    )
  );
}
function DiffCard({ diff }: { diff: FileDiff }) {
  const rows = collapseDiffContext(diff.rows);
  return (
    <section
      className="compact-diff-card"
      aria-label={`${diff.path} 的文件差异`}
    >
      <header className="compact-diff-card-head">
        <span className="compact-diff-card-name" title={diff.path}>
          {splitPath(diff.path).name}
        </span>
        <Stat stat={diffStat(diff.rows)} className="compact-diff-card-stat" />
        <Copy
          text={diff.rows
            .map((r) =>
              r.kind === "gap"
                ? "…"
                : `${r.kind === "add" ? "+" : r.kind === "del" ? "-" : " "}${r.text}`,
            )
            .join("\n")}
          label="复制差异"
          iconOnly
          className="compact-diff-card-copy"
        />
      </header>
      <Fade
        className="compact-diff-scroll-shell"
        contentClass="compact-diff-scroll-content"
      >
        <div className="tool-sheet tool-sheet-compact-diff">
          {rows.map((r, i) =>
            r.kind === "gap" ? (
              <div
                key={i}
                className="tool-diff-gap is-compact"
                role="separator"
                aria-label="省略的上下文"
              />
            ) : (
              <div
                key={i}
                className={`tool-code-line tool-diff-line ${r.kind}`}
              >
                <span className="tool-gutter">
                  <span className="tool-sign">
                    {r.kind === "add" ? "+" : r.kind === "del" ? "−" : ""}
                  </span>
                  {r.gutter}
                </span>
                <span className="tool-code-text">
                  <CodeText text={r.text} />
                </span>
              </div>
            ),
          )}
        </div>
      </Fade>
    </section>
  );
}
function ToolLine({
  tool: t,
  actions,
  uniform = false,
}: {
  tool: ToolTrace;
  actions: ToolActions;
  uniform?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { activity: a, kind } = t,
    path = a.path ?? "",
    subject = splitPath(path || t.name);
  const stat = totalDiffStat([t]),
    hasDiff = a.diffs.length > 0,
    details = hasDiff || t.status === "error" || t.status === "interrupted";
  const toggle = () => setOpen((v) => !v);
  return (
    <div
      className={`tool-compact-item tool-kind-${kind}${open ? " open" : ""}`}
      data-tool={t.id}
    >
      {kind === "bash" ? (
        <button
          type="button"
          className="tool-compact-line"
          aria-expanded={open}
          aria-label="展开命令和输出"
          title={a.command}
          onClick={toggle}
        >
          {!uniform && (
            <>
              <span className="tool-compact-icon">
                <Icon name="bash" />
              </span>
              <span className="tool-compact-action">{action(t)}</span>
            </>
          )}
          <span className="tool-compact-cmd">
            {a.command?.replace(/\s+/g, " ").trim() || "命令"}
          </span>
          <Icon name="chevron" size={12} className="tool-compact-chevron" />
          <Status status={t.status} />
        </button>
      ) : (
        <div className="tool-compact-line">
          {!uniform && (
            <span className="tool-compact-icon">
              <Icon name={kind} />
            </span>
          )}
          {!uniform &&
            (details ? (
              <button
                type="button"
                className="tool-compact-text-toggle tool-compact-action-toggle"
                onClick={toggle}
                aria-expanded={open}
              >
                <span className="tool-compact-action">{action(t)}</span>
              </button>
            ) : (
              <span className="tool-compact-action">{action(t)}</span>
            ))}
          <FileBadge path={path} />
          {path ? (
            <button
              type="button"
              className="tool-compact-name"
              title={`预览 ${path}`}
              onClick={() => actions.openFile(path)}
            >
              {subject.name}
            </button>
          ) : (
            <span className="tool-compact-name is-static">{subject.name}</span>
          )}
          {subject.dir &&
            (details ? (
              <button
                type="button"
                className="tool-compact-text-toggle tool-compact-path-toggle"
                onClick={toggle}
                aria-expanded={open}
              >
                <span className="tool-compact-dir">{subject.dir}</span>
              </button>
            ) : (
              <span className="tool-compact-dir">{subject.dir}</span>
            ))}
          {details && (
            <button
              type="button"
              className="tool-compact-detail-toggle"
              aria-label={open ? "收起文件详情" : "展开文件详情"}
              aria-expanded={open}
              onClick={toggle}
            >
              <Icon name="chevron" size={12} className="tool-compact-chevron" />
            </button>
          )}
          {!(open && hasDiff) && <Stat stat={stat} />}
          <Status status={t.status} />
        </div>
      )}
      {(kind === "bash" || details) && (
        <Collapse open={open}>
          {kind === "bash" ? (
            <div className="tool-compact-out">
              <Fade className="tool-details-scroll">
                <div
                  className={`tool-terminal${t.status === "error" ? " failed" : ""}`}
                >
                  {a.command && (
                    <div className="tool-terminal-cmd">
                      <span className="tool-terminal-prompt">$</span>
                      <span>{a.command}</span>
                    </div>
                  )}
                  {a.body ? (
                    <pre className="tool-terminal-out">{a.body}</pre>
                  ) : (
                    <div className="tool-terminal-wait">
                      {t.status === "running"
                        ? "运行中"
                        : t.status === "interrupted"
                          ? "已中断"
                          : "无输出"}
                    </div>
                  )}
                </div>
              </Fade>
            </div>
          ) : (
            <div
              className={`tool-compact-file-detail${hasDiff ? " has-diff-preview" : ""}`}
            >
              {hasDiff ? (
                a.diffs.map((d, i) => (
                  <DiffCard key={`${d.path}:${i}`} diff={d} />
                ))
              ) : (
                <div className="tool-error tool-markdown">
                  {a.body || "已中断"}
                </div>
              )}
            </div>
          )}
        </Collapse>
      )}
    </div>
  );
}
function ToolGroup({
  tools,
  actions,
}: {
  tools: ToolTrace[];
  actions: ToolActions;
}) {
  const [open, setOpen] = useState(useUnfolded()),
    parts = compactSummaryParts(tools);
  useApplyFoldMode(setOpen);
  // Removing no-enter later would restart CSS animation on this existing node.
  const initiallySingle = useRef(tools.length === 1);
  const uniform = parts.length === 1 ? parts[0].kind : null;
  const files = [
    ...new Set(
      tools
        .map((t) => t.activity.path?.replaceAll("\\", "/"))
        .filter((p): p is string => !!p),
    ),
  ];
  const sample =
    uniform === "bash"
      ? tools[0].activity.command?.replace(/\s+/g, " ").trim()
      : files
          .slice(0, 2)
          .map((p) => splitPath(p).name)
          .join(", ") + (files.length > 2 ? ` +${files.length - 2}` : "");
  const label = parts
    .map(
      (p) =>
        `${p.neutral ? "已写入" : { bash: "已运行", read: "已读取", edit: "已编辑", write: "已创建", other: "" }[p.kind]} ${p.count} ${p.kind === "bash" ? "条命令" : "个文件"}`,
    )
    .join(" · ");
  const running = tools.some((t) => t.status === "running"),
    failed = tools.filter(
      (t) => t.status === "error" || t.status === "interrupted",
    ).length;
  const hide = open && (uniform === "edit" || uniform === "write");
  const multiple = tools.length > 1;
  return (
    <div
      className={`tool-compact-group tool-kind-${uniform ?? "other"}${!multiple ? " is-single" : ""}${initiallySingle.current ? " no-enter" : ""}${open ? " open" : ""}${running ? " is-running" : ""}`}
    >
      {multiple && (
        <button
          type="button"
          className="tool-compact-summary"
          aria-expanded={open}
          title={label}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="tool-compact-icon">
            <Icon name={uniform ?? "stack"} />
          </span>
          <span className="tool-compact-label">{label}</span>
          {uniform && sample && !hide && (
            <span className="tool-compact-sample">{sample}</span>
          )}
          {failed > 0 && (
            <span className="tool-compact-failed">{failed} 失败</span>
          )}
          {!hide && <Stat stat={totalDiffStat(tools)} />}
          <Icon name="chevron" size={12} className="tool-compact-chevron" />
          {running && <Loader />}
        </button>
      )}
      <Collapse open={!multiple || open}>
        <div className={`tool-compact-lines${!multiple ? " is-single" : ""}`}>
          {tools.map((t) => (
            <ToolLine
              key={t.id}
              tool={t}
              actions={actions}
              uniform={multiple && !!uniform}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
}
function OtherTool({
  tool: t,
  actions,
}: {
  tool: ToolTrace;
  actions: ToolActions;
}) {
  const [open, setOpen] = useState(false),
    a = t.activity;
  if (a.agent) {
    const id = a.agent.candidateId,
      agent = id ? actions.agents.get(id) : undefined;
    return (
      <div
        className={`tool-compact-item tool-kind-other agent-compact${open ? " open" : ""}`}
      >
        <div className="tool-compact-line agent-compact-line">
          <button
            type="button"
            className="agent-compact-toggle is-lead"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="tool-compact-icon">
              <Icon name="agent" />
            </span>
            <span className="tool-compact-action">子代理</span>
          </button>
          {id && agent ? (
            <button
              type="button"
              className="agent-compact-name"
              onClick={() => actions.openAgent(id)}
            >
              {a.agent.description}
            </button>
          ) : (
            <span className="agent-compact-name is-static">
              {a.agent.description}
            </span>
          )}
          <button
            type="button"
            className="agent-compact-toggle is-tail"
            aria-label="展开任务概况"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="chevron" size={12} className="tool-compact-chevron" />
            {agent?.running === true ? (
              <Loader />
            ) : t.status === "error" ? (
              <Status status="error" />
            ) : t.status === "running" ? (
              <Loader />
            ) : null}
          </button>
        </div>
        <Collapse open={open}>
          <div className="tool-compact-out agent-compact-out">
            <Fade
              className="agent-summary-scroll"
              contentClass="process-thinking-text agent-summary-text"
            >
              <div className="agent-summary-task">
                <Prose text={a.agent.prompt} />
              </div>
              {a.body && (
                <div className="agent-summary-report">
                  <Prose text={a.body} />
                </div>
              )}
            </Fade>
          </div>
        </Collapse>
      </div>
    );
  }
  return (
    <article
      className={`tool-card tool-kind-other is-${t.status}${open ? " open" : ""}`}
    >
      <div className="tool-card-top">
        <button
          type="button"
          className="tool-card-head"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="tool-card-icon">
            <Icon name="other" />
          </span>
          <span className="tool-kind-label">
            {a.plan ? "执行清单" : "工具"}
          </span>
          <span className="tool-card-main">
            <span className="tool-card-name grow">
              {a.plan?.[0]?.text ?? t.name}
            </span>
          </span>
          <Icon name="chevron" size={12} className="tool-chevron" />
          <Status status={t.status} compact={false} />
        </button>
      </div>
      <Collapse open={open}>
        <div className="tool-card-body">
          <Fade className="tool-details-scroll">
            {a.plan ? (
              <div className="plan-checklist" role="list">
                {a.plan.map((p, i) => (
                  <div
                    key={i}
                    className={`plan-checklist-item is-${p.status}`}
                    role="listitem"
                  >
                    <span
                      className={`plan-status-icon plan-checklist-icon is-${p.status}`}
                    >
                      <Icon
                        name={
                          p.status === "completed"
                            ? "check"
                            : p.status === "in_progress"
                              ? "arrow"
                              : "circle"
                        }
                        size={11}
                      />
                    </span>
                    <span className="plan-checklist-text">{p.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="lane-raw-result">
                {a.body ?? (t.status === "running" ? "运行中" : "无文本结果")}
              </pre>
            )}
          </Fade>
        </div>
      </Collapse>
    </article>
  );
}
/** Run containers retain their first-call key when a stream appends more calls. */
function ToolRun({
  tools,
  actions,
}: {
  tools: ToolTrace[];
  actions: ToolActions;
}) {
  return tools[0].kind === "other" ? (
    <OtherTool tool={tools[0]} actions={actions} />
  ) : (
    <ToolGroup tools={tools} actions={actions} />
  );
}
export function ToolList({
  tools,
  actions,
}: {
  tools: ToolTrace[];
  actions: ToolActions;
}) {
  return (
    <div className="tool-card-list is-compact">
      {splitToolRuns(tools).map((run) => (
        <ToolRun key={run[0].id} tools={run} actions={actions} />
      ))}
    </div>
  );
}
