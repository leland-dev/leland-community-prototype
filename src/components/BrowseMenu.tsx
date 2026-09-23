import { useState, useRef, useLayoutEffect, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import categoriesIcon from "../assets/icons/nav-icons/browse-active.svg";
import livestreamsIcon from "../assets/icons/video-filled.svg";
import jobsIcon from "../assets/icons/jobs.svg";
import contentIcon from "../assets/icons/content-book-filled.svg";

// Programs (courses-active) rendered inline: the screen is filled with the play
// triangle punched out via fill-rule evenodd, then the progress bar as strokes.
// (Masking the asset can't do the cutout — its triangle is an opaque white fill,
// so the mask fills the whole screen solid.)
const programsGlyph = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0 text-gray-light" aria-hidden>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
      d="M3 13V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V13C21 13.7956 20.6839 14.5587 20.1213 15.1213C19.5587 15.6839 18.7956 16 18 16H6C5.20435 16 4.44129 15.6839 3.87868 15.1213C3.31607 14.5587 3 13.7956 3 13Z M10.1226 11.3481V7.64997C10.1226 7.53583 10.1527 7.42372 10.2098 7.32489C10.2668 7.22607 10.349 7.14401 10.4478 7.08698C10.5467 7.02995 10.6588 6.99995 10.7729 7C10.8871 7.00005 10.9992 7.03014 11.098 7.08726L14.2978 8.93634C14.3965 8.99339 14.4785 9.07542 14.5355 9.17419C14.5925 9.27297 14.6226 9.385 14.6226 9.49905C14.6226 9.61309 14.5925 9.72513 14.5355 9.8239C14.4785 9.92267 14.3965 10.0047 14.2978 10.0618L11.098 11.9108C10.9992 11.968 10.8871 11.9981 10.773 11.9981C10.6588 11.9981 10.5467 11.9681 10.4478 11.9111C10.349 11.8541 10.2668 11.772 10.2097 11.6732C10.1527 11.5744 10.1226 11.4623 10.1226 11.3481Z"
    />
    <path d="M20 20H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 20H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 21V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Smaller, LinkedIn-style "Browse" dropdown ──────────────────────────────
   Replaces the full-screen ExploreSearchModal as the default Browse surface.
     1. Modalities   — Categories / Livestreams / Programs / Jobs / Leland+.
                        Only Categories has a submenu; the rest are plain links
                        out to their existing pages.
     2. Right pane    — the list of category buckets (always Categories').
     3. Flyout        — the categories inside the hovered bucket, revealed to
                        the right on hover (nothing is selected by default).
   The whole menu shifts left if the cascade would run off the viewport.
   All data is decorative/hardcoded, mirroring ExploreSearchModal. ── */

// Pane widths (px) — kept in sync with the Tailwind classes below so the
// overflow math knows the menu's full footprint.
const PANE1 = 180;
const PANE2 = 272;
const FLYOUT = 240;
const SUBPANE = 240;
const EDGE_MARGIN = 12;

// Tints an imported SVG to gray-light by masking a bg-current box with it.
const maskIcon = (src: string) => (
  <span
    aria-hidden
    className="h-[18px] w-[18px] shrink-0 bg-current text-gray-light"
    style={{
      maskImage: `url("${src}")`,
      WebkitMaskImage: `url("${src}")`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

const chevronRight = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-light" aria-hidden>
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Categories drives the submenu; the rest link straight out to their pages.
const modalityLinks: { label: string; icon?: string; node?: ReactNode; to: string }[] = [
  { label: "Livestreams", icon: livestreamsIcon, to: "/livestreams" },
  { label: "Programs", node: programsGlyph, to: "/courses" },
  { label: "Jobs", icon: jobsIcon, to: "/jobs" },
  { label: "Leland+", icon: contentIcon, to: "/content" },
];

// Top-level category buckets, each expanding into the categories below.
const categoryBuckets = [
  "Popular",
  "General",
  "AI",
  "School Admissions",
  "Test Prep",
  "Business",
  "Finance & Accounting",
  "Product",
  "Technology",
  "Health & Medicine",
  "Law & Public Service",
  "Arts, Media, and Entertainment",
];

// The third-level lists — representative categories inside each bucket.
const bucketCategories: Record<string, string[]> = {
  Popular: ["MBA Admissions", "Management Consulting", "Product Management", "Investment Banking", "Software Engineering", "Data Science", "Medical School", "Law School", "Resume Review", "Interview Prep"],
  General: ["Career Growth", "Networking", "Personal Branding", "Leadership", "Communication", "Salary Negotiation", "Job Search", "Mentorship", "Public Speaking"],
  AI: ["Machine Learning", "Prompt Engineering", "AI Product Management", "LLMs", "Generative AI", "AI Research", "MLOps", "Computer Vision", "NLP", "AI Ethics"],
  "School Admissions": ["MBA", "Undergraduate", "Law School", "Medical School", "Graduate School", "PhD", "College Essays", "Recommendations", "Financial Aid", "Scholarships"],
  "Test Prep": ["GMAT", "GRE", "LSAT", "MCAT", "SAT", "ACT", "TOEFL", "IELTS", "USMLE", "Bar Exam"],
  Business: ["Strategy", "Operations", "Entrepreneurship", "Marketing", "Sales", "Business Development", "Growth", "Fundraising", "Venture Capital", "Private Equity"],
  "Finance & Accounting": ["Investment Banking", "Private Equity", "Venture Capital", "Corporate Finance", "Financial Modeling", "Accounting", "FP&A", "Equity Research", "Hedge Funds", "Wealth Management"],
  Product: ["Product Management", "Product Design", "UX Research", "Product Strategy", "Product Analytics", "Growth Product", "Technical PM", "Product Marketing", "Roadmapping", "Prioritization"],
  Technology: ["Software Engineering", "Data Science", "DevOps", "Cybersecurity", "Cloud", "Frontend", "Backend", "Mobile", "Systems Design", "Engineering Management"],
  "Health & Medicine": ["Medical School", "Residency", "Nursing", "Public Health", "Dentistry", "Pharmacy", "Physician Assistant", "Healthcare Admin", "Clinical Research", "Mental Health"],
  "Law & Public Service": ["Law School", "Bar Prep", "Corporate Law", "Litigation", "Public Policy", "Government", "Nonprofit", "International Law", "Compliance", "Legal Careers"],
  "Arts, Media, and Entertainment": ["Film & TV", "Music", "Journalism", "Design", "Writing", "Marketing & PR", "Gaming", "Photography", "Content Creation", "Publishing"],
};

// A fourth level — subcategories inside a category. Only categories listed here
// get the extra panel (revealed on hover); everything else is a plain link.
const categorySubcategories: Record<string, string[]> = {
  "MBA Admissions": [
    "Traditional Full-Time MBA",
    "Deferred MBA",
    "Executive MBA",
    "Part-Time MBA",
    "Online MBA",
    "One-Year MBA",
    "MBA/JD",
    "MBA/MS",
    "MBA/MD",
    "MBA/MPP",
  ],
};

// A single tappable row (right pane + flyout).
const rowCls =
  "flex w-full items-center justify-between rounded-lg px-3 py-[9px] text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5";

export function BrowseMenu({
  open,
  navTo,
  onNavigate,
  showModalities = true,
}: {
  open: boolean;
  navTo: (path: string) => string;
  onNavigate: () => void;
  // When false, the modality pane (Categories / Livestreams / Programs / Jobs /
  // Leland+) is dropped and the category buckets become the first column — used
  // when those items already sit in the top nav (the "Existing" modality).
  showModalities?: boolean;
}) {
  // Which bucket's categories are showing in the flyout (null = none / at rest).
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null);
  // Which category's subcategories are showing in the 4th pane (only some
  // categories have one; null = none).
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  // Horizontal nudge (px, ≤ 0) applied so the full cascade stays on screen.
  const [shiftX, setShiftX] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Measure against the (untransformed) positioned parent so the math is
  // stable regardless of the menu's own translate. Recompute on open + resize.
  // Whether the currently-hovered category has a 4th-level panel showing.
  const subPaneOpen = hoveredCategory != null && categorySubcategories[hoveredCategory] != null;

  useLayoutEffect(() => {
    if (!open) {
      setShiftX(0);
      setHoveredBucket(null);
      setHoveredCategory(null);
      return;
    }
    const compute = () => {
      const anchor = menuRef.current?.offsetParent as HTMLElement | null;
      const baseLeft = anchor
        ? anchor.getBoundingClientRect().left
        : menuRef.current?.getBoundingClientRect().left ?? 0;
      // The base cascade always reserves room for the category flyout; the 4th
      // pane is added only while it's open, so the menu slides left on hover.
      const total = (showModalities ? PANE1 : 0) + PANE2 + FLYOUT + (subPaneOpen ? SUBPANE : 0);
      const overflow = baseLeft + total + EDGE_MARGIN - window.innerWidth;
      // Shift left by the overflow, but never past the left edge margin.
      const shift = Math.min(Math.max(0, overflow), Math.max(0, baseLeft - EDGE_MARGIN));
      setShiftX(-shift);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [open, showModalities, subPaneOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, x: shiftX }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-0 top-full z-50 mt-1 flex max-h-[80vh] overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-lg"
        >
          {/* Pane 1 — modalities. Dropped when those items already live in the
              top nav (the "Existing" modality); the buckets pane then leads. */}
          {showModalities && (
            <div className="w-[180px] shrink-0 space-y-1 border-r border-gray-stroke p-2">
              {/* Categories — the active section; drives the buckets pane. */}
              <div className="flex w-full items-center gap-2.5 rounded-lg bg-[#222222]/5 px-3 py-[10px] text-[14px] font-semibold text-gray-dark">
                {maskIcon(categoriesIcon)}
                <span className="flex-1">Categories</span>
                {chevronRight}
              </div>
              {modalityLinks.map((m) => (
                <NavLink
                  key={m.label}
                  to={navTo(m.to)}
                  onMouseEnter={() => setHoveredBucket(null)}
                  onClick={onNavigate}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[10px] text-[14px] font-medium text-gray-light transition-colors hover:bg-[#222222]/5 hover:text-gray-dark"
                >
                  {m.node ?? maskIcon(m.icon!)}
                  <span className="flex-1">{m.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* Pane 2 — category buckets */}
          <div className="w-[272px] shrink-0 overflow-y-auto p-2">
            {categoryBuckets.map((name) => (
              <button
                key={name}
                type="button"
                onMouseEnter={() => { setHoveredBucket(name); setHoveredCategory(null); }}
                className={`${rowCls} ${hoveredBucket === name ? "bg-[#222222]/5" : ""}`}
                aria-expanded={hoveredBucket === name}
              >
                {name}
                {chevronRight}
              </button>
            ))}
          </div>

          {/* Pane 3 — the hovered bucket's categories. A third column inside the
              same card (single radius/shadow), stretched to full height. Nothing
              shows until a bucket is hovered. Categories with a 4th level are
              rendered as hover targets (with a chevron) instead of links. */}
          <AnimatePresence>
            {hoveredBucket && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-[240px] shrink-0 overflow-y-auto border-l border-gray-stroke p-2"
              >
                {(bucketCategories[hoveredBucket] ?? []).map((cat) =>
                  categorySubcategories[cat] ? (
                    <button
                      key={cat}
                      type="button"
                      onMouseEnter={() => setHoveredCategory(cat)}
                      className={`${rowCls} ${hoveredCategory === cat ? "bg-[#222222]/5" : ""}`}
                      aria-expanded={hoveredCategory === cat}
                    >
                      {cat}
                      {chevronRight}
                    </button>
                  ) : (
                    <NavLink
                      key={cat}
                      to="#"
                      onMouseEnter={() => setHoveredCategory(null)}
                      onClick={onNavigate}
                      className={rowCls}
                    >
                      {cat}
                    </NavLink>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pane 4 — subcategories of the hovered category (only some have one). */}
          <AnimatePresence>
            {subPaneOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-[240px] shrink-0 overflow-y-auto border-l border-gray-stroke p-2"
              >
                {(categorySubcategories[hoveredCategory as string] ?? []).map((sub) => (
                  <NavLink key={sub} to="#" onClick={onNavigate} className={rowCls}>
                    {sub}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
