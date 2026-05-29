import { useEffect, useState } from "react";
import { Button } from "../../../../../components/Button";
import type { Session } from "../../_types";

// Pre-session canvas — minimal grey waiting screen. Live countdown that
// ticks every second, plus a single "Add to calendar" CTA using the
// shared Button component. Session title / metadata live in the TopBar
// below the canvas so we don't repeat them here.
export default function PreSessionCover({ session }: { session: Session }) {
  const startsAt = new Date(session.startsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const totalSec = Math.max(0, Math.floor((startsAt - now) / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  // Show all four units once we're inside a day; show d/h/m/s when farther
  // out so the layout doesn't jump as time passes.
  const segments: string[] = [];
  if (days) segments.push(`${days}d`);
  if (days || hours) segments.push(`${hours}h`);
  segments.push(`${minutes}m`);
  segments.push(`${String(seconds).padStart(2, "0")}s`);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[#E8E8E5] text-gray-dark">
      <div className="flex flex-col items-center gap-2">
        <div className="text-[12px] uppercase tracking-[0.18em] text-gray-light lg:text-[13px]">
          Starts in
        </div>
        <div className="font-semibold leading-none tabular-nums text-gray-dark text-[40px] sm:text-[52px] lg:text-[72px]">
          {segments.join(" ")}
        </div>
      </div>
      <Button size="md" variant="primary">Add to calendar</Button>
    </div>
  );
}
