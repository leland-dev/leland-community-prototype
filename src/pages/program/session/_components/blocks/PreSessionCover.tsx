import type { Session } from "../../_types";

// Pre-session canvas — minimal grey waiting screen. Just a countdown and a
// single CTA. Session title / metadata live in the TopBar below the canvas
// so we don't repeat them here.
export default function PreSessionCover({ session }: { session: Session }) {
  const startsAt = new Date(session.startsAt);
  const ms = startsAt.getTime() - Date.now();
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const minutes = totalMin % 60;

  const segments: string[] = [];
  if (days) segments.push(`${days}d`);
  if (hours || days) segments.push(`${hours}h`);
  if (!days) segments.push(`${minutes}m`);
  const countdown = segments.join(" ");

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[#E8E8E5] text-gray-dark">
      <div className="flex flex-col items-center gap-2">
        <div className="text-[12px] uppercase tracking-[0.18em] text-gray-light lg:text-[13px]">
          Starts in
        </div>
        <div className="font-semibold leading-none tabular-nums text-gray-dark text-[52px] sm:text-[64px] lg:text-[88px]">
          {countdown}
        </div>
      </div>
      <button
        type="button"
        className="rounded-full bg-gray-dark px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#222]"
      >
        Add to calendar
      </button>
    </div>
  );
}
