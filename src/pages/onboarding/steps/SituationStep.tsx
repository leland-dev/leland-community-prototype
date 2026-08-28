import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, BookOpen, Send, RefreshCw, Trophy, Target, type LucideProps } from "lucide-react";
import { type ComponentType, Fragment } from "react";

import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * SituationStep — "What's your current situation?" as a timeline. Multi-
 * select; the ring indicators on the right are joined by connector lines, and
 * selecting draws a ring around the circle before filling it.
 * ──────────────────────────────────────────────────────────────────────── */

export type Situation = { label: string; Icon: ComponentType<LucideProps> };

const SITUATIONS: Situation[] = [
  { label: "Just starting to explore", Icon: Compass },
  { label: "Actively preparing", Icon: BookOpen },
  { label: "Applying and interviewing", Icon: Send },
  { label: "Reapplying this cycle", Icon: RefreshCw },
  { label: "Already in, leveling up", Icon: Trophy },
];

/* ring draws around the circle, then the center fills; fully hidden until
   selected so no stroke artifacts show on idle circles */
function RingCheck({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#e5e5e5" strokeWidth="2" />
      <motion.circle
        cx="12" cy="12" r="9" fill="none" stroke="#222222" strokeWidth="2" strokeLinecap="round"
        initial={false}
        animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{
          pathLength: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
          opacity: { duration: on ? 0.01 : 0.15 },
        }}
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

export default function SituationStep({
  onContinue,
  title = "What's your current situation?",
  options = SITUATIONS,
  single = false,
  topic,
}: {
  onContinue: (picked: string[]) => void;
  title?: string;
  options?: Situation[];
  single?: boolean;
  /** eyebrow chip carrying forward the previously-picked path */
  topic?: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (label: string) =>
    setPicked((p) =>
      p.includes(label) ? p.filter((x) => x !== label) : single ? [label] : [...p, label],
    );

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-6 pt-2">
        {topic ? (
          <div className="mb-3 flex items-center gap-1.5">
            <Target size={15} strokeWidth={2.2} className="shrink-0 text-gray-dark" />
            <span className="rounded-[4px] bg-yellow px-1.5 py-0.5 text-[13px] font-semibold text-gray-dark">
              {topic}
            </span>
          </div>
        ) : null}
        <StepHeading title={title} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32">
        <div className="flex flex-col">
          {options.map((sit, i) => {
            const on = picked.includes(sit.label);
            return (
              <Fragment key={sit.label}>
                {i > 0 ? (
                  /* timeline connector, aligned to the ring centers */
                  <div className="flex justify-end pr-[31px]">
                    <div className="h-5 w-[2px] rounded-full bg-gray-stroke" />
                  </div>
                ) : null}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 + i * 0.05 }}
                  onClick={() => toggle(sit.label)}
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
              </Fragment>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {picked.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+1.5rem)] z-20 mx-auto w-full max-w-[440px] px-6"
          >
            <button
              onClick={() => onContinue(picked)}
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
