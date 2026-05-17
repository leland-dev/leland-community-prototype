import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { motion, AnimatePresence } from "motion/react";
import usersIcon from "../../assets/icons/users-icon.svg";
import starIcon from "../../assets/icons/star-icon.svg";
import videoIcon from "../../assets/icons/video-icon.svg";
import plusIcon from "../../assets/icons/plus-icon.svg";

export interface SessionEntry {
  coach?: string;
  coachImg?: string;
  coachHeadline?: string;
  date: string;
  status: "completed" | "scheduled" | "unbooked";
  review?: { rating: number; text: string };
}

export interface CohortEntry {
  name: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  sessionsAttended?: number;
  sessionsTotal?: number;
  pending?: boolean;
  review?: { rating: number; text: string };
}

export interface UserDetailV2 {
  name: string;
  email: string;
  initials: string;
  image?: string;
  dateAdded?: string;
  sessions?: {
    granted: number;
    minutesPerSession?: number;
    entries: SessionEntry[];
  };
  cohorts?: CohortEntry[];
  plus?: {
    status: "active" | "expired";
    expiry: string;
    grantedDate?: string;
    resourcesViewed?: number;
    topCategories?: string[];
  };
}

interface Props {
  user: UserDetailV2 | null;
  onClose: () => void;
  isAlaCarte?: boolean;
  showLpEngagement?: boolean;
  onUpdateAccess?: (email: string, cohortKeys: string[], sessions: number) => void;
  onSwitchCohort?: (email: string, oldCohortName: string, newCohortKey: string) => void;
}


function cohortDateLabel(startDate: string): string {
  return new Date(startDate) < new Date() ? `Started ${startDate}` : `Starts ${startDate}`;
}

const ALL_COHORTS_META: { key: string; label: string; image: string; startDate: string; endDate: string; sessions: string; full?: boolean }[] = [
  { key: "ib", label: "Spring '26 IB Recruiting Bootcamp", image: "https://leland.imgix.net/bootcamps/6841f40a18fcbc7406208084.png", startDate: "Jan 15, 2026", endDate: "Mar 20, 2026", sessions: "Wednesdays & Fridays, 6–7:30 PM ET · 8 sessions" },
  { key: "pe", label: "Private Equity Recruiting Bootcamp", image: "https://leland.imgix.net/bootcamps/6841c0c4dde9ed55e539fe5f.png", startDate: "Jun 2, 2026", endDate: "Jun 30, 2026", sessions: "Tuesdays, 7–8:30 PM ET · 5 sessions" },
  { key: "ai", label: "AI for Finance Professionals", image: "https://leland.imgix.net/bootcamps/6841f40a18fcbc7406208084.png", startDate: "Mar 1, 2026", endDate: "Mar 29, 2026", sessions: "Thursdays, 6–7 PM ET · 4 sessions", full: true },
  { key: "consulting", label: "Consulting Accelerator", image: "https://leland.imgix.net/bootcamps/6841c0c4dde9ed55e539fe5f.png", startDate: "Jul 7, 2026", endDate: "Aug 4, 2026", sessions: "Mondays & Wednesdays, 7–8:30 PM ET · 6 sessions" },
];

const AVAILABLE_PROGRAMS = [
  { key: "ib", label: "Spring '26 IB Recruiting Bootcamp" },
  { key: "pe", label: "Private Equity Recruiting Bootcamp" },
  { key: "ai", label: "AI for Finance Professionals" },
  { key: "consulting", label: "Consulting Accelerator" },
];

function UpdateAccessView({ user, onDone }: { user: UserDetailV2; onDone: (cohortKeys: string[], sessions: number) => void }) {
  const enrolledKeys = new Set((user.cohorts ?? []).map(c => {
    const found = AVAILABLE_PROGRAMS.find(p => p.label === c.name);
    return found?.key;
  }).filter(Boolean) as string[]);

  const initialSelectedCohorts: Record<string, string> = {};
  enrolledKeys.forEach(key => {
    const meta = ALL_COHORTS_META.find(m => m.key === key);
    if (meta) initialSelectedCohorts[key] = meta.startDate;
  });

  const [sessions, setSessions] = useState(user.sessions?.granted ?? 0);
  const [added, setAdded] = useState<Set<string>>(new Set(enrolledKeys));
  const [selectedCohorts, setSelectedCohorts] = useState<Record<string, string>>(initialSelectedCohorts);
  const [selectingProgram, setSelectingProgram] = useState<string | null>(null);
  const hasPlus = !!user.plus;

  const handleCohortPicked = (date: string | null) => {
    if (selectingProgram) {
      setAdded(prev => { const next = new Set(prev); next.add(selectingProgram); return next; });
      if (date) setSelectedCohorts(prev => ({ ...prev, [selectingProgram]: date }));
    }
    setSelectingProgram(null);
  };

  if (selectingProgram) return (
    <div className="flex flex-col px-4 pt-4 pb-4 sm:px-6">
      <button
        onClick={() => handleCohortPicked(null)}
        className="mb-5 flex w-full items-center justify-between rounded-lg bg-gray-hover px-4 py-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb]"
      >
        Invite the user to select their own dates
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-xlight">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div className="divide-y divide-gray-stroke">
        {ALL_COHORTS_META.map(cohort => (
          <CohortSelectRow
            key={cohort.key}
            cohort={cohort}
            isCurrent={selectedCohorts[selectingProgram] === cohort.startDate}
            onEnroll={() => handleCohortPicked(cohort.startDate)}
            enrollLabel="Select"
            enrolledLabel="Selected"
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-0 px-4 pt-5 pb-4 sm:px-6">
      {/* User card */}
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-hover px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[14px] font-medium text-dark-green">
          {user.initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[16px] font-medium text-gray-dark">{user.name}</div>
          <div className="truncate text-[13px] text-gray-light">{user.email}</div>
        </div>
      </div>

      {/* 1:1 Sessions */}
      <div className="flex items-center justify-between rounded-t-xl border border-gray-stroke px-5 py-4">
        <span className="text-[16px] text-gray-dark">1:1 sessions</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setSessions(s => Math.max(0, s - 1))} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-stroke text-gray-dark hover:bg-gray-hover">
            <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><rect width="12" height="2" rx="1" fill="currentColor"/></svg>
          </button>
          <span className="w-5 text-center text-[16px] font-medium text-gray-dark">{sessions}</span>
          <button onClick={() => setSessions(s => s + 1)} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-stroke text-gray-dark hover:bg-gray-hover">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="5" width="2" height="12" rx="1" fill="currentColor"/><rect y="5" width="12" height="2" rx="1" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

      {/* Programs */}
      <div className="-mt-px border border-gray-stroke px-5 py-4">
        <div className="mb-3 text-[14px] font-medium text-gray-light">Programs</div>
        <div className="flex flex-col gap-2">
          {AVAILABLE_PROGRAMS.map(p => {
            const isAdded = added.has(p.key);
            return (
              <div key={p.key} className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0">
                  <span className="text-[16px] text-gray-dark">{p.label}</span>
                  {isAdded && (
                    <button onClick={() => setSelectingProgram(p.key)} className="text-left text-[14px] text-gray-xlight hover:opacity-70">
                      {selectedCohorts[p.key] ?? "No cohort selected"}
                    </button>
                  )}
                </div>
                {isAdded ? (
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e6f4ef] pl-3 pr-2 py-1.5">
                    <span className="text-[14px] font-medium leading-none text-[#038561]">Added</span>
                    <button onClick={() => setAdded(prev => { const n = new Set(prev); n.delete(p.key); return n; })} className="text-[#038561] hover:opacity-70">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSelectingProgram(p.key)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f5f5f5] px-3 py-1.5 text-[14px] font-medium text-gray-dark hover:bg-[#ebebeb]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leland+ */}
      <div className="-mt-px rounded-b-xl border border-gray-stroke px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-gray-dark">Leland+</span>
          {hasPlus ? (
            <span className="flex items-center gap-1.5 text-[14px] text-gray-light">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 6 4.5 9 10.5 3"/></svg>
              {user.plus!.status === "active" ? `Expires ${user.plus!.expiry}` : "Expired"}
            </span>
          ) : (
            <button className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-gray-stroke bg-white px-3 py-1 text-[14px] font-medium text-gray-dark hover:bg-gray-hover">+ Add</button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-gray-stroke bg-white px-0 pt-4">
        <Button size="lg" variant="primary" onClick={() => onDone(Array.from(added), sessions)} className="w-full justify-center">
          Update access
        </Button>
      </div>
    </div>
  );
}

function CohortSelectRow({
  cohort,
  isCurrent,
  onEnroll,
  enrollLabel = "Enroll",
  enrolledLabel = "Enrolled",
}: {
  cohort: typeof ALL_COHORTS_META[number];
  isCurrent: boolean;
  onEnroll: (key: string) => void;
  enrollLabel?: string;
  enrolledLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="text-[16px] font-medium text-gray-dark">{cohort.label}</div>
          <div className="text-[14px] text-gray-light">{cohort.startDate}</div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-0.5 w-fit cursor-pointer text-[14px] text-gray-light underline hover:text-gray-dark"
          >
            {expanded ? "Hide details" : "View details"}
          </button>
          {expanded && (
            <div className="mt-1 text-[14px] text-gray-light">{cohort.sessions}</div>
          )}
        </div>
        <Button
          size="md"
          variant={isCurrent || cohort.full ? "secondary" : "primary"}
          onClick={isCurrent || cohort.full ? undefined : () => onEnroll(cohort.key)}
          disabled={isCurrent || cohort.full}
        >
          {isCurrent ? enrolledLabel : cohort.full ? "Full" : enrollLabel}
        </Button>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "#ffcb47" : "#e5e5e5"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function StatusDot({ status }: { status: "completed" | "scheduled" | "unbooked" | "enrolled" | "invited" }) {
  const color =
    status === "completed" ? "bg-gray-dark" :
    status === "scheduled" ? "bg-[#4f86f7]" :
    status === "enrolled"  ? "bg-gray-dark" :
    status === "invited"   ? "bg-gray-xlight" :
    "bg-[#d4d4d4]";
  return <span className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${color}`} />;
}

export function Tag({ children, color = "gray" }: { children: React.ReactNode; color?: "gray" | "green" | "orange" | "blue" | "red" }) {
  const cls =
    color === "green"  ? "bg-primary-xlight text-dark-green border border-primary-xlight" :
    color === "orange" ? "bg-orange/10 text-orange border border-orange/10" :
    color === "blue"   ? "bg-blue/10 text-blue border border-blue/10" :
    color === "red"    ? "bg-red/10 text-red border border-red/10" :
    "bg-gray-hover text-gray-light border border-gray-hover";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-sm font-medium ${cls}`}>
      {children}
    </span>
  );
}

function AccordionSection({
  title, subtitle, pill, icon, children,
}: {
  title: string;
  subtitle: string;
  pill?: React.ReactNode;
  icon?: string;
  children: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-gray-stroke">
      <div className="flex items-center justify-between gap-4 overflow-hidden rounded-t-[11px] border-b border-gray-stroke bg-gray-hover px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="shrink-0 text-[14px] font-medium text-gray-light">{title}</div>
        </div>
        {pill && <div className="shrink-0">{pill}</div>}
      </div>
      <div className="px-4 pb-4 pt-4">{children}</div>
    </div>
  );
}

export default function B2BUserDrawerV2({ user, onClose, isAlaCarte, showLpEngagement, onUpdateAccess, onSwitchCohort }: Props) {
  const [switchCohortName, setSwitchCohortName] = useState<string | null>(null);
  const [showUpdateAccess, setShowUpdateAccess] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const activeView = switchCohortName ? "switch-cohort" : showUpdateAccess ? "update-access" : "user";

  useEffect(() => {
    if (!user) return;
    setReminderSent(false);
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [user, onClose]);

  const userFirstName = user?.name.split(" ")[0];
  const reviews = [
    ...(user?.sessions?.entries.filter((s) => s.review).map((s) => ({
      coachImg: s.coachImg,
      coachName: s.coach ? `${s.coach.split(" ")[0]} ${s.coach.split(" ")[1]?.[0] ?? ""}.`.trim() : undefined,
      coachHref: "https://www.joinleland.com/coach/jordan-lee",
      contextPrefix: s.coach ? `${userFirstName} worked with ` : undefined,
      contextSuffix: " 1:1",
      attribution: undefined as string | undefined,
      review: s.review!,
    })) ?? []),
    ...(user?.cohorts?.filter((c) => c.review).map((c) => ({
      coachImg: undefined,
      coachName: undefined,
      coachHref: undefined,
      contextPrefix: undefined,
      contextSuffix: undefined,
      attribution: c.name,
      review: c.review!,
    })) ?? []),
  ];

  const sessionsUsed = user?.sessions?.entries.filter((s) => s.status !== "unbooked").length ?? 0;
  const sessionsCompleted = user?.sessions?.entries.filter((s) => s.status === "completed").length ?? 0;


  return (
    <>
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="relative flex w-full flex-col overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] h-[100dvh] sm:h-[75dvh] sm:w-[560px] sm:max-w-[95vw] sm:rounded-2xl">

              {/* Header */}
              <div className="relative flex min-h-12 w-full shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
                {activeView !== "user" && (
                  <button
                    onClick={() => { setSwitchCohortName(null); setShowUpdateAccess(false); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-hover"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}
                <span className="text-[18px] font-medium text-gray-dark">
                  {activeView === "switch-cohort" ? "Select a cohort" : activeView === "update-access" ? "Update access" : user.name}
                </span>
                <button
                  onClick={onClose}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-hover"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-x-hidden overflow-y-auto">

                {/* Cohort selection view */}
                {activeView === "switch-cohort" && (() => {
                  const switchingPending = user.cohorts?.find(c => c.name === switchCohortName)?.pending ?? false;
                  return (
                    <div className="divide-y divide-gray-stroke px-4 sm:px-6">
                      {ALL_COHORTS_META.map((c) => (
                        <CohortSelectRow
                          key={c.key}
                          cohort={c}
                          isCurrent={!switchingPending && c.label === switchCohortName}
                          onEnroll={(newKey) => { onSwitchCohort?.(user.email, switchCohortName!, newKey); setSwitchCohortName(null); }}
                        />
                      ))}
                    </div>
                  );
                })()}

                {/* Update access view */}
                {activeView === "update-access" && (
                  <UpdateAccessView user={user} onDone={(cohortKeys, sessions) => { onUpdateAccess?.(user.email, cohortKeys, sessions); setShowUpdateAccess(false); }} />
                )}

                {/* User summary */}
                {activeView === "user" && (<>
                <div className="px-4 pb-2 pt-5 sm:px-6">
                  <div className="text-[30px] font-medium text-gray-dark">User details</div>
                  <div className="mt-1 text-[16px] text-gray-light">
                    {user.email}{user.dateAdded ? ` · Added ${user.dateAdded}` : ""}
                  </div>
                  <div className="mt-5 flex gap-3">
                    {isAlaCarte && (
                      <Button size="md" variant="secondary" onClick={() => setShowUpdateAccess(true)} className="flex-1 justify-center border border-gray-stroke bg-white hover:bg-gray-hover">
                        Grant access
                      </Button>
                    )}
                    <div className="group/remind relative flex-1">
                      <Button size="md" variant="secondary" disabled={reminderSent} onClick={() => setReminderSent(true)} className="w-full justify-center border border-gray-stroke bg-white hover:bg-gray-hover">
                        {reminderSent ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Reminder sent
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                            </svg>
                            Send reminder
                          </>
                        )}
                      </Button>
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-lg bg-gray-dark px-3 py-2 text-[13px] leading-[1.4] text-white opacity-0 shadow-md transition-opacity group-hover/remind:opacity-100">
                        Email the user links to benefits they haven't used yet.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion sections */}
                <div className="flex flex-col gap-5 px-4 py-4 sm:px-6">

                  {/* 1:1 Sessions */}
                  {user.sessions && (
                    <AccordionSection
                      icon={usersIcon}
                      title="1:1 Sessions"
                      subtitle={(() => {
                        const scheduled = user.sessions.entries.filter(s => s.status === "scheduled").length;
                        return `${sessionsUsed}/${user.sessions.granted} used${scheduled > 0 ? `, ${scheduled} scheduled` : ""}`;
                      })()}
                      pill={undefined}
                    >
                      {/* Progress bar */}
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${(sessionsCompleted / user.sessions.granted) * 100}%` }}
                          />
                        </div>
                        <div className="group relative flex shrink-0 cursor-pointer items-center gap-1">
                          <span className="text-[14px] leading-none text-gray-light">{sessionsCompleted} of {user.sessions.granted} completed</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-xlight">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                          <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-[200px] rounded-lg bg-gray-dark px-3 py-2 text-[13px] leading-[1.4] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Sessions are calculated based on time used.
                            <div className="absolute right-2 top-full border-4 border-transparent border-t-gray-dark" />
                          </div>
                        </div>
                      </div>

                      {/* Session rows — one per granted session slot */}
                      <div className="flex flex-col">
                        {user.sessions.entries.filter(s => s.status !== "unbooked").map((s, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 border-b border-gray-stroke py-3 last:border-0">
                            <div className="flex min-w-0 items-center gap-3">
                              {s.coachImg ? (
                                <div className="relative shrink-0">
                                  <img src={s.coachImg} alt={s.coach} className="h-9 w-9 rounded-full object-cover" />
                                  {s.status === "completed" && (
                                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-sm">
                                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="2 6 5 9 10 3" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="h-9 w-9 shrink-0 rounded-full border-2 border-dashed border-gray-stroke bg-gray-hover" />
                              )}
                              <div className="flex min-w-0 flex-col gap-0.5">
                                {s.coach ? (
                                  <div className="truncate text-[16px] font-medium leading-[1.2] text-gray-dark">
                                    With {`${s.coach.split(" ")[0]} ${s.coach.split(" ")[1]?.[0] ?? ""}.`}
                                  </div>
                                ) : (
                                  <div className="truncate text-[16px] font-medium leading-[1.2] text-gray-dark">Not yet scheduled</div>
                                )}
                                {s.coachHeadline && <div className="truncate text-[14px] leading-[1.2] text-gray-light">{s.coachHeadline}</div>}
                              </div>
                            </div>
                            {s.status !== "unbooked" && (
                              <div className="flex shrink-0 flex-col gap-0.5 text-right">
                                <div className="text-[16px] leading-[1.2] text-gray-dark">
                                  {s.status === "completed" ? "Completed" : "Scheduled"}
                                </div>
                                {s.date !== "—" && <div className="text-[14px] leading-[1.2] text-gray-light">{s.date}</div>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Programs */}
                  {user.cohorts && user.cohorts.length > 0 && (() => {
                    const enrolledCount = user.cohorts.filter(c => !c.pending).length;
                    const pendingCount = user.cohorts.filter(c => c.pending).length;
                    const subtitle = enrolledCount > 0
                      ? `${enrolledCount} enrolled${pendingCount > 0 ? ` · ${pendingCount} pending` : ""}`
                      : `${pendingCount} pending`;
                    const switchCohortIsPending = user.cohorts.find(c => c.name === switchCohortName)?.pending ?? false;
                    return (
                      <AccordionSection
                        icon={videoIcon}
                        title="Programs"
                        subtitle={subtitle}
                        pill={undefined}
                      >
                        <div className="flex flex-col">
                          {user.cohorts.map((c, i) => (
                            <div key={i} className="border-b border-gray-stroke py-3 last:border-0">
                              <div className="flex min-w-0 items-start gap-3">
                                {c.image && (
                                  <img src={c.image} alt={c.name} className="h-[36px] w-[69px] shrink-0 rounded-[6px] object-cover aspect-[1200/630]" />
                                )}
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <div className="truncate text-[16px] font-medium leading-[1.2] text-gray-dark">{c.name}</div>
                                  {c.pending ? (
                                    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-[14px] leading-[1.2]">
                                      <span className="text-gray-xlight">User hasn't selected a cohort yet.</span>
                                      <button onClick={(e) => { e.stopPropagation(); setSwitchCohortName(c.name); }} className="cursor-pointer text-[14px] text-gray-xlight underline hover:text-gray-dark">Choose for them</button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-[14px] leading-[1.2] text-gray-light">
                                      <span>{cohortDateLabel(c.startDate!)}</span>
                                      <button onClick={(e) => { e.stopPropagation(); setSwitchCohortName(c.name); }} className="cursor-pointer text-[14px] text-gray-xlight underline hover:text-gray-dark">Switch cohort</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionSection>
                    );
                  })()}

                  {/* Reviews */}
                  {reviews.length > 0 && (
                    <AccordionSection
                      icon={starIcon}
                      title="Reviews"
                      subtitle={`${reviews.length}`}
                    >
                      <div className="flex flex-col">
                        {reviews.map((r, i) => (
                          <div key={i} className="border-b border-gray-stroke py-4 last:border-0">
                            <StarRating rating={r.review.rating} />
                            <p className="mt-1.5 text-[16px] leading-[1.5] text-gray-dark">"{r.review.text}"</p>
                            <div className="mt-3 flex min-w-0 items-center gap-2">
                              {r.coachImg && <img src={r.coachImg} alt={r.coachName} className="h-5 w-5 shrink-0 rounded-full object-cover" />}
                              <span className="truncate text-[16px] text-gray-light">
                                {r.contextPrefix}{r.coachName && r.coachHref ? (
                                  <a href={r.coachHref} target="_blank" rel="noreferrer" className="hover:underline">{r.coachName}</a>
                                ) : null}{r.contextSuffix ?? r.attribution}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Leland+ */}
                  {user.plus && (
                    <AccordionSection
                      icon={plusIcon}
                      title="Leland+"
                      subtitle={user.plus.status === "active" ? "Active" : "Expired"}
                      pill={user.plus.status === "expired" ? <Tag color="orange">Expired</Tag> : undefined}
                    >
                      <div className="flex flex-col">
                        {user.plus.grantedDate && (
                          <div className="flex items-center justify-between border-b border-gray-stroke py-3">
                            <span className="text-[16px] text-gray-light">Access granted</span>
                            <span className="text-[16px] text-gray-dark">{user.plus.grantedDate}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-b border-gray-stroke py-3">
                          <span className="text-[16px] text-gray-light">Status</span>
                          <span className={`text-[16px] ${user.plus.status === "active" ? "text-gray-dark" : "text-gray-xlight"}`}>
                            {user.plus.status === "active" ? "Active" : "Expired"}
                          </span>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${showLpEngagement && user.plus.resourcesViewed !== undefined ? "border-b border-gray-stroke" : ""}`}>
                          <span className="text-[16px] text-gray-light">{user.plus.status === "active" ? "Expires" : "Expired"}</span>
                          <span className="text-[16px] text-gray-dark">{user.plus.expiry}</span>
                        </div>
                        {showLpEngagement && user.plus.resourcesViewed !== undefined && (
                          <div className={`flex items-center justify-between py-3 ${user.plus.topCategories?.length ? "border-b border-gray-stroke" : ""}`}>
                            <span className="text-[16px] text-gray-light">Resources viewed</span>
                            <span className="text-[16px] text-gray-dark">{user.plus.resourcesViewed}</span>
                          </div>
                        )}
                        {showLpEngagement && user.plus.topCategories?.length && (
                          <div className="py-3">
                            <span className="text-[16px] text-gray-light">Top categories</span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {user.plus.topCategories.slice(0, 3).map((cat) => (
                                <span key={cat} className="inline-flex rounded-full bg-[#e6f4ef] px-2.5 py-1.5 text-[14px] font-medium leading-none text-[#038561]">{cat}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionSection>
                  )}

                </div>
                </>)}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
