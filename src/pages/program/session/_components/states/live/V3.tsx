import { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Forward,
  Play,
  Volume2,
  Captions,
  Settings,
  Maximize,
  PictureInPicture2,
} from "lucide-react";
import type { Session } from "../../../_types";
import CoachScreenShare from "../../blocks/CoachScreenShare";
import CoachFacePip from "../../blocks/CoachFacePip";
import SessionGuide from "../../blocks/SessionGuide";
import ChatPanel from "../../blocks/ChatPanel";
import RateSessionPopup from "../../blocks/RateSessionPopup";
import BottomTray from "../../blocks/BottomTray";

type Tab = "guide" | "chat";

// Mocked Cloudflare-style player controls. Overlays the bottom of the video
// with a gradient for legibility. Most buttons are visual only — the PIP
// button toggles the floating mode.
function VideoControls({
  isPipped,
  onTogglePip,
}: {
  isPipped?: boolean;
  onTogglePip?: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pb-1 pt-5 lg:gap-2 lg:px-4 lg:pb-3 lg:pt-12">
      {/* Buffer / live-edge bar */}
      <div className="pointer-events-auto relative h-0.5 w-full rounded-full bg-white/15 lg:h-1">
        <div className="absolute inset-y-0 left-0 w-[78%] rounded-full bg-white/65" />
        <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-[#E2574C] ring-2 ring-white/30 lg:h-2.5 lg:w-2.5" />
      </div>
      {/* Button row */}
      <div className="pointer-events-auto flex items-center gap-0.5 text-white lg:gap-3">
        <button type="button" aria-label="Play" className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 lg:h-8 lg:w-8">
          <Play className="h-2.5 w-2.5 lg:h-4 lg:w-4" fill="white" strokeWidth={0} />
        </button>
        <div className="flex items-center gap-0.5 rounded-full bg-[#E2574C] px-1 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] lg:gap-1.5 lg:px-2 lg:text-[10px]">
          <span className="h-1 w-1 rounded-full bg-white lg:h-1.5 lg:w-1.5" />
          Live
        </div>
        <button type="button" aria-label="Volume" className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 lg:h-8 lg:w-8">
          <Volume2 className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
        </button>
        <span className="text-[9px] tabular-nums text-white/85 lg:text-[12px]">12:34 / 1:30:00</span>
        <span className="flex-1" />
        <button type="button" aria-label="Captions" className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 lg:h-8 lg:w-8">
          <Captions className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
        </button>
        <button type="button" aria-label="Settings" className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 lg:h-8 lg:w-8">
          <Settings className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
        </button>
        <button
          type="button"
          onClick={onTogglePip}
          aria-label={isPipped ? "Exit picture in picture" : "Picture in picture"}
          aria-pressed={isPipped}
          className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors lg:h-8 lg:w-8 ${
            isPipped ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <PictureInPicture2 className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
        </button>
        <button type="button" aria-label="Fullscreen" className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 lg:h-8 lg:w-8">
          <Maximize className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
        </button>
      </div>
    </div>
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
        <h2 className="text-[15px] font-medium text-gray-dark">Resources</h2>
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
              <span className="flex-1 text-[14px] font-medium text-gray-dark">{r.label}</span>
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
        <span className="text-[14px] font-semibold">3</span>
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
      <Forward size={16} strokeWidth={2} />
      <span className="text-[14px] font-semibold">Share</span>
    </button>
  );
}

function TopBar({ session }: { session: Session }) {
  const startDate = new Date(session.startsAt);
  const endDate = new Date(session.endsAt);
  const durationMin = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  const isToday = startDate.toDateString() === new Date().toDateString();
  const dateLabel = isToday
    ? "Today"
    : startDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeLabel = startDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-1.5 lg:gap-2">
      {/* Program / level / session */}
      <div className="text-[14px] text-gray-light lg:text-[17px]">
        AI Builder Program Level 1 · Session {session.number}
      </div>
      {/* Title — big bold */}
      <h1 className="text-[22px] font-medium leading-[1.1] text-gray-dark sm:text-[28px] lg:text-[32px]">
        {session.title}
      </h1>
      {/* Date · time · duration · attendance */}
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-light lg:gap-3 lg:text-[17px]">
        <span>
          {dateLabel} · {timeLabel} PT
        </span>
        <span className="text-gray-stroke">·</span>
        <span>{durationMin} min</span>
        <span className="text-gray-stroke">·</span>
        <span>124 attending</span>
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
    <div className="flex shrink-0 items-center gap-2 text-[14px] font-semibold">
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
    case "chat":
      // Chat is rendered in the BottomTray on mobile, not in the tab content
      // area. This case is unreachable in normal use but kept for type safety.
      return null;
  }
}


function StudioLayout({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>("guide");

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

  // Mobile-only: Chat is a pivot tab that pops up a bottom tray.
  const [chatTrayOpen, setChatTrayOpen] = useState(false);

  // Mobile vs desktop drives whether Chat is a tab.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // If user switches to desktop while Chat tab was active, fall back.
  useEffect(() => {
    if (isDesktop && tab === "chat") setTab("guide");
  }, [isDesktop, tab]);

  // On mobile, Chat is a pivot pill that opens the bottom tray instead of
  // switching the tab content. Resources is also surfaced here on mobile
  // since the right rail is hidden.
  const tabs: { id: Tab; label: string }[] = isDesktop
    ? [{ id: "guide", label: "Session guide" }]
    : [
        { id: "guide", label: "Session guide" },
        { id: "chat", label: "Chat" },
      ];

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_340px] lg:gap-6">
      {/* LEFT COLUMN: video → title → tabs+actions row → content.
          Padded on mobile so the title/tabs/content sit inside 16px gutters,
          but the video itself breaks out with -mx-4 below to edge-bleed. */}
      <div className="flex min-w-0 flex-col gap-4 px-4 lg:gap-6 lg:px-0">
        {/* Video slot — on mobile it sticks to the top of the viewport so the
            page scrolls under it. On desktop it sits in normal flow; when
            isPip is on (scroll-off or PIP toggle) the inline player is
            replaced by a placeholder and the floating tile takes over. */}
        <div
          ref={placeholderRef}
          className="-mx-4 w-auto sticky top-0 z-30 lg:relative lg:top-auto lg:z-auto lg:mx-0 lg:w-full"
          style={{
            aspectRatio: isPipped ? undefined : "16 / 9",
            height: isPipped ? 0 : undefined,
            overflow: "hidden",
          }}
        >
          {!isPip && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-black shadow-lg">
              <CoachScreenShare>
                <CoachFacePip coach={session.coach} position="top-right" />
              </CoachScreenShare>
              <VideoControls isPipped={isPipped} onTogglePip={togglePip} />
              <RateSessionPopup suppressed={isPip} />
            </div>
          )}
        </div>

        {/* Title BELOW the video */}
        <TopBar session={session} />

        {/* Tabs + actions row.
            Mobile: single horizontal-scrolling row (tabs immediately followed
              by Thumbs + Share — all four pills scrollable together).
            Desktop: tabs left, actions right via justify-between. */}
        <div
          className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:overflow-visible lg:justify-between lg:px-0 lg:py-0"
        >
          <TabsNav
            tab={chatTrayOpen ? "chat" : tab}
            onChange={(id) => {
              // Chat pill on mobile pops a bottom tray instead of changing
              // the inline tab content.
              if (id === "chat") setChatTrayOpen(true);
              else setTab(id);
            }}
            tabs={tabs}
          />
          <div className="flex shrink-0 items-center gap-2">
            <ThumbsPill />
            <ShareButton />
          </div>
        </div>

        <TabContent tab={tab} />
      </div>

      {/* RIGHT COLUMN (desktop only): coach face on top, chat fills the rest.
          Sticky top-4 effectively pins it to the right hand side as a fixed
          element. Height capped so the chat input is always above the fold. */}
      <aside
        className="hidden lg:fixed lg:top-20 lg:block lg:w-[340px]"
        style={{
          height: "calc(100vh - 6.5rem)",
          // Align right edge with the content's right edge — handles both
          // narrow viewports (px-4 padding) and wide viewports (centered at
          // max-w 1440).
          right: "calc(max(0px, (100vw - 1440px) / 2) + 16px)",
        }}
      >
        <div className="flex h-full flex-col gap-3">
          {/* Resources at top, chat fills the remaining height */}
          <div className="shrink-0">
            <CompactResources />
          </div>
          <div className="min-h-0 flex-1">
            <ChatPanel />
          </div>
        </div>
      </aside>

      {/* Floating PIP — appears when scrolled past OR when the user has
          tapped the PIP icon. Sits in the top-right of the left column area
          (left of the right rail). Includes the same VideoControls so the
          PIP icon can dock the video back. */}
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
        <CoachScreenShare>
          <CoachFacePip coach={session.coach} position="top-right" size="sm" />
        </CoachScreenShare>
        <VideoControls isPipped={isPipped} onTogglePip={togglePip} />
      </div>

      {/* Mobile-only chat tray. Slides up from bottom when the Chat pivot
          pill is tapped. Uses dvh sizing so the mobile keyboard pushes the
          sheet up gracefully. */}
      <BottomTray open={chatTrayOpen} title="Chat" onClose={() => setChatTrayOpen(false)}>
        <ChatPanel hideHeader />
      </BottomTray>
    </div>
  );
}

export default function V3({ session }: { session: Session }) {
  return <StudioLayout session={session} />;
}
