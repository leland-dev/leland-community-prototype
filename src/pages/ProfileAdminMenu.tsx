import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";
import { PROFILE_VERSIONS } from "./profileVersions";

export function AdminToggle({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center justify-between rounded-lg px-2 py-2 transition-colors ${disabled ? "cursor-default opacity-40" : "cursor-pointer hover:bg-[#f5f5f5]"}`}>
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
        <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

export function AdminSelect({ label, value, options, onChange, cols = 2 }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; cols?: number }) {
  return (
    <div className="px-2 py-2">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="mt-1.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`cursor-pointer rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${value === o.value ? "bg-gray-dark text-white" : "bg-[#f5f5f5] text-gray-dark hover:bg-[#ebebeb]"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Profile admin tool

   The floating 3-dot menu (bottom-right) shared by every profile version. Its
   top control is the version switcher: it lists all profile versions (from
   `PROFILE_VERSIONS`) and navigates to the one you pick — this is how you move
   between the Edit-mode page and the Inline page (and any future version).

   Version-specific preview controls (e.g. Inline's Boxed mode / cover / coaching
   toggles) are passed in as `children`, so each page owns its own extras while
   sharing the widget chrome and the version switcher.
   ───────────────────────────────────────────────────────────────────────── */
export default function ProfileAdminMenu({ currentVersion, children }: { currentVersion: string; children?: ReactNode }) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // Mirror the public template's mobile admin-button drop when the bottom nav
  // slides away on scroll.
  const isMobile = useIsMobile();
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 80) setNavHidden(false);
      else if (delta > 6) setNavHidden(true);
      else if (delta < -6) setNavHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-[calc(max(env(safe-area-inset-bottom),20px)+72px)] right-4 z-40 transition-transform duration-200 ease-out md:bottom-6 md:right-6"
      style={{ transform: isMobile && navHidden ? "translateY(56px)" : "translateY(0)" }}
    >
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            {/* Version switcher — links to the other profile versions. Picking a
                different version navigates to its route. */}
            <AdminSelect
              label="Mode"
              value={currentVersion}
              onChange={(v) => {
                if (v === currentVersion) return;
                const target = PROFILE_VERSIONS.find((x) => x.key === v);
                if (target) navigate(target.path);
              }}
              options={PROFILE_VERSIONS.map((v) => ({ value: v.key, label: v.label }))}
            />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setMenuOpen((o) => !o)}
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
