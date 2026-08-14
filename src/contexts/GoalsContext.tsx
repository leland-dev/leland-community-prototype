import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildTargetLabel,
  myGoals,
  TODAY_ISO,
  type Goal,
  type GoalContentItem,
  type Project,
  type ProjectsLayout,
  type Routine,
  type Task,
  type TaskStatus,
  type GoalType,
} from "../data/goals";
import type { Plan } from "../data/goalPlans";

// Goals are mutated from three places — the dashboard card, goal detail, and
// the new-goal flow — so they live in one shared store. Prototype-only:
// in-memory, resets on reload.
interface GoalsContextValue {
  goals: Goal[];
  getGoal: (id: string) => Goal | undefined;
  toggleTask: (goalId: string, taskId: string) => void;
  toggleRoutine: (goalId: string, routineId: string) => void;
  moveTask: (goalId: string, taskId: string, status: TaskStatus) => void;
  addTask: (goalId: string, projectId: string | null, title: string) => void;
  setProjectView: (goalId: string, projectId: string, view: "list" | "kanban") => void;
  toggleProjectCollapsed: (goalId: string, projectId: string) => void;
  reorderProject: (goalId: string, projectId: string, targetId: string) => void;
  setProjectsLayout: (goalId: string, layout: ProjectsLayout) => void;
  createGoal: (input: CreateGoalInput) => Goal;
  // Edits
  updateGoal: (goalId: string, patch: Partial<Pick<Goal, "name" | "targetDate" | "description" | "targetScore" | "baselineScore">>) => void;
  deleteGoal: (goalId: string) => void;
  completeGoal: (goalId: string, outcome?: string, finalScore?: number) => void;
  reopenGoal: (goalId: string) => void;
  updateContentItem: (goalId: string, itemId: string, patch: Partial<Pick<GoalContentItem, "title" | "meta">>) => void;
  deleteContentItem: (goalId: string, itemId: string) => void;
  updateTask: (goalId: string, taskId: string, patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => void;
  deleteTask: (goalId: string, taskId: string) => void;
  addProject: (goalId: string, name: string) => void;
  updateProject: (goalId: string, projectId: string, patch: Partial<Pick<Project, "name" | "note">>) => void;
  deleteProject: (goalId: string, projectId: string) => void;
  addRoutine: (goalId: string, label: string, cadence: string) => void;
  updateRoutine: (goalId: string, routineId: string, patch: Partial<Pick<Routine, "label" | "cadence">>) => void;
  deleteRoutine: (goalId: string, routineId: string) => void;
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

  const getGoal = useCallback((id: string) => goals.find((g) => g.id === id), [goals]);

  const toggleTask = useCallback((goalId: string, taskId: string) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => mapTasks(goal, (t) => (t.id === taskId ? flipTask(t) : t))));
  }, []);

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

  const moveTask = useCallback((goalId: string, taskId: string, status: TaskStatus) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) =>
        mapTasks(goal, (t) => {
          if (t.id !== taskId || t.status === status) return t;
          return { ...t, status, previousStatus: status === "done" ? t.status : undefined };
        }),
      ),
    );
  }, []);

  const addTask = useCallback((goalId: string, projectId: string | null, title: string) => {
    const task: Task = { id: nextId("task"), title, status: "todo" };
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) =>
        projectId === null
          ? { ...goal, otherTasks: [...goal.otherTasks, task] }
          : { ...goal, projects: goal.projects.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)) },
      ),
    );
  }, []);

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

  // Drag-to-reorder: dropping project A onto project B swaps their positions
  // in the list — simple and predictable, versus inserting-before/after which
  // gets confusing once cards are different sizes (collapsed vs. not).
  const reorderProject = useCallback((goalId: string, projectId: string, targetId: string) => {
    if (projectId === targetId) return;
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => {
        const from = goal.projects.findIndex((p) => p.id === projectId);
        const to = goal.projects.findIndex((p) => p.id === targetId);
        if (from === -1 || to === -1) return goal;
        const projects = [...goal.projects];
        const [moved] = projects.splice(from, 1);
        projects.splice(to, 0, moved);
        return { ...goal, projects };
      }),
    );
  }, []);

  const setProjectsLayout = useCallback((goalId: string, projectsLayout: ProjectsLayout) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => ({ ...goal, projectsLayout })));
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

  const updateGoal = useCallback((goalId: string, patch: Partial<Pick<Goal, "name" | "targetDate" | "description" | "targetScore" | "baselineScore">>) => {
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

  const updateTask = useCallback((goalId: string, taskId: string, patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => {
    setGoals((prev) => mapGoal(prev, goalId, (goal) => mapTasks(goal, (t) => (t.id === taskId ? { ...t, ...patch } : t))));
  }, []);

  const deleteTask = useCallback((goalId: string, taskId: string) => {
    setGoals((prev) =>
      mapGoal(prev, goalId, (goal) => ({
        ...goal,
        projects: goal.projects.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== taskId) })),
        otherTasks: goal.otherTasks.filter((t) => t.id !== taskId),
      })),
    );
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

  const value = useMemo(
    () => ({
      goals, getGoal, toggleTask, toggleRoutine, moveTask, addTask,
      setProjectView, toggleProjectCollapsed, reorderProject, setProjectsLayout, createGoal,
      updateGoal, deleteGoal, completeGoal, reopenGoal, updateTask, deleteTask,
      addProject, updateProject, deleteProject,
      addRoutine, updateRoutine, deleteRoutine,
      updateContentItem, deleteContentItem,
    }),
    [
      goals, getGoal, toggleTask, toggleRoutine, moveTask, addTask,
      setProjectView, toggleProjectCollapsed, reorderProject, setProjectsLayout, createGoal,
      updateGoal, deleteGoal, completeGoal, reopenGoal, updateTask, deleteTask,
      addProject, updateProject, deleteProject,
      addRoutine, updateRoutine, deleteRoutine,
      updateContentItem, deleteContentItem,
    ],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within a GoalsProvider");
  return ctx;
}
