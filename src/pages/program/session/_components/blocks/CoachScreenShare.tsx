import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  videoId?: string;
};

// When videoId is provided, embed that YouTube video. Otherwise render the
// AI Builder Program slide as an inline SVG — the whole composition scales
// as a single unit when the container shrinks, so the text never feels out
// of step with the slide.
export default function CoachScreenShare({ children, videoId }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
      {videoId ? <YouTubeEmbed videoId={videoId} /> : <ProgramSlide />}
      {children}
    </div>
  );
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <iframe
      title="Live session video"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3&disablekb=1`}
      allow="autoplay; encrypted-media"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        border: "none",
        pointerEvents: "none",
        width: "calc(100% + 160px)",
        height: "calc(100% + 160px)",
      }}
    />
  );
}

// AI Builder Program slide as an inline SVG. The whole composition lives in
// a 1600×900 viewBox, so every element (text, accent line, badge) scales
// together with the container size. Default preserveAspectRatio "xMidYMid
// meet" letterboxes when the container aspect differs — invisible since the
// SVG background is also black.
function ProgramSlide() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ship Your First Agent Team — AI Builder Program Level 2 Session 1"
    >
      {/* Background */}
      <rect width="1600" height="900" fill="#000000" />

      {/* Lime accent line — short, top-left */}
      <line
        x1="140"
        y1="180"
        x2="320"
        y2="180"
        stroke="#A5E446"
        strokeWidth="3"
      />

      {/* Meta */}
      <text
        x="140"
        y="240"
        fill="#A5E446"
        fontFamily="Menlo, monospace"
        fontSize="20"
        fontWeight="500"
        letterSpacing="3"
      >
        SESSION 1 · LEVEL 2
      </text>

      {/* Headline */}
      <text
        x="140"
        y="420"
        fill="#FFFFFF"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="84"
        fontWeight="600"
        letterSpacing="-1"
      >
        Ship Your First
      </text>
      <text
        x="140"
        y="510"
        fill="#FFFFFF"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="84"
        fontWeight="600"
        letterSpacing="-1"
      >
        Agent Team
      </text>

      {/* Subtitle — single line, lighter */}
      <text
        x="140"
        y="600"
        fill="#FFFFFF"
        opacity="0.6"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="22"
      >
        Reasoning loops, trust gradients, and your first two-agent system.
      </text>
    </svg>
  );
}
