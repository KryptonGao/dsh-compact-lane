import { type ReactNode } from "react";
import { Icon } from "./primitives";
import { useLaneScroll } from "./scroll";
export function Lane({
  identity,
  children,
  header,
  page,
}: {
  identity: string;
  children: ReactNode;
  header?: ReactNode;
  page?: { loading: boolean; load: () => Promise<void> };
}) {
  const { viewport, surface, jump, scrolling, latest, preserve } =
    useLaneScroll(identity);
  return (
    <div
      data-dsh-compact-lane=""
      data-scheme="light"
      data-conversation-composer-overlay=""
    >
      <div className="main-chat-view" data-tool-display="compact">
        <div className="chat-conversation-pane">
          <div
            ref={viewport}
            className={`chat-scroll-area${scrolling ? " is-scrolling" : ""}`}
            tabIndex={0}
            aria-label="紧凑对话"
          >
            <div ref={surface} className="chat-message-surface">
              {page && (
                <button
                  type="button"
                  className="lane-load-older"
                  disabled={page.loading}
                  onClick={() => void preserve(page.load)}
                >
                  {page.loading ? "正在加载…" : "加载更早的消息"}
                </button>
              )}
              {header}
              {children}
            </div>
          </div>
          <button
            type="button"
            className="chat-jump-latest"
            data-visible={jump ? "true" : "false"}
            aria-hidden={!jump}
            tabIndex={jump ? 0 : -1}
            onClick={latest}
          >
            <span>回到最新</span>
            <Icon name="down" size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
