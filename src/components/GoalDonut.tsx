// Progress donut for a goal header. Reads as an achievement dial rather than
// the thin utility bar used on the dashboard tiles — this is the one place the
// goal's overall progress is the headline, so it gets the weight.
export default function GoalDonut({
  done,
  total,
  pct,
  complete,
  size = 104,
}: {
  done: number;
  total: number;
  pct: number;
  complete: boolean;
  size?: number;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const shown = complete ? 100 : pct;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(34,34,34,0.10)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={complete ? "#869AA6" : "#222222"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (shown / 100) * c}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.2,0.7,0.2,1), stroke 300ms" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {complete ? (
          <svg width={size * 0.34} height={size * 0.34} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#869AA6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <>
            <span className="font-serif text-[28px] font-medium leading-none text-gray-dark">{pct}%</span>
            <span className="mt-1 text-[12px] text-gray-extra-light">
              {done} of {total}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
