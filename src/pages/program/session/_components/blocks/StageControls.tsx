import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Settings,
  Hand,
  PhoneOff,
  MoreHorizontal,
  Clock,
  Users,
  UserPlus,
  Captions,
  PictureInPicture2,
  Headphones,
  Keyboard,
  Link as LinkIcon,
  Flag,
  Check,
} from "lucide-react";

// Meeting-room style controls overlaid on the video player. Top status
// strip is always visible; bottom action bar fades on hover.
//
// Props worth knowing about:
// - raisedHandCount + totalAttendees → drives the "X / Y hands" chip in
//   the top strip and the queue badge on the Raise hand button.
// - isOnStage → swaps Join stage for Leave stage with red treatment,
//   and adds a "You're on stage" pill in the top strip.

type Props = {
  session: { title: string };
  participantCount?: number;
  handRaised: boolean;
  onToggleHand: () => void;
  /** Total number of people in the room with hands up (including the
   *  viewer's own raised hand). */
  raisedHandCount?: number;
  /** Queue position of the viewer if their hand is raised. */
  ownQueuePosition?: number;
  isOnStage?: boolean;
  onJoinStage?: () => void;
  onLeaveStage?: () => void;
  visible?: boolean;
};

export default function StageControls({
  session,
  participantCount = 20,
  handRaised,
  onToggleHand,
  raisedHandCount = 0,
  ownQueuePosition,
  isOnStage = false,
  onJoinStage,
  onLeaveStage,
  visible = true,
}: Props) {
  // Session timer — ticks once per second. mm:ss for short sessions,
  // h:mm:ss once we cross the hour mark.
  const [elapsed, setElapsed] = useState(20 * 60 + 44);
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

  // Top strip stays always-on. Only the bottom action bar fades with hover.
  const overlayVisibility = visible
    ? "opacity-100"
    : "pointer-events-none opacity-0";

  // More menu — anchored above the More button.
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!moreOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [moreOpen]);

  return (
    <>
      {/* ── Top status strip ── always visible. Light grey matches the
          pivot chip palette used elsewhere on the page. Top corners
          rounded so it hugs the rounded video shape. */}
      <div className="pointer-events-auto absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gray-hover px-4 py-2 text-gray-dark lg:rounded-t-2xl">
        {/* Left: REC + on-stage chip (if applicable) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#E2574C]">
            <span className="h-2 w-2 rounded-full bg-[#E2574C] [animation:stagepulse_1.6s_ease-in-out_infinite]" />
            REC
          </div>
          {isOnStage && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#FFD96F]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD96F]" />
              You're on stage
            </span>
          )}
        </div>

        {/* Title centered (hidden below md to avoid crowding) */}
        <div className="hidden truncate px-4 text-[11px] font-medium text-gray-dark md:block">
          {session.title}
        </div>

        {/* Right cluster: hands chip + participants + timer */}
        <div className="flex items-center gap-3 text-[10px] text-gray-light">
          {raisedHandCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-[#FFE099] px-2 py-0.5 text-[10px] font-semibold text-[#876C00]">
              <Hand size={12} strokeWidth={2.25} />
              {raisedHandCount} / {participantCount}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users size={13} strokeWidth={2.25} /> {participantCount}
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Clock size={13} strokeWidth={2.25} /> {timer}
          </span>
        </div>
      </div>

      {/* ── Bottom control bar ── */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10 transition-opacity duration-200 ease-out lg:rounded-b-2xl ${overlayVisibility}`}
      >
        {/* Left utility group */}
        <div className="pointer-events-auto flex items-end gap-1">
          <ControlButton icon={<Maximize size={18} />} label="Full Screen" />
          <ControlButton icon={<Settings size={18} />} label="Settings" />
        </div>

        {/* Center primary actions */}
        <div className="pointer-events-auto flex items-end gap-1">
          <ControlButton
            icon={<Hand size={18} />}
            label={handRaised ? "Lower" : "Raise hand"}
            active={handRaised}
            badge={handRaised && ownQueuePosition ? `#${ownQueuePosition}` : undefined}
            onClick={onToggleHand}
          />
          {isOnStage ? (
            <ControlButton
              icon={<PhoneOff size={18} />}
              label="Leave stage"
              danger
              onClick={onLeaveStage}
            />
          ) : (
            <ControlButton
              icon={<UserPlus size={18} />}
              label="Join stage"
              onClick={onJoinStage}
            />
          )}
          <ControlButton icon={<PhoneOff size={18} />} label="Leave" danger />
          <div ref={moreRef} className="relative">
            <ControlButton
              icon={<MoreHorizontal size={18} />}
              label="More"
              active={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            />
            {moreOpen && <MoreMenu onClose={() => setMoreOpen(false)} />}
          </div>
        </div>

        {/* Right spacer to keep center optically centered */}
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
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  /** Small text badge in the top-right corner (queue position, etc.). */
  badge?: string;
  onClick?: () => void;
}) {
  const base =
    "relative flex w-[68px] flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors";
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
      {badge && (
        <span className="absolute right-1 top-0.5 rounded-full bg-[#FFD86B] px-1.5 py-px text-[9px] font-bold tabular-nums text-black">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── More menu ────────────────────────────────────────────
// Pops up above the More button. Lightweight options that don't deserve
// their own first-class chiclet. Most items are visual-only for the
// prototype; Captions and PIP are toggles to show what state would look like.

function MoreMenu({ onClose }: { onClose: () => void }) {
  const [captions, setCaptions] = useState(true);
  const [pip, setPip] = useState(false);

  const items: { icon: React.ReactNode; label: string; toggled?: boolean; onClick?: () => void }[] = [
    {
      icon: <Captions size={16} />,
      label: "Captions",
      toggled: captions,
      onClick: () => setCaptions((v) => !v),
    },
    {
      icon: <PictureInPicture2 size={16} />,
      label: "Picture in picture",
      toggled: pip,
      onClick: () => setPip((v) => !v),
    },
    { icon: <Headphones size={16} />, label: "Audio settings" },
    { icon: <Keyboard size={16} />, label: "Keyboard shortcuts" },
    { icon: <LinkIcon size={16} />, label: "Copy session link" },
    { icon: <Flag size={16} />, label: "Report an issue" },
  ];

  return (
    <div className="absolute bottom-[calc(100%+8px)] right-0 z-30 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#1A1A18] py-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            item.onClick?.();
            // Toggle items stay open; one-shots dismiss.
            if (item.toggled === undefined) onClose();
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-white/90 transition-colors hover:bg-white/10"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-white/70">
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {item.toggled && (
            <Check size={14} className="text-[#A5E446]" strokeWidth={2.5} />
          )}
        </button>
      ))}
    </div>
  );
}
