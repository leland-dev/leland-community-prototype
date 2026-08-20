import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { useSetNavTheme } from "../components/NavThemeContext";
import { GoalTile, NewGoalTile } from "../components/GoalTile";
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
      </motion.div>
    </PageShell>
  );
}
