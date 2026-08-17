import { useEffect, useMemo, useState } from "react";

// One-shot confetti burst for finishing a goal. Deliberately an exception to
// the design system's restrained motion rules — it fires once, on an event
// worth marking, then unmounts. Brand colours only, and it respects
// prefers-reduced-motion by not rendering at all.
const COLORS = ["#FFD96F", "#EBD4B5", "#869AA6"];
const COUNT = 44;
const DURATION = 1500;

export default function Confetti({ onDone }: { onDone?: () => void }) {
  const [gone, setGone] = useState(false);

  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        // Spread the launch so it reads as a burst, not a curtain.
        dx: (Math.random() - 0.5) * 160,
        rise: 90 + Math.random() * 130,
        rotate: (Math.random() - 0.5) * 900,
        delay: Math.random() * 180,
        size: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [],
  );

  useEffect(() => {
    if (reduceMotion) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, DURATION + 250);
    return () => clearTimeout(t);
  }, [reduceMotion, onDone]);

  if (reduceMotion || gone) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <style>{`
        @keyframes goal-confetti {
          0%   { opacity: 1; transform: translate(0, 0) rotate(0deg); }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx), var(--rise)) rotate(var(--rot)); }
        }
      `}</style>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "45%",
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "999px" : "2px",
            // Pieces fly up and out, so rise is negative.
            ["--dx" as string]: `${p.dx}px`,
            ["--rise" as string]: `${-p.rise}px`,
            ["--rot" as string]: `${p.rotate}deg`,
            animation: `goal-confetti ${DURATION}ms cubic-bezier(0.2,0.7,0.2,1) ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
