import { Link } from "react-router-dom";

export type ConversationStatus = "lead" | "active-client" | "archived";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  status: ConversationStatus;
  lastMessageAt: string;
  lastMessagePreview?: string;
}

export const statusConfig: Record<ConversationStatus, { label: string; className: string }> = {
  lead: { label: "Lead", className: "text-orange" },
  "active-client": { label: "Active Client", className: "text-primary" },
  archived: { label: "Archived", className: "text-gray-xlight" },
};

export default function ConversationListItem({ conversation }: { conversation: Conversation }) {
  const { id, name, avatar, status, lastMessageAt, lastMessagePreview } = conversation;
  const { label, className } = statusConfig[status];

  return (
    <Link
      to={`/messages/${id}`}
      className="flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-gray-hover"
    >
      <img
        src={avatar}
        alt={name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[16px] font-medium leading-tight text-gray-dark">{name}</p>
          <span className="shrink-0 text-xs text-gray-xlight">{lastMessageAt}</span>
        </div>
        <p className={`mt-0.5 text-[13px] leading-tight ${className}`}>{label}</p>
        {lastMessagePreview ? (
          <p className="mt-1 truncate text-[14px] leading-tight text-gray-light">{lastMessagePreview}</p>
        ) : (
          <p className="mt-1 truncate text-[14px] italic leading-tight text-gray-xlight">No messages</p>
        )}
      </div>
    </Link>
  );
}
