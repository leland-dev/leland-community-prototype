import { useState, useEffect } from "react";
import { Button, LinkButton } from "../components/Button";
import { Banner } from "../components/Banner";
import { ToggleChip } from "../components/ToggleChip";
import PageShell from "../components/PageShell";
import slackIcon from "../assets/icons/slack-black.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import toolsWrenchRulerIcon from "../assets/icons/tools-wrench-ruler.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import calendarUpcomingIcon from "../assets/icons/calendar-upcoming.svg";
import shareArrowIcon from "../assets/icons/share-arrow.svg";
import giftIcon from "../assets/icons/gift.svg";
import playVideoIcon from "../assets/icons/play-video.svg";
import event1 from "../assets/placeholder images/ai-builder-course.avif";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeSlot = {
  id: number;
  time: string;
  recordingUrl?: string;
};

type SessionMaterial = {
  label: string;
  url: string;
};

type CourseSession = {
  id: number;
  number: number;
  title: string;
  description: string;
  date: string;
  dayOfWeek: string;
  duration: string;
  timeSlots: TimeSlot[];
  status: "completed" | "next" | "upcoming";
  materials: SessionMaterial[];
  startsIn?: string;
};

type CourseResource = {
  label: string;
  icon: "slack" | "clock" | "tool" | "recording" | "gift" | "calendar";
  url: string;
  secondary?: boolean;
};

type CourseData = {
  title: string;
  cohortLabel: string;
  cohortDates: string;
  sessionCount: number;
  image: string;
  resources: CourseResource[];
  sessions: CourseSession[];
};

// ─── Mock data ───────────────────────────────────────────────────────────────

const mockCourse: CourseData = {
  title: "AI Builder Program Level 1: Use AI to 10x Your Impact",
  cohortLabel: "Cohort 3",
  cohortDates: "Apr 21 – May 8, 2026",
  sessionCount: 6,
  image: event1,
  resources: [
    { label: "Office hours", icon: "clock", url: "https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours?month=2026-05" },
    { label: "Recordings", icon: "recording", url: "https://www.joinleland.com/content/course/urn:course:69d937e10ef66901f15b0902/urn:contentEntry:69e7f8cdcaf10f4eec4940b4" },
    { label: "Slack community", icon: "slack", url: "https://d2fhrl04.na1.hubspotlinks.com/Ctc/UC+113/d2FHRl04/VXc0jX387Xr0N8MJ5mZVMfPKW76My975MX86-N8JCsF23m2nnW7Y8-PT6lZ3kzW79xkfq8jRrQxW2m-6Vs2_6GcMW3t1SkY84ng-4W7j53hc2H4KQ1W4MCrlt7F60D9W7FWYxr539-p0W8VHrTz2drHTLW4v0fV83YbJdTW2dsd7K9jLLd-W3rgjsV3n3hh1W2rBg4f5gjJPZW5m3HQ-3HmFbFW2DKMr-1hxzN7W2DWVHb4bSdrqW8tSF0N6Y39GnW3L1xR83vv7wHW982-rn41KZkXW1MD0nt5KRB7VW77W2NM8b8ldZW1Y2hkj2HHtD-W7hwmss61SslSW8_8BZ63CgmcVW6LKq_j2kyXHKW3TrYvt6lCh8vVTJNFh8kTCFmW5Vmz1_4XBDx3f3MfD_q04" },
    { label: "Join a build session", icon: "calendar", url: "#" },
  ],
  sessions: [
    {
      id: 1, number: 1, title: "Build a Real Product with World-Class Design", duration: "90 min", description: "Create a new product in 90 minutes, without writing a line of code, using a design system that you love.", date: "Apr 21", dayOfWeek: "Tue", status: "completed", startsIn: "3 days",
      timeSlots: [
        { id: 10, time: "11:00 AM", recordingUrl: "#" },
        { id: 11, time: "4:00 PM", recordingUrl: "#" },
      ],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 2, number: 2, title: "Automate Communication in Your Voice", duration: "90 min", description: "Connect your communication tools, teach AI how you write, and set it up to manage your inbox.", date: "Apr 24", dayOfWeek: "Fri", status: "completed",
      timeSlots: [
        { id: 20, time: "11:00 AM", recordingUrl: "#" },
        { id: 21, time: "4:00 PM", recordingUrl: "#" },
      ],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 3, number: 3, title: "Design Presentations That Build Themselves", duration: "90 min", description: "Go from research question to polished, animated slide deck in a single session.", date: "Apr 28", dayOfWeek: "Tue", status: "next",
      timeSlots: [
        { id: 30, time: "11:00 AM", recordingUrl: "#" },
        { id: 31, time: "4:00 PM", recordingUrl: "#" },
      ],
      materials: [
        { label: "Session prep", url: "#" },
        { label: "Session guide", url: "#" },
      ],
    },
    {
      id: 4, number: 4, title: "Analyze and Visualize Data Without Writing Formulas", duration: "90 min", description: "Go from data and spreadsheets to dashboards and insights in minutes.", date: "May 1", dayOfWeek: "Fri", status: "upcoming",
      timeSlots: [{ id: 40, time: "11:00 AM", recordingUrl: "#" }, { id: 41, time: "4:00 PM", recordingUrl: "#" }],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 5, number: 5, title: "Build Custom Workflows That Run While You Sleep", duration: "90 min", description: "Set up automations that run on a schedule, connect your tools, and get things done whether you're at your desk or not.", date: "May 5", dayOfWeek: "Tue", status: "upcoming",
      timeSlots: [{ id: 50, time: "11:00 AM", recordingUrl: "#" }, { id: 51, time: "4:00 PM", recordingUrl: "#" }],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 6, number: 6, title: "Launch Your AI System + Demo Day", duration: "90 min", description: "Cross the finish line with a live, working AI system and show the cohort what you built.", date: "May 8", dayOfWeek: "Fri", status: "upcoming",
      timeSlots: [{ id: 60, time: "11:00 AM", recordingUrl: "#" }, { id: 61, time: "4:00 PM", recordingUrl: "#" }],
      materials: [{ label: "Session guide", url: "#" }],
    },
  ],
};

// ─── Icons ───────────────────────────────────────────────────────────────────

function ResourceIcon({ type, bare }: { type: CourseResource["icon"]; bare?: boolean }) {
  const wrap = "flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-gray-hover";
  const iconMap: Record<CourseResource["icon"], string> = {
    slack: slackIcon,
    clock: orderHistoryIcon,
    tool: toolsWrenchRulerIcon,
    recording: playVideoIcon,
    gift: giftIcon,
    calendar: calendarUpcomingIcon,
  };
  const src = iconMap[type];
  if (bare) return <img src={src} alt="" className="h-4 w-4 shrink-0 opacity-60" />;
  return <span className={wrap}><img src={src} alt="" className="h-5 w-5" /></span>;
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9V5H15" />
      <path d="M13 11L19 5" />
      <path d="M20 13V15C20 16.3261 19.4732 17.5979 18.5355 18.5355C17.5979 19.4732 16.3261 20 15 20H9C7.67392 20 6.40215 19.4732 5.46447 18.5355C4.52678 17.5979 4 16.3261 4 15V9C4 7.67392 4.52678 6.40215 5.46447 5.46447C6.40215 4.52678 7.67392 4 9 4H11" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path fillRule="evenodd" clipRule="evenodd" d="M17.5 10V10C17.5 14.1425 14.1425 17.5 10 17.5V17.5C5.8575 17.5 2.5 14.1425 2.5 10V10C2.5 5.8575 5.8575 2.5 10 2.5V2.5C14.1425 2.5 17.5 5.8575 17.5 10Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.11753 7.549L12.3525 9.46234C12.7617 9.704 12.7617 10.2965 12.3525 10.5382L9.11753 12.4515C8.70086 12.6982 8.17419 12.3973 8.17419 11.9132V8.08734C8.17419 7.60317 8.70086 7.30234 9.11753 7.549V7.549Z" />
    </svg>
  );
}


function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 7.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InlineChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="inline-block shrink-0 translate-y-[-1px] align-middle text-gray-light" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 5l5 5-5 5" />
    </svg>
  );
}

function DismissButton({ onDismiss, asCheckbox }: { onDismiss: () => void; asCheckbox?: boolean }) {
  if (asCheckbox) {
    return (
      <label className="mr-4 flex shrink-0 cursor-pointer items-center self-center">
        <input
          type="checkbox"
          className="peer sr-only"
          onChange={(e) => { if (e.target.checked) { setTimeout(onDismiss, 300); } }}
        />
        <span className="flex h-5 w-5 items-center justify-center rounded border-[1.5px] border-gray-300 transition-colors peer-checked:border-[#038561] peer-checked:bg-[#038561]">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l3 3 5-5" />
          </svg>
        </span>
      </label>
    );
  }
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(); }}
      className="group ml-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center self-center rounded-full text-gray-xlight transition-colors hover:bg-gray-hover hover:text-gray-dark"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

// ─── Session row ─────────────────────────────────────────────────────────────

function SessionRow({ session, showSessionRecordings, multipleSessionTimes, isLast, allCompleted, forceStatus, sessionMaterial, markedComplete, onMarkComplete, disabled, startingSoon }: { session: CourseSession; showSessionRecordings: boolean; multipleSessionTimes: boolean; isLast: boolean; allCompleted: boolean; forceStatus?: "next" | "upcoming"; sessionMaterial: "homework" | "session-guide"; markedComplete?: boolean; onMarkComplete?: () => void; disabled?: boolean; startingSoon?: boolean }) {
  const isCompleted = (allCompleted || !!markedComplete) && !forceStatus;
  const isNext = (session.status === "next" && !allCompleted && !markedComplete && !forceStatus) || forceStatus === "next";
  const [recordingsOpen, setRecordingsOpen] = useState(false);
  const recordingSlots = session.timeSlots.filter((s) => s.recordingUrl);
  const hasRecordings = (isCompleted || session.status === "completed") && !forceStatus && !session.startsIn && recordingSlots.length > 0 && showSessionRecordings;
  const rowMaterials = session.materials.filter((m) => m.label !== "Session prep");
  const hasLinks = rowMaterials.length > 0 || hasRecordings;

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Left column: indicator + dotted connector */}
      <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
        <button
          onClick={(e) => { e.stopPropagation(); onMarkComplete?.(); }}
          disabled={disabled}
          className={`group mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] transition-colors ${disabled ? "cursor-not-allowed border-[1.5px] border-gray-stroke bg-gray-hover opacity-50" : isCompleted ? "bg-[#038561] hover:bg-[#038561]/80 cursor-pointer" : "border-[1.5px] border-gray-stroke bg-white hover:border-[#038561]/40 cursor-pointer"}`}
        >
          {!disabled && isCompleted ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7l3 3 6-6" />
            </svg>
          ) : (
            !disabled && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 transition-opacity group-hover:opacity-100 text-gray-stroke">
              <path d="M2.5 7l3 3 6-6" />
            </svg>
          )}
        </button>
        {!isLast && (
          <div className={`mt-1.5 w-0 flex-1 border-l-[1.5px] border-dashed ${isCompleted ? "border-[#038561]" : "border-gray-stroke"}`} />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1" onClick={() => { if (!isCompleted) onMarkComplete?.(); }}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">
            {session.number}. {session.title}
          </p>
          {session.duration && <p className="shrink-0 leading-[1.2] text-gray-xlight">{session.duration}</p>}
        </div>
        <p className="mt-1 leading-[1.2] text-gray-light">
          {isNext && <span className="mr-1.5 font-medium text-[#D92D20]">Up next</span>}
          {multipleSessionTimes ? (() => {
            const times = session.timeSlots.map((s) => s.time);
            const formatted = times.length <= 1
              ? times[0]
              : times.slice(0, -1).join(", ") + " and " + times[times.length - 1];
            return <>{session.dayOfWeek}, {session.date} at {formatted}</>;
          })() : <>{session.dayOfWeek}, {session.date} at {session.timeSlots[0]?.time}</>}
        </p>

        {session.description && (
          <p className="mt-2 text-[16px] leading-[1.4] text-gray-xlight">{session.description}</p>
        )}

        {/* Links row — homework, watch recordings, join/starts-in */}
        {(isNext || session.startsIn || rowMaterials.length > 0 || hasRecordings) && (
          <div className="mt-3 -mr-4 flex gap-1.5 overflow-x-auto pr-4 scrollbar-hide sm:-mr-6 sm:pr-6">
            {rowMaterials.map((mat, i) => (
              <LinkButton key={i} size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href={mat.url}>
                {mat.label === "Session guide" && sessionMaterial === "homework" ? "Homework" : mat.label} <ExternalLinkIcon />
              </LinkButton>
            ))}
            {hasRecordings && (multipleSessionTimes ? (
              <Button
                size="sm"
                variant="secondary"
                rounded="rounded-full"
                className="shrink-0 whitespace-nowrap"
                onClick={() => setRecordingsOpen(!recordingsOpen)}
              >
                Watch recordings
                {recordingSlots.length > 1 && (
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`shrink-0 text-gray-dark transition-transform duration-200 ${recordingsOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Button>
            ) : (
              <LinkButton
                size="sm"
                variant="secondary"
                rounded="rounded-full"
                className="shrink-0 whitespace-nowrap"
                href={recordingSlots[0]?.recordingUrl}
              >
                <PlayIcon /> Watch recording
              </LinkButton>
            ))}
            {isNext && !startingSoon && !session.startsIn && (
              <LinkButton size="sm" variant="primary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">
                Join session
              </LinkButton>
            )}
            {!isCompleted && isNext && (session.startsIn || startingSoon) && (
              <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap cursor-not-allowed opacity-60" disabled>
                Starts in {startingSoon ? "2 hours" : session.startsIn}
              </Button>
            )}
          </div>
        )}

        {recordingsOpen && (
          <div className="mt-1 py-2">
            {recordingSlots.map((slot, i) => {
              const isLast = i === recordingSlots.length - 1;
              return (
                <div key={slot.id} className="flex gap-2">
                  {/* Connector column */}
                  <div className="flex w-4 shrink-0 flex-col items-center">
                    <div className="w-0 flex-1 border-l-[1.5px] border-dashed border-gray-stroke" />
                    <div className="h-2 w-2 shrink-0 rounded-full bg-gray-xlight" />
                    {!isLast
                      ? <div className="w-0 flex-1 border-l-[1.5px] border-dashed border-gray-stroke" />
                      : <div className="flex-1" />
                    }
                  </div>
                  {/* Content */}
                  <a
                    href={slot.recordingUrl}
                    className="flex flex-1 items-center gap-2.5 py-2.5 leading-[1.2] no-underline transition-colors hover:opacity-80"
                  >
                    <span className="min-w-[72px] font-medium text-gray-dark">{slot.time} session</span>
                    <span className="flex items-center gap-1 text-gray-light">
                      <PlayIcon /> Watch recording
                    </span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function CourseSidebar({ course, showSessionRecordings }: { course: CourseData; showSessionRecordings: boolean }) {
  const nextSession = course.sessions.find((s) => s.status === "next");


  return (
    <div className="-mt-4 min-[428px]:mt-0">
      <div className="-mx-4 min-[428px]:mx-0 min-[428px]:flex min-[428px]:flex-wrap min-[428px]:items-center min-[428px]:gap-x-4 min-[428px]:gap-y-0 md:mx-0 md:block md:gap-0">
        <div className="relative min-[428px]:w-[160px] min-[428px]:shrink-0 md:w-full">
          <img
            src={course.image}
            alt={course.title}
            className="aspect-[1.91/1] w-full rounded-none object-cover min-[428px]:rounded-[12px] md:rounded-[12px]"
          />
          <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 transition-colors hover:bg-black/45">
            <img src={shareArrowIcon} alt="Share" className="h-5 w-5 brightness-0 invert" />
          </button>
        </div>

        <div className="min-[428px]:min-w-0 min-[428px]:flex-1 px-4 pt-4 pb-0 min-[428px]:px-0 min-[428px]:py-0 md:px-0 md:pt-4 md:pb-0">
          <h1 className="text-[24px] font-medium leading-[1.1] text-gray-dark min-[428px]:line-clamp-2 md:line-clamp-none">
            {course.title}
          </h1>
        </div>

        <div className="mt-5 px-4 min-[428px]:w-full min-[428px]:px-0 md:mt-5 md:w-auto md:px-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[16px]">
            <span className="flex items-center gap-x-2">
              <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
              <span className="font-medium text-gray-dark">{course.sessionCount} sessions</span>
              <span className="text-gray-light">{course.cohortDates}</span>
            </span>
            <button className="text-left text-[16px] text-gray-xlight underline">Switch cohorts</button>
          </div>
        </div>
      </div>

      <div>
        {/* Resources — hidden on mobile, shown in Resources tab instead */}
        <div className="mt-4 hidden md:mt-6 md:block">
          <p className="mb-2 text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light">
            Resources
          </p>
          <div className="flex flex-col">
            {course.resources.filter(r => !r.secondary && !(r.icon === "recording" && showSessionRecordings)).map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium leading-[1.2] text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
              >
                <ResourceIcon type={resource.icon} />
                <span>{resource.label}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-xlight">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
            <a
              href="#"
              className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium leading-[1.2] text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
            >
              <ResourceIcon type="gift" />
              <span>Refer your friends or team</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-xlight">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Action banners ───────────────────────────────────────────────────────────

type CoursePhase = "pre-course" | "in-progress" | "post-course";
type CalendarVariant = "time-picker" | "all-sessions";

function ActionBanners({ course, phase, calendarVariant, sessionMaterial, bannersHaveCheckbox }: { course: CourseData; phase: CoursePhase; calendarVariant: CalendarVariant; sessionMaterial: "homework" | "session-guide"; bannersHaveCheckbox: boolean }) {
  const nextSession = course.sessions.find((s) => s.status === "next");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const dismiss = (id: string) => setDismissed((prev) => new Set([...prev, id]));

  // Calendar time picker state (only used in pre-course)
  const allTimes = Array.from(
    new Set(course.sessions.flatMap((s) => s.timeSlots.map((t) => t.time)))
  );
  const [selectedTime, setSelectedTime] = useState(allTimes[0]);
  const timeOptions = [...allTimes, "All available times"];

  if (phase === "pre-course") return null;

  if (phase === "in-progress" && nextSession) {
    const lastCompleted = [...course.sessions].reverse().find((s) => s.status === "completed");

    const cards = [
      {
        id: "homework",
        content: (
          <div className="flex items-center rounded-xl border border-gray-stroke bg-white p-5 shadow-card">
            {bannersHaveCheckbox && <DismissButton onDismiss={() => dismiss("homework")} asCheckbox />}
            <a href="#" className="flex-1 no-underline transition-transform duration-300 ease-out hover:translate-x-1">
              <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">
                {sessionMaterial === "session-guide"
                  ? <>Review Session {lastCompleted?.number} <InlineChevron /></>
                  : <>Complete session {lastCompleted?.number} homework <InlineChevron /></>}
              </p>
              <p className="mt-1 leading-[1.2] text-gray-light">{lastCompleted?.title}</p>
            </a>
            {!bannersHaveCheckbox && <DismissButton onDismiss={() => dismiss("homework")} />}
          </div>
        ),
      },
    ];

    const visible = cards.filter((c) => !dismissed.has(c.id));
    if (visible.length === 0) return null;
    return (
      <div className="mb-4 flex flex-col gap-3">
        {visible.map((card) => <div key={card.id}>{card.content}</div>)}
      </div>
    );
  }

  if (phase === "post-course") {
    const cards = [
      {
        id: "certificate",
        content: (
          <div className="flex items-center rounded-xl border border-gray-stroke bg-white p-5 shadow-card">
            {bannersHaveCheckbox && <DismissButton onDismiss={() => dismiss("certificate")} asCheckbox />}
            <a href="#" className="flex-1 no-underline transition-transform duration-300 ease-out hover:translate-x-1">
              <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">Get your certificate <InlineChevron /></p>
              <p className="mt-1 leading-[1.2] text-gray-light">Complete a short course survey to unlock your certificate of completion.</p>
            </a>
            {!bannersHaveCheckbox && <DismissButton onDismiss={() => dismiss("certificate")} />}
          </div>
        ),
      },
    ];

    const visible = cards.filter((c) => !dismissed.has(c.id));
    if (visible.length === 0) return null;
    return (
      <div className="mb-4 flex flex-col gap-3">
        {visible.map((card) => <div key={card.id}>{card.content}</div>)}
      </div>
    );
  }

  return null;
}

// ─── Page ────────────────────────────────────────────────────────────────────

const coursePhases: { value: CoursePhase; label: string }[] = [
  { value: "pre-course", label: "Pre-course" },
  { value: "in-progress", label: "In progress" },
  { value: "post-course", label: "Post-course" },
];

const calendarVariants: { value: CalendarVariant; label: string }[] = [
  { value: "all-sessions", label: "All sessions" },
  { value: "time-picker", label: "Select session time" },
];

export default function CourseDetail() {
  const course = mockCourse;
  const [coursePhase, setCoursePhase] = useState<CoursePhase>("in-progress");
  const [calendarVariant, setCalendarVariant] = useState<CalendarVariant>("all-sessions");
  const [sessionMaterial, setSessionMaterial] = useState<"homework" | "session-guide">("session-guide");
  const [showSessionRecordings, setShowSessionRecordings] = useState(true);
  const [multipleSessionTimes, setMultipleSessionTimes] = useState(true);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [bannersHaveCheckbox, setBannersHaveCheckbox] = useState(false);
  const [showActionBanners, setShowActionBanners] = useState(false);
  const [sessionStartingSoon, setSessionStartingSoon] = useState(false);
  const [completedSessionIds, setCompletedSessionIds] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("completedSessionIds") || "[]")); } catch { return new Set(); }
  });
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("completedSteps") || "[]")); } catch { return new Set(); }
  });
  const [completedPostSteps, setCompletedPostSteps] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("completedPostSteps") || "[]")); } catch { return new Set(); }
  });
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showAllPostSteps, setShowAllPostSteps] = useState(false);
  const [pendingHide, setPendingHide] = useState<Set<string>>(new Set());
  const addPendingHide = (key: string) => {
    setPendingHide(prev => new Set([...prev, key]));
    setTimeout(() => {
      setPendingHide(prev => { const s = new Set(prev); s.delete(key); return s; });
    }, 500);
  };
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [mobilePivotTab, setMobilePivotTab] = useState<"sessions" | "resources">("sessions");

  useEffect(() => { if (!["calendar", "survey", "setup"].some(id => completedSteps.has(id))) setShowGetStarted(false); }, [completedSteps]);
  useEffect(() => { if (completedSessionIds.size === 0) setShowAllCompleted(false); }, [completedSessionIds]);
  useEffect(() => { if (!["survey", "next-steps-call"].some(id => completedPostSteps.has(id))) setShowAllPostSteps(false); }, [completedPostSteps]);

  const sidebar = <CourseSidebar course={course} showSessionRecordings={showSessionRecordings} />;

  return (
    <>
      <PageShell leftSidebar={sidebar} leftSidebarMobile>
        <div className="-mt-5 pb-20 md:mt-0">

          {/* Mobile pivot menu */}
          <div className="sticky top-0 z-10 -mx-4 flex gap-5 overflow-x-auto border-b border-gray-stroke bg-white px-4 scrollbar-hide md:hidden">
            {(["sessions", "resources"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobilePivotTab(tab)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap px-3 py-3 transition-colors ${mobilePivotTab === tab ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"}`}
              >
                <span className="text-[18px] font-medium">
                  {tab === "sessions" ? "Sessions" : "Resources"}
                </span>
                {mobilePivotTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#038561]" />
                )}
              </button>
            ))}
          </div>

          {/* Action banners — desktop always, mobile only on next-steps tab */}
          {showActionBanners && (
            <div className="hidden md:block py-6 md:py-0">
              <ActionBanners course={course} phase={coursePhase} calendarVariant={calendarVariant} sessionMaterial={sessionMaterial} bannersHaveCheckbox={bannersHaveCheckbox} />
            </div>
          )}

          {/* Sessions — desktop always, mobile only on sessions tab */}
          {(() => {
            const allCompletedPhase = coursePhase === "post-course";
            const isPreCourse = coursePhase === "pre-course";
            const checkedOffSessions = course.sessions.filter(s => completedSessionIds.has(s.id));
            const effectiveShowAllCompleted = showAllCompleted && checkedOffSessions.length > 0;
            const displaySessions = effectiveShowAllCompleted ? course.sessions : course.sessions.filter(s => !completedSessionIds.has(s.id) || pendingHide.has(String(s.id)));

            return (
              <div className={`${mobilePivotTab !== "sessions" ? "hidden md:block" : ""} pt-6 md:pt-0`}>
                {/* Getting Started */}
                <div>
                  {(() => {
                    const allItems = [
                      { id: "calendar", title: "Add all sessions to your calendar", description: "Two session times each day: 11:00 AM ET and 4:00 PM ET. Attend whichever works for you.", buttons: ["Google Calendar", "Microsoft", "Other calendars"] },
                      { id: "survey", title: "Complete the intake survey", description: "Takes about 5 minutes. Helps us tailor sessions to your experience level and goals.", buttons: null },
                      { id: "setup", title: "Set up your tools", description: "Install Claude or your AI tool of choice before the first session.", buttons: null },
                    ];
                    const completedItems = allItems.filter(item => completedSteps.has(item.id));
                    const effectiveShowGetStarted = showGetStarted && completedItems.length > 0;
                    const displayItems = effectiveShowGetStarted ? allItems : allItems.filter(item => !completedSteps.has(item.id) || pendingHide.has(item.id));
                    return (<>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light">Getting started</p>
                    {completedItems.length > 0 && (
                      <button onClick={() => setShowGetStarted(!effectiveShowGetStarted)} className="group flex cursor-pointer items-center gap-1 text-[14px] font-medium text-[#038561]">
                        <span className="flex items-center gap-1 group-hover:underline">{effectiveShowGetStarted ? "Hide completed" : `Show ${completedItems.length} completed`} <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 transition-transform duration-200 ${effectiveShowGetStarted ? "rotate-180" : ""}`}><path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                      </button>
                    )}
                  </div>
                  <div>
                    {displayItems.map((item) => {
                        const isDone = completedSteps.has(item.id);
                        const markDone = () => { const s = new Set(completedSteps); if (s.has(item.id)) { s.delete(item.id); } else { s.add(item.id); addPendingHide(item.id); } setCompletedSteps(s); localStorage.setItem("completedSteps", JSON.stringify([...s])); };
                        return (
                        <div key={item.id} className="flex items-start gap-4 py-4">
                          <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
                            <button
                              onClick={(e) => { e.stopPropagation(); markDone(); }}
                              className={`group mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] cursor-pointer transition-colors ${isDone ? "bg-[#038561] hover:bg-[#038561]/80" : "border-[1.5px] border-gray-stroke bg-white hover:border-[#038561]/40"}`}
                            >
                              {isDone ? (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2.5 7l3 3 6-6" />
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#038561] opacity-0 transition-opacity group-hover:opacity-100">
                                  <path d="M2.5 7l3 3 6-6" />
                                </svg>
                              )}
                            </button>
                            <div className={`mt-1.5 w-0 flex-1 border-l-[1.5px] border-dashed ${isDone ? "border-[#038561]" : "border-gray-stroke"}`} />
                          </div>
                          <div className="min-w-0 flex-1 pb-1" onClick={() => { if (!isDone) markDone(); }}>
                            {item.buttons ? (
                              <div>
                                <p className={`text-[18px] font-medium leading-[1.2] ${isDone ? "text-gray-light" : "text-gray-dark"}`}>{item.title}</p>
                                <p className="mt-1 leading-[1.2] text-gray-light">{item.description}</p>
                              </div>
                            ) : (
                              <a href="#" className="group block no-underline">
                                <p className={`text-[18px] font-medium leading-[1.2] ${isDone ? "text-gray-light" : "text-gray-dark"}`}>{item.title} <InlineChevron /></p>
                                <p className="mt-1 leading-[1.2] text-gray-light">{item.description}</p>
                              </a>
                            )}
                            {item.buttons && (
                              <div className="-mr-4 mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide sm:-mr-6 sm:pr-6">
                                {item.buttons.map((label) => (
                                  <LinkButton key={label} size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">{label}</LinkButton>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        );
                      })}
                  </div>
                  </>); })()}
                </div>
                {/* Desktop: Sessions header + "See all" text link */}
                <div className="mb-2 mt-4 flex items-center justify-between border-t border-gray-stroke pt-4">
                  <p className="text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light">Sessions</p>
                  {checkedOffSessions.length > 0 && (
                    <button onClick={() => setShowAllCompleted(!effectiveShowAllCompleted)} className="group flex cursor-pointer items-center gap-1 text-[14px] font-medium text-[#038561]">
                      <span className="flex items-center gap-1 group-hover:underline">{effectiveShowAllCompleted ? "Hide completed" : `Show ${checkedOffSessions.length} completed`} <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 transition-transform duration-200 ${effectiveShowAllCompleted ? "rotate-180" : ""}`}><path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </button>
                  )}
                </div>
                <div className="mt-0">
                  {displaySessions.map((session, i) => {
                    const originalIndex = course.sessions.indexOf(session);
                    const forceStatus = coursePhase === "pre-course" ? (originalIndex === 0 ? "next" : "upcoming") : undefined;
                    const isUpcoming = (session.status === "upcoming" || forceStatus === "upcoming") && !allCompletedPhase && forceStatus !== "next" && !completedSessionIds.has(session.id);
                    const isNext = (session.status === "next" && !allCompletedPhase && !completedSessionIds.has(session.id)) || forceStatus === "next";
                    return (
                      <SessionRow
                        key={session.id}
                        session={session}
                        showSessionRecordings={showSessionRecordings}
                        multipleSessionTimes={multipleSessionTimes}
                        isLast={i === displaySessions.length - 1}
                        allCompleted={allCompletedPhase}
                        forceStatus={forceStatus}
                        sessionMaterial={sessionMaterial}
                        markedComplete={completedSessionIds.has(session.id)}
                        disabled={isUpcoming || (isNext && !!session.startsIn)}
                        startingSoon={isNext && sessionStartingSoon || undefined}
                        onMarkComplete={(isUpcoming || (isNext && !!session.startsIn)) ? undefined : () => { const s = new Set(completedSessionIds); if (s.has(session.id)) { s.delete(session.id); } else { s.add(session.id); addPendingHide(String(session.id)); } setCompletedSessionIds(s); localStorage.setItem("completedSessionIds", JSON.stringify([...s])); }}
                      />
                    );
                  })}
                </div>

                {/* What's next */}
                {(() => {
                  const lastSession = course.sessions[course.sessions.length - 1];
                  const lastSessionStarted = coursePhase === "post-course" || completedSessionIds.has(lastSession.id);
                  const allPostItems = [
                    { id: "survey", title: "Complete the post-program survey", description: "Takes about 5 minutes. Helps us improve the program for future cohorts.", lockedUntilLastSession: true },
                    { id: "next-steps-call", title: "Book a next steps call", description: "A short call with our team to help you figure out where to go from here.", lockedUntilLastSession: false },
                  ];
                  const completedPostItems = allPostItems.filter(item => completedPostSteps.has(item.id));
                  const effectiveShowAllPostSteps = showAllPostSteps && completedPostItems.length > 0;
                  const displayPostItems = effectiveShowAllPostSteps ? allPostItems : allPostItems.filter(item => !completedPostSteps.has(item.id) || pendingHide.has(item.id));
                  return (
                  <div>
                    <div className="mb-2 mt-4 flex items-center justify-between border-t border-gray-stroke pt-4">
                      <p className="text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light">What's next</p>
                      {completedPostItems.length > 0 && (
                        <button onClick={() => setShowAllPostSteps(!effectiveShowAllPostSteps)} className="group flex cursor-pointer items-center gap-1 text-[14px] font-medium text-[#038561]">
                          <span className="flex items-center gap-1 group-hover:underline">{effectiveShowAllPostSteps ? "Hide completed" : `Show ${completedPostItems.length} completed`} <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 transition-transform duration-200 ${effectiveShowAllPostSteps ? "rotate-180" : ""}`}><path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        </button>
                      )}
                    </div>
                    <div>
                      {displayPostItems.map((item, i, arr) => {
                        const isLocked = item.lockedUntilLastSession && !lastSessionStarted;
                        const isDone = completedPostSteps.has(item.id);
                        const toggle = () => { if (isLocked) return; const s = new Set(completedPostSteps); if (s.has(item.id)) { s.delete(item.id); } else { s.add(item.id); addPendingHide(item.id); } setCompletedPostSteps(s); localStorage.setItem("completedPostSteps", JSON.stringify([...s])); };
                        const markDone = () => { if (!isDone) toggle(); };
                        return (
                          <div key={item.id} className="flex items-start gap-4 py-4">
                            <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggle(); }}
                                disabled={isLocked}
                                className={`group mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] transition-colors ${isLocked ? "cursor-not-allowed border-[1.5px] border-gray-stroke bg-gray-hover opacity-50" : isDone ? "bg-[#038561] hover:bg-[#038561]/80 cursor-pointer" : "border-[1.5px] border-gray-stroke bg-white hover:border-[#038561]/40 cursor-pointer"}`}
                              >
                                {isDone ? (
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2.5 7l3 3 6-6" />
                                  </svg>
                                ) : (
                                  !isLocked && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#038561] opacity-0 transition-opacity group-hover:opacity-100">
                                    <path d="M2.5 7l3 3 6-6" />
                                  </svg>
                                )}
                              </button>
                              {i < arr.length - 1 && (
                                <div className={`mt-1.5 w-0 flex-1 border-l-[1.5px] border-dashed ${isDone ? "border-[#038561]" : "border-gray-stroke"}`} />
                              )}
                            </div>
                            <div className={`min-w-0 flex-1 pb-1 ${isLocked ? "" : ""}`} onClick={isLocked ? undefined : markDone}>
                              {isLocked ? (
                                <div>
                                  <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">{item.title}</p>
                                  <p className="mt-1 leading-[1.2] text-gray-light">Available after session {lastSession.number}</p>
                                </div>
                              ) : (
                              <a href="#" className="group block no-underline">
                                <p className={`text-[18px] font-medium leading-[1.2] ${isDone ? "text-gray-light" : "text-gray-dark"}`}>{item.title} <InlineChevron /></p>
                                <p className="mt-1 leading-[1.2] text-gray-light">{item.description}</p>
                              </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Banner
                      href="#"
                      variant="timeline"
                      decoration={{ type: "emoji", value: "🔥" }}
                      title="Keep building"
                      subtext="Join additional build sessions to continue honing your skills."
                    />
                    <Banner
                      href="#"
                      variant="timeline"
                      decoration={{ type: "emoji", value: "🚀" }}
                      title="Join the next level"
                      subtext="AI Builder Program Level 2: Build AI-Powered Products."
                    />
                  </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* Resources — mobile only on resources tab */}
          <div className={`md:hidden ${mobilePivotTab !== "resources" ? "hidden" : ""}`}>
            <div className="pt-6">
              <p className="mb-2 hidden text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light md:block">Resources</p>
              <div className="flex flex-col">
                {course.resources.filter(r => !r.secondary && !(r.icon === "recording" && showSessionRecordings)).map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium leading-[1.2] text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
                  >
                    <ResourceIcon type={resource.icon} />
                    <span>{resource.label}</span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-xlight">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
                <a
                  href="#"
                  className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium leading-[1.2] text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
                >
                  <ResourceIcon type="gift" />
                  <span>Refer your friends or team</span>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-xlight">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </PageShell>

      {/* Floating options menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {optionsOpen && (
          <div className="mb-2 w-[240px] rounded-xl border border-gray-stroke bg-white px-4 py-3 shadow-lg">
            {/* Toggles */}
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Session-level recording links</p>
              <button
                onClick={() => setShowSessionRecordings(!showSessionRecordings)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${showSessionRecordings ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${showSessionRecordings ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Multiple session times</p>
              <button
                onClick={() => setMultipleSessionTimes(!multipleSessionTimes)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${multipleSessionTimes ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${multipleSessionTimes ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Show action banners</p>
              <button
                onClick={() => setShowActionBanners(!showActionBanners)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${showActionBanners ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${showActionBanners ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Session starting soon</p>
              <button
                onClick={() => setSessionStartingSoon(!sessionStartingSoon)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${sessionStartingSoon ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${sessionStartingSoon ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Banners have checkbox</p>
              <button
                onClick={() => setBannersHaveCheckbox(!bannersHaveCheckbox)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${bannersHaveCheckbox ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${bannersHaveCheckbox ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Course phase */}
            <p className="mb-2.5 mt-4 text-[14px] font-medium uppercase tracking-[0.5px] text-gray-light">Course phase</p>
            <div className="flex flex-col gap-2">
              {coursePhases.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setCoursePhase(value);
                    setShowAllCompleted(false);
                    setShowGetStarted(false);
                    setShowAllPostSteps(false);
                    if (value === "in-progress") {
                      const sessions = new Set([1, 2]);
                      const steps = new Set(["calendar", "survey", "setup"]);
                      setCompletedSessionIds(sessions);
                      setCompletedSteps(steps);
                      setCompletedPostSteps(new Set());
                      localStorage.setItem("completedSessionIds", JSON.stringify([...sessions]));
                      localStorage.setItem("completedSteps", JSON.stringify([...steps]));
                      localStorage.setItem("completedPostSteps", JSON.stringify([]));
                    } else if (value === "post-course") {
                      const sessions = new Set(course.sessions.map(s => s.id));
                      const steps = new Set(["calendar", "survey", "setup"]);
                      setCompletedSessionIds(sessions);
                      setCompletedSteps(steps);
                      setCompletedPostSteps(new Set());
                      localStorage.setItem("completedSessionIds", JSON.stringify([...sessions]));
                      localStorage.setItem("completedSteps", JSON.stringify([...steps]));
                      localStorage.setItem("completedPostSteps", JSON.stringify([]));
                    } else {
                      setCompletedSessionIds(new Set());
                      setCompletedSteps(new Set());
                      setCompletedPostSteps(new Set());
                      localStorage.setItem("completedSessionIds", JSON.stringify([]));
                      localStorage.setItem("completedSteps", JSON.stringify([]));
                      localStorage.setItem("completedPostSteps", JSON.stringify([]));
                    }
                  }}
                  className="flex cursor-pointer items-center gap-2.5 text-[16px] leading-[1.2]"
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${coursePhase === value ? "border-[#038561] bg-[#038561]" : "border-gray-300"}`}>
                    {coursePhase === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={coursePhase === value ? "font-medium text-gray-dark" : "text-gray-light"}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Session materials */}
            <>
              <p className="mb-2.5 mt-4 text-[14px] font-medium uppercase tracking-[0.5px] text-gray-light">Session materials</p>
              <div className="flex flex-col gap-2">
                {([{ value: "session-guide", label: "Session guide" }, { value: "homework", label: "Homework" }] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSessionMaterial(value)}
                    className="flex cursor-pointer items-center gap-2.5 text-[16px] leading-[1.2]"
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${sessionMaterial === value ? "border-[#038561] bg-[#038561]" : "border-gray-300"}`}>
                      {sessionMaterial === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={sessionMaterial === value ? "font-medium text-gray-dark" : "text-gray-light"}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          </div>
        )}
        <button
          onClick={() => setOptionsOpen(!optionsOpen)}
          className={`ml-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-stroke bg-white shadow-lg transition-colors hover:bg-gray-hover ${optionsOpen ? "bg-gray-hover" : ""}`}
        >
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
            <circle cx="8" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
            <circle cx="14" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
          </svg>
        </button>
      </div>
    </>
  );
}
