import type { ReactNode } from "react";
export function MarkdownText({ text }: { text: string }) {
  return <p>{text}</p>;
}
export async function writeClipboard() {
  return true;
}
export function MarkdownDelegateProvider({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
/** Same contract as the host's tablist: one tab per option, `aria-selected` marks the value. */
export function SegmentedControl<Value extends string>({
  value,
  options,
  onChange,
  label,
  disabled = false,
}: {
  id: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onChange: (next: Value) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          disabled={disabled}
          onClick={() => option.value !== value && onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
