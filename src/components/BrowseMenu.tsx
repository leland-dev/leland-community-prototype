import { useState, useRef, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import categoriesIcon from "../assets/icons/nav-icons/browse-active.svg";
import livestreamsIcon from "../assets/icons/video-filled.svg";
import jobsIcon from "../assets/icons/jobs.svg";
import contentIcon from "../assets/icons/content-book-filled.svg";

/* ── Smaller, LinkedIn-style "Browse" dropdown ──────────────────────────────
   Replaces the full-screen ExploreSearchModal as the default Browse surface.
     1. Modalities   — Categories / Livestreams / Jobs / Content. Only
                        Categories has a submenu; the rest are plain links out
                        to their existing pages.
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

// Categories drives the submenu; the other three link straight out to their pages.
const modalityLinks: { label: string; icon: string; to: string }[] = [
  { label: "Livestreams", icon: livestreamsIcon, to: "/livestreams" },
  { label: "Jobs", icon: jobsIcon, to: "/jobs" },
  { label: "Content", icon: contentIcon, to: "/content" },
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

// A single tappable row (right pane + flyout).
const rowCls =
  "flex w-full items-center justify-between rounded-lg px-3 py-[9px] text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5";

export function BrowseMenu({
  open,
  navTo,
  onNavigate,
}: {
  open: boolean;
  navTo: (path: string) => string;
  onNavigate: () => void;
}) {
  // Which bucket's categories are showing in the flyout (null = none / at rest).
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null);
  // Horizontal nudge (px, ≤ 0) applied so the full cascade stays on screen.
  const [shiftX, setShiftX] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Measure against the (untransformed) positioned parent so the math is
  // stable regardless of the menu's own translate. Recompute on open + resize.
  useLayoutEffect(() => {
    if (!open) {
      setShiftX(0);
      return;
    }
    const compute = () => {
      const anchor = menuRef.current?.offsetParent as HTMLElement | null;
      const baseLeft = anchor
        ? anchor.getBoundingClientRect().left
        : menuRef.current?.getBoundingClientRect().left ?? 0;
      const total = PANE1 + PANE2 + FLYOUT;
      const overflow = baseLeft + total + EDGE_MARGIN - window.innerWidth;
      // Shift left by the overflow, but never past the left edge margin.
      const shift = Math.min(Math.max(0, overflow), Math.max(0, baseLeft - EDGE_MARGIN));
      setShiftX(-shift);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ x: shiftX }}
          className="absolute left-0 top-full z-50 mt-1 flex max-h-[80vh] overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-lg"
        >
          {/* Pane 1 — modalities */}
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
                {maskIcon(m.icon)}
                <span className="flex-1">{m.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Pane 2 — category buckets */}
          <div className="w-[272px] shrink-0 overflow-y-auto p-2">
            {categoryBuckets.map((name) => (
              <button
                key={name}
                type="button"
                onMouseEnter={() => setHoveredBucket(name)}
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
              shows until a bucket is hovered. */}
          <AnimatePresence>
            {hoveredBucket && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-[240px] shrink-0 overflow-y-auto border-l border-gray-stroke p-2"
              >
                {(bucketCategories[hoveredBucket] ?? []).map((cat) => (
                  <NavLink key={cat} to="#" onClick={onNavigate} className={rowCls}>
                    {cat}
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
