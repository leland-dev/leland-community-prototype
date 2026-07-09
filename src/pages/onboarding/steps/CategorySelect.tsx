import { useState, type FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ChevronDown,
  Cpu,
  Sparkles,
  GraduationCap,
  Briefcase,
  Wrench,
  Landmark,
  Code2,
  Banknote,
  TrendingUp,
  Users,
  Mic,
  Scale,
  Stethoscope,
  FlaskConical,
  Award,
  Boxes,
  BarChart3,
  type LucideProps,
} from "lucide-react";

import type { Branch } from "../data";
import { BUCKETS, CATEGORY_PEEK } from "../flowConfig";
import { StepHeading } from "./flowUI";

/* Screen 4 — "What are you working toward?" Clean icon cards (icon top, label
   below), multi-select with a springy check, Continue when ≥1 chosen. */

const ICON: Record<string, FC<LucideProps>> = {
  // AI
  "Build with AI (my current role)": Cpu,
  "Break Into AI Careers": Sparkles,
  "AI for Product Development": Boxes,
  "AI & ML Engineering": Code2,
  "AI for Sales & Marketing": TrendingUp,
  "AI for Finance": Banknote,
  "AI for Data & Analytics": BarChart3,
  // Career
  "Management Consulting": Briefcase,
  "Product Management": Wrench,
  "Investment Banking": Landmark,
  "Software Engineering": Code2,
  "Private Equity": Banknote,
  "Venture Capital": TrendingUp,
  "Executive Coaching": Users,
  "Career Coaching": Briefcase,
  "Public Speaking": Mic,
  // School
  MBA: Briefcase,
  College: GraduationCap,
  "Master's Programs": GraduationCap,
  "Medical School": Stethoscope,
  "Law School": Scale,
  "PhD Programs": FlaskConical,
  "Dental School": Stethoscope,
  "Scholarships & Fellowships": Award,
  "PA School": Stethoscope,
  "Nursing School": Stethoscope,
};

function Card({
  label,
  index,
  selected,
  onClick,
}: {
  label: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = ICON[label] ?? Sparkles;
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: selected ? 0.97 : 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 28, delay: index * 0.03 }}
      onClick={onClick}
      className={`relative flex min-h-[116px] flex-col justify-between rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? "border-gray-dark bg-gray-hover"
          : "border-gray-stroke bg-white hover:bg-gray-hover"
      }`}
    >
      <Icon size={26} strokeWidth={1.75} className="text-gray-dark" />
      <span className="text-[15px] font-medium leading-tight text-gray-dark">
        {label}
      </span>

      {/* springy check chip, top-right */}
      <AnimatePresence>
        {selected ? (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
            className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gray-dark text-white"
          >
            <Check size={13} strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

export default function CategorySelect({
  branch,
  selected,
  onCommit,
}: {
  branch: Branch;
  selected: string[];
  onCommit: (categories: string[]) => void;
}) {
  const cfg = BUCKETS[branch];
  const [showAll, setShowAll] = useState(false);
  const [picked, setPicked] = useState<string[]>(selected);

  const list = showAll ? cfg.categories : cfg.categories.slice(0, CATEGORY_PEEK);
  const hasMore = cfg.categories.length > CATEGORY_PEEK;

  const toggle = (cat: string) =>
    setPicked((p) => (p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]));

  return (
    <>
      <div className="flex flex-col pb-28">
        <StepHeading
          title={cfg.categoryQuestion}
          subtitle="Pick one or more."
        />
        <div className="grid grid-cols-2 gap-3">
          {list.map((cat, i) => (
            <Card
              key={cat}
              label={cat}
              index={i}
              selected={picked.includes(cat)}
              onClick={() => toggle(cat)}
            />
          ))}
        </div>

        {hasMore && !showAll ? (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-stroke px-4 py-3 text-[14px] font-medium text-gray-light transition-colors hover:bg-gray-hover"
          >
            More
            <ChevronDown size={16} />
          </button>
        ) : null}
      </div>

      {/* Continue — bottom-anchored, appears once something is picked */}
      <AnimatePresence>
        {picked.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 mx-auto w-full max-w-[440px] px-6"
          >
            <button
              onClick={() => onCommit(picked)}
              className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              Continue · {picked.length}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
