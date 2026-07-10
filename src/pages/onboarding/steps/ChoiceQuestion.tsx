import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, type LucideProps } from "lucide-react";

import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * ChoiceQuestion (v2) — a reusable single/multi-select question screen.
 * Full-width option cards (label + optional sublabel) with a springy check,
 * gated Continue, and the shared chrome (back · dots · skip).
 * ──────────────────────────────────────────────────────────────────────── */

export type Choice = {
  label: string;
  sublabel?: string;
  Icon?: ComponentType<LucideProps>;
};

export default function ChoiceQuestion({
  title,
  subtitle,
  options,
  multi = false,
  minSelect = 1,
  onContinue,
}: {
  title: string;
  subtitle?: string;
  options: Choice[];
  multi?: boolean;
  minSelect?: number;
  onContinue: (picked: string[]) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (label: string) =>
    setPicked((p) => {
      if (!multi) return p.includes(label) ? [] : [label];
      return p.includes(label) ? p.filter((x) => x !== label) : [...p, label];
    });

  const enough = picked.length >= minSelect;

  return (
    <div className="flex h-full flex-col">
      {/* sticky header — stays put while the options scroll */}
      <div className="shrink-0 px-6 pt-2">
        <StepHeading
          title={title}
          subtitle={subtitle ?? (multi ? "Pick any that apply." : "Pick one.")}
        />
      </div>

      {/* scrolling options */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32">
        <div className="flex flex-col gap-2.5">
          {options.map((opt, i) => {
            const active = picked.includes(opt.label);
            return (
              <motion.button
                key={opt.label}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, scale: active ? 0.99 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 30, delay: i * 0.03 }}
                onClick={() => toggle(opt.label)}
                className={`relative flex items-center gap-3 rounded-2xl border px-5 py-4 pr-12 text-left transition-colors ${
                  active
                    ? "border-gray-dark bg-gray-hover"
                    : "border-gray-stroke bg-white hover:bg-gray-hover"
                }`}
              >
                {opt.Icon ? (
                  <opt.Icon size={20} strokeWidth={1.9} className="shrink-0 text-gray-dark" />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-gray-dark">
                    {opt.label}
                  </span>
                  {opt.sublabel ? (
                    <span className="mt-0.5 block text-[13px] text-gray-light">
                      {opt.sublabel}
                    </span>
                  ) : null}
                </span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AnimatePresence>
                    {active ? (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 24 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-dark text-white"
                      >
                        <Check size={13} strokeWidth={3} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <AnimatePresence>
        {enough ? (
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
