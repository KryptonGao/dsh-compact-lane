// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useLaneScroll } from "../src/ui/scroll";

let height = 1000;
let callbacks: FrameRequestCallback[];
let resize: () => void;
function Harness() {
  const lane = useLaneScroll("recording");
  return (
    <>
      <div ref={lane.viewport} data-testid="viewport">
        <div ref={lane.surface} />
      </div>
      <button onClick={lane.latest}>latest</button>
      <button
        onClick={() =>
          void lane.preserve(async () => {
            height += 500;
            resize();
          })
        }
      >
        older
      </button>
      <output>{String(lane.jump)}</output>
      <span data-testid="scrolling">{String(lane.scrolling)}</span>
    </>
  );
}
async function frames() {
  await act(async () => {
    await Promise.resolve();
    while (callbacks.length) {
      const batch = callbacks.splice(0);
      for (const callback of batch) callback(0);
    }
  });
}
beforeEach(() => {
  height = 1000;
  callbacks = [];
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(
    () => height,
  );
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(200);
  vi.stubGlobal("requestAnimationFrame", (f: FrameRequestCallback) => {
    callbacks.push(f);
    return callbacks.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("fades the scrollbar 800ms after scrolling and cancels the idle timer on unmount", () => {
  vi.useFakeTimers();
  const view = render(<Harness />);
  fireEvent.scroll(screen.getByTestId("viewport"));
  expect(screen.getByTestId("scrolling").textContent).toBe("true");
  act(() => vi.advanceTimersByTime(799));
  expect(screen.getByTestId("scrolling").textContent).toBe("true");
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByTestId("scrolling").textContent).toBe("false");
  fireEvent.scroll(screen.getByTestId("viewport"));
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("follows height changes only while pinned, restores within 16px, and shows jump after 64px", async () => {
  render(<Harness />);
  const viewport = screen.getByTestId("viewport");
  // jsdom does not clamp scrollTop; simulate the browser's initial bottom.
  viewport.scrollTop = 800;
  fireEvent.scroll(viewport);
  height = 1100;
  resize();
  await frames();
  expect(viewport.scrollTop).toBe(1100);
  viewport.scrollTop = 900;
  fireEvent.scroll(viewport);
  // Upward intent must survive a resize that fires before native scrolling.
  fireEvent.wheel(viewport, { deltaY: -100 });
  resize();
  await frames();
  expect(viewport.scrollTop).toBe(900);
  viewport.scrollTop = 800;
  fireEvent.scroll(viewport);
  height = 1200;
  resize();
  await frames();
  expect(viewport.scrollTop).toBe(800);
  expect(screen.getByRole("status").textContent).toBe("true");
  viewport.scrollTop = 984;
  fireEvent.scroll(viewport);
  await frames();
  expect(screen.getByRole("status").textContent).toBe("false");
  height = 1300;
  resize();
  await frames();
  expect(viewport.scrollTop).toBe(1300);
});
it("preserves the viewport when older content is prepended, and latest restores following", async () => {
  render(<Harness />);
  const viewport = screen.getByTestId("viewport");
  viewport.scrollTop = 120;
  fireEvent.scroll(viewport);
  fireEvent.click(screen.getByText("older"));
  await frames();
  expect(viewport.scrollTop).toBe(620);
  height = 1600;
  resize();
  await frames();
  expect(viewport.scrollTop).toBe(620);
  fireEvent.click(screen.getByText("latest"));
  height = 1700;
  resize();
  await frames();
  expect(viewport.scrollTop).toBe(1700);
});
