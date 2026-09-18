import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import MyLelandProfileView from "./MyLelandProfileView";
import ProfileEditMode from "./ProfileEditMode";
import { useProfileEditMode } from "../contexts/ProfileEditModeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
import coverImage from "../assets/img/cover-image-2.png";
import { useIsMobile } from "../hooks/useIsMobile";
import { useExpertMode } from "../contexts/ExpertModeContext";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import productManagementIcon from "../assets/icons/category-icons/product-management.svg";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile

   The signed-in user's OWN profile, rendered with the exact public profile
   template (ProfileV2, unified) so it reads as a faithful, editable mirror of
   what visitors actually see at /profile/:slug. "Viewing my profile" is forced
   on (ownProfile), which surfaces the inline edit affordances throughout.

   Expert vs. customer is driven by the global My Leland Expert toggle
   (useExpertMode) — the same switch that gates the rest of the My Leland shell
   — so coaching-only sections (offerings, reviews, availability, coach note,
   video, category listings) appear only for experts.
   ───────────────────────────────────────────────────────────────────────── */

function AdminToggle({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
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

function AdminSelect({ label, value, options, onChange, cols = 2 }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; cols?: number }) {
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

// Categories this expert coaches for — mirrors the public template.
const categories = [
  { slug: "mba", label: "MBA", icon: mbaIcon, headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits" },
  { slug: "management-consulting", label: "Management Consulting", icon: consultingIcon, headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro" },
  { slug: "product-management", label: "Product Management", icon: productManagementIcon, headline: "Senior PM at LinkedIn | Ex-Meta | Breaking Into Tech" },
];

export default function MyLelandProfile() {
  // Expert vs. customer follows the global My Leland Expert toggle.
  const { expert } = useExpertMode();
  // "Inline" (the faithful public-template view) vs. "Edit mode" (the beige,
  // card-based editor). In context so CoachLayout can paint the page beige.
  const { editMode, setEditMode } = useProfileEditMode();

  // Coaching-section demo toggles — default on so the expert profile shows rich.
  const [customerFavorite, setCustomerFavorite] = useState(true);
  const [coachNote, setCoachNote] = useState(true);
  const [video, setVideo] = useState(true);
  const [supercoach, setSupercoach] = useState(true);
  const [coverMode, setCoverMode] = useState<"default" | "dark" | "beige" | "none">("default");

  useEffect(() => {
    document.title = "Leland Prototype | Profile";
  }, []);

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
    <>
      {editMode ? (
        <ProfileEditMode />
      ) : (
        <MyLelandProfileView
          unified
          embedded
          coach={expert}
          coachId="samantha"
          name="Alex Rivera"
          photo={profilePhoto}
          cover={coverImage}
          customerFavorite={customerFavorite}
          coachNote={coachNote}
          coachVideo={video}
          supercoach={supercoach}
          offeringsTab
          coverMode={coverMode}
          ownProfile
          categories={categories}
        />
      )}

      {/* Admin tool — mirrors the public template's section/cover playground so
          the own-profile view can preview every state. Expert / My-profile are
          fixed here (Expert follows the My Leland toggle; My profile is on). */}
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
              {/* Page mode — swaps the whole page between the inline template
                  view and the beige, card-based editor. */}
              <AdminSelect
                label="Mode"
                value={editMode ? "edit" : "inline"}
                onChange={(v) => setEditMode(v === "edit")}
                options={[
                  { value: "edit", label: "Edit mode" },
                  { value: "inline", label: "Inline" },
                ]}
              />
              {/* Inline-only preview controls (irrelevant in Edit mode) */}
              {!editMode && (
                <>
                  <div className="my-1 border-t border-gray-100" />
                  {/* Coaching sections — only meaningful when Expert is on */}
                  <AdminToggle label="Customer favorite" checked={customerFavorite} onChange={() => setCustomerFavorite((v) => !v)} disabled={!expert} />
                  <AdminToggle label="Coach note" checked={coachNote} onChange={() => setCoachNote((v) => !v)} disabled={!expert} />
                  <AdminToggle label="Video" checked={video} onChange={() => setVideo((v) => !v)} disabled={!expert} />
                  <AdminToggle label="Top Expert" checked={supercoach} onChange={() => setSupercoach((v) => !v)} disabled={!expert} />
                  <div className="my-1 border-t border-gray-100" />
                  <AdminSelect
                    label="Cover image"
                    value={coverMode}
                    onChange={(v) => setCoverMode(v as "default" | "dark" | "beige" | "none")}
                    options={[
                      { value: "default", label: "Default" },
                      { value: "dark", label: "Dark" },
                      { value: "beige", label: "Beige" },
                      { value: "none", label: "None" },
                    ]}
                  />
                </>
              )}
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
    </>
  );
}
