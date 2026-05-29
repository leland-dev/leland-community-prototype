import { useState, type ReactNode } from "react";
import pic1 from "../../../../../assets/profile photos/pic-1.png";
import pic2 from "../../../../../assets/profile photos/pic-2.png";
import pic3 from "../../../../../assets/profile photos/pic-3.png";
import pic4 from "../../../../../assets/profile photos/pic-4.png";
import pic5 from "../../../../../assets/profile photos/pic-5.png";
import pic6 from "../../../../../assets/profile photos/pic-6.png";
import pic8 from "../../../../../assets/profile photos/pic-8.png";
import verifiedIcon from "../../../../../assets/icons/verified.svg";
import ChatPanel from "./ChatPanel";

// Tabbed rail wrapper for the live session side panel. Holds the chat as
// the default tab, plus a Viewers list and a Polls pane. The pill chips
// reuse the same styling as the Session-guide tabs below the video so
// the whole page feels consistent.

type Tab = "chat" | "viewers" | "polls";

type Props = {
  /** Slot rendered above the chat input — V5 uses it for the ReactionBar. */
  chatAboveInput?: ReactNode;
};

export default function ChatRail({ chatAboveInput }: Props) {
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-gray-stroke bg-white">
      {/* Tab strip */}
      <div className="flex shrink-0 items-center gap-1.5 border-b border-gray-stroke px-3 py-2">
        <TabPill active={tab === "chat"} onClick={() => setTab("chat")}>
          Chat
        </TabPill>
        <TabPill active={tab === "viewers"} onClick={() => setTab("viewers")}>
          Viewers <span className="text-gray-light">47</span>
        </TabPill>
        <TabPill active={tab === "polls"} onClick={() => setTab("polls")}>
          Polls
        </TabPill>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "chat" && (
          <ChatPanel hideHeader aboveInput={chatAboveInput} />
        )}
        {tab === "viewers" && <ViewersPane />}
        {tab === "polls" && <PollsPane />}
      </div>
    </div>
  );
}

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-all ${
        active
          ? "bg-gray-hover text-gray-dark ring-2 ring-gray-dark"
          : "text-gray-light hover:bg-gray-hover hover:text-gray-dark"
      }`}
    >
      {children}
    </button>
  );
}

// ── Viewers ──────────────────────────────────────────────
type Viewer = {
  name: string;
  avatar: string;
  coach?: boolean;
  hostLabel?: string;
  handRaised?: boolean;
};
const VIEWERS: Viewer[] = [
  { name: "Tanner Helin", avatar: pic1, coach: true, hostLabel: "Host" },
  { name: "Sarah C.", avatar: pic3 },
  { name: "Marcus L.", avatar: pic4 },
  { name: "Priya N.", avatar: pic5 },
  { name: "Jordan T.", avatar: pic6, handRaised: true },
  { name: "Anya P.", avatar: pic2 },
  { name: "David M.", avatar: pic8 },
  { name: "Vincent K.", avatar: pic3 },
  { name: "Rima F.", avatar: pic5 },
  { name: "Casey W.", avatar: pic6 },
  { name: "Sam T.", avatar: pic4 },
];

function ViewersPane() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-light">
        47 watching · 1 on stage
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {VIEWERS.map((v) => (
          <li key={v.name}>
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-hover">
              <img
                src={v.avatar}
                alt=""
                className="h-7 w-7 shrink-0 rounded-full object-cover"
                style={{ objectPosition: "50% 15%" }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-[13px] font-medium text-gray-dark">
                    {v.name}
                  </span>
                  {v.coach && (
                    <img
                      src={verifiedIcon}
                      alt="Coach"
                      className="h-[12px] w-[12px] shrink-0"
                    />
                  )}
                </div>
                {v.hostLabel && (
                  <div className="text-[11px] text-gray-light">{v.hostLabel}</div>
                )}
              </div>
              {v.handRaised && (
                <span className="shrink-0 rounded-md bg-[#FFFBE5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#876C00]">
                  Hand
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Polls ────────────────────────────────────────────────
const POLL = {
  question: "Which agent are you building first?",
  total: 38,
  options: [
    { label: "Customer research bot", votes: 17 },
    { label: "Inbox triage agent", votes: 12 },
    { label: "CRM hygiene worker", votes: 6 },
    { label: "Something else", votes: 3 },
  ],
};

function PollsPane() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <div className="rounded-lg border border-gray-stroke bg-white">
        <div className="flex items-center justify-between border-b border-gray-stroke px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#038561]">
            Live poll
          </span>
          <span className="text-[11px] text-gray-light">{POLL.total} votes</span>
        </div>
        <div className="px-3 py-3">
          <h3 className="text-[14px] font-semibold text-gray-dark">{POLL.question}</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {POLL.options.map((opt) => {
              const pct = Math.round((opt.votes / POLL.total) * 100);
              return (
                <li key={opt.label}>
                  <button
                    type="button"
                    className="group relative w-full overflow-hidden rounded-md border border-gray-stroke bg-white px-3 py-2 text-left transition-colors hover:bg-gray-hover"
                  >
                    <span
                      className="absolute inset-y-0 left-0 bg-[#038561]/10 transition-all"
                      style={{ width: `${pct}%` }}
                      aria-hidden
                    />
                    <span className="relative flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-gray-dark">
                        {opt.label}
                      </span>
                      <span className="text-[12px] tabular-nums text-gray-light">
                        {pct}%
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-[12px] text-gray-light">
        Polls posted by the coach appear here. Tap an option to vote.
      </div>
    </div>
  );
}
