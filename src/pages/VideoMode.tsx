import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { Button } from "../components/Button";

// Sidebar icons
import chatInactiveIcon from "../assets/icons/nav-icons/chat-inactive.svg";
import storeIcon from "../assets/icons/store.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import calendarIcon from "../assets/icons/calendar-page.svg";
import starReviewIcon from "../assets/icons/star-review.svg";
import moneyIcon from "../assets/icons/money.svg";
import starIcon from "../assets/icons/star-icon.svg";
import labelTagIcon from "../assets/icons/label-tag.svg";
import videoIcon from "../assets/icons/video-icon.svg";
import usersGroupIcon from "../assets/icons/users-group.svg";
import userIcon from "../assets/icons/user.svg";
import layoutGridIcon from "../assets/icons/layout-grid.svg";
import analyticsChartIcon from "../assets/icons/Business, Chart.7.svg";

import skyUrl from "../assets/photography/Sky.png";

const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

// Mask-tinted icon (from CoachLayout) — the source SVGs have hardcoded fills,
// so bg-current + a mask lets them inherit the row's text color.
function NavIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// Sky photo background (src/assets/photography/Sky.png) behind the app window.
const skyStyle = { backgroundImage: `url(${skyUrl})`, backgroundSize: "cover", backgroundPosition: "center" } as const;

// ---------------------------------------------------------------------------
// Sidebar mock (My Leland) — self-animating staggered entrance on mount.
// Rendered at natural 264px width; callers apply any zoom.
// ---------------------------------------------------------------------------

const stageV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const cardV: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.055, delayChildren: 0.1 },
  },
};
const rowV: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const personalRows = [
  { label: "Dashboard", icon: layoutGridIcon, active: true },
  { label: "Messages", icon: chatInactiveIcon, badge: 1 },
  { label: "Profile", icon: userIcon },
  { label: "Calendar", icon: calendarIcon },
  { label: "Goals", icon: starReviewIcon },
];

const expertRows = [
  { label: "Opportunities", icon: lightningIcon },
  { label: "Free Livestreams", icon: videoIcon },
  { label: "Paid Workshops", icon: usersGroupIcon },
  { label: "Earnings", icon: moneyIcon },
  { label: "Analytics", icon: analyticsChartIcon },
  { label: "Reviews", icon: starIcon },
  { label: "Discount Codes", icon: labelTagIcon },
];

function SidebarRow({ label, icon, badge, active }: { label: string; icon: string; badge?: number; active?: boolean }) {
  return (
    <motion.div
      variants={rowV}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] ${
        active ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light"
      }`}
    >
      <NavIcon src={icon} className="h-[22px] w-[22px]" />
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#F3392C] px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
          {badge}
        </span>
      )}
    </motion.div>
  );
}

const cardShell =
  "shrink-0 rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]";

function SidebarMock() {
  return (
    <motion.div variants={stageV} initial="hidden" animate="show" className="flex w-[264px] flex-col gap-4">
      {/* Personal card */}
      <motion.div variants={cardV} className={`${cardShell} p-2`}>
        <nav className="flex flex-col gap-1">
          {personalRows.map((r) => (
            <SidebarRow key={r.label} {...r} />
          ))}
        </nav>
      </motion.div>

      {/* Expert tools card */}
      <motion.div variants={cardV} className={`${cardShell} overflow-hidden`}>
        <motion.p
          variants={rowV}
          className="bg-gray-hover px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light"
        >
          Expert tools
        </motion.p>
        <nav className="flex flex-col gap-1 p-2">
          {/* Offerings accordion (collapsed) */}
          <motion.div
            variants={rowV}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] font-medium text-gray-light"
          >
            <NavIcon src={storeIcon} className="h-[22px] w-[22px]" />
            <span className="flex-1 text-left">Offerings</span>
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
          {expertRows.map((r) => (
            <SidebarRow key={r.label} {...r} />
          ))}
        </nav>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Real-UI clips — the actual /my-leland page in an iframe so the UI is pixel-
// identical to the app. ?mini=1 strips the promo/admin scaffolding; ?clip=1
// triggers the entrance cascade injected synchronously in index.html. The token
// (bumped on replay) forces a fresh reload so the cascade replays.
// ---------------------------------------------------------------------------

const FRAME_W = 1440;

function RealFrame({ token, height, title }: { token: number; height: number; title: string }) {
  return (
    <iframe
      key={token}
      src={`/my-leland?mini=1&clip=1&r=${token}`}
      title={title}
      scrolling="no"
      style={{ width: FRAME_W, height, border: 0, pointerEvents: "none" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Clips
// ---------------------------------------------------------------------------

function SidebarClip() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#F6F4EA]">
      <div style={{ transform: "scale(1.5)", transformOrigin: "center" }}>
        <SidebarMock />
      </div>
    </div>
  );
}

// Clip 2 — real top nav, zoomed into the top-RIGHT corner of the app window.
function NavbarClip({ token }: { token: number }) {
  const H = 900;
  return (
    <div className="relative h-full w-full overflow-hidden" style={skyStyle}>
      <div
        className="absolute right-[5%] top-[11%]"
        style={{ transformOrigin: "top right", transform: "scale(1.85)" }}
      >
        <div
          className="overflow-hidden rounded-[18px] bg-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.5)]"
          style={{ width: FRAME_W, height: H }}
        >
          <RealFrame token={token} height={H} title="Leland nav" />
        </div>
      </div>
    </div>
  );
}

// Clip 3 — full My Leland dashboard on the sky, slowly shrinking while nav,
// sidebar, and content cards run their staggered entrance.
function DashboardShrinkClip({ token }: { token: number }) {
  const H = 940;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={skyStyle}>
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 0.72 }}
        transition={{ duration: 7.5, ease: [0.33, 0, 0.1, 1], delay: 0.15 }}
        className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
        style={{ width: FRAME_W, height: H }}
      >
        <RealFrame token={token} height={H} title="Leland dashboard" />
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clip registry
// ---------------------------------------------------------------------------

type Clip = { id: string; title: string; subtitle: string; render: (token: number) => ReactNode };

const clips: Clip[] = [
  { id: "my-leland-sidebar", title: "My Leland sidebar", subtitle: "Staggered entrance", render: () => <SidebarClip /> },
  { id: "top-navbar", title: "Top navbar", subtitle: "Zoom · staggered entrance", render: (t) => <NavbarClip token={t} /> },
  { id: "dashboard-shrink", title: "Dashboard", subtitle: "Full page, shrinking", render: (t) => <DashboardShrinkClip token={t} /> },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VideoMode() {
  const [activeId, setActiveId] = useState(clips[0].id);
  // Bumping this key remounts the active clip, re-triggering its entrance so a
  // clip can be replayed for a clean screen recording.
  const [playKey, setPlayKey] = useState(0);

  const active = clips.find((c) => c.id === activeId)!;

  const select = (id: string) => {
    setActiveId(id);
    setPlayKey((k) => k + 1);
  };
  const replay = () => setPlayKey((k) => k + 1);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-[15px] font-semibold tracking-tight">Video Mode</span>
          <span className="text-[13px] text-white/40">{active.title}</span>
        </div>
        <Button size="sm" variant="white" onClick={replay}>
          Replay
        </Button>
      </header>

      <div className="flex flex-1 gap-5 px-6 pb-6">
        {/* Stage */}
        <div className="relative min-w-0 flex-1 overflow-hidden ring-1 ring-white/10">
          <div key={playKey} className="h-full w-full">
            {active.render(playKey)}
          </div>
        </div>

        {/* Switcher rail */}
        <div className="flex w-[260px] shrink-0 flex-col gap-3 overflow-y-auto">
          {clips.map((clip, i) => {
            const isActive = clip.id === activeId;
            return (
              <button
                key={clip.id}
                onClick={() => select(clip.id)}
                className={`flex aspect-[4/3] flex-col justify-between rounded-[14px] p-4 text-left transition-colors ${
                  isActive ? "bg-[#1F5340] text-white" : "bg-white/[0.04] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <span className={`text-[13px] font-semibold tabular-nums ${isActive ? "text-white/90" : "text-white/40"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[15px] font-semibold leading-tight">{clip.title}</div>
                  <div className={`mt-0.5 text-[13px] ${isActive ? "text-white/70" : "text-white/40"}`}>{clip.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
