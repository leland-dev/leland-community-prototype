import { Link } from "react-router-dom";
import { statusConfig, type Conversation } from "./ConversationListItem";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";

type ChatMessage = { id: number; fromMe: boolean; text: string; time: string };

// Placeholder thread. Reads as a coach (me) talking with a prospective
// client — generic enough to sit under any conversation for now.
const PLACEHOLDER_MESSAGES: ChatMessage[] = [
  { id: 1, fromMe: false, text: "Hi! I'm interested in doing some coaching for my upcoming MBA applications.", time: "9:41 AM" },
  { id: 2, fromMe: true, text: "Hey — thanks for reaching out! I'd love to help. Which schools are you targeting?", time: "9:44 AM" },
  { id: 3, fromMe: false, text: "Mainly HBS, Stanford, and Wharton. R1 this cycle.", time: "9:45 AM" },
  { id: 4, fromMe: true, text: "Great list. What's your GMAT/GRE situation looking like right now?", time: "9:46 AM" },
  { id: 5, fromMe: false, text: "760 GMAT. I think the scores are solid, it's really the essays I'm worried about.", time: "9:48 AM" },
  { id: 6, fromMe: true, text: "That's a strong score — you're right to focus on the essays. That's where most of the differentiation happens.", time: "9:49 AM" },
  { id: 7, fromMe: true, text: "Do you have a rough sense of your core story yet, or are we starting from scratch?", time: "9:49 AM" },
  { id: 8, fromMe: false, text: "Somewhere in between. I have themes but nothing that feels cohesive yet.", time: "9:52 AM" },
  { id: 9, fromMe: true, text: "Perfect — that's exactly the right stage to bring someone in. Want to set up an intro call this week?", time: "9:53 AM" },
  { id: 10, fromMe: false, text: "Yes, that would be great. I'm free Thursday afternoon.", time: "9:55 AM" },
  { id: 11, fromMe: true, text: "Thursday at 3pm work? I'll send over a short intake form beforehand so we can hit the ground running.", time: "9:56 AM" },
  { id: 12, fromMe: false, text: "3pm is perfect. Thank you so much!", time: "9:57 AM" },
];

export default function ConversationDetailView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { label: statusLabel, className: statusClassName } = statusConfig[conversation.status];
  const firstName = conversation.name.split(" ")[0];

  return (
    <>
      {/* Custom top nav — replaces the default mobile chrome (hamburger/logo/profile).
          sticky (not fixed) because this view renders inside a transformed
          motion.div — a transformed ancestor would anchor `fixed` to itself
          rather than the viewport. */}
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-stroke bg-white px-3 py-2.5 pt-[calc(env(safe-area-inset-top)+10px)]">
        <button
          onClick={onBack}
          aria-label="Back to messages"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <p className="text-[15px] font-semibold leading-tight text-gray-dark">Conversation</p>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <img src={dotsHorizontalIcon} alt="" className="h-5 w-5" />
        </button>
      </div>

      {/* Relationship banner — full-width tap target into the relationship detail page */}
      <Link
        to={`/messages/${conversation.id}/relationship`}
        className="flex shrink-0 items-center gap-3 border-b border-gray-stroke px-4 py-3 transition-colors hover:bg-gray-hover"
      >
        <img
          src={conversation.avatar}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-gray-dark">{conversation.name}</p>
          <p className={`truncate text-[13px] leading-tight ${statusClassName}`}>{statusLabel}</p>
        </div>
        <img src={chevronRightIcon} alt="" className="h-5 w-5 shrink-0 opacity-40" />
      </Link>

      {/* Message list — flex-1 so it fills the space between the header and the
          input even when the thread is short; the whole page scrolls (window
          scroll), so the sticky nav/input stay pinned as messages move. */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <p className="my-2 text-center text-[12px] text-gray-xlight">Today</p>
        {PLACEHOLDER_MESSAGES.map((m) => (
          <div
            key={m.id}
            className={`flex max-w-[78%] flex-col ${m.fromMe ? "items-end self-end" : "items-start self-start"}`}
          >
            <div
              className={`rounded-2xl px-3.5 py-2 text-[15px] leading-[1.35] ${
                m.fromMe
                  ? "rounded-br-md bg-gray-dark text-white"
                  : "rounded-bl-md bg-gray-hover text-gray-dark"
              }`}
            >
              {m.text}
            </div>
            <span className="mt-1 px-1 text-[11px] text-gray-xlight">{m.time}</span>
          </div>
        ))}
      </div>

      {/* Message composer — sticky at the bottom of the viewport (see nav note
          above for why sticky rather than fixed). */}
      <div className="sticky bottom-0 z-20 shrink-0 border-t border-gray-stroke bg-white px-3 py-2.5 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <input
            type="text"
            placeholder={`Message ${firstName}`}
            className="min-w-0 flex-1 rounded-full bg-gray-hover px-4 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-gray-light"
          />
          <button
            type="button"
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-dark text-white transition-opacity hover:opacity-85"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
