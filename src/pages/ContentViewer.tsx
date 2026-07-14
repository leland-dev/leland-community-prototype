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
  ButtonSize,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconHelp,
  IconShare,
  IconWrite,
  IconX,
  Menu,
  ProgressBar,
  ProgressBarColor,
  type MenuItemSection,
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

// ─── Sidebar (mirrors CourseViewerSidebar.client.tsx) ────────────────────────

const SIDEBAR_TABS = [
  { id: 'lessons', label: 'Lessons' },
  { id: 'live', label: 'Live program' },
  { id: 'resources', label: 'Resources' },
] as const;

type SidebarTab = (typeof SIDEBAR_TABS)[number]['id'];

function CourseViewerSidebar({
  lesson,
  lessonIdx,
  currentSectionId,
  isCompleted,
  onToggle,
}: {
  lesson: Lesson;
  lessonIdx: number;
  currentSectionId: string;
  isCompleted: (sectionId: string) => boolean;
  onToggle: () => void;
}) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [tab, setTab] = useState<SidebarTab>('lessons');

  const entries = lesson.sections;
  const completedCount = entries.filter((e) => isCompleted(e.id)).length;
  const totalCount = entries.length;

  return (
    <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-leland-gray-stroke bg-leland-beige">
      {/* Collapse toggle + pivot menu */}
      <div className="flex items-center gap-1.5 px-4 pt-4">
        <button
          onClick={onToggle}
          className="flex size-10 shrink-0 items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary"
          aria-label="Close sidebar"
        >
          <IconLeftSidebarClose className="size-6" aria-hidden />
        </button>
        {SIDEBAR_TABS.map(({ id, label }) => (
          <Button
            key={id}
            label={label}
            buttonColor={ButtonColor.WHITE}
            size={ButtonSize.SMALL}
            rounded
            selected={tab === id}
            onClick={() => setTab(id)}
          />
        ))}
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
                />
              </div>
            </div>

            {/* Section list */}
            <div className="relative min-h-0 flex-1 overflow-y-auto pl-4 pr-1">
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
          /* Placeholder content — swap for real session data */
          <div className="flex flex-col gap-4 px-6">
            <div className="flex flex-col gap-1">
              <p className="leland-heading-lg text-leland-gray-dark">
                Cohort 3 · Apr 21 – May 8
              </p>
              <p className="leland-paragraph-sm text-leland-gray-light">
                {LESSONS.length} live sessions · 90 min each
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {LESSONS.map((l, idx) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-0.5 rounded-lg border border-leland-gray-stroke bg-white p-3"
                >
                  <p className="leland-heading-base text-leland-gray-dark">
                    Session {idx + 1}: {l.title}
                  </p>
                  <p className="leland-paragraph-sm text-leland-gray-light">
                    Tue 11:00 AM · 90 min
                  </p>
                </div>
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
        <div className="flex flex-wrap gap-2">
          <Button
            label="Share feedback"
            buttonColor={ButtonColor.REVEAL}
            LeftIcon={IconWrite}
            onClick={() => setFeedbackModalOpen(true)}
          />
        </div>
        <CourseFeedbackModal
          open={feedbackModalOpen}
          onOpenChange={setFeedbackModalOpen}
          currentEntryId={currentSectionId}
          entries={entries}
        />
      </div>
    </aside>
  );
}

// ─── Section nav (mirrors CourseViewerSectionNav.client.tsx) ─────────────────

const navButtonBase =
  "flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 leland-heading-base";

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
          className={`${navButtonBase} border border-leland-gray-dark bg-leland-gray-dark text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-primary`}
        >
          Next
          <IconChevronRight className="size-5" />
        </Link>
      ) : (
        <span
          className={`${navButtonBase} cursor-not-allowed border border-leland-gray-dark bg-leland-gray-dark text-white opacity-40`}
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
  const { completed, markComplete } = useCompletion();

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
      <div className="flex min-h-0 flex-1">
        {sidebarOpen ? (
          <CourseViewerSidebar
            lesson={lesson}
            lessonIdx={lessonIdx}
            currentSectionId={section.id}
            isCompleted={isCompleted}
            onToggle={() => setSidebarOpen(false)}
          />
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="fixed left-0 top-[100px] z-10 flex items-center justify-center rounded-r-lg border border-l-0 border-leland-gray-stroke bg-white p-4 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
          >
            <IconLeftSidebarOpen className="size-6" aria-hidden />
          </button>
        )}

        {/* Main content + section nav */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <SectionContent
              key={`${lesson.id}/${section.id}`}
              section={section}
            />
          </div>
          <CourseViewerSectionNav
            prevSectionLink={prevSection ? sectionUrl(lesson, prevSection) : null}
            nextSectionLink={nextSection ? sectionUrl(lesson, nextSection) : null}
            onNext={() => markComplete(lesson.id, section.id)}
          />
        </div>
      </div>
    </div>
  );
}
