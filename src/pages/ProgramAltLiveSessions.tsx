import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SessionCard from "../components/SessionCard";
import { Button } from "../components/Button";
import { Pivot } from "../components/Pivot";
import { sectionTitle } from "./ProgramHub";
import recordingThumb from "../assets/placeholder images/placeholder-event-02.png";
import thumb2 from "../assets/placeholder images/placeholder-event-01.png";
import thumb3 from "../assets/placeholder images/bootcamp-1.webp";
import thumb4 from "../assets/placeholder images/bootcamp-2.webp";

// Live Sessions tab — a pivot between Upcoming (live sessions + office hours,
// with a featured-recording banner) and Past (a list of session recordings).

type Session = {
  title: string;
  dateTime: string;
  duration: string;
  day: string;
  status: "live" | "upcoming" | "past";
  hasRecording?: boolean;
  image?: string;
};

const UPCOMING: Session[] = [
  { title: "Build your Agentic Operating System", dateTime: "Today at 6:00 PM", duration: "60 min", day: "18", status: "live" },
  { title: "Automate communication in your voice", dateTime: "Thu, May 29 at 1:00 PM", duration: "60 min", day: "29", status: "upcoming" },
  { title: "Analyze data and design presentations", dateTime: "Tue, Jun 3 at 8:00 AM", duration: "60 min", day: "3", status: "upcoming" },
  { title: "Launch your custom AI system + Demo Day", dateTime: "Fri, Jun 6 at 11:00 AM", duration: "90 min", day: "6", status: "upcoming" },
  { title: "Design agentic workflows that chain tools", dateTime: "Mon, Jun 9 at 1:00 PM", duration: "60 min", day: "9", status: "upcoming" },
  { title: "Build your first autonomous agent", dateTime: "Wed, Jun 11 at 11:00 AM", duration: "60 min", day: "11", status: "upcoming" },
  { title: "Give your agent memory and context", dateTime: "Fri, Jun 13 at 1:00 PM", duration: "60 min", day: "13", status: "upcoming" },
  { title: "Evaluate and debug agent runs", dateTime: "Mon, Jun 16 at 10:00 AM", duration: "60 min", day: "16", status: "upcoming" },
  { title: "Ship a multi-agent workflow", dateTime: "Wed, Jun 18 at 1:00 PM", duration: "90 min", day: "18", status: "upcoming" },
  { title: "Scale your agent workforce", dateTime: "Fri, Jun 20 at 11:00 AM", duration: "60 min", day: "20", status: "upcoming" },
  { title: "Guardrails and responsible AI", dateTime: "Mon, Jun 23 at 1:00 PM", duration: "45 min", day: "23", status: "upcoming" },
  { title: "Capstone: present your build", dateTime: "Fri, Jun 27 at 11:00 AM", duration: "90 min", day: "27", status: "upcoming" },
];

const OFFICE_HOURS: Session[] = [
  { title: "Office hours with the Leland team", dateTime: "Thu, May 29 at 2:00 PM", duration: "45 min", day: "29", status: "upcoming" },
  { title: "Open build lab: bring your blockers", dateTime: "Tue, Jun 3 at 1:00 PM", duration: "45 min", day: "3", status: "upcoming" },
  { title: "Office hours: prompting deep-dive", dateTime: "Mon, Jun 9 at 10:00 AM", duration: "45 min", day: "9", status: "upcoming" },
];

const PAST: Session[] = [
  { title: "Use AI to 10x your impact: kickoff", dateTime: "Mon, May 19 at 5:00 PM", duration: "60 min", day: "19", status: "past", hasRecording: true, image: recordingThumb },
  { title: "Office hours: scoping your first build", dateTime: "Wed, May 14 at 4:00 PM", duration: "45 min", day: "14", status: "past", hasRecording: true, image: thumb2 },
  { title: "Prompting patterns that hold up in production", dateTime: "Thu, May 8 at 1:00 PM", duration: "60 min", day: "8", status: "past", hasRecording: true, image: thumb3 },
  { title: "Kickoff & cohort welcome", dateTime: "Mon, May 5 at 5:00 PM", duration: "45 min", day: "5", status: "past", hasRecording: true, image: thumb4 },
];

// The recording featured in the Upcoming tab's banner.
const FEATURED = PAST[0];

function SessionRow({ s }: { s: Session }) {
  return (
    <SessionCard
      title={s.title}
      dateTime={s.dateTime}
      duration={s.duration}
      day={s.day}
      status={s.status}
      type="event"
      image=""
      hasRecording={s.hasRecording}
      cta={
        s.status === "live" ? (
          <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold">Join</Button>
        ) : s.status === "upcoming" ? (
          <Button size="md" variant="secondary" rounded="rounded-full" className="!bg-black/5 font-semibold">Register</Button>
        ) : undefined
      }
    />
  );
}

const COHORTS = ["May 24 cohort", "June 7 cohort", "June 21 cohort", "July 5 cohort"];

// Cohort selector — a date-selector-style control; the live-session experience
// is cohort-based, so this shows and lets the user switch their cohort.
function CohortSelector() {
  const [open, setOpen] = useState(false);
  const [cohort, setCohort] = useState(COHORTS[0]);
  return (
    <div className="relative shrink-0 self-start">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-3.5 py-2.5 text-left shadow-[0_1px_1px_rgba(16,24,40,0.05)] transition-colors hover:bg-gray-hover"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FC] text-[#2c5fd0]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-gray-light">Your cohort</span>
          <span className="text-[15px] font-semibold leading-tight text-gray-dark">{cohort}</span>
        </span>
        <svg className={`ml-1 size-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-[248px] rounded-xl border border-gray-stroke bg-white p-1.5 shadow-lg">
            <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-extra-light">Switch cohort</p>
            {COHORTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCohort(c); setOpen(false); }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark hover:bg-gray-hover"
              >
                {c}
                {c === cohort && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-dark" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Past session recording — thumbnail + title/date + a Watch button.
function RecordingRow({ s }: { s: Session }) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-[12px] px-2 py-3 transition-colors hover:bg-[#F5F5F5]">
      <div className="relative h-11 w-[72px] shrink-0 overflow-hidden rounded-lg bg-gray-dark">
        {s.image && <img src={s.image} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shadow-sm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="ml-[1px] text-gray-dark" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[16px] font-semibold leading-[1.2] text-gray-dark">{s.title}</p>
        <p className="truncate text-[14px] text-gray-light">{s.dateTime} · {s.duration}</p>
      </div>
      <Button size="md" variant="secondary" rounded="rounded-full" className="shrink-0 !gap-1.5 !bg-black/5 font-semibold">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-[-1px] text-gray-dark" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        Watch
      </Button>
    </div>
  );
}

export default function ProgramAltLiveSessions() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const firstUpcoming = UPCOMING.slice(0, 6);
  const extraUpcoming = UPCOMING.slice(6);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-8 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">Live Sessions</h1>
          <p className="text-[16px] leading-[1.5] text-gray-light">Your cohort's live sessions and office hours — join live, or catch the replay.</p>
        </div>
        <CohortSelector />
      </div>

      <Pivot
        fill={false}
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "upcoming", label: "Upcoming" },
          { id: "past", label: "Past", count: PAST.length },
        ]}
      />

      {tab === "upcoming" ? (
        <>
          {/* Featured recording banner — clicking jumps to the Past tab */}
          <button
            type="button"
            onClick={() => setTab("past")}
            className="group flex items-center gap-5 rounded-2xl border border-gray-stroke bg-white p-4 text-left shadow-[0_1px_1px_rgba(16,24,40,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)] sm:p-5"
          >
            <div className="relative aspect-[16/9] h-[84px] shrink-0 overflow-hidden rounded-xl bg-gray-dark">
              <img src={recordingThumb} alt="" className="h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-105">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-gray-dark" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2c5fd0]">Latest recording</span>
              <span className="truncate text-[18px] font-semibold leading-[1.3] text-gray-dark">{FEATURED.title}</span>
              <span className="truncate text-[14px] text-gray-light">Recorded {FEATURED.dateTime.split(" at ")[0]} · {FEATURED.duration}</span>
            </div>
            <span className="hidden shrink-0 items-center gap-1 pr-1 text-[14px] font-semibold text-gray-dark sm:flex">
              Watch now
              <svg className="transition-transform group-hover:translate-x-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </button>

          {/* Upcoming sessions */}
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <p className={sectionTitle}>Upcoming sessions</p>
              <p className="text-[16px] leading-[1.5] text-gray-light">Your cohort's live sessions — join live, or catch the replay.</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col">{firstUpcoming.map((s) => <SessionRow key={s.title} s={s} />)}</div>
              <AnimatePresence initial={false}>
                {showAllUpcoming && extraUpcoming.length > 0 && (
                  <motion.div
                    key="more"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col">{extraUpcoming.map((s) => <SessionRow key={s.title} s={s} />)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {extraUpcoming.length > 0 && (
              <Button
                size="md"
                variant="secondary"
                className="self-start !bg-black/5 !gap-1.5 font-semibold"
                onClick={() => setShowAllUpcoming((v) => !v)}
              >
                {showAllUpcoming ? "See less" : `See ${extraUpcoming.length} more`}
                <svg
                  className={`transition-transform duration-200 ${showAllUpcoming ? "rotate-180" : ""}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Button>
            )}
          </div>

          {/* Office hours */}
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <p className={sectionTitle}>Office hours</p>
              <p className="text-[16px] leading-[1.5] text-gray-light">Drop in to get unblocked, live with the Leland team.</p>
            </div>
            <div className="flex flex-col">
              {OFFICE_HOURS.map((s) => <SessionRow key={s.title} s={s} />)}
            </div>
          </div>
        </>
      ) : (
        /* Past — recordings from recent sessions */
        <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <p className={sectionTitle}>Recordings</p>
            <p className="text-[16px] leading-[1.5] text-gray-light">Catch up on recordings from recent sessions.</p>
          </div>
          <div className="flex flex-col">
            {PAST.map((s) => <RecordingRow key={s.title} s={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}
