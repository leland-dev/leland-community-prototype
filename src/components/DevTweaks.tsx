import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

// Floating prototype-only tweaks panel, matching the dashboard's 3-dot admin
// control. Lets a reviewer flip between design options in the browser instead
// of needing a rebuild — the goal handoff prototypes the category picker
// treatments this way so they can be compared side by side.
export default function DevTweaks({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-40 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-[268px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
          >
            <p className="mb-2 px-1 text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">Tweaks</p>
            <div className="flex flex-col gap-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Prototype tweaks"
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

// A labelled set of mutually exclusive options.
export function TweakChoice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 text-[13px] font-medium text-gray-light">{label}</span>
      <div className="flex flex-col gap-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-lg px-2 py-1.5 text-left text-[14px] transition-colors ${
              value === o.value ? "bg-[#EBD4B5] font-medium text-gray-dark" : "text-gray-light hover:bg-[#F5F5F5]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TweakToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-[#f5f5f5]">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <span className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="block h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
        <span className="absolute left-[2px] top-[2px] block h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
