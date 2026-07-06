import { statusConfig, type Conversation } from "./ConversationListItem";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";

export default function ConversationRelationshipView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { label: statusLabel, className: statusClassName } = statusConfig[conversation.status];

  return (
    <>
      {/* Custom top nav — sticky (not fixed) because this view renders inside a
          transformed motion.div; a transformed ancestor would anchor `fixed`
          to itself rather than the viewport. */}
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-stroke bg-white px-3 py-2.5 pt-[calc(env(safe-area-inset-top)+10px)]">
        <button
          onClick={onBack}
          aria-label="Back to conversation"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <p className="truncate text-[15px] font-semibold leading-tight text-gray-dark">
            {conversation.name.split(" ")[0]}
          </p>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <img src={dotsHorizontalIcon} alt="" className="h-5 w-5" />
        </button>
      </div>

      {/* Person summary */}
      <div className="flex flex-col items-center px-6 pt-10 text-center">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="h-20 w-20 rounded-full object-cover"
        />
        <p className="mt-3 text-[19px] font-semibold text-gray-dark">{conversation.name}</p>
        <p className={`mt-1 text-[14px] ${statusClassName}`}>{statusLabel}</p>
      </div>

      {/* Placeholder relationship stats */}
      <div className="mt-8 divide-y divide-gray-stroke border-t border-gray-stroke">
        {[
          { label: "Client since", value: "—" },
          { label: "Sessions completed", value: "—" },
          { label: "Last session", value: "—" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-[14px] text-gray-light">{row.label}</span>
            <span className="text-[14px] font-medium text-gray-dark">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 px-6 text-center text-[13px] text-gray-xlight">
        Full relationship history coming soon.
      </p>
    </>
  );
}
