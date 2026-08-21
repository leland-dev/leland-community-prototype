import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import PageShell from "../../components/PageShell";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useSetNavTheme } from "../../components/NavThemeContext";
import { Button } from "../../components/Button";
import GoalCheck from "../../components/GoalCheck";
import GoalFlame from "../components/GoalFlame";
import GoalDonut from "../../components/GoalDonut";
import Confetti from "../../components/Confetti";
import EditableText from "../../components/EditableText";
import RowDelete from "../../components/RowDelete";
import QuickAddTask from "../components/QuickAddTask";
import TestOutcomes from "../components/TestOutcomes";
import TaskDetailModal from "../components/TaskDetailModal";
import ConfirmModal from "../../components/ConfirmModal";
import GoalTasksIntro from "../../components/GoalTasksIntro";
import { useGoals, OTHER_TASKS_TILE_ID } from "../contexts/GoalsContext";
import { dueLabel, goalProgress, goalStatus, isCheckedToday, isOverdue, type Goal, type Task, type TaskStatus } from "../data/goals";
import { scoreRangeFor } from "../../data/goalPlans";
import addPlusIcon from "../../assets/icons/add-plus.svg";
import dragDotsIcon from "../../assets/icons/drag-dots.svg";

const HERO_BG = "#F3F1E6";

const CARD = "rounded-2xl bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

// Custom drag type so a project drag can't be mistaken for anything else
// dropped onto the board.
const PROJECT_DRAG_TYPE = "application/x-leland-project";

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

// Clicking anywhere on a task's row/card opens its detail modal — the
// checkbox and delete button stop the click from bubbling so they keep their
// own single-purpose behavior instead of also opening the modal.
function TaskRow({
  task,
  onToggle,
  onOpenDetail,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onOpenDetail: () => void;
  onDelete: () => void;
}) {
  const meta = taskMeta(task);
  const done = task.status === "done";

  return (
    <div
      onClick={onOpenDetail}
      className="group flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5]"
    >
      <div className="mt-[1px]" onClick={(e) => e.stopPropagation()}>
        <GoalCheck checked={done} onChange={onToggle} label={task.title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={done ? "text-[15px] text-gray-extra-light line-through" : "text-[15px] font-medium leading-[1.3] text-gray-dark"}>
            {task.title}
          </span>
          {task.assignedBy && <ViaTag assignedBy={task.assignedBy} />}
        </div>
        {meta && <span className={`text-[13px] ${meta.overdue ? "font-medium text-[#9F5B34]" : "text-gray-extra-light"}`}>{meta.text}</span>}
        {task.note && <p className="text-[13px] leading-[1.4] text-gray-light">{task.note}</p>}
      </div>
      <span onClick={(e) => e.stopPropagation()}>
        <RowDelete onDelete={onDelete} label={task.title} />
      </span>
    </div>
  );
}

function KanbanCard({
  task,
  onToggle,
  onOpenDetail,
  onDelete,
  onDragStart,
}: {
  task: Task;
  onToggle: () => void;
  onOpenDetail: () => void;
  onDelete: () => void;
  onDragStart: () => void;
}) {
  const meta = taskMeta(task);
  const done = task.status === "done";
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpenDetail}
      className="group flex cursor-grab items-start gap-2.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 transition-colors hover:bg-[#FCFCFA] active:cursor-grabbing"
    >
      <div className="mt-[1px]" onClick={(e) => e.stopPropagation()}>
        <GoalCheck checked={done} onChange={onToggle} size={18} shape="squareSm" label={task.title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className={done ? "text-[14px] leading-[1.3] text-gray-extra-light line-through" : "text-[14px] font-medium leading-[1.3] text-gray-dark"}>
          {task.title}
        </span>
        {meta && <span className={`text-[12px] ${meta.overdue ? "text-[#9F5B34]" : "text-gray-extra-light"}`}>{meta.text}</span>}
        {task.assignedBy && (
          <span className="self-start">
            <ViaTag assignedBy={task.assignedBy} />
          </span>
        )}
      </div>
      <span onClick={(e) => e.stopPropagation()}>
        <RowDelete onDelete={onDelete} label={task.title} />
      </span>
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
  withCadence = false,
  className = "mt-3 font-medium",
}: {
  onAdd: (title: string, cadence?: string) => void;
  variant?: "block" | "column";
  label?: string;
  placeholder?: string;
  // Routines repeat on a schedule, so their add form asks for it up front
  // instead of defaulting silently to "Daily" — same free-text field as the
  // one on an existing routine row.
  withCadence?: boolean;
  // Override the collapsed "block" button's classes — the default assumes
  // it's stacked below other content; pass something without a top margin
  // when it sits inline next to another control.
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [cadenceDraft, setCadenceDraft] = useState("");

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    onAdd(title, withCadence ? cadenceDraft.trim() || "Daily" : undefined);
    setDraft("");
    setCadenceDraft("");
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
      <Button onClick={() => setOpen(true)} size="md" variant="secondary" className={className}>
        <img src={addPlusIcon} alt="" className="h-[18px] w-[18px]" />
        {label}
      </Button>
    );
  }

  return (
    <div className={`flex gap-2 ${variant === "column" ? "flex-col" : "mt-3 flex-wrap"}`}>
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !withCadence) submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark"
      />
      {withCadence && (
        <input
          value={cadenceDraft}
          onChange={(e) => setCadenceDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="How often? (e.g. Daily, Weekdays)"
          aria-label="Cadence"
          className={`rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark ${
            variant === "column" ? "" : "w-[220px] shrink-0"
          }`}
        />
      )}
      <Button onClick={submit} size="md" variant="primary" className="font-medium">
        Add
      </Button>
    </div>
  );
}

type DropZone = "left" | "right" | "top" | "bottom";

// Which edge of the target box the cursor is nearest — left/right propose
// sitting beside it (half width); top/bottom propose a fresh row above or
// below it (full width).
function computeDropZone(clientX: number, clientY: number, rect: DOMRect): DropZone {
  const distances: [DropZone, number][] = [
    ["left", clientX - rect.left],
    ["right", rect.right - clientX],
    ["top", clientY - rect.top],
    ["bottom", rect.bottom - clientY],
  ];
  return distances.reduce((a, b) => (b[1] < a[1] ? b : a))[0];
}

// A card in the goal's modular board. Real projects and the synthetic "Other
// tasks" tile are rendered by the same component so they share view/width/
// reorder behavior — the difference is just which callbacks the caller wires
// up (Other tasks has no onRename/onSetNote/onDelete, since it isn't a real,
// renameable, deletable project).
type BoardTile = {
  id: string;
  name: string;
  note?: string;
  tasks: Task[];
  view?: "list" | "kanban";
  span?: "full" | "half";
  collapsed?: boolean;
};

function ProjectBoard({
  tile,
  dragging,
  onDragStart,
  onDragEnd,
  onDropOn,
  onOpenTaskDetail,
  onDeleteTask,
  onSetView,
  onSetSpan,
  onToggleCollapsed,
  onRename,
  onSetNote,
  onDelete,
  onAddTask,
}: {
  tile: BoardTile;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropOn: (edge: "before" | "after", draggedId: string, span: "full" | "half") => void;
  onOpenTaskDetail: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onSetView: (view: "list" | "kanban") => void;
  onSetSpan: (span: "full" | "half") => void;
  onToggleCollapsed: () => void;
  onRename?: (name: string) => void;
  onSetNote?: (note: string) => void;
  onDelete?: () => void;
  onAddTask: (title: string) => void;
}) {
  const { toggleTask, moveTask } = useGoals();
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropZone, setDropZone] = useState<DropZone | null>(null);
  const view = tile.view ?? "list";
  const done = tile.tasks.filter((t) => t.status === "done").length;
  const collapsed = !!tile.collapsed;
  const span = tile.span ?? "full";

  const taskHandlers = (task: Task) => ({
    onToggle: () => toggleTask(task.id),
    onOpenDetail: () => onOpenTaskDetail(task),
    onDelete: () => onDeleteTask(task),
  });

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        // Notion-style: the indicator shows which edge you'll land on. Left/
        // right propose sitting beside this tile (half width); top/bottom
        // propose a fresh row above or below it (full width).
        const rect = e.currentTarget.getBoundingClientRect();
        setDropZone(computeDropZone(e.clientX, e.clientY, rect));
      }}
      onDragLeave={() => setDropZone(null)}
      onDrop={(e) => {
        e.preventDefault();
        setDropZone(null);
        // Read both the zone and the dragged id straight off the event. Relying
        // on React state for either is racy — a quick drag can drop before a
        // dragover/dragstart setState has landed.
        const draggedId = e.dataTransfer.getData(PROJECT_DRAG_TYPE);
        if (!draggedId) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const zone = computeDropZone(e.clientX, e.clientY, rect);
        const edge = zone === "left" || zone === "top" ? "before" : "after";
        const droppedSpan = zone === "left" || zone === "right" ? "half" : "full";
        onDropOn(edge, draggedId, droppedSpan);
      }}
      className={`${CARD} group/project relative transition-opacity ${dragging ? "opacity-40" : ""} ${
        span === "half" ? "lg:col-span-1" : "lg:col-span-2"
      }`}
    >
      {/* Insertion indicator, Notion-style — a bar on the edge you'd drop into */}
      {dropZone && (
        <span
          aria-hidden
          className={`absolute rounded-full bg-gray-dark ${
            dropZone === "left"
              ? "inset-y-3 -left-[10px] w-[3px]"
              : dropZone === "right"
                ? "inset-y-3 -right-[10px] w-[3px]"
                : dropZone === "top"
                  ? "inset-x-3 -top-[10px] h-[3px]"
                  : "inset-x-3 -bottom-[10px] h-[3px]"
          }`}
        />
      )}
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(PROJECT_DRAG_TYPE, tile.id);
              e.dataTransfer.effectAllowed = "move";
              onDragStart();
            }}
            onDragEnd={onDragEnd}
            aria-label={`Reorder ${tile.name}`}
            className="flex shrink-0 cursor-grab items-center self-start pt-[3px] text-[#949494] opacity-0 transition-[opacity,color] hover:text-gray-dark active:cursor-grabbing group-hover/project:opacity-100"
          >
            <img src={dragDotsIcon} alt="" className="h-4 w-4" />
          </span>
          <h2 className="min-w-0 text-[19px] font-semibold leading-[1.2] text-gray-dark">
            {onRename ? <EditableText value={tile.name} onCommit={onRename} label="project name" /> : tile.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {onDelete && (
            <span className="opacity-0 transition-opacity group-hover/project:opacity-100">
              <RowDelete onDelete={onDelete} label={tile.name} />
            </span>
          )}
          <span className="whitespace-nowrap text-[13px] text-gray-extra-light">
            {done} of {tile.tasks.length} done
          </span>
          {!collapsed && (
            <>
              <div className="flex items-center gap-1 rounded-full bg-gray-hover p-1">
                {(["list", "kanban"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => onSetView(v)}
                    className={`rounded-full px-2.5 py-1 text-[12px] font-medium capitalize transition-colors ${
                      view === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {/* Width, per tile — this is what makes the board modular */}
              <button
                onClick={() => onSetSpan(span === "full" ? "half" : "full")}
                aria-label={span === "full" ? `Make ${tile.name} half width` : `Make ${tile.name} full width`}
                title={span === "full" ? "Half width" : "Full width"}
                className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-extra-light transition-colors hover:bg-[#222222]/[0.06] hover:text-gray-dark lg:flex"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {span === "full" ? <path d="M4 6h16v12H4zM12 6v12" /> : <path d="M4 6h16v12H4z" />}
                </svg>
              </button>
            </>
          )}
          {/* Collapse chevron sits last, right-aligned */}
          <button
            onClick={onToggleCollapsed}
            aria-label={collapsed ? `Expand ${tile.name}` : `Collapse ${tile.name}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-extra-light transition-colors hover:bg-[#222222]/[0.06] hover:text-gray-dark"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform ${collapsed ? "-rotate-90" : ""}`}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
      {collapsed && tile.note && <p className="pl-6 text-[14px] text-[#707070]">{tile.note}</p>}
      {!collapsed && (
      <>
      <p className="mb-3 pl-6 text-[14px] text-[#707070]">
        {onSetNote ? (
          <EditableText value={tile.note ?? ""} onCommit={onSetNote} label="project description" placeholder="Add a description" allowEmpty />
        ) : (
          tile.note
        )}
      </p>

      {view === "list" ? (
        <>
          <div className="-mx-2 flex flex-col gap-[2px]">
            {tile.tasks.map((task) => (
              <TaskRow key={task.id} task={task} {...taskHandlers(task)} />
            ))}
          </div>
          <AddTask onAdd={onAddTask} />
        </>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {KANBAN_COLUMNS.map(({ status, label }) => {
            const tasks = tile.tasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (dragId) moveTask(dragId, status);
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
                {status === "todo" && <AddTask variant="column" onAdd={onAddTask} />}
              </div>
            );
          })}
        </div>
      )}
      </>
      )}
    </section>
  );
}

export default function GoalDetail() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const {
    goals, getGoal, toggleTask, toggleRoutine, createTask, updateTask, deleteTask, assignTask,
    updateGoal, deleteGoal, completeGoal, reopenGoal, addProject, addRoutine, updateRoutine, deleteRoutine,
    reorderBoardItem, setProjectView, setProjectSpan, toggleProjectCollapsed, updateProject, deleteProject,
    setOtherTasksView, setOtherTasksSpan, toggleOtherTasksCollapsed,
    updateContentItem, deleteContentItem,
  } = useGoals();
  const { dark: darkMode } = useDarkMode();
  const heroBg = darkMode ? "#5E6E79" : HERO_BG;
  const navTheme = useMemo(() => ({ bg: "#FCFCFA", light: false, hideWordmark: false, scrollReveal: true }), []);
  useSetNavTheme(navTheme);
  const [editingTarget, setEditingTarget] = useState(false);
  const [editingScore, setEditingScore] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [outcomeDraft, setOutcomeDraft] = useState("");
  const [finalScoreStr, setFinalScoreStr] = useState("");
  const [dragBoardId, setDragBoardId] = useState<string | null>(null);
  // Store just the id and look the task up fresh below — holding onto the
  // task object itself would freeze the modal on a stale snapshot the moment
  // an edit updates the underlying goal data.
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<Task | null>(null);
  // The intro shows only while the goal has no projects yet — once one
  // exists (drafted at creation, or added here), it's gone for good.
  // "Continue" just unlocks the empty add-project view for this visit.
  const [boardUnlocked, setBoardUnlocked] = useState(false);

  // Expert-assigned tasks get a confirmation step before they disappear —
  // everything else deletes right away, same as the modal's own delete flow.
  const requestDeleteTask = (task: Task) => {
    if (task.assignedBy) {
      setConfirmDeleteTarget(task);
      return;
    }
    deleteTask(task.id);
  };

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
  const showBoard = boardUnlocked || goal.projects.length > 0;

  // Re-derived from the live goal on every render — see the note on
  // selectedTaskId above.
  const selectedTask = (() => {
    if (!selectedTaskId) return null;
    for (const p of goal.projects) {
      const task = p.tasks.find((t) => t.id === selectedTaskId);
      if (task) return { task, projectName: p.name };
    }
    const task = goal.otherTasks.find((t) => t.id === selectedTaskId);
    return task ? { task, projectName: null } : null;
  })();

  // "Other tasks" sits in the same reorderable, resizable board as projects —
  // spliced into the project list at its stored position, defaulting to last.
  const boardTiles: BoardTile[] = (() => {
    const otherTile: BoardTile = {
      id: OTHER_TASKS_TILE_ID,
      name: "Other tasks",
      note: "Not part of a project.",
      tasks: goal.otherTasks,
      view: goal.otherTasksView,
      span: goal.otherTasksSpan,
      collapsed: goal.otherTasksCollapsed,
    };
    const tiles: BoardTile[] = goal.projects.map((p) => ({
      id: p.id, name: p.name, note: p.note, tasks: p.tasks, view: p.view, span: p.span, collapsed: p.collapsed,
    }));
    const idx = Math.min(goal.otherTasksIndex ?? tiles.length, tiles.length);
    tiles.splice(idx, 0, otherTile);
    return tiles;
  })();

  const confirmDeleteGoal = () => {
    if (!window.confirm(`Delete "${goal.name}"? Its projects, tasks, and routines go with it.`)) return;
    deleteGoal(goal.id);
    navigate("/dashboard");
  };

  const scoreRange = goal.type === "test" ? scoreRangeFor(goal.categories[0]) : null;
  const finalScoreNum = finalScoreStr.trim() ? Number(finalScoreStr) : undefined;
  const finalScoreError =
    scoreRange && finalScoreNum !== undefined && (finalScoreNum < scoreRange.min || finalScoreNum > scoreRange.max)
      ? `${goal.categories[0]} scores run ${scoreRange.min}–${scoreRange.max}.`
      : null;

  // Checking the box completes the goal immediately and celebrates — the
  // score/outcome fields come after, so filling in detail never gates the
  // moment. Unchecking reopens.
  const toggleComplete = () => {
    if (status === "completed") {
      reopenGoal(goal.id);
      return;
    }
    setOutcomeDraft(goal.outcome ?? "");
    setFinalScoreStr(goal.finalScore !== undefined ? String(goal.finalScore) : "");
    completeGoal(goal.id);
    setShowConfetti(true);
  };

  const saveOutcomeDetail = () => {
    updateGoal(goal.id, {
      outcome: outcomeDraft.trim() || undefined,
      ...(finalScoreError ? {} : { finalScore: finalScoreNum }),
    });
  };

  return (
    <PageShell variant="standard" contentMaxWidth={860}>
      <motion.div
        className="flex flex-col gap-5 pb-24"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/goals" className="inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-gray-extra-light transition-opacity hover:opacity-70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          My goals
        </Link>

        {/* Header — cream block with status, name, target, progress */}
        <div className="rounded-2xl px-7 pb-6 pt-7" style={{ backgroundColor: heroBg }}>
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "completed" ? "bg-gray-dark" : status === "needs-action" ? "bg-[#9F5B34]" : "bg-[#869AA6]"
                }`}
              />
              <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-light">
                {status === "completed" ? "Completed" : status === "needs-action" ? "Needs action" : "On track"}
              </span>
            </div>
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
            {scoreRange && status !== "completed" && (
              <>
                <span>·</span>
                {editingScore ? (
                  <input
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    defaultValue={goal.targetScore ?? ""}
                    onBlur={(e) => {
                      const n = e.target.value.trim() ? Number(e.target.value) : undefined;
                      updateGoal(goal.id, { targetScore: n !== undefined && n >= scoreRange.min && n <= scoreRange.max ? n : undefined });
                      setEditingScore(false);
                    }}
                    className="w-20 rounded border-[1.5px] border-gray-dark bg-white px-1.5 py-0.5 text-[15px] text-gray-dark outline-none"
                  />
                ) : (
                  <button
                    onClick={() => setEditingScore(true)}
                    aria-label="Edit target score"
                    className="-mx-1 rounded px-1 transition-colors hover:bg-[#222222]/[0.06]"
                  >
                    {goal.targetScore !== undefined ? `Target ${goal.targetScore}` : "Add a target score"}
                  </button>
                )}
              </>
            )}
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
          {/* Progress + completion — the donut carries the weight, and the
              checkbox below it is the one momentous control on the page. */}
          <div className="mt-6 flex flex-wrap items-center gap-7">
            <GoalDonut done={done} total={total} pct={pct} complete={status === "completed"} />

            <div className="flex min-w-0 flex-col gap-2">
              <button
                onClick={toggleComplete}
                aria-pressed={status === "completed"}
                className="group/complete flex items-center gap-3 self-start rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#222222]/[0.05]"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                    status === "completed" ? "border-gray-dark bg-gray-dark" : "border-[#949494] bg-white group-hover/complete:border-gray-dark"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={status === "completed" ? "opacity-100" : "opacity-0"}>
                    <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-[16px] font-semibold leading-[1.2] text-gray-dark">
                    {status === "completed" ? "You completed this goal" : "I've completed this goal"}
                  </span>
                  <span className="text-[13px] text-gray-light">
                    {status === "completed" ? "Uncheck to reopen it" : `${done} of ${total} tasks done — you can finish early`}
                  </span>
                </span>
              </button>

              {status === "completed" && goal.finalScore !== undefined && (
                <div className="flex flex-wrap items-center gap-3 pl-2">
                  <span className="font-serif text-[32px] font-medium leading-none text-gray-dark">{goal.finalScore}</span>
                  {goal.targetScore !== undefined && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                        goal.finalScore >= goal.targetScore ? "bg-[#E5F5F1] text-[#037052]" : "bg-[#222222]/5 text-gray-light"
                      }`}
                    >
                      {goal.finalScore >= goal.targetScore ? "Target reached" : `Target was ${goal.targetScore}`}
                    </span>
                  )}
                  {goal.baselineScore !== undefined && <span className="text-[14px] text-gray-light">from {goal.baselineScore} baseline</span>}
                </div>
              )}
            </div>
          </div>

          {/* Optional detail, filled in after the moment rather than gating it */}
          {status === "completed" && (
            <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-white p-4">
              {scoreRange && (
                <label className="flex max-w-[240px] flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-gray-light">
                    Your score <span className="font-normal text-[#949494]">optional</span>
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={finalScoreStr}
                    onChange={(e) => setFinalScoreStr(e.target.value)}
                    onBlur={saveOutcomeDetail}
                    placeholder={`${goal.categories[0]} runs ${scoreRange.min}–${scoreRange.max}`}
                    className="rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark"
                  />
                  {finalScoreError && <span className="text-[13px] text-[#9F5B34]">{finalScoreError}</span>}
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-gray-light">
                  What happened? <span className="font-normal text-[#949494]">optional</span>
                </span>
                <textarea
                  rows={2}
                  value={outcomeDraft}
                  onChange={(e) => setOutcomeDraft(e.target.value)}
                  onBlur={saveOutcomeDetail}
                  placeholder="Got into Stanford GSB, starting fall 2027."
                  className="resize-y rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] leading-[1.5] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark"
                />
              </label>
            </div>
          )}

          {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
        </div>

        {/* Test goals lead with the numbers — the scores are the goal. */}
        {goal.type === "test" && <TestOutcomes goal={goal} />}

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
          <AddTask
            label="Add routine"
            placeholder="What do you want to repeat?"
            withCadence
            onAdd={(label, cadence) => addRoutine(goal.id, label, cadence || "Daily")}
          />
        </section>

        {/* The board — projects and "Other tasks" share one modular grid.
            Each tile sets its own width and view, so a wide kanban can sit
            above two narrow lists; drag any tile to reorder. */}
        {showBoard ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
              {boardTiles.map((tile) => {
                const isOtherTasks = tile.id === OTHER_TASKS_TILE_ID;
                return (
                  <ProjectBoard
                    key={tile.id}
                    tile={tile}
                    dragging={dragBoardId === tile.id}
                    onDragStart={() => setDragBoardId(tile.id)}
                    onDragEnd={() => setDragBoardId(null)}
                    onDropOn={(edge, draggedId, span) => {
                      reorderBoardItem(goal.id, draggedId, tile.id, edge, span);
                      setDragBoardId(null);
                    }}
                    onOpenTaskDetail={(task) => setSelectedTaskId(task.id)}
                    onDeleteTask={requestDeleteTask}
                    onSetView={(view) => (isOtherTasks ? setOtherTasksView(goal.id, view) : setProjectView(goal.id, tile.id, view))}
                    onSetSpan={(span) => (isOtherTasks ? setOtherTasksSpan(goal.id, span) : setProjectSpan(goal.id, tile.id, span))}
                    onToggleCollapsed={() => (isOtherTasks ? toggleOtherTasksCollapsed(goal.id) : toggleProjectCollapsed(goal.id, tile.id))}
                    onRename={isOtherTasks ? undefined : (name) => updateProject(goal.id, tile.id, { name })}
                    onSetNote={isOtherTasks ? undefined : (note) => updateProject(goal.id, tile.id, { note })}
                    onDelete={isOtherTasks ? undefined : () => deleteProject(goal.id, tile.id)}
                    onAddTask={(title) => createTask({ title, goalId: goal.id, projectId: isOtherTasks ? null : tile.id })}
                  />
                );
              })}
            </div>
            {/* Pre-assigned to this goal, but the picker lets you send a new task
                to a project, another goal, or nowhere. */}
            <div className="flex flex-wrap items-center gap-2">
              <QuickAddTask defaultGoalId={goal.id} className="font-medium" />
              <AddTask
                label="Add project"
                placeholder="What's the project called?"
                className="font-medium"
                onAdd={(name) => addProject(goal.id, name)}
              />
            </div>
          </div>
        ) : (
          <GoalTasksIntro
            heading="Break it into projects"
            body="Projects split this goal into the big steps it'll take to get there, each with its own list or kanban board of tasks. Add a project, then the tasks under it — check them off as you go."
            onContinue={() => setBoardUnlocked(true)}
          />
        )}

        {/* Content queue — horizontal discovery row, pinned at the bottom.
            Always present, even with nothing queued yet, so every goal has
            somewhere to discover content from. */}
        <section className={CARD}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-[19px] font-semibold leading-[1.2] text-gray-dark">Worth your time</h2>
            <Link to="/courses" className="shrink-0 text-[14px] font-medium text-gray-extra-light transition-opacity hover:opacity-70">
              See all
            </Link>
          </div>
          <p className="mb-4 text-[14px] text-[#707070]">Picked for your {goal.categories[0]} goal.</p>
          {goal.contentQueue.length === 0 ? (
            <p className="rounded-xl bg-[#F3F1E6] p-4 text-[14px] text-gray-light">
              Nothing queued yet — browse courses and livestreams to add some here.
            </p>
          ) : (
            <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-1">
              {goal.contentQueue.map((item) => (
                <div key={item.id} className="flex w-[220px] shrink-0 flex-col gap-2.5">
                  <div className="group relative">
                    <img src={item.image} alt="" className="aspect-video w-full rounded-xl object-cover" />
                    <span className="absolute right-2 top-2">
                      <button
                        onClick={() => deleteContentItem(goal.id, item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222222]/50 text-white backdrop-blur transition-colors hover:bg-[#222222]/70"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <EditableText
                      value={item.title}
                      onCommit={(title) => updateContentItem(goal.id, item.id, { title })}
                      label="title"
                      className="text-[15px] font-semibold leading-[1.25] text-gray-dark"
                    />
                    <div className="text-[13px] text-gray-extra-light">{item.meta}</div>
                  </div>
                  <Button size="md" variant="secondary" className="w-full font-medium">
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          onClick={confirmDeleteGoal}
          className="self-start px-1 text-[14px] font-medium text-gray-extra-light underline decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-[#9F5B34]"
        >
          Delete this goal
        </button>
      </motion.div>

      <TaskDetailModal
        task={selectedTask?.task ?? null}
        goal={goal}
        projectName={selectedTask?.projectName ?? null}
        goals={goals}
        onClose={() => setSelectedTaskId(null)}
        onToggle={() => selectedTask && toggleTask(selectedTask.task.id)}
        onSave={(patch) => selectedTask && updateTask(selectedTask.task.id, patch)}
        onDelete={() => selectedTask && deleteTask(selectedTask.task.id)}
        onReassign={(target) => selectedTask && assignTask(selectedTask.task.id, target)}
      />

      <ConfirmModal
        open={!!confirmDeleteTarget}
        title="Delete this task?"
        body={`${confirmDeleteTarget?.assignedBy?.name ?? "Your expert"} assigned "${confirmDeleteTarget?.title ?? "this task"}" — deleting it removes it for both of you.`}
        confirmLabel="Delete task"
        onConfirm={() => {
          if (confirmDeleteTarget) deleteTask(confirmDeleteTarget.id);
          setConfirmDeleteTarget(null);
        }}
        onClose={() => setConfirmDeleteTarget(null)}
      />
    </PageShell>
  );
}
