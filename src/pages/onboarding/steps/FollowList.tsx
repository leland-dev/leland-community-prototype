import { useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, Plus, Search } from "lucide-react";

import { StepHeading } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * FollowList — the shared "suggested follows" step used across v2 for topics,
 * schools & companies, and experts. A fixed header (back + skip, title,
 * search) over a scrollable list of follow rows, with a gated Continue.
 * ──────────────────────────────────────────────────────────────────────── */

export type FollowItem = {
  id: string;
  title: string;
  /** one line of context, or a richer node (rating, stats, etc.) */
  subtitle: ReactNode;
  /** leading element — avatar, logo, or icon. */
  media: ReactNode;
};

export default function FollowList({
  title,
  purpose,
  doneText = "Nice, your feed's taking shape.",
  searchPlaceholder,
  items,
  minFollows = 3,
  ctaVerb = "Follow",
  onContinue,
}: {
  title: string;
  /** completes the sentence "{ctaVerb} N or more to {purpose}." */
  purpose: string;
  doneText?: string;
  searchPlaceholder: string;
  items: FollowItem[];
  minFollows?: number;
  /** verb used in the countdown copy — "Follow" (default) or "Pick". */
  ctaVerb?: string;
  onContinue: () => void;
}) {
  const [followed, setFollowed] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const rows = useMemo(
    () => (q ? items.filter((i) => i.title.toLowerCase().includes(q)) : items),
    [q, items],
  );

  const toggle = (id: string) =>
    setFollowed((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const enough = followed.length >= minFollows;
  const remaining = Math.max(0, minFollows - followed.length);

  return (
    <div className="flex h-full flex-col">
      {/* fixed header: title + search */}
      <div className="shrink-0 px-6 pb-3 pt-2">
        <StepHeading
          title={title}
          subtitle={enough ? doneText : `${ctaVerb} ${remaining} or more to ${purpose}.`}
        />
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-xlight"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-gray-stroke bg-white py-3 pl-10 pr-4 text-[15px] text-gray-dark outline-none placeholder:text-gray-xlight focus:border-gray-dark/40"
          />
        </div>
      </div>

      {/* scrollable list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32">
        <div className="flex flex-col">
          {rows.map((item, i) => {
            const active = followed.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                className="flex items-center gap-3 py-3"
              >
                {item.media}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold text-gray-dark">
                    {item.title}
                  </p>
                  <div className="mt-0.5 text-[13.5px] text-gray-light">
                    {item.subtitle}
                  </div>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  aria-label={active ? `Following ${item.title}` : `Follow ${item.title}`}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    active
                      ? "bg-gray-dark text-white"
                      : "bg-[#f4f4f4] text-gray-dark hover:bg-[#e9e9e9]"
                  }`}
                >
                  {active ? (
                    <Check size={19} strokeWidth={2.75} />
                  ) : (
                    <Plus size={19} strokeWidth={2.75} />
                  )}
                </button>
              </motion.div>
            );
          })}
          {rows.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-gray-light">
              No matches for “{query.trim()}”
            </p>
          ) : null}
        </div>
      </div>

      {/* Continue — bottom-anchored, fades up over the list */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-[calc(max(1.25rem,env(safe-area-inset-bottom))+1.5rem)] pt-8">
        <button
          onClick={onContinue}
          disabled={!enough}
          className={`pointer-events-auto flex h-14 w-full items-center justify-center rounded-full text-[15px] font-medium transition-colors ${
            enough
              ? "bg-gray-dark text-white hover:bg-[#333]"
              : "cursor-not-allowed bg-gray-dark/30 text-white"
          }`}
        >
          {enough ? "Continue" : `${ctaVerb} ${remaining} more`}
        </button>
      </div>
    </div>
  );
}
