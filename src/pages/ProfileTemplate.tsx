import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import ProfileV2 from "./ProfileV2";
import customerPhoto from "../assets/profile photos/profile photo.png";
import { GraduationCap, Briefcase, Wrench } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import { getProfilePerson } from "../lib/profilePeople";

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

function AdminSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="px-2 py-2">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
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

export default function ProfileTemplate() {
  const { slug, category } = useParams<{ slug: string; category?: string }>();
  const [searchParams] = useSearchParams();
  // ?me=1 → the signed-in user's own profile: Expert off, My profile on.
  const isMe = searchParams.get("me") === "1";
  // Resolve the person from the feed/coach registry: their verified status
  // defaults the Expert toggle, and we pull their name, photo, and cover.
  const person = getProfilePerson(slug);

  // "Expert" turns on coach mode (default = whether this person is verified).
  const [expert, setExpert] = useState(isMe ? false : Boolean(person?.expert));
  const [customerFavorite, setCustomerFavorite] = useState(true);
  const [coachNote, setCoachNote] = useState(false);
  const [video, setVideo] = useState(false);
  const [supercoach, setSupercoach] = useState(false);
  const [altReviews, setAltReviews] = useState(true);
  const [coverMode, setCoverMode] = useState<"default" | "dark" | "beige" | "none">("default");
  const [myProfile, setMyProfile] = useState(isMe);
  const coachId = person?.coachId ?? "samantha";

  // Identity (name + photo + cover) is fixed per profile and stays constant
  // across the Expert toggle. Unknown slugs fall back to a prettified name.
  const displayName = person?.name ?? prettifySlug(slug);
  const displayPhoto = person?.avatar ?? customerPhoto;
  const cover = person?.cover;

  // Categories this expert coaches for. The "high-level" profile (no category
  // in the URL) lets the visitor pick one; each links to a category-specific
  // variant at /profile/:slug/:category.
  const categories = [
    { slug: "mba", label: "MBA Admissions", Icon: GraduationCap },
    { slug: "management-consulting", label: "Management Consulting", Icon: Briefcase },
    { slug: "product-management", label: "Product Management", Icon: Wrench },
  ];
  // High-level = an expert profile with no category selected yet.
  const highLevel = expert && !category;

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

  // Admin hotkeys: v = Video, e = Expert, n = Coach note, f = Customer favorite.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key.toLowerCase()) {
        case "v": setVideo((v) => !v); break;
        case "e": setExpert((v) => !v); break;
        case "n": setCoachNote((v) => !v); break;
        case "f": setCustomerFavorite((v) => !v); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mirror BottomNav's hide-on-scroll so the admin button can drop down to fill
  // the space when the bottom nav slides away (mobile only — no nav on desktop).
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

  // iOS Safari paints the status-bar / top safe-area region with the document
  // (html/body) background color, not theme-color — so force it to match the
  // cover treatment while on the profile (beige cover → beige status bar,
  // otherwise dark). The white page content still covers the visible area below.
  const statusBarBg = coverMode === "beige" ? "#F3F1E6" : coverMode === "none" ? "#ffffff" : "#111111";
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    html.style.backgroundColor = statusBarBg;
    body.style.backgroundColor = statusBarBg;
    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
    };
  }, [statusBarBg]);

  // Push-in / push-out page transition. On back we play the reverse slide, then
  // navigate away on animationend (the CSS animation has no fill-mode, so the
  // transform reverts to none once it lands — keeping the fixed admin button
  // and portaled sticky bar viewport-anchored).
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const handleBack = () => setIsExiting(true);
  useEffect(() => {
    if (!isExiting) return;
    const el = pageRef.current;
    if (!el) { navigate(-1); return; }
    const onEnd = () => navigate(-1);
    el.addEventListener("animationend", onEnd, { once: true });
    return () => el.removeEventListener("animationend", onEnd);
  }, [isExiting, navigate]);

  return (
    <>
      {/* Slides in from the right on entry, out to the right on back. The
          profile renders its own top nav (inside ProfileV2), so the nav slides
          with the page. No remount on Expert flip — ProfileV2 reconciles so the
          hero content can animate as it shifts. */}
      <div ref={pageRef} className={isExiting ? "slide-out-page" : "slide-in-page"}>
      <ProfileV2
        unified
        onBack={handleBack}
        coach={expert}
        coachId={coachId}
        name={displayName}
        photo={displayPhoto}
        cover={cover}
        customerFavorite={customerFavorite}
        coachNote={coachNote}
        coachVideo={video}
        supercoach={supercoach}
        offeringsTab
        altReviews={altReviews}
        coverMode={coverMode}
        ownProfile={myProfile}
        highLevel={highLevel}
        categories={categories}
        onSelectCategory={(c) => navigate(`/profile/${slug}/${c}`)}
      />
      </div>

      {/* Admin tool */}
      <div
        ref={menuRef}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-40 transition-transform duration-200 ease-out md:bottom-6 md:right-6"
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
              <AdminToggle label="Expert" checked={expert} onChange={() => setExpert((v) => !v)} />
              <AdminToggle label="My profile" checked={myProfile} onChange={() => setMyProfile((v) => !v)} />
              <div className="my-1 border-t border-gray-100" />
              {/* Coach-specific toggles stay visible but disabled when Expert is off */}
              <AdminToggle label="Customer favorite" checked={customerFavorite} onChange={() => setCustomerFavorite((v) => !v)} disabled={!expert} />
              <AdminToggle label="Coach note" checked={coachNote} onChange={() => setCoachNote((v) => !v)} disabled={!expert} />
              <AdminToggle label="Video" checked={video} onChange={() => setVideo((v) => !v)} disabled={!expert} />
              <AdminToggle label="SuperCoach" checked={supercoach} onChange={() => setSupercoach((v) => !v)} disabled={!expert} />
              <AdminToggle label="Alt reviews" checked={altReviews} onChange={() => setAltReviews((v) => !v)} disabled={!expert} />
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
