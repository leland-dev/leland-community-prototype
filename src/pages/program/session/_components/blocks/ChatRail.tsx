import { useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../../../../components/Button";
import pic1 from "../../../../../assets/profile photos/pic-1.png";
import pic2 from "../../../../../assets/profile photos/pic-2.png";
import pic3 from "../../../../../assets/profile photos/pic-3.png";
import pic4 from "../../../../../assets/profile photos/pic-4.png";
import pic5 from "../../../../../assets/profile photos/pic-5.png";
import pic6 from "../../../../../assets/profile photos/pic-6.png";
import pic8 from "../../../../../assets/profile photos/pic-8.png";
import verifiedIcon from "../../../../../assets/icons/verified.svg";
import ChatPanel from "./ChatPanel";
import Resources from "./Resources";

// Tabbed rail wrapper for the live session side panel. Holds the chat as
// the default tab, plus Viewers, Polls, and Resources panes. The pill
// chips reuse the same styling as the Session-guide tabs below the video
// so the whole page feels consistent.

type Tab = "chat" | "viewers" | "polls" | "resources";

type Props = {
  /** Fires a live reaction over the video. Drives the smiley emoji
   *  picker inside the chat input. */
  onReact?: (emoji: string) => void;
};

export default function ChatRail({ onReact }: Props) {
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {/* Tab strip — floats above the panel, no card frame around it.
          Inset padding (p-1) gives the active pill's ring-2 room to
          render on all four sides; matching negative margin (-m-1) on
          the outside cancels it out so the strip's layout footprint is
          unchanged. */}
      <div className="-m-1 flex shrink-0 items-center gap-1.5 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabPill active={tab === "chat"} onClick={() => setTab("chat")}>
          Chat
        </TabPill>
        <TabPill active={tab === "viewers"} onClick={() => setTab("viewers")}>
          Viewers <span className="text-gray-light">20</span>
        </TabPill>
        <TabPill active={tab === "polls"} onClick={() => setTab("polls")}>
          Polls
        </TabPill>
        <TabPill active={tab === "resources"} onClick={() => setTab("resources")}>
          Resources
        </TabPill>
      </div>

      {/* Content card — rounded box below the tabs. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        {tab === "chat" && (
          <ChatPanel hideHeader onReact={onReact} />
        )}
        {tab === "viewers" && <ViewersPane />}
        {tab === "polls" && <PollsPane />}
        {tab === "resources" && (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <Resources compact />
          </div>
        )}
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
      className={`flex shrink-0 items-center gap-1 rounded-full bg-gray-hover px-3 py-1.5 text-[11px] font-semibold transition-all ${
        active
          ? "text-gray-dark ring-2 ring-gray-dark"
          : "text-gray-light hover:text-gray-dark"
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

export function ViewersPane() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-light">
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
                  <span className="truncate text-[11px] font-medium text-gray-dark">
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
                  <div className="text-[10px] text-gray-light">{v.hostLabel}</div>
                )}
              </div>
              {v.handRaised && (
                <span className="shrink-0 text-[10px] font-medium text-gray-light">
                  Hand raised
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
type PollOption = { label: string; votes: number };
type Poll = { question: string; options: PollOption[]; total: number };

const INITIAL_POLL: Poll = {
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
  // Two modes: viewing the active poll, or creating a new one. Posting a
  // new poll replaces the active poll (in production this would be a
  // separate "history" with the current one on top).
  const [poll, setPoll] = useState<Poll>(INITIAL_POLL);
  const [creating, setCreating] = useState(false);

  if (creating) {
    return (
      <PollCreator
        onCancel={() => setCreating(false)}
        onPost={(next) => {
          setPoll(next);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
      <ActivePoll poll={poll} />
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-stroke px-3 py-2.5 text-[11px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
      >
        <Plus size={14} strokeWidth={2.25} />
        New poll
      </button>
      <p className="mt-2 text-[10px] text-gray-light">
        Coaches can post a poll any time. Replaces the current one.
      </p>
    </div>
  );
}

function ActivePoll({ poll }: { poll: Poll }) {
  return (
    <div className="rounded-lg border border-gray-stroke bg-white">
      <div className="flex items-center justify-between border-b border-gray-stroke px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#038561]">
          Live poll
        </span>
        <span className="text-[10px] text-gray-light">{poll.total} votes</span>
      </div>
      <div className="px-3 py-3">
        <h3 className="text-[12px] font-semibold text-gray-dark">{poll.question}</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {poll.options.map((opt) => {
            const pct = poll.total > 0 ? Math.round((opt.votes / poll.total) * 100) : 0;
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
                    <span className="text-[11px] font-medium text-gray-dark">
                      {opt.label}
                    </span>
                    <span className="text-[10px] tabular-nums text-gray-light">
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
  );
}

// ── Poll creator ────────────────────────────────────────────
// Question + 2–4 option inputs + Cancel/Post. Min 2, max 4 options.
// Post is disabled until the question and at least 2 options have text.

const MAX_POLL_OPTIONS = 4;
const MIN_POLL_OPTIONS = 2;

function PollCreator({
  onCancel,
  onPost,
}: {
  onCancel: () => void;
  onPost: (poll: Poll) => void;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const trimmedQuestion = question.trim();
  const filledOptions = options.map((o) => o.trim()).filter(Boolean);
  const canPost = trimmedQuestion.length > 0 && filledOptions.length >= MIN_POLL_OPTIONS;

  function updateOption(idx: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === idx ? value : o)));
  }
  function addOption() {
    if (options.length < MAX_POLL_OPTIONS) setOptions((prev) => [...prev, ""]);
  }
  function removeOption(idx: number) {
    if (options.length > MIN_POLL_OPTIONS) {
      setOptions((prev) => prev.filter((_, i) => i !== idx));
    }
  }
  function handlePost() {
    if (!canPost) return;
    onPost({
      question: trimmedQuestion,
      total: 0,
      options: filledOptions.map((label) => ({ label, votes: 0 })),
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-semibold text-gray-dark">New poll</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
        >
          <X size={15} />
        </button>
      </div>

      {/* Question */}
      <label className="mt-3 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-light">
          Question
        </span>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask the room?"
          maxLength={140}
          className="mt-1.5 w-full rounded-lg bg-gray-hover px-3 py-2 text-[12px] text-gray-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gray-dark/10"
        />
      </label>

      {/* Options */}
      <div className="mt-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-light">
          Options
        </span>
        <ul className="mt-1.5 flex flex-col gap-2">
          {options.map((value, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-hover text-[10px] font-semibold text-gray-light">
                {idx + 1}
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                maxLength={80}
                className="min-w-0 flex-1 rounded-lg bg-gray-hover px-3 py-2 text-[12px] text-gray-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gray-dark/10"
              />
              {options.length > MIN_POLL_OPTIONS && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  aria-label="Remove option"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
                >
                  <X size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
        {options.length < MAX_POLL_OPTIONS && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
          >
            <Plus size={13} strokeWidth={2.25} />
            Add option
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-end gap-2 pt-4">
        <Button size="sm" variant="secondary" rounded="rounded-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="primary"
          rounded="rounded-full"
          disabled={!canPost}
          onClick={handlePost}
        >
          Post poll
        </Button>
      </div>
    </div>
  );
}
