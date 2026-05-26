import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
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
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    author: "Tanner H.",
    avatar: pic1,
    body: "We're starting the build now — make sure Claude is open in another window.",
    coach: true,
  },
  { id: "m2", author: "Sarah C.", avatar: pic3, body: "👋 in from Brooklyn" },
  {
    id: "m3",
    author: "Priya N.",
    avatar: pic5,
    body: "Are these prompts in the shared repo yet?",
  },
  { id: "m4", author: "Marcus L.", avatar: pic4, body: "excited for this one" },
  {
    id: "m5",
    author: "Marcus L.",
    avatar: pic4,
    body: "Lost in step 2 — what's the recommended way to wire tools to Claude when running locally?",
  },
  { id: "m6", author: "Jordan T.", avatar: pic6, body: "audio's clear on my end" },
  {
    id: "m7",
    author: "Sarah C.",
    avatar: pic3,
    body: "Should the agent's memory live inline or in a separate tool call?",
  },
  // Demo reply nested under m7
  {
    id: "r1",
    author: "Tanner H.",
    avatar: pic1,
    body: "Inline is fine for short context — break it out when you need cross-turn recall.",
    coach: true,
    replyTo: "m7",
  },
  { id: "m8", author: "Jordan T.", avatar: pic6, body: "could we slow down on the orchestration step?" },
];

export default function ChatPanel({ hideHeader }: { hideHeader?: boolean } = {}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
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
            const replies = repliesByParent[m.id] ?? [];
            return (
              <li key={m.id}>
                <MessageRow m={m} onReply={() => startReply(m)} large={hideHeader} />
                {replies.length > 0 && (
                  <ul
                    className={`flex flex-col border-l-2 border-gray-stroke ${
                      hideHeader ? "mt-3 ml-[28px] gap-4 pl-3" : "mt-2 ml-[22px] gap-3 pl-3"
                    }`}
                  >
                    {replies.map((r) => (
                      <li key={r.id}>
                        <MessageRow m={r} onReply={() => startReply(r)} small={!hideHeader} large={hideHeader} />
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
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              canSend
                ? "bg-gray-dark text-white hover:bg-[#444444]"
                : "bg-gray-dark text-white opacity-40 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageRow({
  m,
  onReply,
  small = false,
  large = false,
}: {
  m: Message;
  onReply: () => void;
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
            <span className={`${badgeClass} bg-[#038561]/10 text-[#038561]`}>
              Coach
            </span>
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
        </div>
        <div className={bodyClass}>{m.body}</div>
      </div>
    </div>
  );
}
