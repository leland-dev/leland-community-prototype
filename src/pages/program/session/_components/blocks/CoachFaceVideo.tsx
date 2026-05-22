import type { Coach } from "../../_types";

type Props = {
  coach: Coach;
  videoId?: string;
};

// Talking-head video — same one used on the Home community live post.
// Embeds beside the screen share to demonstrate both feeds playing at once.
const DEFAULT_VIDEO_ID = "1cfIAVasP6E";

export default function CoachFaceVideo({ coach, videoId = DEFAULT_VIDEO_ID, fill }: Props & { fill?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={fill ? { height: "100%" } : { aspectRatio: "16 / 9" }}
    >
      <iframe
        title={`${coach.name} face cam`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3&disablekb=1`}
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          border: "none",
          pointerEvents: "none",
          // Mild oversize to clip YouTube chrome at top/bottom. Anchored so
          // the cropped view biases toward the top of the frame (where the
          // speaker's face sits in a typical webcam shot).
          top: "-12%",
          width: "calc(100% + 60px)",
          height: "124%",
        }}
      />
      <div className="pointer-events-none absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm">
        <span className="h-1 w-1 rounded-full bg-[#E2574C] animate-pulse" />
        Live
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 z-10 text-[11px] font-medium text-white/95 drop-shadow">
        {coach.name}
      </div>
    </div>
  );
}
