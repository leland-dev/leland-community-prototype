import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import ProfileV2, { COACH_CONFIGS } from "./ProfileV2";
import customerPhoto from "../assets/profile photos/profile photo.png";

// Maps a /profile/{firstname-lastname} slug to a coach config id. A slug that
// isn't a known coach renders the customer profile.
const SLUG_TO_COACH: Record<string, string> = {
  "samantha-parker": "samantha",
  "john-koelliker": "john",
};

// "june-allen" → "June Allen"
function prettifySlug(slug: string | undefined) {
  if (!slug) return "June Allen";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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

export default function ProfileTemplate() {
  const { slug } = useParams<{ slug: string }>();
  const initialCoachId = slug ? SLUG_TO_COACH[slug] : undefined;

  // "Expert" turns on coach mode. Sub-toggles are coach-only and default on.
  const [expert, setExpert] = useState(Boolean(initialCoachId));
  const [customerFavorite, setCustomerFavorite] = useState(true);
  const [coachNote, setCoachNote] = useState(true);
  const [video, setVideo] = useState(true);
  const coachId = initialCoachId ?? "samantha";
  const mode = expert ? "coach" : "customer";

  // Identity (name + photo) is fixed per profile and stays constant across the
  // Expert toggle. Coaches come from their config; other slugs derive a name
  // from the slug and use the default customer photo.
  const config = initialCoachId ? COACH_CONFIGS[initialCoachId] : undefined;
  const displayName = config?.name ?? prettifySlug(slug);
  const displayPhoto = config?.photo ?? customerPhoto;

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

  return (
    <>
      {/* key on mode forces a clean remount when Expert flips, so ProfileV2's
          per-mount state (and conditional hooks) stay consistent. The coach
          sub-toggles are plain props, so they update live without remounting. */}
      <ProfileV2
        key={mode}
        unified
        coach={expert}
        coachId={coachId}
        name={displayName}
        photo={displayPhoto}
        customerFavorite={customerFavorite}
        coachNote={coachNote}
        coachVideo={video}
      />

      {/* Admin tool */}
      <div ref={menuRef} className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <AdminToggle label="Expert" checked={expert} onChange={() => setExpert((v) => !v)} />
              <div className="my-1 border-t border-gray-100" />
              {/* Coach-specific toggles stay visible but disabled when Expert is off */}
              <AdminToggle label="Customer favorite" checked={customerFavorite} onChange={() => setCustomerFavorite((v) => !v)} disabled={!expert} />
              <AdminToggle label="Coach note" checked={coachNote} onChange={() => setCoachNote((v) => !v)} disabled={!expert} />
              <AdminToggle label="Video" checked={video} onChange={() => setVideo((v) => !v)} disabled={!expert} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Admin controls"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50 md:border-0 md:bg-[#222222]/5 md:shadow-none md:hover:bg-[#222222]/[0.08]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>
    </>
  );
}
