import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";

import abhiPhoto from "../assets/profile photos/pic-2.png";
import aviPhoto from "../assets/profile photos/pic-5.png";
import neilPhoto from "../assets/profile photos/pic-9.png";
import clientPhoto1 from "../assets/profile photos/pic-1.png";
import clientPhoto3 from "../assets/profile photos/pic-3.png";
import clientPhoto7 from "../assets/profile photos/pic-7.png";
import clientPhoto11 from "../assets/profile photos/pic-11.png";

import gsbLogo from "../assets/logos/gsb.png";
import kelloggLogo from "../assets/org-logos/kellogg.png";
import boothLogo from "../assets/logos/booth.png";
import whartonLogo from "../assets/org-logos/wharton.png";
import mitSloanLogo from "../assets/org-logos/mit-sloan.png";
import hbsLogo from "../assets/org-logos/hbs.png";
import columbiaLogo from "../assets/org-logos/columbia.png";
import mckinseyLogo from "../assets/logos/mckinsey.png";

// An outcome is a client marking a goal complete — e.g. "Admitted to Stanford
// GSB". Clients who haven't logged one yet show as pending so the coach can
// nudge them.
type ClientOutcome = {
  id: string;
  name: string;
  avatar?: string;
  /** What they were coached for, shown as the row's secondary line. */
  coachedFor: string;
  /** When the engagement happened / outcome was logged. */
  date: string;
  /** Present once the client has logged an outcome. */
  outcome?: string;
  /** Logo for the outcome (school or company), when available. */
  outcomeLogo?: string;
};

const CLIENT_OUTCOMES: ClientOutcome[] = [
  { id: "zack", name: "Zack G.", coachedFor: "MBA Admissions", date: "Apr 2025", outcome: "Admitted to Stanford GSB", outcomeLogo: gsbLogo },
  { id: "abhi", name: "Abhi V.", avatar: abhiPhoto, coachedFor: "MBA Admissions", date: "Dec 2025", outcome: "Admitted to Kellogg", outcomeLogo: kelloggLogo },
  { id: "avi", name: "Avi M.", avatar: aviPhoto, coachedFor: "MBA Admissions", date: "Jan 2026", outcome: "Admitted to Chicago Booth", outcomeLogo: boothLogo },
  { id: "priya", name: "Priya S.", avatar: clientPhoto1, coachedFor: "MBA Admissions", date: "Mar 2026", outcome: "Admitted to The Wharton School", outcomeLogo: whartonLogo },
  { id: "neil", name: "Neil T.", avatar: neilPhoto, coachedFor: "MBA Admissions", date: "May 2026", outcome: "Admitted to MIT Sloan", outcomeLogo: mitSloanLogo },
  { id: "daniel", name: "Daniel K.", avatar: clientPhoto3, coachedFor: "Consulting Recruiting", date: "Feb 2026", outcome: "Offer from McKinsey & Company", outcomeLogo: mckinseyLogo },
  { id: "sophia", name: "Sophia L.", avatar: clientPhoto7, coachedFor: "MBA Admissions", date: "Jan 2026", outcome: "Admitted to Harvard Business School", outcomeLogo: hbsLogo },
  { id: "jordan", name: "Jordan P.", coachedFor: "MBA Admissions", date: "Dec 2025", outcome: "Admitted to Columbia Business School", outcomeLogo: columbiaLogo },
  { id: "marcus", name: "Marcus T.", coachedFor: "MBA Admissions", date: "Applied Fall 2026" },
  { id: "faiza", name: "Faiza T.", coachedFor: "MBA Admissions", date: "Coached May 2026" },
  { id: "elena", name: "Elena R.", avatar: clientPhoto11, coachedFor: "Consulting Recruiting", date: "Coached Apr 2026" },
  { id: "omar", name: "Omar H.", coachedFor: "MBA Admissions", date: "Applied Fall 2026" },
];

const INITIALS_COLORS = ["#B85A2B", "#869AA6", "#1F5340", "#9685A8", "#80ACED"];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function colorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return INITIALS_COLORS[h % INITIALS_COLORS.length];
}

function ClientAvatar({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) {
    return <img src={avatar} alt={name} className="h-11 w-11 shrink-0 rounded-full object-cover" />;
  }
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
      style={{ backgroundColor: colorFor(name) }}
    >
      {initialsFor(name)}
    </div>
  );
}

function ClientOutcomeRow({ client }: { client: ClientOutcome }) {
  const logged = Boolean(client.outcome);
  return (
    <div className="flex items-center gap-3 py-4">
      <ClientAvatar name={client.name} avatar={client.avatar} />

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-gray-dark">{client.name}</p>
        <p className="text-[13px] text-gray-light">
          {client.coachedFor} · {client.date}
        </p>
      </div>

      {/* Outcome status */}
      {logged ? (
        <div className="flex min-w-0 shrink items-center gap-2 rounded-full bg-[#E8F3EC] py-1.5 pl-2 pr-3.5">
          {client.outcomeLogo ? (
            <img src={client.outcomeLogo} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1F7A47] text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          )}
          <span className="truncate text-[14px] font-medium text-[#1F5340]">{client.outcome}</span>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-[14px] text-gray-extra-light sm:inline">No outcome logged</span>
          <Button size="sm" variant="secondary" rounded="rounded-full">
            Request outcome
          </Button>
        </div>
      )}
    </div>
  );
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-xl border border-gray-stroke p-4">
      <p className="text-[28px] font-semibold leading-none text-gray-dark">{value}</p>
      <p className="mt-1.5 text-[14px] text-gray-light">{label}</p>
    </div>
  );
}

type Filter = "all" | "logged" | "pending";

export default function CoachOutcomes() {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    document.title = "Leland Prototype | Outcomes";
  }, []);

  const logged = CLIENT_OUTCOMES.filter((c) => c.outcome).length;
  const total = CLIENT_OUTCOMES.length;
  const pending = total - logged;

  const visible = useMemo(
    () =>
      CLIENT_OUTCOMES.filter((c) =>
        filter === "all" ? true : filter === "logged" ? c.outcome : !c.outcome
      ),
    [filter]
  );

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All clients", count: total },
    { key: "logged", label: "Outcome logged", count: logged },
    { key: "pending", label: "Pending", count: pending },
  ];

  return (
    <div className="mx-auto max-w-[1080px]">
      <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Outcomes</h1>
      <p className="mt-2 text-[16px] text-gray-light">
        Goals your clients have marked complete — like an admission or a job offer.
      </p>

      {/* Summary stats */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <StatTile value={total} label="Clients coached" />
        <StatTile value={logged} label="Outcomes logged" />
        <StatTile value={pending} label="Awaiting an outcome" />
      </div>

      {/* Filter tabs */}
      <div className="mt-8 border-b border-gray-stroke">
        <div className="flex gap-8">
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-[16px] transition-colors ${
                filter === key
                  ? "border-gray-dark font-medium text-gray-dark"
                  : "border-transparent font-medium text-gray-light hover:text-gray-dark"
              }`}
            >
              {label}
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-hover px-1.5 text-[12px] font-medium text-gray-extra-light">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Client list */}
      <div className="mt-2 flex flex-col divide-y divide-gray-stroke">
        {visible.map((client) => (
          <ClientOutcomeRow key={client.id} client={client} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-16 text-center text-[16px] text-gray-light">No clients here yet.</div>
      )}
    </div>
  );
}
