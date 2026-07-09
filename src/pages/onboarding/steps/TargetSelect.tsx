import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Check, Compass, Plus } from "lucide-react";

import type { Branch } from "../data";
import { BUCKETS, MAX_TARGETS, targetsFor, searchListFor } from "../flowConfig";
import { StepHeading } from "./flowUI";

/* Screen 6 — the target that names their cohort. Multi-select (≤3) schools/
   companies with logos + type-ahead (incl. adding a custom one), or single-
   select AI goal. "Exploring" routes to the category-level cohort. */

/* ── logo resolver (org-logos + logos, loaded once by Vite) ── */
const ORG_LOGOS = import.meta.glob("../../../assets/org-logos/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const LOGOS = import.meta.glob("../../../assets/logos/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const LOGO_KEY: Record<string, string> = {
  // companies
  McKinsey: "mckinsey",
  Bain: "bain",
  BCG: "bcg",
  Google: "google",
  "Goldman Sachs": "goldman",
  Coinbase: "coinbase",
  Atlassian: "atlassian",
  Meta: "meta",
  Stripe: "stripe",
  Deloitte: "deloitte",
  Accenture: "accenture",
  "Morgan Stanley": "morgan-stanley",
  "JP Morgan": "goldman",
  // schools
  Harvard: "harvard",
  Stanford: "stanford",
  Wharton: "wharton",
  Kellogg: "kellogg",
  Booth: "booth",
  "MIT Sloan": "mit-sloan",
  MIT: "mit",
  Columbia: "columbia",
  Yale: "yale",
  Princeton: "princeton",
  "UC Berkeley": "berkeley",
  UCLA: "ucla",
  NYU: "nyu-stern",
};

function logoFor(name: string): string | undefined {
  const key = LOGO_KEY[name];
  if (!key) return undefined;
  return ORG_LOGOS[`../../../assets/org-logos/${key}.png`] ?? LOGOS[`../../../assets/logos/${key}.png`];
}

function Logo({ name }: { name: string }) {
  const url = logoFor(name);
  if (!url) return null;
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/[0.06]">
      <img src={url} alt="" className="h-full w-full object-cover" />
    </span>
  );
}

function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () =>
      setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    onResize();
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);
  return inset;
}

export default function TargetSelect({
  branch,
  category,
  initial,
  onCommit,
}: {
  branch: Branch;
  category?: string;
  initial: string[];
  onCommit: (targets: string[]) => void;
}) {
  const cfg = BUCKETS[branch];
  const isAi = cfg.targetMode === "ai-goal";
  const chips = useMemo(() => targetsFor(cfg, category), [cfg, category]);
  const searchList = useMemo(() => searchListFor(cfg), [cfg]);
  const kbInset = useKeyboardInset();

  const [selected, setSelected] = useState<string[]>(initial.slice(0, MAX_TARGETS));
  const [query, setQuery] = useState("");

  const full = selected.length >= MAX_TARGETS;
  const toggle = (t: string) =>
    setSelected((s) =>
      s.includes(t) ? s.filter((x) => x !== t) : full ? s : [...s, t],
    );
  const add = (t: string) => {
    if (!selected.includes(t) && !full) setSelected((s) => [...s, t]);
    setQuery("");
  };

  const q = query.trim();
  const results = useMemo(() => {
    if (!q) return [];
    return searchList
      .filter((s) => s.toLowerCase().includes(q.toLowerCase()) && !selected.includes(s))
      .slice(0, 6);
  }, [q, searchList, selected]);

  // offer to add a school/company that isn't in the list
  const exact =
    !!q &&
    (searchList.some((s) => s.toLowerCase() === q.toLowerCase()) ||
      selected.some((s) => s.toLowerCase() === q.toLowerCase()));
  const showCustom = q.length >= 2 && !exact;

  /* ── AI: multi-select, same card pattern as the category step
        (thin horizontal cards, no icons) + Continue bar ── */
  if (isAi) {
    const toggleGoal = (g: string) =>
      setSelected((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
    return (
      <>
        <div className="flex flex-col pb-28">
          <StepHeading title={cfg.targetQuestion} subtitle="Pick one or more." />
          <div className="flex flex-col gap-2.5">
            {chips.map((g, i) => {
              const active = selected.includes(g);
              return (
                <motion.button
                  key={g}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, scale: active ? 0.99 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                    delay: i * 0.04,
                  }}
                  onClick={() => toggleGoal(g)}
                  className={`relative rounded-2xl border px-5 py-4 pr-12 text-left text-[15px] font-medium transition-colors ${
                    active
                      ? "border-gray-dark bg-gray-hover text-gray-dark"
                      : "border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover"
                  }`}
                >
                  {g}
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

        {/* Continue — bottom-anchored, appears once something is picked */}
        <AnimatePresence>
          {selected.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 mx-auto w-full max-w-[440px] px-6"
            >
              <button
                onClick={() => onCommit(selected)}
                className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
              >
                Continue · {selected.length}
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </>
    );
  }

  /* ── schools / companies: multi-select ≤3 + type-ahead ── */
  // logo chips get pl-1.5 so the logo's left inset matches its top/bottom inset
  const chipClass = (active: boolean, disabled: boolean, hasLogo: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border py-1.5 text-[14px] font-medium transition-colors ${
      hasLogo ? "pl-1.5 pr-4" : "px-4"
    } ${
      active
        ? "border-transparent bg-gray-dark text-white"
        : disabled
          ? "border-gray-stroke bg-white text-gray-xlight"
          : "border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover"
    }`;

  return (
    <div className="flex flex-col pb-24">
      <StepHeading
        title={cfg.targetQuestion}
        subtitle={`Pick up to ${MAX_TARGETS}. Not sure? That's fine too.`}
      />

      {/* exploring — first class */}
      <button
        onClick={() => onCommit([])}
        className="mb-4 flex items-center gap-3 rounded-2xl border border-dashed border-gray-stroke bg-white px-4 py-3 text-left transition-colors hover:bg-gray-hover"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.05] text-gray-dark">
          <Compass size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-gray-dark">
            Not sure yet / Exploring
          </span>
          <span className="block text-[12.5px] text-gray-light">
            We'll drop you into the wider community
          </span>
        </span>
      </button>

      {/* search */}
      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-xlight"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          enterKeyHint="done"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (results.length > 0) add(results[0]);
            else if (showCustom) add(q);
          }}
          placeholder={cfg.targetSearchPlaceholder}
          className="w-full rounded-xl border border-gray-stroke bg-white py-3 pl-10 pr-4 text-[15px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(q ? results : chips).map((t) => {
          const active = selected.includes(t);
          const hasLogo = !!logoFor(t);
          return (
            <button
              key={t}
              onClick={() => (q ? add(t) : toggle(t))}
              disabled={!active && full}
              className={chipClass(active, !active && full, hasLogo)}
            >
              <Logo name={t} />
              {t}
            </button>
          );
        })}
        {/* custom "Add" chip when the typed value isn't in the list */}
        {q && showCustom ? (
          <button
            onClick={() => add(q)}
            disabled={full}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-stroke py-1.5 pl-3 pr-4 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover disabled:opacity-40"
          >
            <Plus size={15} className="text-gray-light" />
            Add “{q}”
          </button>
        ) : null}
        {q && results.length === 0 && !showCustom ? (
          <p className="py-1.5 text-[14px] text-gray-light">No matches</p>
        ) : null}
      </div>

      {/* selected pills */}
      {selected.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {selected.map((t) => (
            <button
              key={t}
              onClick={() => toggle(t)}
              className="flex items-center gap-1.5 rounded-full bg-gray-dark px-3 py-1.5 text-[14px] font-medium text-white"
            >
              {t}
              <X size={14} />
            </button>
          ))}
        </div>
      ) : null}

      {/* continue bar — rides above the keyboard */}
      {selected.length > 0 ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-[440px] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          style={{ transform: `translateY(-${kbInset}px)` }}
        >
          <button
            onClick={() => onCommit(selected)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-dark py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
          >
            <Check size={17} />
            Continue · {selected.length}
          </button>
        </div>
      ) : null}
    </div>
  );
}
