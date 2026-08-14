import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { useSetNavTheme } from "../components/NavThemeContext";
import GoalCheck from "../components/GoalCheck";
import { useGoals } from "../contexts/GoalsContext";
import { dueLabel, isOverdue, type Goal, type Task } from "../data/goals";

const CARD = "rounded-2xl bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

// Every one-off task across every goal, flattened — the "one big to-do list"
// view. Each row keeps a breadcrumb back to the goal (and project) it came
// from, since without that context a flat list of 40 tasks is unusable.
type FlatTask = {
  task: Task;
  goal: Goal;
  projectName: string | null;
};

type Grouping = "due" | "goal";
type Filter = "open" | "all";

const DUE_BUCKETS = ["Overdue", "Today", "This week", "Later", "No date", "Completed"] as const;
type DueBucket = (typeof DUE_BUCKETS)[number];

// Kept in sync with the fixture "today" in src/data/goals.ts.
const TODAY = new Date(2026, 7, 14);

function dueBucket(task: Task): DueBucket {
  // Done tasks sort by being done, not by a date that no longer matters.
  if (task.status === "done") return "Completed";
  if (!task.dueDate) return "No date";
  if (isOverdue(task)) return "Overdue";
  const [y, m, d] = task.dueDate.split("-").map(Number);
  const days = Math.round((new Date(y, m - 1, d).getTime() - TODAY.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days <= 7) return "This week";
  return "Later";
}

export default function TaskList() {
  const { goals, toggleTask } = useGoals();
  const navTheme = useMemo(() => ({ bg: "#FCFCFA", light: false, hideWordmark: false, scrollReveal: true }), []);
  useSetNavTheme(navTheme);
  const [grouping, setGrouping] = useState<Grouping>("due");
  const [filter, setFilter] = useState<Filter>("open");

  useEffect(() => {
    document.title = "All tasks";
  }, []);

  const flat: FlatTask[] = goals.flatMap((goal) => [
    ...goal.projects.flatMap((p) => p.tasks.map((task) => ({ task, goal, projectName: p.name }))),
    ...goal.otherTasks.map((task) => ({ task, goal, projectName: null })),
  ]);

  const visible = filter === "open" ? flat.filter((f) => f.task.status !== "done") : flat;
  const openCount = flat.filter((f) => f.task.status !== "done").length;
  const overdueCount = flat.filter((f) => isOverdue(f.task)).length;

  // Group into ordered sections — by due bucket, or by the goal they belong to.
  const sections: { key: string; label: string; items: FlatTask[] }[] =
    grouping === "due"
      ? DUE_BUCKETS.map((bucket) => ({
          key: bucket,
          label: bucket,
          items: visible.filter((f) => dueBucket(f.task) === bucket),
        })).filter((s) => s.items.length > 0)
      : goals
          .map((goal) => ({
            key: goal.id,
            label: goal.name,
            items: visible.filter((f) => f.goal.id === goal.id),
          }))
          .filter((s) => s.items.length > 0);

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
          Dashboard
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] text-gray-dark">All tasks</h1>
          <p className="text-[15px] text-[#707070]">
            {openCount} open across {goals.length} goal{goals.length === 1 ? "" : "s"}
            {overdueCount > 0 && <span className="text-[#9F5B34]"> · {overdueCount} overdue</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
        </div>

        {sections.length === 0 ? (
          <section className={CARD}>
            <p className="text-[15px] text-gray-light">
              {filter === "open" ? "Nothing open. Everything's checked off." : "No tasks yet."}
            </p>
          </section>
        ) : (
          sections.map((section) => (
            <section key={section.key} className={CARD}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-[19px] font-semibold leading-[1.2] text-gray-dark">
                  {grouping === "goal" ? (
                    <Link to={`/goals/${section.key}`} className="transition-opacity hover:opacity-70">
                      {section.label}
                    </Link>
                  ) : (
                    section.label
                  )}
                </h2>
                <span className="text-[13px] text-gray-extra-light">{section.items.length}</span>
              </div>
              <div className="-mx-2 flex flex-col gap-[2px]">
                {section.items.map(({ task, goal, projectName }) => {
                  const done = task.status === "done";
                  const overdue = isOverdue(task);
                  return (
                    <div key={task.id} className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F5F5F5]">
                      <div className="mt-[1px]">
                        <GoalCheck checked={done} onChange={() => toggleTask(goal.id, task.id)} label={task.title} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                        <span className={done ? "text-[15px] text-gray-extra-light line-through" : "text-[15px] font-medium leading-[1.3] text-gray-dark"}>
                          {task.title}
                        </span>
                        {/* Breadcrumb — a flat list is only usable if each row
                            says where it came from. Grouping by goal already
                            says it in the section header, so the goal name is
                            dropped from the row there. Parts are assembled
                            first so the "·" separators never dangle. */}
                        <div className="flex flex-wrap items-center gap-x-1.5 text-[13px] text-gray-extra-light">
                          {[
                            grouping === "due" && (
                              <Link key="goal" to={`/goals/${goal.id}`} className="font-medium text-gray-light transition-opacity hover:opacity-70">
                                {goal.name}
                              </Link>
                            ),
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
            </section>
          ))
        )}
      </motion.div>
    </PageShell>
  );
}
