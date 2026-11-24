// Real AI Builder Program content for the "My Roadmap" alt-nav view.
//
// Level 1's four sessions reuse this prototype's own hand-authored lesson
// content (src/data/sampleLesson{,2,3,4}.ts) rather than the generic course
// outline — that's where the real signal for "what's the crux of this
// lesson" already lives: each build section optionally carries a
// `label: { text: "Practice" | "Apply" }`, and an "Apply" section is
// sometimes a RoleBuildPicker with real role-scoped tutorial options. A
// lesson with no labels at all (Lesson 3 today) has no signal to feature a
// build from, so it falls back to title-only until someone tags one.
//
// Levels 2-4 don't have hand-authored lesson content in this prototype yet
// (no sampleLesson5.ts etc.) — only the generic course outline — so they
// carry no Practice/Apply signal either and get the same title-only
// treatment.

import type { Block, BlockSection, LiveSessionBannerBlock, RoleBuildPickerBlock } from "./lessonBlocks";
import { LESSON_1_SECTIONS, LESSON_1_TOP_BLOCKS } from "./sampleLesson";
import { LESSON_2_SECTIONS, LESSON_2_TOP_BLOCKS } from "./sampleLesson2";
import { LESSON_3_SECTIONS, LESSON_3_TOP_BLOCKS } from "./sampleLesson3";
import { LESSON_4_SECTIONS, LESSON_4_TOP_BLOCKS } from "./sampleLesson4";

export type FeaturedBuild = {
  title: string;
  // Present when this build is a RoleBuildPicker — the learner's own known
  // role (from onboarding/personalization) picks one build from it, the same
  // way ProgramHub's "Up Next" card does via pickRoleBuild. We already know
  // the role here, so the roadmap should show the one or two builds relevant
  // to them, not every role's options.
  picker?: RoleBuildPickerBlock;
};

export type RoadmapSession = {
  ordinal: string; // "Session 1"
  title: string;
  durationMin: number | null;
  // True when at least one of this lesson's build sections carries a
  // Practice/Apply label — the signal the roadmap preview needs to know
  // what to feature. False means: show the lesson title only.
  hasSignal: boolean;
  practiceBuildTitles: string[];
  applyBuilds: FeaturedBuild[];
  totalBuildCount: number;
  // Set only when this session has real tracked content in ContentViewer
  // (Level 1's four sessions today — lesson-1..lesson-4). Lets the roadmap
  // read real completion from the same "content-viewer-completed"
  // localStorage store ContentViewer itself writes to, instead of a
  // hand-set count. Undefined means there's nothing to track yet (Levels
  // 2-4, no hand-authored lesson content), so the session can never show
  // as completed or current.
  lessonId?: string;
  sections?: BlockSection[];
  // Real upcoming-live-session data from each lesson's own top banner block,
  // when it has one — the same data the lesson viewer itself shows.
  liveSession?: LiveSessionBannerBlock;
};

export type RoadmapLevel = {
  number: number;
  title: string;
  status: "in-progress" | "not-started";
  sessions: RoadmapSession[];
};

// A build/practice/featured section's id always matches one of these across
// every lesson file — everything else (welcome, intro, concepts, demo-day,
// share, wrap, tool-setup) is scaffolding, not a build.
const BUILD_SECTION_ID = /^(build-\d+|practice-\d+|featured-build)$/;

function pickerOf(section: BlockSection): RoleBuildPickerBlock | undefined {
  const picker = section.blocks.find((b) => b.kind === "roleBuildPicker");
  return picker && picker.kind === "roleBuildPicker" ? picker : undefined;
}

function deriveSession(
  ordinal: string,
  title: string,
  durationMin: number | null,
  sections: BlockSection[],
  lessonId?: string,
  topBlocks?: Block[]
): RoadmapSession {
  const buildSections = sections.filter((s) => BUILD_SECTION_ID.test(s.id));
  const practice = buildSections.filter((s) => s.label?.text === "Practice");
  const apply = buildSections.filter((s) => s.label?.text === "Apply");
  const liveSessionBlock = topBlocks?.find((b) => b.kind === "liveSessionBanner");
  return {
    ordinal,
    title,
    durationMin,
    hasSignal: practice.length > 0 || apply.length > 0,
    practiceBuildTitles: practice.map((s) => s.title),
    applyBuilds: apply.map((s) => ({ title: s.title, picker: pickerOf(s) })),
    totalBuildCount: buildSections.length,
    lessonId,
    sections,
    liveSession: liveSessionBlock && liveSessionBlock.kind === "liveSessionBanner" ? liveSessionBlock : undefined,
  };
}

export const PROGRAM_LEVELS: RoadmapLevel[] = [
  {
    number: 1,
    title: "Use AI to 10x Your Impact",
    status: "in-progress",
    sessions: [
      deriveSession("Session 1", "Build a Real Product with World-Class Design", 90, LESSON_1_SECTIONS, "lesson-1", LESSON_1_TOP_BLOCKS),
      deriveSession("Session 2", "Automate Communication in Your Voice", 90, LESSON_2_SECTIONS, "lesson-2", LESSON_2_TOP_BLOCKS),
      deriveSession("Session 3", "Analyze Data and Design Presentations That Build Themselves", 90, LESSON_3_SECTIONS, "lesson-3", LESSON_3_TOP_BLOCKS),
      deriveSession("Session 4", "Launch Your Custom AI System + Demo Day", 90, LESSON_4_SECTIONS, "lesson-4", LESSON_4_TOP_BLOCKS),
    ],
  },
  // Levels 2-4 have no hand-authored lesson content in this prototype yet
  // (only the generic course outline), so every session here is title-only
  // (hasSignal: false) and has no lessonId — nothing to track completion
  // against until that content exists.
  {
    number: 2,
    title: "Build Complex Agentic Workflows",
    status: "not-started",
    sessions: [
      { ordinal: "Session 1", title: "Build Your Intern", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 3 },
      { ordinal: "Session 2", title: "Build Your Second Brain", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 3 },
      { ordinal: "Session 3", title: "Automate Your Work", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 3 },
      { ordinal: "Session 4", title: "AI Governance + Demo Day", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 3 },
    ],
  },
  {
    number: 3,
    title: "Create Autonomous Agents",
    status: "not-started",
    sessions: [
      { ordinal: "Session 1", title: "Build Your Agentic Operating System", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 5 },
      { ordinal: "Session 2", title: "Build Your First Subagents", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 4 },
      { ordinal: "Session 3", title: "Strengthen Your Agents with Skills, Tools, and Context", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 5 },
      { ordinal: "Session 4", title: "Build an Eval System + Demo Day", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 4 },
    ],
  },
  {
    number: 4,
    title: "Build Your Agent Workforce",
    status: "not-started",
    sessions: [
      { ordinal: "Session 1", title: "Scope Your AI Employee", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 3 },
      { ordinal: "Session 2", title: "Build Your Orchestrated Pipeline", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 4 },
      { ordinal: "Session 3", title: "Host and Deploy Your Agent", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 3 },
      { ordinal: "Session 4", title: "Configure Recursive Improvement Loops + Demo Day", durationMin: 90, hasSignal: false, practiceBuildTitles: [], applyBuilds: [], totalBuildCount: 4 },
    ],
  },
];
