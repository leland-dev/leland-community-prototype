import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import PageShell from "../../components/PageShell";
import { useSetNavTheme } from "../../components/NavThemeContext";
import { GoalTile, NewGoalTile } from "../components/GoalTile";
import TaskListSection from "../components/TaskListSection";
import AdminToggle from "../../components/AdminToggle";
import { useGoals } from "../contexts/GoalsContext";

// Destination for the dashboard card's "See all". Not part of the four
// handoff screens — a plain wrapping grid of the same tiles until it's designed.
export default function GoalsIndex() {
  const { goals } = useGoals();
  const navTheme = useMemo(() => ({ bg: "#FCFCFA", light: false, hideWordmark: false, scrollReveal: true }), []);
  useSetNavTheme(navTheme);

  useEffect(() => {
    document.title = "My goals";
  }, []);

  // Admin tool — same show/hide pattern as the dashboard's "Tasks widget"
  // toggle, for reviewing this page with or without the master task list.
  const [adminOpen, setAdminOpen] = useState(false);
  const [tasksSection, setTasksSection] = useState(true);
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [adminOpen]);

  return (
    <PageShell variant="standard">
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
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] text-gray-dark">My goals</h1>
          <p className="text-[15px] text-[#707070]">Track your progress toward what matters most.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {goals.map((goal) => (
            <GoalTile key={goal.id} goal={goal} />
          ))}
          <NewGoalTile />
        </div>

        {tasksSection && <TaskListSection title="My tasks" headingSize="section" />}
      </motion.div>

      {/* Admin tool — 3-dot menu matching the dashboard's */}
      <div
        ref={adminRef}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-40 md:bottom-6 md:right-6"
      >
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <AdminToggle label="Tasks section" checked={tasksSection} onChange={() => setTasksSection((v) => !v)} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
          aria-label="Admin controls"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-colors hover:bg-[#B1B1B1]/30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#222222" />
            <circle cx="8" cy="8" r="1.5" fill="#222222" />
            <circle cx="13" cy="8" r="1.5" fill="#222222" />
          </svg>
        </button>
      </div>
    </PageShell>
  );
}
