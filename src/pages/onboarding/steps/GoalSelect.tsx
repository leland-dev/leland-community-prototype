import { motion } from "motion/react";
import { Sparkles, TrendingUp, GraduationCap, type LucideProps } from "lucide-react";
import { type ComponentType } from "react";

import type { Branch } from "../data";
import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * GoalSelect (v2) — "What's your goal?" Three buckets (mirrors the opener),
 * single-select; tapping a bucket advances immediately. Chrome (back · dots ·
 * skip) is provided by the shell.
 * ──────────────────────────────────────────────────────────────────────── */

const BUCKETS: { label: string; Icon: ComponentType<LucideProps>; branch: Branch }[] = [
  { label: "Build with AI", Icon: Sparkles, branch: "build-with-ai" },
  { label: "Grow your career", Icon: TrendingUp, branch: "grow-career" },
  { label: "Get into school", Icon: GraduationCap, branch: "get-into-school" },
];

export default function GoalSelect({ onSelect }: { onSelect: (b: Branch) => void }) {
  return (
    <div className="h-full overflow-y-auto px-6 pb-10 pt-2">
      <StepHeading title="What's your goal?" subtitle="Pick one to get started." />
      <div className="flex flex-col gap-3">
        {BUCKETS.map((b, i) => (
          <motion.button
            key={b.branch}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(b.branch)}
            className="flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-5 py-5 text-left text-[17px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
          >
            <b.Icon size={22} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
            {b.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
