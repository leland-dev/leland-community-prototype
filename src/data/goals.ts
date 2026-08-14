// Goal-tracking data model for the customer dashboard (see
// design_handoff_goal_dashboard/README.md). A goal contains projects;
// projects contain one-off tasks. Routines are recurring, streak-tracked
// items that live on the goal directly, not inside a project.

import pic7 from "../assets/profile photos/pic-7.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";

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
};

// An item in the goal's content queue ("Worth your time" on goal detail).
export type GoalContentItem = {
  id: string;
  title: string;
  meta: string;
  image: string;
  action: string; // "Watch" / "Read" / "Save"
};

export type GoalType = "ai" | "career" | "school" | "test";
export type GoalStatus = "on-track" | "needs-action" | "completed";
export type ProjectsLayout = "stack" | "grid";

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
  projectsLayout?: ProjectsLayout;
  routines: Routine[];
  otherTasks: Task[]; // standalone tasks with no project (screen 2's "Other tasks")
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
