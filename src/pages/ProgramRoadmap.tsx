import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { PROGRAM_LEVELS, type RoadmapLevel, type RoadmapSession } from "../data/programRoadmap";
import type { LiveSessionBannerBlock, RoleBuild, RoleBuildPickerBlock } from "../data/lessonBlocks";
import { useSelectedCategory } from "../contexts/SelectedCategoryContext";
import { CATEGORY_TO_ROLE, ROLE_TO_CATEGORY } from "../lib/categories";
import { TRACK_STORAGE_KEY, type CourseTrack } from "../components/TrackPickerModal";
import { IconCheck } from "../components/leland";
import { CalendarIcon } from "../components/SessionCard";
import aiBuilderTile from "../assets/ai-onboarding/aibp-tile.png";

// Real per-session completion — reads the same "content-viewer-completed"
// localStorage store ContentViewer.tsx writes to (keyed "lessonId/sectionId")
// when a learner actually finishes a section there, rather than a hand-set
// count. A session with no lessonId (Levels 2-4 — no hand-authored lesson
// content yet) can never be marked complete or current.
const COMPLETION_KEY = "content-viewer-completed";

function loadCompletedSections(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(COMPLETION_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

// Mirrors ContentViewer's filterSectionsByTrack: a tool-specific setup
// section only counts once that tool is the learner's chosen track.
function trackedSections(session: RoadmapSession, track: CourseTrack | null) {
  return (session.sections ?? []).filter((s) => s.kind !== "blocks" || !s.track || s.track === track);
}

// Mirrors ContentViewer's lessonProgress exactly, so the same percent that
// drives a lesson's progress ring in the course viewer drives it here too.
function sessionProgressPercent(session: RoadmapSession, completed: Set<string>, track: CourseTrack | null): number {
  if (!session.lessonId) return 0;
  const sections = trackedSections(session, track);
  if (sections.length === 0) return 0;
  const done = sections.filter((s) => completed.has(`${session.lessonId}/${s.id}`)).length;
  return (done / sections.length) * 100;
}

// Mirrors pickRoleBuild's matching rule (src/data/lessonBlocks.ts) but returns
// the matched option's whole build list instead of just the first one — the
// roadmap preview shows a couple of real examples, not just one.
function matchedBuilds(picker: RoleBuildPickerBlock, knownRole: string | null): RoleBuild[] {
  const matched = knownRole ? picker.options.filter((opt) => opt.matchesRoles?.includes(knownRole)) : [];
  const option = matched.length === 1 ? matched[0] : (picker.options.find((o) => o.value === "sales") ?? picker.options[0] ?? null);
  return option?.builds ?? picker.fallback.builds;
}

// A session's pooled example builds — every apply-build in the session
// shares one umbrella theme, so their role-build-picker options are combined
// into a single list rather than repeated per outcome card. A preview of
// the picker, not a full browse surface — cap at 3 so it doesn't dominate.
const EXAMPLE_BUILDS_SHOWN = 3;
function ExampleBuilds({ builds }: { builds: RoleBuild[] }) {
  const shown = builds.slice(0, EXAMPLE_BUILDS_SHOWN);
  return (
    <div className="flex flex-col">
      {shown.map((b) => (
        <div key={b.id} className="flex items-center gap-3 border-t border-gray-stroke py-2.5">
          <img src={b.image ?? aiBuilderTile} alt="" className="h-12 w-20 shrink-0 rounded-md border border-gray-stroke object-cover" />
          <span className="line-clamp-2 text-[14px] font-medium text-gray-dark">{b.buildTitle}</span>
        </div>
      ))}
    </div>
  );
}

// My Roadmap (real content) — a copy of the alt-nav experience's roadmap
// accordion (see ProgramAltRoadmap.tsx), with our actual Level → Session →
// Build hierarchy slotted in instead of the generic role/focus-area catalog.
//
// Density follows "Option B" from the wireframe review: each session shows
// its lesson title plus a non-clickable preview of 1-2 of its builds (never
// a clickable list — the builds themselves live inside the lesson), and a
// single CTA to continue or start. Every session row is independently
// expandable to show that preview — not just the one you're currently on.

// Sessions aren't gated — jumping ahead is allowed — but exactly one session
// is called out as "current" with a bigger, primary CTA, so there's always a
// clear next step without blocking any other session.
type SessionStatus = "completed" | "current" | "upcoming";

// A full-width banner — distinct enough from the plain apply-build list
// below it that it doesn't need its own card treatment.
function LiveSessionBanner({ liveSession }: { liveSession: LiveSessionBannerBlock }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl bg-gray-hover px-4 py-3.5">
      <CalendarIcon day={liveSession.day} />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="text-[14px] font-semibold leading-[1.2] text-gray-dark">Live session available</p>
        <p className="text-[12px] leading-[1.4] text-gray-light">{liveSession.time ?? `${liveSession.month} ${liveSession.day}`}</p>
      </div>
    </div>
  );
}

// Shared chevron for both the level and session headers — rendered twice at
// some call sites (once per breakpoint, toggled with `className`) so it can
// sit in a different row on mobile vs. inline on desktop without duplicating
// the SVG markup itself.
function Chevron({ expanded, className = "" }: { expanded: boolean; className?: string }) {
  return (
    <svg
      className={`text-gray-light transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${className}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// A session's progress, as a filling horizontal bar — sits to the left of
// the chevron instead of the title, with a checkmark once it's done.
function SessionProgressBar({ percent }: { percent: number }) {
  const complete = percent >= 100;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-gray-stroke sm:w-20">
        <span className="absolute inset-y-0 left-0 rounded-full bg-gray-dark" style={{ width: `${clamped}%` }} />
      </span>
      {complete && <IconCheck className="size-3.5 shrink-0 text-gray-dark" />}
    </span>
  );
}

function SessionRow({
  session,
  status,
  percent,
  knownRole,
  expanded,
  onToggle,
  completedSections,
  track,
}: {
  session: RoadmapSession;
  status: SessionStatus;
  percent: number;
  knownRole: string | null;
  expanded: boolean;
  onToggle: () => void;
  completedSections: Set<string>;
  track: CourseTrack | null;
}) {
  const navigate = useNavigate();
  // Pooled across every apply build — they all share one umbrella theme for
  // this session, so one combined example list reads better than repeating
  // the same structure under each outcome card.
  const allExamples = session.applyBuilds.flatMap((b) => (b.picker ? matchedBuilds(b.picker, knownRole) : []));
  // When there's no live-session banner, this section's heading is the
  // first thing after the header, so it needs a tighter top gap than when
  // it's following the banner.
  const contentTopGap = session.liveSession ? "mt-6" : "mt-4";
  // Resume where the learner left off — the first not-yet-completed tracked
  // section — same resume logic ContentViewer itself would land on; falls
  // back to the first section when nothing's been completed yet.
  const sections = session.lessonId ? trackedSections(session, track) : [];
  const resumeSection = sections.find((s) => !completedSections.has(`${session.lessonId}/${s.id}`)) ?? sections[0];
  const courseUrl = session.lessonId && resumeSection ? `/content-viewer/${session.lessonId}/${resumeSection.id}` : null;
  // "Session N" (the data's internal ordinal) reads as "Lesson N" everywhere
  // learner-facing, matching the course player's own terminology.
  const lessonLabel = session.ordinal.replace("Session", "Lesson");
  const sessionCta = (s: SessionStatus) => (
    <Button
      size="md"
      variant="primary"
      rounded="rounded-full"
      className="shrink-0 font-semibold"
      onClick={(e) => {
        e.stopPropagation();
        if (courseUrl) navigate(courseUrl);
      }}
    >
      {s === "completed" ? "Review" : percent > 0 ? `Resume ${lessonLabel}` : `Start ${lessonLabel}`}
    </Button>
  );
  return (
    <div className="overflow-hidden rounded-xl border border-gray-stroke">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`flex w-full flex-col gap-2 bg-white px-5 text-left lg:px-6 ${expanded ? "pt-5 pb-4" : "py-6"}`}
      >
        <div className="flex w-full items-start gap-3 sm:items-center">
          {/* Title + progress bar share this wrapping group, which stays on
              the chevron's row — so the chevron stays aligned with the
              title instead of dropping to its own row. On mobile, where
              the title takes the full line, the progress bar wraps below
              it (still inside this group) instead of next to the chevron. */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-4">
            {/* Same eyebrow-above-title pattern the course player itself uses
                for "Lesson N · Xm" — no separate numbered badge, so a session
                isn't numbered twice (once here, once as "Session N"). */}
            <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
              {/* Position in the list already shows sequence, so no "Lesson N"
                  label here — just the duration, when there is one. */}
              {session.durationMin && <p className="text-[12px] font-normal text-gray-light">{session.durationMin} min</p>}
              <p className="text-[16px] font-semibold text-gray-dark">{session.title}</p>
              {/* CTA lives right under the title, in the same header block,
                  instead of its own section below — so it reads as attached
                  to this lesson rather than floating in the expanded body. */}
              {expanded && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  {sessionCta(status)}
                </div>
              )}
            </div>
            {/* Only sessions with real tracked content (Level 1 today) get a
                progress indicator. */}
            {session.lessonId && <SessionProgressBar percent={percent} />}
          </div>
          <Chevron expanded={expanded} className="shrink-0" />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col rounded-b-xl bg-white px-5 pb-5 lg:px-6 lg:pb-6">
              {session.liveSession && (
                <div className="mt-4">
                  <LiveSessionBanner liveSession={session.liveSession} />
                </div>
              )}

              {allExamples.length > 0 ? (
                <>
                  <p className={`${contentTopGap} text-[14px] font-semibold text-gray-dark`}>
                    {knownRole && ROLE_TO_CATEGORY[knownRole] ? `Example builds for ${ROLE_TO_CATEGORY[knownRole].toLowerCase()}` : "Example builds"}
                    {allExamples.length > EXAMPLE_BUILDS_SHOWN && (
                      <span className="ml-2 text-[14px] font-normal text-gray-light">+{allExamples.length - EXAMPLE_BUILDS_SHOWN} more</span>
                    )}
                  </p>
                  <div className="mt-2.5">
                    <ExampleBuilds builds={allExamples} />
                  </div>
                </>
              ) : session.applyBuilds.length > 0 ? (
                // There's a real Apply section here, just no example tied to
                // this learner's role yet (role unknown, or no tagged option
                // matches it) — so describe the build itself instead of
                // falling back to the generic "not tagged" copy below, which
                // would misstate a session that *is* tagged.
                <>
                  <p className={`${contentTopGap} text-[14px] font-semibold text-gray-dark`}>What you'll build</p>
                  <div className="mt-2.5 flex flex-col gap-2">
                    {session.applyBuilds.map((build) => (
                      <p key={build.title} className="text-[14px] text-gray-light">
                        {build.title}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                // No apply builds at all — either no signal whatsoever, or
                // only practice builds (which don't have their own preview
                // treatment here) — so fall back to a plain, learner-facing
                // build count instead of describing our own tagging gaps.
                <p className={`${contentTopGap} text-[14px] text-gray-light`}>
                  {session.totalBuildCount} build{session.totalBuildCount === 1 ? "" : "s"} in this lesson
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// A slim horizontal stepper standing in for the old per-level progress
// rings — one segment per level, so the page can show "where am I in the
// whole program" in a single glance instead of stacking every level's full
// content at once. Completed levels and the selected one read dark;
// everything ahead stays light. Clicking a segment jumps to that level.
function LevelTimeline({
  levels,
  selectedIndex,
  onSelect,
  completedSections,
  track,
}: {
  levels: RoadmapLevel[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  completedSections: Set<string>;
  track: CourseTrack | null;
}) {
  return (
    <div className="-m-1 overflow-x-auto">
      <div className="flex items-start p-1">
        {levels.map((level, i) => {
          const percents = level.sessions.map((s) => sessionProgressPercent(s, completedSections, track));
          const trackableCount = level.sessions.filter((s) => s.lessonId).length;
          const complete = trackableCount === level.sessions.length && percents.every((p) => p >= 100);
          const selected = i === selectedIndex;
          return (
            // Fixed column width (not sized to each title) so the circles land
            // evenly spaced regardless of label length, and the connector line
            // lives inside this same column so it always reaches from this
            // circle's edge to the start of the next one, with no gap.
            <div key={level.number} className="relative w-[150px] shrink-0">
              <div className="absolute left-7 right-0 top-3.5 h-px bg-gray-stroke" />
              <button type="button" onClick={() => onSelect(i)} className="relative z-10 flex w-full flex-col items-start gap-2 pr-3 text-left" aria-current={selected}>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
                    complete
                      ? "bg-gray-dark text-white"
                      : selected
                        ? "border-2 border-gray-dark text-gray-dark"
                        : "border-2 border-gray-stroke text-gray-dark"
                  }`}
                >
                  {complete ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : (
                    level.number
                  )}
                </span>
                <span className={`block w-full text-[12px] leading-tight ${selected ? "font-semibold text-gray-dark" : "font-medium text-gray-light"}`}>
                  {level.title}
                </span>
              </button>
            </div>
          );
        })}
        <div className="relative h-7 flex-1">
          <div className="absolute left-0 right-0 top-3.5 h-px bg-gray-stroke" />
        </div>
      </div>
    </div>
  );
}

function LevelSessions({
  level,
  knownRole,
  completedSections,
  track,
}: {
  level: RoadmapLevel;
  knownRole: string | null;
  completedSections: Set<string>;
  track: CourseTrack | null;
}) {
  const sessionPercent = level.sessions.map((s) => sessionProgressPercent(s, completedSections, track));
  const sessionDone = sessionPercent.map((p) => p >= 100);
  // Only one session open at a time within a level — expanding one closes
  // whichever other one was open. Auto-expand whichever session has real
  // in-progress work (started but not done); if nothing's been started at
  // all, open just the first session instead, so there's still something to
  // act on.
  const [expandedSession, setExpandedSession] = useState<string | null>(() => {
    const inProgress = level.sessions.find((s, i) => sessionPercent[i] > 0 && !sessionDone[i]);
    if (inProgress) return inProgress.ordinal;
    return level.sessions.length > 0 ? level.sessions[0].ordinal : null;
  });
  const toggleSession = (ordinal: string) => setExpandedSession((prev) => (prev === ordinal ? null : ordinal));
  return (
    <div className="flex flex-col gap-2.5">
      {level.sessions.map((session, i) => {
        // "Current" is the first not-yet-done session, by position —
        // sessions aren't gated, so a learner can finish them out of
        // order, but there's still always exactly one called out.
        const firstIncompleteIndex = sessionDone.indexOf(false);
        const status: SessionStatus =
          level.status === "not-started"
            ? "upcoming"
            : sessionDone[i]
              ? "completed"
              : i === firstIncompleteIndex
                ? "current"
                : "upcoming";
        return (
          <SessionRow
            key={session.ordinal}
            session={session}
            status={status}
            percent={sessionPercent[i]}
            knownRole={knownRole}
            expanded={expandedSession === session.ordinal}
            onToggle={() => toggleSession(session.ordinal)}
            completedSections={completedSections}
            track={track}
          />
        );
      })}
    </div>
  );
}

export default function ProgramRoadmap() {
  const { selectedCategory } = useSelectedCategory();
  const knownRole = selectedCategory ? (CATEGORY_TO_ROLE[selectedCategory] ?? null) : null;
  // Read fresh on every mount — matches how ContentViewer itself reads this
  // same store, and this page remounts on navigation back from a lesson.
  const [completedSections] = useState<Set<string>>(loadCompletedSections);
  const [track] = useState<CourseTrack | null>(() => localStorage.getItem(TRACK_STORAGE_KEY) as CourseTrack | null);
  // Default to the first level that isn't fully done yet — same "what's
  // next" logic as a session's own current/upcoming status, just one level
  // up. Only one level's sessions render at a time now; the timeline above
  // is how a learner jumps to a different one.
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    const idx = PROGRAM_LEVELS.findIndex((level) => {
      const percents = level.sessions.map((s) => sessionProgressPercent(s, completedSections, track));
      const trackableCount = level.sessions.filter((s) => s.lessonId).length;
      return !(trackableCount === level.sessions.length && percents.every((p) => p >= 100));
    });
    return idx === -1 ? PROGRAM_LEVELS.length - 1 : idx;
  });
  const selectedLevel = PROGRAM_LEVELS[selectedIndex];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-10 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">My Roadmap</h1>
          <p className="text-[16px] leading-[1.5] text-gray-light">Master core skills with personalized builds.</p>
        </div>
        <LevelTimeline
          levels={PROGRAM_LEVELS}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          completedSections={completedSections}
          track={track}
        />
      </div>

      <LevelSessions key={selectedLevel.number} level={selectedLevel} knownRole={knownRole} completedSections={completedSections} track={track} />
    </div>
  );
}
