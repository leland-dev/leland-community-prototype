import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  CircleHelp,
  PanelLeft,
  Share,
  X,
} from "lucide-react";
import { Button } from "../components/Button";
import compassLogo from "../assets/leland-compass.svg";
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
        className="absolute inset-0 h-full w-full border-0 bg-gray-hover"
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContentViewer() {
  const navigate = useNavigate();
  const params = useParams<{ lessonId?: string; sectionId?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonMenuOpen, setLessonMenuOpen] = useState(false);
  const lessonMenuRef = useRef<HTMLDivElement>(null);
  const { completed, markComplete } = useCompletion();

  const lesson =
    LESSONS.find((l) => l.id === params.lessonId) ?? LESSONS[0];
  const sectionIdx = Math.max(
    0,
    lesson.sections.findIndex((s) => s.id === params.sectionId),
  );
  const section = lesson.sections[sectionIdx];

  const sectionUrl = (l: Lesson, s: Section) => `/content-viewer/${l.id}/${s.id}`;

  useEffect(() => {
    if (!lessonMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (!lessonMenuRef.current?.contains(e.target as Node)) {
        setLessonMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [lessonMenuOpen]);

  const completedCount = useMemo(
    () =>
      lesson.sections.filter((s) => completed.has(`${lesson.id}/${s.id}`))
        .length,
    [lesson, completed],
  );

  const goNext = () => {
    markComplete(lesson.id, section.id);
    const nextSection = lesson.sections[sectionIdx + 1];
    if (nextSection) {
      navigate(sectionUrl(lesson, nextSection));
      return;
    }
    const nextLesson = LESSONS.find((l) => l.number === lesson.number + 1);
    if (nextLesson) navigate(sectionUrl(nextLesson, nextLesson.sections[0]));
  };

  const goBack = () => {
    const prevSection = lesson.sections[sectionIdx - 1];
    if (prevSection) {
      navigate(sectionUrl(lesson, prevSection));
      return;
    }
    const prevLesson = LESSONS.find((l) => l.number === lesson.number - 1);
    if (prevLesson) {
      navigate(
        sectionUrl(prevLesson, prevLesson.sections[prevLesson.sections.length - 1]),
      );
    }
  };

  const isFirst = lesson.number === 1 && sectionIdx === 0;
  const isLast =
    lesson.number === LESSONS.length &&
    sectionIdx === lesson.sections.length - 1;

  return (
    <div className="flex h-screen flex-col bg-white text-gray-dark">
      {/* Top header */}
      <header className="flex shrink-0 items-center gap-2 border-b border-gray-stroke py-3 pl-6 pr-4">
        <div className="flex min-w-0 flex-1 items-center">
          <img src={compassLogo} alt="Leland" className="h-6 w-6 shrink-0" />
          <Link
            to={COURSE_HOME}
            className="group ml-4 shrink-0 whitespace-nowrap rounded-sm px-1 py-3 text-[17px] font-semibold"
          >
            /{" "}
            <span className="group-hover:underline group-hover:decoration-dotted group-hover:decoration-[1.5px] group-hover:underline-offset-4">
              {COURSE_TITLE}
            </span>
          </Link>

          {/* Lesson dropdown */}
          <div className="relative ml-2" ref={lessonMenuRef}>
            <button
              onClick={() => setLessonMenuOpen((v) => !v)}
              className="group flex shrink-0 items-center gap-1.5 rounded-sm px-1 py-3 text-[15px] text-gray-dark"
            >
              <span className="group-hover:underline group-hover:decoration-dotted group-hover:decoration-[1.5px] group-hover:underline-offset-4">
                Lesson {lesson.number}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {lessonMenuOpen ? (
              <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-gray-stroke bg-white py-1 shadow-lg">
                {LESSONS.map((l) => (
                  <Link
                    key={l.id}
                    to={sectionUrl(l, l.sections[0])}
                    onClick={() => setLessonMenuOpen(false)}
                    className={`block px-4 py-2.5 text-[14px] hover:bg-gray-hover ${
                      l.id === lesson.id ? "font-semibold" : ""
                    }`}
                  >
                    Lesson {l.number}: {l.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: actions + close */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            <Button size="sm" variant="secondary" rounded="rounded-full" className="!bg-transparent hover:!bg-gray-hover">
              <CircleHelp className="h-4 w-4" /> Get help
            </Button>
            <Button size="sm" variant="secondary" rounded="rounded-full" className="!bg-transparent hover:!bg-gray-hover">
              <Share className="h-4 w-4" /> Share
            </Button>
          </div>
          <Link
            to={COURSE_HOME}
            aria-label="Back to course"
            className="inline-flex items-center justify-center rounded-full border border-gray-stroke bg-white p-3 text-gray-dark hover:bg-gray-hover"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {sidebarOpen ? (
          <aside className="flex w-[336px] shrink-0 flex-col overflow-y-auto border-r border-gray-stroke bg-[#faf9f5]">
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium uppercase tracking-wide text-gray-light">
                  Lesson {lesson.number}
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  className="rounded p-1 text-gray-light hover:bg-gray-hover"
                >
                  <PanelLeft className="h-[18px] w-[18px]" />
                </button>
              </div>
              <h2 className="mt-2 text-[22px] font-semibold leading-snug">
                {lesson.title}
              </h2>
              <p className="mt-3 text-[13px] text-gray-light">
                {completedCount} of {lesson.sections.length} complete
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-stroke">
                <div
                  className="h-1.5 rounded-full bg-gray-dark transition-all"
                  style={{
                    width: `${(completedCount / lesson.sections.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <nav className="mt-5 flex-1 px-3 pb-6">
              {lesson.sections.map((s, i) => {
                const isActive = s.id === section.id;
                const isDone = completed.has(`${lesson.id}/${s.id}`);
                return (
                  <Link
                    key={s.id}
                    to={sectionUrl(lesson, s)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] ${
                      isActive
                        ? "bg-white font-medium shadow-sm ring-1 ring-gray-stroke"
                        : "hover:bg-gray-hover"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[13px] ${
                        isDone
                          ? "border-dark-green bg-dark-green text-white"
                          : "border-gray-stroke bg-white text-gray-dark"
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{s.title}</span>
                    {s.durationMin ? (
                      <span className="shrink-0 text-[12px] text-gray-light">
                        {s.durationMin}m
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </aside>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="fixed left-0 top-[100px] z-10 flex items-center justify-center rounded-r-lg border border-l-0 border-gray-stroke bg-white p-4 shadow-sm hover:bg-gray-hover"
          >
            <PanelLeft className="h-[22px] w-[22px]" />
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
          <div className="flex shrink-0 items-center justify-between border-t border-gray-stroke px-6 py-4">
            <Button
              size="md"
              variant="secondary"
              onClick={goBack}
              disabled={isFirst}
              className="!bg-transparent hover:!bg-gray-hover disabled:opacity-40"
            >
              ‹ Back
            </Button>
            <Button size="md" variant="dark" onClick={goNext} disabled={isLast}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
