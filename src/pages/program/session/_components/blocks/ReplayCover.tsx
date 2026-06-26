import BuildScreen from "./BuildScreen";

// Just-ended "canvas" — reuses the BuildScreen mock but with a clear REPLAY
// chip and a big play affordance over the top so it reads as a paused
// recording. Same 16:9 footprint as the live canvas.
export default function ReplayCover() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <BuildScreen />

      {/* Replay chip */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#A5E446]" />
        Replay
      </div>

      {/* Dim layer + big play button */}
      <div className="absolute inset-0 z-0 bg-black/35" />
      <button
        type="button"
        aria-label="Play recording"
        className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-transform hover:scale-105"
      >
        <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor" aria-hidden>
          <path d="M2 1.5v19l16-9.5L2 1.5z" />
        </svg>
      </button>
    </div>
  );
}
