import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, DoorOpen, Ticket, MessagesSquare } from "lucide-react";

import { COACH_FACES } from "../mockData";
import { REVIEW_STATS } from "../data";
import { SharpStar } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * AccessExplainer (v4) — "How access works." Leads with the human side of
 * the value prop: a real marketplace of vetted experts sharing advice
 * directly. Then the rules: experts are seated first, members come in waves
 * by school, peers move you up.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.32, 0.72, 0, 1] as const;

export default function AccessExplainer({
  school,
  category,
  orgs,
  expertHeadline,
  onContinue,
}: {
  school: string;
  category: string;
  orgs: string[];
  /** "200+ consulting experts" */
  expertHeadline: string;
  onContinue: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const short = school.replace(/^University of /, "").replace(/ University$/, "").replace(/ College$/, "");
  const cat = category.toLowerCase();

  const ROWS = [
    {
      Icon: MessagesSquare,
      title: "Real people, not content",
      body: `${expertHeadline} — current and former people at ${orgs[0]}, ${orgs[1]}, and ${orgs[2]} — share advice with you directly. Every one is vetted and reviewed.`,
    },
    {
      Icon: DoorOpen,
      title: "Experts are seated first",
      body: `We fill each ${cat} cohort with experts before we open it to members, so every member gets real attention. ${short} is in the first wave.`,
    },
    {
      Icon: Ticket,
      title: "Peers move you up",
      body: `Every ${short} peer you bring moves you forward in line. Three unlocks your access.`,
    },
  ];

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32 pt-[max(2rem,env(safe-area-inset-top))]">
        <motion.h2 {...rise(0)} className="text-balance font-serif text-[30px] leading-[1.12] text-gray-dark">
          How access works
        </motion.h2>
        <motion.p {...rise(0.08)} className="mt-2 text-[15px] leading-relaxed text-gray-light">
          Leland is a marketplace of real experts — people who've done exactly what you're trying to do.
        </motion.p>

        {/* proof strip: expert faces + rating */}
        <motion.div {...rise(0.2)} className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-4 py-3">
          <div className="flex -space-x-2.5">
            {COACH_FACES.slice(0, 5).map((f, i) => (
              <img
                key={i}
                src={f.photo}
                alt=""
                className="h-9 w-9 rounded-full object-cover object-top ring-2 ring-white"
              />
            ))}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[14px] font-semibold text-gray-dark">
              <SharpStar size={13} className="text-yellow" />
              {REVIEW_STATS.avg.toFixed(2)}
              <span className="font-normal text-gray-light">· {REVIEW_STATS.reviews.toLocaleString()} reviews</span>
            </p>
            <p className="text-[12.5px] text-gray-light">from members coached 1:1</p>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-6">
          {ROWS.map((r, i) => (
            <motion.div key={r.title} {...rise(0.32 + i * 0.16)} className="flex gap-4">
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <motion.button
          {...rise(0.9)}
          onClick={onContinue}
          className="pointer-events-auto flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
        >
          See my spot
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
