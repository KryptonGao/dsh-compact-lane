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
import {
  normalizeFoldMode,
  normalizeIconColor,
  type FoldMode,
} from "../settings";

export interface CompactSettings {
  foldMode?: FoldMode;
  iconColor?: boolean;
}
export type CompactSettingsForm = ConfigForm<CompactSettings>;
export interface SettingsInjected {
  hooks: { form: CompactSettingsForm };
  setFoldMode(mode: FoldMode): Promise<boolean>;
  setIconColor(on: boolean): Promise<boolean>;
}
export type SettingsProps = PropsRuntime<"settings.section"> &
  InjectFace<SettingsInjected>;

export const SECTION_LABEL = "紧凑对话";
const OPTIONS = [
  { value: "folded", label: "折叠" },
  { value: "unfolded", label: "不折叠" },
] as const;
const ICON_COLOR_OPTIONS = [
  { value: "off", label: "关闭" },
  { value: "on", label: "开启" },
] as const;
const HINT: Record<FoldMode, string> = {
  folded: "过程行和工具调用默认收起，点击后展开。",
  unfolded: "过程行和工具调用默认展开，仍可手动收起。",
};

export function SettingsSection({
  useForm,
  setFoldMode,
  setIconColor,
}: SettingsProps) {
  const snapshot = useForm((s) => s) as ConfigFormSnapshot<CompactSettings>;
  const [busy, setBusy] = useState(false),
    [failed, setFailed] = useState(false);
  const mode = normalizeFoldMode(snapshot.value?.foldMode);
  const iconColor = normalizeIconColor(snapshot.value?.iconColor);
  const disabled = busy || !snapshot.writable || snapshot.status !== "ready";
  const save = (write: Promise<boolean>) => {
    setFailed(false);
    setBusy(true);
    write
      .then((ok) => setFailed(!ok))
      .catch(() => setFailed(true))
      .finally(() => setBusy(false));
  };
  return (
    <div className="compact-lane-settings">
      <div className="compact-lane-settings-row">
        <div>
          <div className="compact-lane-settings-title">工具调用展示</div>
          <div className="compact-lane-settings-description">{HINT[mode]}</div>
        </div>
        <SegmentedControl
          id="compact-lane-fold-mode"
          label="工具调用展示"
          value={mode}
          options={OPTIONS}
          disabled={disabled}
          onChange={(next) => save(setFoldMode(next))}
        />
      </div>
      <div className="compact-lane-settings-row">
        <div>
          <div className="compact-lane-settings-title">工具图标配色</div>
          <div className="compact-lane-settings-description">
            开启后，每类工具调用的左侧图标使用各自的颜色；关闭则统一为灰色。
          </div>
        </div>
        <SegmentedControl
          id="compact-lane-icon-color"
          label="工具图标配色"
          value={iconColor ? "on" : "off"}
          options={ICON_COLOR_OPTIONS}
          disabled={disabled}
          onChange={(next) => save(setIconColor(next === "on"))}
        />
      </div>
      {failed && (
        <div role="alert" className="compact-lane-settings-error">
          设置未能保存。通过 --patch
          叠加层加载的插件，其配置无法由宿主写入；请改用 dsh plugin add 安装。
        </div>
      )}
    </div>
  );
}
