import { useState } from "react";
import { SegmentedControl } from "@deepseek-ai/dsh-client-ui-primitives";
import type {
  InjectFace,
  PropsRuntime,
} from "@deepseek-ai/dsh-client-ui-slots";
import type {
  ConfigForm,
  ConfigFormSnapshot,
} from "@deepseek-ai/dsh-client-ui-settings/client";
import { normalizeFoldMode, type FoldMode } from "../settings";

export type CompactSettingsForm = ConfigForm<{ foldMode?: FoldMode }>;
export interface SettingsInjected {
  hooks: { form: CompactSettingsForm };
  setFoldMode(mode: FoldMode): Promise<boolean>;
}
export type SettingsProps = PropsRuntime<"settings.section"> &
  InjectFace<SettingsInjected>;

export const SECTION_LABEL = "紧凑对话";
const OPTIONS = [
  { value: "folded", label: "折叠" },
  { value: "unfolded", label: "不折叠" },
] as const;
const HINT: Record<FoldMode, string> = {
  folded: "过程行和工具调用默认收起，点击后展开。",
  unfolded: "过程行和工具调用默认展开，仍可手动收起。",
};

export function SettingsSection({ useForm, setFoldMode }: SettingsProps) {
  const snapshot = useForm((s) => s) as ConfigFormSnapshot<{
    foldMode?: FoldMode;
  }>;
  const [busy, setBusy] = useState(false),
    [failed, setFailed] = useState(false);
  const mode = normalizeFoldMode(snapshot.value?.foldMode);
  return (
    <div className="compact-lane-settings">
      <div className="compact-lane-settings-row">
        <div>
          <div className="compact-lane-settings-title">工具调用展示</div>
          <div className="compact-lane-settings-description">{HINT[mode]}</div>
          {failed && (
            <div role="alert" className="compact-lane-settings-error">
              设置未能保存。通过 --patch
              叠加层加载的插件，其配置无法由宿主写入；请改用 dsh plugin add
              安装。
            </div>
          )}
        </div>
        <SegmentedControl
          id="compact-lane-fold-mode"
          label="工具调用展示"
          value={mode}
          options={OPTIONS}
          disabled={busy || !snapshot.writable || snapshot.status !== "ready"}
          onChange={(next) => {
            setFailed(false);
            setBusy(true);
            setFoldMode(next)
              .then((ok) => setFailed(!ok))
              .catch(() => setFailed(true))
              .finally(() => setBusy(false));
          }}
        />
      </div>
    </div>
  );
}
