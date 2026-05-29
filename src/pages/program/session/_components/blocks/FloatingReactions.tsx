import { useMemo } from "react";

// Live reactions — emerge from a right-side gutter and bubble upward
// with a gentle sine-wave wiggle (left↔right). Each instance picks its
// own random offset, size, rotation, and duration so a burst feels
// organic. Ease-in/ease-out at the ends keeps the motion soft.

export type Reaction = {
  id: string;
  emoji: string;
};

type Props = {
  reactions: Reaction[];
};

export default function FloatingReactions({ reactions }: Props) {
  return (
    <div className="pointer-events-none absolute bottom-16 right-3 z-20 h-72 w-24 overflow-visible">
      {reactions.map((r) => (
        <FloatingEmoji key={r.id} emoji={r.emoji} />
      ))}
      <style>{`
        /* Wiggle path: y rises steadily; x sweeps left-right-left along the
           way so the emoji feels alive instead of mechanical. Soft fade-in
           at the start, soft fade-out toward the top. */
        @keyframes reactBubble {
          0%   { translate: 0      6px;    opacity: 0; }
          10%  { translate: 4px    0;      opacity: 1; }
          25%  { translate: -10px  -55px;             }
          45%  { translate: 12px   -120px;            }
          65%  { translate: -8px   -180px; opacity: 1; }
          85%  { translate: 6px    -230px;            }
          100% { translate: -2px   -270px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FloatingEmoji({ emoji }: { emoji: string }) {
  // Per-instance variation. Slightly slower than before so the motion
  // reads as a softer bubble rather than a quick pop.
  const cfg = useMemo(
    () => ({
      offsetX: Math.random() * 24 - 12, // -12 to +12 px
      size: 20 + Math.random() * 10, // 20–30 px
      rotation: Math.random() * 14 - 7, // -7° to +7°
      duration: 3200 + Math.random() * 900, // 3.2–4.1 s
    }),
    [],
  );

  return (
    <span
      className="absolute bottom-0 right-3 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.28)]"
      style={{
        transform: `translateX(${cfg.offsetX}px) rotate(${cfg.rotation}deg)`,
        fontSize: `${cfg.size}px`,
        animation: `reactBubble ${cfg.duration}ms cubic-bezier(0.32, 0.72, 0.32, 1) forwards`,
      }}
    >
      {emoji}
    </span>
  );
}
