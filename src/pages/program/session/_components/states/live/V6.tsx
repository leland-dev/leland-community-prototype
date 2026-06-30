import { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Play,
  Volume2,
  Captions,
  Settings,
  Maximize,
  PictureInPicture2,
} from "lucide-react";
import type { Session } from "../../../_types";
import sharesIcon from "../../../../../../assets/icons/shares.svg";
import CoachScreenShare from "../../blocks/CoachScreenShare";
import BuildScreen from "../../blocks/BuildScreen";
import CoachFacePip from "../../blocks/CoachFacePip";
import SessionGuide from "../../blocks/SessionGuide";
import Resources from "../../blocks/Resources";
import SessionCoachCard from "../../blocks/SessionCoachCard";
import ChatPanel from "../../blocks/ChatPanel";
import ChatRail, { ViewersPane } from "../../blocks/ChatRail";
import RateSessionPopup from "../../blocks/RateSessionPopup";
import BottomTray from "../../blocks/BottomTray";
import FloatingReactions, { type Reaction } from "../../blocks/FloatingReactions";
import StageControls from "../../blocks/StageControls";
import StageInvitePrompt from "../../blocks/StageInvitePrompt";
import PurchaseToasts from "../../blocks/PurchaseToasts";

type Tab = "guide" | "resources" | "chat";

// Mocked Cloudflare-style player controls. Overlays the bottom of the video
// with a gradient for legibility. Most buttons are visual only — the PIP
// button toggles the floating mode.
function VideoControls({
  isPipped,
  onTogglePip,
  mobileVisible = true,
}: {
  isPipped?: boolean;
  onTogglePip?: () => void;
  /** Mobile-only auto-hide. When false, mobile controls fade out and stop
   *  intercepting taps so the tap falls through to the video container. */
  mobileVisible?: boolean;
}) {
  return (
    <>
      {/* ────────── MOBILE: YouTube-style controls ──────────
          Top row → captions / settings / PIP / fullscreen (chunky 40px tap targets)
          Center  → big play/pause (56px)
          Bottom  → progress scrubber, LIVE pill, time, volume
          Whole layer fades in on tap and out after a short timeout. */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-200 ease-out lg:hidden ${
          mobileVisible ? "pointer-events-none opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Top row */}
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-end gap-1 bg-gradient-to-b from-black/65 to-transparent px-2 pb-6 pt-2">
          <button type="button" aria-label="Captions" className="flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/20">
            <Captions className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Settings" className="flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/20">
            <Settings className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onTogglePip}
            aria-label={isPipped ? "Exit picture in picture" : "Picture in picture"}
            aria-pressed={isPipped}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors ${
              isPipped ? "bg-white/25" : "active:bg-white/20"
            }`}
          >
            <PictureInPicture2 className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Fullscreen" className="flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/20">
            <Maximize className="h-5 w-5" />
          </button>
        </div>

        {/* Center big play */}
        <button
          type="button"
          aria-label="Play"
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform active:scale-95"
        >
          <Play className="h-7 w-7 translate-x-[1px]" fill="white" strokeWidth={0} />
        </button>

        {/* Bottom: progress + meta row */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-2.5 pt-7">
          {/* Progress / scrubber */}
          <div className="relative h-1 w-full rounded-full bg-white/20">
            <div className="absolute inset-y-0 left-0 w-[78%] rounded-full bg-white" />
            <span className="absolute top-1/2 left-[78%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-1 rounded-full bg-[#E2574C] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Live
            </div>
            <span className="text-[10px] tabular-nums text-white/85">12:34 / 1:30:00</span>
            <span className="flex-1" />
            <button type="button" aria-label="Volume" className="flex h-8 w-8 items-center justify-center rounded-full active:bg-white/15">
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ────────── DESKTOP: original compact bottom bar ────────── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden flex-col gap-2 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-3 pt-12 lg:flex">
        {/* Buffer / live-edge bar */}
        <div className="pointer-events-auto relative h-1 w-full rounded-full bg-white/15">
          <div className="absolute inset-y-0 left-0 w-[78%] rounded-full bg-white/65" />
          <span className="absolute -top-0.5 -right-1 h-2.5 w-2.5 rounded-full bg-[#E2574C] ring-2 ring-white/30" />
        </div>
        {/* Button row */}
        <div className="pointer-events-auto flex items-center gap-3 text-white">
          <button type="button" aria-label="Play" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Play className="h-4 w-4" fill="white" strokeWidth={0} />
          </button>
          <div className="flex items-center gap-1.5 rounded-full bg-[#E2574C] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Live
          </div>
          <button type="button" aria-label="Volume" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Volume2 className="h-4 w-4" />
          </button>
          <span className="text-[10px] tabular-nums text-white/85">12:34 / 1:30:00</span>
          <span className="flex-1" />
          <button type="button" aria-label="Captions" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Captions className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Settings" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onTogglePip}
            aria-label={isPipped ? "Exit picture in picture" : "Picture in picture"}
            aria-pressed={isPipped}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isPipped ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <PictureInPicture2 className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Fullscreen" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

// Compact Resources card for the right rail. Three rows (Office hours, Slack,
// Build session) with rounded gray icon boxes and an external-link chevron.
function CompactResources() {
  const rows = [
    { id: "office", label: "Office hours", icon: <ClockIcon /> },
    { id: "slack", label: "Slack community", icon: <SlackIcon /> },
    { id: "build", label: "Join a build session", icon: <CalendarPlayIcon /> },
  ];
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
      <div className="border-b border-gray-stroke px-4 py-3">
        <h2 className="text-[13px] font-medium text-gray-dark">Resources</h2>
      </div>
      <ul className="flex flex-col gap-0.5 p-2">
        {rows.map((r) => (
          <li key={r.id}>
            <a
              href="#"
              className="group flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-gray-hover/60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-hover text-gray-dark">
                {r.icon}
              </span>
              <span className="flex-1 text-[12px] font-medium text-gray-dark">{r.label}</span>
              <span className="shrink-0 text-gray-light transition-colors group-hover:text-gray-dark">
                <ExternalChevron />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function SlackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="9.5" width="6" height="3" rx="1.5" fill="currentColor" />
      <rect x="11.5" y="3" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="15" y="11.5" width="6" height="3" rx="1.5" fill="currentColor" />
      <rect x="9.5" y="15" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="9.5" y="9.5" width="3" height="3" rx="1.5" fill="currentColor" />
      <rect x="11.5" y="11.5" width="3" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}
function CalendarPlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 13.5l3 1.5-3 1.5v-3z" fill="currentColor" />
    </svg>
  );
}
function ExternalChevron() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M5 3.5h-2A1.5 1.5 0 0 0 1.5 5v6A1.5 1.5 0 0 0 3 12.5h6A1.5 1.5 0 0 0 10.5 11V9M7.5 1.5h5v5M12.5 1.5L6 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Thumbs combined pill — inline (no longer on the video). Sits next to the
// Share button in the row alongside the tab pills.
function ThumbsPill() {
  return (
    <div className="flex items-center rounded-full bg-gray-hover">
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-l-full px-3.5 py-2 text-gray-dark transition-colors hover:bg-gray-hover/60"
        aria-label="Thumbs up"
      >
        <ThumbsUp size={16} strokeWidth={2} />
        <span className="text-[12px] font-semibold">3</span>
      </button>
      <span className="h-5 w-px bg-gray-stroke" aria-hidden />
      <button
        type="button"
        className="rounded-r-full px-3.5 py-2 text-gray-dark transition-colors hover:bg-gray-hover/60"
        aria-label="Thumbs down"
      >
        <ThumbsDown size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

function ShareButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-full bg-gray-hover px-4 py-2 text-gray-dark transition-colors hover:bg-gray-hover/60"
    >
      <img src={sharesIcon} alt="" className="h-4 w-4 [filter:invert(20%)]" />
      <span className="text-[12px] font-semibold">Share</span>
    </button>
  );
}

function TopBar({ session }: { session: Session }) {
  const startDate = new Date(session.startsAt);
  const isToday = startDate.toDateString() === new Date().toDateString();
  const dateLabel = isToday
    ? "Today"
    : startDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeLabel = startDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-1">
      {/* Title — medium weight per latest design. */}
      <h1 className="text-[18px] font-medium leading-[1.15] text-gray-dark sm:text-[20px] lg:text-[22px]">
        {session.title}
      </h1>
      {/* Compact metadata — program · session # · date · time. Duration and
          attendance dropped (the player chrome already shows attendees). */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-light lg:text-[12px]">
        <span>AI Builder Program · Session {session.number}</span>
        <span className="text-gray-stroke">·</span>
        <span>
          {dateLabel} · {timeLabel} PT
        </span>
      </div>
    </div>
  );
}

function TabsNav({
  tab,
  onChange,
  tabs,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  tabs: { id: Tab; label: string }[];
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 text-[12px] font-semibold">
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full bg-gray-hover px-4 py-2 transition-all ${
              active
                ? "text-gray-dark ring-2 ring-gray-dark"
                : "text-gray-light hover:text-gray-dark"
            }`}
            aria-pressed={active}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "guide":
      return <SessionGuide />;
    case "resources":
      return <Resources />;
    case "chat":
      // Chat is rendered in the BottomTray on mobile, not in the tab content
      // area. This case is unreachable in normal use but kept for type safety.
      return null;
  }
}


// Mobile tray pivot for V6 — Info / Chat / Viewers, Info first. The user
// lands on Info (title + coach + meta) and a 5s timer hands them off to
// Chat once they've had a beat to orient themselves. Any manual pivot tap
// cancels the auto-switch so we never override a deliberate choice.
function MobileChatTrayContent({
  session,
  onReact,
}: {
  session: Session;
  onReact?: (emoji: string) => void;
}) {
  const [pivot, setPivot] = useState<"info" | "chat" | "viewers">("info");
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (userInteractedRef.current) return;
    const t = window.setTimeout(() => {
      if (userInteractedRef.current) return;
      setPivot("chat");
    }, 5000);
    return () => window.clearTimeout(t);
  }, []);

  function selectPivot(next: "info" | "chat" | "viewers") {
    userInteractedRef.current = true;
    setPivot(next);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="-m-1 flex shrink-0 items-center gap-1.5 px-3 pb-4 pt-1 [scrollbar-width:none]">
        <PivotPill active={pivot === "info"} onClick={() => selectPivot("info")}>
          Info
        </PivotPill>
        <PivotPill active={pivot === "chat"} onClick={() => selectPivot("chat")}>
          Chat
        </PivotPill>
        <PivotPill
          active={pivot === "viewers"}
          onClick={() => selectPivot("viewers")}
        >
          Viewers <span className="text-gray-light">20</span>
        </PivotPill>
      </div>
      <div className="min-h-0 flex-1 border-t border-gray-stroke">
        {pivot === "info" && <InfoPane session={session} />}
        {pivot === "chat" && (
          <ChatPanel hideHeader large onReact={onReact} />
        )}
        {pivot === "viewers" && <ViewersPane />}
      </div>
    </div>
  );
}

// Mobile Info pane — title, program/session/date metadata, and the coach
// attribution row. On V6 the page chrome above the tray is just the
// video, so this pane carries the context that V5 puts above the tray.
function InfoPane({ session }: { session: Session }) {
  const startDate = new Date(session.startsAt);
  const isToday = startDate.toDateString() === new Date().toDateString();
  const dateLabel = isToday
    ? "Today"
    : startDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
  const timeLabel = startDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-medium leading-[1.15] text-gray-dark">
          {session.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-gray-light">
          <span>AI Builder Program · Session {session.number}</span>
          <span className="text-gray-stroke">·</span>
          <span>
            {dateLabel} · {timeLabel} PT
          </span>
        </div>
      </div>
      <SessionCoachCard coach={session.coach} />
    </div>
  );
}

function PivotPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-1 rounded-full bg-gray-hover px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
        active
          ? "text-gray-dark ring-2 ring-gray-dark"
          : "text-gray-light hover:text-gray-dark"
      }`}
    >
      {children}
    </button>
  );
}

function StudioLayout({ session }: { session: Session }) {
  // Mobile default: Chat. On desktop the page-level tabs only include
  // Session guide / Resources (chat lives in the right rail), so the
  // initial value is overridden below if desktop boots up first.
  const [tab, setTab] = useState<Tab>("chat");

  // Two triggers for the floating PIP:
  //   - scrolledPast: original video has fully scrolled out of view
  //   - isPipped: user explicitly tapped the PIP icon
  // Either one shows the floating tile. The user toggle persists across
  // scroll, so once pinned it stays pinned until tapped again.
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [isPipped, setIsPipped] = useState(false);
  const isPip = scrolledPast || isPipped;

  useEffect(() => {
    const el = placeholderRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function togglePip() {
    setIsPipped((prev) => {
      const next = !prev;
      // When un-pinning while scrolled down, smoothly return to top so the
      // inline player is back in view.
      if (!next && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
  }

  // Mobile-only auto-hide for the video controls. Default hidden; tap the
  // video to bring them up, then they fade out after 2.5s of no interaction.
  // On desktop the controls section uses `hidden lg:flex` and is always on,
  // so this state only affects mobile.
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  function showControlsBriefly() {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
  }
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Desktop hover-based controls (Twitch-style focused player). Visible
  // while the mouse is moving over the video, auto-hide 1.8s after the
  // last mouse activity, hide immediately on mouse-leave.
  const [stageVisible, setStageVisible] = useState(false);
  const stageHideTimerRef = useRef<number | null>(null);
  function bumpStageVisibility() {
    setStageVisible(true);
    if (stageHideTimerRef.current) window.clearTimeout(stageHideTimerRef.current);
    stageHideTimerRef.current = window.setTimeout(() => setStageVisible(false), 2200);
  }
  // No onMouseLeave hide — the auto-hide timer above handles dismissal so
  // brief moves between video and the absolute-positioned StageControls
  // (which sits on top of the same parent) don't flicker the bar.
  useEffect(() => {
    return () => {
      if (stageHideTimerRef.current) window.clearTimeout(stageHideTimerRef.current);
    };
  }, []);

  // ── Live reactions (V5's "Twitch" feel) ────────────────────────────────
  // Each reaction has a short lifetime — we drop it from state after the
  // animation completes (~3s). State is just an append-only queue.
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const reactionIdRef = useRef(0);
  function pushReaction(emoji: string) {
    const id = `r-${++reactionIdRef.current}`;
    setReactions((prev) => [...prev, { id, emoji }]);
    window.setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  }

  // Ambient reactions — keeps the stream feeling populated. A random emoji
  // pops every 1.4–3s on top of whatever the user fires. In real life this
  // would be driven by other students' real reactions over the wire.
  useEffect(() => {
    const pool = ["👍", "🎉", "❤️", "😂", "🤯", "🙌", "🔥"];
    let timer: number;
    const tick = () => {
      pushReaction(pool[Math.floor(Math.random() * pool.length)]);
      timer = window.setTimeout(tick, 1400 + Math.random() * 1600);
    };
    timer = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer);
  }, []);

  // Raise-hand + stage state.
  // - handRaised: the viewer's own raised-hand status.
  // - ambientRaisedHands: simulated count of OTHER students with hands up.
  //   Starts at 2 so the counter is meaningful before the user does anything.
  //   In production this would come over the wire.
  // - isOnStage: user accepted an invite and is currently a stage participant.
  // - stageInvitePending: coach has called them up; show the invite prompt.
  //
  // Demo flow: raise hand → ~4s later an invite pops → accept → "on stage";
  // hitting Leave stage drops them back to the audience.
  const [handRaised, setHandRaised] = useState(false);
  const [ambientRaisedHands] = useState(2);
  const [isOnStage, setIsOnStage] = useState(false);
  const [stageInvitePending, setStageInvitePending] = useState(false);
  const inviteTimerRef = useRef<number | null>(null);
  const TOTAL_ATTENDEES = 20;
  const raisedHandCount = ambientRaisedHands + (handRaised ? 1 : 0);
  const ownQueuePosition = handRaised ? ambientRaisedHands + 1 : undefined;

  function onToggleHand() {
    setHandRaised((prev) => {
      const next = !prev;
      // Cancel any pending invite if user lowers their hand.
      if (!next && inviteTimerRef.current) {
        window.clearTimeout(inviteTimerRef.current);
        inviteTimerRef.current = null;
        setStageInvitePending(false);
      }
      // Schedule a mock invite 4s after raising.
      if (next && !isOnStage) {
        if (inviteTimerRef.current) window.clearTimeout(inviteTimerRef.current);
        inviteTimerRef.current = window.setTimeout(() => {
          setStageInvitePending(true);
        }, 4000);
      }
      return next;
    });
  }

  function acceptStageInvite() {
    setStageInvitePending(false);
    setHandRaised(false);
    setIsOnStage(true);
    if (inviteTimerRef.current) window.clearTimeout(inviteTimerRef.current);
  }

  function declineStageInvite() {
    setStageInvitePending(false);
    if (inviteTimerRef.current) window.clearTimeout(inviteTimerRef.current);
  }

  function leaveStage() {
    setIsOnStage(false);
  }

  useEffect(() => {
    return () => {
      if (inviteTimerRef.current) window.clearTimeout(inviteTimerRef.current);
    };
  }, []);

  // Mobile vs desktop drives whether Chat is a tab. Initialize from the
  // real viewport so the first render doesn't flip Chat → Guide on mobile
  // before the matchMedia listener has a chance to correct isDesktop.
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // If user switches to desktop while Chat tab was active, fall back.
  useEffect(() => {
    if (isDesktop && tab === "chat") setTab("guide");
  }, [isDesktop, tab]);

  // Mobile tabs: Chat first and default. The Chat tab triggers the
  // BottomTray overlay rather than swapping the inline content area;
  // Session guide / Resources render inline. Desktop keeps chat in the
  // right rail, so the page-level row only has the two non-chat tabs.
  const tabs: { id: Tab; label: string }[] = isDesktop
    ? [
        { id: "guide", label: "Session guide" },
        { id: "resources", label: "Resources" },
      ]
    : [
        { id: "chat", label: "Chat" },
        { id: "guide", label: "Session guide" },
        { id: "resources", label: "Resources" },
      ];

  // Tray snap measurement. HIGH = just below the video; LOW = just below
  // the tab-pills row (which sits below the coach card). We measure once
  // on mount + a couple of debounced re-measures so fonts/images don't
  // throw off the position, and again on resize.
  const trayLowAnchorRef = useRef<HTMLDivElement>(null);
  const [trayTops, setTrayTops] = useState({ high: 280, low: 440 });
  useEffect(() => {
    if (isDesktop) return;
    function measure() {
      // Re-anchor only when the page is parked at the top so the
      // viewport positions reflect natural layout, not a scrolled-up
      // chrome. The tray is position:fixed, so we want viewport coords.
      if (window.scrollY > 4) return;
      const videoEl = placeholderRef.current;
      const anchorEl = trayLowAnchorRef.current;
      const high = videoEl?.getBoundingClientRect().bottom;
      const low = anchorEl?.getBoundingClientRect().top;
      setTrayTops({
        high: high !== undefined ? Math.max(96, high + 8) : 280,
        low: low !== undefined ? Math.max(160, low) : 440,
      });
    }
    measure();
    const t1 = window.setTimeout(measure, 80);
    const t2 = window.setTimeout(measure, 320);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop]);

  const chatTrayOpen = !isDesktop && tab === "chat";

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_340px] lg:gap-6">
      {/* LEFT COLUMN: video → title → tabs+actions row → content.
          Padded on mobile so the title/tabs/content sit inside 16px gutters,
          but the video itself breaks out with -mx-4 below to edge-bleed. */}
      <div className="flex min-w-0 flex-col gap-3 px-4 lg:gap-3 lg:px-0">
        {/* Video slot — on mobile it sticks to the top of the viewport so the
            page scrolls under it. On desktop it sits in normal flow; when
            isPip is on (scroll-off or PIP toggle) the inline player is
            replaced by a placeholder and the floating tile takes over. */}
        <div
          ref={placeholderRef}
          className="relative -mx-4 w-auto lg:mx-0 lg:w-full"
          style={{
            aspectRatio: isPipped ? undefined : "16 / 9",
            height: isPipped ? 0 : undefined,
            overflow: "hidden",
          }}
        >
          {!isPip && (
            <div
              className="absolute inset-0 overflow-hidden bg-black lg:rounded-2xl lg:shadow-lg"
              onClick={showControlsBriefly}
              onMouseEnter={bumpStageVisibility}
              onMouseMove={bumpStageVisibility}
            >
              {/* DESKTOP: calm "Ship Your First Agent Team" slide as the
                  shared screen — quieter than the previous VibeCodingScreen
                  mock but still gives the canvas visible content so the
                  player doesn't feel dead. Coach face PIP, reactions, and
                  purchase toasts overlay on top. */}
              <div className="relative hidden h-full w-full lg:block">
                <CoachScreenShare />
                <CoachFacePip coach={session.coach} position="top-right" />
                <FloatingReactions reactions={reactions} />
                <PurchaseToasts coachName={session.coach.name} />
              </div>

              {/* MOBILE: single-feed fallback (slide + face PIP overlay).
                  Right rail is hidden, so the slide acts as the main view
                  and signposting on mobile leans on the session-guide tab. */}
              <div className="relative h-full w-full lg:hidden">
                <CoachScreenShare>
                  <CoachFacePip coach={session.coach} position="top-right" />
                </CoachScreenShare>
                <FloatingReactions reactions={reactions} />
              </div>

              {/* Desktop: meeting-room style stage controls (REC + timer up
                  top, action bar at bottom). Mobile keeps the existing
                  YouTube-style media controls. */}
              <div className="hidden lg:block">
                <StageControls
                  session={session}
                  participantCount={TOTAL_ATTENDEES}
                  handRaised={handRaised}
                  onToggleHand={onToggleHand}
                  raisedHandCount={raisedHandCount}
                  ownQueuePosition={ownQueuePosition}
                  isOnStage={isOnStage}
                  onJoinStage={onToggleHand /* mock: same path as raise hand → invite */}
                  onLeaveStage={leaveStage}
                  visible={stageVisible}
                />
              </div>
              {stageInvitePending && (
                <StageInvitePrompt
                  coach={session.coach}
                  onAccept={acceptStageInvite}
                  onDecline={declineStageInvite}
                />
              )}
              <div className="lg:hidden">
                <VideoControls
                  isPipped={isPipped}
                  onTogglePip={togglePip}
                  mobileVisible={controlsVisible}
                />
              </div>
              <RateSessionPopup suppressed={isPip} />
            </div>
          )}
        </div>

        {/* Anchor — marks where the BottomTray's LOW snap top should
            sit on mobile (right below the video). On V6 the title and
            coach card are moved inside the tray's Info pane, so the
            chrome above the tray is just the video. */}
        <div ref={trayLowAnchorRef} aria-hidden className="h-0 lg:hidden" />

        {/* Title BELOW the video — desktop only on V6 (mobile shows it
            inside the Info pivot of the tray). */}
        <div className="hidden lg:block">
          <TopBar session={session} />
        </div>

        {/* Coach attribution row — desktop only on V6. */}
        <div className="hidden lg:block">
          <SessionCoachCard coach={session.coach} />
        </div>

        {/* DESKTOP: Session guide renders directly (Resources lives in
            the right rail as its own tab). */}
        <div className="hidden lg:block">
          <SessionGuide />
        </div>
      </div>

      {/* RIGHT COLUMN (desktop only): coach face on top, chat fills the rest.
          Sticky top-4 effectively pins it to the right hand side as a fixed
          element. Height capped so the chat input is always above the fold. */}
      <aside
        className="hidden lg:fixed lg:block lg:w-[340px]"
        style={{
          // Top of rail aligns with top of video: ~64px sticky TopNav +
          // 24px LiveSession lg:py-6 padding = 88px. Height fills viewport
          // with a 24px breathing gap at the bottom.
          top: "88px",
          height: "calc(100vh - 112px)",
          right: "calc(max(0px, (100vw - 1440px) / 2) + 16px)",
        }}
      >
        {/* No signpost in V5 — chat takes the full rail height. The slide
            preview lived here in V4; in V5 we removed it because the build
            view + face PIP already carry the active "what's happening" load
            and the slide preview wasn't pulling its weight. */}
        <div className="flex h-full flex-col">
          <ChatRail onReact={pushReaction} />
        </div>
      </aside>

      {/* Desktop floating PIP — appears when scrolled past OR when the user
          has tapped the PIP icon. Sits in the top-right of the left column
          area (left of the right rail). Includes the same VideoControls so
          the PIP icon can dock the video back. */}
      <div
        className={`hidden lg:block fixed top-4 z-40 w-[320px] overflow-hidden rounded-2xl bg-black shadow-[0_18px_50px_rgba(0,0,0,0.32)] transition-all duration-300 ease-out ${
          isPip ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!isPip}
        style={{
          right: "calc(max((100vw - 1440px) / 2, 0px) + 380px)",
          aspectRatio: "16 / 9",
        }}
      >
        {/* PIP shows just the build screen — the coach face + slide signpost
            stay visible in the right rail (which is also fixed) regardless
            of scroll position, so we don't need to repeat them here. */}
        <BuildScreen />
        <VideoControls isPipped={isPipped} onTogglePip={togglePip} />
      </div>

      {/* Mobile floating PIP — appears once the inline video has scrolled
          off. Half the viewport wide, anchored to top-right with a small
          inset. Tap-the-card toggles back to the full inline player. */}
      <button
        type="button"
        onClick={() => {
          if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`lg:hidden fixed top-2 right-2 z-40 w-[50vw] overflow-hidden rounded-xl bg-black shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out ${
          isPip ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!isPip}
        aria-label="Return to full player"
        style={{ aspectRatio: "16 / 9" }}
      >
        <CoachScreenShare>
          <CoachFacePip coach={session.coach} position="top-right" size="sm" />
        </CoachScreenShare>
        {/* tiny LIVE dot in the corner so it reads as the live stream */}
        <span className="pointer-events-none absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-[#E2574C] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-white">
          <span className="h-1 w-1 rounded-full bg-white" />
          Live
        </span>
      </button>

      {/* Mobile tray. Persistent overlay anchored right below the video
          (no title/coach chrome above it on V6). Inside: Info / Chat /
          Viewers pivot — Info first and selected by default, with a 5s
          auto-handoff to Chat. The tray's own auto-expand is disabled
          because the pivot switch is the V6 reveal. */}
      <BottomTray
        open={chatTrayOpen}
        lowTop={trayTops.low}
        highTop={trayTops.high}
        autoExpand={false}
      >
        <MobileChatTrayContent session={session} onReact={pushReaction} />
      </BottomTray>
    </div>
  );
}

export default function V5({ session }: { session: Session }) {
  return <StudioLayout session={session} />;
}
