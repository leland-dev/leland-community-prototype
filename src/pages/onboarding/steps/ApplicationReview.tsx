import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { BellRing, Check, Loader2, X } from "lucide-react";

import mark from "../../../assets/leland-logos/leland-mark.svg";
import type { GradYear } from "./UniversitySearch";

/* ─────────────────────────────────────────────────────────────────────────
 * ApplicationReview (v4) — the twist. They thought they were onboarding;
 * they were applying. Checks resolve one at a time (verification theatre),
 * the last one holds a beat, then the admission pass drops in.
 *
 * Tone: calm, institutional. We keep the community small on purpose.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;

export type ReviewInput = {
  school: string;
  logoKey?: string;
  gradYear: GradYear;
  category: string;
  expertHeadline: string; // "200+ consulting experts"
  name?: string;
};

function shortName(school: string): string {
  return school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "");
}

export default function ApplicationReview({ input, onContinue }: { input: ReviewInput; onContinue: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const short = shortName(input.school);

  const CHECKS = [
    `Verifying ${short} affiliation`,
    `Matching against ${input.expertHeadline}`,
    `Assessing fit for the ${input.category} cohort`,
    "Determining application strength",
  ];

  // 0..CHECKS.length = number of checks resolved; then the gate takes over
  const [done, setDone] = useState(0);
  // pre-permission ask, shown as the review wraps (only if not already decided)
  const [askNotify, setAskNotify] = useState(false);
  const [toast, setToast] = useState(true);

  const finishReview = useCallback(() => {
    const undecided =
      typeof window !== "undefined" && "Notification" in window && Notification.permission === "default";
    if (undecided) setAskNotify(true);
    else onContinue();
  }, [onContinue]);

  useEffect(() => {
    const speed = reduced ? 0.25 : 1;
    // the last check deliberately hangs — that's where the tension lives
    const delays = [1100, 2100, 3100, 5200].map((d) => d * speed);
    const ts = delays.map((d, i) => window.setTimeout(() => setDone(i + 1), d));
    const tApproved = window.setTimeout(finishReview, (5200 + 900) * speed);
    return () => {
      ts.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(tApproved);
    };
  }, [reduced, finishReview]);

  const answerNotify = async (yes: boolean) => {
    setAskNotify(false);
    if (yes) {
      try {
        await Notification.requestPermission();
      } catch {
        /* unsupported */
      }
    }
    onContinue();
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* confirmation of the notify choice, system-toast style */}
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.5, ease: EASE } }}
            exit={{ opacity: 0, y: -14, transition: { duration: 0.25 } }}
            className="absolute inset-x-4 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] z-30 flex items-center gap-2.5 rounded-2xl bg-gray-dark py-3 pl-4 pr-2 text-[13px] font-medium text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
          >
            <BellRing size={14} className="shrink-0" />
            <span className="min-w-0 flex-1">We'll text you the moment the doors open.</span>
            <button
              onClick={() => setToast(false)}
              aria-label="Dismiss"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={15} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex h-full flex-col px-6 pb-10 pt-[max(2rem,env(safe-area-inset-top))]">
            <div className="flex flex-1 flex-col justify-center">
              <motion.img
                src={mark}
                alt=""
                style={{ filter: "brightness(0)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="h-9 w-9"
              />
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                className="mt-6 text-balance font-serif text-[30px] leading-[1.12] text-gray-dark"
              >
                Reviewing your application
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-2 text-[15px] leading-relaxed text-gray-light"
              >
                We keep the community small on purpose. Every member is reviewed before they're admitted.
              </motion.p>

              <ul className="mt-9 flex flex-col gap-4">
                {CHECKS.map((c, i) => {
                  const state = i < done ? "done" : i === done ? "active" : "idle";
                  return (
                    <motion.li
                      key={c}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: state === "idle" ? 0.35 : 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                        <AnimatePresence mode="wait" initial={false}>
                          {state === "done" ? (
                            <motion.span
                              key="done"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 22 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-dark text-white"
                            >
                              <Check size={12} strokeWidth={3} />
                            </motion.span>
                          ) : state === "active" ? (
                            <motion.span key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <Loader2 size={18} className="animate-spin text-gray-dark" />
                            </motion.span>
                          ) : (
                            <span key="idle" className="h-5 w-5 rounded-full border-2 border-gray-stroke" />
                          )}
                        </AnimatePresence>
                      </span>
                      <span className={`text-[15px] font-medium ${state === "idle" ? "text-gray-light" : "text-gray-dark"}`}>
                        {c}
                        {state === "active" && i === CHECKS.length - 1 ? "…" : ""}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center text-[12.5px] text-gray-xlight"
            >
              We admit in cohorts. Not every application is approved.
            </motion.p>
      </div>

      {/* pre-permission ask — iOS-alert style, right as the review wraps */}
      <AnimatePresence>
        {askNotify ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[90] flex items-center justify-center bg-black/40 px-10"
          >
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-[300px] overflow-hidden rounded-2xl bg-white text-center shadow-2xl"
            >
              <div className="px-5 pb-4 pt-5">
                <p className="text-[16px] font-semibold leading-snug text-gray-dark">
                  Do you want to get notified when the waitlist opens?
                </p>
              </div>
              <div className="flex divide-x divide-gray-stroke border-t border-gray-stroke">
                <button
                  onClick={() => answerNotify(false)}
                  className="flex h-12 flex-1 items-center justify-center text-[16px] font-medium text-[#FF3B30] transition-colors hover:bg-gray-hover"
                >
                  No
                </button>
                <button
                  onClick={() => answerNotify(true)}
                  className="flex h-12 flex-1 items-center justify-center text-[16px] font-semibold text-[#0A84FF] transition-colors hover:bg-gray-hover"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
