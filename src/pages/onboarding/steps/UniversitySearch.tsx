import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Check, Plus, X, ShieldCheck } from "lucide-react";

import { StepHeading } from "./flowUI";
import type { StudentStatus } from "./StudentStatusStep";
import {
  FEATURED_UNIVERSITIES,
  searchUniversities,
  memberCountFor,
  expertCountFor,
  type University,
} from "../universities";

/* ─────────────────────────────────────────────────────────────────────────
 * UniversitySearch (v4) — the credential. Type-ahead over the university
 * list; picking one reveals the grad-year pills inline. Schools we don't
 * know can be added, flagged "Pending verification" — the door stays open
 * but it's clear you come in through a school. No Skip on this step.
 * ──────────────────────────────────────────────────────────────────────── */

export type GradYear = number | "earlier";
export type SchoolAnswer = { school: string; custom: boolean; logoKey?: string; gradYear: GradYear };

const ORG_LOGOS = import.meta.glob("../../../assets/org-logos/*.png", { eager: true, import: "default" }) as Record<string, string>;
const LOGOS = import.meta.glob("../../../assets/logos/*.png", { eager: true, import: "default" }) as Record<string, string>;

export function universityLogo(key?: string): string | undefined {
  if (!key) return undefined;
  return LOGOS[`../../../assets/logos/${key}.png`] ?? ORG_LOGOS[`../../../assets/org-logos/${key}.png`];
}

function Logo({ name, logoKey, size = 40 }: { name: string; logoKey?: string; size?: number }) {
  const url = universityLogo(logoKey);
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]"
      style={{ width: size, height: size }}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-contain p-1" />
      ) : (
        <span className="text-[15px] font-semibold text-gray-dark">{name.charAt(0)}</span>
      )}
    </span>
  );
}

const COPY: Record<StudentStatus, { title: string; yearTitle: string; years: GradYear[]; defaultYear: GradYear }> = {
  enrolled: {
    title: "Which university?",
    yearTitle: "When do you graduate?",
    years: [2026, 2027, 2028, 2029, 2030, 2031],
    defaultYear: 2027,
  },
  graduated: {
    title: "Where did you go to school?",
    yearTitle: "When did you graduate?",
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, "earlier"],
    defaultYear: 2023,
  },
  applying: {
    title: "Where are you studying now?",
    yearTitle: "Expected start",
    years: [2026, 2027, 2028],
    defaultYear: 2026,
  },
};

export default function UniversitySearch({
  status,
  onContinue,
}: {
  status: StudentStatus;
  onContinue: (a: SchoolAnswer) => void;
}) {
  const copy = COPY[status];
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<{ name: string; custom: boolean; logoKey?: string } | null>(null);
  const [year, setYear] = useState<GradYear>(copy.defaultYear);

  useEffect(() => {
    if (!picked) inputRef.current?.focus();
  }, [picked]);

  const q = query.trim();
  const results = useMemo<University[]>(() => (q ? searchUniversities(q) : FEATURED_UNIVERSITIES), [q]);
  const exact = results.some((u) => u.name.toLowerCase() === q.toLowerCase());
  const showCustom = q.length >= 2 && !exact;

  const pick = (u: University) => {
    setPicked({ name: u.name, custom: false, logoKey: u.key });
    setQuery("");
  };
  const addCustom = () => {
    setPicked({ name: q, custom: true });
    setQuery("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-6 pt-2">
        <StepHeading title={copy.title} subtitle="Members join through their school. Search yours." />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-36">
        <AnimatePresence mode="wait" initial={false}>
          {!picked ? (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="relative mb-3">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-xlight" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  enterKeyHint="done"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    if (q && results.length > 0) pick(results[0]);
                    else if (showCustom) addCustom();
                  }}
                  placeholder="Search any university"
                  className="w-full rounded-xl border border-gray-stroke bg-white py-3 pl-10 pr-4 text-[15px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
                />
              </div>

              <div className="flex flex-col gap-2">
                {results.map((u, i) => (
                  <motion.button
                    key={u.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    onClick={() => pick(u)}
                    className="flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-4 py-3 text-left transition-colors hover:bg-gray-hover"
                  >
                    <Logo name={u.name} logoKey={u.key} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-gray-dark">{u.name}</span>
                      <span className="block text-[12.5px] text-gray-light">
                        {memberCountFor(u.name)} Leland members · {expertCountFor(u.name)} experts
                      </span>
                    </span>
                  </motion.button>
                ))}
                {showCustom ? (
                  <button
                    onClick={addCustom}
                    className="flex items-center gap-3 rounded-2xl border border-dashed border-gray-stroke bg-white px-4 py-3 text-left transition-colors hover:bg-gray-hover"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.05] text-gray-light">
                      <Plus size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-gray-dark">Don't see your school?</span>
                      <span className="block truncate text-[12.5px] text-gray-light">Add “{q}”</span>
                    </span>
                  </button>
                ) : null}
                {q && results.length === 0 && !showCustom ? (
                  <p className="py-2 text-[14px] text-gray-light">No matches</p>
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.div key="picked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}>
              {/* selected school card */}
              <div className="flex items-center gap-3 rounded-2xl border border-gray-dark bg-gray-hover px-4 py-3">
                <Logo name={picked.name} logoKey={picked.logoKey} size={44} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-medium text-gray-dark">{picked.name}</span>
                  {picked.custom ? (
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-yellow/40 px-2 py-0.5 text-[11.5px] font-medium text-gray-dark">
                      <ShieldCheck size={12} /> Pending verification
                    </span>
                  ) : (
                    <span className="block text-[12.5px] text-gray-light">
                      {memberCountFor(picked.name)} Leland members · {expertCountFor(picked.name)} experts
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setPicked(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-light hover:bg-black/[0.05]"
                  aria-label="Change school"
                >
                  <X size={16} />
                </button>
              </div>
              {picked.custom ? (
                <p className="mt-2 text-[13px] text-gray-light">
                  We verify new schools within a day. You can keep going.
                </p>
              ) : null}

              {/* grad year — revealed inline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="mt-8"
              >
                <h3 className="font-serif text-[22px] leading-tight text-gray-dark">{copy.yearTitle}</h3>
                <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none]">
                  {copy.years.map((y) => {
                    const on = y === year;
                    return (
                      <button
                        key={String(y)}
                        onClick={() => setYear(y)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-[15px] font-medium transition-colors ${
                          on ? "border-transparent bg-gray-dark text-white" : "border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover"
                        }`}
                      >
                        {y === "earlier" ? "Earlier" : y}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={String(year)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 font-serif text-[17px] italic text-gray-light"
                  >
                    {status === "applying"
                      ? `Starting ${year}`
                      : year === "earlier"
                        ? "Alumni"
                        : `Class of ${year}`}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {picked ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+1.5rem)] z-20 mx-auto w-full max-w-[440px] px-6"
          >
            <button
              onClick={() => onContinue({ school: picked.name, custom: picked.custom, logoKey: picked.logoKey, gradYear: year })}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              <Check size={17} />
              Continue
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
