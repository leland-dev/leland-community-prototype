import { useEffect, useRef, useState } from "react";

// Show first time after this many seconds, then again every REPEAT seconds
// while hidden so we periodically nudge the user to rate. Long delays so the
// popup doesn't interrupt testing the rest of the page.
const FIRST_SHOW_DELAY_MS = 120_000; // 2 min
const REPEAT_DELAY_MS = 300_000; // 5 min
const THANK_YOU_HOLD_MS = 1_800;

function Star({
  filled,
  half,
}: {
  filled: boolean;
  half?: boolean;
}) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill={filled ? "#F5B729" : "none"}
      aria-hidden
    >
      <path
        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.32l-5.8 3.04 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"
        stroke={filled || half ? "#F5B729" : "#D5D5D5"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RateSessionPopup({ suppressed }: { suppressed?: boolean } = {}) {
  const [visible, setVisible] = useState(false);
  const [rated, setRated] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const repeatTimerRef = useRef<number | null>(null);

  // Schedule first appearance + recurring re-appearances.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = window.setTimeout(() => setVisible(true), FIRST_SHOW_DELAY_MS);
    return () => {
      window.clearTimeout(initial);
      if (repeatTimerRef.current) window.clearTimeout(repeatTimerRef.current);
    };
  }, []);

  // After dismiss (or rate-then-thanks), schedule another appearance.
  function scheduleNext() {
    if (typeof window === "undefined") return;
    if (repeatTimerRef.current) window.clearTimeout(repeatTimerRef.current);
    repeatTimerRef.current = window.setTimeout(() => {
      setRated(null);
      setHovered(null);
      setVisible(true);
    }, REPEAT_DELAY_MS);
  }

  function dismiss() {
    setVisible(false);
    scheduleNext();
  }

  function handleRate(n: number) {
    setRated(n);
    // Hold the "Thanks!" state briefly, then hide and schedule another nudge later.
    window.setTimeout(() => {
      setVisible(false);
      scheduleNext();
    }, THANK_YOU_HOLD_MS);
  }

  const previewCount = hovered ?? 0;
  const displayCount = rated ?? previewCount;

  return (
    <div
      className={`absolute bottom-6 left-6 z-40 w-[260px] rounded-2xl border border-gray-stroke bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-all duration-300 ${
        visible && !suppressed
          ? "opacity-100 translate-y-0"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      role="dialog"
      aria-hidden={!visible || !!suppressed}
      aria-label="Rate this session"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-gray-dark">
          {rated ? "Thanks for the feedback!" : "Rate this session"}
        </h3>
        <button
          type="button"
          onClick={dismiss}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => !rated && handleRate(n)}
            onMouseEnter={() => !rated && setHovered(n)}
            onMouseLeave={() => !rated && setHovered(null)}
            disabled={!!rated}
            className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-default disabled:hover:scale-100"
            aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
          >
            <Star filled={n <= displayCount} />
          </button>
        ))}
      </div>
    </div>
  );
}
