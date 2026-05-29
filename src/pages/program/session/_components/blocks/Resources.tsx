import type { ReactNode } from "react";
import { Star } from "lucide-react";
import coachAvatar from "../../../../../assets/profile photos/pic-1.png";

type Resource = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="9.5" width="6" height="3" rx="1.5" fill="currentColor" />
      <rect x="11.5" y="3" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="15" y="11.5" width="6" height="3" rx="1.5" fill="currentColor" />
      <rect x="9.5" y="15" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="9.5" y="9.5" width="3" height="3" rx="1.5" fill="currentColor" />
      <rect x="11.5" y="11.5" width="3" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function CalendarPlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 13.5l3 1.5-3 1.5v-3z" fill="currentColor" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M5 3.5h-2A1.5 1.5 0 0 0 1.5 5v6A1.5 1.5 0 0 0 3 12.5h6A1.5 1.5 0 0 0 10.5 11V9M7.5 1.5h5v5M12.5 1.5L6 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const RESOURCES: Resource[] = [
  { id: "office-hours", label: "Office hours", href: "#", icon: <ClockIcon /> },
  { id: "slack", label: "Slack community", href: "#", icon: <SlackIcon /> },
  { id: "build", label: "Join a build session", href: "#", icon: <CalendarPlayIcon /> },
];

function CoachContributorCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-stroke bg-white p-5">
      <img
        src={coachAvatar}
        alt=""
        className="h-16 w-16 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[18px] font-semibold text-gray-dark">Contributed by Tanner H.</span>
          <Star size={16} fill="#F5B729" stroke="#F5B729" />
          <span className="text-[14px] text-gray-light">5.0 (59)</span>
        </div>
        <p className="mt-1 text-[14px] text-gray-light">
          Go from "I use chatbots" to "I manage agents" in &lt;3 weeks
        </p>
      </div>
    </div>
  );
}

type Props = {
  /** Compact: just the link list, no coach card, no header, no outer card. */
  compact?: boolean;
};

function ResourceList() {
  return (
    <ul className="flex flex-col gap-1">
      {RESOURCES.map((r) => (
        <li key={r.id}>
          <a
            href={r.href}
            className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-hover/60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-hover text-gray-dark">
              {r.icon}
            </span>
            <span className="flex-1 text-[15px] font-medium text-gray-dark">{r.label}</span>
            <span className="shrink-0 text-gray-light transition-colors group-hover:text-gray-dark">
              <ExternalIcon />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Resources({ compact = false }: Props = {}) {
  if (compact) {
    // Used in the chat-rail Resources tab — the rail already provides
    // the card/border chrome, so render just the links.
    return <ResourceList />;
  }

  return (
    <div className="flex flex-col gap-4">
      <CoachContributorCard />

      <section className="rounded-2xl border border-gray-stroke bg-white">
        {/* Header — matches SessionGuide */}
        <div className="border-b border-gray-stroke px-5 py-4">
          <h2 className="text-[20px] font-medium text-gray-dark">Resources</h2>
        </div>
        <div className="p-3">
          <ResourceList />
        </div>
      </section>
    </div>
  );
}
