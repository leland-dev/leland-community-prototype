import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ContentCardLarge,
  RoundArrow,
  sectionTitle,
  ITEMS,
  COLLECTIONS,
  TOOLS,
  ALL_USE_CASES,
  type Item,
} from "./ProgramHub";
import SeeWhatOthersShipped from "../components/SeeWhatOthersShipped";
import RecommendedBuilds from "../components/RecommendedBuilds";
import { CategoryPicker } from "../components/CategoryPicker";
import { MultiSelectDropdown } from "../components/MultiSelectDropdown";
import { IconChevronDown, IconSearch } from "../components/leland";
import { useSelectedCategory } from "../contexts/SelectedCategoryContext";
import { CATEGORIES } from "../lib/categories";
import imgPrompts from "../assets/img/builds/prompt-library.svg";
import imgTriage from "../assets/img/builds/triage-agent.svg";
import imgMetrics from "../assets/img/builds/metrics-digest.svg";
import pic5 from "../assets/profile photos/pic-5.png";

const RECENTLY_VIEWED = [
  { img: imgPrompts, title: "Prompt library for the ops team: tested prompts to reuse", meta: "32 assets" },
  { img: imgTriage, title: "Build a support ticket triage agent, start to finish", meta: "21 views", author: "Jonas C.", avatar: pic5 },
  { img: imgMetrics, title: "Weekly metrics digest: automate your Monday summary", meta: "55 views", author: "Jonas C.", avatar: pic5 },
  { img: "", title: "Prompting patterns that hold up in production", meta: "55 views", author: "Jonas C.", avatar: pic5 },
];

type Filters = { useCase: string[]; collection: string[]; tool: string[] };

export default function ProgramAltResources() {
  const { selectedCategory, setSelectedCategory } = useSelectedCategory();
  const [filters, setFilters] = useState<Filters>({ useCase: [], collection: [], tool: [] });
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const anyFilter = !!selectedCategory || Object.values(filters).some((v) => v.length > 0) || query !== "";

  // Same filtering + interleave (skills/tutorials mixed, community builds last)
  // as the roadmap's Browse all.
  const results = useMemo(() => {
    const filtered = ITEMS.filter((it) => {
      if (selectedCategory && it.collection !== "Community builds" && !it.categories.includes(selectedCategory)) return false;
      if (filters.useCase.length && !filters.useCase.includes(it.useCase)) return false;
      if (filters.collection.length && !filters.collection.includes(it.collection)) return false;
      if (filters.tool.length && !filters.tool.includes(it.tool)) return false;
      if (query && !`${it.title} ${it.author}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    const tutorials = filtered.filter((it) => it.collection === "Tutorials");
    const skills = filtered.filter((it) => it.collection === "Skills");
    const communityBuilds = filtered.filter((it) => it.collection === "Community builds");
    const mixed: Item[] = [];
    for (let i = 0; i < Math.max(tutorials.length, skills.length); i++) {
      if (skills[i]) mixed.push(skills[i]);
      if (tutorials[i]) mixed.push(tutorials[i]);
    }
    return [...mixed, ...communityBuilds];
  }, [selectedCategory, filters, query]);

  // Shared pill-dropdown trigger style for the Browse all filter row.
  const triggerClass = "flex shrink-0 items-center gap-2 rounded-full border border-gray-stroke bg-white px-4 py-2.5 text-[15px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover";
  const countBadge = (n: number) =>
    n > 0 ? <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gray-dark px-1 text-[11px] font-semibold text-white">{n}</span> : null;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-10 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">Resources</h1>
        <p className="text-[16px] leading-[1.5] text-gray-light">Tutorials, skills, and community builds for the program.</p>
      </div>

      {/* Recommended for you */}
      <RecommendedBuilds title="Recommended for you" />

      {/* Recently viewed */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-stroke bg-white p-6">
        <div className="flex items-center gap-4">
          <p className="flex-1 text-[12px] font-semibold uppercase leading-[1.2] tracking-[1.2px] text-gray-light">Recently viewed</p>
          <div className="flex items-center gap-2">
            <RoundArrow dir="left" disabled />
            <RoundArrow dir="right" disabled />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RECENTLY_VIEWED.map((r) => (
            <div key={r.title} className="flex min-w-0 cursor-pointer items-center gap-3">
              <div className="relative h-14 w-[107px] shrink-0 overflow-hidden rounded-md border border-gray-stroke bg-gray-hover">
                {r.img && <img src={r.img} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex min-w-px flex-1 flex-col gap-1">
                <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{r.title}</p>
                <div className="flex items-center gap-2 text-[12px] leading-[1.35]">
                  {r.author && (
                    <span className="flex items-center gap-1 text-gray-light">
                      <img src={r.avatar} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />
                      {r.author}
                    </span>
                  )}
                  <span className="truncate text-gray-extra-light">{r.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See what others shipped */}
      <SeeWhatOthersShipped />

      {/* Divider above Browse all */}
      <hr className="my-6 border-t border-gray-stroke" />

      {/* Browse all */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className={sectionTitle}>Browse all</h2>
          <p className="text-[16px] leading-[1.3] text-gray-extra-light">412 tutorials, demos and downloadable skills</p>
        </div>

        {/* Filter row ⇄ search bar (animated swap) */}
        <div className="relative min-h-[46px]">
          <AnimatePresence mode="wait" initial={false}>
            {searchActive ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="flex w-full items-center gap-2.5 rounded-full border border-gray-stroke bg-white px-4 py-2.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Escape") setSearchActive(false); }}
                    placeholder="Search resources"
                    className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-dark outline-none placeholder:text-gray-extra-light"
                  />
                  <button type="button" onClick={() => setSearchActive(false)} aria-label="Close search" className="shrink-0 rounded-full p-1 text-gray-light transition-colors hover:bg-black/5 hover:text-gray-dark">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="filters"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-wrap items-center gap-2.5"
              >
                {/* Category — single select */}
                <CategoryPicker
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={CATEGORIES}
                  allLabel="All categories"
                  trigger={({ onClick, ref, open }) => (
                    <button ref={ref} type="button" onClick={onClick} className={triggerClass}>
                      <span>{selectedCategory ?? "Category"}</span>
                      <IconChevronDown className={`size-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  )}
                />
                {/* Use Case — multi select */}
                <MultiSelectDropdown
                  values={filters.useCase}
                  onChange={(v) => setFilters((f) => ({ ...f, useCase: v }))}
                  options={ALL_USE_CASES}
                  searchPlaceholder="Search use case"
                  trigger={({ onClick, ref, open }) => (
                    <button ref={ref} type="button" onClick={onClick} className={triggerClass}>
                      <span>Use Case</span>
                      {countBadge(filters.useCase.length)}
                      <IconChevronDown className={`size-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  )}
                />
                {/* Collection — multi select */}
                <MultiSelectDropdown
                  values={filters.collection}
                  onChange={(v) => setFilters((f) => ({ ...f, collection: v }))}
                  options={COLLECTIONS}
                  searchPlaceholder="Search collection"
                  trigger={({ onClick, ref, open }) => (
                    <button ref={ref} type="button" onClick={onClick} className={triggerClass}>
                      <span>Collection</span>
                      {countBadge(filters.collection.length)}
                      <IconChevronDown className={`size-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  )}
                />
                {/* Tool — multi select */}
                <MultiSelectDropdown
                  values={filters.tool}
                  onChange={(v) => setFilters((f) => ({ ...f, tool: v }))}
                  options={TOOLS}
                  searchPlaceholder="Search tool"
                  trigger={({ onClick, ref, open }) => (
                    <button ref={ref} type="button" onClick={onClick} className={triggerClass}>
                      <span>Tool</span>
                      {countBadge(filters.tool.length)}
                      <IconChevronDown className={`size-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  )}
                />
                {/* Search — opens the full-width search bar */}
                <button type="button" onClick={() => setSearchActive(true)} className={triggerClass}>
                  <IconSearch className="size-4 shrink-0 text-gray-light" />
                  <span className="max-w-[160px] truncate">{query || "Search"}</span>
                </button>
                {anyFilter && (
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory(null); setFilters({ useCase: [], collection: [], tool: [] }); setQuery(""); }}
                    className="shrink-0 px-2 text-[14px] font-semibold text-gray-light transition-colors hover:text-gray-dark"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Full-width results */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-gray-stroke bg-white px-6 py-16 text-center text-[14px] text-gray-light">No resources match these filters.</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((it, i) => <ContentCardLarge key={`${it.title}-${i}`} item={it} />)}
          </div>
        )}
      </section>
    </div>
  );
}
