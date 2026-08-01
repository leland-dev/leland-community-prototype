import type { FlowProps } from "../index";

const SESSIONS = [
  { month: "MAY", day: "24", title: "Build a real product with world-class design", datetime: "Tue, May 24, 10:00 AM" },
  { month: "MAY", day: "26", title: "Automate Communication in Your Voice", datetime: "Thu, May 26, 10:00 AM" },
  { month: "MAY", day: "31", title: "Analyze data and design presentations", datetime: "Tue, May 31, 10:00 AM" },
  { month: "JUN", day: "2", title: "Launch Your Custom AI System", datetime: "Thu, Jun 2, 10:00 AM" },
] as const;

function GoogleCalIcon() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}google-calendar.png`}
      alt=""
      className="size-8 shrink-0 rounded-lg object-contain"
    />
  );
}

function OutlookIcon() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}outlook-calendar.png`}
      alt=""
      className="size-8 shrink-0 rounded-lg object-contain"
    />
  );
}

function AppleCalIcon() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}apple-calendar.jpeg`}
      alt=""
      className="size-8 shrink-0 rounded-lg object-contain"
    />
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v9" />
      <path d="M6 9l4 4 4-4" />
      <path d="M4 16h12" />
    </svg>
  );
}

function CalendarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center gap-3 rounded-xl border border-leland-gray-stroke bg-white px-5 py-4 shadow-[0px_1px_1px_rgba(16,24,40,0.05)] hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
    >
      {icon}
      <span className="leland-paragraph-base font-medium text-leland-gray-dark whitespace-nowrap">{label}</span>
    </button>
  );
}

function DateChip({ month, day }: { month: string; day: string }) {
  return (
    <div className="flex w-12 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke shadow-sm">
      <div className="flex items-center justify-center bg-leland-blue px-2.5 py-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-[1px] text-leland-gray-dark">
          {month}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white px-2.5 py-1">
        <span className="text-[19px] font-semibold leading-none text-leland-gray-dark">{day}</span>
      </div>
    </div>
  );
}

export function AddToCalendarFlow({ onComplete }: FlowProps) {
  const handleAction = () => {
    onComplete?.();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Eyebrow */}
      <p className="leland-paragraph-base text-leland-gray-light">
        <span className="font-medium text-leland-gray-dark">Pre-flight</span>
        {"  "}
        <span className="text-leland-gray-stroke">|</span>
        {"  "}
        1/5
      </p>

      {/* Heading */}
      <div className="flex flex-col gap-4">
        <h1 className="font-season text-heading-5xl font-normal text-leland-gray-dark">
          Live sessions
        </h1>
        <p className="leland-paragraph-lg text-leland-gray-light">
          Don't miss your live sessions! Add them to your calendar, and get notified when your sessions are about to start.
        </p>
      </div>

      {/* Calendar card */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white px-8 pb-6 pt-8">
        <p className="text-[19px] font-semibold leading-snug text-leland-gray-dark">
          Add all upcoming sessions to...
        </p>
        <div className="flex gap-3">
          <CalendarButton icon={<GoogleCalIcon />} label="Google Calendar" onClick={handleAction} />
          <CalendarButton icon={<OutlookIcon />} label="Outlook" onClick={handleAction} />
          <CalendarButton icon={<AppleCalIcon />} label="Apple Calendar" onClick={handleAction} />
        </div>
        <button
          type="button"
          onClick={handleAction}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-leland-gray-solid-hover px-6 py-4 hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          <span className="text-[17px] font-semibold text-leland-gray-dark">Download ICS file</span>
          <DownloadIcon className="size-5 shrink-0 text-leland-gray-dark" />
        </button>
      </div>

      {/* Session timeline */}
      <div className="flex flex-col">
        {SESSIONS.map((session, idx) => (
          <div key={session.title} className="flex gap-2.5">
            {/* Timeline spine */}
            <div className="flex shrink-0 flex-col items-center" style={{ width: 10 }}>
              <div
                className="w-px flex-1 bg-leland-gray-stroke"
                style={{ minHeight: 12, visibility: idx === 0 ? "hidden" : "visible" }}
              />
              <div className="size-2 shrink-0 rounded-full bg-leland-gray-light" />
              <div
                className="w-px flex-1 bg-leland-gray-stroke"
                style={{ minHeight: 12, visibility: idx === SESSIONS.length - 1 ? "hidden" : "visible" }}
              />
            </div>
            {/* Session row */}
            <div className="flex flex-1 min-w-0 items-center gap-3 p-3">
              <DateChip month={session.month} day={session.day} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="leland-heading-base font-semibold text-leland-gray-dark">
                  {session.title}
                </p>
                <p className="leland-paragraph-sm text-leland-gray-light">{session.datetime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
