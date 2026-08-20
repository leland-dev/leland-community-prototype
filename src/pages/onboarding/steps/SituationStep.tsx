import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, BookOpen, Send, RefreshCw, Trophy, type LucideProps } from "lucide-react";
import { type ComponentType } from "react";

import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * SituationStep — "What's your current situation?" as a timeline, not a quiz.
 * One line of copy, an icon per stage, and a selection indicator that draws a
 * ring around the circle before filling it.
 * ──────────────────────────────────────────────────────────────────────── */

type Situation = { label: string; Icon: ComponentType<LucideProps> };

const SITUATIONS: Situation[] = [
  { label: "Just starting to explore", Icon: Compass },
  { label: "Actively preparing", Icon: BookOpen },
  { label: "Applying and interviewing", Icon: Send },
  { label: "Reapplying this cycle", Icon: RefreshCw },
  { label: "Already in, leveling up", Icon: Trophy },
];

/* ring draws around the circle, then the center fills */
function RingCheck({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#e5e5e5" strokeWidth="2" />
      <motion.circle
        cx="12" cy="12" r="9" fill="none" stroke="#222222" strokeWidth="2" strokeLinecap="round"
        initial={false}
        animate={{ pathLength: on ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      />
      <motion.circle
        cx="12" cy="12" r="5" fill="#222222"
        initial={false}
        animate={{ scale: on ? 1 : 0 }}
        transition={on ? { delay: 0.28, type: "spring", stiffness: 500, damping: 22 } : { duration: 0.15 }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}

export default function SituationStep({ onContinue }: { onContinue: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-6 pt-2">
        <StepHeading
          title="What's your current situation?"
          subtitle="Tap where you are on the journey."
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32">
        <div className="flex flex-col gap-2.5">
          {SITUATIONS.map((sit, i) => {
            const on = picked === sit.label;
            return (
              <motion.button
                key={sit.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 + i * 0.05 }}
                onClick={() => setPicked(on ? null : sit.label)}
                className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                  on ? "border-gray-dark bg-gray-hover" : "border-gray-stroke bg-white hover:bg-gray-hover"
                }`}
              >
                <sit.Icon size={20} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
                <span className="min-w-0 flex-1 text-[15px] font-medium text-gray-dark">
                  {sit.label}
                </span>
                <RingCheck on={on} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {picked ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+1.5rem)] z-20 mx-auto w-full max-w-[440px] px-6"
          >
            <button
              onClick={onContinue}
              className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              Continue
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
