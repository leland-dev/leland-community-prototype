import { useState } from "react";
import { Link } from "react-router-dom";
import GoalCheck from "../../components/GoalCheck";
import QuickAddTask from "./QuickAddTask";
import TaskDetailModal from "./TaskDetailModal";
import { useCheckedLinger } from "../hooks/useCheckedLinger";
import { useGoals } from "../contexts/GoalsContext";
import { dueLabel, isOverdue, type Goal, type Task, type TaskStatus } from "../data/goals";

const CARD = "rounded-2xl bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "in-progress", label: "In progress" },
  { status: "done", label: "Done" },
];

// Every one-off task across every goal, flattened — the "one big to-do list"
// view. Each row keeps a breadcrumb back to the goal (and project) it came
// from, since without that context a flat list of 40 tasks is unusable.
type FlatTask = {
  task: Task;
  // null for tasks that belong to no goal — capture shouldn't require one.
  goal: Goal | null;
  projectName: string | null;
};

type Grouping = "due" | "goal";
type Filter = "open" | "all";

const DUE_BUCKETS = ["Overdue", "Today", "This week", "Later", "No date", "Completed"] as const;
type DueBucket = (typeof DUE_BUCKETS)[number];

// Kept in sync with the fixture "today" in src/data/goals.ts.
const TODAY = new Date(2026, 7, 14);

// `lingering` keeps a just-checked task classified under its original
// bucket instead of jumping straight to "Completed" — same idea as the
// dashboard widget, where the row holds still instead of teleporting the
// instant you check it. Once the linger window ends, it reclassifies here.
function dueBucket(task: Task, lingering: boolean): DueBucket {
  // Done tasks sort by being done, not by a date that no longer matters.
  if (task.status === "done" && !lingering) return "Completed";
  if (!task.dueDate) return "No date";
  const [y, m, d] = task.dueDate.split("-").map(Number);
  const days = Math.round((new Date(y, m - 1, d).getTime() - TODAY.getTime()) / 86_400_000);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days <= 7) return "This week";
  return "Later";
}

// The master task list — every one-off task across every goal, groupable and
// filterable. Used as the whole body of the /tasks page, and embedded as a
// section under the goals grid so the same list is reachable from either place.
export default function TaskListSection({
  title = "All tasks",
  headingSize = "page",
}: {
  title?: string;
  // "page" for the standalone /tasks route; "section" for a smaller heading
  // that matches other in-page section headers (e.g. embedded under goals).
  headingSize?: "page" | "section";
}) {
  const { goals, standaloneTasks, toggleTask, moveTask, assignTask, updateTask, deleteTask } = useGoals();
  const [grouping, setGrouping] = useState<Grouping>("due");
  const [filter, setFilter] = useState<Filter>("open");
  const [view, setView] = useState<"list" | "kanban">("list");
  const [dragId, setDragId] = useState<string | null>(null);
  // Store just the id and look the task up fresh below — holding onto the
  // task object itself would freeze the modal on a stale snapshot the moment
  // an edit updates the underlying goal/standalone-task data.
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // Per-section width/collapse, keyed by the section's key (a due bucket name
  // or a goal id) — same idea as a project card's span/collapsed, just kept
  // as page-level view state since these groupings aren't real entities.
  const [sectionSpans, setSectionSpans] = useState<Record<string, "full" | "half">>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const { hold, drop, isLingering } = useCheckedLinger();

  const onCheck = (taskId: string, done: boolean) => {
    toggleTask(taskId);
    if (done) drop(taskId);
    else hold(taskId);
  };

  const flat: FlatTask[] = [
    ...goals.flatMap((goal) => [
      ...goal.projects.flatMap((p) => p.tasks.map((task) => ({ task, goal, projectName: p.name }))),
      ...goal.otherTasks.map((task) => ({ task, goal, projectName: null })),
    ]),
    ...standaloneTasks.map((task) => ({ task, goal: null, projectName: null })),
  ];

  const selected = selectedTaskId ? (flat.find((f) => f.task.id === selectedTaskId) ?? null) : null;

  // Under the "Open" filter, a just-checked task lingers so the check is
  // visible before the row leaves — same behaviour as the dashboard widget.
  const visible = filter === "open" ? flat.filter((f) => f.task.status !== "done" || isLingering(f.task.id)) : flat;
  const openCount = flat.filter((f) => f.task.status !== "done").length;
  const overdueCount = flat.filter((f) => isOverdue(f.task)).length;

  // Group into ordered sections — by due bucket, or by the goal they belong to.
  const sections: { key: string; label: string; items: FlatTask[] }[] =
    grouping === "due"
      ? DUE_BUCKETS.map((bucket) => ({
          key: bucket,
          label: bucket,
          items: visible.filter((f) => dueBucket(f.task, isLingering(f.task.id)) === bucket),
        })).filter((s) => s.items.length > 0)
      : [
          ...goals.map((goal) => ({
            key: goal.id,
            label: goal.name,
            items: visible.filter((f) => f.goal?.id === goal.id),
          })),
          { key: "unassigned", label: "No goal", items: visible.filter((f) => !f.goal) },
        ].filter((s) => s.items.length > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        {headingSize === "page" ? (
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] text-gray-dark">{title}</h1>
        ) : (
          <h2 className="text-[19px] font-semibold leading-[1.2] text-gray-dark">{title}</h2>
        )}
        <p className="text-[15px] text-[#707070]">
          {openCount} open across {goals.length} goal{goals.length === 1 ? "" : "s"}
          {overdueCount > 0 && <span className="text-[#9F5B34]"> · {overdueCount} overdue</span>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-gray-hover p-1">
          {([["list", "List"], ["kanban", "Kanban"]] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setView(value)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                view === value ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Grouping only means something in the list view — kanban is already
            grouped by status. */}
        {view === "list" && (
        <div className="flex items-center gap-1 rounded-full bg-gray-hover p-1">
          {([["due", "By date"], ["goal", "By goal"]] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setGrouping(value)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                grouping === value ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        )}
        <div className="flex items-center gap-1 rounded-full bg-gray-hover p-1">
          {([["open", "Open"], ["all", "All"]] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                filter === value ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <QuickAddTask className="font-semibold" />
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          {KANBAN_COLUMNS.map(({ status, label }) => {
            const items = visible.filter((f) => f.task.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dragged = dragId && flat.find((f) => f.task.id === dragId);
                  if (dragged) moveTask(dragged.task.id, status);
                  setDragId(null);
                }}
                className="flex min-h-[140px] flex-col gap-2 rounded-2xl bg-[#F5F5F5] p-3"
              >
                <div className="flex items-center gap-1.5 px-[2px]">
                  <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">{label}</span>
                  <span className="text-[12px] text-[#949494]">{items.length}</span>
                </div>
                {items.map(({ task, goal, projectName }) => {
                  const done = task.status === "done";
                  const overdue = isOverdue(task);
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDragId(task.id)}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="flex cursor-grab items-start gap-2.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 transition-colors hover:bg-[#FCFCFA] active:cursor-grabbing"
                    >
                      <div className="mt-[1px]" onClick={(e) => e.stopPropagation()}>
                        <GoalCheck checked={done} onChange={() => onCheck(task.id, done)} size={18} shape="squareSm" label={task.title} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span
                          className={
                            done ? "text-[14px] leading-[1.3] text-gray-extra-light line-through" : "text-[14px] font-medium leading-[1.3] text-gray-dark"
                          }
                        >
                          {task.title}
                        </span>
                        {goal ? (
                          <Link
                            to={`/goals/${goal.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="truncate text-[12px] text-gray-extra-light transition-opacity hover:opacity-70"
                          >
                            {goal.name}
                            {projectName && ` · ${projectName}`}
                          </Link>
                        ) : (
                          <span className="truncate text-[12px] text-[#949494]">No goal</span>
                        )}
                        {task.dueDate && (
                          <span className={`text-[12px] ${overdue ? "text-[#9F5B34]" : "text-gray-extra-light"}`}>{dueLabel(task.dueDate)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && <div className="px-[2px] pb-2 pt-1 text-[13px] text-[#949494]">Nothing here.</div>}
              </div>
            );
          })}
        </div>
      ) : sections.length === 0 ? (
        <section className={CARD}>
          <p className="text-[15px] text-gray-light">
            {filter === "open" ? "Nothing open. Everything's checked off." : "No tasks yet."}
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {sections.map((section) => {
            const span = sectionSpans[section.key] ?? "full";
            const collapsed = !!collapsedSections[section.key];
            return (
              <section key={section.key} className={`${CARD} ${span === "half" ? "lg:col-span-1" : "lg:col-span-2"}`}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <h2 className="text-[19px] font-semibold leading-[1.2] text-gray-dark">
                    {grouping === "goal" && section.key !== "unassigned" ? (
                      <Link to={`/goals/${section.key}`} className="transition-opacity hover:opacity-70">
                        {section.label}
                      </Link>
                    ) : (
                      section.label
                    )}
                  </h2>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="whitespace-nowrap text-[13px] text-gray-extra-light">{section.items.length}</span>
                    {!collapsed && (
                      <button
                        onClick={() => setSectionSpans((prev) => ({ ...prev, [section.key]: span === "full" ? "half" : "full" }))}
                        aria-label={span === "full" ? `Make ${section.label} half width` : `Make ${section.label} full width`}
                        title={span === "full" ? "Half width" : "Full width"}
                        className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-extra-light transition-colors hover:bg-[#222222]/[0.06] hover:text-gray-dark lg:flex"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {span === "full" ? <path d="M4 6h16v12H4zM12 6v12" /> : <path d="M4 6h16v12H4z" />}
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setCollapsedSections((prev) => ({ ...prev, [section.key]: !collapsed }))}
                      aria-label={collapsed ? `Expand ${section.label}` : `Collapse ${section.label}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-extra-light transition-colors hover:bg-[#222222]/[0.06] hover:text-gray-dark"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform ${collapsed ? "-rotate-90" : ""}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                {!collapsed && (
                <div className="-mx-2 mt-2 flex flex-col gap-[2px]">
                  {section.items.map(({ task, goal, projectName }) => {
                    const done = task.status === "done";
                    const overdue = isOverdue(task);
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`group flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5] ${
                          isLingering(task.id) ? "checked-off-exit" : ""
                        }`}
                      >
                        <div className="mt-[1px]" onClick={(e) => e.stopPropagation()}>
                          <GoalCheck checked={done} onChange={() => onCheck(task.id, done)} label={task.title} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                          <span
                            className={
                              done ? "text-[15px] text-gray-extra-light line-through" : "text-[15px] font-medium leading-[1.3] text-gray-dark"
                            }
                          >
                            {task.title}
                          </span>
                          {/* Breadcrumb — a flat list is only usable if each row
                              says where it came from. Grouping by goal already
                              says it in the section header, so the goal name is
                              dropped from the row there. Parts are assembled
                              first so the "·" separators never dangle. */}
                          <div className="flex flex-wrap items-center gap-x-1.5 text-[13px] text-gray-extra-light">
                            {[
                              grouping === "due" &&
                                (goal ? (
                                  <Link
                                    key="goal"
                                    to={`/goals/${goal.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-medium text-gray-light transition-opacity hover:opacity-70"
                                  >
                                    {goal.name}
                                  </Link>
                                ) : (
                                  <span key="goal" className="text-[#949494]">
                                    No goal
                                  </span>
                                )),
                              projectName && <span key="project">{projectName}</span>,
                              task.dueDate && (
                                <span key="due" className={overdue ? "text-[#9F5B34]" : undefined}>
                                  {dueLabel(task.dueDate)}
                                </span>
                              ),
                              task.assignedBy && (
                                <span key="via" className="inline-flex items-center gap-[5px]">
                                  <img src={task.assignedBy.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                                  via {task.assignedBy.name}
                                </span>
                              ),
                            ]
                              .filter(Boolean)
                              .map((part, i) => (
                                <span key={i} className="flex items-center gap-x-1.5">
                                  {i > 0 && <span aria-hidden>·</span>}
                                  {part}
                                </span>
                              ))}
                          </div>
                          {task.note && <p className="text-[13px] leading-[1.4] text-gray-light">{task.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </section>
            );
          })}
        </div>
      )}
      <TaskDetailModal
        task={selected?.task ?? null}
        goal={selected?.goal ?? null}
        projectName={selected?.projectName ?? null}
        goals={goals}
        onClose={() => setSelectedTaskId(null)}
        onToggle={() => selected && onCheck(selected.task.id, selected.task.status === "done")}
        onSave={(patch) => selected && updateTask(selected.task.id, patch)}
        onDelete={() => selected && deleteTask(selected.task.id)}
        onReassign={(target) => selected && assignTask(selected.task.id, target)}
      />
    </div>
  );
}
