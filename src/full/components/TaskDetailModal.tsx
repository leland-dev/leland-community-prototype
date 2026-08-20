import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import EditableText from "../../components/EditableText";
import GoalCheck from "../../components/GoalCheck";
import ConfirmModal from "../../components/ConfirmModal";
import { dueLabel, isOverdue, type Goal, type Task } from "../data/goals";
import editIcon from "../../assets/icons/edit.svg";

type TaskDetailModalProps = {
  // null closes the modal — callers just pass the currently-selected task.
  task: Task | null;
  goal: Goal | null;
  projectName: string | null;
  // Every goal, so the reassignment picker has somewhere to move a task to.
  goals: Goal[];
  onClose: () => void;
  onToggle: () => void;
  onSave: (patch: Partial<Pick<Task, "title" | "dueDate" | "note">>) => void;
  onDelete: () => void;
  onReassign: (target: { goalId: string | null; projectId: string | null }) => void;
};

// Click straight into a field and type — same click-to-edit-in-place pattern
// as EditableText, just with a date input instead of text.
function InlineDueDate({ dueDate, overdue, onCommit }: { dueDate?: string; overdue: boolean; onCommit: (next: string | undefined) => void }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={ref}
        type="date"
        defaultValue={dueDate ?? ""}
        aria-label="Due date"
        onChange={(e) => onCommit(e.target.value || undefined)}
        onBlur={() => setEditing(false)}
        className="w-[160px] rounded-lg border-[1.5px] border-gray-dark bg-white px-2.5 py-2 text-[14px] text-gray-dark outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`-mx-1 self-start rounded px-1 text-left text-[15px] transition-colors hover:bg-[#222222]/[0.06] ${
        dueDate && overdue ? "font-medium text-[#9F5B34]" : "text-gray-dark"
      }`}
    >
      {dueDate ? dueLabel(dueDate) : <span className="text-[#949494]">Add a due date</span>}
    </button>
  );
}

// Same idea for the note — click the text (or the placeholder) and it
// becomes a textarea right there, no separate toggle or edit mode involved.
function InlineNote({ note, onCommit }: { note?: string; onCommit: (next: string | undefined) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note ?? "");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next !== (note ?? "")) onCommit(next || undefined);
  };

  if (editing) {
    return (
      <textarea
        ref={ref}
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        placeholder="Add details or notes for this task…"
        className="resize-y rounded-lg border-[1.5px] border-gray-dark bg-white px-2.5 py-2 text-[14px] leading-[1.4] text-gray-dark outline-none placeholder:text-[#949494]"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(note ?? "");
        setEditing(true);
      }}
      className="-mx-1 rounded px-1 py-0.5 text-left text-[14px] leading-[1.5] text-gray-dark transition-colors hover:bg-[#222222]/[0.06]"
    >
      {note || <span className="text-[#949494]">Add a note</span>}
    </button>
  );
}

// The one field that isn't plain click-to-edit: the goal name doubles as a
// link (click it, go to the goal), so reassigning needs its own explicit
// affordance — a small pencil beside it — rather than overloading the click
// on the name itself. Closing the modal on navigate keeps the portal from
// lingering over whatever page comes next.
function InlineGoalAssignment({
  goal,
  projectName,
  goals,
  onNavigate,
  onReassign,
}: {
  goal: Goal | null;
  projectName: string | null;
  goals: Goal[];
  onNavigate: () => void;
  onReassign: (target: { goalId: string | null; projectId: string | null }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <select
        ref={ref}
        value={goal ? `${goal.id}::${projectName ?? ""}` : ""}
        aria-label="Goal"
        onBlur={() => setEditing(false)}
        onChange={(e) => {
          const [gid, pname] = e.target.value.split("::");
          const target = goals.find((g) => g.id === gid);
          onReassign({
            goalId: gid || null,
            projectId: pname ? (target?.projects.find((p) => p.name === pname)?.id ?? null) : null,
          });
          setEditing(false);
        }}
        className="w-full rounded-lg border-[1.5px] border-gray-dark bg-white px-2.5 py-2 text-[14px] text-gray-dark outline-none"
      >
        <option value="">No goal</option>
        {goals.map((g) => [
          <option key={g.id} value={`${g.id}::`}>
            {g.name}
          </option>,
          ...g.projects.map((p) => (
            <option key={p.id} value={`${g.id}::${p.name}`}>
              {g.name} › {p.name}
            </option>
          )),
        ])}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {goal ? (
        <Link to={`/goals/${goal.id}`} onClick={onNavigate} className="text-[15px] text-gray-dark transition-opacity hover:opacity-70">
          {goal.name}
          {projectName && ` · ${projectName}`}
        </Link>
      ) : (
        <span className="text-[15px] text-[#949494]">No goal</span>
      )}
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Change goal"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-extra-light transition-colors hover:bg-[#222222]/10 hover:text-gray-dark"
      >
        <img src={editIcon} alt="" className="h-[13px] w-[13px]" />
      </button>
    </div>
  );
}

// Full detail for a single task — opened by clicking its name anywhere it
// appears (dashboard widget, the all-tasks list, a goal's board). Every field
// is click-to-edit in place, same as the rest of the app — no separate edit
// mode to step into first.
export default function TaskDetailModal({ task, goal, projectName, goals, onClose, onToggle, onSave, onDelete, onReassign }: TaskDetailModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!task) return null;

  const done = task.status === "done";

  // Expert-assigned tasks get a confirmation step before they disappear —
  // everything else deletes right away, same as elsewhere in the app.
  const requestDelete = () => {
    if (task.assignedBy) {
      setConfirmingDelete(true);
      return;
    }
    onDelete();
    onClose();
  };

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[480px] rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-3 pr-14">
            <div className="mt-[3px]">
              <GoalCheck checked={done} onChange={onToggle} label={task.title} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <EditableText
                value={task.title}
                onCommit={(title) => onSave({ title })}
                label="task name"
                className={`text-[19px] font-medium leading-[1.25] ${done ? "text-gray-extra-light line-through" : "text-gray-dark"}`}
              />
              {task.assignedBy && (
                <span className="mt-0.5 inline-flex w-fit items-center gap-[5px] rounded-full bg-[#F3F1E6] py-[2px] pl-[3px] pr-2 text-[12px] text-gray-light">
                  <img src={task.assignedBy.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                  via {task.assignedBy.name}
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-[#222222]/10 pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-gray-light">Goal</span>
              <InlineGoalAssignment goal={goal} projectName={projectName} goals={goals} onNavigate={onClose} onReassign={onReassign} />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-gray-light">Due date</span>
              <InlineDueDate dueDate={task.dueDate} overdue={isOverdue(task)} onCommit={(dueDate) => onSave({ dueDate })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-gray-light">Note</span>
              <InlineNote note={task.note} onCommit={(note) => onSave({ note })} />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={requestDelete}
              className="text-[14px] font-medium text-gray-extra-light underline decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-[#9F5B34]"
            >
              Delete task
            </button>
          </div>
        </motion.div>
      </motion.div>

      <ConfirmModal
        open={confirmingDelete}
        title="Delete this task?"
        body={`${task.assignedBy?.name ?? "Your expert"} assigned "${task.title}" — deleting it removes it for both of you.`}
        confirmLabel="Delete task"
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete();
          onClose();
        }}
        onClose={() => setConfirmingDelete(false)}
      />
    </>,
    document.body,
  );
}
