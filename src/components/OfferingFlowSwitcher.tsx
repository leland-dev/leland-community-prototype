import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

// Prototype admin tool — a 3-dot menu pinned bottom-right that swaps between the
// guided offering flow and the original one for the same category.
const FLOWS = [
  { id: "guided", name: "Guided flow", path: "new-guided" },
  { id: "original", name: "Original flow", path: "new" },
] as const;

export default function OfferingFlowSwitcher({ current }: { current: (typeof FLOWS)[number]["id"] }) {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-[200px] rounded-xl border border-gray-stroke bg-white p-2 shadow-[0_4px_16px_rgba(16,24,40,0.12)]"
          >
            <span className="block px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-light">Creation flow</span>
            {FLOWS.map((f) => {
              const active = f.id === current;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => { setOpen(false); if (!active) navigate(`/my-leland/manage/${category}/${f.path}`); }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[14px] transition-colors ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-dark hover:bg-gray-hover"}`}
                >
                  {f.name}
                  {active && (
                    <svg className="h-4 w-4 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Admin controls"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-colors hover:bg-[#B1B1B1]/30"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="3" cy="8" r="1.5" fill="#222222" />
          <circle cx="8" cy="8" r="1.5" fill="#222222" />
          <circle cx="13" cy="8" r="1.5" fill="#222222" />
        </svg>
      </button>
    </div>
  );
}
