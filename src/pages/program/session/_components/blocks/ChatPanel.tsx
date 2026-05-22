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

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-gray-stroke bg-white">
      {/* Header — hidden when ChatPanel is rendered inside a wrapper that
          already supplies a header (e.g., BottomTray on mobile). */}
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
        <ul className="flex flex-col gap-3">
          {topLevelMessages.map((m) => {
            const replies = repliesByParent[m.id] ?? [];
            return (
              <li key={m.id}>
                <MessageRow m={m} onReply={() => startReply(m)} />
                {replies.length > 0 && (
                  <ul className="mt-2 ml-[22px] flex flex-col gap-3 border-l-2 border-gray-stroke pl-3">
                    {replies.map((r) => (
                      <li key={r.id}>
                        <MessageRow m={r} onReply={() => startReply(r)} small />
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
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={inputPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-gray-dark placeholder:text-gray-light focus:outline-none"
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
}: {
  m: Message;
  onReply: () => void;
  small?: boolean;
}) {
  const avatarSize = small ? "h-6 w-6" : "h-8 w-8";
  return (
    <div className="group flex items-start gap-3">
      <img src={m.avatar} alt="" className={`${avatarSize} shrink-0 rounded-full object-cover`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[14px] font-semibold text-gray-dark">{m.author}</span>
          {m.coach && (
            <span className="rounded bg-[#038561]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#038561]">
              Coach
            </span>
          )}
          {m.self && (
            <span className="rounded bg-gray-dark/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-dark">
              You
            </span>
          )}
          {!m.self && (
            <button
              type="button"
              onClick={onReply}
              className="ml-1 text-[12px] font-medium text-gray-light opacity-0 transition-opacity hover:text-gray-dark group-hover:opacity-100"
            >
              Reply
            </button>
          )}
        </div>
        <div className="mt-0.5 text-[14px] leading-[1.45] text-gray-dark">{m.body}</div>
      </div>
    </div>
  );
}
