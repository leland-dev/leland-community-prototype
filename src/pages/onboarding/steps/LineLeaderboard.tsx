import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Share } from "lucide-react";

import { MEMBER_AVATARS } from "../mockData";
import { SPOT_LADDER } from "./WaitlistGate";

/* ─────────────────────────────────────────────────────────────────────────
 * LineLeaderboard (v4) — everyone in line, numbered. Faces and names are
 * blurred; the affiliation (school / company) is the one thing you can see.
 * That's the mystique: you can tell *who kind of* is ahead of you, not who.
 * ──────────────────────────────────────────────────────────────────────── */

const AFFILIATIONS = [
  "Stanford · Class of '26", "McKinsey · Associate", "Harvard · Class of '27", "Google · PM",
  "Wharton · MBA '26", "Goldman Sachs · Analyst", "MIT · Class of '28", "Bain · Consultant",
  "Yale · Class of '25", "Meta · Engineer", "Kellogg · MBA '27", "Stripe · PM",
  "Columbia · Class of '27", "BCG · Associate", "UC Berkeley · Class of '26", "OpenAI · Research",
  "Princeton · Class of '28", "Morgan Stanley · Analyst", "Duke · Class of '26", "Sequoia · Analyst",
  "NYU Stern · MBA '26", "Deloitte · Consultant", "UCLA · Class of '27", "Amazon · PM",
  "Booth · MBA '27", "JP Morgan · Analyst", "Georgetown · Class of '26", "Microsoft · Engineer",
];
const FIRST = ["Maya", "Sean", "April", "Daniel", "Priya", "Leo", "Nora", "Ravi", "Chloe", "Marcus", "Ivy", "Tomás"];
const LAST = ["Chen", "Park", "Ross", "Kim", "Shah", "Martin", "Klein", "Patel", "Bennett", "Lee", "Okafor", "Silva"];

type LineRow = { pos: number; name: string; aff: string; avatar?: string };

function row(pos: number): LineRow {
  return {
    pos,
    name: `${FIRST[pos % FIRST.length]} ${LAST[(pos * 7) % LAST.length]}`,
    aff: AFFILIATIONS[(pos * 13) % AFFILIATIONS.length],
    avatar: MEMBER_AVATARS[pos % MEMBER_AVATARS.length],
  };
}

export default function LineLeaderboard({
  sent,
  you,
  onBack,
  onInvite,
}: {
  sent: number;
  you: { name: string; aff: string; avatar?: string };
  onBack: () => void;
  onInvite: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const spot = SPOT_LADDER[Math.min(sent, 3)];
  const front = spot === 1;

  // top of the line, a gap, then the rows around you
  const rows = useMemo(() => {
    const top = [1, 2, 3, 4, 5, 6].filter((p) => p !== spot).map(row);
    const around = [spot - 2, spot - 1, spot + 1, spot + 2, spot + 3].filter((p) => p > 6).map(row);
    return { top, around };
  }, [spot]);

  const Row = ({ r, blurred = true, highlight = false, delay = 0 }: { r: LineRow; blurred?: boolean; highlight?: boolean; delay?: number }) => (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.32, 0.72, 0, 1] }}
      className={`flex items-center gap-3 px-4 py-3 ${highlight ? "rounded-2xl bg-gray-dark text-white" : ""}`}
    >
      <span className={`w-9 shrink-0 font-serif text-[18px] tabular-nums ${highlight ? "text-yellow" : "text-gray-dark"}`}>
        {r.pos}
      </span>
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-hover">
        {r.avatar ? (
          <img src={r.avatar} alt="" className={`h-full w-full object-cover ${blurred ? "blur-[5px] scale-110" : ""}`} />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[14.5px] font-medium ${blurred ? "select-none blur-[4px]" : ""} ${highlight ? "text-white" : "text-gray-dark"}`}>
          {r.name}
        </span>
        <span className={`block truncate text-[12.5px] ${highlight ? "text-white/65" : "text-gray-light"}`}>{r.aff}</span>
      </span>
      {highlight ? (
        <span className="rounded-full bg-yellow px-2.5 py-1 text-[11px] font-semibold text-gray-dark">You</span>
      ) : null}
    </motion.div>
  );

  const youRow: LineRow = { pos: spot, name: you.name, aff: you.aff, avatar: you.avatar };

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex shrink-0 items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-1">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark hover:bg-black/[0.05]" aria-label="Back">
          <ArrowLeft size={19} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-36 pt-1">
        <h2 className="font-serif text-[28px] leading-[1.12] text-gray-dark">The line</h2>
        <p className="mt-1.5 text-[14.5px] text-gray-light">
          {front ? "You're first through when the doors open." : `${spot - 1} ahead of you. Every invite moves you up.`}
        </p>

        <div className="mt-5 flex flex-col">
          {front ? <Row r={youRow} blurred={false} highlight /> : null}
          {rows.top.map((r, i) => (
            <Row key={r.pos} r={r} delay={0.05 + i * 0.04} />
          ))}
          {!front ? (
            <>
              <div className="flex items-center gap-3 py-2 pl-4 text-[13px] text-gray-xlight">
                <span className="w-9 text-center tracking-[0.2em]">···</span>
                {spot - 7 > 0 ? `${spot - 7} more` : ""}
              </div>
              {rows.around
                .filter((r) => r.pos < spot)
                .map((r, i) => (
                  <Row key={r.pos} r={r} delay={0.3 + i * 0.04} />
                ))}
              <Row r={youRow} blurred={false} highlight delay={0.4} />
              {rows.around
                .filter((r) => r.pos > spot)
                .map((r, i) => (
                  <Row key={r.pos} r={r} delay={0.45 + i * 0.04} />
                ))}
            </>
          ) : null}
        </div>
      </div>

      {!front ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1rem)] pt-8">
          <button
            onClick={onInvite}
            className="pointer-events-auto flex h-14 w-full items-center justify-center gap-2 rounded-full bg-yellow text-[15px] font-semibold text-gray-dark transition-colors hover:bg-[#F3C948]"
          >
            <Share size={17} />
            Invite to move up · {sent}/3
          </button>
        </div>
      ) : null}
    </div>
  );
}
