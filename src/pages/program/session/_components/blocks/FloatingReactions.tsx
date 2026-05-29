import { useMemo } from "react";

// Twitch/TikTok-style ambient reactions. The parent owns the queue (so it can
// also be driven by remote students in a real implementation) and just hands
// us a list of active reactions to render. Each emoji floats up + fades out
// over ~2.5s and is then dropped from the queue by the parent.

export type Reaction = {
  id: string;
  emoji: string;
};

type Props = {
  reactions: Reaction[];
};

export default function FloatingReactions({ reactions }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-64 overflow-hidden">
      {reactions.map((r) => (
        <FloatingEmoji key={r.id} emoji={r.emoji} />
      ))}
      <style>{`
        @keyframes reactFloat {
          0%   { translate: 0 0;     opacity: 0; }
          12%  {                     opacity: 1; }
          85%  {                     opacity: 1; }
          100% { translate: 0 -240px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FloatingEmoji({ emoji }: { emoji: string }) {
  // Memo so the random values don't reroll on every render. Each instance
  // has its own horizontal offset, size, rotation, and duration so a burst
  // of reactions feels organic rather than mechanical.
  const cfg = useMemo(
    () => ({
      offsetX: Math.random() * 140 - 70, // -70 to +70 px around the trigger
      size: 28 + Math.random() * 18, // 28–46 px
      rotation: Math.random() * 24 - 12, // -12° to +12°
      duration: 2200 + Math.random() * 700, // 2.2–2.9 s
    }),
    [],
  );

  return (
    <span
      className="absolute left-1/2 bottom-3 select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
      style={{
        transform: `translateX(calc(-50% + ${cfg.offsetX}px)) rotate(${cfg.rotation}deg)`,
        fontSize: `${cfg.size}px`,
        animation: `reactFloat ${cfg.duration}ms ease-out forwards`,
      }}
    >
      {emoji}
    </span>
  );
}
