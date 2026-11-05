import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, LinkButton } from "../components/Button";
import AdminToggle from "../components/AdminToggle";
import { OFFERINGS, type Offering } from "../lib/offerings";
import { EventRow, upcoming as upcomingLivestreams } from "./CoachLivestreams";
import { WorkshopRow, upcoming as upcomingWorkshops } from "./CoachWorkshops";
import { ContentRowV1, ContentTableHeader } from "./CoachContent";
import { formatViews } from "./CoachProductNew";
import { RESOURCES } from "../lib/resources";
import { CalendarIcon } from "../components/SessionCard";
import { LELAND_PACKAGES, fmtPrice, type LelandPackage } from "../lib/lelandPackages";
import editIcon from "../assets/icons/edit.svg";
import eyeIcon from "../assets/icons/eye.svg";
import copyIcon from "../assets/icons/copy.svg";
import lockIcon from "../assets/icons/lock.svg";
import sortIcon from "../assets/icons/sort.svg";
import dragDotsIcon from "../assets/icons/drag-dots.svg";
import shareArrowIcon from "../assets/icons/share-arrow.svg";
import trashIcon from "../assets/icons/trash.svg";
import lelandMark from "../assets/logos/Leland Profile Image Logo Icon White on black.png";
import pic6 from "../assets/profile photos/pic-6.png";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import videoIcon from "../assets/icons/video-icon.svg";
import packageBoxOpenIcon from "../assets/icons/package-box-open.svg";
import repostIcon from "../assets/icons/repost-2.svg";

// Icons ship with hardcoded strokes, so tint them via CSS mask + bg-current to
// follow the surrounding text color (e.g. red for the delete menu item).
function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
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
}

const categoryData: Record<string, {
  name: string;
  headline: string;
  qualifications: string;
  yearsOfExperience: string;
  levelOfExperience: string;
  videoLink: string;
  hourlyRate: string;
  analytics: { views: string; leads: string; bookings: string };
  services: string[];
  allServices: string[];
}> = {
  "product-management": {
    name: "Product Management",
    headline: "Senior Product Leader | Ex-Meta & LinkedIn | Stanford GSB MBA",
    hourlyRate: "175",
    analytics: { views: "2.1k", leads: "27", bookings: "$3.2k" },
    qualifications: "8+ years of product management experience across consumer and enterprise products. I've led cross-functional teams at LinkedIn and Meta, shipping products used by hundreds of millions of people and owning roadmaps from early discovery through launch and iteration. My background spans 0-to-1 product bets, platform and infrastructure work, and large-scale growth initiatives, so I can meet you wherever you are in your PM journey.\n\nBefore moving into product, I started my career in software engineering, which gives me a strong technical foundation and a practical understanding of how to partner with design and engineering. I earned my MBA at Stanford GSB with a focus on strategic leadership and technology innovation, and I've spent the years since mentoring aspiring and early-career PMs.\n\nIn our sessions, I'll help you sharpen your product sense, prepare for behavioral and case-style interviews, and craft a resume and story that clearly communicate your impact. Whether you're breaking into product management, leveling up to senior or director roles, or preparing for interviews at top tech companies, we'll build a plan tailored to your goals.",
    yearsOfExperience: "8",
    levelOfExperience: "Director",
    videoLink: "https://www.youtube.com/watch?v=example",
    services: ["General Exploration", "Interviews", "Resume", "Networking Strategy"],
    allServices: [
      "Application Strategy", "Cover Letters", "Ding Analysis", "Editing", "Essays",
      "General Exploration", "Interviews", "Networking Strategy", "Recommendations",
      "Resume", "School Selection", "Secondary Review",
    ],
  },
  "management-consulting": {
    name: "Management Consulting",
    headline: "Ex-McKinsey Engagement Manager | Wharton MBA | 200+ MBB Case Preps",
    hourlyRate: "200",
    analytics: { views: "860", leads: "11", bookings: "$2.4k" },
    qualifications: "Former McKinsey engagement manager with a Wharton MBA and seven years of experience across strategy, operations, and organizational transformation engagements. I've led case teams serving Fortune 500 clients and worked directly with senior partners, so I know exactly what recruiters and interviewers at MBB and top boutique firms are looking for.\n\nOver the past several years I've coached candidates from a wide range of backgrounds — undergraduates, MBAs, advanced-degree holders, and experienced hires — into offers at McKinsey, Bain, BCG, and leading boutiques. My approach is structured but personal: we'll diagnose your specific gaps and build a focused plan rather than drilling generic frameworks.\n\nTogether we'll work through case interviews, market sizing, and fit and behavioral questions, and we'll position your resume and networking outreach to stand out in a competitive recruiting cycle. I'll give you honest, direct feedback and the reps you need to walk into interview day confident and prepared.",
    yearsOfExperience: "7",
    levelOfExperience: "Manager",
    videoLink: "",
    services: ["Case Prep", "Fit Interviews", "Resume", "Networking Strategy", "Application Strategy"],
    allServices: [
      "Application Strategy", "Case Prep", "Cover Letters", "Editing", "Fit Interviews",
      "General Exploration", "Interviews", "Networking Strategy", "Recommendations",
      "Resume", "School Selection", "Secondary Review",
    ],
  },
  mba: {
    name: "MBA",
    headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits",
    hourlyRate: "150",
    analytics: { views: "1.2k", leads: "18", bookings: "$1.8k" },
    qualifications: "Stanford GSB graduate with deep, hands-on expertise in MBA admissions. Over the past six years I've coached more than 100 candidates into M7 programs including HBS, Stanford GSB, and Wharton, as well as other top-15 schools. I've reviewed thousands of essays and mock interviews, and I understand what admissions committees are truly evaluating beneath the surface of an application.\n\nMy philosophy is that the strongest applications are authentic ones. Rather than manufacturing a polished-but-generic narrative, I'll help you uncover the genuine throughline in your experiences and articulate it with clarity and conviction. We'll define your positioning, build a balanced school list, and make sure every element of your application reinforces a consistent story.\n\nI offer end-to-end support across application strategy, essay development and editing, recommender guidance, and interview preparation, and I'm happy to jump in at any stage of the process. Whether you're just starting to explore programs or refining final drafts before the deadline, I'll help you present the most compelling version of yourself.",
    yearsOfExperience: "6",
    levelOfExperience: "Manager",
    videoLink: "https://www.youtube.com/watch?v=example2",
    services: ["Application Strategy", "Essays", "Interviews", "School Selection", "Resume", "Recommendations"],
    allServices: [
      "Application Strategy", "Cover Letters", "Ding Analysis", "Editing", "Essays",
      "Financial Aid & Scholarships", "General Exploration", "Interviews", "Networking Strategy",
      "Recommendations", "Resume", "School Selection", "Secondary Review",
      "Supplementary Materials", "Testing & Assessments", "Waitlist Strategy",
    ],
  },
  college: {
    name: "College",
    headline: "College Admissions Expert | Yale Grad | 50+ Ivy League Admits",
    hourlyRate: "120",
    analytics: { views: "540", leads: "7", bookings: "$1.1k" },
    qualifications: "Yale graduate and former admissions reader with firsthand experience evaluating applications from the other side of the desk. Over the past five years I've helped more than 50 students gain admission to Ivy League and top-20 universities, and I bring an insider's perspective on how committees actually read and compare candidates.\n\nI specialize in helping students find and tell their story. Many applicants have impressive accomplishments but struggle to communicate what makes them distinctive — that's where I focus my energy. We'll develop a personal essay that feels genuine and memorable, and shape supplemental essays that show real fit with each school.\n\nBeyond the essays, I'll help you build a balanced college list, strengthen your extracurricular narrative, and prepare for interviews with confidence. I work closely with both students and families throughout the process, keeping things organized and low-stress so you can put your best foot forward.",
    yearsOfExperience: "5",
    levelOfExperience: "Associate",
    videoLink: "",
    services: ["Application Strategy", "Essays", "Interviews", "School Selection", "Recommendations"],
    allServices: [
      "Application Strategy", "Cover Letters", "Ding Analysis", "Editing", "Essays",
      "Financial Aid & Scholarships", "General Exploration", "Interviews", "Networking Strategy",
      "Recommendations", "Resume", "School Selection", "Secondary Review",
      "Supplementary Materials", "Testing & Assessments", "Waitlist Strategy",
    ],
  },
};

const HERO_BG = "#F3F1E6";

// Product modalities — mirrors the "New product" selection page. v2 groups the
// category's offerings into a card per modality.
const MODALITIES = [
  { id: "hourly", name: "Hourly coaching", icon: hourglassIcon, color: "#3B82F6" },
  { id: "async", name: "Content", icon: bookOpenIcon, color: "#10B981" },
  { id: "live", name: "Live group sessions", icon: videoIcon, color: "#F43F5E" },
  { id: "package", name: "Bundles", icon: packageBoxOpenIcon, color: "#6366F1" },
  { id: "subscription", name: "Subscriptions", icon: repostIcon, color: "#F59E0B" },
] as const;

// Prototype mapping of an offering to a modality (offerings carry no real type).
function modalityForOffering(o: Offering): string {
  const price = Number(o.price.replace(/[^0-9.]/g, ""));
  if (o.slug.includes("bootcamp")) return "live";
  if (o.slug.includes("hour")) return "hourly";
  if (price <= 30) return "async";
  return "package";
}

// Admin-toggleable layout version for this page — persisted so a demo survives
// reloads. v1 is the current design; v2 is the in-progress redesign.
type CategoryVersion = "v1" | "v2" | "v3" | "v4" | "v5";
const VERSION_KEY = "coachCategoryVersion";

// Dashed border drawn as an SVG background so we can set a larger dash length
// and a lower-opacity stroke than CSS `border-dashed` allows. Stroke is
// gray-light (#4C4C4C); rx matches rounded-2xl (16px). The border lives on the
// button element itself (not an overlay) so all four sides render reliably; the
// hover variant fades in on top to darken it. 0.4 base + 0.2 boost ≈ 0.5.
const dashedBorder = (opacity: number) => ({
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%234C4C4C' stroke-opacity='${opacity}' stroke-width='2' stroke-dasharray='6%2c 5' stroke-linecap='butt'/%3e%3c/svg%3e")`,
});
const dashedBorderStyle = dashedBorder(0.4);
const dashedBorderHoverStyle = dashedBorder(0.2);

const LEVEL_OPTIONS = ["Associate", "Manager", "Senior Manager", "Director", "VP", "C-Level"];

type ListingSettings = {
  headline: string;
  yearsOfExperience: string;
  levelOfExperience: string;
  qualifications: string;
  services: string[];
  videoLink: string;
};

const inputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark";
const labelClass = "mb-1.5 block text-[14px] font-medium text-gray-light";

// Coach-side offering card — visually identical to the customer's
// CustomerOfferingCard (cover, title, headline, price row) but with a hover
// state that darkens the thumbnail and reveals Preview + Edit icon buttons.
function CoachOfferingCard({ offering, onPreview, onEdit }: { offering: Offering; onPreview: () => void; onEdit: () => void }) {
  const priceRow = (
    <div>
      {offering.startingAt && (
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Starting at</p>
      )}
      <p className="flex items-baseline gap-x-1 text-[14px] font-semibold text-gray-dark">
        <span>{offering.price}</span>
        {offering.origPrice && <span className="font-normal text-gray-extra-light line-through">{offering.origPrice}</span>}
        {offering.savePct != null && <span className="ml-auto text-[12px] font-medium text-[#1B8A54]">Save {offering.savePct}%</span>}
      </p>
    </div>
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]">
      <div className="relative">
        <img src={offering.image} alt="" className="aspect-[1200/630] w-full object-cover" />
        {/* Hover: darken the thumbnail and reveal Preview + Edit controls. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button onClick={onPreview} aria-label="Preview offering" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={eyeIcon} alt="" className="h-5 w-5" />
          </button>
          <button onClick={onEdit} aria-label="Edit offering" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={editIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[15px] font-semibold leading-tight text-gray-dark">{offering.title}</p>
        <p className="mt-1 text-[14px] leading-snug text-gray-light">{offering.headline}</p>
        <div className="mt-auto pt-3">{priceRow}</div>
      </div>
    </div>
  );
}

// Small on/off switch used to toggle whether a coach offers a standardized
// package. Green when on, neutral when off.
function OfferToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Offering this package" : "Not offering this package"}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${on ? "bg-[#1B8A54]" : "bg-[#222222]/15"}`}
    >
      <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.3)] transition-transform ${on ? "translate-x-[19px]" : "translate-x-[3px]"}`} />
    </button>
  );
}

// Standardized package card — a Leland-authored offering the coach can't edit
// the contents of, only turn on/off and price. Matches CoachOfferingCard's hover
// (darkened thumbnail + centered Preview + Edit); the "Created by Leland" badge
// and the offer toggle distinguish it. Edit opens the price-only modal.
function StandardizedPackageCard({ pkg, prices, offered, onToggle, onPreview, onEditPrice }: { pkg: LelandPackage; prices: number[]; offered: boolean; onToggle: (v: boolean) => void; onPreview: () => void; onEditPrice: () => void }) {
  const lowest = Math.min(...prices);
  const multiTier = pkg.tiers.length > 1;
  return (
    <div className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)] ${offered ? "border-[#222222]/20 ring-1 ring-[#222222]/[0.06]" : "border-gray-stroke"}`}>
      <div className="relative">
        <img src={pkg.image} alt="" className={`aspect-[1200/630] w-full object-cover transition duration-200 ${offered ? "" : "opacity-60 grayscale"}`} />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.18)]">
          <img src={lelandMark} alt="" className="h-4 w-4 rounded-full" />
          <span className="text-[12px] font-semibold text-gray-dark">Created by Leland</span>
        </span>
        {/* Hover: darken the thumbnail and reveal Preview + Edit (price only). */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button onClick={onPreview} aria-label="Preview package" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={eyeIcon} alt="" className="h-5 w-5" />
          </button>
          <button onClick={onEditPrice} aria-label="Edit price" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={editIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className={offered ? "" : "opacity-60"}>
          <p className="line-clamp-2 text-[15px] font-semibold leading-tight text-gray-dark">{pkg.title}</p>
          <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-gray-light">{pkg.headline}</p>
        </div>
        {/* Price + offer toggle share a line; the toggle stays full strength. */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className={offered ? "" : "opacity-60"}>
            {multiTier && <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Starting at</p>}
            <p className="text-[14px] font-semibold text-gray-dark">{fmtPrice(lowest)}</p>
          </div>
          <OfferToggle on={offered} onChange={onToggle} />
        </div>
      </div>
    </div>
  );
}

// Price-only editor for a standardized package. A sync toggle ties the price to
// the coach's hourly rate (locking the inputs); with sync off, each package size
// can be priced manually. Content is fixed by Leland and not editable here.
function PackagePriceModal({ pkg, synced, prices, onClose, onSave, onPreview }: { pkg: LelandPackage | null; synced: boolean; prices: number[]; onClose: () => void; onSave: (synced: boolean, prices: number[]) => void; onPreview: () => void }) {
  const [localSynced, setLocalSynced] = useState(synced);
  const [localPrices, setLocalPrices] = useState<string[]>(prices.map(String));

  // Re-seed the form whenever a different package is opened.
  useEffect(() => {
    if (pkg) {
      setLocalSynced(synced);
      setLocalPrices(prices.map(String));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg?.slug]);

  const save = () => {
    if (!pkg) return;
    const parsed = localPrices.map((p, i) => {
      const n = parseInt(p.replace(/[^0-9]/g, ""), 10);
      return Number.isFinite(n) ? n : pkg.tiers[i].price;
    });
    onSave(localSynced, parsed);
  };

  return createPortal(
    <AnimatePresence>
      {pkg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[88vh] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            <div className="flex-1 overflow-y-auto px-7 pb-2 pt-8">
              <h2 className="pr-12 font-serif text-[28px] leading-tight text-gray-dark">Update your price for this offering</h2>

              {/* Offering summary — white card with a Preview button at the bottom */}
              <div className="mt-6 rounded-2xl border border-gray-stroke bg-white p-4">
                <div className="flex items-center gap-3">
                  <img src={pkg.image} alt="" className="h-12 w-[72px] shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-tight text-gray-dark">{pkg.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-gray-light">
                      <img src={lelandMark} alt="" className="h-4 w-4 rounded-full" />
                      Created by Leland · {pkg.hoursLabel}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" rounded="rounded-full" className="mt-4 w-full font-semibold" onClick={onPreview}>
                  <img src={eyeIcon} alt="" className="h-[18px] w-[18px]" />
                  Preview offering
                </Button>
              </div>

              {/* Sync toggle — sits at the same level as the price options. */}
              <div className="mt-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[15px] font-semibold text-gray-dark">Sync price to my hourly rate &amp; discounts</p>
                  <OfferToggle on={localSynced} onChange={setLocalSynced} />
                </div>
                <p className="mt-1.5 text-[14px] leading-snug text-gray-light">Changing your hourly rate and bulk discounts will update your package price.</p>
              </div>

              {/* Per-tier price inputs — locked while synced. */}
              <div className="mt-6 flex flex-col gap-5">
                {pkg.tiers.map((t, i) => (
                  <div key={t.name}>
                    <label className="mb-1.5 block text-[15px] font-semibold text-gray-dark">{t.name} · {t.hours}</label>
                    <div className={`flex items-stretch overflow-hidden rounded-lg border ${localSynced ? "border-gray-stroke bg-gray-hover" : "border-gray-stroke bg-white focus-within:border-gray-dark"}`}>
                      <div className="flex flex-1 items-center gap-2 px-4">
                        {localSynced && <img src={lockIcon} alt="" className="h-4 w-4 shrink-0 opacity-60" />}
                        <input
                          inputMode="numeric"
                          disabled={localSynced}
                          value={localPrices[i]}
                          onChange={(e) => setLocalPrices((s) => s.map((v, j) => (j === i ? e.target.value.replace(/[^0-9]/g, "") : v)))}
                          className="w-full bg-transparent py-3 text-[15px] text-gray-dark outline-none disabled:text-gray-light"
                        />
                      </div>
                      <div className="flex items-center border-l border-gray-stroke px-4 text-[15px] font-medium text-gray-light">USD</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-gray-stroke px-7 py-5">
              <Button size="lg" variant="white" rounded="rounded-full" className="flex-1 border border-gray-stroke font-semibold" onClick={onClose}>Back</Button>
              <Button size="lg" variant="primary" rounded="rounded-full" className="flex-1 font-semibold" onClick={save}>Save changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const OFFERING_FILTERS = [
  { key: "all", label: "All" },
  { key: "you", label: "Created by you" },
  { key: "leland", label: "Created by Leland" },
] as const;
type OfferingFilter = (typeof OFFERING_FILTERS)[number]["key"];

// A flat view of every offering on the page — the coach's own and Leland's —
// keyed by a stable id ("custom:slug" / "leland:slug"). Used to drive the grid
// order and the reorder modal's rows.
type OfferingRow = { id: string; title: string; subtitle: string; image?: string };
const OFFERING_ROWS: OfferingRow[] = [
  ...OFFERINGS.map((o) => ({
    id: `custom:${o.slug}`,
    title: o.title,
    subtitle: `${o.startingAt ? "Starting at " : ""}${o.price}`,
    image: o.image,
  })),
  ...LELAND_PACKAGES.map((p) => {
    const low = Math.min(...p.tiers.map((t) => t.price));
    return {
      id: `leland:${p.slug}`,
      title: p.title,
      subtitle: `${p.tiers.length > 1 ? "Starting at " : ""}${fmtPrice(low)}`,
      image: p.image,
    };
  }),
];
const ROW_BY_ID: Record<string, OfferingRow> = Object.fromEntries(OFFERING_ROWS.map((r) => [r.id, r]));
const OFFERING_BY_SLUG: Record<string, Offering> = Object.fromEntries(OFFERINGS.map((o) => [o.slug, o]));
const PACKAGE_BY_SLUG: Record<string, LelandPackage> = Object.fromEntries(LELAND_PACKAGES.map((p) => [p.slug, p]));
const DEFAULT_OFFERING_ORDER = OFFERING_ROWS.map((r) => r.id);

// Recurring memberships for the v5 Subscriptions tab. The prototype's offerings
// don't model a billing cadence, so subscriptions are their own small catalog:
// a monthly/annual price, a member count, and the perks each tier includes.
type SubscriptionPlan = {
  slug: string;
  title: string;
  headline: string;
  monthly: number;
  annual: number;
  members: number;
  image?: string;
  perks: string[];
};
const SUBSCRIPTIONS: SubscriptionPlan[] = [
  {
    slug: "mba-insider-membership",
    title: "MBA Insider Membership",
    headline: "Monthly group coaching, live Q&A, and a members-only resource library.",
    monthly: 49,
    annual: 490,
    members: 128,
    image: OFFERING_BY_SLUG["how-i-got-into-stanford-gsb"]?.image,
    perks: ["2 live group sessions / month", "Members-only content library", "Priority essay feedback"],
  },
  {
    slug: "premium-mentorship",
    title: "Premium 1:1 Mentorship",
    headline: "A standing monthly 1:1, unlimited async review, and full content access.",
    monthly: 299,
    annual: 2990,
    members: 24,
    image: OFFERING_BY_SLUG["gmat-study-plan"]?.image,
    perks: ["Monthly 1:1 coaching call", "Unlimited async essay review", "Everything in Insider"],
  },
];

// Modal that lists every offering as a draggable row so the coach can reorder how
// they appear on the listing. Rows mirror the horizontal cards on the public
// profile (thumbnail + title + price), with a drag handle in place of "Details".
function ReorderModal({ open, order, onClose, onSave }: { open: boolean; order: string[]; onClose: () => void; onSave: (order: string[]) => void }) {
  const [localOrder, setLocalOrder] = useState(order);

  useEffect(() => {
    if (open) setLocalOrder(order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[88vh] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            <div className="relative flex items-center justify-center border-b border-gray-stroke px-6 py-4">
              <p className="text-[15px] font-semibold text-gray-dark">Reorder offerings</p>
              <button onClick={onClose} aria-label="Close" className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-stroke text-gray-dark transition-colors hover:bg-gray-hover">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-2 pt-5">
              <p className="mb-3 px-1 text-[14px] text-gray-light">Drag to change the order offerings appear on your profile.</p>
              <Reorder.Group axis="y" values={localOrder} onReorder={setLocalOrder} className="flex flex-col gap-1">
                {localOrder.map((id) => {
                  const row = ROW_BY_ID[id];
                  if (!row) return null;
                  return (
                    <Reorder.Item
                      key={id}
                      value={id}
                      className="flex cursor-grab items-center gap-3 rounded-xl bg-white px-2 py-2.5 transition-colors hover:bg-gray-hover active:cursor-grabbing"
                    >
                      <img src={dragDotsIcon} alt="" className="h-5 w-auto shrink-0 opacity-50" />
                      {row.image && <img src={row.image} alt="" className="h-10 w-[60px] shrink-0 rounded-md object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold leading-tight text-gray-dark">{row.title}</p>
                        <p className="mt-0.5 truncate text-[13px] text-gray-light">{row.subtitle}</p>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-stroke px-7 py-5">
              <Button size="lg" variant="white" rounded="rounded-full" className="flex-1 border border-gray-stroke font-semibold" onClick={onClose}>Cancel</Button>
              <Button size="lg" variant="primary" rounded="rounded-full" className="flex-1 font-semibold" onClick={() => onSave(localOrder)}>Save changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// v2 — one card per product modality, holding that modality's offerings (or an
// empty state). Offerings run in a horizontal carousel (header chevrons + a
// footer "See all"), matching the Dashboard's "My content" CardCarousel so the
// cards page rather than wrap to multiple rows.
function ModalityCard({ modality, offerings, onPreview, onEdit, onAdd, onSeeAll }: {
  modality: (typeof MODALITIES)[number];
  offerings: Offering[];
  onPreview: (o: Offering) => void;
  onEdit: (o: Offering) => void;
  onAdd: () => void;
  onSeeAll: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const empty = offerings.length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1;
      setPage(Math.round(el.scrollLeft / w));
      setPages(Math.max(1, Math.ceil(el.scrollWidth / w)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [offerings.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={boxClass}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-[18px] font-semibold text-gray-dark">{modality.name}</h3>
        <div className="flex shrink-0 items-center gap-2">
          {!empty && (
            <div className="flex items-center gap-2">
              <button onClick={() => scrollByPage(-1)} disabled={page <= 0} aria-label="Previous" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] text-gray-dark transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scrollByPage(1)} disabled={page >= pages - 1} aria-label="Next" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] text-gray-dark transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}
          <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={onAdd}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add
          </Button>
        </div>
      </div>
      {empty ? (
        <p className="rounded-xl bg-gray-hover px-4 py-6 text-center text-[14px] text-gray-light">No {modality.name.toLowerCase()} offerings yet.</p>
      ) : (
        <>
          {/* Carousel breaks out of the card's p-6 to run edge-to-edge; the inner
              track's px-6 keeps the first/last cards aligned, and the gradients
              fade cards at both edges. */}
          <div className="relative -mx-6">
            <div ref={scrollRef} className="scrollbar-hide snap-x snap-mandatory scroll-pl-6 overflow-x-auto py-1">
              <div className="flex w-max items-stretch gap-4 px-6">
                {offerings.map((o) => (
                  <div key={o.slug} className="w-[280px] shrink-0 snap-start">
                    <CoachOfferingCard offering={o} onPreview={() => onPreview(o)} onEdit={() => onEdit(o)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
          </div>
          <Button onClick={onSeeAll} size="md" variant="secondary" className="mt-4 self-start font-semibold">
            See all
          </Button>
        </>
      )}
    </div>
  );
}

// v3 — Live group sessions (pulled from the Free Livestreams list) above a single,
// filterable Offerings grid that sits directly on the page (no parent card).
function CategoryV3Content({ category }: { category: string | undefined }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const FILTERS = [
    { key: "all", label: "All" },
    { key: "hourly", label: "Hourly" },
    { key: "async", label: "Content" },
    { key: "package", label: "Bundles" },
    { key: "subscription", label: "Subscriptions" },
  ];
  // Source dropdown (matches v1): All / Created by you / Created by Leland. The
  // coach's offerings are all their own, so "Leland" shows none.
  const [source, setSource] = useState<OfferingFilter>("all");
  const [sourceMenuOpen, setSourceMenuOpen] = useState(false);
  const sourceMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sourceMenuOpen) return;
    const onDown = (e: MouseEvent) => { if (sourceMenuRef.current && !sourceMenuRef.current.contains(e.target as Node)) setSourceMenuOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [sourceMenuOpen]);
  const sourceLabel = OFFERING_FILTERS.find((f) => f.key === source)?.label ?? "All";

  const nonLive = OFFERINGS.filter((o) => modalityForOffering(o) !== "live");
  const bySource = source === "leland" ? [] : nonLive;
  const shown = filter === "all" ? bySource : bySource.filter((o) => modalityForOffering(o) === filter);
  const onPreview = (o: Offering) => navigate(`/offering/${o.slug}`);
  const onEdit = (o: Offering) => navigate(`/my-leland/manage/${category}/new-product?edit=${o.slug}`);

  return (
    <>
      {/* Live group sessions — scheduled, so rendered as session cards inside a
          parent card (matching the v2 card layout). */}
      <section className={boxClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-gray-dark">Live group sessions</h2>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new`)}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add
          </Button>
        </div>
        <div className="-mx-6 mt-2 divide-y divide-gray-stroke border-t border-gray-stroke">
          {[...upcomingLivestreams].reverse().map((item) => (
            <EventRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Offerings — one filterable grid, no parent card background. */}
      <section>
        <h2 className="text-[18px] font-semibold text-gray-dark">Offerings</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Left — modality filter buttons. */}
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#222222]/5 p-1">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${active ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          {/* Right — reorder + source dropdown + New (matches v1 controls). */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold">
              <img src={sortIcon} alt="" className="h-4 w-4" />
              Reorder
            </Button>
            <div className="relative" ref={sourceMenuRef}>
              <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setSourceMenuOpen((o) => !o)}>
                {sourceLabel}
                <svg className={`h-4 w-4 text-gray-light transition-transform ${sourceMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </Button>
              <AnimatePresence>
                {sourceMenuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-30 mt-2 w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    {OFFERING_FILTERS.map((f) => (
                      <button key={f.key} onClick={() => { setSource(f.key); setSourceMenuOpen(false); }} className="flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                        {f.label}
                        {source === f.key && (<svg className="h-[18px] w-[18px] shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new`)}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              New
            </Button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((o) => (
            <CoachOfferingCard key={o.slug} offering={o} onPreview={() => onPreview(o)} onEdit={() => onEdit(o)} />
          ))}
        </div>
      </section>
    </>
  );
}

// A live group-session card for the v4 Offerings grid — matches CoachOfferingCard
// (cover, title, subtext, price, hover Preview/Edit) but adds the blue calendar
// chip (the same CalendarIcon used in the home feed's Upcoming sessions) to the
// top-left corner over the thumbnail, marking it as a scheduled live session.
function LiveSessionCard({ item, onPreview, onEdit }: { item: (typeof upcomingLivestreams)[number]; onPreview: () => void; onEdit: () => void }) {
  const day = item.date.match(/\d+/)?.[0] ?? "";
  const price = item.pricing.kind === "free" ? "Free" : item.pricing.price;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]">
      <div className="relative">
        {item.thumb ? (
          <img src={item.thumb} alt="" className="aspect-[1200/630] w-full object-cover" />
        ) : (
          <div className="flex aspect-[1200/630] w-full items-center justify-center bg-[#D9D9D9]">
            <MaskIcon src={videoIcon} className="h-9 w-9 text-white" />
          </div>
        )}
        {/* Blue calendar chip — top-left, on top of the thumbnail. */}
        <div className="absolute left-3 top-3">
          <CalendarIcon day={day} />
        </div>
        {/* Hover: darken the thumbnail and reveal Preview + Edit controls. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button onClick={onPreview} aria-label="Preview session" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={eyeIcon} alt="" className="h-5 w-5" />
          </button>
          <button onClick={onEdit} aria-label="Edit session" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={editIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[15px] font-semibold leading-tight text-gray-dark">{item.title}</p>
        <p className="mt-1 text-[14px] leading-snug text-gray-light">{item.date} · {item.startTime}</p>
        <div className="mt-auto pt-3">
          <p className="text-[14px] font-semibold text-gray-dark">{price}</p>
        </div>
      </div>
    </div>
  );
}

// v4 — like v3 but the Live group sessions section is gone; those sessions are
// folded into the single Offerings grid as cards (with a "Live group learning"
// filter tag and the blue calendar chip), so everything the coach sells lives in
// one place.
function CategoryV4Content({ category }: { category: string | undefined }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const FILTERS = [
    { key: "all", label: "All" },
    { key: "live", label: "Live group learning" },
    { key: "hourly", label: "Hourly" },
    { key: "async", label: "Content" },
    { key: "package", label: "Bundles" },
    { key: "subscription", label: "Subscriptions" },
  ];
  // Source dropdown (matches v1/v3): All / Created by you / Created by Leland.
  const [source, setSource] = useState<OfferingFilter>("all");
  const [sourceMenuOpen, setSourceMenuOpen] = useState(false);
  const sourceMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sourceMenuOpen) return;
    const onDown = (e: MouseEvent) => { if (sourceMenuRef.current && !sourceMenuRef.current.contains(e.target as Node)) setSourceMenuOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [sourceMenuOpen]);
  const sourceLabel = OFFERING_FILTERS.find((f) => f.key === source)?.label ?? "All";

  // Live sessions are the coach's own, so they're hidden under the "Leland"
  // source. They show when the filter is "all" or "live".
  const nonLive = OFFERINGS.filter((o) => modalityForOffering(o) !== "live");
  const showLive = source !== "leland" && (filter === "all" || filter === "live");
  const offeringItems = source === "leland" || filter === "live"
    ? []
    : filter === "all"
      ? nonLive
      : nonLive.filter((o) => modalityForOffering(o) === filter);
  const onPreview = (o: Offering) => navigate(`/offering/${o.slug}`);
  const onEdit = (o: Offering) => navigate(`/my-leland/manage/${category}/new-product?edit=${o.slug}`);

  return (
    <section>
      <h2 className="text-[18px] font-semibold text-gray-dark">Offerings</h2>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left — modality filter buttons (now including Live group learning). */}
        <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#222222]/5 p-1">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${active ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        {/* Right — reorder + source dropdown + New (matches v1/v3 controls). */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold">
            <img src={sortIcon} alt="" className="h-4 w-4" />
            Reorder
          </Button>
          <div className="relative" ref={sourceMenuRef}>
            <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setSourceMenuOpen((o) => !o)}>
              {sourceLabel}
              <svg className={`h-4 w-4 text-gray-light transition-transform ${sourceMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </Button>
            <AnimatePresence>
              {sourceMenuOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-30 mt-2 w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                  {OFFERING_FILTERS.map((f) => (
                    <button key={f.key} onClick={() => { setSource(f.key); setSourceMenuOpen(false); }} className="flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                      {f.label}
                      {source === f.key && (<svg className="h-[18px] w-[18px] shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new`)}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New
          </Button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Live sessions lead the grid, then the rest of the offerings. */}
        {showLive && [...upcomingLivestreams].reverse().map((item) => (
          <LiveSessionCard key={item.id} item={item} onPreview={() => navigate("/events")} onEdit={() => navigate("/my-leland/livestreams")} />
        ))}
        {offeringItems.map((o) => (
          <CoachOfferingCard key={o.slug} offering={o} onPreview={() => onPreview(o)} onEdit={() => onEdit(o)} />
        ))}
      </div>
    </section>
  );
}

// "Offerings" heading + a pill filter + a grid of offering cards. The coach's
// own offerings lead the grid (behind the dashed "New offering" tile), and
// Leland's standardized packages come last (each with a "Created by Leland"
// badge + offer toggle). The filter narrows the grid to one source. gridClass
// sets the column layout so the wide (v1) and modality-card (v2) layouts differ.
function OfferingsSection({ category, gridClass }: { category: string | undefined; gridClass: string }) {
  const navigate = useNavigate();
  // Per-package offer state, seeded from each package's default.
  const [offered, setOffered] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(LELAND_PACKAGES.map((p) => [p.slug, p.offered])),
  );
  // Whether each package's price is synced to the coach's hourly rate.
  const [synced, setSynced] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(LELAND_PACKAGES.map((p) => [p.slug, true])),
  );
  // Per-package, per-tier prices, seeded from Leland's recommended prices.
  const [prices, setPrices] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(LELAND_PACKAGES.map((p) => [p.slug, p.tiers.map((t) => t.price)])),
  );
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const editingPkg = LELAND_PACKAGES.find((p) => p.slug === editingSlug) ?? null;

  // Display order of all offerings (custom + Leland), reorderable via the modal.
  const [order, setOrder] = useState<string[]>(DEFAULT_OFFERING_ORDER);
  const [reorderOpen, setReorderOpen] = useState(false);

  const [filter, setFilter] = useState<OfferingFilter>("all");
  const showYours = filter === "all" || filter === "you";
  const showLeland = filter === "all" || filter === "leland";

  // Filter dropdown (styled like "Sort by") + click-outside handling.
  const [menuOpen, setMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);
  const currentFilterLabel = OFFERING_FILTERS.find((f) => f.key === filter)?.label ?? "All";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-semibold text-gray-dark">Offerings</h2>
        <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setReorderOpen(true)}>
          <img src={sortIcon} alt="" className="h-4 w-4" />
          Reorder
        </Button>
        <div className="relative" ref={filterMenuRef}>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setMenuOpen((o) => !o)}>
            {currentFilterLabel}
            <svg className={`h-4 w-4 text-gray-light transition-transform ${menuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </Button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-30 mt-2 w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
              >
                {OFFERING_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setFilter(f.key); setMenuOpen(false); }}
                    className="flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                  >
                    {f.label}
                    {filter === f.key && (
                      <svg className="h-[18px] w-[18px] shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
      <div className={`grid gap-4 ${gridClass}`}>
        {/* Add-new tile — leads the coach's own offerings. */}
        {showYours && (
          <button
            onClick={() => navigate(`/my-leland/manage/${category}/new`)}
            style={dashedBorderStyle}
            className="group relative flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl bg-gray-hover transition-colors hover:bg-[#eeeeee]"
          >
            <span aria-hidden style={dashedBorderHoverStyle} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
            <svg className="h-7 w-7 text-gray-extra-light transition-colors group-hover:text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            <span className="text-[15px] font-semibold leading-tight text-gray-extra-light transition-colors group-hover:text-gray-light">New product</span>
          </button>
        )}
        {/* Cards rendered in the coach's chosen order; the filter hides sources. */}
        {order.map((id) => {
          const [kind, slug] = id.split(":");
          if (kind === "custom") {
            if (!showYours) return null;
            const o = OFFERING_BY_SLUG[slug];
            if (!o) return null;
            return (
              <CoachOfferingCard
                key={id}
                offering={o}
                onPreview={() => navigate(`/offering/${o.slug}`)}
                onEdit={() => navigate(`/my-leland/manage/${category}/new-product?edit=${o.slug}`)}
              />
            );
          }
          if (!showLeland) return null;
          const p = PACKAGE_BY_SLUG[slug];
          if (!p) return null;
          return (
            <StandardizedPackageCard
              key={id}
              pkg={p}
              prices={prices[p.slug]}
              offered={offered[p.slug]}
              onToggle={(v) => setOffered((s) => ({ ...s, [p.slug]: v }))}
              onPreview={() => navigate(`/offering/${p.slug}`)}
              onEditPrice={() => setEditingSlug(p.slug)}
            />
          );
        })}
      </div>

      <PackagePriceModal
        pkg={editingPkg}
        synced={editingSlug ? synced[editingSlug] : true}
        prices={editingSlug ? prices[editingSlug] : []}
        onPreview={() => { if (editingSlug) navigate(`/offering/${editingSlug}`); }}
        onClose={() => setEditingSlug(null)}
        onSave={(nextSynced, nextPrices) => {
          if (!editingSlug) return;
          setSynced((s) => ({ ...s, [editingSlug]: nextSynced }));
          setPrices((s) => ({ ...s, [editingSlug]: nextPrices }));
          setEditingSlug(null);
        }}
      />

      <ReorderModal
        open={reorderOpen}
        order={order}
        onClose={() => setReorderOpen(false)}
        onSave={(next) => { setOrder(next); setReorderOpen(false); }}
      />
    </div>
  );
}

const boxClass ="flex h-full flex-col rounded-[20px] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

type FirstStep = { type: "free" | "trial"; discountPct: number; durationMin: number };
const DISCOUNT_OPTIONS = [25, 50, 75];
// Trial-session length options, in 15-minute increments up to an hour.
const DURATION_OPTIONS = [15, 30, 45, 60];
const fmtDuration = (m: number) => (m === 60 ? "1 hr" : `${m} min`);

// Left card (spans two columns) — avatar + name, an Edit link to the details
// modal, the serif headline, service-tag chips, and a truncated qualifications
// blurb.
function CategoryInfoCard({ settings, onEdit, category, className = "" }: { settings: ListingSettings; onEdit: () => void; category: string | undefined; className?: string }) {
  return (
    <section className={`${boxClass} ${className}`}>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <img src={pic6} alt="Samantha Parker" className="h-[72px] w-[72px] rounded-full object-cover" />
          <button onClick={onEdit} className="flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-gray-dark transition-opacity hover:opacity-70">
            <img src={editIcon} alt="" className="h-[16px] w-[16px]" />
            <span className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">Edit</span>
          </button>
        </div>

        <h2 className="mt-4 font-serif text-[26px] leading-tight text-gray-dark">{settings.headline}</h2>

        <p className="mt-4 line-clamp-3 text-[14px] leading-[1.4] text-gray-light">{settings.qualifications}</p>
      </div>

      <LinkButton size="lg" variant="white" rounded="rounded-full" href={`/profile/samantha-parker/${category}`} className="mt-auto w-full border border-gray-stroke text-[15px] font-semibold">
        <img src={eyeIcon} alt="" className="h-[18px] w-[18px]" />
        Preview listing
      </LinkButton>
    </section>
  );
}

// Public profile card for this category listing — mirrors the Profile tab's
// "Public profile" card (editable URL + copy + View public profile).
function CategoryPublicProfileCard({ category, className = "" }: { category: string | undefined; className?: string }) {
  const path = `samantha-parker/${category}`;
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard?.writeText(`leland.com/${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className={`${boxClass} ${className}`}>
      <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Public profile</h2>
      <div className="flex items-center gap-1.5 rounded-lg bg-gray-hover px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-[13px] text-gray-dark">leland.com/{path}</span>
        <button type="button" onClick={copyLink} aria-label={copied ? "Copied" : "Copy link"} title={copied ? "Copied" : "Copy link"} className="shrink-0 text-gray-light transition-colors hover:text-gray-dark">
          {copied ? (
            <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6L9 17l-5-5" vectorEffect="non-scaling-stroke" /></svg>
          ) : (
            <MaskIcon src={copyIcon} className="h-[16px] w-[16px]" />
          )}
        </button>
        <button type="button" aria-label="Edit URL" title="Edit URL" className="shrink-0 text-gray-light transition-colors hover:text-gray-dark">
          <MaskIcon src={editIcon} className="h-[16px] w-[16px]" />
        </button>
      </div>
      <LinkButton size="lg" variant="white" rounded="rounded-full" href={`/profile/${path}`} className="mt-4 w-full border border-gray-stroke font-semibold">
        <MaskIcon src={eyeIcon} className="h-[16px] w-[16px]" />
        View public profile
      </LinkButton>
    </section>
  );
}

// First-step picker — a borderless serif dropdown; picking "Paid trial session"
// reveals a discount selector.
const revealBtnClass = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover";

function FirstStepDropdown({ value, onChange }: { value: FirstStep; onChange: (v: FirstStep) => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center p-6">
      <div className="group relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] text-gray-light">First step</p>
          <p className="mt-1 font-serif text-[24px] leading-tight text-gray-dark">
            {value.type === "free" ? "Free intro call" : "Paid trial session"}
          </p>
        </div>
        <span className={`${revealBtnClass} group-hover:bg-gray-hover`} aria-hidden>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
        <select
          value={value.type}
          onChange={(e) => onChange({ ...value, type: e.target.value as FirstStep["type"] })}
          aria-label="First step"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          <option value="free">Free intro call</option>
          <option value="trial">Paid trial session</option>
        </select>
      </div>

      {value.type === "trial" && (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-gray-light">Session length</p>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((min) => {
                const on = value.durationMin === min;
                return (
                  <button
                    key={min}
                    type="button"
                    onClick={() => onChange({ ...value, durationMin: min })}
                    className={`flex-1 rounded-lg border py-1.5 text-[13px] font-semibold transition-colors ${on ? "border-gray-dark bg-gray-dark text-white" : "border-gray-stroke text-gray-dark hover:border-gray-dark"}`}
                  >
                    {fmtDuration(min)}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-medium text-gray-light">Discount off your hourly rate</p>
            <div className="flex gap-2">
              {DISCOUNT_OPTIONS.map((pct) => {
                const on = value.discountPct === pct;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => onChange({ ...value, discountPct: pct })}
                    className={`flex-1 rounded-lg border py-1.5 text-[13px] font-semibold transition-colors ${on ? "border-gray-dark bg-gray-dark text-white" : "border-gray-stroke text-gray-dark hover:border-gray-dark"}`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hourly rate — a serif display with a pencil that swaps in a text input and a
// Save button.
function HourlyRateSection({ rate, onChange }: { rate: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rate);

  const startEdit = () => { setDraft(rate); setEditing(true); };
  const save = () => { onChange(draft); setEditing(false); };

  return (
    <div className="flex flex-1 flex-col justify-center p-6">
      {editing ? (
        <div>
          <p className="text-[15px] text-gray-light">Hourly rate</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-gray-dark">$</span>
              <input
                autoFocus
                inputMode="numeric"
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => { if (e.key === "Enter") save(); }}
                placeholder="0"
                className="w-[110px] rounded-lg border border-gray-stroke bg-white py-2 pl-7 pr-3 text-[16px] font-semibold text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
              />
            </div>
            <Button size="sm" variant="primary" rounded="rounded-full" onClick={save}>Save</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] text-gray-light">Hourly rate</p>
            <p className="mt-1 font-serif text-[24px] leading-tight text-gray-dark">${rate || "0"} per hour</p>
          </div>
          <button onClick={startEdit} aria-label="Edit hourly rate" className={revealBtnClass}>
            <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
}

// Right card — first step (dropdown) stacked over hourly rate (inline edit),
// split by a divider.
function CategoryPricingCard({ firstStep, onFirstStepChange, rate, onRateChange }: { firstStep: FirstStep; onFirstStepChange: (v: FirstStep) => void; rate: string; onRateChange: (v: string) => void }) {
  return (
    <section className="flex h-full flex-col divide-y divide-[#222222]/10 rounded-[20px] bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10">
      <HourlyRateSection rate={rate} onChange={onRateChange} />
      <FirstStepDropdown value={firstStep} onChange={onFirstStepChange} />
    </section>
  );
}

// ─── v2 ─────────────────────────────────────────────────────────────────────

// Per-category analytics card — mirrors the coach Dashboard's "Analytics"
// roll-up (label + big value + mini area chart), trimmed to three metrics to
// fit the two-column card. Sparkline logic matches the Dashboard's.
const SPARK_COLOR = "#94370C";
type CategoryAnalytics = { views: string; leads: string; bookings: string };
// Label + decorative sparkline shape per metric; the numeric values come from
// each category's data so the card reads differently per listing.
const ANALYTICS_BASE = [
  { key: "views" as const, label: "Listing views", data: [40, 45, 50, 48, 55, 60, 58, 66, 70, 68, 75, 80, 78, 85, 90, 95] },
  { key: "leads" as const, label: "New leads", data: [1, 0, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7] },
  { key: "bookings" as const, label: "Bookings", data: [100, 150, 120, 200, 250, 220, 300, 350, 320, 400, 450, 420, 500, 550, 600, 650] },
];

function Sparkline({ id, data }: { id: string; data: number[] }) {
  const w = 100;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const line = data
    .map((v, i) => `${((i / (data.length - 1)) * w).toFixed(2)},${(h - ((v - min) / range) * h).toFixed(2)}`)
    .join(" ");
  const gid = `spark-${id}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-24">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SPARK_COLOR} stopOpacity="0.22" />
          <stop offset="100%" stopColor={SPARK_COLOR} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={SPARK_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function CategoryAnalyticsCard({ analytics, className = "", onSeeAll }: { analytics: CategoryAnalytics; className?: string; onSeeAll?: () => void }) {
  return (
    <section className={`${boxClass} ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-[19px] font-semibold leading-tight text-gray-dark">Analytics</h2>
        {onSeeAll ? (
          <button type="button" onClick={onSeeAll} className="text-[15px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">View all</button>
        ) : (
          <Link to="/coach/earnings" className="text-[15px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">See all</Link>
        )}
      </div>
      <div className="mt-6 flex flex-1 items-center">
        <div className="grid w-full grid-cols-3 gap-x-6">
          {ANALYTICS_BASE.map((m, i) => (
            <div key={m.key} className={`text-center ${i > 0 ? "border-l border-[#222222]/10 pl-6" : ""}`}>
              <p className="text-[13px] font-semibold leading-tight text-gray-extra-light">{m.label}</p>
              <p className="mt-3 text-[24px] font-bold leading-none text-gray-dark">{analytics[m.key]}</p>
              <div className="mt-4 flex justify-center">
                <Sparkline id={m.key} data={m.data} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reusable modal chrome: portal, backdrop, animated panel, close button, a
// serif title + subtitle, scrollable body, and a full-width "Done" footer.
function ModalShell({ open, title, subtitle, onClose, children }: { open: boolean; title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            <div className="flex-1 overflow-y-auto px-7 pb-2 pt-8">
              <h2 className="pr-10 font-serif text-[28px] leading-tight text-gray-dark">{title}</h2>
              <p className="mt-1.5 text-[15px] text-gray-light">{subtitle}</p>
              <div className="mt-6">{children}</div>
            </div>

            <div className="px-7 pb-7 pt-3">
              <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" onClick={onClose}>Done</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Modal for editing all of the "set it and forget it" listing settings.
function ListingSettingsModal({ open, settings, allServices, onPatch, onClose }: { open: boolean; settings: ListingSettings; allServices: string[]; onPatch: (patch: Partial<ListingSettings>) => void; onClose: () => void }) {
  const toggleService = (s: string) =>
    onPatch({ services: settings.services.includes(s) ? settings.services.filter((x) => x !== s) : [...settings.services, s] });

  return (
    <ModalShell open={open} onClose={onClose} title="Edit listing details" subtitle="These details appear on your public listing for this category.">
      <div className="flex flex-col gap-5">
        <div>
          <label className={labelClass}>Headline</label>
          <input value={settings.headline} onChange={(e) => onPatch({ headline: e.target.value })} placeholder="A short headline for this category" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Years of experience</label>
            <input inputMode="numeric" value={settings.yearsOfExperience} onChange={(e) => onPatch({ yearsOfExperience: e.target.value.replace(/[^0-9]/g, "") })} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Level of experience</label>
            <select value={settings.levelOfExperience} onChange={(e) => onPatch({ levelOfExperience: e.target.value })} className={inputClass}>
              {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Qualifications</label>
          <textarea value={settings.qualifications} onChange={(e) => onPatch({ qualifications: e.target.value })} rows={6} placeholder="Describe your experience and qualifications for this category." className={`${inputClass} resize-none leading-relaxed`} />
        </div>

        <div>
          <label className={labelClass}>Areas of expertise</label>
          <div className="flex flex-wrap gap-2">
            {allServices.map((s) => {
              const on = settings.services.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${on ? "bg-gray-dark text-white" : "bg-[#222222]/5 text-gray-extra-light hover:bg-[#222222]/10"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClass}>Category video</label>
          <input value={settings.videoLink} onChange={(e) => onPatch({ videoLink: e.target.value })} placeholder="Paste a video link" className={inputClass} />
          <p className="mt-1.5 text-[13px] text-gray-light">Adding a video here overrides the video from your Profile page for this category.</p>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── v5 ─────────────────────────────────────────────────────────────────────
// A tabbed category workspace: a horizontal tab bar separates the pieces a coach
// manages (Overview, Group Sessions, Offerings, Subscriptions, Analytics,
// Settings). Overview previews each area with a quick entry point into its tab.

const V5_TABS = [
  { key: "overview", label: "Overview" },
  { key: "group-sessions", label: "Group Sessions" },
  { key: "offerings", label: "Offerings" },
  { key: "content", label: "Content" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
] as const;
type V5Tab = (typeof V5_TABS)[number]["key"];

const ChevronRight = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);
const PlusIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
);

// Horizontal tab bar — underline indicator slides between tabs via a shared
// layoutId. Scrolls horizontally on narrow viewports.
function V5TabBar({ tab, onTab }: { tab: V5Tab; onTab: (t: V5Tab) => void }) {
  return (
    <div className="mt-10 border-b border-[#222222]/10">
      <div className="scrollbar-hide -mb-px flex gap-1 overflow-x-auto">
        {V5_TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onTab(t.key)}
              className={`relative whitespace-nowrap px-4 py-3 text-[15px] font-semibold transition-colors ${active ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"}`}
            >
              {t.label}
              {active && <motion.span layoutId="v5-tab-underline" className="absolute inset-x-3 -bottom-px h-[2.5px] rounded-full bg-gray-dark" transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Subscription card for the v5 Subscriptions tab — mirrors CoachOfferingCard
// (cover, title, headline, hover Preview/Edit) but carries a recurring badge, a
// short perk list, a /mo price, and a member count.
function SubscriptionCard({ plan, onPreview, onEdit }: { plan: SubscriptionPlan; onPreview: () => void; onEdit: () => void }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]">
      <div className="relative">
        {plan.image ? (
          <img src={plan.image} alt="" className="aspect-[1200/630] w-full object-cover" />
        ) : (
          <div className="flex aspect-[1200/630] w-full items-center justify-center bg-[#D9D9D9]">
            <MaskIcon src={repostIcon} className="h-9 w-9 text-white" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-2.5 pr-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.18)]">
          <MaskIcon src={repostIcon} className="h-3.5 w-3.5 text-gray-dark" />
          <span className="text-[12px] font-semibold text-gray-dark">Subscription</span>
        </span>
        {/* Hover: darken the thumbnail and reveal Preview + Edit controls. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button onClick={onPreview} aria-label="Preview subscription" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={eyeIcon} alt="" className="h-5 w-5" />
          </button>
          <button onClick={onEdit} aria-label="Edit subscription" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-dark shadow-[0_2px_8px_rgba(16,24,40,0.2)] transition-colors hover:bg-gray-hover">
            <img src={editIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[15px] font-semibold leading-tight text-gray-dark">{plan.title}</p>
        <p className="mt-1 text-[14px] leading-snug text-gray-light">{plan.headline}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {plan.perks.slice(0, 3).map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-[13px] leading-snug text-gray-dark">
              <svg className="mt-0.5 h-[15px] w-[15px] shrink-0 text-[#1B8A54]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              {perk}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="flex items-baseline gap-1 text-[15px] font-semibold text-gray-dark">
            ${plan.monthly}
            <span className="text-[13px] font-normal text-gray-light">/mo</span>
          </p>
          <span className="text-[12px] font-medium text-gray-extra-light">{plan.members} members</span>
        </div>
      </div>
    </div>
  );
}

// Overview preview card — a titled section with an optional count chip and a
// "Manage" button that jumps to the matching tab.
function OverviewSection({ title, count, onManage, children }: { title: string; count?: number; onManage: () => void; children: ReactNode }) {
  return (
    <section className={boxClass}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[18px] font-semibold text-gray-dark">{title}</h2>
          {count != null && <span className="rounded-full bg-[#222222]/5 px-2 py-0.5 text-[12px] font-semibold text-gray-light">{count}</span>}
        </div>
        <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold" onClick={onManage}>
          Manage
          <ChevronRight />
        </Button>
      </div>
      {children}
    </section>
  );
}

// Shared list of this category's non-live offerings (live sessions live in the
// Group Sessions tab; subscriptions in their own tab).
const V5_OFFERINGS = OFFERINGS.filter((o) => modalityForOffering(o) !== "live");

function V5Overview({ category, data, settings, onEditSettings, setTab }: {
  category: string | undefined;
  data: (typeof categoryData)[string];
  settings: ListingSettings;
  onEditSettings: () => void;
  setTab: (t: V5Tab) => void;
}) {
  const navigate = useNavigate();
  const content = RESOURCES.filter((r) => resourceMatchesCategory(r.category, data.name));
  return (
    <div className="flex flex-col gap-5">
      {/* Listing summary + analytics snapshot. */}
      <div className="grid gap-5 lg:grid-cols-2">
        <CategoryInfoCard settings={settings} onEdit={onEditSettings} category={category} />
        <CategoryAnalyticsCard analytics={data.analytics} onSeeAll={() => setTab("analytics")} />
      </div>

      {/* Group sessions — next couple of scheduled sessions. */}
      <OverviewSection title="Group Sessions" count={upcomingLivestreams.length} onManage={() => setTab("group-sessions")}>
        <div className="-mx-6 divide-y divide-gray-stroke border-t border-gray-stroke">
          {[...upcomingLivestreams].reverse().slice(0, 2).map((item) => (
            <EventRow key={item.id} item={item} />
          ))}
        </div>
      </OverviewSection>

      {/* Offerings — first few cards. */}
      <OverviewSection title="Offerings" count={V5_OFFERINGS.length} onManage={() => setTab("offerings")}>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {V5_OFFERINGS.slice(0, 3).map((o) => (
            <CoachOfferingCard
              key={o.slug}
              offering={o}
              onPreview={() => navigate(`/offering/${o.slug}`)}
              onEdit={() => navigate(`/my-leland/manage/${category}/new-product?edit=${o.slug}`)}
            />
          ))}
        </div>
      </OverviewSection>

      {/* Subscriptions — recurring memberships. */}
      <OverviewSection title="Subscriptions" count={SUBSCRIPTIONS.length} onManage={() => setTab("subscriptions")}>
        <div className="grid gap-5 sm:grid-cols-2">
          {SUBSCRIPTIONS.map((p) => (
            <SubscriptionCard
              key={p.slug}
              plan={p}
              onPreview={() => navigate(`/offering/${p.slug}`)}
              onEdit={() => navigate(`/my-leland/manage/${category}/new-product/subscription`)}
            />
          ))}
        </div>
      </OverviewSection>

      {/* Content — resources tagged to this category. */}
      <OverviewSection title="Content" count={content.length} onManage={() => setTab("content")}>
        {content.length === 0 ? (
          <p className="rounded-xl bg-gray-hover px-4 py-6 text-center text-[14px] text-gray-light">No content tagged to {data.name} yet.</p>
        ) : (
          <div>
            <ContentTableHeader offeringsAlign="left" />
            {content.slice(0, 3).map((r, i, arr) => (
              <ContentRowV1
                key={r.id}
                isLast={i === arr.length - 1}
                d={{
                  cover: <img src={r.cover} alt="" className="h-10 w-[60px] shrink-0 rounded-lg object-cover" />,
                  title: r.title,
                  meta: r.fileType,
                  lelandPlus: r.lelandPlus,
                  views: `${formatViews(r.views)} views`,
                  offerings: r.offerings.length,
                  onClick: () => navigate("/my-leland/content"),
                  onOfferings: () => navigate("/my-leland/content"),
                  ariaLabel: `View details for ${r.title}`,
                }}
              />
            ))}
          </div>
        )}
      </OverviewSection>
    </div>
  );
}

function V5GroupSessionsPanel({ category }: { category: string | undefined }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5">
      {/* Free Livestreams — the CoachLivestreams row UI (Host · Status · Actions). */}
      <section className={boxClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-dark">Free Livestreams</h2>
            <p className="mt-1 text-[14px] text-gray-light">Free live events that grow your audience and bring in new leads.</p>
          </div>
          <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new-product/livestream`)}>
            <PlusIcon />
            New livestream
          </Button>
        </div>
        <div className="-mx-6 mt-4 divide-y divide-gray-stroke border-t border-gray-stroke">
          {[...upcomingLivestreams].reverse().map((item) => (
            <EventRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Paid Group Sessions — the CoachWorkshops row UI (Host · Earnings · Actions). */}
      <section className={boxClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-dark">Paid Group Sessions</h2>
            <p className="mt-1 text-[14px] text-gray-light">Paid live classes — host one on its own or bundle it into an offering.</p>
          </div>
          <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new-product/live`)}>
            <PlusIcon />
            New session
          </Button>
        </div>
        <div className="-mx-6 mt-4 divide-y divide-gray-stroke border-t border-gray-stroke">
          {upcomingWorkshops.map((item) => (
            <WorkshopRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function V5OfferingsPanel({ category }: { category: string | undefined }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const FILTERS = [
    { key: "all", label: "All" },
    { key: "hourly", label: "Hourly" },
    { key: "async", label: "Content" },
    { key: "package", label: "Bundles" },
  ];
  const shown = filter === "all" ? V5_OFFERINGS : V5_OFFERINGS.filter((o) => modalityForOffering(o) === filter);
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-dark">Offerings</h2>
          <p className="mt-1 text-[14px] text-gray-light">Hourly coaching, content, and bundles clients can buy outright.</p>
        </div>
        <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new`)}>
          <PlusIcon />
          New
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1 rounded-full bg-[#222222]/5 p-1 self-start w-fit">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${active ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((o) => (
          <CoachOfferingCard
            key={o.slug}
            offering={o}
            onPreview={() => navigate(`/offering/${o.slug}`)}
            onEdit={() => navigate(`/my-leland/manage/${category}/new-product?edit=${o.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}

// Matches a resource's category label (e.g. "MBA", "Consulting") against this
// page's category name ("MBA", "Management Consulting") with a loose contains
// check, so "Consulting" lands under "Management Consulting".
function resourceMatchesCategory(resourceCategory: string, categoryName: string): boolean {
  const rc = resourceCategory.trim().toLowerCase();
  const name = categoryName.trim().toLowerCase();
  if (!rc) return false;
  return name === rc || name.includes(rc) || rc.includes(name);
}

// Content tab — the same row UI as /my-leland/content, filtered to resources
// tagged with this category. Rows deep-link into the full Content page.
function V5ContentPanel({ category, categoryName }: { category: string | undefined; categoryName: string }) {
  const navigate = useNavigate();
  const matches = RESOURCES.filter((r) => resourceMatchesCategory(r.category, categoryName));
  const goToContent = () => navigate("/my-leland/content");
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-dark">Content</h2>
          <p className="mt-1 text-[14px] text-gray-light">Guides, templates, and recordings tagged to {categoryName}.</p>
        </div>
        <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new-product/async`)}>
          <PlusIcon />
          New content
        </Button>
      </div>
      {matches.length === 0 ? (
        <p className="mt-5 rounded-xl border border-gray-stroke bg-white px-4 py-12 text-center text-[14px] text-gray-light">No content tagged to {categoryName} yet.</p>
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-stroke bg-white px-6">
          <ContentTableHeader offeringsAlign="left" />
          {matches.map((r, i) => (
            <ContentRowV1
              key={r.id}
              isLast={i === matches.length - 1}
              d={{
                cover: <img src={r.cover} alt="" className="h-10 w-[60px] shrink-0 rounded-lg object-cover" />,
                title: r.title,
                meta: r.fileType,
                lelandPlus: r.lelandPlus,
                views: `${formatViews(r.views)} views`,
                offerings: r.offerings.length,
                onClick: goToContent,
                onOfferings: goToContent,
                ariaLabel: `View details for ${r.title}`,
              }}
            />
          ))}
          <button onClick={goToContent} className="-mx-6 flex w-[calc(100%+3rem)] items-center justify-center gap-2 border-t border-gray-stroke px-6 py-4 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover">
            Manage all content
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}

function V5SubscriptionsPanel({ category }: { category: string | undefined }) {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-dark">Subscriptions</h2>
          <p className="mt-1 text-[14px] text-gray-light">Recurring memberships that bill monthly or annually for ongoing access.</p>
        </div>
        <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new-product/subscription`)}>
          <PlusIcon />
          New subscription
        </Button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {SUBSCRIPTIONS.map((p) => (
          <SubscriptionCard
            key={p.slug}
            plan={p}
            onPreview={() => navigate(`/offering/${p.slug}`)}
            onEdit={() => navigate(`/my-leland/manage/${category}/new-product/subscription`)}
          />
        ))}
      </div>
    </section>
  );
}

// Simple revenue-by-offering breakdown for the Analytics tab. Sales counts are
// illustrative; revenue is derived from each offering's real listed price.
function V5OfferingPerformance() {
  const rows = V5_OFFERINGS.slice(0, 6)
    .map((o, i) => {
      const price = Number(o.price.replace(/[^0-9.]/g, "")) || 0;
      const sales = [12, 9, 7, 5, 4, 3][i] ?? 2;
      return { title: o.title, revenue: price * sales, sales };
    })
    .sort((a, b) => b.revenue - a.revenue);
  const max = Math.max(...rows.map((r) => r.revenue), 1);
  return (
    <section className={boxClass}>
      <h2 className="text-[19px] font-semibold leading-tight text-gray-dark">Revenue by offering</h2>
      <div className="mt-5 flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.title}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[14px] text-gray-dark">{r.title}</span>
              <span className="shrink-0 text-[14px] font-semibold text-gray-dark">${r.revenue.toLocaleString()}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#222222]/[0.06]">
              <div className="h-full rounded-full" style={{ width: `${(r.revenue / max) * 100}%`, backgroundColor: SPARK_COLOR }} />
            </div>
            <p className="mt-1 text-[12px] text-gray-extra-light">{r.sales} sales</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function V5AnalyticsPanel({ analytics }: { analytics: CategoryAnalytics }) {
  return (
    <div className="flex flex-col gap-5">
      <CategoryAnalyticsCard analytics={analytics} />
      <V5OfferingPerformance />
    </div>
  );
}

function V5SettingsPanel({ settings, onEditSettings, category, firstStep, onFirstStepChange, rate, onRateChange, showPricingCard }: {
  settings: ListingSettings;
  onEditSettings: () => void;
  category: string | undefined;
  firstStep: FirstStep;
  onFirstStepChange: (v: FirstStep) => void;
  rate: string;
  onRateChange: (v: string) => void;
  showPricingCard: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <CategoryInfoCard settings={settings} onEdit={onEditSettings} category={category} />
        {showPricingCard && <CategoryPricingCard firstStep={firstStep} onFirstStepChange={onFirstStepChange} rate={rate} onRateChange={onRateChange} />}
      </div>
      <CategoryPublicProfileCard category={category} />
    </div>
  );
}

function CategoryV5Content(props: {
  category: string | undefined;
  data: (typeof categoryData)[string];
  settings: ListingSettings;
  onEditSettings: () => void;
  firstStep: FirstStep;
  onFirstStepChange: (v: FirstStep) => void;
  rate: string;
  onRateChange: (v: string) => void;
  showPricingCard: boolean;
}) {
  const { category, data, settings, onEditSettings, firstStep, onFirstStepChange, rate, onRateChange, showPricingCard } = props;
  const navigate = useNavigate();
  const [tab, setTab] = useState<V5Tab>("overview");
  return (
    <>
      {/* Primary actions — new product + edit this category's listing. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button size="lg" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => navigate(`/my-leland/manage/${category}/new`)}>
          <PlusIcon className="h-5 w-5" />
          New
        </Button>
        <Button size="lg" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={onEditSettings}>
          <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
          Edit category profile
        </Button>
      </div>

      <V5TabBar tab={tab} onTab={setTab} />
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "overview" && (
              <V5Overview category={category} data={data} settings={settings} onEditSettings={onEditSettings} setTab={setTab} />
            )}
            {tab === "group-sessions" && <V5GroupSessionsPanel category={category} />}
            {tab === "offerings" && <V5OfferingsPanel category={category} />}
            {tab === "content" && <V5ContentPanel category={category} categoryName={data.name} />}
            {tab === "subscriptions" && <V5SubscriptionsPanel category={category} />}
            {tab === "analytics" && <V5AnalyticsPanel analytics={data.analytics} />}
            {tab === "settings" && (
              <V5SettingsPanel
                settings={settings}
                onEditSettings={onEditSettings}
                category={category}
                firstStep={firstStep}
                onFirstStepChange={onFirstStepChange}
                rate={rate}
                onRateChange={onRateChange}
                showPricingCard={showPricingCard}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default function CoachCategoryEdit() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const data = categoryData[category ?? ""];

  const [settings, setSettings] = useState<ListingSettings | null>(() =>
    data ? {
      headline: data.headline,
      yearsOfExperience: data.yearsOfExperience,
      levelOfExperience: data.levelOfExperience,
      qualifications: data.qualifications,
      services: data.services,
      videoLink: data.videoLink,
    } : null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(() => data?.hourlyRate ?? "150");
  const [firstStep, setFirstStep] = useState<FirstStep>({ type: "free", discountPct: 50, durationMin: 30 });
  const patchSettings = (patch: Partial<ListingSettings>) => setSettings((s) => (s ? { ...s, ...patch } : s));

  // Re-sync the data-derived state when the category param changes — React
  // reuses this component instance across categories, so the useState
  // initializers above only run for the first category visited.
  useEffect(() => {
    if (!data) return;
    setSettings({
      headline: data.headline,
      yearsOfExperience: data.yearsOfExperience,
      levelOfExperience: data.levelOfExperience,
      qualifications: data.qualifications,
      services: data.services,
      videoLink: data.videoLink,
    });
    setHourlyRate(data.hourlyRate);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Admin: v1/v2 layout switch (bottom-right 3-dot menu), persisted for demos.
  const [version, setVersion] = useState<CategoryVersion>(() => {
    const stored = localStorage.getItem(VERSION_KEY);
    return stored === "v1" || stored === "v2" || stored === "v3" || stored === "v4" || stored === "v5" ? stored : "v1";
  });
  useEffect(() => { localStorage.setItem(VERSION_KEY, version); }, [version]);
  const [adminOpen, setAdminOpen] = useState(false);
  // Admin toggle: show/hide the pricing card (hourly rate + first step).
  const [showPricingCard, setShowPricingCard] = useState(true);
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [adminOpen]);

  // Category options menu (top-right 3-dot: Share / Delete category).
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const catMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!catMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) setCatMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [catMenuOpen]);

  useEffect(() => {
    document.title = `Leland Prototype | Edit ${data?.name ?? "Category"}`;
  }, [data?.name]);

  if (!data || !settings) {
    return (
      <div className="max-w-[720px]">
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Category not found</h1>
        <p className="mt-2 text-[14px] text-[#707070]">
          <Link to="/coach/profile" className="text-gray-dark underline">Back to Profile</Link>
        </p>
      </div>
    );
  }

  // v1 keeps the current dashboard-style layout (wide two columns under a beige
  // hero band). v2 is the redesign: a beige full-bleed page with the listing
  // preview up top and offerings grouped into modality cards.
  const contentMax = "max-w-[1280px]";

  // Back + category-options menu — shared by both versions.
  const topBar = (
    <div className="mb-6 flex items-center justify-between gap-3">
      <Button size="sm" variant="secondary" iconOnly onClick={() => navigate("/coach/profile")} aria-label="Go back">
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </Button>
      <div className="relative" ref={catMenuRef}>
        <Button size="sm" variant="secondary" iconOnly onClick={() => setCatMenuOpen((o) => !o)} aria-label="Category options">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>
        </Button>
        <AnimatePresence>
          {catMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-30 mt-2 w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
            >
              <button onClick={() => setCatMenuOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
                <MaskIcon src={shareArrowIcon} className="h-[18px] w-[18px]" />
                Share
              </button>
              <button onClick={() => setCatMenuOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-[#DC2B23] transition-colors hover:bg-[#DC2B23]/[0.06]">
                <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                Delete category
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div>
      {version === "v5" ? (
        // v5 — a tabbed workspace on the same beige full-bleed page. Hero + a
        // horizontal tab bar, then the active tab's panel.
        <>
          {topBar}
          <div>
            <h1 className="font-serif text-[42px] leading-[1.05] text-gray-dark md:text-[48px]">{data.name}</h1>
            <p className="mt-3 text-[18px] leading-relaxed text-gray-light">
              Manage the products, pricing, and details that appear on your public listing for this category.
            </p>
          </div>
          <CategoryV5Content
            category={category}
            data={data}
            settings={settings}
            onEditSettings={() => setEditOpen(true)}
            firstStep={firstStep}
            onFirstStepChange={setFirstStep}
            rate={hourlyRate}
            onRateChange={setHourlyRate}
            showPricingCard={showPricingCard}
          />
        </>
      ) : version !== "v1" ? (
        // v2 / v3 — beige full-bleed page. The beige is painted by CoachLayout's
        // persistent container (see its `beigePage`), not here, so it's instant and
        // doesn't flash white→beige through the fade-up entrance animation.
        <>
          {topBar}

          {/* Hero — identical to v1 (category name + subtitle), with actions. */}
          <div>
            <h1 className="font-serif text-[42px] leading-[1.05] text-gray-dark md:text-[48px]">{data.name}</h1>
            <p className="mt-3 text-[18px] leading-relaxed text-gray-light">
              Manage the products, pricing, and details that appear on your public listing for this category.
            </p>
          </div>

          {/* All card sections share one consistent vertical gap. */}
          <div className="mt-10 flex flex-col gap-5">
            {/* First row — profile info card + hourly rate / first step card. */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CategoryInfoCard settings={settings} onEdit={() => setEditOpen(true)} category={category} />
              {showPricingCard && <CategoryPricingCard firstStep={firstStep} onFirstStepChange={setFirstStep} rate={hourlyRate} onRateChange={setHourlyRate} />}
            </div>

            {/* Analytics row — category-scoped, Dashboard-style. */}
            <CategoryAnalyticsCard analytics={data.analytics} />

            {version === "v4" ? (
              // v4 — no separate Live section; live sessions live in the Offerings
              // grid as cards (with a "Live group learning" filter + calendar badge).
              <CategoryV4Content category={category} />
            ) : version === "v3" ? (
              // v3 — Live sessions section + one filterable Offerings grid.
              <CategoryV3Content category={category} />
            ) : (
              // v2 — offerings grouped into a card per modality.
              MODALITIES.map((m) => (
                <ModalityCard
                  key={m.id}
                  modality={m}
                  offerings={OFFERINGS.filter((o) => modalityForOffering(o) === m.id)}
                  onPreview={(o) => navigate(`/offering/${o.slug}`)}
                  onEdit={(o) => navigate(`/my-leland/manage/${category}/new-product?edit=${o.slug}`)}
                  onAdd={() => navigate(`/my-leland/manage/${category}/new`)}
                  onSeeAll={() => navigate(`/profile/samantha-parker/${category}`)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        // v1 — dashboard-style two columns under a beige hero band.
        <>
          <div
            className="-ml-4 -mr-4 -mt-8 pb-28 pt-8 sm:-mt-10 sm:pb-32 sm:pt-10 sm:[margin-left:min(-24px,calc(626px_-_50vw))] sm:[margin-right:min(-24px,calc(626px_-_50vw))]"
            style={{ backgroundColor: HERO_BG }}
          >
            <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
              <div className={`mx-auto ${contentMax}`}>
                {topBar}
                <div>
                  <h1 className="font-serif text-[42px] leading-[1.05] text-gray-dark md:text-[48px]">{data.name}</h1>
                  <p className="mt-3 text-[18px] leading-relaxed text-gray-light">
                    Manage the products, pricing, and details that appear on your public listing for this category.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`relative z-10 mx-auto -mt-16 sm:-mt-20 ${contentMax}`}>
            <div className="grid grid-cols-1 gap-6 lg:gap-x-10 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="flex flex-col gap-6 lg:sticky lg:top-[77px] lg:self-start">
                <CategoryInfoCard settings={settings} onEdit={() => setEditOpen(true)} category={category} />
                {showPricingCard && <CategoryPricingCard firstStep={firstStep} onFirstStepChange={setFirstStep} rate={hourlyRate} onRateChange={setHourlyRate} />}
              </div>
              <div className="flex min-w-0 flex-col gap-8">
                <CategoryAnalyticsCard analytics={data.analytics} />
                <OfferingsSection category={category} gridClass="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
              </div>
            </div>
          </div>
        </>
      )}

      <ListingSettingsModal open={editOpen} settings={settings} allServices={data.allServices} onPatch={patchSettings} onClose={() => setEditOpen(false)} />

      {/* Admin — bottom-right 3-dot menu to switch layout versions (demo tool) */}
      <div
        ref={adminRef}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-40 md:bottom-6 md:right-6"
      >
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[200px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <p className="px-2 pb-1.5 pt-1 text-[12px] font-medium text-gray-light">Layout version</p>
              <div className="flex gap-1 rounded-lg bg-gray-hover p-1">
                {(["v1", "v2", "v3", "v4", "v5"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVersion(v)}
                    className={`flex-1 rounded-md px-2 py-1.5 text-[13px] font-semibold uppercase transition-colors ${version === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-gray-stroke pt-2">
                <p className="px-2 pb-1 pt-1 text-[12px] font-medium text-gray-light">Widgets</p>
                <AdminToggle label="Hourly rate & first step" checked={showPricingCard} onChange={() => setShowPricingCard((v) => !v)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
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
    </div>
  );
}
