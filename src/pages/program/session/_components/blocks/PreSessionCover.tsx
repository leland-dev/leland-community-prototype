import type { Session } from "../../_types";

// Pre-session "canvas" — stands in for what fills the main video slot before
// the stream goes live. Black background, lime accent, countdown, coach name,
// and a calendar CTA. Same 16:9 footprint as the live BuildScreen so the
// layout doesn't jump when the state changes.
export default function PreSessionCover({ session }: { session: Session }) {
  const startsAt = new Date(session.startsAt);
  const ms = startsAt.getTime() - Date.now();
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const minutes = totalMin % 60;

  // Pick the two largest non-zero units for a friendly readout.
  const segments: string[] = [];
  if (days) segments.push(`${days}d`);
  if (hours || days) segments.push(`${hours}h`);
  if (!days) segments.push(`${minutes}m`);
  const countdown = segments.join(" ");

  const startLabel = startsAt.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-8 text-white lg:p-12">
      {/* Lime tick + meta */}
      <div>
        <div className="h-[2px] w-12 bg-[#A5E446]" />
        <div className="mt-4 font-mono text-[12px] font-medium tracking-[0.2em] text-[#A5E446] lg:text-[14px]">
          AI BUILDER PROGRAM · LEVEL 1 · SESSION {session.number}
        </div>
      </div>

      {/* Countdown + title */}
      <div>
        <div className="text-[14px] uppercase tracking-[0.18em] text-white/55 lg:text-[15px]">
          Starts in
        </div>
        <div className="mt-1 font-semibold leading-none text-white text-[44px] sm:text-[56px] lg:text-[72px]">
          {countdown}
        </div>
        <h2 className="mt-5 text-[20px] font-medium leading-[1.1] text-white sm:text-[24px] lg:text-[28px]">
          {session.title}
        </h2>
        <div className="mt-1 text-[13px] text-white/60 lg:text-[14px]">
          {startLabel} · with {session.coach.name}
        </div>
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full bg-[#A5E446] px-4 py-2 text-[13px] font-semibold text-black transition-opacity hover:opacity-90"
        >
          Add to calendar
        </button>
        <button
          type="button"
          className="rounded-full border border-white/25 bg-transparent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
        >
          Test your setup
        </button>
      </div>
    </div>
  );
}
