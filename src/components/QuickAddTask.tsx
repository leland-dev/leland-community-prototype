import { useState } from "react";
import { Button } from "./Button";
import { useGoals } from "../contexts/GoalsContext";
import addPlusIcon from "../assets/icons/add-plus.svg";

// Capture-first add task. A goal is optional: type a title and hit Add and the
// task lands on nothing, which is how real to-do lists work. The assign picker
// is right there if you do want it on a goal or project.
export default function QuickAddTask({
  label = "Add task",
  defaultGoalId = null,
  className = "mt-4 font-semibold",
}: {
  label?: string;
  defaultGoalId?: string | null;
  // Override the collapsed button's classes — the default assumes it's
  // stacked below other block content; pass something without a top margin
  // when it sits inline alongside other controls (e.g. a row of pill toggles).
  className?: string;
}) {
  const { goals, createTask } = useGoals();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState<string | null>(defaultGoalId);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");

  const goal = goals.find((g) => g.id === goalId) ?? null;

  const reset = () => {
    setTitle("");
    setGoalId(defaultGoalId);
    setProjectId(null);
    setDueDate("");
    setOpen(false);
  };

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    createTask({ title: t, goalId, projectId, dueDate: dueDate || undefined });
    reset();
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="md" variant="secondary" className={className}>
        <img src={addPlusIcon} alt="" className="h-[18px] w-[18px]" />
        {label}
      </Button>
    );
  }

  const select =
    "rounded-lg border-[1.5px] border-[#949494] bg-white px-2.5 py-2 text-[14px] text-gray-dark outline-none focus:border-gray-dark";

  return (
    <div className="mt-4 flex flex-col gap-2.5 rounded-xl bg-[#F5F5F5] p-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") reset();
        }}
        placeholder="What needs doing?"
        aria-label="Task name"
        className="rounded-lg border-[1.5px] border-[#949494] bg-white px-3 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-[#949494] focus:border-gray-dark"
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={goalId ?? ""}
          aria-label="Assign to goal"
          onChange={(e) => {
            setGoalId(e.target.value || null);
            setProjectId(null);
          }}
          className={select}
        >
          <option value="">No goal</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {goal && goal.projects.length > 0 && (
          <select value={projectId ?? ""} aria-label="Assign to project" onChange={(e) => setProjectId(e.target.value || null)} className={select}>
            <option value="">No project</option>
            {goal.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="Due date" className={select} />
      </div>

      <div className="flex items-center gap-2.5">
        <Button onClick={submit} size="md" variant="primary" className="font-medium">
          Add task
        </Button>
        <button onClick={reset} className="px-2.5 py-2 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">
          Cancel
        </button>
      </div>
    </div>
  );
}
