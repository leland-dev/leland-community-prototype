// Goal-tracking data model for the customer dashboard (see
// design_handoff_goal_dashboard/README.md). A goal contains projects;
// projects contain one-off tasks. Routines are recurring, streak-tracked
// items that live on the goal directly, not inside a project.

import pic7 from "../../assets/profile photos/pic-7.png";
import eventImg1 from "../../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../../assets/placeholder images/placeholder-event-03.png";

export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  title: string;
  dueDate?: string; // ISO date
  status: TaskStatus;
  assignedBy?: { name: string; avatarUrl: string }; // → "via Priya"
  note?: string;
  // Where the task sat before it was checked off, so unchecking a kanban card
  // returns it to its column instead of dropping it back to "To do".
  previousStatus?: TaskStatus;
};

export type Routine = {
  id: string;
  label: string;
  cadence: string;
  streak: number;
  lastCheckedAt?: string; // ISO date
};

export type Project = {
  id: string;
  name: string;
  note?: string;
  tasks: Task[];
  view?: "list" | "kanban";
  collapsed?: boolean;
  // How wide this project sits in the board grid. Set per project rather than
  // globally, so the page composes like Notion blocks — a wide kanban next to
  // two narrow lists — instead of forcing one layout on everything.
  span?: "full" | "half";
};

// An item in the goal's content queue ("Worth your time" on goal detail).
export type GoalContentItem = {
  id: string;
  title: string;
  meta: string;
  image: string;
  action: string; // "Watch" / "Read" / "Save"
};

// One sitting of a test — a practice run or the real thing. Sections are
// per-exam (see EXAM_SECTIONS); total is what gets reported.
export type TestAttempt = {
  id: string;
  kind: "practice" | "official";
  date: string; // ISO date
  total: number;
  sections?: Record<string, number>;
  note?: string;
  // Set when an expert logged or reviewed the sitting, so the customer can see
  // whose read this was — same "via" attribution used on tasks.
  loggedBy?: { name: string; avatarUrl: string };
};

export type GoalType = "ai" | "career" | "school" | "test";
export type GoalStatus = "on-track" | "needs-action" | "completed";

export type Goal = {
  id: string;
  name: string;
  type: GoalType;
  categories: string[];
  targetDate?: string; // ISO date
  // Display line under the goal name on the card, e.g. "Round 1 · Sept 15, 2026"
  // or "Offer signed by · Dec 2026" — bespoke per goal, not derivable from
  // type + targetDate alone.
  targetLabel: string;
  // What the customer said about this goal in their own words, captured during
  // creation and editable afterwards. Feeds category suggestions and gives the
  // expert context the structured fields don't carry.
  description?: string;
  projects: Project[];
  routines: Routine[];
  otherTasks: Task[]; // standalone tasks with no project (screen 2's "Other tasks")
  // The "Other tasks" bucket sits in the same reorderable, resizable board as
  // projects, so it carries the same per-tile view/span/collapsed state.
  otherTasksView?: "list" | "kanban";
  otherTasksSpan?: "full" | "half";
  otherTasksCollapsed?: boolean;
  // Where "Other tasks" sits among `projects` in the board's render order.
  // Undefined means "after every project" (today's default position).
  otherTasksIndex?: number;
  contentQueue: GoalContentItem[];
  // Set together, on the same action — a goal is either open or done, with the
  // result recorded at the moment it's closed out.
  completedAt?: string; // ISO date
  outcome?: string;
  // Test-type goals only: the score this goal is targeting, a previous score if
  // retaking, and the score actually recorded at completion. Validated against
  // TEST_SCORE_RANGE for the goal's category where one exists.
  targetScore?: number;
  baselineScore?: number;
  finalScore?: number;
  // Per-section targets, keyed by section name, plus every sitting logged.
  sectionTargets?: Record<string, number>;
  attempts?: TestAttempt[];
};

// Reference "today" the mock fixtures below are written against, mirroring
// how upcomingEvents/TODAY_DAY anchor Dashboard.tsx's other demo data to a
// fixed point instead of the real clock.
const TODAY = new Date(2026, 7, 14); // Aug 14, 2026
export const TODAY_ISO = "2026-08-14";

// New Date("YYYY-MM-DD") parses as UTC midnight, which rolls back a day once
// formatted in a timezone behind UTC. Parse the parts into a local date instead.
function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function shortDate(d: Date, withYear = false): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(withYear && { year: "numeric" }) });
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "done") return false;
  return parseISODate(task.dueDate).getTime() < TODAY.getTime();
}

export function dueLabel(dueDate: string): string {
  const due = parseISODate(dueDate);
  const days = Math.round((due.getTime() - TODAY.getTime()) / 86_400_000);
  if (days === 0) return "Due today";
  if (days < 0) return `Was due ${shortDate(due)}`;
  return `Due ${shortDate(due)}`;
}

const TARGET_PREFIX: Record<GoalType, string> = {
  ai: "Be there by",
  career: "Target date",
  school: "Deadline",
  test: "Test date",
};

// The display line under a goal name. Fixture goals carry bespoke copy
// ("Round 1 · Sept 15, 2026"); this generates it for goals created in-app and
// regenerates it whenever the target date is edited.
export function buildTargetLabel(type: GoalType, targetDate?: string): string {
  if (!targetDate) return "No date set";
  return `${TARGET_PREFIX[type]} · ${shortDate(parseISODate(targetDate), true)}`;
}

export function isCheckedToday(routine: Routine): boolean {
  return routine.lastCheckedAt === TODAY_ISO;
}

export function goalOneOffTasks(goal: Goal): Task[] {
  return [...goal.projects.flatMap((p) => p.tasks), ...goal.otherTasks];
}

export function goalProgress(goal: Goal): { done: number; total: number; pct: number } {
  const tasks = goalOneOffTasks(goal);
  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function overdueCount(goal: Goal): number {
  return goalOneOffTasks(goal).filter(isOverdue).length;
}

// Derived from the tasks underneath it, except completion — that's an
// explicit customer action (see completedAt), not something task state implies.
export function goalStatus(goal: Goal): GoalStatus {
  if (goal.completedAt) return "completed";
  return overdueCount(goal) > 0 ? "needs-action" : "on-track";
}

export type UpNext =
  | { kind: "routine"; title: string; dueLabel: string; streak: number }
  | { kind: "task"; title: string; dueLabel: string; assignedBy?: Task["assignedBy"] };

// What the goal card's "Up next" tile surfaces: the most urgent open item.
// Priority: an overdue one-off task, then a routine not yet checked off
// today, then the soonest upcoming task with a due date.
export function upNextItem(goal: Goal): UpNext | null {
  const tasks = goalOneOffTasks(goal).filter((t) => t.status !== "done");

  const overdueTask = tasks.find(isOverdue);
  if (overdueTask) {
    return { kind: "task", title: overdueTask.title, dueLabel: dueLabel(overdueTask.dueDate!), assignedBy: overdueTask.assignedBy };
  }

  const openRoutine = goal.routines.find((r) => !isCheckedToday(r));
  if (openRoutine) {
    return { kind: "routine", title: openRoutine.label, dueLabel: "Due today", streak: openRoutine.streak };
  }

  const upcoming = tasks
    .filter((t): t is Task & { dueDate: string } => !!t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  if (upcoming) {
    return { kind: "task", title: upcoming.title, dueLabel: dueLabel(upcoming.dueDate), assignedBy: upcoming.assignedBy };
  }

  return null;
}

// ─── Mock fixtures ──────────────────────────────────────────────────────────

export const myGoals: Goal[] = [
  {
    id: "gmat-720",
    name: "Hit 720 on the GMAT",
    type: "test",
    categories: ["GMAT"],
    targetDate: "2026-10-03",
    targetLabel: "Test date · Oct 3, 2026",
    description: "Retaking after a 640. Quant is the gap — verbal is already where it needs to be.",
    targetScore: 720,
    baselineScore: 640,
    sectionTargets: { Quantitative: 48, Verbal: 40 },
    attempts: [
      { id: "a-1", kind: "official", date: "2026-04-11", total: 640, sections: { Quantitative: 41, Verbal: 36 }, note: "First sitting. Ran out of time on the last five quant questions." },
      { id: "a-2", kind: "practice", date: "2026-06-20", total: 660, sections: { Quantitative: 43, Verbal: 37 } },
      { id: "a-3", kind: "practice", date: "2026-07-18", total: 690, sections: { Quantitative: 45, Verbal: 39 }, note: "Pacing drills are working.", loggedBy: { name: "Priya", avatarUrl: pic7 } },
      { id: "a-4", kind: "practice", date: "2026-08-08", total: 700, sections: { Quantitative: 46, Verbal: 40 }, loggedBy: { name: "Priya", avatarUrl: pic7 } },
    ],
    routines: [
      { id: "r-gmat-drill", label: "Timed quant set", cadence: "Every weekday", streak: 6, lastCheckedAt: "2026-08-13" },
      { id: "r-gmat-log", label: "Review error log", cadence: "Sundays", streak: 3 },
    ],
    otherTasks: [{ id: "t-gmat-book", title: "Book the Oct 3 sitting", status: "todo", dueDate: "2026-08-20" }],
    contentQueue: [
      { id: "c-gmat-1", title: "How I raised my GMAT score 80 points", meta: "Marcus Thomas · 15 min video", image: eventImg1, action: "Watch" },
      { id: "c-gmat-2", title: "Quant pacing framework", meta: "Priya Raman · Guide, 10 pages", image: eventImg2, action: "Read" },
      { id: "c-gmat-3", title: "Data sufficiency shortcuts", meta: "Livestream · Wed, Aug 26 at 6:00 PM", image: eventImg3, action: "Save" },
    ],
    projects: [
      {
        id: "p-gmat-quant",
        name: "Quant rebuild",
        note: "The 8-point gap is almost all here.",
        tasks: [
          { id: "t-q1", title: "Rebuild number properties from scratch", status: "done" },
          { id: "t-q2", title: "Drill data sufficiency to 80% accuracy", status: "in-progress" },
          { id: "t-q3", title: "Two timed quant sections back to back", status: "todo", dueDate: "2026-08-25" },
        ],
      },
      {
        id: "p-gmat-mocks",
        name: "Mocks",
        note: "Full-length, under real timing.",
        span: "half",
        tasks: [
          { id: "t-m1", title: "Mock 4 under timing", status: "todo", dueDate: "2026-09-05" },
          { id: "t-m2", title: "Final mock the week before", status: "todo", dueDate: "2026-09-26" },
        ],
      },
    ],
  },
  {
    id: "stanford-gsb",
    name: "Get into Stanford GSB",
    type: "school",
    categories: ["MBA"],
    targetDate: "2026-09-15",
    targetLabel: "Round 1 · Sept 15, 2026",
    routines: [{ id: "r-practice", label: "Daily practice set", cadence: "Daily", streak: 12, lastCheckedAt: "2026-08-13" }],
    otherTasks: [
      { id: "t-rec-1", title: "Request recommendation letter", status: "todo", dueDate: "2026-08-22" },
      { id: "t-submit-1", title: "Submit Round 1 application", status: "todo", dueDate: "2026-09-15" },
    ],
    contentQueue: [
      { id: "c-gsb-1", title: "How I got into Stanford GSB", meta: "Marcus Thomas · 18 min video", image: eventImg1, action: "Watch" },
      { id: "c-gsb-2", title: "MBA essay framework", meta: "Jessica Lin · Guide, 12 pages", image: eventImg2, action: "Read" },
      { id: "c-gsb-3", title: "Round 1 deadlines: what actually matters", meta: "Livestream · Wed, Aug 26 at 5:00 PM", image: eventImg3, action: "Save" },
    ],
    projects: [
      {
        id: "p-essays",
        name: "Application essays",
        note: "Two required essays, 1,050 words total.",
        tasks: [
          { id: "t-essay-1", title: "Draft essay 1 — why MBA", status: "done" },
          { id: "t-essay-2", title: "Draft essay 2 — leadership", status: "done" },
          { id: "t-essay-3", title: "Revise essay 1 based on feedback", status: "todo", dueDate: "2026-08-22" },
          { id: "t-essay-4", title: "Finalize essay 2", status: "todo", dueDate: "2026-08-29" },
        ],
      },
      {
        id: "p-test-prep",
        name: "GMAT prep",
        note: "Target 730. Test booked for Sept 8.",
        view: "kanban",
        tasks: [
          { id: "t-prep-1", title: "Take diagnostic GMAT", status: "in-progress" },
          { id: "t-prep-2", title: "Quant review — sessions 1-4", status: "todo" },
          { id: "t-prep-3", title: "Schedule official test date", status: "todo" },
        ],
      },
    ],
  },
  {
    id: "senior-pm-role",
    name: "Land a senior PM role",
    type: "career",
    categories: ["Product Management"],
    targetDate: "2026-12-01",
    targetLabel: "Offer signed by · Dec 2026",
    routines: [],
    otherTasks: [
      { id: "t-network-1", title: "Reach out to 3 PMs in target companies", status: "todo" },
      { id: "t-network-2", title: "Update LinkedIn headline", status: "done" },
    ],
    contentQueue: [
      { id: "c-pm-1", title: "Breaking into senior PM", meta: "Priya Raman · 24 min video", image: eventImg2, action: "Watch" },
      { id: "c-pm-2", title: "The PM resume that gets callbacks", meta: "David Kim · Guide, 9 pages", image: eventImg3, action: "Read" },
    ],
    projects: [
      {
        id: "p-target-list",
        name: "Target companies",
        note: "Fifteen companies, five with a warm intro.",
        tasks: [
          { id: "t-target-1", title: "Shortlist 10 target companies", status: "done" },
          { id: "t-target-2", title: "Research team + role fit for each", status: "done" },
          { id: "t-target-3", title: "Find a referral at top 3 picks", status: "todo" },
          { id: "t-target-4", title: "Set up job alerts", status: "todo" },
        ],
      },
      {
        id: "p-applications",
        name: "Applications",
        note: "Tailored resume per role, tracked in one place.",
        tasks: [
          {
            id: "t-app-1",
            title: "Rewrite resume bullets for PM scope",
            status: "todo",
            dueDate: "2026-08-10",
            assignedBy: { name: "Priya", avatarUrl: pic7 },
          },
          { id: "t-app-2", title: "Tailor resume for fintech roles", status: "todo" },
          { id: "t-app-3", title: "Apply to first 5 roles", status: "todo" },
          { id: "t-app-4", title: "Prep behavioral interview stories", status: "todo" },
        ],
      },
    ],
  },
];

// Tasks that belong to no goal. Real to-do lists always accumulate things that
// don't ladder up to a goal yet ("book the flight"), and forcing every task
// into a goal makes people either skip capture or invent junk goals. These can
// be assigned to a goal (and optionally a project) later.
export const myStandaloneTasks: Task[] = [
  { id: "t-solo-1", title: "Renew passport", status: "todo", dueDate: "2026-09-01" },
  { id: "t-solo-2", title: "Ask Jessica about her GSB interviewer", status: "todo" },
];

// ─── Test outcomes ──────────────────────────────────────────────────────────

// Attempts oldest-first, which is the order every chart and delta below wants.
export function sortedAttempts(goal: Goal): TestAttempt[] {
  return [...(goal.attempts ?? [])].sort((a, b) => a.date.localeCompare(b.date));
}

export type TestSummary = {
  attempts: TestAttempt[];
  baseline: TestAttempt | null;
  latest: TestAttempt | null;
  best: TestAttempt | null;
  bestOfficial: TestAttempt | null;
  // Change from the previous sitting to the latest one.
  delta: number | null;
  // Total gained since the first sitting.
  gained: number | null;
  target?: number;
  hitTarget: boolean;
};

export function testSummary(goal: Goal): TestSummary {
  const attempts = sortedAttempts(goal);
  const baseline = attempts[0] ?? null;
  const latest = attempts.length ? attempts[attempts.length - 1] : null;
  const best = attempts.reduce<TestAttempt | null>((acc, a) => (!acc || a.total > acc.total ? a : acc), null);
  const bestOfficial = attempts
    .filter((a) => a.kind === "official")
    .reduce<TestAttempt | null>((acc, a) => (!acc || a.total > acc.total ? a : acc), null);
  const previous = attempts.length > 1 ? attempts[attempts.length - 2] : null;

  return {
    attempts,
    baseline,
    latest,
    best,
    bestOfficial,
    delta: latest && previous ? latest.total - previous.total : null,
    gained: latest && baseline && latest !== baseline ? latest.total - baseline.total : null,
    target: goal.targetScore,
    // Measured against the best official sitting — a practice high doesn't get
    // you into school.
    hitTarget: goal.targetScore !== undefined && (bestOfficial?.total ?? -Infinity) >= goal.targetScore,
  };
}

// Latest recorded value and movement for one scored section.
export function sectionProgress(goal: Goal, section: string): { latest?: number; first?: number; delta: number | null; target?: number } {
  const withSection = sortedAttempts(goal).filter((a) => a.sections?.[section] !== undefined);
  const first = withSection[0]?.sections?.[section];
  const latest = withSection.length ? withSection[withSection.length - 1].sections?.[section] : undefined;
  return {
    latest,
    first,
    delta: latest !== undefined && first !== undefined && withSection.length > 1 ? latest - first : null,
    target: goal.sectionTargets?.[section],
  };
}

export function attemptDateLabel(iso: string): string {
  return shortDate(parseISODate(iso), true);
}
