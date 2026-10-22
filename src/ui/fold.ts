import { createContext, useContext, useEffect, useRef } from "react";
import type { FoldMode } from "../settings";

export const FoldModeContext = createContext<FoldMode>("folded");

export function useUnfolded(): boolean {
  return useContext(FoldModeContext) === "unfolded";
}

/** Mount reads the setting through `useState`'s initializer; later changes re-apply it to a live disclosure. */
export function useApplyFoldMode(setOpen: (open: boolean) => void): void {
  const unfolded = useUnfolded();
  const previous = useRef(unfolded);
  useEffect(() => {
    if (previous.current === unfolded) return;
    previous.current = unfolded;
    setOpen(unfolded);
  }, [unfolded, setOpen]);
}
