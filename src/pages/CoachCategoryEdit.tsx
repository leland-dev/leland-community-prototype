import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, LinkButton } from "../components/Button";
import { OFFERINGS, type Offering } from "../lib/offerings";
import editIcon from "../assets/icons/edit.svg";
import eyeIcon from "../assets/icons/eye.svg";
import pic6 from "../assets/profile photos/pic-6.png";

const categoryData: Record<string, {
  name: string;
  headline: string;
  qualifications: string;
  yearsOfExperience: string;
  levelOfExperience: string;
  videoLink: string;
  services: string[];
  allServices: string[];
}> = {
  "product-management": {
    name: "Product Management",
    headline: "Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB",
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
    headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro",
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
    headline: "MBA Expert | Stanford GSB | 100+ M7 Admits",
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

// Dashed border drawn as an SVG background so we can set a larger dash length
// and a lower-opacity stroke than CSS `border-dashed` allows. Stroke is
// gray-light (#4C4C4C) at 50% opacity; rx matches rounded-2xl (16px).
const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%234C4C4C' stroke-opacity='0.5' stroke-width='2' stroke-dasharray='6%2c 5' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

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

const boxClass = "flex h-full flex-col rounded-[20px] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

type FirstStep = { type: "free" | "trial"; discountPct: number };
const DISCOUNT_OPTIONS = [25, 50, 75];

// Left card (spans two columns) — avatar + name, an Edit link to the details
// modal, the serif headline, service-tag chips, and a truncated qualifications
// blurb.
function CategoryInfoCard({ settings, onEdit }: { settings: ListingSettings; onEdit: () => void }) {
  return (
    <section className={`${boxClass} lg:col-span-2`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src={pic6} alt="Samantha Parker" className="h-7 w-7 rounded-full object-cover" />
          <span className="text-[16px] text-gray-dark">Samantha Parker</span>
        </div>
        <button onClick={onEdit} className="flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-gray-dark transition-opacity hover:opacity-70">
          <img src={editIcon} alt="" className="h-[16px] w-[16px]" />
          <span className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">Edit</span>
        </button>
      </div>

      <h2 className="mt-4 font-serif text-[26px] leading-tight text-gray-dark">{settings.headline}</h2>

      {settings.services.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {settings.services.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full bg-[#222222]/5 px-3 py-1.5 text-[13px] font-medium text-gray-extra-light">{s}</span>
          ))}
          {settings.services.length > 4 && (
            <span className="rounded-full bg-[#222222]/5 px-3 py-1.5 text-[13px] font-medium text-gray-extra-light">+{settings.services.length - 4}</span>
          )}
        </div>
      )}

      <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed text-gray-light">{settings.qualifications}</p>
    </section>
  );
}

// First-step picker — a borderless serif dropdown; picking "Paid trial session"
// reveals a discount selector.
const revealBtnClass = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover";

function FirstStepDropdown({ value, onChange }: { value: FirstStep; onChange: (v: FirstStep) => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center p-6">
      <p className="text-[15px] text-gray-light">First step</p>
      <div className="group relative mt-1 flex items-center justify-between gap-3">
        <p className="font-serif text-[24px] leading-tight text-gray-dark">
          {value.type === "free" ? "Free intro call" : "Paid trial session"}
        </p>
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
        <div className="mt-4">
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
      <p className="text-[15px] text-gray-light">Hourly rate</p>
      {editing ? (
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
      ) : (
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="font-serif text-[24px] leading-tight text-gray-dark">${rate || "0"} per hour</p>
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
      <FirstStepDropdown value={firstStep} onChange={onFirstStepChange} />
      <HourlyRateSection rate={rate} onChange={onRateChange} />
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
  const [hourlyRate, setHourlyRate] = useState("150");
  const [firstStep, setFirstStep] = useState<FirstStep>({ type: "free", discountPct: 50 });
  const patchSettings = (patch: Partial<ListingSettings>) => setSettings((s) => (s ? { ...s, ...patch } : s));

  useEffect(() => {
    document.title = `Leland Prototype | Edit ${data?.name ?? "Category"}`;
  }, [data?.name]);

  if (!data || !settings) {
    return (
      <div className="max-w-[720px]">
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Category not found</h1>
        <p className="mt-2 text-[14px] text-[#707070]">
          <Link to="/coach/profile-new" className="text-gray-dark underline">Back to Profile</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero — colored band bled to the edges of CoachLayout's flex-1 region
          (flush to the sidebar on the left, the window on the right). Cancels
          both the container's px padding and its mx-auto centering gutter: the
          container is centered in flex-1, so the gutter is symmetric, and equal
          negative margins reach both edges. The gutter only exists once flex-1
          exceeds the max-w-[1280px] cap, hence the -24px floor. The constant
          726 = (1280 max-width + 220 sidebar) / 2 - 24 padding. The overlapping
          cards below pull up into it, matching the customer Dashboard hero. */}
      <div
        className="-ml-4 -mr-4 -mt-8 px-4 pb-28 pt-8 sm:-mt-10 sm:px-6 sm:pb-32 sm:pt-10 sm:[margin-left:min(-24px,calc(726px_-_50vw))] sm:[margin-right:min(-24px,calc(726px_-_50vw))]"
        style={{ backgroundColor: HERO_BG }}
      >
        <div className="mx-auto max-w-[1040px]">
          {/* Back + Preview listing */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button size="sm" variant="secondary" iconOnly onClick={() => navigate("/coach/profile-new")} aria-label="Go back">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </Button>
            <LinkButton size="md" variant="secondary" rounded="rounded-full" href={`/profile/samantha-parker/${category}`} className="text-[15px] font-semibold">
              <img src={eyeIcon} alt="" className="h-[16px] w-[16px]" />
              Preview listing
            </LinkButton>
          </div>

          {/* Header */}
          <div>
            <h1 className="font-serif text-[42px] leading-[1.05] text-gray-dark md:text-[48px]">{data.name}</h1>
            <p className="mt-3 text-[18px] leading-relaxed text-gray-light">
              Manage the products, pricing, and details that appear on your public listing for this category.
            </p>
          </div>
        </div>
      </div>

      {/* Content — pulled up to overlap the hero band */}
      <div className="relative z-10 mx-auto -mt-16 max-w-[1040px] sm:-mt-20">
        {/* Category details, first step, and hourly rate */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CategoryInfoCard settings={settings} onEdit={() => setEditOpen(true)} />
          <CategoryPricingCard firstStep={firstStep} onFirstStepChange={setFirstStep} rate={hourlyRate} onRateChange={setHourlyRate} />
        </div>

        {/* Offerings grid */}
        <div className="mt-12">
          <h2 className="mb-4 text-[20px] font-semibold text-gray-dark">Offerings</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Add-new tile */}
            <button
              onClick={() => navigate(`/coach/manage/${category}/new-product`)}
              style={dashedBorderStyle}
              className="group flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl bg-gray-hover transition-colors hover:bg-[#eeeeee]"
            >
              <svg className="h-7 w-7 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              <span className="text-[15px] font-semibold leading-tight text-gray-light">New offering</span>
            </button>
            {OFFERINGS.map((o) => (
              <CoachOfferingCard
                key={o.slug}
                offering={o}
                onPreview={() => navigate(`/offering/${o.slug}`)}
                onEdit={() => navigate(`/coach/manage/${category}/new-product`)}
              />
            ))}
          </div>
        </div>
      </div>

      <ListingSettingsModal open={editOpen} settings={settings} allServices={data.allServices} onPatch={patchSettings} onClose={() => setEditOpen(false)} />
    </div>
  );
}
