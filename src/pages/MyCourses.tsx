import { NavLink } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageShell from "../components/PageShell";
import { useSessionLayout } from "../components/SessionLayoutContext";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import playIcon from "../assets/icons/play.svg";
import playVideoIcon from "../assets/icons/play-video.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

// ─── Figma icon assets ────────────────────────────────────────────────────────
const figmaSyllabusIcon = "https://www.figma.com/api/mcp/asset/6eb7cc2d-90b9-49e5-9d0b-541c668a79f0";
const figmaPlayIcon = "https://www.figma.com/api/mcp/asset/dab3b9c4-442a-4fe1-b04e-5026b09d9843";
const figmaSlack1 = "https://www.figma.com/api/mcp/asset/c66c77e8-363b-4742-87f2-1fb9b18416c0";
const figmaSlack2 = "https://www.figma.com/api/mcp/asset/9453f0d5-c53a-4128-b604-1ff16db95a9f";
const figmaSlack3 = "https://www.figma.com/api/mcp/asset/a51db8bb-c981-4b77-a5dc-761d347a7019";
const figmaSlack4 = "https://www.figma.com/api/mcp/asset/d6fb8824-812f-4b5c-8d90-5b56cb53286a";

// ─── Data ────────────────────────────────────────────────────────────────────

type TimeSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
  joinUrl?: string;
  recordingUrl?: string;
};

type Session = {
  id: number;
  title: string;
  duration: string;
  slots: [TimeSlot, TimeSlot]; // [morning, evening]
};

type LiveCourse = {
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

type SelfPacedCourse = {
  type: "selfPaced";
  id: number;
  title: string;
  image: string;
  percentComplete: number;
  totalTime: string;
};

type EnrolledCourse = LiveCourse | SelfPacedCourse;

type SessionState = "past-recording" | "past-pending" | "live" | "soon" | "future";

function getSessionState(slot: TimeSlot): SessionState {
  const now = new Date();
  if (slot.endTime < now) return slot.recordingUrl ? "past-recording" : "past-pending";
  if (slot.startTime.getTime() - now.getTime() <= 30 * 60 * 1000) return "live";
  if (slot.startTime.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) return "soon";
  return "future";
}

function sortKey(course: EnrolledCourse): number {
  if (course.type === "live") {
    const next = course.sessions.find((s) => {
      const st = getSessionState(s.slots[0]);
      return st === "live" || st === "soon" || st === "future";
    });
    if (next) return next.slots[0].startTime.getTime();
    return Number.MAX_SAFE_INTEGER;
  }
  if (course.percentComplete >= 100) return Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER / 2;
}

const liveNow = new Date(Date.now() + 15 * 60 * 1000);
const liveEnd = new Date(Date.now() + 105 * 60 * 1000);
const eveningSoon = new Date(Date.now() + 3 * 60 * 60 * 1000);
const eveningSoonEnd = new Date(Date.now() + 4.5 * 60 * 60 * 1000);

const enrolledCourses: EnrolledCourse[] = ([
  {
    type: "live" as const,
    id: 1,
    title: "MBA Admissions Strategy Bootcamp",
    cohortDateLabel: "Spring admissions",
    cohortDates: "Mar 12 – Apr 23, 2026",
    registrants: [pic1, pic3, pic4],
    image: event1,
    sessions: [
      { id: 101, title: "Introduction & Goal Setting", duration: "90 min", slots: [
        { id: 1010, startTime: new Date("2026-03-12T09:00:00"), endTime: new Date("2026-03-12T10:30:00"), recordingUrl: "#" },
        { id: 1011, startTime: new Date("2026-03-12T19:00:00"), endTime: new Date("2026-03-12T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 102, title: "School Selection Strategy", duration: "90 min", slots: [
        { id: 1020, startTime: new Date("2026-03-19T09:00:00"), endTime: new Date("2026-03-19T10:30:00"), recordingUrl: "#" },
        { id: 1021, startTime: new Date("2026-03-19T19:00:00"), endTime: new Date("2026-03-19T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 103, title: "Crafting Your Story", duration: "90 min", slots: [
        { id: 1030, startTime: new Date("2026-03-26T09:00:00"), endTime: new Date("2026-03-26T10:30:00"), recordingUrl: "#" },
        { id: 1031, startTime: new Date("2026-03-26T19:00:00"), endTime: new Date("2026-03-26T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 104, title: "Building Your Narrative", duration: "90 min", slots: [
        { id: 1040, startTime: liveNow, endTime: liveEnd },
        { id: 1041, startTime: eveningSoon, endTime: eveningSoonEnd },
      ] as [TimeSlot, TimeSlot] },
      { id: 105, title: "Essays & Short Answers", duration: "90 min", slots: [
        { id: 1050, startTime: new Date("2026-04-09T09:00:00"), endTime: new Date("2026-04-09T10:30:00") },
        { id: 1051, startTime: new Date("2026-04-09T19:00:00"), endTime: new Date("2026-04-09T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 106, title: "Final Q&A & Wrap-Up", duration: "60 min", slots: [
        { id: 1060, startTime: new Date("2026-04-23T09:00:00"), endTime: new Date("2026-04-23T10:00:00") },
        { id: 1061, startTime: new Date("2026-04-23T19:00:00"), endTime: new Date("2026-04-23T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  {
    type: "live" as const,
    id: 7,
    title: "Law School Admissions Bootcamp",
    cohortDateLabel: "Fall admissions",
    cohortDates: "May 5 – Jun 9, 2026",
    registrants: [pic3, pic5, pic1],
    image: event3,
    cohortSelected: false,
    sessions: [],
  },
  {
    type: "live" as const,
    id: 5,
    title: "Tech PM Interview Accelerator",
    cohortDateLabel: "Winter cohort",
    cohortDates: "Jan 6 – Feb 3, 2026",
    registrants: [pic4, pic1, pic6],
    image: eventImage,
    sessions: [
      { id: 501, title: "PM Fundamentals", duration: "60 min", slots: [
        { id: 5010, startTime: new Date("2026-01-06T09:00:00"), endTime: new Date("2026-01-06T10:00:00"), recordingUrl: "#" },
        { id: 5011, startTime: new Date("2026-01-06T19:00:00"), endTime: new Date("2026-01-06T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 502, title: "Product Sense & Design", duration: "60 min", slots: [
        { id: 5020, startTime: new Date("2026-01-13T09:00:00"), endTime: new Date("2026-01-13T10:00:00"), recordingUrl: "#" },
        { id: 5021, startTime: new Date("2026-01-13T19:00:00"), endTime: new Date("2026-01-13T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 503, title: "Metrics & Analytical Questions", duration: "60 min", slots: [
        { id: 5030, startTime: new Date("2026-01-20T09:00:00"), endTime: new Date("2026-01-20T10:00:00"), recordingUrl: "#" },
        { id: 5031, startTime: new Date("2026-01-20T19:00:00"), endTime: new Date("2026-01-20T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 504, title: "Behavioral & Leadership", duration: "60 min", slots: [
        { id: 5040, startTime: new Date("2026-01-27T09:00:00"), endTime: new Date("2026-01-27T10:00:00"), recordingUrl: "#" },
        { id: 5041, startTime: new Date("2026-01-27T19:00:00"), endTime: new Date("2026-01-27T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 505, title: "Mock Interviews & Debrief", duration: "90 min", slots: [
        { id: 5050, startTime: new Date("2026-02-03T09:00:00"), endTime: new Date("2026-02-03T10:30:00"), recordingUrl: "#" },
        { id: 5051, startTime: new Date("2026-02-03T19:00:00"), endTime: new Date("2026-02-03T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  { type: "selfPaced" as const, id: 3, title: "Nail the Google PM Interview Cycle", image: event3, percentComplete: 65, totalTime: "7 hours" },
  { type: "selfPaced" as const, id: 4, title: "Consulting Case Interview Mastery", image: eventImage, percentComplete: 20, totalTime: "6 hours" },
  { type: "selfPaced" as const, id: 6, title: "MBA Application Essay Masterclass", image: event1, percentComplete: 100, totalTime: "4 hours" },
] as EnrolledCourse[]).sort((a, b) => sortKey(a) - sortKey(b));

const suggestedCourses = [
  { title: "Stanford MBA Application Workshop", type: "Live cohort", duration: "4 weeks", enrolledCount: "24 enrolled", image: event1 },
  { title: "Product Management Fundamentals", type: "Self-paced", duration: "8h", enrolledCount: null, image: event2 },
  { title: "Finance for Non-Finance MBAs", type: "Live cohort", duration: "3 weeks", enrolledCount: "18 enrolled", image: event3 },
  { title: "Leadership & Organizational Behavior", type: "Self-paced", duration: "6h", enrolledCount: null, image: eventImage },
];

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

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatSlotDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getCalendarInfo(date: Date) {
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    date: date.getDate(),
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SlackIcon() {
  return (
    <div className="relative h-5 w-5 shrink-0 overflow-hidden">
      <div className="absolute inset-[10%]">
        <div className="absolute inset-[52.14%_52.15%_10.01%_10%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack1} />
        </div>
        <div className="absolute inset-[10%_52.15%_52.14%_10%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack2} />
        </div>
        <div className="absolute inset-[10%_10%_52.14%_52.15%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack3} />
        </div>
        <div className="absolute inset-[52.14%_10%_10%_52.15%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack4} />
        </div>
      </div>
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-hover px-3 py-2 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb]">
      {icon}
      {label}
    </button>
  );
}

// ─── Session CTA ──────────────────────────────────────────────────────────────

function SessionCTA({ slot, isNext }: { slot: TimeSlot; isNext: boolean }) {
  const state = getSessionState(slot);

  if (state === "live") {
    return (
      <a href={slot.joinUrl ?? "#"} className="flex shrink-0 items-center gap-1.5 text-[16px] font-medium text-white">
        Join
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="-rotate-90 shrink-0">
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    );
  }
  if (state === "past-recording") {
    return (
      <a href={slot.recordingUrl} className="flex shrink-0 items-center gap-1.5 text-[16px] font-medium text-gray-dark">
        <img src={playVideoIcon} alt="" className="h-[18px] w-[18px] shrink-0" />
        Replay
      </a>
    );
  }
  if (state === "past-pending") {
    return <span className="shrink-0 text-[16px] text-[#9b9b9b]">Processing</span>;
  }
  if (state === "soon" || state === "future") {
    if (isNext) {
      return (
        <span className="shrink-0 text-[16px] font-medium text-[#3b7dfd]">
          {formatStartsIn(slot.startTime.getTime() - Date.now())}
        </span>
      );
    }
    return (
      <span className="shrink-0 text-[16px] text-[#9b9b9b]">
        {formatShortDate(slot.startTime)}
      </span>
    );
  }
  return null;
}

// ─── Slot option ──────────────────────────────────────────────────────────────

function SlotOption({ slot, isNext }: { slot: TimeSlot; isNext: boolean }) {
  const state = getSessionState(slot);
  const isLive = state === "live";
  const isRecording = state === "past-recording";
  return (
    <div className={`flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors ${
      isLive ? "cursor-pointer bg-[#296cef] hover:bg-[#3b7dfd]" : isRecording ? "cursor-pointer bg-gray-hover hover:bg-[#ebebeb]" : "bg-gray-hover"
    }`}>
      <span className={`text-[16px] leading-[1.2] ${isLive ? "text-[#f5f5f5]" : "text-gray-light"}`}>
        {formatTime(slot.startTime)}
      </span>
      <SessionCTA slot={slot} isNext={isNext} />
    </div>
  );
}

// ─── Session row (chip variant) ──────────────────────────────────────────────

const SLOT_TIME_LABELS = ["9:00 AM", "7:00 PM"] as const;

function SessionRowChip({ session, index, isNext, preferredSlot }: { session: Session; index: number; isNext: boolean; preferredSlot: number }) {
  const [selectedSlot, setSelectedSlot] = useState(preferredSlot);
  // Sync when global preference changes
  useEffect(() => { setSelectedSlot(preferredSlot); }, [preferredSlot]);
  const slot = session.slots[selectedSlot];
  const state = getSessionState(slot);
  const isPast = state === "past-recording" || state === "past-pending";
  const isLive = state === "live";

  const dateLabel = `${formatShortDate(slot.startTime)} · ${session.duration}`;

  // CTA — desktop shows text, mobile shows icon only
  const cta = (() => {
    if (isLive) return (
      <a href={slot.joinUrl ?? "#"} className="flex items-center justify-center gap-2 rounded-lg bg-[#296cef] p-3.5 text-[16px] font-medium text-white transition-colors hover:bg-[#3b7dfd] sm:px-4 sm:py-3.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M14 8.5l4-2v7l-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline">Join</span>
      </a>
    );
    if (state === "past-recording") return (
      <a href={slot.recordingUrl} className="flex items-center justify-center gap-2 rounded-lg bg-gray-hover p-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb] sm:px-4 sm:py-3.5">
        <img src={playVideoIcon} alt="" className="h-[18px] w-[18px] shrink-0" />
        <span className="hidden sm:inline">Replay</span>
      </a>
    );
    if (state === "past-pending") return (
      <div className="group relative">
        <div className="flex cursor-default items-center justify-center gap-2 rounded-lg bg-gray-hover p-3.5 text-[16px] font-medium text-[#c0c0c0] sm:px-4 sm:py-3.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-spin sm:hidden">
            <path d="M10 2a8 8 0 1 0 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Processing</span>
        </div>
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-max max-w-[200px] rounded-lg bg-gray-dark px-3 py-2 text-[13px] leading-[1.3] text-white shadow-lg group-hover:block">
          Check back soon for the recording
        </div>
      </div>
    );
    if ((state === "soon" || state === "future") && isNext) return (
      <span className="text-right text-[16px] font-medium text-[#3b7dfd]">
        <span className="sm:hidden">{formatStartsIn(slot.startTime.getTime() - Date.now()).replace("Starts in ", "In ")}</span>
        <span className="hidden sm:inline">{formatStartsIn(slot.startTime.getTime() - Date.now())}</span>
      </span>
    );
    return null;
  })();

  const chips = (
    <div className="flex flex-wrap gap-2">
      {session.slots.map((s, i) => {
        const selected = i === selectedSlot;
        return (
          <button
            key={s.id}
            onClick={() => setSelectedSlot(i)}
            className={`rounded-full px-[14px] py-2 text-[14px] font-medium leading-[1.2] text-gray-dark transition-colors ${
              selected
                ? "border-2 border-gray-dark bg-white"
                : "border border-gray-stroke bg-white hover:bg-gray-hover"
            }`}
          >
            {SLOT_TIME_LABELS[i]}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="border-t border-[#e5e5e5] px-4 py-5 first:border-t-0 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-5">
      {/* Text + chips (mobile) + mobile CTA */}
      <div className="mb-3 flex items-start gap-4 sm:mb-0">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-light">
            Session {index}
          </p>
          <p className={`text-[16px] font-medium leading-[1.2] sm:text-[18px] ${isPast ? "text-gray-light" : "text-gray-dark"}`}>
            {session.title}
          </p>
          <p className="text-[14px] leading-[1.2] text-gray-light">{dateLabel}</p>
        </div>
        {/* CTA icon — mobile only */}
        <div className="shrink-0 sm:hidden">{cta}</div>
      </div>

      {/* Chips — mobile: below text; desktop: grid col 2 */}
      <div className="sm:hidden">{chips}</div>
      <div className="hidden sm:block">{chips}</div>

      {/* CTA — desktop only, grid col 3, fixed width so chips always align */}
      <div className="hidden sm:flex sm:w-28 sm:justify-end">{cta}</div>
    </div>
  );
}

// ─── Session row (simple variant) ────────────────────────────────────────────

function SessionRowSimple({ session, index, isNext }: { session: Session; index: number; isNext: boolean }) {
  return (
    <div className="border-t border-[#e5e5e5] first:border-t-0">
      {session.slots.map((slot, slotIndex) => {
        const state = getSessionState(slot);
        const isPast = state === "past-recording" || state === "past-pending";
        const isLive = state === "live";
        const timeLabel = SLOT_TIME_LABELS[slotIndex] ?? formatTime(slot.startTime);

        return (
          <Fragment key={slot.id}>
            {/* OR divider between the two slots */}
            {slotIndex === 1 && (
              <div className="flex items-center gap-3 px-4 sm:px-5">
                <div className="flex-1 border-t border-dashed border-gray-stroke" />
                <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#9b9b9b]">or</span>
                <div className="flex-1 border-t border-dashed border-gray-stroke" />
              </div>
            )}

            <div className={`flex items-center gap-4 px-4 sm:px-5 ${slotIndex === 0 ? "pt-4 pb-2 sm:pt-5 sm:pb-3" : "pt-2 pb-4 sm:pt-3 sm:pb-5"}`}>
              {/* Session number icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-stroke">
                <span className="text-[18px] font-medium leading-[1.2] text-gray-dark">{index}</span>
              </div>

              {/* Title + subtitle */}
              <div className="flex min-h-[48px] min-w-0 flex-1 flex-col justify-center gap-1">
                <p className={`text-[16px] font-medium leading-[1.2] ${isPast ? "text-gray-light" : "text-gray-dark"}`}>
                  {session.title}
                  <span className="font-normal text-gray-dark"> – {timeLabel}</span>
                </p>
                <p className="truncate text-[14px] leading-[1.2] text-gray-light">
                  {formatSlotDateTime(slot.startTime)}
                  <span className="text-[#9b9b9b]"> · {session.duration}</span>
                </p>
              </div>

              {/* CTA */}
              {isLive && (
                <a href={slot.joinUrl ?? "#"} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#296cef] p-3.5 text-[16px] font-medium text-white transition-colors hover:bg-[#3b7dfd] sm:w-28 sm:px-4 sm:py-3.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M14 8.5l4-2v7l-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="hidden sm:inline">Join</span>
                </a>
              )}
              {state === "past-recording" && (
                <a href={slot.recordingUrl} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-hover p-3.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb] sm:w-28 sm:px-4 sm:py-3.5">
                  <img src={playVideoIcon} alt="" className="h-[18px] w-[18px] shrink-0" />
                  <span className="hidden sm:inline">Replay</span>
                </a>
              )}
              {state === "past-pending" && (
                <div className="group relative">
                  <div className="flex shrink-0 cursor-default items-center justify-center gap-2 rounded-lg bg-gray-hover p-3.5 text-[16px] font-medium text-[#c0c0c0] sm:w-28 sm:px-4 sm:py-3.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-spin sm:hidden">
                      <path d="M10 2a8 8 0 1 0 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="hidden sm:inline">Processing</span>
                  </div>
                  <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-max max-w-[200px] rounded-lg bg-gray-dark px-3 py-2 text-[13px] leading-[1.3] text-white shadow-lg group-hover:block">
                    Check back soon for the recording
                  </div>
                </div>
              )}
              {(state === "soon" || state === "future") && isNext && (
                <span className="shrink-0 text-[16px] font-medium text-[#3b7dfd]">
                  <span className="sm:hidden">{formatStartsIn(slot.startTime.getTime() - Date.now()).replace("Starts in ", "In ")}</span>
                  <span className="hidden sm:inline">{formatStartsIn(slot.startTime.getTime() - Date.now())}</span>
                </span>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ─── Session row ──────────────────────────────────────────────────────────────

function SessionRow({ session, isNext }: { session: Session; isNext: boolean }) {
  const isPast = session.slots.every((slot) => {
    const st = getSessionState(slot);
    return st === "past-recording" || st === "past-pending";
  });
  const cal = getCalendarInfo(session.slots[0].startTime);

  return (
    <div className="border-t border-[#e6e6e6] first:border-t-0">
      {/* Title row */}
      <div className="flex gap-4 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
        <div className="w-8 shrink-0 text-center">
          <p className="text-[14px] font-medium uppercase leading-[1.2] tracking-[1.4px] text-gray-light">{cal.day}</p>
          <p className={`text-[20px] font-medium leading-[1.2] ${isPast ? "text-gray-light" : "text-gray-dark"}`}>{cal.date}</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 justify-center">
          <p className={`text-[18px] font-medium leading-[1.2] ${isPast ? "text-gray-light" : "text-gray-dark"}`}>
            {session.title}
          </p>
          <p className="text-[14px] text-gray-light">{formatShortDate(session.slots[0].startTime)} · {session.duration}</p>
        </div>
      </div>

      {/* Slots row */}
      <div className="flex items-stretch px-4 pb-4 sm:px-5 sm:pb-5">
        {/* OR column — aligns with date column above */}
        <div className="flex w-12 shrink-0 flex-col items-end pr-2">
          <div className="flex-1 border-r border-dashed border-gray-stroke" />
          <span className="py-1 text-[14px] font-medium uppercase leading-[1.2] tracking-[1.4px] text-[#9b9b9b]">or</span>
          <div className="flex-1 border-r border-dashed border-gray-stroke" />
        </div>
        {/* Two slot rows stacked */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <SlotOption slot={session.slots[0]} isNext={isNext} />
          <SlotOption slot={session.slots[1]} isNext={isNext} />
        </div>
      </div>
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
                      <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[12px] font-medium text-[#92400E]">
                        {cohort.urgencyTag}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { onSelect(); onClose(); }}
                    className="shrink-0 rounded-lg bg-gray-dark px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#444444]"
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

function LiveCourseCard({ course }: { course: LiveCourse }) {
  const { simpleSessionLayout, chipSessionLayout } = useSessionLayout();
  const isCompleted = course.sessions.length > 0 && course.sessions.every((s) =>
    s.slots.every((slot) => {
      const st = getSessionState(slot);
      return st === "past-recording" || st === "past-pending";
    })
  );
  const nextSession = course.sessions.find((s) =>
    s.slots.some((slot) => {
      const st = getSessionState(slot);
      return st === "live" || st === "soon" || st === "future";
    })
  );
  const [sessionsOpen, setSessionsOpen] = useState(!isCompleted);
  const [preferredSlot, setPreferredSlot] = useState(0);
  const [cohortSelected, setCohortSelected] = useState(course.cohortSelected ?? true);
  const [cohortModalOpen, setCohortModalOpen] = useState(false);

  const actionButtons = cohortSelected ? (
    <>
      <ActionButton
        icon={
          <div className="relative h-5 w-5 shrink-0 overflow-hidden">
            <div className="absolute inset-[18.75%_16.67%]">
              <div className="absolute inset-[-6%_-5.63%]">
                <img alt="" className="block max-w-none size-full" src={figmaSyllabusIcon} />
              </div>
            </div>
          </div>
        }
        label="Syllabus"
      />
      <ActionButton
        icon={
          <div className="relative h-5 w-5 shrink-0">
            <img alt="" className="absolute block max-w-none size-full" src={figmaPlayIcon} />
          </div>
        }
        label="Recordings"
      />
      <ActionButton icon={<SlackIcon />} label="Group Slack" />
    </>
  ) : (
    <button
      onClick={() => setCohortModalOpen(true)}
      className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-dark px-3 py-2 text-[16px] font-medium text-white transition-colors hover:bg-[#444444]"
    >
      Select cohort
    </button>
  );

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-stroke ${isCompleted ? "opacity-75" : ""}`}>

      {/* Zone 1: Header */}
      <div className="flex flex-col gap-5 bg-white p-4 sm:p-5 md:flex-row md:items-center md:gap-5">
        {/* <428px: stacked. 428px+: side-by-side. md+: contents (desktop flex children). */}
        <div className="flex flex-col gap-3 min-[428px]:flex-row min-[428px]:items-start md:contents">
          {/* Thumbnail */}
          <img
            src={course.image}
            alt=""
            className="h-auto w-[122px] shrink-0 rounded-lg object-cover min-[428px]:h-16 md:h-[100px] md:w-[190px]"
          />
          {/* Title group (mobile/tablet: inline with image) */}
          <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-[1_0_0] md:gap-4">
            <div>
              <p className="text-[14px] font-medium uppercase tracking-[1.4px] text-gray-light">Live cohort</p>
              <p className="mt-1 text-[20px] font-medium leading-[1.2] text-gray-dark min-[428px]:text-[24px]">{course.title}</p>
            </div>
            {/* Buttons: desktop only (inside content column) */}
            <div className="hidden flex-wrap gap-2 md:flex">{actionButtons}</div>
          </div>
        </div>
        {/* Buttons: mobile/tablet only (full-width row below image+title) */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5 md:hidden">{actionButtons}</div>
      </div>

      {/* Zone 3: Sessions accordion toggle (cohort-selected only) */}
      {cohortSelected && <button
        onClick={() => setSessionsOpen(!sessionsOpen)}
        className="flex w-full cursor-pointer items-center gap-3 border-t border-gray-stroke bg-white px-4 py-3 sm:px-5"
      >
        <span className="flex-1 text-left text-[16px] font-medium text-gray-dark">
          {course.sessions.length} Sessions
          <span className="ml-2 font-normal text-gray-light">{course.cohortDates}</span>
          {!isCompleted && !chipSessionLayout && <a href="#" onClick={(e) => e.stopPropagation()} className="ml-3 font-normal text-gray-light underline">Add all to calendar</a>}
        </span>
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          className={`shrink-0 text-[#9b9b9b] transition-transform ${sessionsOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>}

      {/* Sessions list */}
      {cohortSelected && sessionsOpen && (
        <div className="bg-white">
          {chipSessionLayout
            ? <>
                {/* Preferred time row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#e5e5e5] px-4 pb-4 pt-0 sm:flex-nowrap sm:px-5">
                  <span className="shrink-0 text-[14px] leading-[1.3] text-gray-light">Preferred<br />time</span>
                  <div className="flex gap-2">
                    {([0, 1] as const).map((i) => (
                      <button
                        key={i}
                        onClick={() => setPreferredSlot(i)}
                        className={`rounded-full px-[14px] py-2 text-[14px] font-medium leading-[1.2] text-gray-dark transition-colors ${
                          preferredSlot === i
                            ? "border-2 border-gray-dark bg-white"
                            : "border border-gray-stroke bg-white hover:bg-gray-hover"
                        }`}
                      >
                        {SLOT_TIME_LABELS[i]}
                      </button>
                    ))}
                  </div>
                  {!isCompleted && (
                    <a href="#" className="w-full text-[14px] font-normal text-gray-light underline sm:ml-auto sm:w-auto">Add all to calendar</a>
                  )}
                </div>
                {course.sessions.map((session, i) => (
                  <SessionRowChip key={session.id} session={session} index={i + 1} isNext={session.id === nextSession?.id} preferredSlot={preferredSlot} />
                ))}
              </>
            : simpleSessionLayout
            ? course.sessions.map((session, i) => (
                <SessionRowSimple key={session.id} session={session} index={i + 1} isNext={session.id === nextSession?.id} />
              ))
            : course.sessions.map((session) => (
                <SessionRow key={session.id} session={session} isNext={session.id === nextSession?.id} />
              ))
          }
        </div>
      )}

      <SelectCohortModal
        open={cohortModalOpen}
        onClose={() => setCohortModalOpen(false)}
        onSelect={() => setCohortSelected(true)}
      />
    </div>
  );
}

// ─── Self-paced card ──────────────────────────────────────────────────────────

function SelfPacedCourseCard({ course }: { course: SelfPacedCourse }) {
  const isCompleted = course.percentComplete >= 100;
  const isNotStarted = course.percentComplete === 0;
  return (
    <div className="flex gap-5 border-b border-gray-stroke/50 py-6">
      <div className="w-1/2 shrink-0 md:w-[220px]">
        <img
          src={course.image}
          alt=""
          className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-2">
          <img src={playIcon} alt="" className="h-[20px] w-[20px] shrink-0" />
          <span className="text-[14px] text-[#707070]">Self-paced</span>
        </div>
        <h3 className="mt-1 text-[18px] font-medium leading-[1.2] text-gray-dark">{course.title}</h3>
        <div className="mt-3 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[14px] text-[#707070]">{course.percentComplete}% complete</p>
              <p className="text-[14px] text-[#9B9B9B]">{course.totalTime}</p>
            </div>
            <div className="h-[6px] w-full rounded-full bg-[#E5E5E5]">
              <div className="h-full rounded-full bg-[#038561] transition-all" style={{ width: `${course.percentComplete}%` }} />
            </div>
          </div>
          {isCompleted ? (
            <button className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white md:flex">
              View
            </button>
          ) : (
            <button className="hidden shrink-0 cursor-pointer rounded-lg bg-[#038561] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#038561]/90 md:block">
              {isNotStarted ? "Start" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Suggested course card ────────────────────────────────────────────────────

function SuggestedCourseCard({ course }: { course: (typeof suggestedCourses)[0] }) {
  return (
    <div className="group flex cursor-pointer items-center gap-4">
      {/* Thumbnail: 122×64 fixed */}
      <div className="h-16 w-[122px] shrink-0 overflow-hidden rounded-lg">
        <img src={course.image} alt="" className="h-full w-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Title */}
        <p className="overflow-hidden text-ellipsis text-[16px] font-medium leading-[1.2] text-gray-dark transition-opacity group-hover:opacity-70" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {course.title}
        </p>
        {/* Icon + type · duration */}
        <div className="flex items-center gap-1.5">
          {course.type === "Self-paced" ? (
            <img src={playVideoIcon} alt="" className="h-[18px] w-[18px] shrink-0 opacity-50" />
          ) : (
            <div className="flex items-center pr-1.5">
              {[pic1, pic2, pic3].map((avatar, i) => (
                <div key={i} className="-mr-1.5 h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full border border-white">
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[1.2] text-[#707070]">
            {course.type} · {course.duration}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Variant = "stacked" | "simple" | "chip";

export default function MyCourses() {
  const { setSimpleSessionLayout, setChipSessionLayout } = useSessionLayout();
  const [variant, setVariant] = useState<Variant>("stacked");

  function applyVariant(v: Variant) {
    setVariant(v);
    setSimpleSessionLayout(v === "simple");
    setChipSessionLayout(v === "chip");
  }

  const suggestedCoursesSection = (
    <>
      <NavLink
        to="/browse"
        className="flex items-center gap-1.5 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80"
      >
        Suggested courses
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </NavLink>
      <div className="mt-4 flex flex-col gap-5">
        {suggestedCourses.map((course, i) => <SuggestedCourseCard key={i} course={course} />)}
      </div>
    </>
  );

  return (
    <PageShell rightSidebar={suggestedCoursesSection}>
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-medium leading-[1.1] text-gray-dark md:text-[40px]">My Courses</h1>
        <div className="flex rounded-lg border border-gray-stroke/50 bg-gray-hover p-0.5 text-[14px] font-medium">
          {(["stacked", "simple", "chip"] as Variant[]).map((v) => (
            <button
              key={v}
              onClick={() => applyVariant(v)}
              className={`cursor-pointer rounded-md px-3 py-1.5 capitalize transition-colors ${
                variant === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#707070] hover:text-gray-dark"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Live cohort cards */}
      <div className="mt-8 flex flex-col gap-8">
        {enrolledCourses
          .filter((c) => c.type === "live")
          .map((course) => <LiveCourseCard key={course.id} course={course as LiveCourse} />)}
      </div>

      {/* Self-paced courses */}
      {enrolledCourses.some((c) => c.type === "selfPaced") && (
        <div className={`border-t border-gray-stroke/50 ${enrolledCourses.some((c) => c.type === "live") ? "mt-8" : "mt-0"}`}>
          <p className="pt-8 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">Self-paced</p>
          {enrolledCourses
            .filter((c) => c.type === "selfPaced")
            .map((course) => <SelfPacedCourseCard key={course.id} course={course as SelfPacedCourse} />)}
        </div>
      )}
    </PageShell>
  );
}
