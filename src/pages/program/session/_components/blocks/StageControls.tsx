import { useEffect, useState } from "react";
import {
  Maximize,
  Settings,
  Hand,
  PhoneOff,
  MoreHorizontal,
  Clock,
  Users,
  UserPlus,
} from "lucide-react";

// Meeting-room style controls overlaid on the video player. Mirrors the
// shape of Leland's current Zoom-style stage UI: small REC indicator and
// session timer up top, action bar at the bottom. Chat stays in the side
// rail (V5 layout) so it isn't duplicated here.
//
// Easy to add/subtract individual chiclets from the bottom bar — each
// control is a single <ControlButton>. Raise hand is a sticky toggle;
// the rest are visual-only for now.

type Props = {
  session: { title: string };
  participantCount?: number;
  handRaised: boolean;
  onToggleHand: () => void;
};

export default function StageControls({
  session,
  participantCount = 47,
  handRaised,
  onToggleHand,
}: Props) {
  // Session timer — ticks once per second. mm:ss for short sessions,
  // h:mm:ss once we cross the hour mark.
  const [elapsed, setElapsed] = useState(20 * 60 + 44); // demo-friendly start (20:44)
  useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const timer = h
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return (
    <>
      {/* ── Top bar overlay ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent px-4 pb-8 pt-3">
        {/* REC */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#E2574C]">
          <span className="h-2 w-2 rounded-full bg-[#E2574C] [animation:stagepulse_1.6s_ease-in-out_infinite]" />
          REC
        </div>

        {/* Title centered (hidden below md to avoid crowding) */}
        <div className="hidden truncate px-4 text-[13px] font-medium text-white/90 md:block">
          {session.title}
        </div>

        {/* Participants + timer */}
        <div className="flex items-center gap-3 text-[12px] text-white/85">
          <span className="flex items-center gap-1">
            <Users size={13} strokeWidth={2.25} /> {participantCount}
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Clock size={13} strokeWidth={2.25} /> {timer}
          </span>
        </div>
      </div>

      {/* ── Bottom control bar ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10">
        {/* Left utility group */}
        <div className="pointer-events-auto flex items-end gap-1">
          <ControlButton icon={<Maximize size={18} />} label="Full Screen" />
          <ControlButton icon={<Settings size={18} />} label="Settings" />
        </div>

        {/* Center primary actions — raise hand, join stage, leave, more */}
        <div className="pointer-events-auto flex items-end gap-1">
          <ControlButton
            icon={<Hand size={18} />}
            label={handRaised ? "Lower" : "Raise hand"}
            active={handRaised}
            onClick={onToggleHand}
          />
          <ControlButton icon={<UserPlus size={18} />} label="Join stage" />
          <ControlButton icon={<PhoneOff size={18} />} label="Leave" danger />
          <ControlButton icon={<MoreHorizontal size={18} />} label="More" />
        </div>

        {/* Right spacer — same width as the left group so the center stays
            visually centered. Hidden from AT and pointer events. */}
        <div className="pointer-events-none flex items-end gap-1 opacity-0" aria-hidden>
          <ControlButton icon={<Maximize size={18} />} label="Full Screen" />
          <ControlButton icon={<Settings size={18} />} label="Settings" />
        </div>
      </div>

      <style>{`@keyframes stagepulse { 0%,100% { opacity: 0.45 } 50% { opacity: 1 } }`}</style>
    </>
  );
}

function ControlButton({
  icon,
  label,
  active = false,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) {
  const base =
    "flex w-[68px] flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors";
  const tone = danger
    ? "text-[#FF8A8A] hover:bg-[#E2574C]/15"
    : active
      ? "bg-white/20 text-white"
      : "text-white/90 hover:bg-white/10";
  return (
    <button type="button" onClick={onClick} className={`${base} ${tone}`}>
      <span
        className={`flex h-7 w-7 items-center justify-center ${
          danger ? "text-[#E2574C]" : ""
        }`}
      >
        {icon}
      </span>
      <span className="leading-none">{label}</span>
    </button>
  );
}
