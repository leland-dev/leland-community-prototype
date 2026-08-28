import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

import mark from "../../../assets/leland-logos/leland-mark.svg";
import { expertCountFor } from "../universities";
import { universityLogo } from "./UniversitySearch";
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
  const experts = expertCountFor(input.school);
  const classLine =
    input.gradYear === "earlier"
      ? `${short} alum`
      : input.gradYear === "unknown"
        ? short
        : `${short} · Class of ${input.gradYear}`;

  const CHECKS = [
    `Verifying ${short} affiliation`,
    `Matching against ${input.expertHeadline}`,
    `Assessing fit for the ${input.category} cohort`,
    "Determining application strength",
  ];

  // 0..CHECKS.length = number of checks resolved; then "approved"
  const [done, setDone] = useState(0);
  const [phase, setPhase] = useState<"review" | "approved">("review");

  useEffect(() => {
    const speed = reduced ? 0.25 : 1;
    // the last check deliberately hangs — that's where the tension lives
    const delays = [1100, 2100, 3100, 5200].map((d) => d * speed);
    const ts = delays.map((d, i) => window.setTimeout(() => setDone(i + 1), d));
    const tApproved = window.setTimeout(() => setPhase("approved"), (5200 + 900) * speed);
    return () => {
      ts.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(tApproved);
    };
  }, [reduced]);

  const logo = universityLogo(input.logoKey, input.school);

  return (
    <div className="relative flex h-full flex-col">
      <AnimatePresence mode="wait">
        {phase === "review" ? (
          <motion.div
            key="review"
            exit={{ opacity: 0, y: -16, transition: { duration: 0.35 } }}
            className="flex h-full flex-col px-6 pb-10 pt-[max(2rem,env(safe-area-inset-top))]"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="approved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))]"
          >
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <motion.span
                initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 13 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-gray-dark"
              >
                <Check size={28} strokeWidth={3} />
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                className="mt-5 max-w-[15ch] text-balance font-serif text-[32px] leading-[1.1] text-gray-dark"
              >
                You qualify for the Leland community.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-gray-light"
              >
                Your application is approved — you're in the first wave of members we're admitting. Here's your member pass.
              </motion.p>

              {/* admission pass */}
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
                style={{ transformPerspective: 900 }}
                className="mt-8 w-full max-w-[340px] overflow-hidden rounded-[22px] bg-gray-dark text-left text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
              >
                <div className="flex items-center justify-between px-5 pt-5">
                  <img src={mark} alt="Leland" className="h-6 w-6" style={{ filter: "brightness(0) invert(1)" }} />
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
                    <ShieldCheck size={12} /> Pre-approved
                  </span>
                </div>
                <div className="px-5 pb-5 pt-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Member</p>
                  <p className="mt-1 font-serif text-[26px] leading-tight">{input.name ?? "June Allen"}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                      {logo ? (
                        <img src={logo} alt="" className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <span className="text-[15px] font-semibold text-gray-dark">{short.charAt(0)}</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">{classLine}</p>
                      <p className="truncate text-[12.5px] text-white/55">{input.category} cohort</p>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-white/55">Application strength</span>
                      <span className="font-semibold text-yellow">Strong</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "86%" }}
                        transition={{ delay: 1.2, duration: 1.1, ease: EASE }}
                        className="h-full rounded-full bg-yellow"
                      />
                    </div>
                    <p className="mt-2.5 text-[11.5px] text-white/45">
                      {experts} {short} experts already inside
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
              onClick={onContinue}
              className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              Continue
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
