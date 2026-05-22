import type { Coach } from "../../_types";

type Props = {
  coach: Coach;
  size?: "sm" | "md";
  videoId?: string;
  position?: "top-right" | "bottom-left";
};

// Same source as the screen share but with `start=45` so it's visibly out of
// phase — makes it obvious to the demo viewer that two simultaneous streams
// are playing. In production these would be two separate Cloudflare Streams
// (coach face cam + coach screen share).
const DEFAULT_VIDEO_ID = "1cfIAVasP6E";

export default function CoachFacePip({
  coach,
  size = "md",
  videoId = DEFAULT_VIDEO_ID,
  position = "bottom-left",
}: Props) {
  const dims = size === "sm" ? "h-[64px] w-[104px]" : "h-[104px] w-[170px]";
  const anchor = position === "top-right" ? "top-3 right-3" : "bottom-3 left-3";
  return (
    <div
      className={`absolute ${anchor} ${dims} overflow-hidden rounded-lg border-2 border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.35)]`}
    >
      <iframe
        title={`${coach.name} face cam`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3&disablekb=1&start=45`}
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          border: "none",
          pointerEvents: "none",
          // Oversize to crop YouTube chrome, similar to CoachScreenShare.
          width: "calc(100% + 220px)",
          height: "calc(100% + 220px)",
        }}
      />
      <div className="pointer-events-none absolute bottom-1 left-1 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {coach.name}
      </div>
    </div>
  );
}
