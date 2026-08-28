import { motion } from "motion/react";
import { GraduationCap, Building2, Send, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";

import type { Branch } from "../data";
import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * StudentStatusStep (v4) — "Are you a student right now?" Single-select,
 * tapping advances. There's deliberately no "neither" — Leland is built
 * around universities, and this is where that starts to show.
 * ──────────────────────────────────────────────────────────────────────── */

export type StudentStatus = "enrolled" | "graduated" | "applying";

type Option = { status: StudentStatus; label: string; sub: string; Icon: ComponentType<LucideProps> };

const OPTIONS: Option[] = [
  { status: "enrolled", label: "I'm a current student", sub: "Undergrad, grad, or professional program", Icon: GraduationCap },
  { status: "graduated", label: "I've graduated", sub: "Working, between things, or back at it", Icon: Building2 },
  { status: "applying", label: "I'm applying to school", sub: "Getting ready for the next chapter", Icon: Send },
];

export default function StudentStatusStep({
  branch,
  onSelect,
}: {
  branch: Branch;
  onSelect: (s: StudentStatus) => void;
}) {
  const options = branch === "get-into-school" ? OPTIONS : OPTIONS.filter((o) => o.status !== "applying");
  return (
    <div className="h-full overflow-y-auto px-6 pb-10 pt-2">
      <StepHeading
        title="Tell us about your education"
        subtitle="Your background helps us match you with experts who've been exactly where you are, and where you're headed."
      />
      <div className="flex flex-col gap-3">
        {options.map((o, i) => (
          <motion.button
            key={o.status}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(o.status)}
            className="flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-5 py-4 text-left transition-colors hover:bg-gray-hover"
          >
            <o.Icon size={22} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-medium text-gray-dark">{o.label}</span>
              <span className="mt-0.5 block text-[13px] text-gray-light">{o.sub}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
