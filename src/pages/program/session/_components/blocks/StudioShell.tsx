import { useState, type ReactNode } from "react";
import type { Session } from "../../_types";
import sharesIcon from "../../../../../assets/icons/shares.svg";
import RailSignpost from "./RailSignpost";
import SessionGuide from "./SessionGuide";
import Resources from "./Resources";
import ChatPanel from "./ChatPanel";

// V4-style layout shell. Used by V4 (live) and the pre-session / just-ended
// views so all three share the same shape: edge-bleed 16:9 canvas on mobile,
// title block beneath, tabs+share row, fixed right rail with signpost on top
// and chat below.
//
// Each state passes its own `canvas` content (Claude terminal, countdown
// cover, replay player, etc.) plus a `chatSignal` label so the lobby/active/
// post-session feel can be hinted at if needed in future. The rest of the
// shell is identical across states.

type Tab = "guide" | "resources";

type Props = {
  session: Session;
  canvas: ReactNode;
  /** Signpost progress 0–1 — defaults differ per state (0 pre, 1 ended). */
  progress?: number;
  /** Drop the right rail (signpost + chat). Used for pre-session where the
   *  slide preview doesn't exist yet and chat would be empty. */
  hideRail?: boolean;
};

export default function StudioShell({ session, canvas, progress, hideRail = false }: Props) {
  const [tab, setTab] = useState<Tab>("guide");

  return (
    <div className={hideRail
      ? "grid grid-cols-1 gap-3 lg:gap-6"
      : "grid grid-cols-1 gap-3 lg:grid-cols-[1fr_340px] lg:gap-6"}>

      {/* LEFT COLUMN — canvas → title → tabs+share → tab content.
          Padded on mobile so the title/tabs/content sit inside 16px gutters,
          but the canvas itself breaks out with -mx-4 to edge-bleed. */}
      <div className="flex min-w-0 flex-col gap-4 px-4 lg:gap-6 lg:px-0">
        {/* Canvas */}
        <div
          className="relative -mx-4 w-auto lg:mx-0 lg:w-full"
          style={{ aspectRatio: "16 / 9", overflow: "hidden" }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black lg:rounded-2xl lg:shadow-lg">
            {canvas}
          </div>
        </div>

        {/* Title block */}
        <TopBar session={session} />

        {/* Tabs + share */}
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:overflow-visible lg:justify-between lg:px-0 lg:py-0">
          <TabsNav tab={tab} onChange={setTab} />
          <div className="shrink-0">
            <ShareButton />
          </div>
        </div>

        <TabContent tab={tab} />
      </div>

      {/* RIGHT COLUMN (desktop only) — signpost on top, chat below.
          Suppressed when hideRail is set (pre-session has no slide preview
          and no live chat yet). */}
      {!hideRail && (
        <aside
          className="hidden lg:fixed lg:top-20 lg:block lg:w-[340px]"
          style={{
            height: "calc(100vh - 6.5rem)",
            right: "calc(max(0px, (100vw - 1440px) / 2) + 16px)",
          }}
        >
          <div className="flex h-full flex-col gap-3">
            <div
              className="relative shrink-0 overflow-hidden rounded-2xl bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              <RailSignpost session={session} progress={progress} />
            </div>
            <div className="min-h-0 flex-1">
              <ChatPanel />
            </div>
          </div>
        </aside>
      )}
    </div>
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
      <div className="text-[14px] text-gray-light lg:text-[17px]">
        AI Builder Program Level 1 · Session {session.number}
      </div>
      <h1 className="text-[22px] font-medium leading-[1.1] text-gray-dark sm:text-[28px] lg:text-[32px]">
        {session.title}
      </h1>
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

function TabsNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "guide", label: "Session guide" },
    { id: "resources", label: "Resources" },
  ];
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
              active ? "text-gray-dark ring-2 ring-gray-dark" : "text-gray-light hover:text-gray-dark"
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
  }
}

function ShareButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-full bg-gray-hover px-4 py-2 text-gray-dark transition-colors hover:bg-gray-hover/60"
    >
      <img src={sharesIcon} alt="" className="h-4 w-4 [filter:invert(20%)]" />
      <span className="text-[14px] font-semibold">Share</span>
    </button>
  );
}
