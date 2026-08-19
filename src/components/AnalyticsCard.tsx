import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

// "Analytics" roll-up card — a header + a row of metrics, each a small gray
// label, a large value, and a mini area-chart. Mirrors the coach Dashboard /
// category-management analytics cards. Pass the metrics (label + value +
// sparkline data) so it can be reused across pages.
export type AnalyticsMetric = { key: string; label: string; value: string; data: number[] };

const SPARK_COLOR = "#94370C";

function Sparkline({ id, data }: { id: string; data: number[] }) {
  const w = 100;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const line = data
    .map((v, i) => `${((i / (data.length - 1)) * w).toFixed(2)},${(h - ((v - min) / range) * h).toFixed(2)}`)
    .join(" ");
  const gid = `spark-${id}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-24">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SPARK_COLOR} stopOpacity="0.22" />
          <stop offset="100%" stopColor={SPARK_COLOR} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={SPARK_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const linkClass = "text-[15px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70";

export default function AnalyticsCard({ metrics, seeAllTo, title = "Analytics", collapsible = false, className = "" }: { metrics: AnalyticsMetric[]; seeAllTo?: string; title?: string; collapsible?: boolean; className?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className={`rounded-[20px] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-[19px] font-semibold leading-tight text-gray-dark">{title}</h2>
        {collapsible ? (
          <button onClick={() => setCollapsed((c) => !c)} className={linkClass}>{collapsed ? "Expand" : "Collapse"}</button>
        ) : seeAllTo ? (
          <Link to={seeAllTo} className={linkClass}>See all</Link>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="stats"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid grid-cols-3 gap-x-6">
              {metrics.map((m, i) => (
                <div key={m.key} className={`text-center ${i > 0 ? "border-l border-[#222222]/10 pl-6" : ""}`}>
                  <p className="text-[13px] font-semibold leading-tight text-gray-extra-light">{m.label}</p>
                  <p className="mt-3 text-[24px] font-bold leading-none text-gray-dark">{m.value}</p>
                  <div className="mt-4 flex justify-center">
                    <Sparkline id={m.key} data={m.data} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
