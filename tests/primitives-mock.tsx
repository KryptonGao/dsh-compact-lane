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
