import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  /** Viewport-pixel top for the LOW snap (smaller tray, below the page chrome). */
  lowTop: number;
  /** Viewport-pixel top for the HIGH snap (taller tray, just below the video). */
  highTop: number;
  children: ReactNode;
};

// Mobile chat tray. Persistent overlay (not a modal) with two snap points
// the user drags between via the handle bar at the top. LOW = top sits below
// the page chrome (title + coach card + tab pills). HIGH = top sits below
// the video, covering everything else. Drag handle uses pointer events so
// it works for both touch and mouse.
export default function BottomTray({ open, lowTop, highTop, children }: Props) {
  const [snap, setSnap] = useState<"low" | "high">("low");
  const [dragTop, setDragTop] = useState<number | null>(null);
  const startYRef = useRef(0);
  const startTopRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSnap("low");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onPointerDown(e: React.PointerEvent) {
    startYRef.current = e.clientY;
    startTopRef.current = snap === "low" ? lowTop : highTop;
    setDragTop(startTopRef.current);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragTop === null) return;
    const dy = e.clientY - startYRef.current;
    const next = Math.max(highTop, Math.min(lowTop, startTopRef.current + dy));
    setDragTop(next);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragTop === null) return;
    const mid = (highTop + lowTop) / 2;
    setSnap(dragTop < mid ? "high" : "low");
    setDragTop(null);
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  if (typeof document === "undefined") return null;

  const top = dragTop ?? (snap === "low" ? lowTop : highTop);

  return createPortal(
    <div
      role="dialog"
      aria-modal="false"
      aria-hidden={!open}
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl bg-white shadow-[0_-18px_50px_rgba(0,0,0,0.18)] lg:hidden"
      style={{
        top,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition:
          dragTop === null
            ? "top 280ms cubic-bezier(0.2,0.7,0.2,1), transform 300ms ease-out"
            : "transform 300ms ease-out",
      }}
    >
      {/* Drag handle — chunky tap target with touch-action:none so the
          browser doesn't steal the vertical swipe for page scroll. */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex shrink-0 cursor-grab touch-none justify-center py-2.5 active:cursor-grabbing"
        aria-label="Drag to expand or collapse"
      >
        <span className="h-1 w-10 rounded-full bg-gray-stroke" />
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>,
    document.body,
  );
}
