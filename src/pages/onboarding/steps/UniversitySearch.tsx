import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Check, Plus, X, ChevronDown, Loader2 } from "lucide-react";

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

export type GradYear = number | "earlier" | "unknown" | "none";
export type SchoolAnswer = { school: string; custom: boolean; pioneer: boolean; logoKey?: string; gradYear: GradYear };

const ORG_LOGOS = import.meta.glob("../../../assets/org-logos/*.png", { eager: true, import: "default" }) as Record<string, string>;
const LOGOS = import.meta.glob("../../../assets/logos/*.png", { eager: true, import: "default" }) as Record<string, string>;
/* per-school favicons (128px), fetched for every school in the searchable list */
const SCHOOL_LOGOS = import.meta.glob("../../../assets/school-logos/*.png", { eager: true, import: "default" }) as Record<string, string>;

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function universityLogo(key?: string, name?: string): string | undefined {
  if (key) {
    const curated = LOGOS[`../../../assets/logos/${key}.png`] ?? ORG_LOGOS[`../../../assets/org-logos/${key}.png`];
    if (curated) return curated;
  }
  if (name) return SCHOOL_LOGOS[`../../../assets/school-logos/${slugify(name)}.png`];
  return undefined;
}

/* Resolve a logo for a free-form org/affiliation label ("Analyst, Morgan
   Stanley", "GSB '27", "Meta AI"). Aliases first, then the label and its
   tokens against the logo folders. Returns undefined when we have nothing. */
const ORG_ALIASES: [string, string | undefined, string | undefined][] = [
  ["stanford gsb", "gsb", undefined],
  ["gsb", "gsb", undefined],
  ["hbs", "hbs", undefined],
  ["yls", "yale", undefined],
  ["mit sloan", "mit-sloan", undefined],
  ["sloan", "mit-sloan", undefined],
  ["nyu stern", "nyu-stern", undefined],
  ["stern", "nyu-stern", undefined],
  ["bain capital", "bain", undefined],
  ["meta ai", "meta", undefined],
  ["l.e.k", "lek", undefined],
  ["morgan stanley", "morgan-stanley", undefined],
  ["goldman", "goldman-sachs", undefined],
  ["cmu", undefined, "Carnegie Mellon University"],
  ["carnegie", undefined, "Carnegie Mellon University"],
  ["hopkins", undefined, "Johns Hopkins University"],
  ["duke", undefined, "Duke University"],
  ["brown", undefined, "Brown University"],
  ["georgetown", undefined, "Georgetown University"],
  ["northwestern", undefined, "Northwestern University"],
];

export function logoForOrg(label: string): string | undefined {
  const clean = label.toLowerCase();
  for (const [kw, key, name] of ORG_ALIASES) {
    if (clean.includes(kw)) return universityLogo(key, name);
  }
  const whole = universityLogo(slugify(label), label);
  if (whole) return whole;
  for (const w of clean.split(/[^a-z0-9]+/)) {
    if (w.length < 3) continue;
    const hit = universityLogo(w, w);
    if (hit) return hit;
  }
  return undefined;
}

function Logo({ name, logoKey, size = 40 }: { name: string; logoKey?: string; size?: number }) {
  const url = universityLogo(logoKey, name);
  return url ? (
    <img src={url} alt="" className="shrink-0 object-contain" style={{ width: size, height: size }} />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-hover text-[15px] font-semibold text-gray-dark"
      style={{ width: size, height: size }}
    >
      {name.charAt(0)}
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
    years: [...Array.from({ length: 30 }, (_, i) => 2025 - i), "earlier"],
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
  const [picked, setPicked] = useState<{ name: string; custom: boolean; pioneer: boolean; logoKey?: string; location?: string } | null>(null);
  // optional — no prefill; unset continues as "unknown"
  const [year, setYear] = useState<GradYear | null>(null);
  // the gate moment: "is your school approved to join?" — theatre, but it
  // makes the school feel like the credential it is
  const [checking, setChecking] = useState<"idle" | "checking" | "approved">("idle");
  const reduced = useReducedMotion() ?? false;

  const submit = () => {
    if (!picked || checking !== "idle") return;
    setChecking("checking");
    const t1 = reduced ? 400 : 1500;
    window.setTimeout(() => setChecking("approved"), t1);
    window.setTimeout(
      () => onContinue({ school: picked.name, custom: picked.custom, pioneer: picked.pioneer, logoKey: picked.logoKey, gradYear: year ?? "unknown" }),
      t1 + (reduced ? 300 : 850),
    );
  };

  useEffect(() => {
    if (!picked) inputRef.current?.focus();
  }, [picked]);

  const q = query.trim();
  const results = useMemo<University[]>(() => (q ? searchUniversities(q) : FEATURED_UNIVERSITIES), [q]);
  const exact = results.some((u) => u.name.toLowerCase() === q.toLowerCase());
  const showCustom = q.length >= 2 && !exact;

  const pick = (u: University) => {
    setPicked({ name: u.name, custom: false, pioneer: !!u.pioneer, logoKey: u.key, location: u.location });
    setQuery("");
  };
  const addCustom = () => {
    setPicked({ name: q, custom: true, pioneer: true });
    setQuery("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-6 pt-2">
        <StepHeading title={copy.title} subtitle="This helps us understand more about you." />
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
                        {u.pioneer ? (u.location ?? "University") : `${memberCountFor(u.name)} Leland members · ${expertCountFor(u.name)} experts`}
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

              {!q ? (
                <button
                  onClick={() => inputRef.current?.focus()}
                  className="mx-auto mt-4 flex items-center gap-1.5 text-[14px] font-medium text-gray-dark underline decoration-gray-stroke underline-offset-4 transition-colors hover:decoration-gray-dark"
                >
                  <Search size={14} />
                  Search all schools
                </button>
              ) : null}
            </motion.div>
          ) : (
            <motion.div key="picked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}>
              {/* selected school card */}
              <div className="flex items-center gap-3 rounded-2xl border border-gray-dark bg-gray-hover px-4 py-3">
                <Logo name={picked.name} logoKey={picked.logoKey} size={44} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-medium text-gray-dark">{picked.name}</span>
                  {checking === "checking" ? (
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-black/[0.06] px-2 py-0.5 text-[11.5px] font-medium text-gray-dark">
                      <Loader2 size={12} className="animate-spin" /> Checking eligibility…
                    </span>
                  ) : picked.custom || picked.pioneer ? (
                    <span className="block text-[12.5px] text-gray-light">{picked.location ?? "University"}</span>
                  ) : (
                    <span className="block text-[12.5px] text-gray-light">
                      {memberCountFor(picked.name)} Leland members · {expertCountFor(picked.name)} experts
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    setPicked(null);
                    setChecking("idle");
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-light hover:bg-black/[0.05]"
                  aria-label="Change school"
                >
                  <X size={16} />
                </button>
              </div>


              {/* grad year — revealed inline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="mt-8"
              >
                <h3 className="font-serif text-[22px] leading-tight text-gray-dark">{copy.yearTitle}</h3>
                {/* native select: iOS gets the wheel picker, desktop a dropdown */}
                <div className="relative mt-4">
                  <select
                    value={year === null ? "" : String(year)}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return setYear(null);
                      setYear(v === "earlier" || v === "unknown" || v === "none" ? v : Number(v));
                    }}
                    className={`w-full appearance-none rounded-xl border border-gray-stroke bg-white py-3.5 pl-4 pr-11 text-[17px] font-medium outline-none focus:border-gray-dark/40 ${
                      year === null ? "text-gray-xlight" : "text-gray-dark"
                    }`}
                  >
                    <option value="">Select year (optional)</option>
                    {/* the outs come first — never buried under a long year list */}
                    <option value="unknown">I don't know yet</option>
                    {status === "graduated" ? <option value="none">Didn't graduate</option> : null}
                    {copy.years.map((y) => (
                      <option key={String(y)} value={String(y)}>
                        {y === "earlier" ? "Earlier" : y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-light" />
                </div>
                <AnimatePresence mode="wait">
                  {year === null ? null : <motion.p
                    key={String(year)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 font-serif text-[17px] italic text-gray-light"
                  >
                    {year === "unknown"
                      ? "No rush, you can set this later"
                      : year === "none"
                        ? "All good, your school still counts"
                        : status === "applying"
                          ? `Starting ${year}`
                          : year === "earlier"
                            ? "Alumni"
                            : `Class of ${year}`}
                  </motion.p>}
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
              onClick={submit}
              disabled={checking !== "idle"}
              className={`flex h-14 w-full items-center justify-center gap-2 rounded-full text-[15px] font-medium transition-colors ${
                checking === "approved"
                  ? "bg-yellow text-gray-dark"
                  : "bg-gray-dark text-white hover:bg-[#333] disabled:opacity-90"
              }`}
            >
              {checking === "checking" ? (
                <Loader2 size={20} className="animate-spin" />
              ) : checking === "approved" ? (
                <>
                  <Check size={17} strokeWidth={3} />
                  School approved
                </>
              ) : (
                "Continue"
              )}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
