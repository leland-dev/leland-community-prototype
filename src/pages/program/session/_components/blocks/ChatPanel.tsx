import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { X, ArrowUp, Pin, PinOff, Trash2 } from "lucide-react";
import verifiedIcon from "../../../../../assets/icons/verified.svg";
import pic1 from "../../../../../assets/profile photos/pic-1.png";
import pic3 from "../../../../../assets/profile photos/pic-3.png";
import pic4 from "../../../../../assets/profile photos/pic-4.png";
import pic5 from "../../../../../assets/profile photos/pic-5.png";
import pic6 from "../../../../../assets/profile photos/pic-6.png";
import selfAvatar from "../../../../../assets/profile photos/profile photo.png";

type Message = {
  id: string;
  author: string;
  avatar: string;
  body: string;
  coach?: boolean;
  self?: boolean;
  replyTo?: string; // id of the top-level parent message
  /** When set, render as a centered system notice (not a user message). */
  system?: "purchase" | "hand-raised" | "joined";
};

// Scripted drip-in. On mount the chat starts empty and these messages
// land one at a time, mixed with system notices (purchases, hand-raises).
// In a real session the wire would drive this; the script is here so the
// prototype feels alive on every refresh.
const SCRIPT: { delay: number; msg: Message }[] = [
  { delay: 1200, msg: { id: "m1", author: "Tanner H.", avatar: pic1, coach: true, body: "We're live — make sure Claude Code is open in another window." } },
  { delay: 3000, msg: { id: "m2", author: "Sarah C.", avatar: pic3, body: "👋 in from Brooklyn" } },
  { delay: 5200, msg: { id: "sys-join-1", author: "system", avatar: pic6, system: "joined", body: "Jordan T. joined the stream" } },
  { delay: 7000, msg: { id: "m3", author: "Priya N.", avatar: pic5, body: "Are these prompts in the shared repo yet?" } },
  { delay: 9200, msg: { id: "sys-purchase-1", author: "system", avatar: pic4, system: "purchase", body: "Marcus L. just booked coaching with Tanner Helin" } },
  { delay: 10800, msg: { id: "m4", author: "Marcus L.", avatar: pic4, body: "excited for this one 🔥" } },
  { delay: 13500, msg: { id: "m5", author: "Sarah C.", avatar: pic3, body: "Should the agent's memory live inline or in a separate tool call?" } },
  { delay: 17500, msg: { id: "r1", author: "Tanner H.", avatar: pic1, coach: true, replyTo: "m5", body: "Inline is fine for short context — break it out when you need cross-turn recall." } },
  { delay: 20000, msg: { id: "sys-purchase-2", author: "system", avatar: pic3, system: "purchase", body: "Sarah C. just booked coaching with Tanner Helin" } },
  { delay: 22000, msg: { id: "m6", author: "Marcus L.", avatar: pic4, body: "Lost in step 2 — what's the recommended way to wire tools when running locally?" } },
  { delay: 25000, msg: { id: "m7", author: "Jordan T.", avatar: pic6, body: "could we slow down on the orchestration step?" } },
];

export default function ChatPanel({
  hideHeader,
  aboveInput,
}: { hideHeader?: boolean; aboveInput?: import("react").ReactNode } = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Drip the scripted demo messages in on mount. Each is staggered by its
  // `delay`. Cleared on unmount so a re-mount restarts the script.
  useEffect(() => {
    const timers: number[] = [];
    SCRIPT.forEach(({ delay, msg }) => {
      timers.push(
        window.setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
        }, delay),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Pin + delete state. Only one pinned message at a time. Delete removes
  // the message and any threaded replies under it; if the pinned message
  // is deleted, we clear the pin too.
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  function togglePin(id: string) {
    setPinnedId((prev) => (prev === id ? null : id));
  }
  function deleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id && m.replyTo !== id));
    setPinnedId((prev) => (prev === id ? null : prev));
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    wasAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  useEffect(() => {
    if (wasAtBottomRef.current) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    // Resolve to the top-level parent — if user is replying to a reply, the
    // new message still nests under the original top-level message.
    const topLevelId = replyingTo ? replyingTo.replyTo ?? replyingTo.id : undefined;
    setMessages((prev) => [
      ...prev,
      {
        id: `self-${Date.now()}`,
        author: "You",
        avatar: selfAvatar,
        body,
        self: true,
        replyTo: topLevelId,
      },
    ]);
    setDraft("");
    setReplyingTo(null);
    wasAtBottomRef.current = true;
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
    if (e.key === "Escape" && replyingTo) {
      e.preventDefault();
      setReplyingTo(null);
    }
  }

  function startReply(m: Message) {
    setReplyingTo(m);
    // Defer focus so the input is visible before focusing (prevents jank).
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  // Build the parent → replies map.
  const topLevelMessages = messages.filter((m) => !m.replyTo);
  const repliesByParent: Record<string, Message[]> = {};
  for (const m of messages) {
    if (m.replyTo) {
      (repliesByParent[m.replyTo] ??= []).push(m);
    }
  }

  const canSend = draft.trim().length > 0;
  const inputPlaceholder = replyingTo
    ? `Reply to ${replyingTo.author}…`
    : "Say something or ask a question…";

  // When hideHeader is true the panel sits inside a wrapper (BottomTray) that
  // already supplies its own header + chrome — drop the rounded card frame so
  // we don't render a second visual "panel" inside the tray.
  const frameClass = hideHeader
    ? "flex h-full min-h-0 flex-col bg-white"
    : "flex h-full min-h-0 flex-col rounded-2xl border border-gray-stroke bg-white";

  return (
    <div className={frameClass}>
      {!hideHeader && (
        <div className="border-b border-gray-stroke px-5 py-4">
          <div className="text-[16px] font-medium text-gray-dark">Chat</div>
        </div>
      )}

      {/* Pinned message banner — visible when the coach has pinned a message.
          Always sits at the top of the chat (not in the scrolling list). */}
      {(() => {
        const pinned = pinnedId ? messages.find((m) => m.id === pinnedId) : null;
        if (!pinned) return null;
        return (
          <div className="flex items-start gap-2 border-b border-[#E5DBA8] bg-[#FFFBE5] px-4 py-2.5">
            <Pin size={13} className="mt-1 shrink-0 text-[#876C00]" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#876C00]">
                Pinned
              </div>
              <div className="truncate text-[13px] text-gray-dark">
                <span className="font-semibold">{pinned.author}: </span>
                {pinned.body}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPinnedId(null)}
              aria-label="Unpin"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#876C00] transition-colors hover:bg-[#F5EAA5]"
            >
              <X size={13} />
            </button>
          </div>
        );
      })()}

      {/* Message list */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4
                   [&::-webkit-scrollbar]:w-1.5
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:rounded-full
                   hover:[&::-webkit-scrollbar-thumb]:bg-black/15"
        style={{ scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}
      >
        {/* hideHeader is true only when ChatPanel renders inside the mobile
            BottomTray — use that as the signal to switch to the larger
            post-comment styling (44px avatars, 17px text). Desktop right rail
            keeps the compact look. */}
        <ul className={`flex flex-col ${hideHeader ? "gap-5" : "gap-3"}`}>
          {topLevelMessages.map((m) => {
            // System events (purchases, hand-raises, joins) render as a
            // centered notice — no avatar, no reply/pin/delete actions.
            if (m.system) {
              return (
                <li key={m.id}>
                  <SystemNotice m={m} />
                </li>
              );
            }
            const replies = repliesByParent[m.id] ?? [];
            return (
              <li key={m.id}>
                <MessageRow
                  m={m}
                  onReply={() => startReply(m)}
                  onPin={() => togglePin(m.id)}
                  onDelete={() => deleteMessage(m.id)}
                  isPinned={pinnedId === m.id}
                  large={hideHeader}
                />
                {replies.length > 0 && (
                  <ul
                    className={`flex flex-col border-l-2 border-gray-stroke ${
                      hideHeader ? "mt-3 ml-[28px] gap-4 pl-3" : "mt-2 ml-[22px] gap-3 pl-3"
                    }`}
                  >
                    {replies.map((r) => (
                      <li key={r.id}>
                        <MessageRow
                          m={r}
                          onReply={() => startReply(r)}
                          onPin={() => togglePin(r.id)}
                          onDelete={() => deleteMessage(r.id)}
                          isPinned={pinnedId === r.id}
                          small={!hideHeader}
                          large={hideHeader}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <div ref={listEndRef} />
      </div>

      {/* "Replying to" context bar */}
      {replyingTo && (
        <div className="flex items-start gap-2 border-t border-gray-stroke bg-[#FAFAFA] px-4 py-2">
          <span className="mt-1.5 inline-block h-3 w-[3px] shrink-0 rounded-full bg-[#038561]" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#038561]">
              Replying to {replyingTo.author}
            </div>
            <div className="truncate text-[12px] text-gray-light">{replyingTo.body}</div>
          </div>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
            aria-label="Cancel reply"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Optional caller-provided slot rendered above the input — used by
          V5 to inject the ReactionBar without forking ChatPanel. */}
      {aboveInput}

      {/* Input */}
      <div className="border-t border-gray-stroke p-4">
        <div className="flex items-center gap-2 rounded-xl border border-gray-stroke bg-white px-3 py-2.5 transition-colors focus-within:border-gray-dark">
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            autoComplete="off"
            enterKeyHint="send"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={inputPlaceholder}
            // 16px font is required on iOS to prevent Safari's auto-zoom on
            // focus (which otherwise locks the viewport and makes the input
            // feel "stuck"). Bumped from 14px → 16px for mobile typeability.
            className="min-w-0 flex-1 bg-transparent text-[16px] text-gray-dark placeholder:text-gray-light focus:outline-none lg:text-[14px]"
          />
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            aria-label="Send"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition-opacity ${
              canSend ? "opacity-100 hover:bg-[#222]" : "cursor-not-allowed opacity-40"
            }`}
          >
            <ArrowUp size={18} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageRow({
  m,
  onReply,
  onPin,
  onDelete,
  isPinned = false,
  small = false,
  large = false,
}: {
  m: Message;
  onReply: () => void;
  onPin?: () => void;
  onDelete?: () => void;
  isPinned?: boolean;
  small?: boolean;
  /** Use the larger post-comment styling — 44px avatar, 17px text. */
  large?: boolean;
}) {
  // Three styles:
  //   - small  → 24px avatar, used for desktop right-rail nested replies
  //   - large  → 44px avatar + 17px text, matches feed post comments (mobile)
  //   - normal → 32px avatar, used for desktop right-rail top-level messages
  const avatarSize = large ? "h-11 w-11" : small ? "h-6 w-6" : "h-8 w-8";
  const nameClass = large
    ? "text-[17px] font-medium text-gray-dark"
    : "text-[14px] font-semibold text-gray-dark";
  const bodyClass = large
    ? "mt-0.5 text-[17px] leading-[1.4] text-gray-dark"
    : "mt-0.5 text-[14px] leading-[1.45] text-gray-dark";
  const badgeClass = large
    ? "rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
    : "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]";
  const replyClass = large
    ? "ml-1 text-[13px] font-medium text-gray-light transition-opacity hover:text-gray-dark"
    : "ml-1 text-[12px] font-medium text-gray-light opacity-0 transition-opacity hover:text-gray-dark group-hover:opacity-100";
  return (
    <div className="group flex items-start gap-3">
      <img
        src={m.avatar}
        alt=""
        className={`${avatarSize} shrink-0 rounded-full object-cover`}
        style={large ? { objectPosition: "50% 15%" } : undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={nameClass}>{m.author}</span>
          {m.coach && (
            // Verified award icon used across the community feed — same
            // affordance everywhere now (desktop rail + mobile chat).
            <img
              src={verifiedIcon}
              alt="Coach"
              className={`shrink-0 ${large ? "h-[14px] w-[14px]" : "h-[13px] w-[13px]"}`}
            />
          )}
          {m.self && (
            <span className={`${badgeClass} bg-gray-dark/10 text-gray-dark`}>
              You
            </span>
          )}
          {!m.self && (
            <button
              type="button"
              onClick={onReply}
              className={replyClass}
            >
              Reply
            </button>
          )}
          {/* Pin / delete action icons. Hidden until hover on desktop (small
              rail), always visible at "large" (mobile). Nested replies skip
              these so the row stays compact. */}
          {!small && (onPin || onDelete) && (
            <span
              className={
                large
                  ? "ml-auto flex items-center gap-0.5"
                  : "ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              }
            >
              {onPin && (
                <button
                  type="button"
                  onClick={onPin}
                  aria-label={isPinned ? "Unpin" : "Pin message"}
                  className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                    isPinned
                      ? "bg-[#FFFBE5] text-[#876C00]"
                      : "text-gray-light hover:bg-gray-hover hover:text-gray-dark"
                  }`}
                >
                  {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label="Delete message"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-[#FDECEC] hover:text-[#D92D20]"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </span>
          )}
        </div>
        <div className={bodyClass}>{m.body}</div>
      </div>
    </div>
  );
}

// ── System notice row ─────────────────────────────────────────────
// Inline card for purchases, hand-raises, joins. Rectangular with a
// thin colored stripe on the left + a small type label up top, so the
// notice reads as a branded callout (matches the rest of the platform)
// rather than an emoji-laden chip.
function SystemNotice({ m }: { m: Message }) {
  const config = m.system === "purchase"
    ? {
        stripe: "bg-[#038561]",
        bg: "bg-[#038561]/8",
        label: "Just booked",
        labelClass: "text-[#038561]",
      }
    : m.system === "hand-raised"
      ? {
          stripe: "bg-[#C99A1A]",
          bg: "bg-[#FFFBE5]",
          label: "Hand raised",
          labelClass: "text-[#876C00]",
        }
      : {
          stripe: "bg-gray-stroke",
          bg: "bg-gray-hover/70",
          label: "Joined",
          labelClass: "text-gray-light",
        };

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${config.bg} py-2.5 pl-4 pr-3`}
    >
      <span className={`absolute inset-y-0 left-0 w-[3px] ${config.stripe}`} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${config.labelClass}`}>
            {config.label}
          </div>
          <div className="mt-1 text-[13px] leading-snug text-gray-dark">
            {m.body}
          </div>
        </div>
        {m.system === "purchase" && (
          <a
            href="#"
            className="shrink-0 rounded-md bg-[#038561] px-3 py-1.5 text-[12px] font-semibold text-white no-underline transition-colors hover:bg-[#038561]/90"
          >
            Book yours
          </a>
        )}
      </div>
    </div>
  );
}
