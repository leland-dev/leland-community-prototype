import { useMemo } from "react";

// Live reaction stream — anchored to the right edge of the video so it
// doesn't compete with the slide / build canvas in the middle. Each
// emoji is small, fades in, drifts up, and fades out softly. Multiple
// reactions stagger naturally because each instance picks its own
// random offset, size, and duration.

export type Reaction = {
  id: string;
  emoji: string;
};

type Props = {
  reactions: Reaction[];
};

export default function FloatingReactions({ reactions }: Props) {
  return (
    <div className="pointer-events-none absolute bottom-4 right-4 z-20 h-64 w-20 overflow-visible">
      {reactions.map((r) => (
        <FloatingEmoji key={r.id} emoji={r.emoji} />
      ))}
      <style>{`
        @keyframes reactFloat {
          0%   { translate: 0 8px;    opacity: 0; }
          18%  { translate: 0 0;      opacity: 1; }
          75%  { translate: 0 -160px; opacity: 1; }
          100% { translate: 0 -210px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FloatingEmoji({ emoji }: { emoji: string }) {
  // Tiny per-instance variation so a burst feels organic. Smaller size
  // range than before since these now live in a 80px-wide right gutter.
  const cfg = useMemo(
    () => ({
      offsetX: Math.random() * 40 - 20, // -20 to +20 px
      size: 18 + Math.random() * 10, // 18–28 px
      rotation: Math.random() * 18 - 9, // -9° to +9°
      duration: 2400 + Math.random() * 600, // 2.4–3.0 s
    }),
    [],
  );

  return (
    <span
      className="absolute bottom-0 right-2 select-none drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]"
      style={{
        transform: `translateX(${cfg.offsetX}px) rotate(${cfg.rotation}deg)`,
        fontSize: `${cfg.size}px`,
        animation: `reactFloat ${cfg.duration}ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards`,
      }}
    >
      {emoji}
    </span>
  );
}
