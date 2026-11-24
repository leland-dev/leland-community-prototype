import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { PROGRAM_LEVELS, type RoadmapLevel, type RoadmapSession } from "../data/programRoadmap";
import type { LiveSessionBannerBlock, RoleBuild, RoleBuildPickerBlock } from "../data/lessonBlocks";
import { useSelectedCategory } from "../contexts/SelectedCategoryContext";
import { CATEGORY_TO_ROLE } from "../lib/categories";
import { TRACK_STORAGE_KEY, type CourseTrack } from "../components/TrackPickerModal";
import { IconCheck, IconDotsHorizontal, Modal, ModalContent, ModalSize, SwitchInput, Tag, TagColor, TagSize } from "../components/leland";
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

// The session's build content, as a three-tier fallback: role-matched
// examples to pick from, then the lesson's own Apply-build titles when none
// are role-matched, then a plain build count when there's no Apply content
// at all. Shared by the accordion row's expanded body and the featured-hero
// layout's side column, so both read the same lesson the same way.
function BuildPreview({ session, knownRole }: { session: RoadmapSession; knownRole: string | null }) {
  const allExamples = session.applyBuilds.flatMap((b) => (b.picker ? matchedBuilds(b.picker, knownRole) : []));
  if (allExamples.length > 0) {
    return (
      <>
        <p className="text-[14px] font-semibold text-gray-dark">
          Pick a build to try
          {allExamples.length > EXAMPLE_BUILDS_SHOWN && (
            <span className="ml-2 text-[14px] font-normal text-gray-light">+{allExamples.length - EXAMPLE_BUILDS_SHOWN} more</span>
          )}
        </p>
        <div className="mt-2.5">
          <ExampleBuilds builds={allExamples} />
        </div>
      </>
    );
  }
  // No role-matched examples — either no apply builds at all, or there are
  // some but none are tied to this learner's role yet — so fall back to a
  // plain, learner-facing build count rather than a separate "what you'll
  // build" listing.
  return (
    <p className="text-[14px] text-gray-light">
      {session.totalBuildCount} build{session.totalBuildCount === 1 ? "" : "s"} in this lesson
    </p>
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

// Toggled from the bottom-left prototype-options menu — "accordion" is the
// shipped-feeling default (every lesson gets an equal, collapsible row);
// "featured" is the exploration from Slack: the lesson you're actually on
// gets real display-font real estate, a description, and live session +
// builds alongside it, with everything else folded into a plain list below.
type LayoutMode = "accordion" | "featured";
const LAYOUT_MODE_KEY = "program-roadmap-prototype-options";

// Shared by the accordion row and the featured hero's side column — same
// bordered box, same icon-left/date-on-top-subtext-below layout, in both
// places now, rather than the hero using a different heading-based format.
function LiveSessionBanner({ liveSession }: { liveSession: LiveSessionBannerBlock }) {
  const dateText = liveSession.time ?? `${liveSession.month} ${liveSession.day}`;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-stroke bg-white p-4">
      <CalendarIcon day={liveSession.day} size="sm" />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="text-[14px] font-semibold leading-[1.2] text-gray-dark">{dateText}</p>
        <p className="text-[14px] leading-[1.4] text-gray-light">Live session available</p>
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
function SessionProgressBar({ percent, className = "inline-flex" }: { percent: number; className?: string }) {
  const complete = percent >= 100;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <span className={`shrink-0 items-center gap-2 ${className}`}>
      <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-gray-stroke sm:w-20">
        <span className="absolute inset-y-0 left-0 rounded-full bg-gray-dark" style={{ width: `${clamped}%` }} />
      </span>
      {complete && <IconCheck className="size-3.5 shrink-0 text-gray-dark" />}
    </span>
  );
}

// Resume where the learner left off — the first not-yet-completed tracked
// section — same resume logic ContentViewer itself would land on; falls back
// to the first section when nothing's been completed yet. Shared by the
// accordion row and the featured hero, since both need the same "where does
// this lesson's CTA actually send you" answer.
function useSessionCourseUrl(session: RoadmapSession, completedSections: Set<string>, track: CourseTrack | null) {
  const sections = session.lessonId ? trackedSections(session, track) : [];
  const resumeSection = sections.find((s) => !completedSections.has(`${session.lessonId}/${s.id}`)) ?? sections[0];
  return session.lessonId && resumeSection ? `/content-viewer/${session.lessonId}/${resumeSection.id}` : null;
}

function SessionCtaButton({
  status,
  percent,
  lessonLabel,
  courseUrl,
  variant = "primary",
  className = "",
}: {
  status: SessionStatus;
  percent: number;
  lessonLabel: string;
  courseUrl: string | null;
  // Only the featured hero's own lesson gets the yellow primary treatment —
  // plain accordion rows (including the "more lessons" list under the
  // featured layout, where the hero's primary button is already on screen)
  // use secondary so there's never two yellow buttons competing for
  // attention at once.
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <Button
      size="md"
      variant={variant}
      rounded="rounded-full"
      className={`shrink-0 font-semibold ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        if (courseUrl) navigate(courseUrl);
      }}
    >
      {status === "completed" ? "Review" : percent > 0 ? `Resume ${lessonLabel}` : `Start ${lessonLabel}`}
    </Button>
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
  const courseUrl = useSessionCourseUrl(session, completedSections, track);
  // "Session N" (the data's internal ordinal) reads as "Lesson N" everywhere
  // learner-facing, matching the course player's own terminology.
  const lessonLabel = session.ordinal.replace("Session", "Lesson");
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
        className={`flex w-full flex-col bg-white px-5 text-left lg:px-6 ${expanded ? "pt-5 pb-6" : "py-6"}`}
      >
        {/* The progress bar + chevron live in this row with the eyebrow/title
            only — the description and CTA below are separate siblings (not
            nested in this same column) specifically so adding them when
            expanded can't pull the row's own vertical centering down with
            them; on desktop the bar and chevron stay aligned with the title
            line itself. On mobile, where the title takes the full line, the
            progress bar still wraps below it via this row's own flex-wrap. */}
        <div className="flex w-full items-start gap-3 sm:items-center">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-4">
            {/* Same eyebrow-above-title pattern the course player itself uses
                for "Lesson N · Xm" — makes the lesson/level hierarchy legible
                at a glance instead of relying on list position alone. */}
            <div className="flex min-w-0 basis-full flex-col gap-1.5 sm:basis-0 sm:flex-1">
              <p className="text-[14px] font-normal leading-[1.15] text-gray-light">
                {lessonLabel}
                {session.durationMin && ` · ${session.durationMin} min`}
              </p>
              <p className="text-[16px] font-semibold text-gray-dark sm:text-[18px]">{session.title}</p>
            </div>
            {/* Only sessions with real tracked content (Level 1 today) get a
                progress indicator. On mobile, once expanded, it moves below
                the description instead of wrapping here next to the title —
                this copy stays hidden there and the one after the
                description takes over. */}
            {session.lessonId && <SessionProgressBar percent={percent} className={expanded ? "hidden sm:inline-flex" : "inline-flex"} />}
          </div>
          <Chevron expanded={expanded} className="shrink-0" />
        </div>
        {expanded && (
          <>
            <p className="mt-1.5 text-[14px] leading-[1.5] text-gray-light">{session.description}</p>
            {session.lessonId && (
              <div className="mt-3 sm:hidden">
                <SessionProgressBar percent={percent} className="inline-flex" />
              </div>
            )}
            {/* CTA lives right under the description, in the same header
                block, instead of its own section below — so it reads as
                attached to this lesson rather than floating in the expanded
                body. Extra breathing room on mobile (mt-4), where the button
                sits right under running text instead of next to it. */}
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              <SessionCtaButton status={status} percent={percent} lessonLabel={lessonLabel} courseUrl={courseUrl} variant="secondary" />
            </div>
          </>
        )}
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
            <div className="flex flex-col gap-4 rounded-b-xl bg-white px-5 pb-5 lg:px-6 lg:pb-6">
              {session.liveSession && <LiveSessionBanner liveSession={session.liveSession} />}
              <div className="rounded-xl border border-gray-stroke p-4">
                <BuildPreview session={session} knownRole={knownRole} />
              </div>
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
                {/* Short "Level N" here, not the full title — that's what
                    already makes this row read as levels rather than a
                    generic stepper, and the full title only needs to appear
                    once, in the heading above this level's lessons. */}
                <span className={`block w-full text-[12px] leading-tight ${selected ? "font-semibold text-gray-dark" : "font-medium text-gray-light"}`}>
                  Level {level.number}
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

// One cover-art color per level, standing in for a real uploaded course
// thumbnail — this prototype has no per-level image assets, but a flat
// color block with the same "AI Builder Program" wordmark + level chip
// reads as a course cover at a glance without needing one.
const LEVEL_ACCENTS: Record<number, string> = {
  1: "bg-[#FFD96F]",
  2: "bg-[#A9C6E8]",
  3: "bg-[#D9CEB5]",
  4: "bg-[#C9A27C]",
};

function LevelCoverArt({ level, muted }: { level: RoadmapLevel; muted: boolean }) {
  return (
    <div className={`relative h-20 w-full overflow-hidden rounded-lg ${LEVEL_ACCENTS[level.number] ?? "bg-gray-stroke"} ${muted ? "grayscale opacity-60" : ""}`}>
      <p className="absolute left-2 top-2 text-[10px] font-semibold leading-tight text-black/70">
        AI Builder
        <br />
        Program
      </p>
      <span className="absolute bottom-2 left-2 flex size-4 items-center justify-center rounded-[3px] bg-black/80 text-[9px] font-semibold text-white">
        {level.number}
      </span>
    </div>
  );
}

// Bigger, clickable level cards — the alternative to LevelTimeline's slim
// stepper for the "featured" prototype layout. Each one looks like a course
// card (cover art + title + progress) instead of a bare numbered circle, at
// the cost of a lot more horizontal space per level.
function LevelCards({
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
      <div className="flex gap-2 rounded-2xl bg-black/[0.03] p-2">
        {levels.map((level, i) => {
          const percents = level.sessions.map((s) => sessionProgressPercent(s, completedSections, track));
          const levelPercent = percents.length ? percents.reduce((a, b) => a + b, 0) / percents.length : 0;
          const selected = i === selectedIndex;
          return (
            <button
              key={level.number}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={selected}
              className={`flex w-[200px] shrink-0 flex-col gap-2 rounded-xl p-2 text-left transition-colors ${
                selected ? "bg-white shadow-sm" : "hover:bg-white/60"
              }`}
            >
              <LevelCoverArt level={level} muted={!selected} />
              {/* flex-1 here (not on the bar) is what bottom-anchors the
                  progress bar — it absorbs whatever extra height a shorter
                  title leaves once the row stretches every card to match
                  the tallest one, so every bar lands on the same line
                  regardless of how many lines the title above it wraps to,
                  still inset by the card's own p-2. */}
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-light">Level {level.number}</p>
                <p className={`text-[13px] leading-tight ${selected ? "font-semibold text-gray-dark" : "font-medium text-gray-light"}`}>{level.title}</p>
              </div>
              <div className="relative h-1 w-full shrink-0 overflow-hidden rounded-full bg-gray-stroke">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gray-dark" style={{ width: `${levelPercent}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// The "start here" lesson, featured at full display-font size instead of
// folded into the accordion list below — live session + build preview move
// into a side column on desktop, matching the project's "my build progress
// matters more than which page I'm on" pitch from the Slack thread, not just
// a bigger title.
function FeaturedHero({
  session,
  status,
  percent,
  completeCount,
  knownRole,
  completedSections,
  track,
}: {
  session: RoadmapSession;
  status: SessionStatus;
  percent: number;
  // How many *other* sessions in this level are already done — decides
  // whether the badge reads "Start Here" (nothing done yet), "Up Next"
  // (picking back up after finishing something else), or "Continue" (this
  // exact lesson is itself already in progress).
  completeCount: number;
  knownRole: string | null;
  completedSections: Set<string>;
  track: CourseTrack | null;
}) {
  const courseUrl = useSessionCourseUrl(session, completedSections, track);
  const lessonLabel = session.ordinal.replace("Session", "Lesson");
  const clamped = Math.max(0, Math.min(100, percent));
  const badgeText = percent > 0 ? "Continue" : completeCount > 0 ? "Up Next" : "Start Here";
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {status !== "completed" && (
          <div className="self-start">
            <Tag text={badgeText} tagColor={TagColor.GREEN} size={TagSize.XS} />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-[30px] font-medium leading-[1.15] text-gray-dark sm:text-[34px]">{session.title}</h2>
          <p className="text-[14px] font-medium leading-[1.15] text-gray-light">
            {lessonLabel}
            {session.durationMin && ` · ${session.durationMin} min`}
          </p>
        </div>
        <p className="max-w-[540px] text-[15px] leading-[1.55] text-gray-light">{session.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <div className="relative h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-gray-stroke">
            <div className="absolute inset-y-0 left-0 rounded-full bg-gray-dark" style={{ width: `${clamped}%` }} />
          </div>
          <span className="text-[13px] font-medium text-gray-light">{Math.round(clamped)}%</span>
          <SessionCtaButton status={status} percent={percent} lessonLabel={lessonLabel} courseUrl={courseUrl} />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-[300px] lg:shrink-0">
        {session.liveSession && <LiveSessionBanner liveSession={session.liveSession} />}
        <div className="rounded-xl border border-gray-stroke p-4">
          <BuildPreview session={session} knownRole={knownRole} />
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
  layoutMode,
}: {
  level: RoadmapLevel;
  knownRole: string | null;
  completedSections: Set<string>;
  track: CourseTrack | null;
  layoutMode: LayoutMode;
}) {
  const sessionPercent = level.sessions.map((s) => sessionProgressPercent(s, completedSections, track));
  const sessionDone = sessionPercent.map((p) => p >= 100);
  // "Current" is the first not-yet-done session, by position — sessions
  // aren't gated, so a learner can finish them out of order, but there's
  // still always exactly one called out.
  const firstIncompleteIndex = sessionDone.indexOf(false);
  const statusOf = (i: number): SessionStatus =>
    level.status === "not-started" ? "upcoming" : sessionDone[i] ? "completed" : i === firstIncompleteIndex ? "current" : "upcoming";
  // Only one session open at a time within a level — expanding one closes
  // whichever other one was open. Auto-expand whichever session has real
  // in-progress work (started but not done); if nothing's been started at
  // all, open just the first session instead, so there's still something to
  // act on. In the featured layout the "current" lesson already gets its own
  // full-size hero below, so nothing in the plain list starts expanded.
  const [expandedSession, setExpandedSession] = useState<string | null>(() => {
    if (layoutMode === "featured") return null;
    const inProgress = level.sessions.find((s, i) => sessionPercent[i] > 0 && !sessionDone[i]);
    if (inProgress) return inProgress.ordinal;
    return level.sessions.length > 0 ? level.sessions[0].ordinal : null;
  });
  const toggleSession = (ordinal: string) => setExpandedSession((prev) => (prev === ordinal ? null : ordinal));

  if (layoutMode === "featured" && level.sessions.length > 0) {
    // The featured lesson is whichever one the accordion view would already
    // call "current" — the first not-yet-done one — or just the first
    // lesson when the level hasn't started yet (nothing is "current" then).
    const featuredIndex = firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex;
    const featuredSession = level.sessions[featuredIndex];
    const otherSessions = level.sessions.filter((_, i) => i !== featuredIndex);
    const completeCount = sessionDone.filter(Boolean).length;
    return (
      <div className="flex flex-col gap-6">
        <FeaturedHero
          session={featuredSession}
          status={statusOf(featuredIndex)}
          percent={sessionPercent[featuredIndex]}
          completeCount={completeCount}
          knownRole={knownRole}
          completedSections={completedSections}
          track={track}
        />
        {otherSessions.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-gray-dark">More lessons in this level</p>
              <p className="text-[13px] text-gray-light">
                {completeCount} of {level.sessions.length} complete
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {level.sessions.map((session, i) => {
                if (i === featuredIndex) return null;
                return (
                  <SessionRow
                    key={session.ordinal}
                    session={session}
                    status={statusOf(i)}
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
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {level.sessions.map((session, i) => (
        <SessionRow
          key={session.ordinal}
          session={session}
          status={statusOf(i)}
          percent={sessionPercent[i]}
          knownRole={knownRole}
          expanded={expandedSession === session.ordinal}
          onToggle={() => toggleSession(session.ordinal)}
          completedSections={completedSections}
          track={track}
        />
      ))}
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
  const [levelMenuOpen, setLevelMenuOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    try {
      return (localStorage.getItem(LAYOUT_MODE_KEY) as LayoutMode | null) ?? "accordion";
    } catch {
      return "accordion";
    }
  });
  const [prototypeOptionsOpen, setPrototypeOptionsOpen] = useState(false);
  const setFeaturedLayout = (on: boolean) => {
    const next: LayoutMode = on ? "featured" : "accordion";
    setLayoutMode(next);
    try {
      localStorage.setItem(LAYOUT_MODE_KEY, next);
    } catch {
      // ignore — prototype-only persistence
    }
  };

  // The floating level switcher below should only appear once the learner
  // has scrolled the big title out of view — it's redundant while that
  // title's still on screen. "-61px" on the root shrinks the observed
  // viewport by the top nav's own height, so this flips right as the title
  // passes behind the nav instead of while it's still technically visible
  // underneath it.
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleScrolledPast, setTitleScrolledPast] = useState(false);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setTitleScrolledPast(!entry.isIntersecting);
        if (entry.isIntersecting) setLevelMenuOpen(false);
      },
      { rootMargin: "-61px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-10 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-7">
        {layoutMode === "featured" ? (
          <LevelCards
            levels={PROGRAM_LEVELS}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            completedSections={completedSections}
            track={track}
          />
        ) : (
          <LevelTimeline
            levels={PROGRAM_LEVELS}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            completedSections={completedSections}
            track={track}
          />
        )}
        {/* The level's own title carries the page heading now — "My
            Roadmap" already lives on the nav item that got you here, so
            repeating it as page copy was a second, redundant display-font
            heading competing with this one. It follows the timeline (the
            program-wide progress indicator) instead of leading it, so the
            overview reads before the detail. No separate "Level N" label
            here — the timeline above already says which one is selected.
            In the featured layout, the selected level card already shows
            this same title, so repeating it again here would be a third
            copy of it on screen — the ref stays mounted either way so the
            floating "Level N" indicator's scroll trigger doesn't move. */}
        <div ref={titleRef}>
          {layoutMode !== "featured" && (
            <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">{selectedLevel.title}</h1>
          )}
        </div>
      </div>

      {/* Floating, not part of the document flow — it only ever appears once
          the title above has scrolled past (see the observer above), so it
          never needs to reserve layout space of its own, and showing/hiding
          it never shifts the content underneath. Docked just below the 61px
          top nav (same anchor the sidebar itself uses). An opaque band (not
          a bare floating chip) so it cleanly covers whatever lesson card has
          scrolled up underneath instead of visibly overlapping it — solid
          through the button, then fading out over the extra pb-16 of height
          below it, instead of cutting off right at the button's own edge.
          A compact "Level N" indicator rather than a repeat of the title
          above, so it doesn't compete with the H1 for display-font
          hierarchy. Still doubles as the level switcher via the same
          dropdown-menu pattern as FilterDropdown
          (src/pages/b2b/B2BOverviewV2.tsx) rather than a native select. */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-14 z-20 bg-gradient-to-b from-[#F9F8F3] via-[#F9F8F3] via-40% to-transparent pb-6 transition-opacity duration-150 md:top-[61px] md:left-[264px] ${titleScrolledPast ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!titleScrolledPast}
      >
        <div className={`mx-auto max-w-[980px] px-4 py-4 sm:px-6 ${titleScrolledPast ? "pointer-events-auto" : ""}`}>
          <div className="relative md:inline-block">
            {/* Full-width on mobile, content-hugging and left-aligned on
                desktop — either way it names the level, not just its
                number, with the name in a lighter weight/color so "Level N"
                still reads as the primary label. */}
            <button
              type="button"
              onClick={() => setLevelMenuOpen((v) => !v)}
              aria-expanded={levelMenuOpen}
              tabIndex={titleScrolledPast ? 0 : -1}
              className="flex w-full items-center justify-between gap-2 rounded-full border border-gray-stroke bg-white px-5 py-3 text-left text-[14px] font-semibold text-gray-dark shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)] md:w-auto md:justify-start"
            >
              <span>
                Level {selectedLevel.number}
                <span className="font-normal text-gray-light"> · {selectedLevel.title}</span>
              </span>
              <Chevron expanded={levelMenuOpen} className="shrink-0" />
            </button>
            {levelMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLevelMenuOpen(false)} />
                <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-stroke bg-white p-1.5 shadow-lg md:right-auto md:w-max md:min-w-[260px] md:max-w-[320px]">
                  {PROGRAM_LEVELS.map((level, i) => (
                    <button
                      key={level.number}
                      type="button"
                      onClick={() => {
                        setSelectedIndex(i);
                        setLevelMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark hover:bg-gray-hover"
                    >
                      <span>
                        Level {level.number}: {level.title}
                      </span>
                      {i === selectedIndex && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
                          <polyline points="3 8.5 6.5 12 13 4.5" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <LevelSessions
          key={selectedLevel.number}
          level={selectedLevel}
          knownRole={knownRole}
          completedSections={completedSections}
          track={track}
          layoutMode={layoutMode}
        />
      </div>

      {/* Prototype-only control, not part of the product UI — same
          bottom-left "..." pattern as ProgramHub.tsx and ContentViewer.tsx. */}
      <button
        type="button"
        onClick={() => setPrototypeOptionsOpen(true)}
        aria-label="Prototype options"
        className="fixed bottom-20 left-4 z-50 flex items-center justify-center rounded-full border border-gray-stroke bg-white p-2.5 shadow-sm hover:bg-gray-hover md:bottom-4"
      >
        <IconDotsHorizontal className="size-4 text-gray-light" />
      </button>
      <Modal open={prototypeOptionsOpen} onOpenChange={setPrototypeOptionsOpen}>
        <ModalContent size={ModalSize.SMALL}>
          <div className="flex flex-col gap-4 p-6">
            <h2 className="text-[18px] font-semibold text-gray-dark">Prototype options</h2>
            <SwitchInput
              label="Featured lesson layout"
              isChecked={layoutMode === "featured"}
              onToggle={setFeaturedLayout}
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
