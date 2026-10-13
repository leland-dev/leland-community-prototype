import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { bucketCategories, categoryBuckets, categorySubcategories } from "./BrowseMenu";

// A category picker for the add-team-members dialog. It uses the same categories as the Browse
// menu (bucket > category > subcategory): drill down through the levels, or search to jump
// straight to a match. The value is the category name, or "Category › Subcategory".

const rowCls = "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-[9px] text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5";
const PANEL_W = 320;
const PANEL_H = 360;

type View = { level: 1 } | { level: 2; bucket: string } | { level: 3; category: string };

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-xlight" aria-hidden>
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden><polyline points="3 8.5 6.5 12 13 4.5" /></svg>
);

export function CoachingCategoryPicker({ value, onChange, emptyLabel = "Let them choose" }: { value: string; onChange: (v: string) => void; emptyLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ level: 1 });
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Everything searchable: each category once (with the bucket it first appears in), plus subcategories.
  const entries = useMemo(() => {
    const seen = new Set<string>();
    const out: { value: string; label: string; hint: string }[] = [];
    for (const bucket of categoryBuckets) {
      for (const cat of bucketCategories[bucket] ?? []) {
        if (seen.has(cat)) continue;
        seen.add(cat);
        out.push({ value: cat, label: cat, hint: bucket });
        for (const sub of categorySubcategories[cat] ?? []) out.push({ value: `${cat} › ${sub}`, label: sub, hint: cat });
      }
    }
    return out;
  }, []);

  const openPicker = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) {
      const below = window.innerHeight - r.bottom;
      const top = below >= PANEL_H + 12 ? r.bottom + 6 : Math.max(8, r.top - PANEL_H - 6);
      setPos({ top, left: Math.max(8, Math.min(window.innerWidth - PANEL_W - 8, r.right - PANEL_W)) });
    }
    setView({ level: 1 });
    setQuery("");
    setOpen(true);
  };
  useEffect(() => { if (open) searchRef.current?.focus(); }, [open]);

  const pick = (v: string) => { onChange(v); setOpen(false); };
  const q = query.trim().toLowerCase();
  const results = q ? entries.filter((e) => e.label.toLowerCase().includes(q) || e.hint.toLowerCase().includes(q)).slice(0, 40) : [];

  const back = (to: View) => (
    <button type="button" onClick={() => setView(to)} className="mb-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-semibold text-gray-dark hover:bg-[#222222]/5">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {view.level === 2 ? view.bucket : view.level === 3 ? view.category : ""}
    </button>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex max-w-[240px] shrink-0 cursor-pointer items-center gap-1.5 text-[14px] leading-[1.2] transition-colors hover:text-gray-dark ${open ? "text-gray-dark" : "text-gray-light"}`}
      >
        <span className="truncate underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">{value || emptyLabel}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden><polyline points="4 6 8 10 12 6" /></svg>
      </button>

      {open && pos && createPortal(
        <>
          {/* Above the dialog (z-[1010]) so the panel isn't clipped by its scroll area */}
          <div className="fixed inset-0 z-[1019]" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            className="fixed z-[1020] flex flex-col overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-lg"
            style={{ top: pos.top, left: pos.left, width: PANEL_W, maxHeight: PANEL_H }}
          >
            <div className="flex items-center gap-2 border-b border-gray-stroke px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-light" aria-hidden><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } }}
                placeholder="Search categories"
                aria-label="Search categories"
                className="min-w-0 flex-1 border-none bg-transparent text-[14px] text-gray-dark outline-none placeholder:text-gray-xlight"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-1.5">
              {q ? (
                results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-[14px] text-gray-light">No categories match “{query.trim()}”</p>
                ) : (
                  results.map((r) => (
                    <button key={r.value} type="button" onClick={() => pick(r.value)} className={rowCls}>
                      <span className="min-w-0 flex-1 truncate">{r.label}<span className="ml-2 font-normal text-gray-light">{r.hint}</span></span>
                      {value === r.value && <Check />}
                    </button>
                  ))
                )
              ) : view.level === 1 ? (
                <>
                  <button type="button" onClick={() => pick("")} className={rowCls}>{emptyLabel}{value === "" && <Check />}</button>
                  {categoryBuckets.map((b) => (
                    <button key={b} type="button" onClick={() => setView({ level: 2, bucket: b })} className={rowCls}>{b}<Chevron /></button>
                  ))}
                </>
              ) : view.level === 2 ? (
                <>
                  {back({ level: 1 })}
                  {(bucketCategories[view.bucket] ?? []).map((c) =>
                    categorySubcategories[c] ? (
                      <button key={c} type="button" onClick={() => setView({ level: 3, category: c })} className={rowCls}>{c}<Chevron /></button>
                    ) : (
                      <button key={c} type="button" onClick={() => pick(c)} className={rowCls}>{c}{value === c && <Check />}</button>
                    ),
                  )}
                </>
              ) : (
                <>
                  {back({ level: 2, bucket: categoryBuckets.find((b) => bucketCategories[b]?.includes(view.category)) ?? categoryBuckets[0] })}
                  <button type="button" onClick={() => pick(view.category)} className={rowCls}>All {view.category}{value === view.category && <Check />}</button>
                  {(categorySubcategories[view.category] ?? []).map((sub) => {
                    const v = `${view.category} › ${sub}`;
                    return <button key={sub} type="button" onClick={() => pick(v)} className={rowCls}>{sub}{value === v && <Check />}</button>;
                  })}
                </>
              )}
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
