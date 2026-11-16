import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildTargetLabel,
  myGoals,
  type Goal,
  type Milestone,
  type Task,
  type TaskStatus,
  type TestAttempt,
  type GoalType,
} from "../data/goals";
import type { Answers, Plan } from "../data/goalPlans";

// Goals are mutated from three places — the dashboard card, goal detail, and
// the new-goal flow — so they live in one shared store. Prototype-only:
// in-memory, resets on reload.
interface GoalsContextValue {
  goals: Goal[];
  getGoal: (id: string) => Goal | undefined;
  toggleTask: (taskId: string) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  createTask: (input: { title: string; goalId: string; milestoneId?: string | null; dueDate?: string }) => void;
  createGoal: (input: CreateGoalInput) => Goal;
  // Appends a drafted plan's milestones to an existing goal — used when
  // resuming the draft-plan step for a goal that was created blank.
  addPlan: (goalId: string, plan: Plan) => void;
  // Edits
  updateGoal: (goalId: string, patch: Partial<Pick<Goal, "name" | "targetDate" | "description" | "targetScore" | "baselineScore" | "outcome" | "finalScore">>) => void;
  deleteGoal: (goalId: string) => void;
  completeGoal: (goalId: string, outcome?: string, finalScore?: number) => void;
  reopenGoal: (goalId: string) => void;
  updateTask: (taskId: string, patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => void;
  deleteTask: (taskId: string) => void;
  // Move a task to a different milestone (or null for "Other tasks") on the
  // same goal. No cross-goal move — that needs the master task list.
  reassignTask: (goalId: string, taskId: string, milestoneId: string | null) => void;
  addMilestone: (goalId: string, name: string) => void;
  updateMilestone: (goalId: string, milestoneId: string, patch: Partial<Pick<Milestone, "name" | "note">>) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  setMilestoneView: (goalId: string, milestoneId: string, view: "list" | "kanban") => void;
  setOtherTasksView: (goalId: string, view: "list" | "kanban") => void;
  // Test outcomes
  addAttempt: (goalId: string, attempt: Omit<TestAttempt, "id">) => void;
  updateAttempt: (goalId: string, attemptId: string, patch: Partial<Omit<TestAttempt, "id">>) => void;
  deleteAttempt: (goalId: string, attemptId: string) => void;
  setSectionTarget: (goalId: string, section: string, target: number | undefined) => void;
}

export type CreateGoalInput = {
  name: string;
  type: GoalType;
  categories: string[];
  targetDate?: string;
  description?: string;
  targetScore?: number;
  baselineScore?: number;
  plan: Plan;
  // The details-step answers, kept only when the plan itself was skipped —
  // lets a later resumed draft regenerate the same tailored plan.
  planAnswers?: Answers;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

function mapGoal(goals: Goal[], goalId: string, fn: (goal: Goal) => Goal): Goal[] {
  return goals.map((g) => (g.id === goalId ? fn(g) : g));
}

function mapTasks(goal: Goal, fn: (task: Task) => Task): Goal {
  return {
    ...goal,
    milestones: goal.milestones.map((m) => ({ ...m, tasks: m.tasks.map(fn) })),
    otherTasks: goal.otherTasks.map(fn),
  };
}

// Checking a task off parks it in Done; unchecking returns it to where it
// came from (todo or in-progress) instead of always resetting to todo.
function flipTask(task: Task): Task {
  if (task.status === "done") {
    return { ...task, status: task.previousStatus ?? "todo", previousStatus: undefined };
  }
  return { ...task, status: "done", previousStatus: task.status };
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(myGoals);

  const getGoal = useCallback((id: string) => goals.find((g) => g.id === id), [goals]);

  // Apply fn to whichever container holds taskId — a milestone or a goal's
  // loose tasks.
  const patchTaskEverywhere = useCallback((taskId: string, fn: (t: Task) => Task) => {
    const apply = (t: Task) => (t.id === taskId ? fn(t) : t);
    setGoals((prev) => prev.map((goal) => mapTasks(goal, apply)));
  }, []);

  const toggleTask = useCallback((taskId: string) => patchTaskEverywhere(taskId, flipTask), [patchTaskEverywhere]);

  const moveTask = useCallback(
    (taskId: string, status: TaskStatus) =>
      patchTaskEverywhere(taskId, (t) =>
        t.status === status ? t : { ...t, status, previousStatus: status === "done" ? t.status : undefined },
      ),
    [patchTaskEverywhere],
  );

  const createTask = useCallback(
    ({ title, goalId, milestoneId, dueDate }: { title: string; goalId: string; milestoneId?: string | null; dueDate?: string }) => {
      const task: Task = { id: nextId("task"), title, status: "todo", dueDate };
      setGoals((prev) =>
        mapGoal(prev, goalId, (goal) =>
          !milestoneId
            ? { ...goal, otherTasks: [...goal.otherTasks, task] }
            : { ...goal, milestones: goal.milestones.map((m) => (m.id === milestoneId ? { ...m, tasks: [...m.tasks, task] } : m)) },
        ),
      );
    },
    [],
  );

  const createGoal = useCallback((input: CreateGoalInput) => {
    const milestones: Milestone[] = input.plan.projects.map((p) => ({
      id: nextId("milestone"),
      name: p.label,
      note: p.why,
      tasks: p.tasks.map((title) => ({ id: nextId("task"), title, status: "todo" as TaskStatus })),
    }));

    const goal: Goal = {
      id: nextId("goal"),
      name: input.name,
      type: input.type,
      categories: input.categories,
      targetDate: input.targetDate,
      targetLabel: buildTargetLabel(input.type, input.targetDate),
      description: input.description,
      targetScore: input.targetScore,
      baselineScore: input.baselineScore,
      milestones,
      otherTasks: [],
      planAnswers: input.planAnswers,
    };

    setGoals((prev) => [...prev, goal]);
    return goal;
  }, []);

  const addPlan = useCallback((goalId: string, plan: Plan) => {
    const milestones: Milestone[] = plan.projects.map((p) => ({
      id: nextId("milestone"),
      name: p.label,
      note: p.why,
      tasks: p.tasks.map((title) => ({ id: nextId("task"), title, status: "todo" as TaskStatus })),
    }));
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, milestones: [...goal.milestones, ...milestones] })));
  }, []);

  // ─── Edits ────────────────────────────────────────────────────────────────

  const updateGoal = useCallback((goalId: string, patch: Partial<Pick<Goal, "name" | "targetDate" | "description" | "targetScore" | "baselineScore" | "outcome" | "finalScore">>) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => {
        const next = { ...goal, ...patch };
        // The target line is derived copy, so a date edit has to regenerate it
        // rather than leave the old date showing.
        return "targetDate" in patch ? { ...next, targetLabel: buildTargetLabel(goal.type, patch.targetDate) } : next;
      }),
    );
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  const completeGoal = useCallback((goalId: string, outcome?: string, finalScore?: number) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, completedAt: new Date().toISOString().slice(0, 10), outcome, finalScore })));
  }, []);

  const reopenGoal = useCallback((goalId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, completedAt: undefined, outcome: undefined, finalScore: undefined })));
  }, []);

  const updateTask = useCallback(
    (taskId: string, patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => patchTaskEverywhere(taskId, (t) => ({ ...t, ...patch })),
    [patchTaskEverywhere],
  );

  const deleteTask = useCallback((taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => ({
        ...goal,
        milestones: goal.milestones.map((m) => ({ ...m, tasks: m.tasks.filter((t) => t.id !== taskId) })),
        otherTasks: goal.otherTasks.filter((t) => t.id !== taskId),
      })),
    );
  }, []);

  const reassignTask = useCallback((goalId: string, taskId: string, milestoneId: string | null) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => {
        const found =
          goal.milestones.flatMap((m) => m.tasks).find((t) => t.id === taskId) ?? goal.otherTasks.find((t) => t.id === taskId);
        if (!found) return goal;
        const without = (tasks: Task[]) => tasks.filter((t) => t.id !== taskId);
        return {
          ...goal,
          milestones: goal.milestones.map((m) => ({
            ...m,
            tasks: m.id === milestoneId ? [...without(m.tasks), found] : without(m.tasks),
          })),
          otherTasks: milestoneId ? without(goal.otherTasks) : [...without(goal.otherTasks), found],
        };
      }),
    );
  }, []);

  const addMilestone = useCallback((goalId: string, name: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, milestones: [...goal.milestones, { id: nextId("milestone"), name, tasks: [] }] })));
  }, []);

  const updateMilestone = useCallback((goalId: string, milestoneId: string, patch: Partial<Pick<Milestone, "name" | "note">>) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({ ...goal, milestones: goal.milestones.map((m) => (m.id === milestoneId ? { ...m, ...patch } : m)) })),
    );
  }, []);

  // Deleting a milestone keeps its tasks — they fall back to "Other tasks"
  // rather than disappearing with the container.
  const deleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => {
        const milestone = goal.milestones.find((m) => m.id === milestoneId);
        return {
          ...goal,
          milestones: goal.milestones.filter((m) => m.id !== milestoneId),
          otherTasks: [...goal.otherTasks, ...(milestone?.tasks ?? [])],
        };
      }),
    );
  }, []);

  const setMilestoneView = useCallback((goalId: string, milestoneId: string, view: "list" | "kanban") => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({ ...goal, milestones: goal.milestones.map((m) => (m.id === milestoneId ? { ...m, view } : m)) })),
    );
  }, []);

  const setOtherTasksView = useCallback((goalId: string, view: "list" | "kanban") => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, otherTasksView: view })));
  }, []);

  const addAttempt = useCallback((goalId: string, attempt: Omit<TestAttempt, "id">) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, attempts: [...(goal.attempts ?? []), { ...attempt, id: nextId("attempt") }] })));
  }, []);

  const updateAttempt = useCallback((goalId: string, attemptId: string, patch: Partial<Omit<TestAttempt, "id">>) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        attempts: (goal.attempts ?? []).map((a) => (a.id === attemptId ? { ...a, ...patch } : a)),
      })),
    );
  }, []);

  const deleteAttempt = useCallback((goalId: string, attemptId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, attempts: (goal.attempts ?? []).filter((a) => a.id !== attemptId) })));
  }, []);

  const setSectionTarget = useCallback((goalId: string, section: string, target: number | undefined) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => {
        const next = { ...(goal.sectionTargets ?? {}) };
        if (target === undefined) delete next[section];
        else next[section] = target;
        return { ...goal, sectionTargets: next };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      goals, getGoal, toggleTask, moveTask, createTask, createGoal, addPlan,
      updateGoal, deleteGoal, completeGoal, reopenGoal, updateTask, deleteTask, reassignTask,
      addMilestone, updateMilestone, deleteMilestone, setMilestoneView, setOtherTasksView,
      addAttempt, updateAttempt, deleteAttempt, setSectionTarget,
    }),
    [
      goals, getGoal, toggleTask, moveTask, createTask, createGoal, addPlan,
      updateGoal, deleteGoal, completeGoal, reopenGoal, updateTask, deleteTask, reassignTask,
      addMilestone, updateMilestone, deleteMilestone, setMilestoneView, setOtherTasksView,
      addAttempt, updateAttempt, deleteAttempt, setSectionTarget,
    ],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within a GoalsProvider");
  return ctx;
}
