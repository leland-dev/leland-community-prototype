import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { MEMBER_AVATARS } from "../mockData";

/* ─────────────────────────────────────────────────────────────────────────
 * LineList (v4) — everyone in line, numbered. Faces and names are blurred;
 * the affiliation (school / company) is the one thing you can see. That's
 * the mystique: you can tell *who kind of* is ahead of you, not who.
 * Rendered inline under the fold of the gate screen.
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

export type LineRow = { pos: number; name: string; aff: string; avatar?: string };

function row(pos: number): LineRow {
  return {
    pos,
    name: `${FIRST[pos % FIRST.length]} ${LAST[(pos * 7) % LAST.length]}`,
    aff: AFFILIATIONS[(pos * 13) % AFFILIATIONS.length],
    avatar: MEMBER_AVATARS[pos % MEMBER_AVATARS.length],
  };
}

/* Module-scope so React keeps the same component type across renders — a
   Row declared inside LineList would remount (and replay its entrance) on
   every parent re-render. */
function Row({
  r,
  reduced,
  blurred = true,
  highlight = false,
  delay = 0,
}: {
  r: LineRow;
  reduced: boolean;
  blurred?: boolean;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.32, 0.72, 0, 1] }}
      className={`flex items-center gap-2.5 ${highlight ? "-mx-3 rounded-2xl border border-gray-dark py-3 pl-5 pr-5" : "py-3 pl-2 pr-3"}`}
    >
      <span className="w-8 shrink-0 text-[15px] font-medium tabular-nums text-gray-dark">
        {r.pos}
      </span>
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-hover">
        {r.avatar ? (
          <img src={r.avatar} alt="" className={`h-full w-full object-cover ${blurred ? "scale-110 blur-[5px]" : ""}`} />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[14.5px] font-medium text-gray-dark ${blurred ? "select-none blur-[4px]" : ""}`}>
          {r.name}
        </span>
        <span className="block truncate text-[12.5px] text-gray-light">{r.aff}</span>
      </span>
    </motion.div>
  );
}

export default function LineList({ spot, you }: { spot: number; you: { name: string; aff: string; avatar?: string } }) {
  const reduced = useReducedMotion() ?? false;
  const front = spot === 1;

  // top of the line, a gap, then the rows around you
  const rows = useMemo(() => {
    const top = [1, 2, 3, 4, 5, 6].filter((p) => p !== spot).map(row);
    const around = [spot - 2, spot - 1, spot + 1, spot + 2, spot + 3].filter((p) => p > 6).map(row);
    return { top, around };
  }, [spot]);

  const youRow: LineRow = { pos: spot, name: you.name, aff: you.aff, avatar: you.avatar };

  return (
    <div className="flex flex-col">
      {front ? <Row r={youRow} reduced={reduced} blurred={false} highlight /> : null}
      {rows.top.map((r, i) => (
        <Row key={r.pos} r={r} reduced={reduced} delay={0.05 + i * 0.04} />
      ))}
      {!front ? (
        <>
          <div className="flex items-center gap-2.5 py-2 pl-2 text-[13px] text-gray-xlight">
            <span className="w-8 tracking-[0.2em]">···</span>
            {spot - 7 > 0 ? `${spot - 7} more` : ""}
          </div>
          {rows.around.filter((r) => r.pos < spot).map((r, i) => (
            <Row key={r.pos} r={r} reduced={reduced} delay={0.3 + i * 0.04} />
          ))}
          <Row r={youRow} reduced={reduced} blurred={false} highlight delay={0.4} />
          {rows.around.filter((r) => r.pos > spot).map((r, i) => (
            <Row key={r.pos} r={r} reduced={reduced} delay={0.45 + i * 0.04} />
          ))}
        </>
      ) : null}
    </div>
  );
}
