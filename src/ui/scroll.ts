import { useCallback, useLayoutEffect, useRef, useState } from "react";
export function useLaneScroll(identity: string) {
  const viewport = useRef<HTMLDivElement>(null),
    surface = useRef<HTMLDivElement>(null);
  const pinned = useRef(true),
    [jump, setJump] = useState(false),
    [scrolling, setScrolling] = useState(false);
  const preserve = useCallback(async (action: () => Promise<void>) => {
    const v = viewport.current;
    if (!v) return;
    const height = v.scrollHeight,
      top = v.scrollTop;
    pinned.current = false;
    await action();
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => {
        v.scrollTop = top + v.scrollHeight - height;
        resolve();
      }),
    );
  }, []);
  const latest = useCallback(() => {
    const v = viewport.current;
    if (v) {
      pinned.current = true;
      v.scrollTop = v.scrollHeight;
      setJump(false);
    }
  }, []);
  useLayoutEffect(() => {
    const v = viewport.current!,
      s = surface.current!;
    pinned.current = true;
    let frame = 0,
      scrollFrame = 0;
    const distance = () =>
      Math.max(0, v.scrollHeight - v.clientHeight - v.scrollTop);
    const scroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const d = distance();
        setJump(d > 64);
      });
    };
    let lastTouch: number | undefined;
    const wheel = (e: WheelEvent) => {
      if (e.deltaY < 0) pinned.current = false;
    };
    const touch = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y !== undefined && lastTouch !== undefined && y > lastTouch)
        pinned.current = false;
      lastTouch = y;
    };
    const touchStart = () => {
      lastTouch = undefined;
    };
    const key = (e: KeyboardEvent) => {
      if (["ArrowUp", "PageUp", "Home"].includes(e.key)) pinned.current = false;
    };
    let previous = v.scrollTop;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const intent = () => {
      setScrolling(true);
      clearTimeout(idle);
      idle = setTimeout(() => setScrolling(false), 800);
      if (v.scrollTop < previous - 1) pinned.current = false;
      if (distance() <= 16) pinned.current = true;
      previous = v.scrollTop;
      scroll();
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pinned.current) v.scrollTop = v.scrollHeight;
        scroll();
      });
    });
    observer.observe(v);
    observer.observe(s);
    v.addEventListener("scroll", intent, { passive: true });
    v.addEventListener("wheel", wheel, { passive: true });
    v.addEventListener("touchstart", touchStart, { passive: true });
    v.addEventListener("touchmove", touch, { passive: true });
    v.addEventListener("keydown", key);
    latest();
    previous = v.scrollTop;
    return () => {
      observer.disconnect();
      clearTimeout(idle);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      v.removeEventListener("scroll", intent);
      v.removeEventListener("wheel", wheel);
      v.removeEventListener("touchstart", touchStart);
      v.removeEventListener("touchmove", touch);
      v.removeEventListener("keydown", key);
    };
  }, [identity, latest]);
  return { viewport, surface, jump, scrolling, latest, preserve };
}
