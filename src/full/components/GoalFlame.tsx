// Streak flame — the stroke path is lifted from the design prototypes.
export default function GoalFlame({ width = 11, height = 13 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 11 13" fill="none" aria-hidden="true">
      <path
        d="M5.5 1C6.2 3 8.9 4.2 8.9 7.5A3.4 3.4 0 0 1 5.5 12 3.4 3.4 0 0 1 2.1 7.5c0-1.5.8-2.3 1.6-3.1.3.6.7 1 1.2 1.2-.3-1.6.1-3.2.6-4.6Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
