import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  MarkdownText,
  writeClipboard,
} from "@deepseek-ai/dsh-client-ui-primitives";

const paths: Record<string, ReactNode> = {
  chevron: <polyline points="9 18 15 12 9 6" />,
  check: <polyline points="20 6 9 17 4 12" />,
  x: (
    <>
      <path d="m18 6-12 12M6 6l12 12" />
    </>
  ),
  bash: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <polyline points="7 9 10 12 7 15" />
      <path d="M12 15h5" />
    </>
  ),
  read: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  write: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M12 12v6M9 15h6" />
    </>
  ),
  stack: (
    <>
      <path d="m12 2 10 5-10 5L2 7Zm-10 10 10 5 10-5M2 17l10 5 10-5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  branch: (
    <>
      <path d="M6 3v12M18 9a9 9 0 0 1-9 9" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
    </>
  ),
  agent: (
    <>
      <rect x="8.5" y="3" width="7" height="7" rx="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.8" />
      <path d="M12 10v2M6.5 14v-2h11v2" />
    </>
  ),
  other: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
  ),
  down: <path d="M12 5v14m-7-7 7 7 7-7" />,
  circle: <circle cx="12" cy="12" r="9" />,
  arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
};
export function Icon({
  name,
  size = 13,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "chevron" ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.other}
    </svg>
  );
}
export function Loader() {
  return (
    <span
      className="tool-activity-loader dot-loader"
      role="status"
      aria-label="运行中"
    >
      {Array.from({ length: 36 }, (_, i) => (
        <i
          key={i}
          style={
            {
              "--d": `${((((Math.floor(i / 6) + (i % 6)) * 0.14) % 1) - 1) * 2}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
export function Status({
  status,
  compact = true,
}: {
  status: string;
  compact?: boolean;
}) {
  const state = status === "interrupted" ? "error" : status;
  return (
    <span
      className={`content-swap tool-status-swap ${compact ? "compact" : ""} is-${state}`}
    >
      {state === "running" ? (
        <span className="content-swap-current">
          <Loader />
        </span>
      ) : state === "error" ? (
        <span
          className="content-swap-current tool-compact-error"
          role="img"
          aria-label={status === "interrupted" ? "已中断" : "失败"}
        >
          <Icon name="x" size={11} />
        </span>
      ) : !compact ? (
        <span className="content-swap-current tool-status done">
          <Icon name="check" size={11} />
        </span>
      ) : null}
    </span>
  );
}
/** First opening mounts, subsequent closings keep subtree identity and exclude focus. */
export function Collapse({
  open,
  children,
  process = false,
}: {
  open: boolean;
  children: ReactNode;
  process?: boolean;
}) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  return (
    <div
      className={process ? "time-spent-body" : "tool-collapse"}
      aria-hidden={!open}
      {...(!open ? { inert: "" } : {})}
    >
      <div
        className={process ? "time-spent-body-inner" : "tool-collapse-inner"}
      >
        {(mounted || open) && children}
      </div>
    </div>
  );
}
export function Prose({
  text,
  streaming = false,
}: {
  text: string;
  streaming?: boolean;
}) {
  return (
    <div className="md-content">
      <MarkdownText
        text={text}
        streaming={streaming}
        labels={{
          code: { copyLabel: "复制代码", copiedLabel: "已复制" },
          footnotes: "脚注",
        }}
      />
    </div>
  );
}
export function Copy({
  text,
  className = "reply-action",
  label = "复制",
  iconOnly = false,
}: {
  text: string;
  className?: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={label}
        title={label}
        onClick={async () => {
          const ok = await writeClipboard(text);
          setCopied(ok);
          setError(!ok);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            setCopied(false);
            setError(false);
          }, 1400);
        }}
      >
        <Icon name={copied ? "check" : "copy"} />
        {!iconOnly && <span>{copied ? "已复制" : label}</span>}
      </button>
      {error && (
        <span role="status" className="lane-action-error">
          复制失败
        </span>
      )}
    </>
  );
}
export function FileBadge({ path }: { path: string }) {
  const ext = path.split(".").at(-1)?.toLowerCase() ?? "f";
  const colors: Record<string, string> = {
    ts: "#3178c6",
    tsx: "#3178c6",
    js: "#c7a51b",
    json: "#7d8e36",
    css: "#8d62b5",
    md: "#778399",
    py: "#3a7ba7",
  };
  return (
    <span
      className="file-type-icon lane-file-badge"
      style={{ background: colors[ext] ?? "#8b95a7" }}
    >
      {ext.slice(0, 2).toUpperCase()}
    </span>
  );
}
/** Same small token set as the reference demo; React escapes all source text. */
export function CodeText({ text }: { text: string }) {
  const re =
    /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|export|function|return|await|async|import|from|if|else|throw|new|type|interface|extends|for|of|while|catch|try|default|as)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Z][A-Za-z0-9]*)\b|\b([a-zA-Z_$][\w$]*)(?=\()/gm;
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    parts.push(text.slice(last, m.index));
    const kind = m[1]
      ? "comment"
      : m[2]
        ? "string"
        : m[3]
          ? "keyword"
          : m[4]
            ? "number"
            : m[5]
              ? "type"
              : "function";
    parts.push(
      <span key={m.index} style={{ color: `var(--syntax-${kind})` }}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{text ? parts : " "}</>;
}
export function Fade({
  children,
  className = "",
  contentClass = "",
}: {
  children: ReactNode;
  className?: string;
  contentClass?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null),
    content = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: 0, bottom: 0 });
  useLayoutEffect(() => {
    const v = viewport.current!,
      c = content.current!;
    const smooth = (x: number) => {
      const t = Math.max(0, Math.min(1, x / 24));
      return t * t * (3 - 2 * t);
    };
    const sync = () =>
      setEdges({
        top: smooth(v.scrollTop),
        bottom: smooth(v.scrollHeight - v.clientHeight - v.scrollTop),
      });
    const observer = new ResizeObserver(sync);
    observer.observe(v);
    observer.observe(c);
    v.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      v.removeEventListener("scroll", sync);
    };
  }, []);
  return (
    <div className={`thinking-scroll-shell has-content-edge-blur ${className}`}>
      <div
        className="thinking-scroll-viewport"
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label="可在区域内滚动"
      >
        <div
          ref={content}
          className={`stream-prose-block thinking-text ${contentClass}`}
        >
          {children}
        </div>
      </div>
      <div
        className="thinking-scroll-fade thinking-scroll-fade-top"
        aria-hidden="true"
        style={{ opacity: edges.top }}
      />
      <div
        className="thinking-scroll-fade thinking-scroll-fade-bottom"
        aria-hidden="true"
        style={{ opacity: edges.bottom }}
      />
    </div>
  );
}
