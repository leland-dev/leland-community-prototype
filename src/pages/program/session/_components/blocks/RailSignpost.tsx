// Compact signpost tile sized for the V4 right rail (~340×191).
//
// The full ProgramSlide (rendered via CoachScreenShare) was designed for the
// main video canvas, where the SVG viewBox scales text comfortably. At rail
// size the same content shrinks to ~21% and the subtitle becomes illegible.
// This component is HTML/CSS instead — fixed, readable type sizes that look
// right at this tile's actual rendered dimensions.

import type { Session } from "../../_types";

type Props = {
  session: Session;
  /** Optional progress fraction (0–1) to render the small bar at the bottom. */
  progress?: number;
};

export default function RailSignpost({ session, progress = 0.35 }: Props) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-4 text-white">
      {/* Lime accent tick + meta */}
      <div>
        <div className="h-[2px] w-10 bg-[#A5E446]" />
        <div className="mt-3 font-mono text-[11px] font-medium tracking-[0.18em] text-[#A5E446]">
          SESSION {session.number} · LEVEL 1
        </div>
      </div>

      {/* Title */}
      <div className="-mt-2">
        <h3 className="text-[18px] font-semibold leading-[1.15] tracking-tight">
          {session.title}
        </h3>
      </div>

      {/* Progress + step label */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/55">
          <span>Step 2 of 5 · Tool router</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="relative h-[3px] w-full rounded-full bg-white/12">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#A5E446]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
