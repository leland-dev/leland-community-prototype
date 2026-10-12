import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { TOPIC_BUCKETS, ALL_TOPICS, MY_TOPICS } from "../data/topics";
import topicHash from "../assets/img/topic-hash.svg";

// Asset svgs are pre-colored, so a plain <img> can't be tinted — a mask + solid
// background recolors the hash to gray-extra-light (#767676).
const topicIconStyle: CSSProperties = {
  backgroundColor: "#767676",
  maskImage: `url("${topicHash}")`,
  WebkitMaskImage: `url("${topicHash}")`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
};

/**
 * TopicPicker — tag a post with topics from Leland's fixed category taxonomy.
 *
 * Topics are NOT free-form: posters select from `src/data/topics.ts`. The flow
 * is personalized — the signed-in user's known interests (MY_TOPICS) surface
 * inline as one-tap chips, and lead the "Browse topics" picker under a
 * "Suggested for you" group — because every Leland user has at least one
 * category we know they care about. Search filters the set; it never creates a
 * new topic.
 */
export function TopicPicker({
  value,
  onChange,
  max = 5,
  dropUp = false,
  onOpenChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  // Open the picker dropdown upward (above the button) — used when the picker
  // sits near the bottom of a modal and a downward menu would overflow.
  dropUp?: boolean;
  // Notified when the dropdown opens/closes, so a clipping ancestor can go
  // overflow-visible only while the menu needs to escape.
  onOpenChange?: (open: boolean) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { onOpenChange?.(pickerOpen); }, [pickerOpen, onOpenChange]);

  const atLimit = value.length >= max;
  const has = (t: string) => value.some(h => h.toLowerCase() === t.toLowerCase());
  const toggle = (topic: string) => {
    if (has(topic)) onChange(value.filter(h => h.toLowerCase() !== topic.toLowerCase()));
    else if (value.length < max) onChange([...value, topic]);
  };
  const remove = (tag: string) => onChange(value.filter(t => t !== tag));

  // Two fixed suggested topics (the user's known interests). Selected topics are
  // ordered first (in selection order), then any still-unselected suggestions —
  // so activating a chip pulls it to the front. Chips use layout animation, so
  // the reorder eases rather than jumping.
  const suggestions = MY_TOPICS.slice(0, 2);
  const ordered = [...value, ...suggestions.filter(s => !has(s))];

  // Picker groups: "Suggested for you" first, then the full taxonomy. A search
  // query collapses everything to one flat filtered list.
  const query = search.trim().toLowerCase();
  const groups: { bucket: string; topics: string[] }[] = query
    ? [{ bucket: "Results", topics: ALL_TOPICS.filter(t => t.toLowerCase().includes(query)) }]
    : [
        { bucket: "Suggested for you", topics: MY_TOPICS },
        ...TOPIC_BUCKETS.filter(b => b.bucket !== "Suggested" && b.topics.length > 0),
      ];

  // One keyed element per topic so toggling restyles in place and a reorder
  // animates (same instance moving) rather than unmount/remount. Selected =
  // white bordered chip with a remove X; unselected = muted, tap to activate.
  const chip = (tag: string) => {
    const selected = has(tag);
    return (
      <motion.div
        key={tag}
        layout
        transition={{ layout: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } }}
        onClick={selected ? undefined : () => toggle(tag)}
        className={`inline-flex items-center gap-1.5 rounded-full py-1.5 text-[14px] ${
          selected
            ? "border border-gray-stroke bg-white pl-3 pr-2.5 font-semibold text-gray-dark shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
            : "cursor-pointer bg-gray-hover px-3 font-medium text-gray-extra-light transition-colors hover:text-gray-light"
        }`}
      >
        <span aria-hidden className="h-4 w-4 shrink-0" style={topicIconStyle} />
        {tag}
        {selected ? (
          <button
            onClick={() => remove(tag)}
            aria-label={`Remove ${tag}`}
            className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center text-gray-extra-light transition-colors hover:text-gray-dark"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div>
      <p className="mb-2 text-[14px] font-medium text-gray-extra-light">Add topics to your post:</p>
      <div className="flex flex-wrap items-center gap-2">
      {/* Selected topics first, then unselected suggestions */}
      {ordered.map(chip)}

      {/* Browse the full taxonomy — simple + button, always at the end */}
      <motion.div layout transition={{ layout: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } }} className="relative">
        <button
          onClick={() => { setPickerOpen(o => !o); setSearch(""); setTimeout(() => searchRef.current?.focus(), 0); }}
          aria-label="Add topics"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-gray-extra-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>

        {pickerOpen ? (
            <>
              <div className="fixed inset-0 z-[65]" onMouseDown={() => setPickerOpen(false)} />
              <div className={`absolute right-0 z-[66] flex max-h-[340px] w-[300px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-lg ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
                {/* Search filters the fixed set — it never creates a new topic */}
                <div className="border-b border-gray-stroke p-2">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-hover px-2.5 py-1.5">
                    <svg className="h-4 w-4 shrink-0 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search topics"
                      className="w-full bg-transparent text-[13px] text-gray-dark outline-none placeholder:text-gray-light"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto py-1">
                  {groups.map(group => group.topics.length ? (
                    <div key={group.bucket} className="pb-1">
                      <p className="px-3 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-gray-light">{group.bucket}</p>
                      {group.topics.map(topic => {
                        const selected = has(topic);
                        const disabled = !selected && atLimit;
                        return (
                          <button
                            key={`${group.bucket}-${topic}`}
                            onClick={() => toggle(topic)}
                            disabled={disabled}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium transition-colors ${disabled ? "cursor-not-allowed text-gray-light/60" : "cursor-pointer text-gray-dark hover:bg-gray-hover"}`}
                          >
                            <span aria-hidden className="h-[14px] w-[14px] shrink-0" style={topicIconStyle} />
                            <span className="flex-1">{topic}</span>
                            {selected ? (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2E8B6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null)}
                  {groups.every(g => g.topics.length === 0) ? (
                    <p className="px-3 py-6 text-center text-[13px] text-gray-light">No topics match “{search.trim()}”.</p>
                  ) : null}
                </div>
                <div className="border-t border-gray-stroke px-3 py-2 text-[11px] text-gray-light">
                  {value.length}/{max} topics · they map to Leland categories
                </div>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
