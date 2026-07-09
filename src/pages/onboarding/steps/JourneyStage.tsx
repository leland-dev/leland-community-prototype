import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";

import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * JourneyStage (v2) — "Where are you at?" A vertical stepper of journey stages
 * (single-select) plus a special "reapplying" option. Stages before the pick
 * read as completed (check), the pick is the current dot, later stages are
 * empty. In the v2 white/ink theme.
 * ──────────────────────────────────────────────────────────────────────── */

type Stage = { title: string; desc: string };

const STAGES: Stage[] = [
  { title: "Just getting started", desc: "Exploring what it takes" },
  { title: "Actively preparing", desc: "Studying and building skills" },
  { title: "Putting it together", desc: "Working on my application" },
  { title: "In the final stretch", desc: "Interviews and decisions ahead" },
];

const REAPPLY = "reapply";
type Choice = number | typeof REAPPLY | null;

export default function JourneyStage({
  onBack,
  onContinue,
  onSkip,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}) {
  const [choice, setChoice] = useState<Choice>(null);
  const selectedIndex = typeof choice === "number" ? choice : -1;
  const chosen = choice !== null;

  return (
    <div className="flex h-full flex-col">
      {/* top chrome: back + skip */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-1">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-black/[0.05]"
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>
        ) : (
          <span className="h-9 w-9" />
        )}
        {onSkip ? (
          <button
            onClick={onSkip}
            className="rounded-full px-3 py-1.5 text-[15px] font-medium text-gray-light transition-colors hover:bg-black/[0.05] hover:text-gray-dark"
          >
            Skip
          </button>
        ) : null}
      </div>

      {/* scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32">
        <StepHeading
          title="Where are you at?"
          subtitle="Tap the stage you're in — we'll build around it."
        />

        <div className="flex flex-col">
          {STAGES.map((stage, i) => {
            const isSelected = i === selectedIndex;
            const isDone = selectedIndex >= 0 && i < selectedIndex;
            const isFirst = i === 0;
            const isLast = i === STAGES.length - 1;
            const topFilled = !isFirst && selectedIndex >= 0 && i <= selectedIndex;
            const bottomFilled = !isLast && selectedIndex >= 0 && i < selectedIndex;
            return (
              <button
                key={stage.title}
                onClick={() => setChoice(i)}
                className={`flex w-full items-stretch gap-3 rounded-2xl pr-3 text-left transition-colors ${
                  isSelected ? "bg-gray-hover" : "hover:bg-black/[0.02]"
                }`}
              >
                {/* rail + node */}
                <div className="relative flex w-10 shrink-0 items-center justify-center self-stretch">
                  {!isFirst ? (
                    <span
                      className={`absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 ${
                        topFilled ? "bg-gray-dark" : "bg-gray-stroke"
                      }`}
                    />
                  ) : null}
                  {!isLast ? (
                    <span
                      className={`absolute bottom-0 left-1/2 h-1/2 w-[2px] -translate-x-1/2 ${
                        bottomFilled ? "bg-gray-dark" : "bg-gray-stroke"
                      }`}
                    />
                  ) : null}
                  {isDone ? (
                    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-dark text-white">
                      <Check size={15} strokeWidth={3} />
                    </span>
                  ) : isSelected ? (
                    <motion.span
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-dark"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    </motion.span>
                  ) : (
                    <span className="relative z-10 h-7 w-7 rounded-full border-2 border-gray-stroke bg-white" />
                  )}
                </div>

                {/* label */}
                <div className="min-w-0 flex-1 py-3">
                  <p className="text-[16px] font-semibold text-gray-dark">
                    {stage.title}
                  </p>
                  <p
                    className={`mt-0.5 text-[13.5px] ${
                      isSelected ? "font-medium text-gray-dark/70" : "text-gray-light"
                    }`}
                  >
                    {isSelected ? "You are here" : stage.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* special: reapplying */}
        <button
          onClick={() => setChoice(REAPPLY)}
          className={`mt-4 w-full rounded-2xl border px-4 py-3.5 text-center text-[15px] font-medium transition-colors ${
            choice === REAPPLY
              ? "border-gray-dark bg-gray-hover text-gray-dark"
              : "border-dashed border-gray-stroke text-gray-dark hover:bg-gray-hover"
          }`}
        >
          I'm reapplying this cycle
        </button>
      </div>

      {/* Continue — bottom-anchored, fades up over the content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8">
        <button
          onClick={onContinue}
          disabled={!chosen}
          className={`pointer-events-auto flex h-14 w-full items-center justify-center rounded-full text-[15px] font-medium transition-colors ${
            chosen
              ? "bg-gray-dark text-white hover:bg-[#333]"
              : "cursor-not-allowed bg-gray-dark/30 text-white"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
