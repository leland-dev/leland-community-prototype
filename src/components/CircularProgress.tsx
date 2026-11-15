import { IconCheck } from "./leland";

// Shared between the course content viewer's sidebar (compact, size 24 —
// the default) and Program Hub's featured course card (larger, size 32,
// with showPercentage for the badge spot big enough to carry a number),
// so both always render progress identically apart from scale.
// "onDark": for use inside a dark-background control (e.g. the Resume
// button), where the default gray track/progress colors wouldn't show up.
export function CircularProgress({
  percent,
  size = 24,
  showPercentage = false,
  tone = "default",
}: {
  percent: number;
  size?: number;
  showPercentage?: boolean;
  tone?: "default" | "onDark";
}) {
  const trackClassName = tone === "onDark" ? "text-white/30" : "text-leland-gray-stroke";
  const progressClassName = tone === "onDark" ? "text-white" : "text-leland-gray-dark";
  if (percent >= 100) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${tone === "onDark" ? "bg-white" : "bg-leland-gray-dark"}`}
        style={{ width: size, height: size }}
      >
        <IconCheck className={tone === "onDark" ? "text-gray-dark" : "text-white"} style={{ width: size / 2, height: size / 2 }} />
      </span>
    );
  }
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  const ring = (
    <svg viewBox="0 0 24 24" className="shrink-0 -rotate-90" style={{ width: size, height: size }} aria-hidden>
      <circle cx="12" cy="12" r={radius} fill="none" strokeWidth="2" stroke="currentColor" className={trackClassName} />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={progressClassName}
      />
    </svg>
  );
  if (!showPercentage) return ring;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      {ring}
      <span
        className={`absolute inset-0 flex items-center justify-center ${tone === "onDark" ? "text-white" : "text-gray-dark"}`}
        style={{ fontSize: 12 }}
      >
        {Math.round(clamped)}%
      </span>
    </span>
  );
}
