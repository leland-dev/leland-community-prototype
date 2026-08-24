import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, DoorOpen, Users, Ticket } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
 * AccessExplainer (v4) — the curtain. Approved ≠ inside. Three beats: doors
 * open in waves by school · the wave is filling now · peers move you up.
 * Sets up the gate screen so the ask lands as rules, not a gimmick.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;

export default function AccessExplainer({
  school,
  category,
  orgs,
  onContinue,
}: {
  school: string;
  category: string;
  orgs: string[];
  onContinue: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const short = school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "");

  const ROWS = [
    {
      Icon: DoorOpen,
      title: "The doors open in waves",
      body: `We admit by school, in order. ${short} is in the first wave.`,
    },
    {
      Icon: Users,
      title: "The first wave is filling now",
      body: `${category} experts from ${orgs[0]}, ${orgs[1]}, and ${orgs[2]} are already inside. Members are joining behind them.`,
    },
    {
      Icon: Ticket,
      title: "Peers move you up",
      body: `Every ${short} peer you bring moves you forward. Three unlocks your access.`,
    },
  ];

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col justify-center">
        <motion.p {...rise(0)} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-light">
          How access works
        </motion.p>
        <motion.h2 {...rise(0.08)} className="mt-3 text-balance font-serif text-[30px] leading-[1.12] text-gray-dark">
          Approved isn't the same as inside.
        </motion.h2>

        <div className="mt-9 flex flex-col gap-7">
          {ROWS.map((r, i) => (
            <motion.div key={r.title} {...rise(0.3 + i * 0.18)} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-hover text-gray-dark">
                <r.Icon size={20} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[16px] font-semibold text-gray-dark">{r.title}</p>
                <p className="mt-1 text-[14.5px] leading-relaxed text-gray-light">{r.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        {...rise(0.95)}
        onClick={onContinue}
        className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
      >
        See my spot
        <ArrowRight size={16} />
      </motion.button>
    </div>
  );
}
