import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./Button";
import SessionCard from "./SessionCard";
import { useSessionLayout } from "./SessionLayoutContext";
import calendarIcon from "../assets/icons/calendar-page.svg";
import menuBurgerIcon from "../assets/icons/menu-burger.svg";
import playVideoIcon from "../assets/icons/play-video.svg";
import slackIcon from "../assets/icons/slack-black.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimeSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
  joinUrl?: string;
  recordingUrl?: string;
};

export type Session = {
  id: number;
  title: string;
  duration: string;
  slots: [TimeSlot, TimeSlot]; // [morning, evening]
};

export type LiveCourse = {
  type: "live";
  id: number;
  title: string;
  cohortDateLabel: string;
  cohortDates: string;
  registrants: string[];
  sessions: Session[];
  image: string;
  cohortSelected?: boolean;
};

type SessionState = "past-recording" | "past-pending" | "live" | "soon" | "future";

export function getSessionState(slot: TimeSlot): SessionState {
  const now = new Date();
  if (slot.endTime < now) return slot.recordingUrl ? "past-recording" : "past-pending";
  if (slot.startTime.getTime() - now.getTime() <= 30 * 60 * 1000) return "live";
  if (slot.startTime.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) return "soon";
  return "future";
}

export function isLiveCourseCompleted(course: LiveCourse): boolean {
  return course.sessions.length > 0 && course.sessions.every((s) =>
    s.slots.every((slot) => {
      const st = getSessionState(slot);
      return st === "past-recording" || st === "past-pending";
    })
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatStartsIn(ms: number): string {
  const totalMins = Math.floor(ms / 60000);
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  if (days > 0 && hours > 0) return `Starts in ${days}d ${hours}h`;
  if (days > 0) return `Starts in ${days}d`;
  return `Starts in ${hours}h`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatSlotDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ─── Figma icon assets ────────────────────────────────────────────────────────

// ─── Action button ────────────────────────────────────────────────────────────

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button size="sm" variant="secondary" className="shrink-0">
      {icon}
      {label}
    </Button>
  );
}

// ─── Session rows ─────────────────────────────────────────────────────────────

const SLOT_TIME_LABELS = ["9:00 AM", "7:00 PM"] as const;

function SessionRowSimple({ session, isNext }: { session: Session; index: number; isNext: boolean; isFirst?: boolean }) {
  const slots = session.slots.map((slot) => {
    const state = getSessionState(slot);
    return {
      slot,
      state,
      status: (state === "live" ? "live" : (state === "past-recording" || state === "past-pending") ? "past" : "upcoming") as "live" | "upcoming" | "past",
      startsInText: isNext && (state === "soon" || state === "future")
        ? formatStartsIn(slot.startTime.getTime() - Date.now()).replace("Starts in ", "")
        : undefined,
    };
  });

  return (
    <div className="flex items-stretch px-2">
      {/* Left OR bracket connector */}
      <div className="flex shrink-0 flex-col items-end justify-center py-5 pl-2">
        <div className="h-[30px] w-2 border-l border-t border-dashed border-[#9b9b9b]" />
        <span className="py-2 text-[14px] font-medium uppercase tracking-[0.1em] text-[#9b9b9b]">or</span>
        <div className="h-[30px] w-2 border-l border-b border-dashed border-[#9b9b9b]" />
      </div>
      {/* Session cards */}
      <div className="min-w-0 flex-1">
        {slots.map(({ slot, state, status, startsInText }, slotIndex) => (
          <SessionCard
            key={slot.id}
            title={`${session.title} – ${SLOT_TIME_LABELS[slotIndex] ?? formatTime(slot.startTime)}`}
            dateTime={formatSlotDateTime(slot.startTime)}
            duration={session.duration}
            image=""
            type="event"
            status={status}
            startsIn={startsInText}
            hasRecording={state === "past-recording"}
            hideImage
          />
        ))}
      </div>
    </div>
  );
}

function SessionRow({ session, isNext }: { session: Session; isNext: boolean; isFirst?: boolean }) {
  return (
    <div className="px-2">
      {session.slots.map((slot, slotIndex) => {
        const state = getSessionState(slot);
        const status: "live" | "upcoming" | "past" =
          state === "live" ? "live" : (state === "past-recording" || state === "past-pending") ? "past" : "upcoming";
        const startsInText = isNext && (state === "soon" || state === "future")
          ? formatStartsIn(slot.startTime.getTime() - Date.now()).replace("Starts in ", "")
          : undefined;
        return (
          <SessionCard
            key={slot.id}
            title={`${session.title} – ${SLOT_TIME_LABELS[slotIndex] ?? formatTime(slot.startTime)}`}
            dateTime={formatSlotDateTime(slot.startTime)}
            duration={session.duration}
            image=""
            type="event"
            status={status}
            startsIn={startsInText}
            hasRecording={state === "past-recording"}
            hideImage
          />
        );
      })}
    </div>
  );
}

// ─── Select Cohort Modal ──────────────────────────────────────────────────────

const mockCohorts = [
  { id: 1, dates: "May 5 – Jun 9, 2026",   days: "Tuesdays & Thursdays", time: "7:00 PM PT", urgencyTag: "6 days left to enroll" },
  { id: 2, dates: "Jul 7 – Aug 11, 2026",  days: "Mondays & Wednesdays",  time: "9:00 AM PT", urgencyTag: null },
  { id: 3, dates: "Sep 8 – Oct 13, 2026",  days: "Tuesdays & Thursdays", time: "7:00 PM PT", urgencyTag: null },
];

function SelectCohortModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          {/* Panel — bottom sheet on mobile, centered on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[480px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-stroke px-5 py-4">
              <h2 className="text-[18px] font-medium text-gray-dark">Select a cohort</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Cohort list */}
            <div className="divide-y divide-gray-stroke">
              {mockCohorts.map((cohort) => (
                <div key={cohort.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">{cohort.dates}</p>
                    <p className="text-[14px] leading-[1.3] text-gray-light">{cohort.days} · {cohort.time}</p>
                    {cohort.urgencyTag && (
                      <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[14px] font-medium text-[#92400E]">
                        {cohort.urgencyTag}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { onSelect(); onClose(); }}
                    className="shrink-0 rounded-lg bg-gray-dark px-4 py-2 text-[15px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#444444]"
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-stroke px-5 py-4">
              <p className="text-[14px] text-gray-light">
                Don't see a time that works?{" "}
                <a href="#" className="font-medium text-gray-dark underline">Get notified about future cohorts</a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Live course card ─────────────────────────────────────────────────────────

export default function LiveCourseCard({ course, boxed }: { course: LiveCourse; boxed?: boolean }) {
  const { simpleSessionLayout } = useSessionLayout();
  const isCompleted = isLiveCourseCompleted(course);
  const nextSession = course.sessions.find((s) =>
    s.slots.some((slot) => {
      const st = getSessionState(slot);
      return st === "live" || st === "soon" || st === "future";
    })
  );
  const [sessionsOpen, setSessionsOpen] = useState(!isCompleted);
  const [cohortSelected, setCohortSelected] = useState(course.cohortSelected ?? true);
  const [cohortModalOpen, setCohortModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarOpen) return;
    function handleClick(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [calendarOpen]);

  const calendarButton = !isCompleted && (
    <div ref={calendarRef} className="relative">
      <button
        onClick={() => setCalendarOpen((o) => !o)}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-3 py-2 text-[14px] font-medium leading-[1.2] text-gray-dark transition-colors hover:bg-gray-hover"
      >
        <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
        Add all to calendar
      </button>
      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
          >
            <div className="px-2 py-2">
              <button className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                Google Calendar
              </button>
              <button className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                iCal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const actionButtons = cohortSelected ? (
    <>
      <ActionButton
        icon={<img src={menuBurgerIcon} alt="" className="h-4 w-4 shrink-0" />}
        label="Syllabus"
      />
      <ActionButton
        icon={<img src={playVideoIcon} alt="" className="h-4 w-4 shrink-0" />}
        label="Recordings"
      />
      <ActionButton
        icon={<img src={slackIcon} alt="" className="h-4 w-4 shrink-0" />}
        label="Slack"
      />
      <ActionButton
        icon={<img src={orderHistoryIcon} alt="" className="h-4 w-4 shrink-0" />}
        label="Office Hours"
      />
    </>
  ) : (
    <Button size="md" variant="primary" onClick={() => setCohortModalOpen(true)} className="w-full md:w-auto">
      Select cohort
    </Button>
  );

  const sessionsList = (
    <>
      {/* Accordion toggle */}
      <button
        onClick={() => setSessionsOpen(!sessionsOpen)}
        className={`flex w-full cursor-pointer items-center gap-3 bg-white px-4 py-3${boxed ? " border-t border-gray-stroke" : ""}`}
      >
        <span className="flex-1 text-left leading-[1.2]">
          <span className="text-[16px] font-medium text-gray-dark">{course.sessions.length} Sessions</span>
          <span className="ml-2 text-[16px] font-normal text-gray-light">{course.cohortDates}</span>
        </span>
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          className={`shrink-0 text-[#9b9b9b] transition-transform ${sessionsOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Sessions list */}
      {sessionsOpen && (
        <div className="border-t border-gray-stroke bg-white pb-2 pt-2">
          {(calendarButton || nextSession) && (
            <div className="flex items-center justify-between px-4 pb-2 pt-2">
              {calendarButton}
              {!isCompleted && nextSession && (
                <button
                  onClick={() => setCohortModalOpen(true)}
                  className="ml-auto inline-flex items-center py-2 text-[14px] text-gray-light underline transition-colors hover:text-gray-dark"
                >
                  Switch cohort
                </button>
              )}
            </div>
          )}
          {simpleSessionLayout
            ? course.sessions.map((session, i) => (
                <SessionRowSimple key={session.id} session={session} index={i + 1} isNext={session.id === nextSession?.id} isFirst={i === 0} />
              ))
            : course.sessions.map((session, i) => (
                <SessionRow key={session.id} session={session} isNext={session.id === nextSession?.id} isFirst={i === 0} />
              ))
          }
        </div>
      )}
    </>
  );

  const header = (
    <div className={`flex flex-col gap-4 bg-white md:flex-row md:items-stretch md:gap-5${boxed ? " p-4 md:p-5" : ""}`}>
      <div className="flex flex-row items-center gap-4 md:contents md:gap-0">
        {/* Thumbnail */}
        <div className="relative w-1/3 shrink-0 md:w-[220px]">
          <img
            src={course.image}
            alt=""
            className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
          />
          {isCompleted && (
            <span className="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-[14px] font-medium text-gray-dark shadow-sm">
              Complete
            </span>
          )}
        </div>
        {/* Title group */}
        <div className={`flex min-w-0 flex-1 flex-col gap-1 md:flex-[1_0_0] md:gap-0${!cohortSelected ? " md:justify-center" : ""}`}>
          <div className="flex md:flex-1 md:items-center">
            <div>
              <p className="text-[14px] font-medium uppercase tracking-[1.4px] text-gray-light">Live course</p>
              <p className="mt-1 line-clamp-2 text-[20px] font-medium leading-[1.2] text-gray-dark md:line-clamp-1 md:text-[24px]">{course.title}</p>
            </div>
          </div>
          {/* Buttons: desktop only */}
          <div className="hidden gap-2 overflow-x-auto md:flex">{actionButtons}</div>
        </div>
      </div>
      {/* Buttons: mobile/tablet only */}
      <div className={`flex gap-2 overflow-x-auto md:hidden${boxed ? " -mr-4 pr-4 sm:-mr-5 sm:pr-5" : ""}`}>{actionButtons}</div>
    </div>
  );

  return (
    <div ref={cardRef}>
      {boxed ? (
        <div className="overflow-hidden rounded-xl border border-gray-stroke shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-transform hover:translate-x-0.5">
          {header}
          {cohortSelected && sessionsList}
        </div>
      ) : (
        <>
          {header}
          {cohortSelected && (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-stroke">
              {sessionsList}
            </div>
          )}
        </>
      )}

      <SelectCohortModal
        open={cohortModalOpen}
        onClose={() => setCohortModalOpen(false)}
        onSelect={() => setCohortSelected(true)}
      />
    </div>
  );
}
