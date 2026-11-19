import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import chartIcon from "../assets/icons/Business, Chart.7.svg";

// "Your level" roll-up card: a segmented gradient meter that sweeps in on
// mount, with a full-bleed "See breakdown" accordion welded to the bottom
// edge. Driven entirely by props — no backend.

const GAUGE_BARS = 60;
const FILL_GRADIENT = "linear-gradient(90deg, #cfdfff 0%, #9ebdfd 33.33%, #3470fb 66.67%, #154ed1 100%)";

// The meter gradient's stops (position 0..1 → RGB), used both for the main
// gauge and to sample discrete colors for the per-dimension segment meters.
const GRADIENT_STOPS: [number, [number, number, number]][] = [
  [0, [207, 223, 255]],
  [1 / 3, [158, 189, 253]],
  [2 / 3, [52, 112, 251]],
  [1, [21, 78, 209]],
];

function sampleGradient(t: number): string {
  const x = Math.min(Math.max(t, 0), 1);
  for (let i = 1; i < GRADIENT_STOPS.length; i++) {
    const [p0, c0] = GRADIENT_STOPS[i - 1];
    const [p1, c1] = GRADIENT_STOPS[i];
    if (x <= p1) {
      const f = p1 === p0 ? 0 : (x - p0) / (p1 - p0);
      const mix = (a: number, b: number) => Math.round(a + f * (b - a));
      return `rgb(${mix(c0[0], c1[0])}, ${mix(c0[1], c1[1])}, ${mix(c0[2], c1[2])})`;
    }
  }
  const last = GRADIENT_STOPS[GRADIENT_STOPS.length - 1][1];
  return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
}

export type LevelDimension = {
  index: string; // "01"
  title: string;
  description: string;
  score: number; // e.g. 3
  max: number; // e.g. 5
  levelLabel: string; // e.g. "Analysis"
};

// ── The main meter ──────────────────────────────────────────────────────────
// 60 whole bars (flex: 1 so the browser splits the width evenly — no pixel math,
// no half-bars). Filled bars each show their slice of one continuous gradient
// that spans exactly the filled run, so the deepest color lands on the last
// filled bar at any value.
function Gauge({ value, label }: { value: number; label: string }) {
  const isOn = (i: number) => i / (GAUGE_BARS - 1) <= value + 0.5 / GAUGE_BARS;
  const filledCount = Math.max(
    Array.from({ length: GAUGE_BARS }, (_, i) => isOn(i)).filter(Boolean).length,
    1,
  );

  return (
    <div role="img" aria-label={label} className="relative flex h-[56px] gap-[0.7%] sm:h-[56px]">
      {Array.from({ length: GAUGE_BARS }, (_, i) => {
        const on = isOn(i);
        const pos = filledCount > 1 ? (i / (filledCount - 1)) * 100 : 0;
        return (
          <span key={i} className="relative min-w-[2px] flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
            {on && (
              <span
                className="your-level-fill absolute inset-0 rounded-[inherit] bg-no-repeat"
                style={{
                  backgroundImage: FILL_GRADIENT,
                  backgroundSize: `calc(${filledCount} * 100%) 100%`,
                  backgroundPosition: `${pos.toFixed(2)}% 0`,
                  transformOrigin: "bottom",
                  ["--bar-i" as string]: i,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Per-dimension mini meter ────────────────────────────────────────────────
// A fixed `max`-segment gradient scale with a black tick marking the score
// (centered in the scored segment).
function SegmentMeter({ score, max, className = "" }: { score: number; max: number; className?: string }) {
  const tickLeft = ((score - 0.5) / max) * 100;
  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-1.5">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className="h-2 flex-1 rounded-full"
            style={{ backgroundColor: sampleGradient(max > 1 ? i / (max - 1) : 0) }}
          />
        ))}
      </div>
      <span
        className="absolute top-1/2 h-[14px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#222222]"
        style={{ left: `${tickLeft}%` }}
      />
    </div>
  );
}

function BreakdownCard({ dim }: { dim: LevelDimension }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e5e5e5] p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-semibold leading-[1.3] text-[#222222]">{dim.title}</h3>
        <span className="shrink-0 text-[13px] font-medium tabular-nums text-[#9aa0a6]">{dim.index}</span>
      </div>
      <p className="mt-2 text-[15px] leading-[1.45] text-[#4c4c4c]">{dim.description}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[30px] font-medium leading-none text-[#222222]">{dim.score}</span>
          <span className="text-[14px] text-[#4c4c4c]">of {dim.max}</span>
        </div>
        <span className="text-[14px] text-[#222222] underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">
          {dim.levelLabel}
        </span>
      </div>
      <SegmentMeter score={dim.score} max={dim.max} className="mt-3" />
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </svg>
  );
}

// Business, Chart.7.svg has hardcoded colors, so tint it via CSS mask +
// bg-current (follows the label's #222) instead of a plain <img>.
function ChartIcon() {
  return (
    <span
      aria-hidden
      className="h-5 w-5 shrink-0 bg-current"
      style={{
        maskImage: `url("${chartIcon}")`,
        WebkitMaskImage: `url("${chartIcon}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export default function YourLevelCard({
  title,
  description,
  value,
  startLabel,
  endLabel,
  breakdown,
}: {
  title: string;
  description: string;
  value: number; // 0..1
  startLabel: string;
  endLabel: string;
  breakdown: LevelDimension[] | ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative flex flex-col gap-3 rounded-[24px] border border-[#e5e5e5] bg-white p-[22px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] max-sm:p-[18px]">
      {/* Header */}
      <div className="flex items-center gap-1.5 text-[14px] font-medium text-[#4c4c4c]">
        Your level
        <span className="text-[#4c4c4c]"><InfoIcon /></span>
      </div>
      <h2 className="font-serif text-[30px] font-medium leading-none text-[#222222]">{title}</h2>
      <p className="max-w-[62ch] text-[15px] leading-[1.5] text-[#222222]">{description}</p>

      {/* Meter + captions */}
      <div className="mt-2 flex flex-col gap-2.5">
        <Gauge value={value} label={title} />
        <div className="flex justify-between text-[14px] text-[#4c4c4c]">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </div>

      {/* Full-bleed "See breakdown" accordion — last child so the negative
          margins pull it to the card's bottom edge. */}
      <div className="mt-1 -mx-[22px] -mb-[22px] border-t border-[#e5e5e5] max-sm:-mx-[18px] max-sm:-mb-[18px]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full select-none items-center justify-between gap-3 px-[22px] py-[15px] max-sm:px-[18px]"
        >
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#222222]">
            <ChartIcon />
            {open ? "Hide breakdown" : "See breakdown"}
          </span>
          <svg
            className={`shrink-0 text-[#4c4c4c] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="breakdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-[22px] pb-[22px] pt-0.5 max-sm:px-[18px] max-sm:pb-[18px]">
                {Array.isArray(breakdown) ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {breakdown.map((dim) => (
                      <BreakdownCard key={dim.index} dim={dim} />
                    ))}
                  </div>
                ) : (
                  breakdown
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
