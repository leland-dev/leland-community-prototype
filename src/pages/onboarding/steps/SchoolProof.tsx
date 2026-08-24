import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { COACH_FACES } from "../mockData";
import { memberCountFor, expertCountFor } from "../universities";
import { universityLogo } from "./UniversitySearch";
import type { Resonance } from "../resonanceV4";

/* ─────────────────────────────────────────────────────────────────────────
 * SchoolProof (v4) — the payoff for the credential. "{School} is on Leland."
 * They just proved they belong; show them the room it unlocked. Narrative
 * beat — no dots. Callers skip it for custom (unverified) schools.
 * ──────────────────────────────────────────────────────────────────────── */

function shortName(school: string): string {
  return school
    .replace(/^University of /, "")
    .replace(/ University$/, "")
    .replace(/ College$/, "");
}

export default function SchoolProof({
  school,
  logoKey,
  resonance,
  onContinue,
}: {
  school: string;
  logoKey?: string;
  resonance: Resonance;
  onContinue: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const logo = universityLogo(logoKey);
  const members = memberCountFor(school);
  const experts = expertCountFor(school);
  const short = shortName(school);
  const orgs = resonance.orgs.slice(0, 3);
  const alumni = [
    { face: COACH_FACES[0], year: "'19", org: orgs[0] },
    { face: COACH_FACES[2], year: "'22", org: orgs[1] },
    { face: COACH_FACES[4], year: "'17", org: orgs[2] },
  ];

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-32 pt-6 text-center">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/[0.06]"
        >
          {logo ? (
            <img src={logo} alt="" className="h-full w-full object-contain p-3" />
          ) : (
            <span className="font-serif text-[36px] text-gray-dark">{school.charAt(0)}</span>
          )}
        </motion.div>

        <motion.h2 {...rise(0.15)} className="mt-6 text-balance font-serif text-[30px] leading-[1.12] text-gray-dark md:text-[34px]">
          {short} is on Leland.
        </motion.h2>
        <motion.p {...rise(0.25)} className="mt-3 max-w-[330px] text-[15px] leading-relaxed text-gray-light">
          <span className="font-semibold text-gray-dark">{members} members</span> and{" "}
          <span className="font-semibold text-gray-dark">{experts} experts</span> from {short} are already here —
          including people now at {orgs[0]} and {orgs[1]}.
        </motion.p>

        <motion.div {...rise(0.38)} className="mt-8 flex w-full flex-col gap-2.5">
          {alumni.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-4 py-3 text-left shadow-card"
            >
              <img src={a.face.photo} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover object-top" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-gray-dark">
                  {short} {a.year}
                </span>
                <span className="block text-[13px] text-gray-light">
                  → now at {a.org}
                </span>
              </span>
              <span className="rounded-full bg-gray-hover px-2.5 py-1 text-[11.5px] font-medium text-gray-dark">
                Expert
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <motion.button
          {...rise(0.5)}
          onClick={onContinue}
          className="pointer-events-auto flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
        >
          Continue
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
