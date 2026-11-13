import { useEffect, useRef, useState, type RefCallback } from "react";
import { createPortal } from "react-dom";

// A searchable, multi-select dropdown — same positioning approach as
// CategoryPicker (measure the trigger synchronously, portal a fixed-position
// panel), but selections toggle without closing the panel, and the list
// scrolls instead of growing as a flat wall of chips.
const PANEL_W = 280;
const PANEL_MAX_H = 320;

export function MultiSelectDropdown({
  values,
  onChange,
  options,
  searchPlaceholder = "Search",
  trigger,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  searchPlaceholder?: string;
  trigger: (props: { onClick: () => void; open: boolean; ref: RefCallback<HTMLElement> }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openPicker = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) {
      const below = window.innerHeight - r.bottom;
      const top = below >= PANEL_MAX_H + 8 || below >= r.top ? r.bottom + 4 : Math.max(8, r.top - PANEL_MAX_H - 4);
      const width = Math.max(PANEL_W, r.width);
      setPos({ top, left: Math.max(8, Math.min(window.innerWidth - width - 8, r.left)), width });
    }
    setQuery("");
    setOpen(true);
  };

  useEffect(() => {
    if (open) searchRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Close on outside click, but not on clicks inside the panel itself —
  // unlike CategoryPicker, selecting an option here doesn't close the panel.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const toggle = (o: string) => {
    onChange(values.includes(o) ? values.filter((v) => v !== o) : [...values, o]);
  };

  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.toLowerCase().includes(q)) : options;

  return (
    <>
      {trigger({
        onClick: () => (open ? setOpen(false) : openPicker()),
        open,
        ref: (el) => { triggerRef.current = el; },
      })}

      {open && pos && createPortal(
        <div
          ref={panelRef}
          role="listbox"
          aria-multiselectable="true"
          className="fixed z-[1020] flex flex-col overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-lg"
          style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: PANEL_MAX_H }}
        >
          <div className="flex items-center gap-2 border-b border-gray-stroke px-3 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { e.stopPropagation(); setOpen(false); }
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="min-w-0 flex-1 border-none bg-transparent text-[14px] text-gray-dark outline-none placeholder:text-gray-extra-light"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-[14px] text-gray-light">No matches for "{query.trim()}"</p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggle(o)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark hover:bg-gray-hover"
                >
                  {o}
                  {values.includes(o) && <Check />}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden><polyline points="3 8.5 6.5 12 13 4.5" /></svg>
);
