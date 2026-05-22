import { useEffect, useState } from "react";
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

  // Binary compact mode with hysteresis and an "enter" debounce — once the
  // user crosses the ENTER threshold we wait ENTER_DELAY ms before snapping,
  // which gives the scroll motion time to settle and avoids the weird gap
  // between the video and the header text mid-scroll. Exit (back to full) is
  // immediate.
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ENTER = 120;
    const EXIT = 8;
    const ENTER_DELAY = 220;
    let pendingEnter: number | undefined;

    const fireEnter = () => {
      pendingEnter = undefined;
      if (window.scrollY > ENTER) setIsCompact(true);
    };

    const onScroll = () => {
      const y = window.scrollY;
      setIsCompact((prev) => {
        if (prev) {
          // Currently compact — exit immediately when scrolled near the top
          if (y <= EXIT) {
            if (pendingEnter !== undefined) {
              window.clearTimeout(pendingEnter);
              pendingEnter = undefined;
            }
            return false;
          }
          return true;
        }
        // Currently full — debounce the snap to compact
        if (y > ENTER) {
          if (pendingEnter === undefined) {
            pendingEnter = window.setTimeout(fireEnter, ENTER_DELAY);
          }
        } else if (pendingEnter !== undefined) {
          window.clearTimeout(pendingEnter);
          pendingEnter = undefined;
        }
        return false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      if (pendingEnter !== undefined) window.clearTimeout(pendingEnter);
      window.removeEventListener("scroll", onScroll);
    };
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
        {/* Sticky video — binary state, CSS-transitioned. Anchored right via
            self-end so it lands up-and-to-the-right. Compact uses a fixed
            280×200 (≈1.4 ratio) so it doesn't feel horizontally stretched. */}
        <div
          className="sticky top-4 z-20 self-end overflow-hidden rounded-2xl bg-black shadow-lg transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
          style={{
            width: isCompact ? "280px" : "100%",
            height: isCompact ? "200px" : undefined,
            aspectRatio: isCompact ? undefined : "16 / 9",
          }}
        >
          <CoachScreenShare />
          <RateSessionPopup suppressed={isCompact} />
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
    </div>
  );
}

export default function V1({ session }: { session: Session }) {
  return <StudioLayout session={session} />;
}
