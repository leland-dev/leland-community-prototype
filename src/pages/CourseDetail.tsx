import { useState } from "react";
import { Button, LinkButton } from "../components/Button";
import { ToggleChip } from "../components/ToggleChip";
import PageShell from "../components/PageShell";
import slackIcon from "../assets/icons/slack-black.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import toolsWrenchRulerIcon from "../assets/icons/tools-wrench-ruler.svg";
import calendarIcon from "../assets/icons/calendar.svg";
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
  timeSlots: TimeSlot[];
  status: "completed" | "next" | "upcoming";
  materials: SessionMaterial[];
};

type CourseResource = {
  label: string;
  icon: "slack" | "clock" | "tool" | "recording";
  url: string;
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
    { label: "Slack community", icon: "slack", url: "#" },
    { label: "Office hours", icon: "clock", url: "#" },
    { label: "Setup guide", icon: "tool", url: "#" },
  ],
  sessions: [
    {
      id: 1, number: 1, title: "Build a Real Product with World-Class Design", description: "Create a new product in 90 minutes, without writing a line of code, using a design system that you love.", date: "Apr 21", status: "completed",
      timeSlots: [
        { id: 10, time: "11:00 AM", recordingUrl: "#" },
        { id: 11, time: "4:00 PM", recordingUrl: "#" },
      ],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 2, number: 2, title: "Automate Communication in Your Voice", description: "Connect your communication tools, teach AI how you write, and set it up to manage your inbox.", date: "Apr 24", status: "completed",
      timeSlots: [
        { id: 20, time: "11:00 AM", recordingUrl: "#" },
        { id: 21, time: "4:00 PM", recordingUrl: "#" },
      ],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 3, number: 3, title: "Design Presentations That Build Themselves", description: "Go from research question to polished, animated slide deck in a single session.", date: "Apr 28", status: "next",
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
      id: 4, number: 4, title: "Analyze and Visualize Data Without Writing Formulas", description: "Go from data and spreadsheets to dashboards and insights in minutes.", date: "May 1", status: "upcoming",
      timeSlots: [{ id: 40, time: "11:00 AM", recordingUrl: "#" }, { id: 41, time: "4:00 PM", recordingUrl: "#" }],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 5, number: 5, title: "Build Custom Workflows That Run While You Sleep", description: "Set up automations that run on a schedule, connect your tools, and get things done whether you're at your desk or not.", date: "May 5", status: "upcoming",
      timeSlots: [{ id: 50, time: "11:00 AM", recordingUrl: "#" }, { id: 51, time: "4:00 PM", recordingUrl: "#" }],
      materials: [{ label: "Session guide", url: "#" }],
    },
    {
      id: 6, number: 6, title: "Launch Your AI System + Demo Day", description: "Cross the finish line with a live, working AI system and show the cohort what you built.", date: "May 8", status: "upcoming",
      timeSlots: [{ id: 60, time: "11:00 AM", recordingUrl: "#" }, { id: 61, time: "4:00 PM", recordingUrl: "#" }],
      materials: [{ label: "Session guide", url: "#" }],
    },
  ],
};

// ─── Icons ───────────────────────────────────────────────────────────────────

function ResourceIcon({ type }: { type: CourseResource["icon"] }) {
  const wrap = "flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-gray-hover";
  const cls = "h-5 w-5 text-gray-dark";
  switch (type) {
    case "slack":
      return <span className={wrap}><img src={slackIcon} alt="" className="h-5 w-5" /></span>;
    case "clock":
      return <span className={wrap}><img src={orderHistoryIcon} alt="" className="h-5 w-5" /></span>;
    case "tool":
      return <span className={wrap}><img src={toolsWrenchRulerIcon} alt="" className="h-5 w-5" /></span>;
    case "recording":
      return <span className={wrap}><img src={playVideoIcon} alt="" className="h-5 w-5" /></span>;
  }
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

// ─── Session row ─────────────────────────────────────────────────────────────

function SessionRow({ session, showSessionRecordings, multipleSessionTimes, isLast, allCompleted, forceStatus }: { session: CourseSession; showSessionRecordings: boolean; multipleSessionTimes: boolean; isLast: boolean; allCompleted: boolean; forceStatus?: "next" | "upcoming" }) {
  const isCompleted = (session.status === "completed" || allCompleted) && !forceStatus;
  const isNext = (session.status === "next" && !allCompleted && !forceStatus) || forceStatus === "next";
  const [recordingsOpen, setRecordingsOpen] = useState(false);
  const recordingSlots = session.timeSlots.filter((s) => s.recordingUrl);
  const hasRecordings = isCompleted && recordingSlots.length > 0 && showSessionRecordings;
  const rowMaterials = session.materials.filter((m) => m.label !== "Session prep");
  const hasLinks = rowMaterials.length > 0 || hasRecordings;

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Left column: indicator + dotted connector */}
      <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
        {isCompleted ? (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#038561] font-medium leading-[1.2] text-white">
            {session.number}
          </div>
        ) : isNext ? (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#038561] font-medium leading-[1.2] text-white ring-2 ring-[#038561] ring-offset-2">
            {session.number}
          </div>
        ) : (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] font-medium leading-[1.2] text-gray-light">
            {session.number}
          </div>
        )}
        {!isLast && (
          <div className={`mt-1.5 w-0 flex-1 border-l-[1.5px] border-dashed ${isCompleted ? "border-[#038561]" : "border-gray-stroke"}`} />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className={`text-[18px] font-medium leading-[1.2] ${isNext ? "text-gray-dark" : "text-gray-light"}`}>
            {session.title}
          </p>
          <span className="shrink-0 leading-[1.2] text-gray-light">{session.date}</span>
        </div>
        {/* Offered at */}
        {multipleSessionTimes ? (() => {
          const times = session.timeSlots.map((s) => s.time);
          const formatted = times.length <= 1
            ? times[0]
            : times.slice(0, -1).join(", ") + " and " + times[times.length - 1];
          return (
            <p className="mt-1 leading-[1.2] text-gray-light">
              Offered at {formatted}
            </p>
          );
        })() : (
          <p className="mt-1 leading-[1.2] text-gray-light">
            Starts at {session.timeSlots[0]?.time}
          </p>
        )}

        {session.description && (
          <p className="mt-2 text-[16px] leading-[1.4] text-gray-xlight">{session.description}</p>
        )}

        {/* Links row — session guide, session prep, watch recordings */}
        {(rowMaterials.length > 0 || hasRecordings) && (
          <div className="mt-3 -mr-4 flex gap-1.5 overflow-x-auto pr-4 scrollbar-hide sm:-mr-6 sm:pr-6">
            {rowMaterials.map((mat, i) => (
              <LinkButton key={i} size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href={mat.url}>
                {mat.label} <ExternalLinkIcon />
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
                    className={`shrink-0 text-gray-xlight transition-transform duration-200 ${recordingsOpen ? "rotate-180" : ""}`}
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
      <div className="-mx-4 min-[428px]:mx-0 min-[428px]:flex min-[428px]:items-center min-[428px]:gap-4 md:mx-0 md:block">
        <img
          src={course.image}
          alt={course.title}
          className="aspect-[1.91/1] w-full rounded-none object-cover min-[428px]:w-[160px] min-[428px]:shrink-0 min-[428px]:rounded-[12px] md:w-full md:rounded-[12px]"
        />

        <div className="min-[428px]:min-w-0 min-[428px]:flex-1 px-4 pt-4 pb-0 min-[428px]:px-0 min-[428px]:py-0 md:px-0 md:py-4">
          <h1 className="text-[24px] font-medium leading-[1.1] text-gray-dark min-[428px]:line-clamp-2 md:line-clamp-none">
            {course.title}
          </h1>
          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-lg bg-gray-hover px-3 py-1.5 text-[14px] font-medium text-gray-light">
              <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
              {course.sessionCount} Sessions: {course.cohortDates}
            </span>
          </div>
        </div>
      </div>

      <div>
        {/* Resources — hidden on mobile, shown in Resources tab instead */}
        <div className="mt-4 hidden md:block">
          <p className="mb-2 text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light">
            Resources
          </p>
          <div className="flex flex-col">
            {!showSessionRecordings && (
              <a
                href="#"
                className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
              >
                <ResourceIcon type="recording" />
                Recordings
              </a>
            )}
            {course.resources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
              >
                <ResourceIcon type={resource.icon} />
                {resource.label}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto shrink-0 text-gray-xlight">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Action banners ───────────────────────────────────────────────────────────

type CoursePhase = "pre-course" | "in-progress" | "post-course";
type CalendarVariant = "time-picker" | "all-sessions";

function ActionBanners({ course, phase, calendarVariant }: { course: CourseData; phase: CoursePhase; calendarVariant: CalendarVariant }) {
  const nextSession = course.sessions.find((s) => s.status === "next");

  // Calendar time picker state (only used in pre-course)
  const allTimes = Array.from(
    new Set(course.sessions.flatMap((s) => s.timeSlots.map((t) => t.time)))
  );
  const [selectedTime, setSelectedTime] = useState(allTimes[0]);
  const timeOptions = [...allTimes, "All available times"];
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

  if (phase === "pre-course") {
    const steps = [
      {
        content: (
          <div className="rounded-xl border border-gray-stroke bg-white p-5 shadow-card">
            <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">Add your calendar invites</p>
            <p className="mt-1 leading-[1.2] text-gray-light">Two session times each day: 11:00 AM ET and 4:00 PM ET. Add whichever works for you.</p>
            {calendarVariant === "time-picker" && (
              <div className="mt-4 -mr-5 flex gap-1.5 overflow-x-auto pr-5 scrollbar-hide">
                {timeOptions.map((opt) => (
                  <ToggleChip key={opt} selected={selectedTime === opt} onClick={() => setSelectedTime(opt)} className="shrink-0 whitespace-nowrap">{opt}</ToggleChip>
                ))}
              </div>
            )}
            <div className="mt-3 -mr-5 flex gap-1.5 overflow-x-auto pr-5 scrollbar-hide">
              <LinkButton size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">Google Calendar</LinkButton>
              <LinkButton size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">Microsoft</LinkButton>
              <LinkButton size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">Other calendars</LinkButton>
            </div>
          </div>
        ),
      },
      {
        content: (
          <a href="#" className="block rounded-xl border border-gray-stroke bg-white p-4 no-underline shadow-card transition-transform duration-300 ease-out hover:translate-x-1">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">Complete the intake survey</p>
                <p className="mt-1 leading-[1.2] text-gray-light">Takes about 5 minutes. Helps us tailor sessions to your experience level and goals.</p>
              </div>
              <ChevronRight />
            </div>
          </a>
        ),
      },
      {
        content: (
          <div className="rounded-xl border border-gray-stroke bg-white p-4 shadow-card">
            <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">Set up your tools</p>
            <p className="mt-1 leading-[1.2] text-gray-light">Install Claude or your AI tool of choice before the first session.</p>
            <div className="mt-3 -mr-4 flex gap-1.5 overflow-x-auto pr-4 scrollbar-hide">
              <LinkButton size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">Join live setup <ExternalLinkIcon /></LinkButton>
              <LinkButton size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 whitespace-nowrap" href="#">Setup guide <ExternalLinkIcon /></LinkButton>
            </div>
          </div>
        ),
      },
    ];

    return (
      <div className="mb-4 flex flex-col gap-3">
        {steps.map((step, i) => (
          <div key={i}>{step.content}</div>
        ))}
      </div>
    );
  }

  if (phase === "in-progress" && nextSession) {
    const lastCompleted = [...course.sessions].reverse().find((s) => s.status === "completed");

    return (
      <div className="mb-4">
        <a href="#" className="block rounded-xl border border-gray-stroke bg-white p-5 no-underline shadow-card transition-transform duration-300 ease-out hover:translate-x-1">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">
                Complete your session {lastCompleted?.number} homework
              </p>
              <p className="mt-1 leading-[1.2] text-gray-light">
                {lastCompleted?.title}
              </p>
            </div>
            <ChevronRight />
          </div>
        </a>
      </div>
    );
  }

  if (phase === "post-course") {
    return (
      <div className="mb-4">
        <a href="#" className="block rounded-xl border border-gray-stroke bg-white p-5 no-underline shadow-card transition-transform duration-300 ease-out hover:translate-x-1">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">Get your certificate</p>
              <p className="mt-1 leading-[1.2] text-gray-light">
                Complete a short course survey to unlock your certificate of completion.
              </p>
            </div>
            <ChevronRight />
          </div>
        </a>
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
  const [showSessionRecordings, setShowSessionRecordings] = useState(true);
  const [multipleSessionTimes, setMultipleSessionTimes] = useState(true);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [mobilePivotTab, setMobilePivotTab] = useState<"sessions" | "next-steps" | "resources">("next-steps");

  const sidebar = <CourseSidebar course={course} showSessionRecordings={showSessionRecordings} />;

  return (
    <>
      <PageShell leftSidebar={sidebar} leftSidebarMobile>
        <div className="-mt-5 pb-20 md:mt-0">

          {/* Mobile pivot menu */}
          <div className="sticky top-0 z-10 -mx-4 flex gap-5 overflow-x-auto border-b border-gray-stroke bg-white px-4 scrollbar-hide md:hidden">
            {(["sessions", "next-steps", "resources"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobilePivotTab(tab)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap px-3 py-3 transition-colors ${mobilePivotTab === tab ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"}`}
              >
                <span className="text-[18px] font-medium">
                  {tab === "sessions" ? "Sessions" : tab === "next-steps" ? "Next steps" : "Resources"}
                </span>
                {mobilePivotTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#038561]" />
                )}
              </button>
            ))}
          </div>

          {/* Action banners — desktop always, mobile only on next-steps tab */}
          <div className={`${mobilePivotTab !== "next-steps" ? "hidden md:block" : ""} py-6 md:py-0`}>
            <ActionBanners course={course} phase={coursePhase} calendarVariant={calendarVariant} />
          </div>

          {/* Sessions — desktop always, mobile only on sessions tab */}
          {(() => {
            const allCompletedPhase = coursePhase === "post-course";
            const isPreCourse = coursePhase === "pre-course";
            const completedSessions = isPreCourse ? [] : course.sessions.filter(s => s.status === "completed" || allCompletedPhase);
            const nonCompletedSessions = isPreCourse ? course.sessions : course.sessions.filter(s => s.status !== "completed" && !allCompletedPhase);
            const hasHidden = !showAllCompleted && completedSessions.length > 1;
            const visibleCompleted = hasHidden ? completedSessions.slice(-1) : completedSessions;
            const displaySessions = [...visibleCompleted, ...nonCompletedSessions];

            return (
              <div className={`${mobilePivotTab !== "sessions" ? "hidden md:block" : ""} pt-6 md:pt-0`}>
                {!hasHidden && !showAllCompleted && <p className="mb-2 mt-6 hidden text-[14px] font-medium leading-[1.2] uppercase tracking-[0.5px] text-gray-light md:mt-8 md:block">Sessions</p>}
                <div className="mt-0">
                  {hasHidden && (
                    <div className="pb-3 md:pt-3">
                      <Button size="lg" variant="secondary" className="w-full justify-center md:w-auto" onClick={() => setShowAllCompleted(true)}>
                        See all past sessions
                      </Button>
                    </div>
                  )}
                  {showAllCompleted && completedSessions.length > 1 && (
                    <div className="pb-3 md:pt-3">
                      <Button size="lg" variant="secondary" className="w-full justify-center md:w-auto" onClick={() => setShowAllCompleted(false)}>
                        Hide older sessions
                      </Button>
                    </div>
                  )}
                  {displaySessions.map((session, i) => {
                    const originalIndex = course.sessions.indexOf(session);
                    return (
                      <SessionRow
                        key={session.id}
                        session={session}
                        showSessionRecordings={showSessionRecordings}
                        multipleSessionTimes={multipleSessionTimes}
                        isLast={i === displaySessions.length - 1}
                        allCompleted={allCompletedPhase}
                        forceStatus={coursePhase === "pre-course" ? (originalIndex === 0 ? "next" : "upcoming") : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Resources — mobile only on resources tab */}
          <div className={`md:hidden ${mobilePivotTab !== "resources" ? "hidden" : ""}`}>
            <div className="pt-6">
              <p className="mb-2 hidden text-[14px] font-medium leading-[1.5] uppercase tracking-[0.5px] text-gray-light md:block">Resources</p>
              <div className="flex flex-col">
                {course.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    className="flex w-full items-center gap-3 py-[10px] text-[16px] font-medium text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
                  >
                    <ResourceIcon type={resource.icon} />
                    {resource.label}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto shrink-0 text-gray-xlight">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </PageShell>

      {/* Floating options menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {optionsOpen && (
          <div className="mb-2 w-[240px] rounded-xl border border-gray-stroke bg-white px-4 py-3 shadow-lg">
            {/* Course phase */}
            <p className="mb-2.5 text-[14px] font-medium uppercase tracking-[0.5px] text-gray-light">Course phase</p>
            <div className="flex flex-col gap-2">
              {coursePhases.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setCoursePhase(value); setShowAllCompleted(false); }}
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

            {/* Multiple session times */}
            {/* Session recordings */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium text-gray-dark">Session recordings</p>
              <button
                onClick={() => setShowSessionRecordings(!showSessionRecordings)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${showSessionRecordings ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${showSessionRecordings ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Multiple session times */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-medium text-gray-dark">Multiple session times</p>
              <button
                onClick={() => setMultipleSessionTimes(!multipleSessionTimes)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${multipleSessionTimes ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${multipleSessionTimes ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Add to calendar */}
            {multipleSessionTimes && (
              <>
                <p className="mb-2.5 mt-4 text-[14px] font-medium uppercase tracking-[0.5px] text-gray-light">Add to calendar</p>
                <div className="flex flex-col gap-2">
                  {calendarVariants.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setCalendarVariant(value)}
                      className="flex cursor-pointer items-center gap-2.5 text-[16px] leading-[1.2]"
                    >
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${calendarVariant === value ? "border-[#038561] bg-[#038561]" : "border-gray-300"}`}>
                        {calendarVariant === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className={calendarVariant === value ? "font-medium text-gray-dark" : "text-gray-light"}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
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
