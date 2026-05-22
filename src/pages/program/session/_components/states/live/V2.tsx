import { useEffect, useRef, useState } from "react";
import { ThumbsUp, ThumbsDown, Forward } from "lucide-react";
import type { Session } from "../../../_types";
import CoachScreenShare from "../../blocks/CoachScreenShare";
import CoachFaceVideo from "../../blocks/CoachFaceVideo";
import SessionGuide from "../../blocks/SessionGuide";
import Resources from "../../blocks/Resources";
import ChatPanel from "../../blocks/ChatPanel";
import RateSessionPopup from "../../blocks/RateSessionPopup";

type Tab = "guide" | "resources" | "chat";

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
    <div className="flex flex-col gap-2">
      {/* Program / level / session — bumped to 17px */}
      <div className="text-[17px] text-gray-light">
        AI Builder Program Level 1 · Session {session.number}
      </div>
      {/* Title — big bold */}
      <h1 className="text-[28px] font-medium leading-[1.05] text-gray-dark sm:text-[32px]">
        {session.title}
      </h1>
      {/* Date · time · duration · attendance — bumped to 17px */}
      <div className="flex flex-wrap items-center gap-3 text-[17px] text-gray-light">
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
    <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`cursor-pointer rounded-full bg-gray-hover px-4 py-2 transition-all ${
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
      return (
        <div className="h-[520px]">
          <ChatPanel />
        </div>
      );
  }
}


function StudioLayout({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>("guide");

  // V2 approach: video lives in normal scroll flow. An IntersectionObserver
  // tracks whether *any* part of the video is on screen. When the video has
  // fully scrolled off, we fade in a fixed PIP at the top-right corner. When
  // the user scrolls back and any pixel of the video re-enters the viewport,
  // the PIP fades out. No sticky shrink, no width animation mid-scroll —
  // just two clean states with a fade between them.
  const videoRef = useRef<HTMLDivElement>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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

  const tabs: { id: Tab; label: string }[] = isDesktop
    ? [
        { id: "guide", label: "Session guide" },
        { id: "resources", label: "Resources" },
      ]
    : [
        { id: "guide", label: "Session guide" },
        { id: "resources", label: "Resources" },
        { id: "chat", label: "Chat" },
      ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] lg:gap-6">
      {/* LEFT COLUMN: video → title → tabs+actions row → content */}
      <div className="flex min-w-0 flex-col gap-6">
        {/* Video — normal flow, scrolls naturally with the page */}
        <div
          ref={videoRef}
          className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg"
          style={{ aspectRatio: "16 / 9" }}
        >
          <CoachScreenShare />
          <RateSessionPopup suppressed={scrolledPast} />
        </div>

        {/* Title BELOW the video */}
        <TopBar session={session} />

        {/* MOBILE-ONLY face cam — below the title on mobile. */}
        {!isDesktop && <CoachFaceVideo coach={session.coach} />}

        {/* Tabs row with action buttons right-aligned */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsNav tab={tab} onChange={setTab} tabs={tabs} />
          <div className="flex items-center gap-2">
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
          <div className="shrink-0" style={{ height: 160 }}>
            <CoachFaceVideo coach={session.coach} fill />
          </div>
          <div className="min-h-0 flex-1">
            <ChatPanel />
          </div>
        </div>
      </aside>

      {/* Fixed PIP — fades in only after the original video has fully scrolled
          off the page. Aligned to the left edge of the right rail, so it sits
          in the top-right of the left column area. The `right` calc handles
          both viewports narrower than 1440px (where content fills with px-4)
          and wider viewports (where content centers at 1440 max-width). */}
      <div
        className={`pointer-events-none hidden lg:block fixed top-4 z-40 w-[280px] overflow-hidden rounded-2xl bg-black shadow-[0_12px_40px_rgba(0,0,0,0.22)] transition-opacity duration-300 ease-out ${
          scrolledPast ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!scrolledPast}
        style={{
          right: "calc(max((100vw - 1440px) / 2, 0px) + 380px)",
          aspectRatio: "16 / 9",
        }}
      >
        <CoachScreenShare />
      </div>
    </div>
  );
}

export default function V2({ session }: { session: Session }) {
  return <StudioLayout session={session} />;
}
