import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import type { Branch } from "../data";
import { coachCountFor } from "../flowConfig";
import { COACH_FACES } from "../mockData";
import { SharpStar } from "./flowUI";

/* Screen 5 — "{N} coaches specialize in exactly this." Robust coach cards
   (photo + company band + rating), a persuasion factoid, bottom-anchored Next.
   Auto-advances after 10s. */

// The org each coach is known for — shown as a band on the card.
const ORGS: Record<Branch, string[]> = {
  "grow-career": ["McKinsey", "Google", "Goldman Sachs", "Bain"],
  "get-into-school": ["Harvard", "Stanford", "Yale", "Wharton"],
  "build-with-ai": ["OpenAI", "Stripe", "Anthropic", "Google"],
};

function factoid(branch: Branch, category?: string): string {
  const c = category ?? "your field";
  if (branch === "get-into-school")
    return `85% of people who got into a top ${c} program did it with a coach.`;
  if (branch === "grow-career")
    return `85% of people who broke into ${c} used a coach to get there.`;
  return `AI Builders who work with a coach are 3× more likely to ship.`;
}

function useCountUp(target: number, ms: number, enabled: boolean) {
  const [v, setV] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) {
      setV(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setV(Math.round(target * (p >= 1 ? 1 : eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, enabled]);
  return v;
}

export default function CoachCount({
  branch,
  category,
  onDone,
}: {
  branch: Branch;
  category?: string;
  onDone: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const target = coachCountFor(category);
  const n = useCountUp(target, 600, !reduced);
  const faces = COACH_FACES.slice(0, 3);
  const orgs = ORGS[branch];

  const done = useRef(false);
  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onDone();
  }, [onDone]);

  // auto-advance after 10s
  useEffect(() => {
    const t = window.setTimeout(finish, 10000);
    return () => window.clearTimeout(t);
  }, [finish]);

  return (
    <>
      <div className="flex min-h-[68vh] flex-col items-center justify-center px-2 pb-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-serif text-[52px] leading-none tabular-nums text-gray-dark"
        >
          {n.toLocaleString()}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-3 max-w-[20ch] text-[18px] leading-snug text-gray-dark"
        >
          coaches specialize in exactly this.
        </motion.p>

        {/* robust coach cards: photo + company band + rating */}
        <div className="mt-8 flex justify-center gap-3">
          {faces.map((f, i) => (
            <motion.div
              key={i}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.3 + i * 0.1 }}
              className="relative aspect-[3/4] w-[106px] shrink-0 overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
            >
              <img
                src={f.photo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              {/* rating chip */}
              <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-gray-dark shadow-sm">
                <SharpStar size={9} className="text-yellow" />
                {f.rating.toFixed(1)}
              </span>
              {/* company band */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-2.5 pb-2.5 pt-7">
                <p className="text-[12px] font-semibold leading-tight text-white">
                  {orgs[i]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* factoid */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + faces.length * 0.1 + 0.2 }}
          className="mt-9 max-w-[30ch] text-[15px] font-medium leading-relaxed text-gray-dark"
        >
          {factoid(branch, category)}
        </motion.p>
      </div>

      {/* Next — bottom-anchored, same position as screen 3 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 mx-auto w-full max-w-[440px] px-6"
      >
        <button
          onClick={finish}
          className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
        >
          Next
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </>
  );
}
