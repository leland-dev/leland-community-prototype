import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useSetNavTheme } from "../components/NavThemeContext";
import { Button } from "../components/Button";
import GoalCheck from "../components/GoalCheck";
import GoalDonut from "../components/GoalDonut";
import Confetti from "../components/Confetti";
import EditableText from "../components/EditableText";
import RowDelete from "../components/RowDelete";
import TestOutcomes from "../components/TestOutcomes";
import TaskDetailModal from "../components/TaskDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import { useGoals } from "../contexts/GoalsContext";
import { dueLabel, goalProgress, isOverdue, type Goal, type Task, type TaskStatus } from "../data/goals";
import { scoreRangeFor } from "../data/goalPlans";
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

// A checklist row — clicking it opens the full task detail (due date, note,
// milestone). The checkbox and delete button stop the click from bubbling so
// they keep their own single-purpose behavior instead of also opening it.
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

// A kanban card — compact, draggable between the three status columns.
// Clicking it (not the checkbox or delete) opens the full task detail.
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

// Inline add affordance — collapses to a ghost button when idle.
function AddRow({
  onAdd,
  variant = "block",
  label = "Add task",
  placeholder = "What needs doing?",
  className = "mt-2 font-medium",
}: {
  onAdd: (title: string) => void;
  variant?: "block" | "column";
  label?: string;
  placeholder?: string;
  className?: string;
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

// The list/kanban toggle + task rendering shared by milestone cards and the
// "Other tasks" section. List is a plain checklist; kanban is three
// drag-and-drop columns (todo / in progress / done).
function TaskGroup({
  tasks,
  view,
  onSetView,
  onAddTask,
  onDeleteTask,
  onOpenTaskDetail,
}: {
  tasks: Task[];
  view: "list" | "kanban";
  onSetView: (view: "list" | "kanban") => void;
  onAddTask: (title: string) => void;
  onDeleteTask: (task: Task) => void;
  onOpenTaskDetail: (task: Task) => void;
}) {
  const { toggleTask, moveTask } = useGoals();
  const [dragId, setDragId] = useState<string | null>(null);

  return (
    <>
      <div className="mb-3 flex justify-end">
        <div className="inline-flex items-center gap-1 rounded-full bg-gray-hover p-1">
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
      </div>

      {view === "list" ? (
        <>
          <div className="-mx-2 flex flex-col gap-[2px]">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onOpenDetail={() => onOpenTaskDetail(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
            {tasks.length === 0 && <p className="px-2 text-[14px] text-[#949494]">Nothing here yet.</p>}
          </div>
          <AddRow onAdd={onAddTask} />
        </>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {KANBAN_COLUMNS.map(({ status, label }) => {
            const colTasks = tasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) moveTask(dragId, status);
                  setDragId(null);
                }}
                className="flex min-h-[120px] flex-col gap-2 rounded-xl bg-[#F5F5F5] p-3"
              >
                <div className="flex items-center gap-1.5 px-[2px]">
                  <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">{label}</span>
                  <span className="text-[12px] text-[#949494]">{colTasks.length}</span>
                </div>
                {colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onOpenDetail={() => onOpenTaskDetail(task)}
                    onDelete={() => onDeleteTask(task)}
                    onDragStart={() => setDragId(task.id)}
                  />
                ))}
                {colTasks.length === 0 && <div className="px-[2px] pb-2 pt-1 text-[13px] text-[#949494]">Nothing here.</div>}
                {status === "todo" && <AddRow variant="column" onAdd={onAddTask} />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// A milestone card — name, note, and its tasks (list or kanban). No
// drag-to-reorder or resize of the card itself — just this one view toggle.
function MilestoneCard({
  goalId,
  milestone,
  onRequestDeleteTask,
  onOpenTaskDetail,
}: {
  goalId: string;
  milestone: Goal["milestones"][number];
  onRequestDeleteTask: (task: Task) => void;
  onOpenTaskDetail: (task: Task) => void;
}) {
  const { updateMilestone, deleteMilestone, createTask, setMilestoneView } = useGoals();
  const done = milestone.tasks.filter((t) => t.status === "done").length;
  const view = milestone.view ?? "list";

  return (
    <section className={`${CARD} group/milestone`}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="min-w-0 text-[19px] font-semibold leading-[1.2] text-gray-dark">
          <EditableText value={milestone.name} onCommit={(name) => updateMilestone(goalId, milestone.id, { name })} label="milestone name" />
        </h2>
        <div className="flex shrink-0 items-center gap-3">
          <span className="whitespace-nowrap text-[13px] text-gray-extra-light">
            {done} of {milestone.tasks.length} done
          </span>
          <span className="opacity-0 transition-opacity group-hover/milestone:opacity-100">
            <RowDelete onDelete={() => deleteMilestone(goalId, milestone.id)} label={milestone.name} />
          </span>
        </div>
      </div>
      <p className="mb-3 text-[14px] text-[#707070]">
        <EditableText
          value={milestone.note ?? ""}
          onCommit={(note) => updateMilestone(goalId, milestone.id, { note })}
          label="milestone description"
          placeholder="Add a description"
          allowEmpty
        />
      </p>
      <TaskGroup
        tasks={milestone.tasks}
        view={view}
        onSetView={(v) => setMilestoneView(goalId, milestone.id, v)}
        onAddTask={(title) => createTask({ title, goalId, milestoneId: milestone.id })}
        onDeleteTask={onRequestDeleteTask}
        onOpenTaskDetail={onOpenTaskDetail}
      />
    </section>
  );
}

export default function GoalDetail() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const {
    getGoal, updateGoal, deleteGoal, completeGoal, reopenGoal, addMilestone, deleteTask, createTask, setOtherTasksView,
    toggleTask, updateTask, reassignTask,
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
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<Task | null>(null);
  // Store just the id and look the task up fresh below — holding onto the
  // task object itself would freeze the modal on a stale snapshot the moment
  // an edit updates the underlying goal data.
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Expert-assigned tasks get a confirmation step before they disappear —
  // everything else deletes right away.
  const requestDeleteTask = (task: Task) => {
    if (task.assignedBy) {
      setConfirmDeleteTarget(task);
      return;
    }
    deleteTask(task.id);
  };

  const goal = goalId ? getGoal(goalId) : undefined;

  // Re-derived from the live goal on every render, so the modal never shows
  // a stale snapshot after an edit.
  const selected = (() => {
    if (!goal || !selectedTaskId) return null;
    for (const m of goal.milestones) {
      const task = m.tasks.find((t) => t.id === selectedTaskId);
      if (task) return { task, milestoneId: m.id };
    }
    const task = goal.otherTasks.find((t) => t.id === selectedTaskId);
    return task ? { task, milestoneId: null } : null;
  })();

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

  const completed = !!goal.completedAt;
  const { done, total, pct } = goalProgress(goal);

  const confirmDeleteGoal = () => {
    if (!window.confirm(`Delete "${goal.name}"? Its milestones and tasks go with it.`)) return;
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
    if (completed) {
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

        {/* Header — cream block with name, target, progress. No on-track/
            needs-action health judgment. */}
        <div className="rounded-2xl px-7 pb-7 pt-7" style={{ backgroundColor: heroBg }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
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
                <span>· {goal.milestones.length} milestone{goal.milestones.length === 1 ? "" : "s"}</span>
                {scoreRange && !completed && (
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
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-3 pr-5 shadow-[0_1px_2px_0_rgba(16,24,40,0.04)]">
                <GoalDonut done={done} total={total} pct={pct} complete={completed} />
                <div className="h-11 w-px shrink-0 bg-[#222222]/10" />
                <button
                  onClick={toggleComplete}
                  aria-pressed={completed}
                  className="group/complete flex items-center gap-3 rounded-xl py-1 text-left transition-opacity hover:opacity-70"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                      completed ? "border-gray-dark bg-gray-dark" : "border-[#949494] bg-white"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={completed ? "opacity-100" : "opacity-0"}>
                      <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[15px] font-semibold leading-[1.2] text-gray-dark">
                      {completed ? "You completed this goal" : "I've completed this goal"}
                    </span>
                    <span className="text-[13px] text-gray-light">
                      {completed ? "Uncheck to reopen it" : `${done} of ${total} tasks done`}
                    </span>
                  </span>
                </button>
              </div>

              {completed && goal.finalScore !== undefined && (
                <div className="flex flex-wrap items-center justify-end gap-3 pr-1">
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

          {completed && (
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

        {/* Milestones — each is a plain checklist or kanban board (todo/
            in-progress/done). No card-level drag-to-reorder or resize. */}
        <div className="flex flex-col gap-3">
          {goal.milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              goalId={goal.id}
              milestone={milestone}
              onRequestDeleteTask={requestDeleteTask}
              onOpenTaskDetail={(task) => setSelectedTaskId(task.id)}
            />
          ))}
          <AddRow label="Add milestone" placeholder="What's the milestone called?" className="self-start font-medium" onAdd={(name) => addMilestone(goal.id, name)} />
        </div>

        {/* Other tasks — not part of any milestone. */}
        <section className={CARD}>
          <h2 className="mb-1 text-[19px] font-semibold leading-[1.2] text-gray-dark">Other tasks</h2>
          <p className="mb-3 text-[14px] text-[#707070]">Not part of a milestone.</p>
          <TaskGroup
            tasks={goal.otherTasks}
            view={goal.otherTasksView ?? "list"}
            onSetView={(v) => setOtherTasksView(goal.id, v)}
            onAddTask={(title) => createTask({ title, goalId: goal.id })}
            onDeleteTask={requestDeleteTask}
            onOpenTaskDetail={(task) => setSelectedTaskId(task.id)}
          />
        </section>

        <button
          onClick={confirmDeleteGoal}
          className="self-start px-1 text-[14px] font-medium text-gray-extra-light underline decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-[#9F5B34]"
        >
          Delete this goal
        </button>
      </motion.div>

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

      <TaskDetailModal
        task={selected?.task ?? null}
        milestoneId={selected?.milestoneId ?? null}
        milestones={goal.milestones.map((m) => ({ id: m.id, name: m.name }))}
        onClose={() => setSelectedTaskId(null)}
        onToggle={() => selected && toggleTask(selected.task.id)}
        onSave={(patch) => selected && updateTask(selected.task.id, patch)}
        onDelete={() => selected && deleteTask(selected.task.id)}
        onReassign={(milestoneId) => selected && reassignTask(goal.id, selected.task.id, milestoneId)}
      />
    </PageShell>
  );
}
