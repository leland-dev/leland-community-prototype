// Course lesson viewer — mirrors the monorepo course viewer
// (CourseViewerShell / CourseViewerSidebar / CourseViewerSectionNav on the
// feature/course-viewer branch) using the ported leland design system:
// leland tokens, icons, Button/Menu/ProgressBar, and the CourseFeedbackModal.
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { CourseFeedbackModal } from "../components/CourseFeedbackModal";
import {
  IconLeftSidebarClose,
  IconLeftSidebarOpen,
} from "../components/icons/left-sidebar";
import {
  BrandLelandLogoSilhouette,
  Button,
  ButtonColor,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDotsHorizontal,
  IconHelp,
  IconShare,
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
  withModal,
  type MenuItemSection,
  type ModalProps,
} from "../components/leland";
import lessonData from "../data/aiBuilderL1Lessons.json";

// ─── Types & seed data ───────────────────────────────────────────────────────

type SectionKind = "html" | "video" | "pdf";

type Section = {
  id: string;
  title: string;
  durationMin?: number | null;
  kind: SectionKind;
  src: string;
};

type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  durationMin: number;
  sections: Section[];
};

const COURSE_TITLE = "AI Builder Program Level 1";
const COURSE_HOME = "/course/ai-builder-l1";

// Generated from the leland-courses session guides (see manifest). Lesson 1
// gets a demo video + PDF section so all three section content types show.
const LESSONS: Lesson[] = (lessonData as Lesson[]).map((lesson) =>
  lesson.number === 1
    ? {
        ...lesson,
        sections: [
          ...lesson.sections,
          {
            id: "recording",
            title: "Session recording",
            durationMin: 90,
            kind: "video" as const,
            src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            id: "slides",
            title: "Session slides",
            durationMin: null,
            kind: "pdf" as const,
            src: "/lessons/sample-deck.pdf",
          },
        ],
      }
    : lesson,
);

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

function SectionContent({ section }: { section: Section }) {
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
      src={section.src}
      title={section.title}
      className="absolute inset-0 h-full w-full border-0 bg-white"
    />
  );
}

// ─── Live program placeholder data ───────────────────────────────────────────

type LiveSession = {
  number: number;
  title: string;
  description: string;
  date: Date;
  timeSlots: string[];
  durationMin: number;
};

// Placeholder schedule — swap for real cohort data
const LIVE_SESSION_DATES = [
  new Date(2026, 3, 21),
  new Date(2026, 3, 24),
  new Date(2026, 3, 28),
  new Date(2026, 4, 1),
];

const LIVE_SESSIONS: LiveSession[] = LESSONS.map((l, i) => ({
  number: i + 1,
  title: l.title,
  description: l.subtitle,
  date: LIVE_SESSION_DATES[i] ?? LIVE_SESSION_DATES[0],
  timeSlots: ["11:00 AM PT", "4:00 PM PT"],
  durationMin: 90,
}));

const formatSessionDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// ─── Sidebar (mirrors CourseViewerSidebar.client.tsx) ────────────────────────

const SIDEBAR_TABS = [
  { id: 'lessons', label: 'Lessons' },
  { id: 'live', label: 'Live program' },
  { id: 'resources', label: 'More' },
] as const;

type SidebarTab = (typeof SIDEBAR_TABS)[number]['id'];

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
  onSelectSession: (n: number | null) => void;
}) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [prototypeOptionsOpen, setPrototypeOptionsOpen] = useState(false);
  const { options, toggleOption } = usePrototypeOptions();

  const entries = lesson.sections;
  const completedCount = entries.filter((e) => isCompleted(e.id)).length;
  const totalCount = entries.length;

  return (
    <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-leland-gray-stroke bg-leland-beige">
      {/* Pivot menu + collapse toggle (at the panel edge it controls) */}
      <div className="flex items-center gap-1.5 pl-6 pr-4 pt-4">
        {options.hidePivotMenu
          ? null
          : SIDEBAR_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
              >
                <Tag
                  text={label}
                  tagColor={TagColor.WHITE}
                  size={TagSize.SMALL}
                  selected={tab === id}
                />
              </button>
            ))}
        <button
          onClick={onToggle}
          className="ml-auto flex size-10 shrink-0 items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
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
                  trackClassName="bg-white"
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
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-leland-beige to-transparent" />
            </div>
          </>
        ) : tab === 'live' ? (
          <div className="flex flex-col gap-4 px-6">
            <div className="flex flex-col gap-1">
              <p className="leland-heading-lg font-semibold text-leland-gray-dark">
                Cohort 3 · Apr 21 – May 8
              </p>
              <p className="leland-paragraph-sm text-leland-gray-light">
                {LIVE_SESSIONS.length} live sessions · 90 min each
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {LIVE_SESSIONS.map((session) => (
                <button
                  key={session.number}
                  type="button"
                  onClick={() => onSelectSession(session.number)}
                  className={`flex flex-col gap-0.5 rounded-lg border bg-white p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary ${
                    selectedSessionNumber === session.number
                      ? "border-leland-gray-dark"
                      : "border-leland-gray-stroke hover:bg-leland-gray-hover"
                  }`}
                >
                  <p className="leland-heading-base text-leland-gray-dark">
                    Session {session.number}: {session.title}
                  </p>
                  <p className="leland-paragraph-sm text-leland-gray-light">
                    {formatSessionDate(session.date)} · {session.durationMin}{" "}
                    min
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Placeholder content — swap for real resource links */
          <div className="flex flex-col gap-1 px-6">
            <Button
              label="Get help"
              buttonColor={ButtonColor.REVEAL}
              LeftIcon={IconHelp}
            />
            <Button
              label="Share this course"
              buttonColor={ButtonColor.REVEAL}
              LeftIcon={IconShare}
            />
          </div>
        )}
      </div>

      {/* Bottom actions — full-width section */}
      <div className="px-4 py-4 bg-leland-beige">
        <div className="flex items-center justify-between gap-2">
          <Button
            label="Share feedback"
            buttonColor={ButtonColor.REVEAL}
            LeftIcon={IconWrite}
            onClick={() => setFeedbackModalOpen(true)}
          />
          <Button
            label="Prototype options"
            hideLabel
            rounded
            buttonColor={ButtonColor.REVEAL}
            LeftIcon={IconDotsHorizontal}
            onClick={() => setPrototypeOptionsOpen(true)}
          />
        </div>
        <CourseFeedbackModal
          open={feedbackModalOpen}
          onOpenChange={setFeedbackModalOpen}
          currentEntryId={currentSectionId}
          entries={entries}
        />
        <PrototypeOptionsModal
          open={prototypeOptionsOpen}
          onOpenChange={setPrototypeOptionsOpen}
          options={options}
          onToggle={toggleOption}
        />
      </div>
    </aside>
  );
}

// ─── Prototype options (meta-UI for demoing variants, not product UI) ────────

type PrototypeOptions = {
  hidePivotMenu: boolean;
};

const PROTOTYPE_OPTIONS_KEY = "content-viewer-prototype-options";

const DEFAULT_PROTOTYPE_OPTIONS: PrototypeOptions = {
  hidePivotMenu: false,
};

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
  const toggleOption = (key: keyof PrototypeOptions) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(PROTOTYPE_OPTIONS_KEY, JSON.stringify(next));
      return next;
    });
  };
  return { options, toggleOption };
}

const PROTOTYPE_OPTION_LABELS: Record<keyof PrototypeOptions, string> = {
  hidePivotMenu: "Hide pivot menu",
};

const PrototypeOptionsModal = withModal(function PrototypeOptionsModal({
  options,
  onToggle,
  ...modalProps
}: ModalProps & {
  options: PrototypeOptions;
  onToggle: (key: keyof PrototypeOptions) => void;
}) {
  return (
    <Modal {...modalProps}>
      <ModalContent size={ModalSize.SMALL} header="Prototype options">
        <div className="flex flex-col gap-1 p-6">
          {(
            Object.keys(PROTOTYPE_OPTION_LABELS) as Array<keyof PrototypeOptions>
          ).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-3 hover:bg-leland-gray-hover"
            >
              <span className="leland-paragraph-base text-leland-gray-dark">
                {PROTOTYPE_OPTION_LABELS[key]}
              </span>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => onToggle(key)}
                className="size-4 accent-leland-gray-dark"
              />
            </label>
          ))}
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

function LiveProgramCalendar({
  onSelectSession,
}: {
  onSelectSession: (n: number) => void;
}) {
  // Cohort spans Apr–May 2026
  const [month, setMonth] = useState(3);
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

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-8 overflow-y-auto px-8 py-10">
      <div className="flex flex-col gap-1">
        <p className="leland-eyebrow text-leland-gray-light">Live program</p>
        <h1 className="leland-heading-3xl font-semibold text-leland-gray-dark">
          Cohort 3 schedule
        </h1>
        <p className="leland-paragraph-lg text-leland-gray-light">
          Four live sessions, Apr 21 – May 8. Click a session for details and
          available times.
        </p>
      </div>

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
            const session = date ? sessionByDay.get(date.getDate()) : undefined;
            return (
              <div key={i} className="flex justify-center py-0.5">
                {date == null ? (
                  <span className="size-9" />
                ) : session ? (
                  <button
                    type="button"
                    onClick={() => onSelectSession(session.number)}
                    title={`Session ${session.number}: ${session.title}`}
                    className="flex size-9 items-center justify-center rounded-full bg-leland-primary leland-heading-base font-semibold text-leland-on-primary-text hover:bg-leland-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-gray-dark"
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <span className="flex size-9 items-center justify-center leland-paragraph-base text-leland-gray-dark">
                    {date.getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {LIVE_SESSIONS.map((session) => (
          <button
            key={session.number}
            type="button"
            onClick={() => onSelectSession(session.number)}
            className="flex items-center justify-between gap-3 rounded-lg border border-leland-gray-stroke bg-white px-4 py-3 text-left hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            <div className="min-w-0">
              <p className="leland-heading-base font-semibold text-leland-gray-dark">
                Session {session.number}: {session.title}
              </p>
              <p className="leland-paragraph-sm text-leland-gray-light">
                {formatSessionDate(session.date)} · {session.durationMin} min
              </p>
            </div>
            <IconChevronRight className="size-5 shrink-0 text-leland-gray-extra-light" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SessionDetailView({
  session,
  onBack,
}: {
  session: LiveSession;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-6 overflow-y-auto px-8 py-10">
      <div>
        <Button
          label="Back to schedule"
          buttonColor={ButtonColor.TERTIARY}
          LeftIcon={IconChevronLeft}
          onClick={onBack}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="leland-eyebrow text-leland-gray-light">
          Session {session.number}
        </p>
        <h1 className="leland-heading-3xl font-semibold text-leland-gray-dark">
          {session.title}
        </h1>
        <p className="leland-subtext-lg text-leland-gray-light">
          {formatSessionDate(session.date)} · {session.durationMin} min
        </p>
      </div>
      <p className="leland-paragraph-lg text-leland-gray-dark">
        {session.description}
      </p>

      <div className="flex flex-col gap-3">
        <p className="leland-heading-base font-semibold uppercase tracking-wide text-leland-gray-light">
          Available times
        </p>
        {session.timeSlots.map((slot) => (
          <div
            key={slot}
            className="flex items-center justify-between gap-3 rounded-lg border border-leland-gray-stroke bg-white px-4 py-3"
          >
            <div>
              <p className="leland-heading-base font-semibold text-leland-gray-dark">
                {formatSessionDate(session.date)} · {slot}
              </p>
              <p className="leland-paragraph-sm text-leland-gray-light">
                {session.durationMin} minutes
              </p>
            </div>
            <Button
              label="Add to calendar"
              buttonColor={ButtonColor.SECONDARY}
              rounded
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section nav (mirrors CourseViewerSectionNav.client.tsx) ─────────────────

// Matches production ButtonSize.LARGE (p-4, 14px) at semibold weight
const navButtonBase =
  "flex shrink-0 items-center gap-2 rounded-lg p-4 text-[0.875rem] font-semibold leading-tight";

function CourseViewerSectionNav({
  prevSectionLink,
  nextSectionLink,
  onNext,
}: {
  prevSectionLink: string | null;
  nextSectionLink: string | null;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-leland-gray-stroke bg-white px-6 py-4">
      {prevSectionLink ? (
        <Link
          to={prevSectionLink}
          className={`${navButtonBase} border border-leland-gray-stroke bg-white text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary`}
        >
          <IconChevronLeft className="size-5" />
          Back
        </Link>
      ) : (
        <span
          className={`${navButtonBase} cursor-not-allowed border border-leland-gray-stroke bg-white text-leland-gray-dark opacity-40`}
          aria-hidden
        >
          <IconChevronLeft className="size-5" />
          Back
        </span>
      )}
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("lessons");
  const [selectedSessionNumber, setSelectedSessionNumber] = useState<
    number | null
  >(null);
  const { completed, markComplete } = useCompletion();

  const selectedSession =
    LIVE_SESSIONS.find((s) => s.number === selectedSessionNumber) ?? null;

  const lessonIdx = Math.max(
    0,
    LESSONS.findIndex((l) => l.id === params.lessonId),
  );
  const lesson = LESSONS[lessonIdx];
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
      selected: idx === lessonIdx,
    })),
  ];

  const prevSection = lesson.sections[sectionIdx - 1] ?? null;
  const nextSection = lesson.sections[sectionIdx + 1] ?? null;

  const isCompleted = useMemo(
    () => (sectionId: string) => completed.has(`${lesson.id}/${sectionId}`),
    [completed, lesson.id],
  );

  return (
    <div className="flex h-screen flex-col bg-white text-leland-gray-dark">
      {/* Top header — spans the full window width; sidebar sits below it */}
      <header className="flex shrink-0 items-center gap-2 border-b border-leland-gray-stroke py-3 pl-6 pr-4">
        {/* Left: logo + breadcrumb */}
        <div className="flex min-w-0 flex-1 items-center">
          <BrandLelandLogoSilhouette className="h-5 w-auto shrink-0 text-leland-gray-dark" />
          {/* Back to course */}
          <Link
            to={COURSE_HOME}
            className="group leland-heading-base font-semibold ml-4 shrink-0 whitespace-nowrap px-1 py-3 text-leland-gray-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary rounded-sm"
          >
            /{" "}
            <span className="group-hover:underline group-hover:decoration-dotted group-hover:decoration-[1.5px] group-hover:underline-offset-4">
              {COURSE_TITLE}
            </span>
          </Link>

          <Menu asChild itemSections={lessonMenuSections}>
            <button className="group leland-subtext-base ml-2 flex shrink-0 items-center gap-2 rounded-sm px-1 py-3 text-leland-gray-dark outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary">
              <span className="group-hover:underline group-hover:decoration-dotted group-hover:decoration-[1.5px] group-hover:underline-offset-4">
                Lesson {lessonIdx + 1}
              </span>
              <IconChevronDown className="size-5" />
            </button>
          </Menu>
        </div>

        {/* Right: actions + close */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center">
            <Button
              label="Get help"
              buttonColor={ButtonColor.REVEAL}
              rounded
              LeftIcon={IconHelp}
            />
            <Button
              label="Share"
              buttonColor={ButtonColor.REVEAL}
              rounded
              LeftIcon={IconShare}
            />
          </div>
          <Link
            to={COURSE_HOME}
            aria-label="Back to course"
            className="inline-flex items-center justify-center rounded-full border border-leland-gray-stroke bg-white p-3 text-leland-gray-dark hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
          >
            <IconX className="size-5" />
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="relative flex min-h-0 flex-1">
        {sidebarOpen ? (
          <CourseViewerSidebar
            lesson={lesson}
            lessonIdx={lessonIdx}
            currentSectionId={section.id}
            isCompleted={isCompleted}
            onToggle={() => setSidebarOpen(false)}
            tab={sidebarTab}
            onTabChange={(tab) => {
              setSidebarTab(tab);
              if (tab !== "live") setSelectedSessionNumber(null);
            }}
            selectedSessionNumber={selectedSessionNumber}
            onSelectSession={setSelectedSessionNumber}
          />
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="absolute left-0 top-6 z-10 flex items-center justify-center rounded-r-lg border border-l-0 border-leland-gray-stroke bg-leland-beige p-4 shadow-sm hover:bg-leland-gray-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            <IconLeftSidebarOpen className="size-6" aria-hidden />
          </button>
        )}

        {/* Main content + section nav. The Live program tab takes over the
            main area (calendar → session detail); lesson sections otherwise. */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {sidebarTab === "live" ? (
            <div className="min-h-0 flex-1 overflow-hidden">
              {selectedSession ? (
                <SessionDetailView
                  session={selectedSession}
                  onBack={() => setSelectedSessionNumber(null)}
                />
              ) : (
                <LiveProgramCalendar onSelectSession={setSelectedSessionNumber} />
              )}
            </div>
          ) : (
            <>
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <SectionContent
                  key={`${lesson.id}/${section.id}`}
                  section={section}
                />
              </div>
              <CourseViewerSectionNav
                prevSectionLink={
                  prevSection ? sectionUrl(lesson, prevSection) : null
                }
                nextSectionLink={
                  nextSection ? sectionUrl(lesson, nextSection) : null
                }
                onNext={() => markComplete(lesson.id, section.id)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
