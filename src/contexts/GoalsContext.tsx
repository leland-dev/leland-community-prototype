import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildTargetLabel,
  myGoals,
  myStandaloneTasks,
  TODAY_ISO,
  type Goal,
  type GoalContentItem,
  type Project,
  type Routine,
  type Task,
  type TaskStatus,
  type TestAttempt,
  type GoalType,
} from "../data/goals";
import type { Plan } from "../data/goalPlans";

// Sentinel id for the "Other tasks" tile in the goal-detail board — it isn't a
// real Project, but reorderBoardItem treats it as one so it can sit anywhere
// among the project cards.
export const OTHER_TASKS_TILE_ID = "__other-tasks__";

// Goals are mutated from three places — the dashboard card, goal detail, and
// the new-goal flow — so they live in one shared store. Prototype-only:
// in-memory, resets on reload.
interface GoalsContextValue {
  goals: Goal[];
  getGoal: (id: string) => Goal | undefined;
  // Tasks are addressed by their own id, not by (goalId, taskId) — a task can
  // live in a project, directly on a goal, or on nothing at all, and callers
  // shouldn't have to know which.
  standaloneTasks: Task[];
  toggleTask: (taskId: string) => void;
  toggleRoutine: (goalId: string, routineId: string) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  createTask: (input: { title: string; goalId?: string | null; projectId?: string | null; dueDate?: string }) => void;
  // Move an existing task between containers. Omit both ids to unassign it.
  assignTask: (taskId: string, target: { goalId?: string | null; projectId?: string | null }) => void;
  taskLocation: (taskId: string) => { goal: Goal | null; projectId: string | null };
  setProjectView: (goalId: string, projectId: string, view: "list" | "kanban") => void;
  toggleProjectCollapsed: (goalId: string, projectId: string) => void;
  // itemId/targetId are project ids or OTHER_TASKS_TILE_ID — the board treats
  // "Other tasks" as just another reorderable tile.
  reorderBoardItem: (goalId: string, itemId: string, targetId: string, edge?: "before" | "after", span?: "full" | "half") => void;
  setProjectSpan: (goalId: string, projectId: string, span: "full" | "half") => void;
  setOtherTasksView: (goalId: string, view: "list" | "kanban") => void;
  setOtherTasksSpan: (goalId: string, span: "full" | "half") => void;
  toggleOtherTasksCollapsed: (goalId: string) => void;
  createGoal: (input: CreateGoalInput) => Goal;
  // Edits
  updateGoal: (goalId: string, patch: Partial<Pick<Goal, "name" | "targetDate" | "description" | "targetScore" | "baselineScore" | "outcome" | "finalScore">>) => void;
  deleteGoal: (goalId: string) => void;
  completeGoal: (goalId: string, outcome?: string, finalScore?: number) => void;
  reopenGoal: (goalId: string) => void;
  updateContentItem: (goalId: string, itemId: string, patch: Partial<Pick<GoalContentItem, "title" | "meta">>) => void;
  deleteContentItem: (goalId: string, itemId: string) => void;
  updateTask: (taskId: string, patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => void;
  deleteTask: (taskId: string) => void;
  addProject: (goalId: string, name: string) => void;
  updateProject: (goalId: string, projectId: string, patch: Partial<Pick<Project, "name" | "note">>) => void;
  deleteProject: (goalId: string, projectId: string) => void;
  addRoutine: (goalId: string, label: string, cadence: string) => void;
  updateRoutine: (goalId: string, routineId: string, patch: Partial<Pick<Routine, "label" | "cadence">>) => void;
  deleteRoutine: (goalId: string, routineId: string) => void;
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
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

// Checking a task parks it in Done; unchecking returns it to where it came
// from, so a kanban card doesn't lose its column on a stray click.
function flipTask(task: Task): Task {
  if (task.status === "done") {
    return { ...task, status: task.previousStatus ?? "todo", previousStatus: undefined };
  }
  return { ...task, status: "done", previousStatus: task.status };
}

function mapGoal(goals: Goal[], goalId: string, fn: (goal: Goal) => Goal): Goal[] {
  return goals.map((g) => (g.id === goalId ? fn(g) : g));
}

function mapTasks(goal: Goal, fn: (task: Task) => Task): Goal {
  return {
    ...goal,
    projects: goal.projects.map((p) => ({ ...p, tasks: p.tasks.map(fn) })),
    otherTasks: goal.otherTasks.map(fn),
  };
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(myGoals);
  const [standaloneTasks, setStandaloneTasks] = useState<Task[]>(myStandaloneTasks);

  const getGoal = useCallback((id: string) => goals.find((g) => g.id === id), [goals]);

  // Apply fn to whichever container holds taskId — a project, a goal's loose
  // tasks, or the standalone list.
  const patchTaskEverywhere = useCallback((taskId: string, fn: (t: Task) => Task) => {
    const apply = (t: Task) => (t.id === taskId ? fn(t) : t);
    setGoals((prev) => prev.map((goal) => mapTasks(goal, apply)));
    setStandaloneTasks((prev) => prev.map(apply));
  }, []);

  const toggleTask = useCallback((taskId: string) => patchTaskEverywhere(taskId, flipTask), [patchTaskEverywhere]);

  const taskLocation = useCallback(
    (taskId: string) => {
      for (const goal of goals) {
        for (const p of goal.projects) {
          if (p.tasks.some((t) => t.id === taskId)) return { goal, projectId: p.id };
        }
        if (goal.otherTasks.some((t) => t.id === taskId)) return { goal, projectId: null };
      }
      return { goal: null, projectId: null };
    },
    [goals],
  );

  const toggleRoutine = useCallback((goalId: string, routineId: string) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        routines: goal.routines.map((r) => {
          if (r.id !== routineId) return r;
          const checkedToday = r.lastCheckedAt === TODAY_ISO;
          return {
            ...r,
            streak: checkedToday ? Math.max(0, r.streak - 1) : r.streak + 1,
            lastCheckedAt: checkedToday ? undefined : TODAY_ISO,
          };
        }),
      })),
    );
  }, []);

  const moveTask = useCallback(
    (taskId: string, status: TaskStatus) => {
      patchTaskEverywhere(taskId, (t) =>
        t.status === status ? t : { ...t, status, previousStatus: status === "done" ? t.status : undefined },
      );
    },
    [patchTaskEverywhere],
  );

  const createTask = useCallback(
    ({ title, goalId, projectId, dueDate }: { title: string; goalId?: string | null; projectId?: string | null; dueDate?: string }) => {
      const task: Task = { id: nextId("task"), title, status: "todo", dueDate };
      if (!goalId) {
        setStandaloneTasks((prev) => [...prev, task]);
        return;
      }
      setGoals((prev) =>
        mapGoal(prev, goalId, (goal) =>
          !projectId
            ? { ...goal, otherTasks: [...goal.otherTasks, task] }
            : { ...goal, projects: goal.projects.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)) },
        ),
      );
    },
    [],
  );

  const assignTask = useCallback(
    (taskId: string, target: { goalId?: string | null; projectId?: string | null }) => {
      // Resolve the task up front from current state, then update each list
      // independently — no cross-updater side effects, so this stays correct
      // under StrictMode's double-invoked updaters.
      const moved =
        standaloneTasks.find((t) => t.id === taskId) ??
        goals.flatMap((g) => [...g.projects.flatMap((p) => p.tasks), ...g.otherTasks]).find((t) => t.id === taskId);
      if (!moved) return;

      const without = (tasks: Task[]) => tasks.filter((t) => t.id !== taskId);

      setStandaloneTasks((prev) => (target.goalId ? without(prev) : [...without(prev), moved]));

      setGoals((prev) =>
        prev
          .map((goal) => ({
            ...goal,
            projects: goal.projects.map((p) => ({ ...p, tasks: without(p.tasks) })),
            otherTasks: without(goal.otherTasks),
          }))
          .map((goal) =>
            goal.id !== target.goalId
              ? goal
              : !target.projectId
                ? { ...goal, otherTasks: [...goal.otherTasks, moved] }
                : { ...goal, projects: goal.projects.map((p) => (p.id === target.projectId ? { ...p, tasks: [...p.tasks, moved] } : p)) },
          ),
      );
    },
    [goals, standaloneTasks],
  );

  const setProjectView = useCallback((goalId: string, projectId: string, view: "list" | "kanban") => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        projects: goal.projects.map((p) => (p.id === projectId ? { ...p, view } : p)),
      })),
    );
  }, []);

  const toggleProjectCollapsed = useCallback((goalId: string, projectId: string) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        projects: goal.projects.map((p) => (p.id === projectId ? { ...p, collapsed: !p.collapsed } : p)),
      })),
    );
  }, []);

  // Drag-to-reorder, Notion-style: the dragged tile is lifted out and
  // inserted before or after the drop target, depending on which edge of it
  // the cursor was nearest. Projects and the "Other tasks" tile share one
  // order — build a combined id list (projects, with OTHER_TASKS_TILE_ID
  // spliced in at its stored position), reorder that, then split it back into
  // `projects` plus a new `otherTasksIndex`.
  //
  // Dropping on the left/right edge tucks the tile in beside the target, so
  // it's forced to half width; dropping on the top/bottom edge gives it a
  // fresh row of its own, so it's forced back to full width.
  const reorderBoardItem = useCallback(
    (goalId: string, itemId: string, targetId: string, edge: "before" | "after" = "before", span: "full" | "half" = "full") => {
      if (itemId === targetId) return;
      setGoals((prev) =>
        mapGoal(prev, goalId, (goal) => {
          const order = goal.projects.map((p) => p.id);
          const otherIdx = Math.min(goal.otherTasksIndex ?? order.length, order.length);
          order.splice(otherIdx, 0, OTHER_TASKS_TILE_ID);

          const from = order.indexOf(itemId);
          if (from === -1) return goal;
          const rest = [...order];
          rest.splice(from, 1);
          const targetIdx = rest.indexOf(targetId);
          if (targetIdx === -1) return goal;
          rest.splice(edge === "before" ? targetIdx : targetIdx + 1, 0, itemId);

          const newOtherTasksIndex = rest.indexOf(OTHER_TASKS_TILE_ID);
          const projectById = new Map(goal.projects.map((p) => [p.id, p]));
          const projects = rest
            .filter((id) => id !== OTHER_TASKS_TILE_ID)
            .map((id) => (id === itemId ? { ...projectById.get(id)!, span } : projectById.get(id)!));
          const otherTasksSpan = itemId === OTHER_TASKS_TILE_ID ? span : goal.otherTasksSpan;
          return { ...goal, projects, otherTasksIndex: newOtherTasksIndex, otherTasksSpan };
        }),
      );
    },
    [],
  );

  const setProjectSpan = useCallback((goalId: string, projectId: string, span: "full" | "half") => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        projects: goal.projects.map((p) => (p.id === projectId ? { ...p, span } : p)),
      })),
    );
  }, []);

  const setOtherTasksView = useCallback((goalId: string, view: "list" | "kanban") => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, otherTasksView: view })));
  }, []);

  const setOtherTasksSpan = useCallback((goalId: string, span: "full" | "half") => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, otherTasksSpan: span })));
  }, []);

  const toggleOtherTasksCollapsed = useCallback((goalId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, otherTasksCollapsed: !goal.otherTasksCollapsed })));
  }, []);

  const createGoal = useCallback((input: CreateGoalInput) => {
    const projects: Project[] = input.plan.projects.map((p) => ({
      id: nextId("project"),
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
      projects,
      routines: input.plan.routines.map((r) => ({ id: nextId("routine"), label: r.label, cadence: r.cadence, streak: 0 })),
      otherTasks: [],
      contentQueue: [],
    };

    setGoals((prev) => [...prev, goal]);
    return goal;
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
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, completedAt: TODAY_ISO, outcome, finalScore })));
  }, []);

  const reopenGoal = useCallback((goalId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, completedAt: undefined, outcome: undefined, finalScore: undefined })));
  }, []);

  const updateContentItem = useCallback((goalId: string, itemId: string, patch: Partial<Pick<GoalContentItem, "title" | "meta">>) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        contentQueue: goal.contentQueue.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
      })),
    );
  }, []);

  const deleteContentItem = useCallback((goalId: string, itemId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, contentQueue: goal.contentQueue.filter((item) => item.id !== itemId) })));
  }, []);

  const updateTask = useCallback(
    (taskId: string, patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => patchTaskEverywhere(taskId, (t) => ({ ...t, ...patch })),
    [patchTaskEverywhere],
  );

  const deleteTask = useCallback((taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => ({
        ...goal,
        projects: goal.projects.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== taskId) })),
        otherTasks: goal.otherTasks.filter((t) => t.id !== taskId),
      })),
    );
    setStandaloneTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const addProject = useCallback((goalId: string, name: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, projects: [...goal.projects, { id: nextId("project"), name, tasks: [] }] })));
  }, []);

  const updateProject = useCallback((goalId: string, projectId: string, patch: Partial<Pick<Project, "name" | "note">>) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({ ...goal, projects: goal.projects.map((p) => (p.id === projectId ? { ...p, ...patch } : p)) })),
    );
  }, []);

  // Deleting a project keeps its tasks — they fall back to "Other tasks"
  // rather than disappearing with the container.
  const deleteProject = useCallback((goalId: string, projectId: string) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => {
        const project = goal.projects.find((p) => p.id === projectId);
        return {
          ...goal,
          projects: goal.projects.filter((p) => p.id !== projectId),
          otherTasks: [...goal.otherTasks, ...(project?.tasks ?? [])],
        };
      }),
    );
  }, []);

  const addRoutine = useCallback((goalId: string, label: string, cadence: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, routines: [...goal.routines, { id: nextId("routine"), label, cadence, streak: 0 }] })));
  }, []);

  const updateRoutine = useCallback((goalId: string, routineId: string, patch: Partial<Pick<Routine, "label" | "cadence">>) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({ ...goal, routines: goal.routines.map((r) => (r.id === routineId ? { ...r, ...patch } : r)) })),
    );
  }, []);

  const deleteRoutine = useCallback((goalId: string, routineId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, routines: goal.routines.filter((r) => r.id !== routineId) })));
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
      goals, standaloneTasks, getGoal, toggleTask, toggleRoutine, moveTask, createTask, assignTask, taskLocation,
      setProjectView, toggleProjectCollapsed, reorderBoardItem, setProjectSpan, createGoal,
      setOtherTasksView, setOtherTasksSpan, toggleOtherTasksCollapsed,
      updateGoal, deleteGoal, completeGoal, reopenGoal, updateTask, deleteTask,
      addProject, updateProject, deleteProject,
      addRoutine, updateRoutine, deleteRoutine,
      updateContentItem, deleteContentItem,
      addAttempt, updateAttempt, deleteAttempt, setSectionTarget,
    }),
    [
      goals, standaloneTasks, getGoal, toggleTask, toggleRoutine, moveTask, createTask, assignTask, taskLocation,
      setProjectView, toggleProjectCollapsed, reorderBoardItem, setProjectSpan, createGoal,
      setOtherTasksView, setOtherTasksSpan, toggleOtherTasksCollapsed,
      updateGoal, deleteGoal, completeGoal, reopenGoal, updateTask, deleteTask,
      addProject, updateProject, deleteProject,
      addRoutine, updateRoutine, deleteRoutine,
      updateContentItem, deleteContentItem,
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
