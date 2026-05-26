import type { Coach } from "../../_types";

type Props = {
  coach: Coach;
  size?: "sm" | "md";
  videoId?: string;
  position?: "top-right" | "bottom-left";
  /** Extra classes merged into the root — useful for responsive hiding (e.g. `lg:hidden`). */
  className?: string;
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
  className = "",
}: Props) {
  // Mobile gets a smaller near-square tile so it reads as a typical video-
  // call PIP without dominating the slide. Desktop keeps the landscape tile.
  const dims =
    size === "sm"
      ? "h-[56px] w-[72px] lg:h-[64px] lg:w-[104px]"
      : "h-[72px] w-[88px] lg:h-[104px] lg:w-[170px]";
  const anchor =
    position === "top-right" ? "top-2 right-2 lg:top-3 lg:right-3" : "bottom-2 left-2 lg:bottom-3 lg:left-3";
  return (
    <div
      className={`absolute ${anchor} ${dims} overflow-hidden rounded-lg border-2 border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${className}`}
    >
      <iframe
        title={`${coach.name} face cam`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3&disablekb=1&start=45`}
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          border: "none",
          pointerEvents: "none",
          // Bias the crop toward the top of the video frame so the speaker's
          // head sits in view. Without this the iframe centers vertically and
          // we end up framing the torso. Wide horizontal oversize keeps
          // YouTube chrome at left/right cropped out.
          top: "-10%",
          width: "calc(100% + 180px)",
          height: "150%",
        }}
      />
      <div className="pointer-events-none absolute bottom-1 left-1 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {coach.name}
      </div>
    </div>
  );
}
