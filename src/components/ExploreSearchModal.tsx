import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import pmIcon from "../assets/icons/category-icons/product-management.svg";
import goldmanLogo from "../assets/org-logos/goldman.png";
import googleLogo from "../assets/org-logos/google.png";
import bainLogo from "../assets/org-logos/bain.png";
import bcgLogo from "../assets/org-logos/bcg.png";
import deloitteLogo from "../assets/org-logos/deloitte.png";
import lteSignalIcon from "../assets/icons/lte-signal.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import briefcaseIcon from "../assets/icons/briefcase.svg";

// Prototype-only universal search modal (v1 Explore). Nothing is wired up — the
// input doesn't filter and every row is decorative; it exists to present the
// "big search" direction. Dark, Leland-flavored, modeled on Mobbin's palette.

// Expert avatars + program cover art pulled straight from the asset folders.
const avatars = Object.values(
  import.meta.glob("../assets/profile photos/pic-*.png", { eager: true, import: "default" })
) as string[];
const covers = Object.values(
  import.meta.glob("../assets/img/cover-images/cover-image-*.{png,jpg,avif}", { eager: true, import: "default" })
) as string[];

// ── Inline sidebar / header glyphs (stroke = currentColor so they theme cleanly) ──
const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden>
    {path}
  </svg>
);
const categoriesGlyph = icon(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
const expertsGlyph = icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>);
const searchGlyph = icon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);

// Masked icon — tints an imported (dark) SVG with the current text color so it
// matches the inline glyphs on the dark sidebar.
const maskGlyph = (src: string) => (
  <span
    aria-hidden
    className="h-[18px] w-[18px] shrink-0 bg-current"
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

type TabKey = "categories" | "experts" | "livestreams" | "content" | "jobs";
const sidebar: { key: TabKey; label: string; glyph: ReactNode }[] = [
  { key: "categories", label: "Categories", glyph: categoriesGlyph },
  { key: "experts", label: "Experts", glyph: expertsGlyph },
  { key: "livestreams", label: "Livestreams", glyph: maskGlyph(lteSignalIcon) },
  { key: "content", label: "Content", glyph: maskGlyph(bookOpenIcon) },
  { key: "jobs", label: "Jobs", glyph: maskGlyph(briefcaseIcon) },
];

// Recent / suggested searches — a mix of category shortcuts, saved searches and experts.
const chips: { label: string; img?: string; search?: boolean }[] = [
  { label: "MBA Admissions", img: mbaIcon },
  { label: "Case interviews", search: true },
  { label: "Goldman Sachs", img: goldmanLogo },
  { label: "Product Management", img: pmIcon },
  { label: "Resume review", search: true },
  { label: "Management Consulting", img: consultingIcon },
  { label: "Google PM", img: googleLogo },
];

// Top-level category buckets; the count is how many sub-categories each holds.
const categoryBuckets = [
  { name: "Popular", count: 12 },
  { name: "General", count: 11 },
  { name: "AI", count: 10 },
  { name: "School Admissions", count: 12 },
  { name: "Test Prep", count: 10 },
  { name: "Business", count: 12 },
  { name: "Finance & Accounting", count: 11 },
  { name: "Product", count: 10 },
  { name: "Technology", count: 12 },
  { name: "Health & Medicine", count: 11 },
  { name: "Law & Public Service", count: 10 },
  { name: "Arts, Media, and Entertainment", count: 12 },
];

const experts = [
  { name: "Alex Rivera", role: "Ex-McKinsey · MBA Admissions", avatar: avatars[0] },
  { name: "Priya Nair", role: "Senior PM at Google", avatar: avatars[1] },
  { name: "Jordan Blake", role: "Goldman Sachs · IB", avatar: avatars[2] },
  { name: "Mia Chen", role: "Product Lead · Stripe", avatar: avatars[3] },
  { name: "Daniel Osei", role: "BCG · Case Coach", avatar: avatars[4] },
  { name: "Sofia Marín", role: "Harvard MBA · Admissions", avatar: avatars[5] },
  { name: "Ethan Park", role: "Staff Engineer · Meta", avatar: avatars[6] },
  { name: "Hannah Wolfe", role: "Bain · Strategy", avatar: avatars[7] },
];

const programs = [
  "MBA Strategy Live",
  "Case Interview Bootcamp",
  "PM Portfolio Review",
  "Resume Teardown",
  "Behavioral Prep",
  "Networking 101",
  "Offer Negotiation",
  "Startup Fundraising",
];

const contentItems = ["Frameworks", "Templates", "Guides", "Playbooks", "Checklists", "Case Studies", "Webinars", "Newsletters"];

const jobs = [
  { title: "Product Manager", company: "Google", location: "Mountain View, CA", logo: googleLogo },
  { title: "Investment Banking Analyst", company: "Goldman Sachs", location: "New York, NY", logo: goldmanLogo },
  { title: "Management Consultant", company: "Bain & Company", location: "Boston, MA", logo: bainLogo },
  { title: "Strategy Associate", company: "BCG", location: "Chicago, IL", logo: bcgLogo },
  { title: "Senior Consultant", company: "Deloitte", location: "San Francisco, CA", logo: deloitteLogo },
];

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-white/40">{children}</p>
);

// A labeled thumbnail card (Programs / Content).
const ThumbCard = ({ name, cover }: { name: string; cover: string }) => (
  <div>
    <div className="mb-1.5 truncate text-[13px] font-medium text-white">{name}</div>
    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5">
      <img src={cover} alt="" className="h-full w-full object-cover" />
    </div>
  </div>
);

export function ExploreSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");

  // Esc to close + lock body scroll while the modal is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[28px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop — a soft white veil over the app */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" onClick={onClose} />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal
            aria-label="Search Leland"
            className="relative z-10 flex h-[80vh] w-full max-w-[880px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e] text-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Search field */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-white/45">{searchGlyph}</span>
              <input
                autoFocus
                placeholder="Search experts, categories, programs, jobs or keywords…"
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/40 outline-none"
              />
            </div>

            {/* Quick / recent search chips — horizontal scroll */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
              {chips.map((c) => (
                <button key={c.label} className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/[0.07] py-1.5 pl-1.5 pr-3 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/[0.12]">
                  <span className="flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-[6px] bg-white">
                    {c.search ? (
                      <span className="text-[#555]">{searchGlyph}</span>
                    ) : (
                      <img src={c.img} alt="" className="h-[15px] w-[15px] object-contain" />
                    )}
                  </span>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Body: sidebar + tab content */}
            <div className="flex min-h-0 flex-1 border-t border-white/10">
              <nav className="w-[176px] shrink-0 space-y-1 border-r border-white/10 p-2">
                {sidebar.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors ${
                      activeTab === item.key ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/90"
                    }`}
                  >
                    {item.glyph}
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="min-w-0 flex-1 overflow-y-auto p-4">
                {activeTab === "categories" && (
                  <>
                    <SectionLabel>Categories</SectionLabel>
                    <div className="flex flex-col">
                      {categoryBuckets.map((c) => (
                        <button key={c.name} className="flex items-center justify-between rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/[0.06]">
                          <span className="text-[15px] font-medium text-white">{c.name}</span>
                          <span className="shrink-0 pl-3 text-[14px] text-white/40">{c.count}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "experts" && (
                  <>
                    <SectionLabel>Top experts</SectionLabel>
                    <div className="grid grid-cols-2 gap-2.5">
                      {experts.map((e) => (
                        <div key={e.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                          <img src={e.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/10" />
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-medium text-white">{e.name}</div>
                            <div className="truncate text-[12px] text-white/50">{e.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "livestreams" && (
                  <>
                    <SectionLabel>Upcoming livestreams</SectionLabel>
                    <div className="grid grid-cols-4 gap-3">
                      {programs.map((name, i) => (
                        <ThumbCard key={name} name={name} cover={covers[i % covers.length]} />
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "content" && (
                  <>
                    <SectionLabel>Browse content</SectionLabel>
                    <div className="grid grid-cols-4 gap-3">
                      {contentItems.map((name, i) => (
                        <ThumbCard key={name} name={name} cover={covers[(i + 2) % covers.length]} />
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "jobs" && (
                  <>
                    <SectionLabel>Open roles</SectionLabel>
                    <div className="flex flex-col gap-2">
                      {jobs.map((j) => (
                        <div key={j.title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                            <img src={j.logo} alt="" className="h-6 w-6 object-contain" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[14px] font-medium text-white">{j.title}</div>
                            <div className="truncate text-[12px] text-white/50">{j.company} · {j.location}</div>
                          </div>
                          <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[12px] font-medium text-white/80">View</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom fade — mimics the reference's clipped-content edge */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1c1c1e] to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
