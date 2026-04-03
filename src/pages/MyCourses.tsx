import { NavLink } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import playIcon from "../assets/icons/play.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";

// ─── Figma icon assets ────────────────────────────────────────────────────────
const figmaSyllabusIcon = "https://www.figma.com/api/mcp/asset/6eb7cc2d-90b9-49e5-9d0b-541c668a79f0";
const figmaPlayIcon = "https://www.figma.com/api/mcp/asset/dab3b9c4-442a-4fe1-b04e-5026b09d9843";
const figmaSlack1 = "https://www.figma.com/api/mcp/asset/c66c77e8-363b-4742-87f2-1fb9b18416c0";
const figmaSlack2 = "https://www.figma.com/api/mcp/asset/9453f0d5-c53a-4128-b604-1ff16db95a9f";
const figmaSlack3 = "https://www.figma.com/api/mcp/asset/a51db8bb-c981-4b77-a5dc-761d347a7019";
const figmaSlack4 = "https://www.figma.com/api/mcp/asset/d6fb8824-812f-4b5c-8d90-5b56cb53286a";
const figmaVideoIcon = "https://www.figma.com/api/mcp/asset/38cad94b-b535-4e09-9a67-a935b180f7ed";

// ─── Data ────────────────────────────────────────────────────────────────────

type Session = {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: string;
  recordingUrl?: string;
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
  instructor: { name: string; avatar: string };
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

function getSessionState(session: Session): SessionState {
  const now = new Date();
  if (session.endTime < now) return session.recordingUrl ? "past-recording" : "past-pending";
  if (session.startTime.getTime() - now.getTime() <= 30 * 60 * 1000) return "live";
  if (session.startTime.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) return "soon";
  return "future";
}

function sortKey(course: EnrolledCourse): number {
  if (course.type === "live") {
    const next = course.sessions.find((s) => {
      const st = getSessionState(s);
      return st === "live" || st === "soon" || st === "future";
    });
    if (next) return next.startTime.getTime();
    return Number.MAX_SAFE_INTEGER;
  }
  if (course.percentComplete >= 100) return Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER / 2;
}

const liveNow = new Date(Date.now() + 15 * 60 * 1000);
const liveEnd = new Date(Date.now() + 105 * 60 * 1000);

const enrolledCourses: EnrolledCourse[] = ([
  {
    type: "live" as const,
    id: 1,
    title: "MBA Admissions Strategy Bootcamp",
    cohortDateLabel: "Spring admissions",
    cohortDates: "Mar 12 – Apr 23, 2026",
    registrants: [pic1, pic3, pic4],
    image: event1,
    instructor: { name: "Sarah Chen", avatar: pic2 },
    sessions: [
      { id: 101, title: "Introduction & Goal Setting", duration: "90 min", startTime: new Date("2026-03-12T17:00:00"), endTime: new Date("2026-03-12T18:30:00"), recordingUrl: "#" },
      { id: 102, title: "School Selection Strategy", duration: "90 min", startTime: new Date("2026-03-19T17:00:00"), endTime: new Date("2026-03-19T18:30:00") },
      { id: 103, title: "Crafting Your Story", duration: "90 min", startTime: new Date("2026-03-26T17:00:00"), endTime: new Date("2026-03-26T18:30:00"), recordingUrl: "#" },
      { id: 104, title: "Building Your Narrative", duration: "90 min", startTime: liveNow, endTime: liveEnd },
      { id: 105, title: "Essays & Short Answers", duration: "90 min", startTime: new Date("2026-04-09T17:00:00"), endTime: new Date("2026-04-09T18:30:00") },
      { id: 106, title: "Final Q&A & Wrap-Up", duration: "60 min", startTime: new Date("2026-04-23T17:00:00"), endTime: new Date("2026-04-23T18:00:00") },
    ],
  },
  {
    type: "live" as const,
    id: 2,
    title: "GMAT Exam Prep Bootcamp",
    cohortDateLabel: "Fall admissions",
    cohortDates: "Apr 7 – May 19, 2026",
    registrants: [pic5, pic6, pic3],
    image: event2,
    instructor: { name: "James Park", avatar: pic7 },
    sessions: [
      { id: 201, title: "Quantitative Reasoning Foundations", duration: "60 min", startTime: new Date("2026-04-07T16:00:00"), endTime: new Date("2026-04-07T17:00:00") },
      { id: 202, title: "Verbal Reasoning Deep Dive", duration: "60 min", startTime: new Date("2026-04-14T16:00:00"), endTime: new Date("2026-04-14T17:00:00") },
      { id: 203, title: "Data Insights & Problem Solving", duration: "60 min", startTime: new Date("2026-04-21T16:00:00"), endTime: new Date("2026-04-21T17:00:00") },
      { id: 204, title: "Practice Test Review", duration: "60 min", startTime: new Date("2026-04-28T16:00:00"), endTime: new Date("2026-04-28T17:00:00") },
      { id: 205, title: "Timing & Test Strategy", duration: "60 min", startTime: new Date("2026-05-05T16:00:00"), endTime: new Date("2026-05-05T17:00:00") },
      { id: 206, title: "Final Mock Exam & Debrief", duration: "90 min", startTime: new Date("2026-05-12T16:00:00"), endTime: new Date("2026-05-12T17:30:00") },
      { id: 207, title: "Score Submission Strategy", duration: "60 min", startTime: new Date("2026-05-19T16:00:00"), endTime: new Date("2026-05-19T17:00:00") },
    ],
  },
  {
    type: "live" as const,
    id: 5,
    title: "Tech PM Interview Accelerator",
    cohortDateLabel: "Winter cohort",
    cohortDates: "Jan 6 – Feb 3, 2026",
    registrants: [pic4, pic1, pic6],
    image: eventImage,
    instructor: { name: "Maria Torres", avatar: pic5 },
    sessions: [
      { id: 501, title: "PM Fundamentals", duration: "60 min", startTime: new Date("2026-01-06T17:00:00"), endTime: new Date("2026-01-06T18:00:00"), recordingUrl: "#" },
      { id: 502, title: "Product Sense & Design", duration: "60 min", startTime: new Date("2026-01-13T17:00:00"), endTime: new Date("2026-01-13T18:00:00"), recordingUrl: "#" },
      { id: 503, title: "Metrics & Analytical Questions", duration: "60 min", startTime: new Date("2026-01-20T17:00:00"), endTime: new Date("2026-01-20T18:00:00"), recordingUrl: "#" },
      { id: 504, title: "Behavioral & Leadership", duration: "60 min", startTime: new Date("2026-01-27T17:00:00"), endTime: new Date("2026-01-27T18:00:00"), recordingUrl: "#" },
      { id: 505, title: "Mock Interviews & Debrief", duration: "90 min", startTime: new Date("2026-02-03T17:00:00"), endTime: new Date("2026-02-03T18:30:00"), recordingUrl: "#" },
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

function formatSessionDateTime(date: Date): string {
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateStr} at ${timeStr}`;
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

function SessionCTA({ session }: { session: Session }) {
  const state = getSessionState(session);

  if (state === "live") {
    return (
      <button className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-black px-3 py-2 text-[16px] font-medium text-white transition-colors hover:bg-[#222]">
        <div className="relative h-5 w-5 shrink-0 overflow-hidden">
          <div className="absolute inset-[26.04%_12.5%]">
            <div className="absolute inset-[-7.83%_-5%]">
              <img alt="" className="block max-w-none size-full" src={figmaVideoIcon} />
            </div>
          </div>
        </div>
        Join
      </button>
    );
  }
  if (state === "past-recording") {
    return (
      <button className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-gray-hover px-3 py-2 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb]">
        <div className="relative h-5 w-5 shrink-0">
          <div className="absolute inset-0">
            <img alt="" className="absolute block max-w-none size-full" src={figmaPlayIcon} />
          </div>
        </div>
        Recording
      </button>
    );
  }
  if (state === "past-pending") {
    return <span className="shrink-0 text-[16px] font-medium text-[#9b9b9b]">Check back soon</span>;
  }
  if (state === "soon") {
    return (
      <span className="shrink-0 text-[16px] font-medium text-[#3b7dfd]">
        {formatStartsIn(session.startTime.getTime() - Date.now())}
      </span>
    );
  }
  return null;
}

// ─── Session row ──────────────────────────────────────────────────────────────

function SessionRow({ session }: { session: Session }) {
  const state = getSessionState(session);
  const isPast = state === "past-recording" || state === "past-pending";
  const cal = getCalendarInfo(session.startTime);

  return (
    <div className="flex gap-4 border-b border-[#e6e6e6] py-4 last:border-b-0">
      {/* Mini calendar */}
      <div className="w-[47px] shrink-0 overflow-hidden rounded-lg border border-gray-stroke">
        <div className="flex items-center justify-center bg-gray-hover px-2.5 py-0.5">
          <span className="text-[12px] font-medium uppercase tracking-[1.2px] text-gray-dark">{cal.day}</span>
        </div>
        <div className="flex items-center justify-center bg-white px-2 py-1">
          <span className="text-[18px] font-medium leading-[1.2] text-gray-dark">{cal.date}</span>
        </div>
      </div>

      {/* Content + CTA */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[18px] font-medium leading-[1.2] ${isPast ? "text-gray-light" : "text-gray-dark"}`}>
            {session.title}
          </p>
          <p className="mt-0.5 text-[16px] text-gray-light">
            {formatSessionDateTime(session.startTime)}
            <span className="text-[#9b9b9b]"> · {session.duration}</span>
          </p>
        </div>
        <SessionCTA session={session} />
      </div>
    </div>
  );
}

// ─── Live course card ─────────────────────────────────────────────────────────

function LiveCourseCard({ course }: { course: LiveCourse }) {
  const isCompleted = course.sessions.every((s) => {
    const st = getSessionState(s);
    return st === "past-recording" || st === "past-pending";
  });
  const [sessionsOpen, setSessionsOpen] = useState(!isCompleted);

  const actionButtons = (
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

      {/* Zone 2: Metadata strip */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-gray-stroke bg-white px-4 pb-4 scroll-pr-4 sm:px-5 sm:pb-5 sm:scroll-pr-5">
        {/* Instructors */}
        <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2">
          <span className="text-[16px] font-medium leading-[1.2] text-gray-light">Instructors:</span>
          <a href="#" className="text-[16px] leading-[1.2] text-gray-light underline-offset-2 hover:underline">{course.instructor.name}</a>
        </div>
        {/* Divider */}
        <div className="w-px self-stretch bg-gray-stroke" />
        {/* Dates */}
        <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2">
          <span className="text-[16px] font-medium leading-[1.2] text-gray-light">{course.cohortDateLabel}:</span>
          <span className="text-[16px] leading-[1.2] text-gray-light">{course.cohortDates}</span>
        </div>
      </div>

      {/* Zone 3: Sessions accordion toggle */}
      <button
        onClick={() => setSessionsOpen(!sessionsOpen)}
        className="flex w-full cursor-pointer items-center gap-3 bg-white px-4 py-3 sm:px-5"
      >
        <span className="flex-1 text-left text-[16px] font-medium text-gray-dark">
          {course.sessions.length} Sessions
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
        <div className="bg-white px-4 sm:px-5">
          {course.sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
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
      {/* Thumbnail: 143×75 fixed, rounded-lg */}
      <div className="h-[75px] w-[143px] shrink-0 overflow-hidden rounded-lg">
        <img src={course.image} alt="" className="h-full w-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Eyebrow */}
        <p className="text-[12px] font-medium uppercase leading-[1.2] tracking-[1.2px] text-[#707070]">
          {course.type}
        </p>
        {/* Title */}
        <p className="overflow-hidden text-ellipsis text-[16px] font-medium leading-[1.2] text-gray-dark transition-opacity group-hover:opacity-70" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {course.title}
        </p>
        {/* Avatars + metadata */}
        <div className="flex flex-wrap items-center gap-1.5">
          {course.enrolledCount && (
            <>
              {/* Stacked mini-avatars */}
              <div className="flex items-center pr-1.5">
                {[pic1, pic2, pic3].map((avatar, i) => (
                  <div key={i} className="-mr-1.5 h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full border border-white">
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[14px] leading-[1.2] text-[#707070]">{course.enrolledCount}</span>
              <span className="text-[14px] leading-[1.2] text-[#707070]">·</span>
            </>
          )}
          <span className="text-[14px] leading-[1.2] text-[#707070]">{course.duration}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Filter = "all" | "live" | "selfPaced";

export default function MyCourses() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleCourses = filter === "all"
    ? enrolledCourses
    : enrolledCourses.filter((c) => c.type === (filter === "live" ? "live" : "selfPaced"));

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
          {(["all", "live", "selfPaced"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${
                filter === f ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#707070] hover:text-gray-dark"
              }`}
            >
              {f === "all" ? "All" : f === "live" ? "Live" : "Self-paced"}
            </button>
          ))}
        </div>
      </div>

      {/* Live cohort cards */}
      <div className="mt-8 flex flex-col gap-8">
        {visibleCourses
          .filter((c) => c.type === "live")
          .map((course) => <LiveCourseCard key={course.id} course={course as LiveCourse} />)}
      </div>

      {/* Self-paced courses */}
      {visibleCourses.some((c) => c.type === "selfPaced") && (
        <div className={`border-t border-gray-stroke/50 ${visibleCourses.some((c) => c.type === "live") ? "mt-8" : "mt-0"}`}>
          {visibleCourses
            .filter((c) => c.type === "selfPaced")
            .map((course) => <SelfPacedCourseCard key={course.id} course={course as SelfPacedCourse} />)}
        </div>
      )}
    </PageShell>
  );
}
