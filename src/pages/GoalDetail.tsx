import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useSetNavTheme } from "../components/NavThemeContext";
import { Button } from "../components/Button";
import GoalCheck from "../components/GoalCheck";
import GoalFlame from "../components/GoalFlame";
import EditableText from "../components/EditableText";
import RowDelete from "../components/RowDelete";
import { useGoals } from "../contexts/GoalsContext";
import { dueLabel, goalProgress, goalStatus, isCheckedToday, isOverdue, type Goal, type Project, type Task, type TaskStatus } from "../data/goals";
import addPlusIcon from "../assets/icons/add-plus.svg";

const HERO_BG = "#F3F1E6";

const CARD = "rounded-2xl bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "in-progress", label: "In progress" },
  { status: "done", label: "Done" },
];

// Meta line under a task title — due state, or nothing if the task has no date.
function taskMeta(task: Task): { text: string; overdue: boolean } | null {
  if (task.status === "done") return { text: "Completed", overdue: false };
  if (!task.dueDate) return null;
  return { text: dueLabel(task.dueDate), overdue: isOverdue(task) };
}

function ViaTag({ assignedBy }: { assignedBy: NonNullable<Task["assignedBy"]> }) {
  return (
    <span className="inline-flex items-center gap-[5px] rounded-full bg-[#F3F1E6] py-[2px] pl-[3px] pr-2 text-[12px] text-gray-light">
      <img src={assignedBy.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
      via {assignedBy.name}
    </span>
  );
}

function TaskRow({
  task,
  onToggle,
  onRename,
  onSetDue,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onRename: (title: string) => void;
  onSetDue: (dueDate: string | undefined) => void;
  onDelete: () => void;
}) {
  const meta = taskMeta(task);
  const done = task.status === "done";
  const [editingDue, setEditingDue] = useState(false);

  return (
    <div className="group flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5]">
      <div className="mt-[1px]">
        <GoalCheck checked={done} onChange={onToggle} label={task.title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-2.5">
          <EditableText
            value={task.title}
            onCommit={onRename}
            label="task name"
            className={done ? "text-[15px] text-gray-extra-light line-through" : "text-[15px] font-medium leading-[1.3] text-gray-dark"}
          />
          {task.assignedBy && <ViaTag assignedBy={task.assignedBy} />}
        </div>
        {editingDue ? (
          <input
            type="date"
            autoFocus
            value={task.dueDate ?? ""}
            aria-label="Due date"
            onChange={(e) => onSetDue(e.target.value || undefined)}
            onBlur={() => setEditingDue(false)}
            className="w-[150px] rounded border-[1.5px] border-gray-dark bg-white px-1 text-[13px] text-gray-dark outline-none"
          />
        ) : (
          <button
            onClick={() => setEditingDue(true)}
            aria-label="Edit due date"
            className={`-mx-1 self-start rounded px-1 text-left text-[13px] transition-colors hover:bg-[#222222]/[0.06] ${
              meta?.overdue ? "text-[#9F5B34]" : "text-gray-extra-light"
            }`}
          >
            {meta?.text ?? <span className="opacity-0 group-hover:opacity-100">Add a date</span>}
          </button>
        )}
      </div>
      <RowDelete onDelete={onDelete} label={task.title} />
    </div>
  );
}

function KanbanCard({
  task,
  onToggle,
  onRename,
  onDelete,
  onDragStart,
}: {
  task: Task;
  onToggle: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onDragStart: () => void;
}) {
  const meta = taskMeta(task);
  const done = task.status === "done";
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group flex cursor-grab items-start gap-2.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 transition-colors hover:bg-[#FCFCFA] active:cursor-grabbing"
    >
      <div className="mt-[1px]">
        <GoalCheck checked={done} onChange={onToggle} size={18} shape="squareSm" label={task.title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <EditableText
          value={task.title}
          onCommit={onRename}
          label="task name"
          className={done ? "text-[14px] leading-[1.3] text-gray-extra-light line-through" : "text-[14px] font-medium leading-[1.3] text-gray-dark"}
        />
        {meta && <span className={`text-[12px] ${meta.overdue ? "text-[#9F5B34]" : "text-gray-extra-light"}`}>{meta.text}</span>}
        {task.assignedBy && (
          <span className="self-start">
            <ViaTag assignedBy={task.assignedBy} />
          </span>
        )}
      </div>
      <RowDelete onDelete={onDelete} label={task.title} />
    </div>
  );
}

// Inline add affordance — collapses to a ghost button when idle. Used for
// tasks, routines, and projects.
function AddTask({
  onAdd,
  variant = "block",
  label = "Add task",
  placeholder = "What needs doing?",
}: {
  onAdd: (title: string) => void;
  variant?: "block" | "column";
  label?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    onAdd(title);
    setDraft("");
    setOpen(false);
  };

  if (!open) {
    return variant === "column" ? (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 self-start rounded-lg px-2.5 py-2 text-[14px] font-medium text-gray-light transition-colors hover:bg-[#222222]/[0.06] hover:text-gray-dark"
      >
        <img src={addPlusIcon} alt="" className="h-[17px] w-[17px]" />
        {label}
      </button>
    ) : (
      <Button onClick={() => setOpen(true)} size="md" variant="secondary" className="mt-3 font-medium">
        <img src={addPlusIcon} alt="" className="h-[18px] w-[18px]" />
        {label}
      </Button>
    );
  }

  return (
    <div className={`flex gap-2 ${variant === "column" ? "flex-col" : "mt-3"}`}>
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark"
      />
      <Button onClick={submit} size="md" variant="primary" className="font-medium">
        Add
      </Button>
    </div>
  );
}

function ProjectBoard({ goal, project }: { goal: Goal; project: Project }) {
  const { toggleTask, moveTask, addTask, setProjectView, updateTask, deleteTask, updateProject, deleteProject } = useGoals();
  const [dragId, setDragId] = useState<string | null>(null);
  const view = project.view ?? "list";
  const done = project.tasks.filter((t) => t.status === "done").length;

  const taskHandlers = (task: Task) => ({
    onToggle: () => toggleTask(goal.id, task.id),
    onRename: (title: string) => updateTask(goal.id, task.id, { title }),
    onDelete: () => deleteTask(goal.id, task.id),
  });

  return (
    <section className={`${CARD} group/project`}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="min-w-0 text-[19px] font-semibold leading-[1.2] text-gray-dark">
          <EditableText value={project.name} onCommit={(name) => updateProject(goal.id, project.id, { name })} label="project name" />
        </h2>
        <div className="flex shrink-0 items-center gap-3">
          <span className="opacity-0 transition-opacity group-hover/project:opacity-100">
            <RowDelete onDelete={() => deleteProject(goal.id, project.id)} label={project.name} />
          </span>
          <span className="whitespace-nowrap text-[13px] text-gray-extra-light">
            {done} of {project.tasks.length} done
          </span>
          <div className="flex items-center gap-1 rounded-full bg-gray-hover p-1">
            {(["list", "kanban"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setProjectView(goal.id, project.id, v)}
                className={`rounded-full px-2.5 py-1 text-[12px] font-medium capitalize transition-colors ${
                  view === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mb-3 text-[14px] text-[#707070]">
        <EditableText
          value={project.note ?? ""}
          onCommit={(note) => updateProject(goal.id, project.id, { note })}
          label="project description"
          placeholder="Add a description"
          allowEmpty
        />
      </p>

      {view === "list" ? (
        <>
          <div className="-mx-2 flex flex-col gap-[2px]">
            {project.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                {...taskHandlers(task)}
                onSetDue={(dueDate) => updateTask(goal.id, task.id, { dueDate })}
              />
            ))}
          </div>
          <AddTask onAdd={(title) => addTask(goal.id, project.id, title)} />
        </>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {KANBAN_COLUMNS.map(({ status, label }) => {
            const tasks = project.tasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) moveTask(goal.id, dragId, status);
                  setDragId(null);
                }}
                className="flex min-h-[120px] flex-col gap-2 rounded-xl bg-[#F5F5F5] p-3"
              >
                <div className="flex items-center gap-1.5 px-[2px]">
                  <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">{label}</span>
                  <span className="text-[12px] text-[#949494]">{tasks.length}</span>
                </div>
                {tasks.map((task) => (
                  <KanbanCard key={task.id} task={task} {...taskHandlers(task)} onDragStart={() => setDragId(task.id)} />
                ))}
                {tasks.length === 0 && <div className="px-[2px] pb-2 pt-1 text-[13px] text-[#949494]">Nothing here.</div>}
                {status === "todo" && <AddTask variant="column" onAdd={(title) => addTask(goal.id, project.id, title)} />}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function GoalDetail() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const {
    getGoal, toggleTask, toggleRoutine, addTask, updateTask, deleteTask,
    updateGoal, deleteGoal, addProject, addRoutine, updateRoutine, deleteRoutine,
  } = useGoals();
  const { dark: darkMode } = useDarkMode();
  const heroBg = darkMode ? "#5E6E79" : HERO_BG;
  const navTheme = useMemo(() => ({ bg: "#FCFCFA", light: false, hideWordmark: false, scrollReveal: true }), []);
  useSetNavTheme(navTheme);
  const [editingTarget, setEditingTarget] = useState(false);

  const goal = goalId ? getGoal(goalId) : undefined;

  useEffect(() => {
    document.title = goal ? goal.name : "Goal";
  }, [goal]);

  if (!goal) {
    return (
      <PageShell variant="standard">
        <div className="flex flex-col items-start gap-4 py-16">
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] text-gray-dark">That goal isn't here</h1>
          <p className="text-[15px] text-gray-light">It may have been removed, or the link is out of date.</p>
          <Button onClick={() => navigate("/dashboard")} size="md" variant="secondary" className="font-medium">
            Back to dashboard
          </Button>
        </div>
      </PageShell>
    );
  }

  const status = goalStatus(goal);
  const { done, total, pct } = goalProgress(goal);

  const confirmDeleteGoal = () => {
    if (!window.confirm(`Delete "${goal.name}"? Its projects, tasks, and routines go with it.`)) return;
    deleteGoal(goal.id);
    navigate("/dashboard");
  };

  return (
    <PageShell variant="standard" contentMaxWidth={860}>
      <motion.div
        className="flex flex-col gap-5 pb-24"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-gray-extra-light transition-opacity hover:opacity-70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          My goals
        </Link>

        {/* Header — cream block with status, name, target, progress */}
        <div className="rounded-2xl px-7 pb-6 pt-7" style={{ backgroundColor: heroBg }}>
          <div className="mb-2.5 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${status === "needs-action" ? "bg-[#9F5B34]" : "bg-[#869AA6]"}`} />
            <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-light">
              {status === "needs-action" ? "Needs action" : "On track"}
            </span>
          </div>
          <h1 className="font-serif text-[34px] font-medium leading-[1.1] text-gray-dark">
            <EditableText value={goal.name} onCommit={(name) => updateGoal(goal.id, { name })} label="goal name" />
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[15px] text-gray-light">
            {editingTarget ? (
              <input
                type="date"
                autoFocus
                value={goal.targetDate ?? ""}
                aria-label="Target date"
                onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value || undefined })}
                onBlur={() => setEditingTarget(false)}
                className="rounded border-[1.5px] border-gray-dark bg-white px-1.5 py-0.5 text-[15px] text-gray-dark outline-none"
              />
            ) : (
              <button
                onClick={() => setEditingTarget(true)}
                aria-label="Edit target date"
                className="-mx-1 rounded px-1 transition-colors hover:bg-[#222222]/[0.06]"
              >
                {goal.targetLabel}
              </button>
            )}
            <span>· {goal.projects.length} project{goal.projects.length === 1 ? "" : "s"}</span>
          </p>
          <p className="mt-2 max-w-[560px] text-[14px] leading-[1.5] text-gray-light">
            <EditableText
              value={goal.description ?? ""}
              onCommit={(description) => updateGoal(goal.id, { description })}
              label="goal description"
              placeholder="Add more about this goal"
              allowEmpty
            />
          </p>
          <div className="mt-5 flex max-w-[420px] items-center gap-3.5">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#222222]/15">
              <div className="h-full rounded-full bg-gray-dark transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="whitespace-nowrap text-[13px] text-gray-light">
              {done} of {total} tasks
            </span>
          </div>
        </div>

        {/* Routines — their own section above the boards */}
        <section className={CARD}>
          <h2 className="mb-1 text-[19px] font-semibold leading-[1.2] text-gray-dark">Routines</h2>
          <p className="mb-3 text-[14px] text-[#707070]">Repeating work — check it off each time it comes due.</p>
          <div className="flex flex-col gap-2">
            {goal.routines.map((routine) => (
              <div key={routine.id} className="group flex items-center gap-3 rounded-xl bg-[#F5F5F5] px-4 py-3.5">
                <GoalCheck
                  checked={isCheckedToday(routine)}
                  onChange={() => toggleRoutine(goal.id, routine.id)}
                  shape="circle"
                  size={22}
                  label={routine.label}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <EditableText
                    value={routine.label}
                    onCommit={(label) => updateRoutine(goal.id, routine.id, { label })}
                    label="routine name"
                    className="text-[15px] font-medium leading-[1.3] text-gray-dark"
                  />
                  <EditableText
                    value={routine.cadence}
                    onCommit={(cadence) => updateRoutine(goal.id, routine.id, { cadence })}
                    label="cadence"
                    placeholder="How often?"
                    className="text-[13px] text-gray-extra-light"
                  />
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-gray-dark">
                  <GoalFlame width={14} height={17} />
                  <span className="font-serif text-[28px] font-medium leading-none">{routine.streak}</span>
                  <span className="text-[13px] text-gray-extra-light">days</span>
                </div>
                <RowDelete onDelete={() => deleteRoutine(goal.id, routine.id)} label={routine.label} />
              </div>
            ))}
            {goal.routines.length === 0 && <p className="text-[14px] text-[#949494]">No routines yet.</p>}
          </div>
          <AddTask label="Add routine" placeholder="What do you want to repeat?" onAdd={(label) => addRoutine(goal.id, label, "Daily")} />
        </section>

        {/* Projects — one board each, list or kanban */}
        {goal.projects.map((project) => (
          <ProjectBoard key={project.id} goal={goal} project={project} />
        ))}

        {/* Standalone tasks */}
        <section className={CARD}>
          <h2 className="mb-1 text-[19px] font-semibold leading-[1.2] text-gray-dark">Other tasks</h2>
          <p className="mb-3 text-[14px] text-[#707070]">Not part of a project.</p>
          <div className="-mx-2 flex flex-col gap-[2px]">
            {goal.otherTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => toggleTask(goal.id, task.id)}
                onRename={(title) => updateTask(goal.id, task.id, { title })}
                onSetDue={(dueDate) => updateTask(goal.id, task.id, { dueDate })}
                onDelete={() => deleteTask(goal.id, task.id)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AddTask onAdd={(title) => addTask(goal.id, null, title)} />
            <AddTask label="Add project" placeholder="What's the project called?" onAdd={(name) => addProject(goal.id, name)} />
          </div>
        </section>

        {/* Content queue — pinned at the bottom */}
        {goal.contentQueue.length > 0 && (
          <section className={CARD}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <h2 className="text-[19px] font-semibold leading-[1.2] text-gray-dark">Worth your time</h2>
              <Link to="/courses" className="shrink-0 text-[14px] font-medium text-gray-extra-light transition-opacity hover:opacity-70">
                See all
              </Link>
            </div>
            <p className="mb-4 text-[14px] text-[#707070]">Picked for your {goal.categories[0]} goal.</p>
            <div className="-mx-2 flex flex-col gap-1">
              {goal.contentQueue.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5]">
                  <img src={item.image} alt="" className="h-11 w-20 shrink-0 rounded object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <div className="truncate text-[15px] font-semibold leading-[1.2] text-gray-dark">{item.title}</div>
                    <div className="truncate text-[13px] text-gray-extra-light">{item.meta}</div>
                  </div>
                  <Button size="md" variant="secondary" className="shrink-0 font-medium">
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={confirmDeleteGoal}
          className="self-start px-1 text-[14px] font-medium text-gray-extra-light underline decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-[#9F5B34]"
        >
          Delete this goal
        </button>
      </motion.div>
    </PageShell>
  );
}
