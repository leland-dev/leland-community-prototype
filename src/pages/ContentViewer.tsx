// Course lesson viewer — mirrors the monorepo course viewer
// (CourseViewerShell / CourseViewerSidebar / CourseViewerSectionNav on the
// feature/course-viewer branch) using the ported leland design system:
// leland tokens, icons, Button/Menu/ProgressBar, and the CourseFeedbackModal.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type SVGProps,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CourseFeedbackModal } from "../components/CourseFeedbackModal";
import TopNav from "../components/TopNav";
import {
  IconLeftSidebarClose,
  IconLeftSidebarOpen,
} from "../components/icons/left-sidebar";
import {
  BrandLelandLogoSilhouette,
  Button,
  ButtonColor,
  ButtonSize,
  IconCalendar,
  IconCalendarAlt,
  IconLivestreamSignal,
  IconPlayVideo,
  IconCheck,
  IconClock,
  IconArrowUpRight,
  IconBooks,
  IconModules,
  IconExperiences,
  IconLightning,
  IconOnboarding,
  IconGift,
  IconQuestion,
  IconUserProfileGroup,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconText,
  IconLink,
  IconRecurring,
  IconDotsHorizontal,
  IconDownload,
  IconHelp,
  IconShare,
  IconMenuBurger,
  IconStar,
  IconStarOutline,
  IconWrite,
  IconX,
  Menu,
  Modal,
  ModalContent,
  ModalSize,
  ProgressBar,
  ProgressBarColor,
  Tag,
  TagColor,
  TagSize,
  ButtonWidth,
  FontWeight,
  getButtonStyles,
  withModal,
  type MenuItemSection,
  type ModalProps,
} from "../components/leland";
import lessonData from "../data/aiBuilderL1Lessons.json";
import type {
  Block,
  BlockSection,
  LiveSessionVariant,
} from "../data/lessonBlocks";
import { LESSON_1_SECTIONS, LESSON_1_TOP_BLOCKS } from "../data/sampleLesson";
import {
  BlockList,
  LessonFooterActions,
  LessonPageProvider,
  LiveElapsedTime,
  LiveSessionCallout,
} from "../components/lesson-blocks";
import { SwitchInput } from "../components/leland";
import { GettingStartedFlow, type FlowKey } from "../components/getting-started";
import { COHORT_MEMBERS } from "./Group";
import { SelectCohortModal } from "../components/LiveCourseCard";

// ─── Types & seed data ───────────────────────────────────────────────────────

type SectionKind = "html" | "video" | "pdf";
type SectionBadge = "required" | "recommended" | "optional";

// Legacy media section: rendered via iframe/video (lessons 2–4).
type MediaSection = {
  id: string;
  title: string;
  durationMin?: number | null;
  kind: SectionKind;
  src: string;
  badge?: SectionBadge;
};

// Interactive section: a native multi-step getting-started flow (IT setup,
// skills assessment, personalization), rendered by a mapped React component.
type InteractiveSection = {
  id: string;
  title: string;
  badge?: SectionBadge;
  durationMin?: number | null;
  kind: "interactive";
  flow: FlowKey;
};

// A section is either a legacy media section, a native block section
// (BlockSection), or an interactive flow. Chosen per-section by `kind`.
type Section = MediaSection | BlockSection | InteractiveSection;

type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  durationMin: number;
  sections: Section[];
  // Product/CTA blocks rendered above the body on every section of this lesson.
  topBlocks?: Block[];
};

const COURSE_TITLE = "AI Builder Program Level 1";
const COURSE_TITLE_FULL = "AI Builder Program Level 1: Use AI to 10x your impact";
const COURSE_DESCRIPTION =
  "Learn to build AI-powered applications using Claude — from foundational prompting to deploying production-ready tools.";
const COURSE_HOME = "/course/ai-builder-l1";
const DASHBOARD = "/dashboard";

// The community page opens externally (new tab) — it's the existing group page.
const COMMUNITY_GROUP_ID = "ai-bp-apr-26";

// Lessons 2–4 come from the generated manifest (legacy HTML iframe sections).
// Lesson 1 is the block/CMS demo: hand-authored native block sections (incl. an
// inline video recording), plus a demo PDF section so a media section still
// coexists with block sections.
const LESSONS: Lesson[] = (lessonData as Lesson[]).map((lesson) =>
  lesson.number === 1
    ? {
        ...lesson,
        topBlocks: LESSON_1_TOP_BLOCKS,
        sections: LESSON_1_SECTIONS,
      }
    : lesson,
);

const START_HERE: Lesson = {
  id: "start-here",
  number: 0,
  title: "Get set up before Lesson 1",
  subtitle: "Complete these steps before your first session so you're ready to hit the ground running.",
  durationMin: 20,
  sections: [
    { id: "add-to-calendar", title: "Add sessions to your calendar", kind: "interactive", flow: "add-to-calendar" },
    { id: "setup-tools", title: "Set up your tools & permissions", kind: "interactive", flow: "it-setup" },
    { id: "join-cohort", title: "Join your Slack community", kind: "interactive", flow: "join-cohort" },
    { id: "personalize", title: "Personalize your experience", kind: "interactive", flow: "personalization" },
  ],
};

// ALL_LESSONS includes Start Here at position 0 for routing and sidebar.
// LESSONS is kept separate so LIVE_SESSIONS numbering is unaffected.
const ALL_LESSONS: Lesson[] = [START_HERE, ...LESSONS];

// ─── Completion state (localStorage, prototype-only) ────────────────────────

const COMPLETION_KEY = "content-viewer-completed";

function loadCompleted(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(COMPLETION_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function useCompletion() {
  const [completed, setCompleted] = useState<Set<string>>(loadCompleted);
  const markComplete = (lessonId: string, sectionId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(`${lessonId}/${sectionId}`);
      localStorage.setItem(COMPLETION_KEY, JSON.stringify([...next]));
      return next;
    });
  };
  return { completed, markComplete };
}

// ─── Section content ─────────────────────────────────────────────────────────

function SectionContent({ section }: { section: MediaSection }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [htmlHeight, setHtmlHeight] = useState(1200);

  useEffect(() => { setHtmlHeight(1200); }, [section.src]);

  const handleHtmlLoad = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    // .dirB-page is the actual content container — its scrollHeight is correct
    // regardless of the parent body/grid overflow constraints.
    const measure = () => {
      const page = doc.querySelector('.dirB-page');
      const h = page ? page.scrollHeight : doc.body.scrollHeight;
      if (h > 200) setHtmlHeight(h);
    };
    measure();
    // Re-measure once after renderer finishes any async work
    setTimeout(measure, 300);
  }, []);

  if (section.kind === "video") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <video src={section.src} controls className="max-h-full max-w-full" />
      </div>
    );
  }
  if (section.kind === "pdf") {
    return (
      <iframe
        src={section.src}
        title={section.title}
        className="absolute inset-0 h-full w-full border-0 bg-leland-gray-hover"
      />
    );
  }
  return (
    <iframe
      ref={iframeRef}
      src={section.src}
      title={section.title}
      onLoad={handleHtmlLoad}
      scrolling="no"
      style={{ height: htmlHeight }}
      className="block w-full border-0 bg-white"
    />
  );
}

// ─── Live program placeholder data ───────────────────────────────────────────

type SlotStatus =
  | { kind: 'available' }
  | { kind: 'recording' }
  | { kind: 'upcoming'; label: string };

type TimeSlot = {
  time: string;
  status: SlotStatus;
};

type LiveSession = {
  number: number;
  title: string;
  description: string;
  date: Date;
  timeSlots: TimeSlot[];
  durationMin: number;
  recordingVideoSrc?: string;
  meetingUrl?: string;
};

type BuildSession = {
  title: string;
  date: Date;
  isRecording?: boolean;
};

const BUILD_SESSIONS: BuildSession[] = [
  { title: "Foundations build session", date: new Date(2026, 3, 22) },
  { title: "Advanced prompting build session", date: new Date(2026, 3, 29) },
  { title: "Deployment build session", date: new Date(2026, 4, 6) },
  { title: "Intro build session", date: new Date(2026, 3, 15), isRecording: true },
  { title: "Kickoff build session", date: new Date(2026, 3, 8), isRecording: true },
];

// Placeholder schedule — swap for real cohort data
const LIVE_SESSION_DATES = [
  new Date(2026, 3, 21),
  new Date(2026, 3, 24),
  new Date(2026, 3, 28),
  new Date(2026, 4, 1),
];

const RECORDING_VIDEO_SRC =
  "https://tannerthelin.github.io/courses-prototype/assets/8814086-hd_1920_1080_25fps-Bbf7RRvH.mp4";

const LIVE_SESSIONS: LiveSession[] = LESSONS.map((l, i) => ({
  number: i + 1,
  title: l.title,
  description: l.subtitle,
  date: LIVE_SESSION_DATES[i] ?? LIVE_SESSION_DATES[0],
  durationMin: 90,
  meetingUrl: `/program/session/session-${i + 1}`,
  recordingVideoSrc: i === 0 ? RECORDING_VIDEO_SRC : undefined,
  timeSlots: i === 0
    ? [
        { time: "11:00 AM PT", status: { kind: 'recording' } as SlotStatus },
      ]
    : [
        { time: "11:00 AM PT", status: { kind: 'available' } as SlotStatus },
        { time: "4:00 PM PT", status: { kind: 'available' } as SlotStatus },
      ],
}));

const formatSessionDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// ─── Sidebar (mirrors CourseViewerSidebar.client.tsx) ────────────────────────

// 'overview' is the two-tab sidebar's Overview tab (cohort + program resources +
// the live-sessions/calendar main view). 'live' is the legacy sidebar's calendar
// tab; both route to the same overview main content.
type SidebarTab = 'lessons' | 'live' | 'resources' | 'community' | 'overview';

const SIDEBAR_TABS: { id: SidebarTab; label: string }[] = [
  { id: 'lessons', label: 'Lessons' },
  { id: 'live', label: 'Live program' },
  { id: 'resources', label: 'More' },
];

// Circular completion indicator. A filled check at 100%; otherwise a ring
// whose arc tracks percent — inline SVG because strokeDashoffset must vary at
// runtime (per the frontend-common-patterns icon rule).
function CircularProgress({ percent }: { percent: number }) {
  if (percent >= 100) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-leland-gray-dark">
        <IconCheck className="size-3 text-white" />
      </span>
    );
  }
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 -rotate-90" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
        className="text-leland-gray-stroke"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="text-leland-gray-dark"
      />
    </svg>
  );
}

function lessonProgress(lesson: Lesson, completed: Set<string>): number {
  const total = lesson.sections.length;
  if (total === 0) return 0;
  const done = lesson.sections.filter((s) =>
    completed.has(`${lesson.id}/${s.id}`),
  ).length;
  return (done / total) * 100;
}

function CohortCard({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-leland-gray-stroke bg-leland-gray-hover px-3 pb-3 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-1 px-1 text-left"
      >
        <div className="flex flex-1 flex-col gap-1">
          <p className="leland-paragraph-base font-medium text-leland-gray-light">
            Your cohort
          </p>
          <p className="leland-heading-2xl font-semibold text-leland-gray-dark">
            Apr 21 – May 8
          </p>
        </div>
        {open ? (
          <IconChevronUp className="size-4 shrink-0 text-leland-gray-light" />
        ) : (
          <IconChevronDown className="size-4 shrink-0 text-leland-gray-light" />
        )}
      </button>
      {open ? (
        <div className="flex flex-col gap-1 border-t border-leland-gray-stroke pb-2 pt-4">
          <p className="leland-paragraph-base font-medium text-leland-gray-dark">
            Tuesdays &amp; Fridays
          </p>
          <p className="leland-paragraph-base text-leland-gray-light">
            11:00 AM or 4:00 PM PT · 90 min
          </p>
        </div>
      ) : null}
      <div className="px-1">
        <Button
          label="Switch cohorts"
          buttonColor={ButtonColor.SECONDARY}
          size={ButtonSize.SMALL}
          LeftIcon={IconRecurring}
          rounded
        />
      </div>
    </div>
  );
}

function LiveSessionsList({
  selectedSessionNumber,
  onSelectSession,
}: {
  selectedSessionNumber: number | null;
  onSelectSession: (n: number) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          label="Office hours"
          buttonColor={ButtonColor.SECONDARY}
          size={ButtonSize.SMALL}
          RightIcon={IconArrowUpRight}
          rounded
        />
      </div>
      <div className="flex flex-col gap-2">
        {LIVE_SESSIONS.map((session) => (
          <button
            key={session.number}
            type="button"
            onClick={() => onSelectSession(session.number)}
            className={`flex items-center gap-3 rounded-lg p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
              selectedSessionNumber === session.number
                ? "bg-leland-gray-hover"
                : "hover:bg-leland-gray-hover"
            }`}
          >
            <div className="flex size-12 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke">
              <div className="flex items-center justify-center bg-leland-primary px-2.5 pb-0.5 pt-[3px]">
                <span className="leland-eyebrow text-[10px] font-semibold tracking-[1px] text-leland-gray-dark">
                  {session.date.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center bg-white">
                <span className="leland-heading-xl font-semibold text-leland-gray-dark">
                  {session.date.getDate()}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="leland-subtext-sm text-leland-gray-light">
                Session {session.number}
              </p>
              <p className="leland-paragraph-base font-medium text-leland-gray-dark">
                {session.title}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <p className="leland-eyebrow font-medium text-leland-gray-light shrink-0">Also included</p>
          <div className="h-px flex-1 bg-leland-gray-stroke" />
        </div>
        <div className="flex flex-col gap-1">
          {BUILD_SESSIONS.filter((s) => !s.isRecording).map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-3 hover:bg-leland-gray-hover">
              <div className="flex size-12 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke">
                <div className="flex items-center justify-center bg-leland-gray-hover px-2.5 pb-0.5 pt-[3px]">
                  <span className="leland-eyebrow text-[10px] font-semibold tracking-[1px] text-leland-gray-light">
                    {s.date.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center bg-white">
                  <span className="leland-heading-xl font-semibold text-leland-gray-dark">
                    {s.date.getDate()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="leland-subtext-sm text-leland-gray-light">Extra build session</p>
                <p className="leland-paragraph-base font-medium text-leland-gray-dark">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ResourcesPanel() {
  return (
    <>
      <div className="flex flex-col gap-3 border-b border-leland-gray-stroke pb-6">
        <p className="leland-paragraph-base text-leland-gray-light">
          Learn to build AI-powered applications using Claude — from foundational prompting to deploying production-ready tools.
        </p>
        <p className="leland-paragraph-sm text-leland-gray-light">
          4 lessons · ~12 hours
        </p>
      </div>
      <div className="flex flex-col gap-1 -mx-2">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary">
          <IconCalendar className="size-4 shrink-0 text-leland-gray-light" />
          <span className="leland-paragraph-base text-leland-gray-dark">Office hours</span>
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary">
          <IconHelp className="size-4 shrink-0 text-leland-gray-light" />
          <span className="leland-paragraph-base text-leland-gray-dark">Get help</span>
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary">
          <IconShare className="size-4 shrink-0 text-leland-gray-light" />
          <span className="leland-paragraph-base text-leland-gray-dark">Share this course</span>
        </button>
      </div>
    </>
  );
}

type LiveSessionBannerState = "upcoming" | "upcoming-multiple" | "live" | "recording";

// Prototype: assign a different state per lesson to demo all variants
const LESSON_BANNER_STATES: LiveSessionBannerState[] = [
  "recording",
  "live",
  "upcoming-multiple",
  "upcoming",
];

function LiveSessionBanner({ state, href }: { state: LiveSessionBannerState; href: string }) {
  const isLive = state === "live";
  const [elapsedSec, setElapsedSec] = useState(636); // start at 10m 36s

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isLive]);

  const liveTime = `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`;
  const isRecording = state === "recording";
  const isUpcomingMultiple = state === "upcoming-multiple";

  return (
    <Link
      to={href}
      className={
        isLive
          ? "group inline-flex w-fit items-center gap-2 py-1 text-[13px] font-medium text-leland-red focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          : "inline-flex w-fit items-center gap-2 py-1 text-[13px] font-medium text-leland-gray-extra-light decoration-[1.5px] underline-offset-4 hover:underline hover:decoration-dotted focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
      }
    >
      {isLive ? (
        <IconLivestreamSignal className="size-4 shrink-0" />
      ) : isRecording ? (
        <IconPlayVideo className="size-4 shrink-0" />
      ) : (
        <IconCalendarAlt className="size-4 shrink-0" />
      )}
      <span>
        {isLive && (
          <>
            <span className="decoration-[1.5px] underline-offset-4 group-hover:underline group-hover:decoration-dotted">Live now</span>
            <span className="text-leland-gray-extra-light"> · {liveTime}</span>
          </>
        )}
        {isRecording && "Watch session recording"}
        {state === "upcoming" && "Live session starts in 2d"}
        {isUpcomingMultiple && (
          <>
            <span>Live session</span>
            <span className="text-leland-gray-extra-light"> · 2 times available</span>
          </>
        )}
      </span>
      {isRecording && (
        <IconChevronRight className="size-4 shrink-0 text-leland-gray-extra-light" />
      )}
    </Link>
  );
}

function LessonAccordion({
  currentLessonId,
  currentSectionId,
  completed,
  liveProgram = false,
  showSessionBanners = true,
}: {
  currentLessonId: string;
  currentSectionId: string;
  completed: Set<string>;
  liveProgram?: boolean;
  showSessionBanners?: boolean;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([currentLessonId]),
  );

  useEffect(() => {
    setExpanded((prev) => new Set(prev).add(currentLessonId));
  }, [currentLessonId]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <div className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto pt-3">
      {ALL_LESSONS.map((l, idx) => {
        const isStartHere = l.id === "start-here";
        const percent = lessonProgress(l, completed);
        const completedCount = l.sections.filter((s) =>
          completed.has(`${l.id}/${s.id}`),
        ).length;
        const totalCount = l.sections.length;
        const isOpen = expanded.has(l.id);
        return (
          <div
            key={l.id}
            className="flex flex-col gap-5 border-b border-leland-gray-stroke py-5"
          >
            <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => toggle(l.id)}
              className="flex flex-col gap-1.5 rounded px-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
            >
              <span className="leland-heading-lg font-semibold text-leland-gray-dark">
                {isStartHere ? "Before you begin" : `Lesson ${idx}`}
                {l.durationMin ? (
                  <span className="leland-paragraph-sm font-normal normal-case tracking-normal text-leland-gray-extra-light"><span className="mx-1.5">·</span>{l.durationMin}m</span>
                ) : null}
              </span>
              <span className="flex items-center gap-3">
                <span className="flex-1 leland-paragraph-base text-leland-gray-light">
                  {l.title}
                </span>
                <span role="img" aria-label={`${completedCount}/${totalCount} complete`}>
                  <CircularProgress percent={percent} />
                </span>
                <IconChevronDown
                  className="size-5 shrink-0 text-leland-gray-light transition-transform"
                  style={isOpen ? { transform: "rotate(180deg)" } : undefined}
                />
              </span>
            </button>
            {liveProgram && showSessionBanners && !isStartHere && l.sections.length > 0 && (
              <div className="px-6">
                <LiveSessionBanner
                  state={LESSON_BANNER_STATES[(idx - 1) % LESSON_BANNER_STATES.length]}
                  href={`/content-viewer/${l.id}/${l.sections[0].id}`}
                />
              </div>
            )}
            </div>
            {isOpen ? (
              <div className="flex flex-col gap-1 px-3">
                {l.sections.map((s, sIdx) => {
                  const sectionDone = completed.has(`${l.id}/${s.id}`);
                  const active =
                    l.id === currentLessonId && s.id === currentSectionId;
                  const badge = (s as MediaSection).badge;
                  return (
                    <Link
                      key={s.id}
                      id={`sidebar-section-${s.id}`}
                      to={`/content-viewer/${l.id}/${s.id}`}
                      className={`flex items-center gap-2.5 rounded-lg p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                        active ? "bg-leland-gray-hover" : "hover:bg-leland-gray-hover"
                      }`}
                    >
                      <span className="relative shrink-0">
                        <span
                          className={`flex size-8 items-center justify-center rounded-full ${
                            sectionDone
                              ? "bg-leland-gray-dark"
                              : active
                                ? "border-[1.5px] border-leland-gray-extra-light bg-white"
                                : badge === "required"
                                  ? "border border-leland-blue-light-hover bg-leland-blue-light"
                                  : "border border-leland-gray-stroke bg-white"
                          }`}
                        >
                          {sectionDone ? (
                            <IconCheck className="size-3.5 text-white" />
                          ) : (
                            <span className="leland-heading-base font-semibold text-leland-gray-light">
                              {sIdx + 1}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1 leland-paragraph-base font-medium text-leland-gray-dark">
                        {s.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SidebarMenuItem({
  Icon,
  label,
  subtext,
  active,
  external,
  onClick,
}: {
  Icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  subtext?: string;
  active?: boolean;
  external?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
        active ? "bg-leland-gray-solid-hover" : "hover:bg-leland-gray-hover"
      }`}
    >
      <Icon className="size-6 shrink-0 text-leland-gray-dark" />
      <span className="min-w-0 flex-1">
        <span className="block leland-paragraph-base font-medium text-leland-gray-dark">
          {label}
        </span>
        {subtext ? (
          <span className="block leland-paragraph-sm text-leland-gray-light">
            {subtext}
          </span>
        ) : null}
      </span>
      {external ? (
        <IconArrowUpRight className="size-5 shrink-0 text-leland-gray-light" />
      ) : (
        <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
      )}
    </button>
  );
}

const SIDEBAR_TABS_TWO: { id: SidebarTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "lessons", label: "Lessons" },
];

function LessonsAccordionSidebar({
  currentLessonId,
  currentSectionId,
  completed,
  onToggle,
  tab,
  onTabChange,
  onSwitchCohort,
  hideTabs = false,
  liveProgram = true,
  showSessionBanners = true,
  exitDestination,
  noHeader = true,
}: {
  currentLessonId: string;
  currentSectionId: string;
  completed: Set<string>;
  onToggle: () => void;
  tab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onSwitchCohort: () => void;
  hideTabs?: boolean;
  liveProgram?: boolean;
  showSessionBanners?: boolean;
  exitDestination: string;
  noHeader?: boolean;
}) {
  return (
    <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-leland-gray-stroke bg-white">
      {/* Program info card — always shown in lessons-only sidebar */}
      <div className="flex flex-col gap-3 border-b border-leland-gray-stroke px-6 pb-6 pt-6">
        {/* Back link */}
        {noHeader && (
          <Link
            to={exitDestination}
            className="inline-flex items-center gap-1 leland-paragraph-sm text-leland-gray-light hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary rounded"
          >
            <IconChevronLeft className="size-3.5 shrink-0" />
            My content
          </Link>
        )}
        <p className="font-season text-heading-3xl font-normal text-leland-gray-dark">
          {COURSE_TITLE_FULL}
        </p>
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}leland-profile.png`}
            alt="Leland"
            className="size-5 shrink-0 rounded-full object-cover"
          />
          <span className="leland-paragraph-base text-leland-gray-extra-light">Created by Leland</span>
        </div>
      </div>
      {(!hideTabs && liveProgram) && (
        /* Two-tab header (Overview / Lessons) */
        <div className="flex items-center gap-8 border-b border-leland-gray-stroke px-3">
          <div className="flex flex-1 items-center gap-8 px-3">
            {SIDEBAR_TABS_TWO.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`border-b-[3px] py-6 leland-paragraph-lg font-medium focus:outline-none ${
                  tab === id
                    ? "border-leland-gray-dark text-leland-gray-dark"
                    : "border-transparent text-leland-gray-light hover:text-leland-gray-dark"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!hideTabs && liveProgram && tab === "overview" ? (
        <div className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {/* Cohort summary */}
          <div className="flex items-center gap-3 p-3">
            <div className="flex w-10 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke shadow-sm">
              <div className="flex items-center justify-center bg-leland-blue px-2 py-0.5">
                <span className="text-[9px] font-semibold leading-none tracking-[1px] text-leland-gray-dark">MAY</span>
              </div>
              <div className="flex flex-1 items-center justify-center bg-white px-2 pb-1 pt-0.5">
                <span className="leland-heading-base font-semibold text-leland-gray-dark">24</span>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="leland-heading-base font-semibold text-leland-gray-dark">May 16 – Jun 8</p>
              <div className="flex items-center gap-1.5">
                <IconRecurring className="size-[15px] shrink-0 text-leland-gray-light" />
                <button
                  type="button"
                  onClick={onSwitchCohort}
                  className="leland-paragraph-sm text-leland-gray-light underline decoration-dotted underline-offset-2 focus:outline-none"
                >
                  Switch cohort
                </button>
              </div>
            </div>
          </div>

          <div className="mx-3 border-t border-leland-gray-stroke" />

          {/* Program resources — Calendar is in-app; the rest open externally */}
          <div className="flex flex-col gap-1 pt-2">
            <SidebarMenuItem
              Icon={IconCalendarAlt}
              label="Calendar"
              active
              onClick={() => onTabChange("overview")}
            />
            <SidebarMenuItem
              Icon={IconExperiences}
              label="Office hours"
              external
              onClick={() =>
                window.open(
                  "https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours",
                  "_blank",
                  "noopener",
                )
              }
            />
            <SidebarMenuItem
              Icon={IconUserProfileGroup}
              label="Slack community"
              external
              onClick={() =>
                window.open(`/groups/${COMMUNITY_GROUP_ID}`, "_blank", "noopener")
              }
            />
            <SidebarMenuItem
              Icon={IconBooks}
              label="Your cohort's builds"
              external
              onClick={() => {}}
            />
            <SidebarMenuItem
              Icon={IconBooks}
              label="Knowledge hub"
              external
              onClick={() => {}}
            />
          </div>
        </div>
      ) : (
        <LessonAccordion
          currentLessonId={currentLessonId}
          currentSectionId={currentSectionId}
          completed={completed}
          liveProgram={liveProgram}
          showSessionBanners={showSessionBanners}
        />
      )}
    </aside>
  );
}

function CombinedSidebar({
  currentLessonId,
  currentSectionId,
  completed,
  onToggle,
  onSwitchCohort,
  tab,
  onTabChange,
  liveProgram = true,
  showSessionBanners = true,
  seeMoreOpen,
  onSeeMoreChange,
  exitDestination,
  noHeader = true,
}: {
  currentLessonId: string;
  currentSectionId: string;
  completed: Set<string>;
  onToggle: () => void;
  onSwitchCohort: () => void;
  tab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  liveProgram?: boolean;
  showSessionBanners?: boolean;
  seeMoreOpen: boolean;
  onSeeMoreChange: (open: boolean) => void;
  exitDestination: string;
  noHeader?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const courseInfoRef = useRef<HTMLParagraphElement>(null);
  const [resourcesInView, setResourcesInView] = useState(true);
  const [courseInfoInView, setCourseInfoInView] = useState(true);

  useEffect(() => {
    if (!liveProgram) return;
    const scroll = scrollRef.current;
    const target = resourcesRef.current;
    if (!scroll || !target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setResourcesInView(entry.isIntersecting),
      { root: scroll, threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [liveProgram]);

  useEffect(() => {
    const scroll = scrollRef.current;
    const target = courseInfoRef.current;
    if (!scroll || !target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setCourseInfoInView(entry.isIntersecting),
      { root: scroll, threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <aside className="relative flex w-full shrink-0 flex-col overflow-hidden bg-white md:w-[360px] md:border-r md:border-leland-gray-stroke">
      {/* Persistent header — always visible, outside the scroll container */}
      <div className={`flex shrink-0 items-center gap-6 bg-white px-6 pt-4 ${courseInfoInView ? "pb-2" : "pb-0"}`}>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {noHeader ? (
            <Link
              to={exitDestination}
              className={`inline-flex shrink-0 items-center gap-1 text-leland-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-4 hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary rounded ${courseInfoInView ? "leland-paragraph-base" : "leland-paragraph-sm"}`}
            >
              <IconChevronLeft className="size-3.5 shrink-0" />
              My content
            </Link>
          ) : null}
          {noHeader && !courseInfoInView && (
            <>
              <span className="shrink-0 leland-paragraph-sm text-leland-gray-light" aria-hidden>/</span>
              <span className="min-w-0 flex-1 truncate leland-paragraph-sm text-leland-gray-extra-light">{COURSE_TITLE_FULL}</span>
            </>
          )}
        </div>
        <button
          onClick={onToggle}
          aria-label="Close menu"
          className="ml-auto flex shrink-0 items-center justify-center px-0 py-3 text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          {/* Drawer on mobile (X); collapse toggle on desktop */}
          <IconX className="size-6 md:hidden" aria-hidden />
          <IconLeftSidebarClose className="hidden size-6 md:block" aria-hidden />
        </button>
      </div>

      {/* Pinned cohort row — shown once the resources section has scrolled out of view. */}
      {liveProgram && !resourcesInView && (
        <button
          type="button"
          onClick={scrollToTop}
          className="flex w-full items-center gap-3 border-b border-leland-gray-stroke px-6 py-4 shadow-sm hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-leland-primary"
        >
          <div className="flex h-9 w-9 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke shadow-sm">
            <div className="flex items-center justify-center bg-leland-blue px-1.5 pb-0.5 pt-[3px]">
              <span className="text-[8px] font-semibold leading-none tracking-[0.8px] text-leland-gray-dark">MAY</span>
            </div>
            <div className="flex flex-1 items-center justify-center bg-white">
              <span className="leland-heading-base font-semibold text-leland-gray-dark">24</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
            <p className="leland-heading-base font-semibold text-leland-gray-dark">May 16 – Jun 8</p>
            <p className="leland-paragraph-sm text-leland-gray-light">Cohort details</p>
          </div>
          <IconChevronUp className="size-4 shrink-0 text-leland-gray-light" />
        </button>
      )}

      <div ref={scrollRef} className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto pb-12">
        {/* Program info card */}
        <div className="w-full bg-white pb-5">
          <div className="flex flex-col">
            <div className="flex flex-col gap-3 px-6 pt-2">
              {/* Program title */}
              <p ref={courseInfoRef} className="text-heading-3xl font-season font-normal text-leland-gray-dark">{COURSE_TITLE_FULL}</p>

              {liveProgram && (
                <button
                  type="button"
                  onClick={onSwitchCohort}
                  className="mt-3 self-start rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                >
                  <Tag
                    text="May 16 – Jun 8 cohort"
                    tagColor={TagColor.WHITE}
                    size={TagSize.LARGE}
                    RightIcon={IconRecurring}
                    hoverable
                  />
                </button>
              )}

              {/* Creator */}
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={`${import.meta.env.BASE_URL}leland-profile.png`}
                  alt="Leland"
                  className="size-5 shrink-0 rounded-full object-cover"
                />
                <span className="leland-paragraph-base text-leland-gray-extra-light">Created by Leland</span>
              </div>
            </div>
          </div>

          <>
              {/* Expanded "See more" items */}
              {seeMoreOpen && (
                <div className="flex flex-col gap-1 px-3 pt-4">
                  {liveProgram && (
                    <>
                      <SidebarMenuItem
                        Icon={IconExperiences}
                        label="Office hours"
                        external
                        onClick={() => window.open("https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours", "_blank", "noopener")}
                      />
                    </>
                  )}
                  {liveProgram && (
                    <>
                      <SidebarMenuItem
                        Icon={IconUserProfileGroup}
                        label="Slack community"
                        external
                        onClick={() => window.open(`/groups/${COMMUNITY_GROUP_ID}`, "_blank", "noopener")}
                      />
                      <SidebarMenuItem
                        Icon={IconBooks}
                        label="Your cohort's builds"
                        external
                        onClick={() => {}}
                      />
                      <SidebarMenuItem
                        Icon={IconBooks}
                        label="Knowledge hub"
                        external
                        onClick={() => {}}
                      />
                    </>
                  )}
                  <SidebarMenuItem
                    Icon={IconGift}
                    label="Refer a friend"
                    external
                    onClick={() => {}}
                  />
                </div>
              )}

              {/* See more / see less toggle */}
              <div ref={resourcesRef} className="px-3 pt-3">
                <button
                  type="button"
                  onClick={() => onSeeMoreChange(!seeMoreOpen)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-leland-gray-hover px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                >
                  <span className="leland-heading-base text-leland-gray-dark">See all resources</span>
                  <IconChevronDown
                    className={`size-5 text-leland-gray-dark transition-transform duration-200 ${seeMoreOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </>
        </div>

        {/* Lesson accordion */}
        <div className="relative">
          <LessonAccordion
            currentLessonId={currentLessonId}
            currentSectionId={currentSectionId}
            completed={completed}
            liveProgram={liveProgram}
            showSessionBanners={showSessionBanners}
          />
        </div>
      </div>
    </aside>
  );
}

function CourseViewerSidebar({
  lesson,
  lessonIdx,
  currentSectionId,
  isCompleted,
  onToggle,
  tab,
  onTabChange,
  selectedSessionNumber,
  onSelectSession,
}: {
  lesson: Lesson;
  lessonIdx: number;
  currentSectionId: string;
  isCompleted: (sectionId: string) => boolean;
  onToggle: () => void;
  tab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  selectedSessionNumber: number | null;
  onSelectSession: (n: number) => void;
}) {
  const [cohortOpen, setCohortOpen] = useState(false);

  const entries = lesson.sections;
  const completedCount = entries.filter((e) => isCompleted(e.id)).length;
  const totalCount = entries.length;

  return (
    <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-leland-gray-stroke bg-white">
      {/* Course title + collapse toggle */}
      <div className="flex items-center gap-3 pl-6 pr-4 pt-4">
        <p className="min-w-0 flex-1 truncate leland-heading-base font-medium text-leland-gray-dark">
          {COURSE_TITLE_FULL}
        </p>
        <button
          onClick={onToggle}
          className="flex size-10 shrink-0 items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
          aria-label="Close sidebar"
        >
          <IconLeftSidebarClose className="size-6" aria-hidden />
        </button>
      </div>

      {/* Scrollable main content — horizontal padding lives on the inner
          blocks so the section list's scrollbar sits flush against the
          sidebar's right edge */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden pt-6">
        {tab === 'lessons' ? (
          <>
            {/* Lesson badge + title + progress */}
            <div className="flex flex-col gap-4 px-6">
              <div className="flex flex-col gap-1">
                <p className="leland-heading-base text-leland-gray-light">
                  Lesson {lessonIdx + 1}
                </p>
                <p className="leland-heading-2xl font-semibold text-leland-gray-dark">
                  {lesson.title}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="leland-paragraph-sm text-leland-gray-light">
                  {completedCount} of {totalCount} complete
                </p>
                <ProgressBar
                  value={
                    totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                  }
                  color={ProgressBarColor.Dark}
                  trackClassName="bg-leland-gray-stroke"
                />
              </div>
            </div>

            {/* Section list */}
            <div className="sidebar-scrollbar relative min-h-0 flex-1 overflow-y-auto pl-4">
              <div className="flex flex-col gap-1">
                {entries.map((entry, idx) => {
                  const isActive = entry.id === currentSectionId;
                  const completed = isCompleted(entry.id);
                  return (
                    <Link
                      key={entry.id}
                      to={`/content-viewer/${lesson.id}/${entry.id}`}
                      className={`flex items-center gap-2.5 rounded-lg p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary${isActive ? " bg-leland-gray-hover" : ""}`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? "bg-leland-gray-dark"
                            : isActive
                              ? "border-[1.5px] border-leland-gray-extra-light bg-white"
                              : "border border-leland-gray-stroke bg-white"
                        }`}
                      >
                        {completed ? (
                          <IconCheck className="size-3.5 text-white" />
                        ) : (
                          <span className="leland-heading-base text-leland-gray-light">
                            {idx + 1}
                          </span>
                        )}
                      </span>
                      <span className="leland-paragraph-base min-w-0 flex-1 font-medium text-leland-gray-dark">
                        {entry.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
            </div>
          </>
        ) : tab === 'live' ? (
          <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-4 px-4 pb-6">
            <CohortCard
              open={cohortOpen}
              onToggle={() => setCohortOpen((o) => !o)}
            />
            <LiveSessionsList
              selectedSessionNumber={selectedSessionNumber}
              onSelectSession={onSelectSession}
            />
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-6 px-6 pb-6">
            <ResourcesPanel />
          </div>
        )}
      </div>

    </aside>
  );
}

// ─── Prototype options (meta-UI for demoing variants, not product UI) ────────

type PrototypeOptions = {
  liveProgram: boolean;
  noHeader: boolean;
  showSiteNav: boolean;
  liveSessionVariant: LiveSessionVariant;
};

// Keys whose value is a boolean (rendered as toggles).
type BooleanOptionKey = {
  [K in keyof PrototypeOptions]: PrototypeOptions[K] extends boolean ? K : never;
}[keyof PrototypeOptions];

const PROTOTYPE_OPTIONS_KEY = "content-viewer-prototype-options";

const DEFAULT_PROTOTYPE_OPTIONS: PrototypeOptions = {
  liveProgram: true,
  noHeader: true,
  showSiteNav: false,
  liveSessionVariant: "addToCalendar",
};

const BOOLEAN_OPTIONS: { key: BooleanOptionKey; label: string }[] = [
  { key: "liveProgram", label: "Live program" },
  { key: "noHeader", label: "No header" },
  { key: "showSiteNav", label: "Show site nav" },
];


const LIVE_SESSION_VARIANT_OPTIONS: {
  value: LiveSessionVariant;
  label: string;
}[] = [
  { value: "addToCalendar", label: "Upcoming — add to calendar" },
  { value: "addedToCalendar", label: "Added — countdown" },
  { value: "watchRecording", label: "Recording available" },
  { value: "joinNow", label: "Live now — join" },
];

function usePrototypeOptions() {
  const [options, setOptions] = useState<PrototypeOptions>(() => {
    try {
      return {
        ...DEFAULT_PROTOTYPE_OPTIONS,
        ...JSON.parse(localStorage.getItem(PROTOTYPE_OPTIONS_KEY) ?? "{}"),
      };
    } catch {
      return DEFAULT_PROTOTYPE_OPTIONS;
    }
  });
  const persist = (next: PrototypeOptions) => {
    localStorage.setItem(PROTOTYPE_OPTIONS_KEY, JSON.stringify(next));
    return next;
  };
  const toggleOption = (key: BooleanOptionKey) =>
    setOptions((prev) => persist({ ...prev, [key]: !prev[key] }));
  const setOption = <K extends keyof PrototypeOptions>(
    key: K,
    value: PrototypeOptions[K],
  ) => setOptions((prev) => persist({ ...prev, [key]: value }));
  return { options, toggleOption, setOption };
}


const PrototypeOptionsModal = withModal(function PrototypeOptionsModal({
  options,
  onToggle,
  onSetVariant,
  ...modalProps
}: ModalProps & {
  options: PrototypeOptions;
  onToggle: (key: BooleanOptionKey) => void;
  onSetVariant: (variant: LiveSessionVariant) => void;
}) {
  return (
    <Modal {...modalProps}>
      <ModalContent size={ModalSize.SMALL}>
        <div className="flex flex-col gap-1 px-6 py-[14px]">
          {options.liveProgram && (
            <div className="flex flex-col gap-1.5 rounded-lg p-3">
              <span className="leland-paragraph-base font-medium text-leland-gray-dark">
                Live session callout
              </span>
              <div className="flex flex-wrap gap-1.5">
                {LIVE_SESSION_VARIANT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => onSetVariant(o.value)}
                    className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
                  >
                    <Tag
                      text={o.label}
                      tagColor={TagColor.GRAY}
                      size={TagSize.SMALL}
                      selected={options.liveSessionVariant === o.value}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          {BOOLEAN_OPTIONS.map(({ key, label }) => (
            <div key={key} className="rounded-lg p-3">
              <SwitchInput
                label={label}
                isChecked={options[key]}
                onToggle={() => onToggle(key)}
              />
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
});

// ─── Add to calendar modal ───────────────────────────────────────────────────

function formatCountdown(date: Date): string {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Session has started";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 1) return `Starts in ${days} days`;
  if (days === 1) return "Starts tomorrow";
  if (hours > 0) return `Starts in ${hours}h ${mins}m`;
  return `Starts in ${mins}m`;
}

function buildCalendarUrls(session: LiveSession) {
  const start = session.date;
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmtCompact = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const fmtIso = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  const title = encodeURIComponent(session.title);
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${fmtCompact(start)}`,
    `DTEND:${fmtCompact(end)}`,
    `SUMMARY:${session.title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmtCompact(start)}/${fmtCompact(end)}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${fmtIso(start)}&enddt=${fmtIso(end)}`,
    ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`,
  };
}

const AddToCalendarModal = withModal(function AddToCalendarModal({
  session,
  onAdd,
  onOpenChange,
  open,
  ...rest
}: ModalProps & { session: LiveSession; onAdd?: () => void }) {
  const urls = buildCalendarUrls(session);
  const time = session.timeSlots[0]?.time ?? "11:00 AM PT";
  const dateStr = session.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const handleAdd = () => {
    onAdd?.();
    onOpenChange(false);
  };
  const providers = [
    { label: "Google", img: "google-calendar.png", href: urls.google, download: false },
    { label: "Outlook", img: "outlook-calendar.png", href: urls.outlook, download: false },
    { label: "Apple Calendar", img: "apple-calendar.jpeg", href: urls.ics, download: true },
  ];
  return (
    <Modal open={open} onOpenChange={onOpenChange} {...rest}>
      <ModalContent size={ModalSize.SMALL}>
        <div className="flex flex-col gap-6 px-6 pb-6 pt-5">
          <div className="flex flex-col gap-1">
            <h2 className="leland-heading-2xl font-semibold text-leland-gray-dark">
              Add to your calendar
            </h2>
            <p className="leland-paragraph-base text-leland-gray-light">
              {dateStr} at {time}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {providers.map(({ label, img, href, download }) => (
              <a
                key={label}
                href={href}
                target={download ? undefined : "_blank"}
                rel="noopener noreferrer"
                download={download ? `${session.title}.ics` : undefined}
                onClick={handleAdd}
                className="flex flex-col items-center gap-2.5 rounded-xl border border-leland-gray-stroke bg-white px-3 py-4 text-center hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <img
                  src={`${import.meta.env.BASE_URL}${img}`}
                  alt=""
                  className="size-10 rounded-xl object-contain"
                />
                <span className="leland-paragraph-sm font-medium leading-tight text-leland-gray-dark">
                  {label}
                </span>
              </a>
            ))}
          </div>
          <a
            href={urls.ics}
            download={`${session.title}.ics`}
            onClick={handleAdd}
            className={getButtonStyles({ buttonColor: ButtonColor.GRAY, size: ButtonSize.LARGE, width: ButtonWidth.FULL, fontWeight: FontWeight.SEMIBOLD })}
          >
            <IconDownload className="size-5" />
            <span>Download .ics file</span>
          </a>
        </div>
      </ModalContent>
    </Modal>
  );
});

// ─── Live program: calendar + session detail (main content area) ─────────────

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function monthGrid(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = Array(first.getDay()).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}


function SessionRecordingView({
  session,
  onBack,
  breadcrumb = false,
}: {
  session: LiveSession;
  onBack: () => void;
  breadcrumb?: boolean;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-4 md:px-8 py-10">
        {/* Breadcrumb / back nav */}
        {breadcrumb ? (
          <div className="leland-paragraph-base text-leland-gray-light">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 underline decoration-dotted decoration-[1.5px] underline-offset-4 hover:text-leland-gray-dark focus:outline-none"
            >
              <IconChevronLeft className="-ml-5 size-4 shrink-0" />
              Session {session.number}
            </button>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-leland-gray-dark">Recording</span>
          </div>
        ) : (
          <button
            onClick={onBack}
            className="-ml-5 flex items-center gap-1 leland-paragraph-base text-leland-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-4 hover:text-leland-gray-dark"
          >
            <IconChevronLeft className="size-4" />
            Back to session
          </button>
        )}

        {/* Video player */}
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-leland-gray-dark">
          <video
            src="https://tannerthelin.github.io/courses-prototype/assets/8814086-hd_1920_1080_25fps-Bbf7RRvH.mp4"
            controls
            className="h-full w-full object-cover"
          />
        </div>

        {/* CTA: view session/lesson guide */}
        <Link
          to={(() => {
            const lesson = LESSONS[session.number - 1];
            return lesson
              ? `/content-viewer/${lesson.id}/${lesson.sections[0]?.id ?? ""}`
              : `/content-viewer/lesson-${session.number}`;
          })()}
          className="flex items-center gap-4 rounded-xl bg-leland-blue-light px-5 py-4 hover:bg-leland-blue-light-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          <IconText className="size-5 shrink-0 text-leland-gray-dark" />
          <span className="flex-1 leland-heading-base font-semibold text-leland-gray-dark">
            View session {session.number} lesson guide
          </span>
          <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
        </Link>
      </div>
    </div>
  );
}

function SessionCalendar({
  onSelectSession,
  highlightSessionNumber,
  initialMonth = LIVE_SESSIONS[0].date.getMonth(),
}: {
  onSelectSession: (n: number) => void;
  highlightSessionNumber?: number;
  initialMonth?: number;
}) {
  const [month, setMonth] = useState(initialMonth);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const year = 2026;

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const sessionByDay = new Map(
    LIVE_SESSIONS.filter((s) => s.date.getMonth() === month).map((s) => [
      s.date.getDate(),
      s,
    ]),
  );

  const buildSessionByDay = new Map(
    BUILD_SESSIONS.filter(
      (s) => s.date.getMonth() === month && !s.isRecording,
    ).map((s) => [s.date.getDate(), s]),
  );

  return (
    <div className="rounded-2xl border border-leland-gray-stroke bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="leland-heading-lg font-semibold text-leland-gray-dark">
          {monthLabel}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMonth(3)}
            disabled={month === 3}
            aria-label="Previous month"
            className="flex size-8 items-center justify-center rounded-full text-leland-gray-dark hover:bg-leland-gray-hover disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            <IconChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth(4)}
            disabled={month === 4}
            aria-label="Next month"
            className="flex size-8 items-center justify-center rounded-full text-leland-gray-dark hover:bg-leland-gray-hover disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            <IconChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="leland-heading-sm py-1 text-leland-gray-extra-light"
          >
            {d}
          </span>
        ))}
        {monthGrid(2026, month).map((date, i) => {
          const calSession = date
            ? sessionByDay.get(date.getDate())
            : undefined;
          const buildSession = date
            ? buildSessionByDay.get(date.getDate())
            : undefined;
          const isCurrent = calSession?.number === highlightSessionNumber;
          const hasPopover = !!(calSession || buildSession);
          const col = i % 7;
          return (
            <div
              key={i}
              className="relative flex justify-center py-0.5"
              onMouseEnter={() => hasPopover && date && setHoveredDay(date.getDate())}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => hasPopover && date && setHoveredDay(v => v === date.getDate() ? null : date.getDate())}
            >
              {date == null ? (
                <span className="size-9" />
              ) : calSession ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSelectSession(calSession.number); }}
                  className={`flex size-9 items-center justify-center rounded-full leland-heading-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-gray-dark ${
                    isCurrent
                      ? "bg-leland-primary text-leland-on-primary-text ring-2 ring-leland-gray-dark ring-offset-1"
                      : "bg-leland-primary text-leland-on-primary-text hover:bg-leland-primary-hover"
                  }`}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span
                  className={`flex size-9 items-center justify-center leland-paragraph-base text-leland-gray-dark ${
                    buildSession
                      ? "underline decoration-leland-gray-stroke-dark decoration-dotted decoration-[1.5px] underline-offset-4"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </span>
              )}
              {hasPopover && hoveredDay === date?.getDate() && (
                <div className={`pointer-events-none absolute bottom-full z-50 mb-2 w-48 rounded-xl border border-leland-gray-stroke bg-white p-3 shadow-lg ${col <= 1 ? "left-0" : col >= 5 ? "right-0" : "left-1/2 -translate-x-1/2"}`}>
                  {calSession && (
                    <div className={buildSession ? "mb-2" : ""}>
                      <p className="leland-subtext-sm text-leland-gray-light">Session {calSession.number}</p>
                      <p className="leland-paragraph-sm font-medium text-leland-gray-dark">{calSession.title}</p>
                    </div>
                  )}
                  {buildSession && (
                    <div>
                      <p className="leland-subtext-sm text-leland-gray-light">Extra build session</p>
                      <p className="leland-paragraph-sm font-medium text-leland-gray-dark">{buildSession.title}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OverviewDateTile({ date }: { date: Date }) {
  return (
    <div className="flex size-12 shrink-0 flex-col overflow-hidden rounded-lg border border-leland-gray-stroke">
      <div className="flex items-center justify-center bg-leland-blue px-2.5 pb-0.5 pt-[3px]">
        <span className="text-[10px] font-semibold uppercase tracking-[1px] text-leland-gray-dark">
          {date.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white">
        <span className="leland-heading-xl font-semibold text-leland-gray-dark">
          {date.getDate()}
        </span>
      </div>
    </div>
  );
}

function LiveProgramOverview({
  onSelectSession,
}: {
  onSelectSession: (n: number) => void;
}) {
  const buildSessions = BUILD_SESSIONS.filter((s) => !s.isRecording);
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-4 md:px-8 py-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-heading-4xl md:text-heading-5xl font-normal font-season text-leland-gray-dark">
            {COURSE_TITLE_FULL}
          </h1>
          <p className="leland-paragraph-lg text-leland-gray-light">
            {COURSE_DESCRIPTION}
          </p>
        </div>

        {/* Live sessions carousel */}
        <div className="flex flex-col gap-3">
          <p className="leland-eyebrow text-leland-gray-light">Live sessions</p>
          <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1">
          {LIVE_SESSIONS.map((s) => (
            <button
              key={s.number}
              type="button"
              onClick={() => onSelectSession(s.number)}
              className="flex w-[240px] shrink-0 flex-col gap-4 rounded-xl border border-leland-gray-stroke bg-white p-4 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
            >
              <div className="flex items-start justify-between">
                <OverviewDateTile date={s.date} />
                <IconChevronRight className="size-5 text-leland-gray-light" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="line-clamp-2 leland-heading-lg font-semibold leading-snug text-leland-gray-dark">
                  {s.title}
                </p>
                <p className="leland-paragraph-sm text-leland-gray-light">
                  {formatSessionDate(s.date)}, 10:00 AM
                </p>
              </div>
            </button>
          ))}
          </div>
        </div>

        {/* Add all to calendar */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl bg-leland-gray-hover px-4 py-4 text-left hover:bg-leland-gray-solid-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          <IconCalendarAlt className="size-6 shrink-0 text-leland-gray-dark" />
          <span className="flex-1 leland-heading-base font-semibold text-leland-gray-dark">
            Add all sessions to your calendar
          </span>
          <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
        </button>

        <SessionCalendar onSelectSession={onSelectSession} />

        {/* Extra build sessions (add-on live experiences) */}
        <div className="flex flex-col gap-3">
          <p className="leland-eyebrow text-leland-gray-light">
            Extra build sessions
          </p>
          <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1">
            {buildSessions.map((s, i) => (
              <div
                key={i}
                className="flex w-[368px] shrink-0 flex-col overflow-hidden rounded-xl border border-leland-gray-stroke"
              >
                <div className="h-40 bg-gradient-to-br from-leland-blue-light to-leland-primary-light" />
                <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
                  <p className="leland-heading-base font-semibold text-leland-gray-dark">
                    {s.title}
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex flex-col gap-1.5">
                      <p className="leland-paragraph-sm text-leland-gray-light">
                        {formatSessionDate(s.date)}, 10:00 AM
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {COHORT_MEMBERS.slice(0, 4).map((m) => (
                            <img
                              key={m.name}
                              src={m.avatar}
                              alt=""
                              className="size-5 rounded-full border border-white object-cover"
                            />
                          ))}
                        </div>
                        <span className="leland-paragraph-sm text-leland-gray-light">
                          46 going
                        </span>
                      </div>
                    </div>
                    <Button
                      label="Add to calendar"
                      buttonColor={ButtonColor.SECONDARY_NEUTRAL}
                      size={ButtonSize.SMALL}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionActionBanner({
  session,
  variant,
  onViewRecording,
  onAddToCalendar,
}: {
  session: LiveSession;
  variant: LiveSessionVariant;
  onViewRecording: () => void;
  onAddToCalendar?: () => void;
}) {
  const month = session.date
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = String(session.date.getDate());
  const weekday = session.date.toLocaleDateString("en-US", { weekday: "long" });
  const time = session.timeSlots[0]?.time ?? "11:00 AM PT";
  const shortDate = session.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  switch (variant) {
    case "watchRecording":
      return (
        <LiveSessionCallout
          recording
          recordingVideoSrc={session.recordingVideoSrc}
          title="Watch the recording"
          subtitle={`${shortDate}, ${time}`}
          trailing={{ kind: "chevron" }}
          onClick={onViewRecording}
        />
      );
    case "addedToCalendar": {
      const calUrls = buildCalendarUrls(session);
      return (
        <LiveSessionCallout
          month={month}
          day={day}
          title={formatCountdown(session.date)}
          subtitle="Added to your calendar"
          trailing={{
            kind: "kebab",
            items: [
              { label: "Add to Google Calendar", href: calUrls.google },
              { label: "Add to Outlook", href: calUrls.outlook },
              { label: "Other calendars", href: calUrls.ics, download: `${session.title}.ics` },
            ],
          }}
        />
      );
    }
    case "joinNow":
      return (
        <LiveSessionCallout
          liveNow
          title="Join the live session"
          subtitle={
            <>
              <span className="font-medium text-leland-red">Happening now</span>
              {" · "}<LiveElapsedTime startSec={636} />
            </>
          }
          trailing={{ kind: "join", href: session.meetingUrl }}
        />
      );
    default:
      return (
        <LiveSessionCallout
          month={month}
          day={day}
          title={`${weekday} at ${time}`}
          subtitle={
            <span className="font-medium text-leland-blue-dark">
              Add to calendar
            </span>
          }
          trailing={{ kind: "chevron" }}
          onClick={onAddToCalendar}
        />
      );
  }
}

function SessionDetailView({
  session,
  variant,
  onSelectSession,
  onViewRecording,
  onBack,
  onAddToCalendar,
}: {
  session: LiveSession;
  variant: LiveSessionVariant;
  onSelectSession: (n: number) => void;
  onViewRecording: () => void;
  onBack: () => void;
  onAddToCalendar?: () => void;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-4 md:px-8 pt-10 pb-16">
        {/* Breadcrumb: ‹ Calendar (back) / Session N */}
        <div className="flex items-center gap-2 leland-paragraph-base text-leland-gray-light">
          <button
            onClick={onBack}
            className="-ml-1 flex items-center gap-1 rounded-sm hover:text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
          >
            <IconChevronLeft className="size-4" />
            <span className="underline decoration-dotted decoration-[1.5px] underline-offset-4">
              Calendar
            </span>
          </button>
          <span aria-hidden>/</span>
          <span className="font-medium text-leland-gray-dark">Session {session.number}</span>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-heading-4xl md:text-heading-5xl font-normal font-season text-leland-gray-dark">
            {session.title}
          </h1>
          <p className="leland-paragraph-lg text-leland-gray-dark">
            {session.description}
          </p>
        </div>

        <SessionActionBanner
          session={session}
          variant={variant}
          onViewRecording={onViewRecording}
          onAddToCalendar={onAddToCalendar}
        />

        {(() => {
          const lesson = LESSONS[session.number - 1];
          const href = lesson
            ? `/content-viewer/${lesson.id}/${lesson.sections[0]?.id ?? ""}`
            : `/content-viewer/lesson-${session.number}`;
          return (
            <Link
              to={href}
              className="flex items-center gap-4 rounded-xl bg-leland-blue-light px-5 py-4 hover:bg-leland-blue-light-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
            >
              <IconText className="size-5 shrink-0 text-leland-gray-dark" />
              <span className="flex-1 leland-heading-base font-semibold text-leland-gray-dark">View lesson outline</span>
              <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
            </Link>
          );
        })()}

        <SessionCalendar
          onSelectSession={onSelectSession}
          highlightSessionNumber={session.number}
          initialMonth={session.date.getMonth()}
        />
      </div>
    </div>
  );
}

// ─── Section nav (mirrors CourseViewerSectionNav.client.tsx) ─────────────────

// Matches production ButtonSize.LARGE (p-4, 14px) at semibold weight
const navButtonBase =
  "flex shrink-0 items-center gap-2 rounded-full p-4 text-[0.875rem] font-semibold leading-tight md:rounded-lg";

function CourseViewerSectionNav({
  prevSectionLink,
  nextSectionLink,
  onNext,
  completedCount,
  totalSections,
}: {
  prevSectionLink: string | null;
  nextSectionLink: string | null;
  onNext: () => void;
  completedCount: number;
  totalSections: number;
}) {
  return (
    <div className="relative flex items-center justify-between bg-[#F9F8F3] px-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] md:px-6">
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-16 bg-gradient-to-b from-transparent to-[#F9F8F3]" />
      {prevSectionLink ? (
        <Link
          to={prevSectionLink}
          className={`${navButtonBase} border border-leland-gray-stroke bg-[#F9F8F3] text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary`}
        >
          <IconChevronLeft className="size-5" />
          Back
        </Link>
      ) : (
        <span
          className={`${navButtonBase} cursor-not-allowed border border-leland-gray-stroke bg-[#F9F8F3] text-leland-gray-dark opacity-40`}
          aria-hidden
        >
          <IconChevronLeft className="size-5" />
          Back
        </span>
      )}
      <span className="absolute left-1/2 -translate-x-1/2 leland-paragraph-base text-leland-gray-extra-light">
        {completedCount}/{totalSections}
      </span>
      {nextSectionLink ? (
        <Link
          to={nextSectionLink}
          onClick={onNext}
          className={`${navButtonBase} border border-leland-primary bg-leland-primary text-leland-on-primary-text hover:bg-leland-primary-hover hover:border-leland-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary`}
        >
          Next
          <IconChevronRight className="size-5" />
        </Link>
      ) : (
        <span
          className={`${navButtonBase} cursor-not-allowed border border-leland-primary bg-leland-primary text-leland-on-primary-text opacity-40`}
          aria-hidden
        >
          Next
          <IconChevronRight className="size-5" />
        </span>
      )}
    </div>
  );
}

// ─── Page (mirrors CourseViewerShell.client.tsx) ─────────────────────────────

export default function ContentViewer() {
  const params = useParams<{ lessonId?: string; sectionId?: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1024,
  );
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("lessons");
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Navigating to a lesson section always exits calendar/overview back to lesson content.
  useEffect(() => {
    if (sidebarTab === "overview" || sidebarTab === "live") {
      setSidebarTab("lessons");
    }
    setLessonShowRecording(false);
    setSeeMoreOpen(false);
    // Scroll content area back to top on section change.
    contentScrollRef.current?.scrollTo({ top: 0 });
    // Below lg the sidebar is a drawer — selecting a section closes it.
    if (window.innerWidth < 1024) setSidebarOpen(false);
    // Scroll the active section into view in the sidebar after render.
    const id = params.sectionId;
    const timer = setTimeout(() => {
      document
        .getElementById(`sidebar-section-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
    return () => clearTimeout(timer);
  }, [params.sectionId]); // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedSessionNumber, setSelectedSessionNumber] = useState<
    number | null
  >(null);
  const [showRecording, setShowRecording] = useState(false);
  const [lessonShowRecording, setLessonShowRecording] = useState(false);
  const [seeMoreOpen, setSeeMoreOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [addToCalendarModalOpen, setAddToCalendarModalOpen] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState<Set<number>>(new Set());
  const markCalendarAdded = (n: number) =>
    setCalendarAdded((prev) => new Set([...prev, n]));
  const [prototypeOptionsOpen, setPrototypeOptionsOpen] = useState(false);
  const [cohortModalOpen, setCohortModalOpen] = useState(false);
  const { options, toggleOption, setOption } = usePrototypeOptions();
  const { completed, markComplete } = useCompletion();

  const selectedSession =
    LIVE_SESSIONS.find((s) => s.number === selectedSessionNumber) ?? null;

  const lessonIdx = Math.max(
    0,
    ALL_LESSONS.findIndex((l) => l.id === params.lessonId),
  );
  const lesson = ALL_LESSONS[lessonIdx];
  const sectionIdx = Math.max(
    0,
    lesson.sections.findIndex((s) => s.id === params.sectionId),
  );
  const section = lesson.sections[sectionIdx];

  const sectionUrl = (l: Lesson, s: Section) =>
    `/content-viewer/${l.id}/${s.id}`;

  const lessonMenuSections: MenuItemSection[] = [
    LESSONS.map((l, idx) => ({
      label: `Lesson ${idx + 1}: ${l.title}`,
      url: sectionUrl(l, l.sections[0]),
      selected: l.id === lesson.id,
    })),
  ];

  const prevSection = lesson.sections[sectionIdx - 1] ?? null;
  const nextSection = lesson.sections[sectionIdx + 1] ?? null;

  const exitDestination = DASHBOARD;

  const isCompleted = useMemo(
    () => (sectionId: string) => completed.has(`${lesson.id}/${sectionId}`),
    [completed, lesson.id],
  );

  // Opening the drawer/sidebar jumps to the lesson + section the user is on.
  useEffect(() => {
    if (!sidebarOpen) return;
    const timer = setTimeout(() => {
      document
        .getElementById(`sidebar-section-${section.id}`)
        ?.scrollIntoView({ block: "center" });
    }, 60);
    return () => clearTimeout(timer);
  }, [sidebarOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const breadcrumbLabel =
    lesson.id === "start-here" ? "Before you begin" : `Lesson ${lesson.number}`;

  // Sticky course → lesson breadcrumb. Beige bg matches the content area so it's
  // invisible at rest and cleanly masks content as it scrolls beneath, keeping
  // the course context visible the whole way down. Shared across every section
  // render path (blocks, interactive, html) so lessons and "Before you begin"
  // are consistent.
  const breadcrumbBar = options.noHeader ? (
    <div className={`z-10 bg-[#F9F8F3] ${!sidebarOpen ? "sticky top-0" : ""}`}>
      <div className={`flex w-full items-center gap-2 px-4 md:px-8 leland-paragraph-base ${sidebarOpen ? "mx-auto max-w-[800px] py-8" : "py-4"}`}>
        {!sidebarOpen ? (
          <>
            {/* Full trail only on desktop; on mobile the page header already
                carries back + title + menu, so just the lesson label shows. */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="mr-2 flex size-10 shrink-0 items-center justify-center rounded-full border border-leland-gray-stroke bg-white text-leland-gray-extra-light shadow-sm hover:bg-leland-gray-solid-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <IconLeftSidebarOpen className="size-5" aria-hidden />
              </button>
              <Link
                to={exitDestination}
                className="flex shrink-0 items-center gap-1 text-leland-gray-light underline decoration-dotted underline-offset-2 hover:text-leland-gray-dark"
              >
                <IconChevronLeft className="size-4 shrink-0" />
                My content
              </Link>
              <span className="shrink-0 text-leland-gray-light" aria-hidden>/</span>
              <span className="max-w-[240px] truncate text-leland-gray-light">{COURSE_TITLE_FULL}</span>
              <span className="shrink-0 text-leland-gray-light" aria-hidden>/</span>
            </div>
            <span className="shrink-0 font-medium text-leland-gray-dark">{breadcrumbLabel}</span>
          </>
        ) : (
          <span className="shrink-0 font-medium text-leland-gray-dark">{breadcrumbLabel}</span>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="flex h-dvh flex-col bg-white text-leland-gray-dark">
      {options.showSiteNav && (
        <div className="hidden md:block">
          <TopNav />
        </div>
      )}
      {/* Mobile page header — stands in for the global nav + desktop header
          below lg: back to My content, course title, and a drawer toggle. */}
      <header className="flex shrink-0 items-center gap-3 border-b border-leland-gray-stroke bg-white px-4 py-3 md:hidden">
        <Link
          to={exitDestination}
          aria-label="Back to My content"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-leland-gray-dark hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          <IconChevronLeft className="size-5" aria-hidden />
        </Link>
        <span className="min-w-0 flex-1 truncate leland-heading-base font-semibold text-leland-gray-dark">
          {COURSE_TITLE_FULL}
        </span>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-leland-gray-stroke text-leland-gray-dark hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
        >
          <IconMenuBurger className="size-5" aria-hidden />
        </button>
      </header>
      {!options.noHeader && (
        <header className="relative hidden shrink-0 items-center border-b border-leland-gray-stroke py-3 pl-6 pr-4 md:flex">
          <div className="flex min-w-0 flex-1 items-center gap-3 leland-paragraph-base">
            <Link
              to={exitDestination}
              className="flex shrink-0 items-center gap-1 rounded-full bg-leland-gray-solid-hover px-4 py-2 font-medium text-leland-gray-dark hover:bg-leland-gray-stroke focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
            >
              <IconChevronLeft className="size-4 shrink-0" />
              My content
            </Link>
            {!sidebarOpen && (
              <>
                <span className="h-4 w-px shrink-0 bg-leland-gray-stroke" aria-hidden />
                <span className="min-w-0 truncate text-leland-gray-light">{COURSE_TITLE_FULL}</span>
              </>
            )}
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button type="button" aria-label="Get help" className="flex size-10 items-center justify-center rounded-full bg-leland-gray-solid-hover text-leland-gray-dark hover:bg-leland-gray-stroke focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary">
              <IconQuestion className="size-5" />
            </button>
            <button type="button" aria-label="Share feedback" onClick={() => setFeedbackModalOpen(true)} className="flex size-10 items-center justify-center rounded-full bg-leland-gray-solid-hover text-leland-gray-dark hover:bg-leland-gray-stroke focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary">
              <IconStarOutline className="size-5" />
            </button>
            <button type="button" aria-label="Share" className="flex size-10 items-center justify-center rounded-full bg-leland-gray-solid-hover text-leland-gray-dark hover:bg-leland-gray-stroke focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary">
              <IconShare className="size-5" />
            </button>
          </div>
        </header>
      )}

      {/* Body */}
      <div className="relative flex min-h-0 flex-1">
        {sidebarOpen ? (
          <>
            {/* Mobile: full-viewport scrim (covers the page header too) + a
                bottom-sheet drawer. Tablet: side-drawer overlay below the header.
                Desktop: sidebar in flow. */}
            <div
              onClick={() => setSidebarOpen(false)}
              aria-hidden
              className="fixed inset-0 z-30 bg-black/30 md:absolute lg:hidden"
            />
            <div className="fixed bottom-0 left-0 right-0 top-0 z-40 flex animate-[slide-up_0.25s_ease-out] overflow-hidden shadow-xl md:absolute md:right-auto md:animate-none md:overflow-visible lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:top-auto lg:z-auto lg:shadow-none">
            {true ? (
              <CombinedSidebar
                currentLessonId={lesson.id}
                currentSectionId={section.id}
                completed={completed}
                onToggle={() => setSidebarOpen(false)}
                onSwitchCohort={() => setCohortModalOpen(true)}
                tab={sidebarTab}
                onTabChange={(tab) => {
                  setSidebarTab(tab);
                  setSelectedSessionNumber(null);
                  setShowRecording(false);
                }}
                liveProgram={options.liveProgram}
                showSessionBanners={true}
                seeMoreOpen={seeMoreOpen}
                onSeeMoreChange={setSeeMoreOpen}
                exitDestination={exitDestination}
                noHeader={options.noHeader}
              />
            ) : (
              <LessonsAccordionSidebar
                currentLessonId={lesson.id}
                currentSectionId={section.id}
                completed={completed}
                onToggle={() => setSidebarOpen(false)}
                tab={sidebarTab}
                onTabChange={(tab) => {
                  setSidebarTab(tab);
                  setSelectedSessionNumber(null);
                  setShowRecording(false);
                }}
                onSwitchCohort={() => setCohortModalOpen(true)}
                hideTabs={true}
                liveProgram={options.liveProgram}
                showSessionBanners={true}
                exitDestination={exitDestination}
                noHeader={options.noHeader}
              />
            )}
            {/* Combined sidebar renders its own collapse toggle in the header row */}
            {false && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Collapse sidebar"
                className="absolute left-full top-4 z-10 flex items-center justify-center rounded-r-lg border border-l-0 border-leland-gray-stroke bg-white p-3 shadow-sm hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <IconLeftSidebarClose className="size-5" aria-hidden />
              </button>
            )}
            </div>
          </>
        ) : (
          <>
            {!options.noHeader && (
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="absolute left-0 top-4 z-10 flex items-center justify-center rounded-r-lg border border-l-0 border-leland-gray-stroke bg-white p-3 shadow-sm hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
              >
                <IconLeftSidebarOpen className="size-5" aria-hidden />
              </button>
            )}
          </>
        )}

        {/* Main content + section nav. The Calendar tab takes over the main
            area (calendar → session detail); lesson sections otherwise.
            (Community isn't here — it opens as its own page in a new tab.) */}
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F9F8F3]">
          {/* Floating action buttons — top-right of content area (no-header mode only) */}
          {options.noHeader && <div className="absolute right-6 top-4 z-20 hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Get help"
              className="flex size-10 items-center justify-center rounded-full border border-leland-gray-stroke bg-white text-leland-gray-extra-light shadow-sm hover:bg-leland-gray-solid-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
            >
              <IconQuestion className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Share feedback"
              onClick={() => setFeedbackModalOpen(true)}
              className="flex size-10 items-center justify-center rounded-full border border-leland-gray-stroke bg-white text-leland-gray-extra-light shadow-sm hover:bg-leland-gray-solid-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
            >
              <IconStarOutline className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="flex size-10 items-center justify-center rounded-full border border-leland-gray-stroke bg-white text-leland-gray-extra-light shadow-sm hover:bg-leland-gray-solid-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
            >
              <IconShare className="size-5" />
            </button>
          </div>}
          {(sidebarTab === "live" || sidebarTab === "overview") ? (
            <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
              {showRecording ? (
                <SessionRecordingView
                  session={selectedSession ?? LIVE_SESSIONS[0]}
                  onBack={() => setShowRecording(false)}
                />
              ) : selectedSession ? (
                <SessionDetailView
                  key={selectedSession.number}
                  session={selectedSession}
                  variant={
                    options.liveSessionVariant === "addToCalendar" &&
                    calendarAdded.has(selectedSession.number)
                      ? "addedToCalendar"
                      : options.liveSessionVariant
                  }
                  onSelectSession={(n) => {
                    setSelectedSessionNumber(n);
                    setShowRecording(false);
                  }}
                  onViewRecording={() => setShowRecording(true)}
                  onBack={() => setSelectedSessionNumber(null)}
                  onAddToCalendar={() => setAddToCalendarModalOpen(true)}
                />
              ) : (
                <LiveProgramOverview
                  onSelectSession={(n) => {
                    setSelectedSessionNumber(n);
                    setShowRecording(false);
                  }}
                />
              )}
            </div>
          ) : (
            <>
              {section.kind === 'blocks' && lessonShowRecording ? (
                <SessionRecordingView
                  session={LIVE_SESSIONS[lessonIdx] ?? LIVE_SESSIONS[0]}
                  onBack={() => setLessonShowRecording(false)}
                  breadcrumb
                />
              ) : section.kind === 'blocks' ? (
                <div ref={contentScrollRef} className="min-h-0 flex-1 overflow-y-auto">
                  <LessonPageProvider
                    actions={{
                      onShareFeedback: () => setFeedbackModalOpen(true),
                      onOpenCalendar: () => setAddToCalendarModalOpen(true),
                      liveSessionVariant: options.liveSessionVariant,
                      liveProgram: options.liveProgram,
                      onViewRecording: () => setLessonShowRecording(true),
                      meetingUrl: (LIVE_SESSIONS[lessonIdx] ?? LIVE_SESSIONS[0]).meetingUrl,
                      calendarItems: (() => {
                        const s = LIVE_SESSIONS[lessonIdx] ?? LIVE_SESSIONS[0];
                        const urls = buildCalendarUrls(s);
                        return [
                          { label: "Add to Google Calendar", href: urls.google },
                          { label: "Add to Outlook", href: urls.outlook },
                          { label: "Other calendars", href: urls.ics, download: `${s.title}.ics` },
                        ];
                      })(),
                    }}
                  >
                    {breadcrumbBar}
                    {/* Larger gap-10 between product-level blocks (top banner,
                        bottom feedback) and the lesson content zone; gap-6
                        within the content zone. */}
                    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-4 md:px-8 pt-4">
                      <div className="flex flex-col gap-8">
                        {!options.noHeader && (
                          <p className="leland-paragraph-base font-medium text-leland-gray-dark">
                            {breadcrumbLabel}
                          </p>
                        )}
                        {lesson.topBlocks?.length ? (
                          <BlockList blocks={lesson.topBlocks} />
                        ) : null}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <h1 className="text-heading-4xl md:text-heading-5xl font-season font-normal text-leland-gray-dark">
                              {section.title}
                            </h1>
                          </div>
                          {section.description ? (
                            <p className="leland-paragraph-lg text-leland-gray-light">
                              {section.description}
                            </p>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-2">
                            {section.meta?.minsTotal ? (
                              <Tag
                                text={`${section.meta.minsTotal} mins total`}
                                tagColor={TagColor.GRAY}
                                size={TagSize.SMALL}
                                LeftIcon={IconClock}
                              />
                            ) : section.durationMin ? (
                              <Tag
                                text={`${section.durationMin} min`}
                                tagColor={TagColor.GRAY}
                                size={TagSize.SMALL}
                                LeftIcon={IconClock}
                              />
                            ) : null}
                            {section.meta?.builds ? (
                              <Tag
                                text={`${section.meta.builds} builds`}
                                tagColor={TagColor.GRAY}
                                size={TagSize.SMALL}
                                LeftIcon={IconLightning}
                              />
                            ) : null}
                            {section.meta?.model ? (
                              <Tag
                                text={section.meta.model}
                                tagColor={TagColor.GRAY}
                                size={TagSize.SMALL}
                                LeftIcon={IconLightning}
                              />
                            ) : null}
                          </div>
                        </div>
                        <BlockList blocks={section.blocks} />
                      </div>
                      <LessonFooterActions />
                    </div>
                  </LessonPageProvider>
                </div>
              ) : section.kind === 'html' ? (
                <div ref={contentScrollRef} className="min-h-0 flex-1 overflow-y-auto">
                  {breadcrumbBar}
                  <div className={`mx-auto w-full max-w-[800px] pb-6 ${options.noHeader ? "pt-4" : "pt-10"}`}>
                    <div className="overflow-hidden rounded-2xl border border-leland-gray-stroke">
                      <SectionContent
                        key={`${lesson.id}/${section.id}`}
                        section={section}
                      />
                    </div>
                  </div>
                  <div className="mx-auto max-w-[800px] pb-10">
                    <button
                      onClick={() => setFeedbackModalOpen(true)}
                      className="flex w-full items-center gap-4 rounded-xl border border-leland-gray-stroke bg-white px-5 py-4 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                    >
                      <IconStar className="size-5 shrink-0 text-leland-gray-dark" />
                      <span className="flex-1 leland-heading-base font-semibold text-leland-gray-dark">Share feedback</span>
                      <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
                    </button>
                  </div>
                </div>
              ) : section.kind === 'interactive' ? (
                <div ref={contentScrollRef} className="min-h-0 flex-1 overflow-y-auto">
                  {breadcrumbBar}
                  <div className={`mx-auto w-full max-w-[800px] px-4 md:px-8 pb-16 ${options.noHeader ? "pt-4" : "pt-10"}`}>
                    <GettingStartedFlow
                      key={`${lesson.id}/${section.id}`}
                      flow={section.flow}
                      onComplete={() => markComplete(lesson.id, section.id)}
                      onContinue={() => {
                        markComplete(lesson.id, section.id);
                        if (nextSection) {
                          navigate(sectionUrl(lesson, nextSection));
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <SectionContent
                      key={`${lesson.id}/${section.id}`}
                      section={section}
                    />
                  </div>
                  <div className="bg-white">
                    <div className="mx-auto max-w-[800px] pb-10 pt-4">
                      <button
                        onClick={() => setFeedbackModalOpen(true)}
                        className="flex w-full items-center gap-4 rounded-xl border border-leland-gray-stroke bg-white px-5 py-4 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                      >
                        <IconStar className="size-5 shrink-0 text-leland-gray-dark" />
                        <span className="flex-1 leland-heading-base font-semibold text-leland-gray-dark">Share feedback</span>
                        <IconChevronRight className="size-5 shrink-0 text-leland-gray-light" />
                      </button>
                    </div>
                  </div>
                </>
              )}
              <CourseFeedbackModal
                open={feedbackModalOpen}
                onOpenChange={setFeedbackModalOpen}
                currentEntryId={section.id}
                entries={lesson.sections}
              />
              {lesson.id !== "start-here" && (
                <CourseViewerSectionNav
                  prevSectionLink={
                    prevSection ? sectionUrl(lesson, prevSection) : null
                  }
                  nextSectionLink={
                    nextSection ? sectionUrl(lesson, nextSection) : null
                  }
                  onNext={() => markComplete(lesson.id, section.id)}
                  completedCount={
                    lesson.sections.filter((s) => isCompleted(s.id)).length
                  }
                  totalSections={lesson.sections.length}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating prototype options button — bottom-left corner */}
      <button
        onClick={() => setPrototypeOptionsOpen(true)}
        aria-label="Prototype options"
        className="fixed bottom-4 left-4 z-50 flex items-center justify-center rounded-full border border-leland-gray-stroke bg-white p-2.5 shadow-sm hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
      >
        <IconDotsHorizontal className="size-4 text-leland-gray-light" />
      </button>
      <PrototypeOptionsModal
        open={prototypeOptionsOpen}
        onOpenChange={setPrototypeOptionsOpen}
        options={options}
        onToggle={toggleOption}
        onSetVariant={(variant) => setOption("liveSessionVariant", variant)}
      />
      <SelectCohortModal
        open={cohortModalOpen}
        onClose={() => setCohortModalOpen(false)}
        onSelect={() => setCohortModalOpen(false)}
      />
      <AddToCalendarModal
        open={addToCalendarModalOpen}
        onOpenChange={setAddToCalendarModalOpen}
        session={selectedSession ?? LIVE_SESSIONS[0]}
        onAdd={() => {
          if (selectedSession) markCalendarAdded(selectedSession.number);
        }}
      />
    </div>
  );
}
