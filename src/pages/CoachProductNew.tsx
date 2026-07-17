import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import crownIcon from "../assets/icons/crown-membership.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import aiIcon from "../assets/icons/ai.svg";
import moneyIcon from "../assets/icons/money.svg";
import browseIcon from "../assets/icons/nav-icons/browse-inactive.svg";
import storeIcon from "../assets/icons/store.svg";
import globeIcon from "../assets/icons/globe.svg";
import coverImage9 from "../assets/img/cover-images/cover-image-9.png";

type StepKey = "product" | "offerings" | "page";

const STEPS: { key: StepKey; label: string; icon: string }[] = [
  { key: "product", label: "Product", icon: moneyIcon },
  { key: "offerings", label: "Offerings", icon: browseIcon },
  { key: "page", label: "Page", icon: storeIcon },
];

// Mask-tinted icon so it follows the surrounding text color (bg-current).
function MaskIcon({ src, className = "h-[18px] w-[18px]" }: { src: string; className?: string }) {
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

// Offering types the coach can bundle into a product. Reuses the existing
// product-type icons.
const offeringTypes = [
  { slug: "coaching-time", label: "Coaching time", blurb: "Book 1:1 sessions with you", icon: hourglassIcon },
  { slug: "content", label: "Content", blurb: "Guides, templates, videos", icon: bookOpenIcon },
  { slug: "collection", label: "Collection", blurb: "Group products into a bundle", icon: stackIcon },
  { slug: "course", label: "Course", blurb: "Structured multi-lesson course", icon: myCoursesIcon },
  { slug: "agent", label: "Agent", blurb: "An AI assistant trained on you", icon: aiIcon },
  { slug: "membership", label: "Membership", blurb: "Recurring subscription access", icon: crownIcon },
];
const offeringBySlug = Object.fromEntries(offeringTypes.map((o) => [o.slug, o]));

// Subtle fade + slide: up on enter, downward on exit.
const stepMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const },
};

// Matches the toggle used in the top-nav profile dropdown.
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function CharField({
  label,
  required,
  value,
  onChange,
  placeholder,
  max,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  max: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[14px] font-medium text-gray-light">
        {label}
        {required && <span className="text-[#E5484D]"> *</span>}
      </label>
      <input
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
      />
      <p className="mt-1 text-right text-[12px] text-[#999999]">{value.length} / {max}</p>
    </div>
  );
}

// Collapsible settings block used for "Plan settings" / "Product settings".
function Collapsible({ title, subtitle, defaultOpen = false, children }: { title: string; subtitle?: string; defaultOpen?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={subtitle ? "" : "rounded-xl bg-[#F7F7F7]"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between ${subtitle ? "" : "px-4 py-3"}`}
      >
        <span className="text-left">
          <span className={`block ${subtitle ? "text-[22px] font-semibold" : "text-[15px] font-medium"} text-gray-dark`}>{title}</span>
          {subtitle && <span className="mt-0.5 block text-[15px] text-gray-light">{subtitle}</span>}
        </span>
        <svg className={`h-4 w-4 shrink-0 text-[#999999] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
            <div className={subtitle ? "pt-4" : "px-4 pb-4"}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Controlled checkbox.
function CheckBox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
        {checked && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        )}
      </span>
      {label}
    </button>
  );
}

// Custom select — a trigger with a chevron and a menu that opens below.
function Select({ value, onChange, options, className = "" }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Menu is portaled to the body so it isn't clipped by any overflow-hidden
  // ancestor (e.g. the collapsing "Product settings" panel). Position is
  // measured from the trigger each time the menu opens.
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0 });
  const selected = options.find((o) => o.value === value);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6, width: r.width });
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-stroke bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] text-gray-dark transition-colors hover:border-[#c9c9c9]"
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <svg className={`h-4 w-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && createPortal(
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[60] cursor-default" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[70] max-h-[280px] overflow-auto rounded-xl border border-gray-stroke bg-white p-1 shadow-[0_4px_16px_rgba(16,24,40,0.12)]"
            style={{ left: pos.left, top: pos.top, width: pos.width }}
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] transition-colors hover:bg-gray-hover ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-dark"}`}
                >
                  {o.label}
                  {active && <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              );
            })}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

export default function CoachProductNew() {
  const { category } = useParams<{ category: string; type?: string }>();
  const navigate = useNavigate();

  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [step, setStep] = useState<StepKey>("product");

  // Shared product-in-progress state, reflected live in the preview.
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [pricingMode, setPricingMode] = useState<"free" | "paid">("free");
  const [paidType, setPaidType] = useState<"recurring" | "one-time">("recurring");
  const [price, setPrice] = useState("29.99");
  const [waitlist, setWaitlist] = useState(false);
  const [added, setAdded] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Purchase");

  useEffect(() => {
    document.title = "Leland Prototype | Add product";
  }, []);

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const isLast = stepIndex === STEPS.length - 1;

  const close = () => setPendingNav(`/coach/manage/${category}`);
  const next = () => {
    if (isLast) close();
    else setStep(STEPS[stepIndex + 1].key);
  };

  const addOffering = (slug: string) => setAdded((a) => [...a, slug]);
  const removeOffering = (index: number) => setAdded((a) => a.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-white">
      {/* Flow header — close, title, step breadcrumb, next */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-stroke bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label="Close">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Button>
          <span className="hidden text-[15px] font-semibold text-gray-dark sm:inline">Add product</span>
        </div>

        {/* Breadcrumb — click a step to jump to it */}
        <nav className="flex items-center gap-1.5">
          {STEPS.map((s, i) => {
            const active = s.key === step;
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="h-4 w-4 text-[#CFCFCF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                )}
                <button
                  onClick={() => setStep(s.key)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[14px] transition-colors ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"}`}
                >
                  <MaskIcon src={s.icon} />
                  {s.label}
                </button>
              </div>
            );
          })}
        </nav>

        <Button size="sm" variant="dark" rounded="rounded-full" className="text-[14px] font-semibold" onClick={next}>
          {isLast ? "Publish" : "Next"}
          {!isLast && (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          )}
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14">
        {/* Step content */}
        <main className="min-w-0 flex-1 pb-[120px]">
          <AnimatePresence mode="wait" onExitComplete={() => pendingNav && navigate(pendingNav)}>
            {!pendingNav && (
              <motion.div key={step} {...stepMotion}>
                {step === "product" && (
                  <ProductStep
                    name={name} setName={setName}
                    headline={headline} setHeadline={setHeadline}
                    pricingMode={pricingMode} setPricingMode={setPricingMode}
                    paidType={paidType} setPaidType={setPaidType}
                    price={price} setPrice={setPrice}
                    waitlist={waitlist} setWaitlist={() => setWaitlist((v) => !v)}
                    buttonText={buttonText} setButtonText={setButtonText}
                  />
                )}
                {step === "offerings" && (
                  <OfferingsStep added={added} onAdd={addOffering} onRemove={removeOffering} />
                )}
                {step === "page" && (
                  <PageStep
                    name={name}
                    headline={headline}
                    pricingMode={pricingMode}
                    price={price}
                    description={description}
                    setDescription={setDescription}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Live preview — persists across steps */}
        <aside className="w-full lg:sticky lg:top-[88px] lg:h-fit lg:w-[320px] lg:shrink-0">
          <ProductPreview
            name={name}
            headline={headline}
            pricingMode={pricingMode}
            paidType={paidType}
            price={price}
            added={added}
            joinLabel={buttonText}
          />
        </aside>
      </div>
    </div>
  );
}

/* ---------- Step 1: Product details + pricing ---------- */

function ProductStep({
  name, setName, headline, setHeadline,
  pricingMode, setPricingMode, paidType, setPaidType, price, setPrice, waitlist, setWaitlist,
  buttonText, setButtonText,
}: {
  name: string; setName: (v: string) => void;
  headline: string; setHeadline: (v: string) => void;
  pricingMode: "free" | "paid"; setPricingMode: (v: "free" | "paid") => void;
  paidType: "recurring" | "one-time"; setPaidType: (v: "recurring" | "one-time") => void;
  price: string; setPrice: (v: string) => void;
  waitlist: boolean; setWaitlist: () => void;
  buttonText: string; setButtonText: (v: string) => void;
}) {
  const pricingOptions = [
    { key: "free" as const, label: "Free access", icon: globeIcon },
    { key: "paid" as const, label: "Paid access", icon: moneyIcon },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-[22px] font-semibold text-gray-dark">Product details</h2>
        <p className="mt-0.5 text-[15px] text-gray-light">Describe your product offering.</p>
        <div className="mt-5 flex flex-col gap-5">
          <CharField label="Name" required value={name} onChange={setName} placeholder="My product name" max={80} />
          <CharField label="Headline" value={headline} onChange={setHeadline} placeholder="A short subheadline for my product here." max={80} />
        </div>
      </section>

      <div className="border-t border-gray-stroke" />

      <section>
        <h2 className="text-[22px] font-semibold text-gray-dark">Pricing</h2>
        <p className="mt-0.5 text-[15px] text-gray-light">Choose how people access this product.</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {pricingOptions.map((opt) => {
            const active = pricingMode === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setPricingMode(opt.key)}
                className={`flex items-center justify-between rounded-xl border-[1.5px] px-4 py-3.5 text-left transition-colors ${active ? "border-gray-dark bg-white" : "border-gray-stroke bg-white hover:border-[#c9c9c9]"}`}
              >
                <span className="flex items-center gap-3 text-gray-dark">
                  <MaskIcon src={opt.icon} className="h-6 w-6" />
                  <span className="text-[15px] font-semibold">{opt.label}</span>
                </span>
                <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${active ? "border-gray-dark" : "border-[#CFCFCF]"}`}>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-gray-dark" />}
                </span>
              </button>
            );
          })}
        </div>

        {pricingMode === "paid" ? (
          <div className="mt-3">
            <PaidPricingCard paidType={paidType} setPaidType={setPaidType} price={price} setPrice={setPrice} />
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-stroke px-4 py-3.5">
            <span className="text-[15px] font-medium text-gray-dark">Launch as a waitlist</span>
            <Toggle checked={waitlist} onChange={() => setWaitlist()} />
          </div>
        )}
      </section>

      <div className="border-t border-gray-stroke" />

      <Collapsible title="Product settings" subtitle="URL, taxes, affiliates, and more.">
        <ProductSettings buttonText={buttonText} setButtonText={setButtonText} />
      </Collapsible>
    </div>
  );
}

/* ---------- Paid pricing card (recurring / one-time) ---------- */

function PaidPricingCard({ paidType, setPaidType, price, setPrice }: { paidType: "recurring" | "one-time"; setPaidType: (v: "recurring" | "one-time") => void; price: string; setPrice: (v: string) => void }) {
  const recurring = paidType === "recurring";
  const [period, setPeriod] = useState("1 month");
  const [currency, setCurrency] = useState("USD");
  const [freeTrial, setFreeTrial] = useState(false);
  const [trialLength, setTrialLength] = useState("7");
  const suggestions = recurring ? ["19.99", "39.99", "79.99"] : ["50", "100", "250"];

  return (
    <div className="rounded-xl border border-gray-stroke">
      <div className="p-4">
        <p className="mb-3 text-[16px] font-semibold text-gray-dark">${price || "0"} {recurring ? "/ month" : "once"}</p>

        <Select
          value={paidType}
          onChange={(v) => setPaidType(v as "recurring" | "one-time")}
          options={[{ value: "recurring", label: "Recurring" }, { value: "one-time", label: "One-time" }]}
        />

        <div className="mt-3 flex gap-2">
          <div className="flex flex-1 items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
            <span className="text-[14px] text-gray-light">$</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-transparent px-2 py-2.5 text-[14px] text-gray-dark outline-none" />
          </div>
          {recurring && (
            <Select
              value={period}
              onChange={setPeriod}
              className="w-[120px]"
              options={["1 month", "3 months", "6 months", "1 year"].map((v) => ({ value: v, label: v }))}
            />
          )}
          <Select
            value={currency}
            onChange={setCurrency}
            className="w-[92px]"
            options={["USD", "EUR", "GBP"].map((v) => ({ value: v, label: v }))}
          />
        </div>

        <div className="mt-2.5 flex gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => setPrice(s)} className="rounded-md bg-[#f5f5f5] px-2.5 py-1 text-[13px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb]">
              ${s}
            </button>
          ))}
        </div>
      </div>

      {recurring && (
        <div className="border-t border-gray-stroke p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
              <svg className="h-[18px] w-[18px] text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></svg>
              Include a free trial
              <span className="rounded bg-[#EEF1FF] px-1.5 py-0.5 text-[12px] font-semibold text-[#4666E5]">Recommended</span>
            </span>
            <Toggle checked={freeTrial} onChange={() => setFreeTrial((v) => !v)} />
          </div>
          {freeTrial && (
            <>
              <Select
                value={trialLength}
                onChange={setTrialLength}
                className="mt-3"
                options={[
                  { value: "3", label: "3 days" },
                  { value: "7", label: "7 days" },
                  { value: "30", label: "30 days" },
                  { value: "custom", label: "After other # of days…" },
                ]}
              />
              {trialLength === "custom" && (
                <div className="mt-2 flex items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
                  <input placeholder="Number of days" className="w-full bg-transparent py-2.5 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1]" />
                  <span className="text-[14px] text-gray-light">days</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Product settings (URL, taxes, affiliates) ---------- */

function ProductSettings({ buttonText, setButtonText }: { buttonText: string; setButtonText: (v: string) => void }) {
  const [affiliate, setAffiliate] = useState(false);
  const [storeVisible, setStoreVisible] = useState(true);

  const inputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Stock</label>
        <input placeholder="Unlimited" className={inputClass} />
      </div>

      <AskQuestions />

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Purchase button text</label>
        <Select
          value={buttonText}
          onChange={setButtonText}
          options={["Purchase", "Join", "Join now", "Get access", "Subscribe", "Buy now"].map((v) => ({ value: v, label: v }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Product URL</label>
        <input defaultValue="leland.com/samantha-parker/new-product" className={inputClass} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-gray-dark">Add affiliate rate</span>
          <Toggle checked={affiliate} onChange={() => setAffiliate((v) => !v)} />
        </div>
        {affiliate && (
          <div className="mt-2 flex items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
            <input defaultValue="30" className="w-full bg-transparent py-2.5 text-[14px] text-gray-dark outline-none" />
            <span className="text-[14px] text-gray-light">%</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-gray-dark">Visible on your store page</span>
        <Toggle checked={storeVisible} onChange={() => setStoreVisible((v) => !v)} />
      </div>
    </div>
  );
}

/* ---------- Ask questions before checkout ---------- */

function AskQuestions() {
  const [enabled, setEnabled] = useState(false);
  const [questions, setQuestions] = useState<{ title: string; placeholder: string; optional: boolean }[]>([
    { title: "", placeholder: "", optional: false },
  ]);

  const update = (i: number, patch: Partial<{ title: string; placeholder: string; optional: boolean }>) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const remove = (i: number) => setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  const add = () => setQuestions((qs) => [...qs, { title: "", placeholder: "", optional: false }]);

  const inputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

  return (
    <div>
      <CheckBox checked={enabled} onChange={() => setEnabled((v) => !v)} label="Ask questions before checkout" />
      {enabled && (
        <div className="relative mt-4 flex flex-col gap-6">
          {/* Dashed connector linking the question numbers */}
          <span className="pointer-events-none absolute bottom-[13px] left-[13px] top-[13px] w-px border-l border-dashed border-[#D4D4D4]" />

          {questions.map((q, i) => (
            <div key={i} className="relative pl-10">
              <span className="absolute left-0 top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-gray-stroke bg-white text-[13px] font-medium text-gray-light">{i + 1}</span>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-gray-dark">Question {i + 1}</span>
                <button onClick={() => remove(i)} aria-label="Remove question" className="text-[#E5484D] transition-opacity hover:opacity-70">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" /></svg>
                </button>
              </div>
              <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Question title</label>
              <input value={q.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="What do you want to do?" className={inputClass} />
              <label className="mb-1.5 mt-3 block text-[14px] font-medium text-gray-light">Question placeholder</label>
              <input value={q.placeholder} onChange={(e) => update(i, { placeholder: e.target.value })} placeholder="Stocks, crypto, forex" className={inputClass} />
              <div className="mt-3">
                <CheckBox checked={q.optional} onChange={() => update(i, { optional: !q.optional })} label="Optional" />
              </div>
            </div>
          ))}

          <button onClick={add} className="relative flex items-center pl-10 text-left">
            <span className="absolute left-0 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EEF1FF] text-[#4666E5]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <span className="text-[15px] font-semibold text-[#4666E5]">Add another question</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2: Included offerings ---------- */

function OfferingsStep({ added, onAdd, onRemove }: { added: string[]; onAdd: (slug: string) => void; onRemove: (i: number) => void }) {
  return (
    <div>
      <h2 className="text-[22px] font-semibold text-gray-dark">Included offerings</h2>
      <p className="mt-0.5 text-[15px] text-gray-light">Choose the offerings you want to include with this product.</p>

      {added.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-[14px] font-medium text-gray-light">Added</p>
          <div className="flex flex-col gap-2">
            {added.map((slug, i) => {
              const o = offeringBySlug[slug];
              return (
                <div key={`${slug}-${i}`} className="flex items-center justify-between rounded-xl border border-gray-stroke bg-white px-3 py-2.5">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#f5f5f5]">
                      <img src={o.icon} alt="" className="h-5 w-5" />
                    </span>
                    <span className="text-[15px] font-medium text-gray-dark">{o.label}</span>
                  </span>
                  <button onClick={() => onRemove(i)} aria-label={`Remove ${o.label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="mb-2 mt-8 text-[14px] font-medium text-gray-light">Add offering</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {offeringTypes.map((o) => (
          <button
            key={o.slug}
            onClick={() => onAdd(o.slug)}
            className="group flex items-center justify-between rounded-xl bg-gray-hover px-3 py-3 text-left transition-colors hover:bg-[#ececec]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white">
                <img src={o.icon} alt="" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[15px] font-medium text-gray-dark">{o.label}</span>
                <span className="block text-[13px] text-gray-light">{o.blurb}</span>
              </span>
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors group-hover:bg-white group-hover:text-gray-dark">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Step 3: Customer-facing page ---------- */

function PageStep({ name, headline, pricingMode, price, description, setDescription }: { name: string; headline: string; pricingMode: "free" | "paid"; price: string; description: string; setDescription: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-[22px] font-semibold text-gray-dark">Page</h2>
      <p className="mt-0.5 text-[15px] text-gray-light">Configure the customer-facing page for this product.</p>

      {/* Media dropzone */}
      <div className="mt-5 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[#F5F5F5] text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-dark">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z" /><path d="m10 9 5 3-5 3V9z" fill="currentColor" /></svg>
        </span>
        <p className="text-[15px] font-semibold text-gray-dark">Add a video or photo</p>
        <p className="text-[14px] text-gray-light">Pages with videos convert 4x better.</p>
      </div>

      {/* Price + author bar */}
      <div className="mt-4 flex items-center rounded-xl border border-gray-stroke">
        <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
          <svg className="h-4 w-4 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" /><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" /></svg>
          {pricingMode === "free" ? "Free" : `$${price} / month`}
        </div>
        <div className="h-6 w-px bg-gray-stroke" />
        <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E7A33E] text-[11px] font-semibold text-white">S</span>
          By Samantha Parker
        </div>
      </div>

      {/* Headline + description */}
      <h3 className="mt-8 text-[28px] font-semibold leading-tight text-gray-dark">
        {headline || <span className="text-[#B1B1B1]">Write a headline…</span>}
      </h3>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        placeholder="Describe what customers get with this product…"
        className="mt-3 w-full resize-none rounded-xl border border-gray-stroke bg-white px-3.5 py-3 text-[15px] leading-relaxed text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark"
      />

      <button className="mt-4 flex w-full items-center justify-between border-t border-gray-stroke pt-4 text-[15px] font-medium text-gray-dark">
        Add FAQ
        <svg className="h-[18px] w-[18px] text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <span className="sr-only">{name}</span>
    </div>
  );
}

/* ---------- Live preview card ---------- */

function ProductPreview({ name, headline, pricingMode, paidType, price, added, joinLabel }: { name: string; headline: string; pricingMode: "free" | "paid"; paidType: "recurring" | "one-time"; price: string; added: string[]; joinLabel: string }) {
  // De-dupe offerings into labelled pills with a count.
  const counts = added.reduce<Record<string, number>>((m, s) => ({ ...m, [s]: (m[s] || 0) + 1 }), {});

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <img src={coverImage9} alt="" className="aspect-[1200/630] w-full object-cover opacity-25" />
      <div className="p-4">
        <p className="text-[17px] font-semibold leading-tight text-gray-dark">{name || "Product name"}</p>
        {headline ? (
          <p className="mt-1 text-[14px] leading-snug text-gray-light">{headline}</p>
        ) : (
          <p className="mt-1 text-[14px] leading-snug text-[#C4C4C4]">Your headline appears here</p>
        )}

        {Object.keys(counts).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.entries(counts).map(([slug, count]) => {
              const o = offeringBySlug[slug];
              return (
                <span key={slug} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[12px] font-medium text-gray-dark">
                  <img src={o.icon} alt="" className="h-3.5 w-3.5" />
                  {o.label}{count > 1 && ` ×${count}`}
                </span>
              );
            })}
          </div>
        )}

        {pricingMode === "paid" && (
          <p className="mt-3 text-[15px] font-semibold text-gray-dark">
            ${price} <span className="font-normal text-gray-light">{paidType === "recurring" ? "/ month" : "one-time"}</span>
          </p>
        )}

        <Button size="lg" variant="primary" rounded="rounded-full" className="mt-3 w-full text-[15px] font-semibold">
          {joinLabel}
        </Button>
      </div>
    </div>
  );
}
