import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, Search, X } from "lucide-react";
import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";

const coverImage = "https://design.joinleland.com/photography/lg/entrepreneur-woman-modern-office.jpg";

const goalTags = [
  "School admissions",
  "Job search",
  "AI",
  "Test prep",
  "Career growth",
  "Growing a business",
];

const categories = [
  "MBA",
  "AI Automation & Agents",
  "Management Consulting",
  "Private Equity",
  "Product Management",
  "Career Development",
  "College",
  "Law School",
  "Investment Banking",
];

const steps = [
  "Reading your goal",
  "Matching you to a category",
  "Finding available coaches & resources",
];

const allCategories = [
  "MBA",
  "Management Consulting",
  "AI Automation & Agents",
  "Break Into AI Careers",
  "Private Equity",
  "Investment Banking",
  "Product Management",
  "GRE",
  "GMAT",
  "Master's Programs",
  "Law School",
  "College",
];

const categoryOptions = [
  { label: "Product Management", muted: false },
  { label: "Product Operations", muted: false },
  { label: "Product Marketing", muted: false },
  { label: "None of these", muted: true },
];

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-stroke bg-white transition-colors hover:bg-gray-hover"
      aria-label="Close"
    >
      <X size={14} className="text-gray-dark" />
    </button>
  );
}

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [stepState, setStepState] = useState([1, 0, 0]);

  useEffect(() => {
    const t1 = setTimeout(() => setStepState([2, 1, 0]), 1000);
    const t2 = setTimeout(() => setStepState([2, 2, 1]), 2200);
    const t3 = setTimeout(() => setStepState([2, 2, 2]), 3400);
    const t4 = setTimeout(onDone, 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full w-full items-center justify-center"
    >
      <div className="w-full max-w-[320px] px-4 md:px-0">
        {steps.map((label, i) => {
          const state = stepState[i];
          return (
            <div key={label}>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {state === 2 ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check size={14} className="text-white" strokeWidth={2.5} />
                    </div>
                  ) : state === 1 ? (
                    <Loader2 size={24} className="animate-spin text-gray-dark" />
                  ) : (
                    <Loader2 size={24} className="text-gray-stroke" />
                  )}
                </div>
                <span
                  className="text-[18px] leading-[1.5]"
                  style={{ color: state === 2 ? "#000" : state === 1 ? "#333" : "#9B9B9B" }}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="my-1 ml-3 border-l-2 border-dashed border-gray-stroke" style={{ height: "26px" }} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

const bulletPoints = [
  "56 highly-rated coaches",
  "3 free events",
  "Self-paced courses and live cohorts",
  "Hundreds of on-demand resources",
];

function DecorativeGrid() {
  return (
    <div className="hidden w-[600px] shrink-0 flex-col gap-5 lg:flex">
      {[260, 158, 240, 158].map((height, rowIdx) => (
        <div key={rowIdx} className="flex gap-5">
          {[0, 1, 2].map((colIdx) => (
            <div
              key={colIdx}
              className="flex-1 rounded-xl border-2 border-dashed border-gray-stroke bg-gray-hover"
              style={{ height }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CategoryScreen({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <motion.div
      key="category"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-16 md:px-6"
    >
      <div className="flex w-full max-w-[1200px] items-center gap-16">
        <DecorativeGrid />
        <div className="flex w-full max-w-[560px] flex-col gap-6">
          <h2 className="text-[36px] font-medium leading-[1.1] text-gray-dark">
            Which aligns best with your goals?
          </h2>
          <div className="flex flex-col gap-3">
            {categoryOptions.map(({ label, muted }) => (
              <button
                key={label}
                onClick={() => onSelect(label)}
                className="flex items-center justify-between rounded-xl border border-gray-stroke px-5 py-5 text-left transition-colors hover:border-gray-dark"
              >
                <span className="text-[16px] font-medium" style={{ color: muted ? "#707070" : "#333" }}>
                  {label}
                </span>
                <div className="ml-4 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-gray-stroke" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailsScreen({ category, onBack, onChangeCategory, onClose }: { category: string; onBack: () => void; onChangeCategory: () => void; onClose: () => void }) {
  return (
    <motion.div
      key="details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-16 md:px-6"
    >
      <div className="flex w-full max-w-[1200px] items-stretch gap-16">
        <DecorativeGrid />

        {/* Right panel */}
        <div className="flex w-full max-w-[560px] flex-col justify-between">
          <div className="my-auto flex flex-col gap-8">
            <h2 className="text-[36px] font-medium leading-[1.1] text-gray-dark">
              Browse hundreds of carefully-vetted coaches and resources
            </h2>

            <div className="flex flex-col gap-4">
              {/* Selected category card */}
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-dark bg-white px-5 py-5">
                <span className="text-[16px] font-medium text-gray-dark">{category}</span>
                <div className="ml-4 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-primary">
                  <div className="h-[8px] w-[8px] rounded-full bg-primary" />
                </div>
              </div>

              {/* Bullet list */}
              <div className="flex flex-col px-5 py-2">
                {bulletPoints.map((point, i) => (
                  <div key={point} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-xlight" />
                      {i < bulletPoints.length - 1 && (
                        <div className="my-1 w-px flex-1 bg-gray-stroke" />
                      )}
                    </div>
                    <span className="pb-3 text-[16px] text-gray-light">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-lg bg-gray-hover px-6 py-4 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-stroke"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-dark px-6 py-4 text-[16px] font-medium text-white transition-colors hover:bg-black">
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
              <p className="text-[16px] text-gray-light">
                Not quite right?{" "}
                <button onClick={onChangeCategory} className="font-medium text-gray-dark underline-offset-2 hover:underline">
                  Change category
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChangeCategoryScreen({ onSelect, onBack }: { onSelect: (label: string) => void; onBack: () => void }) {
  const [query, setQuery] = useState("");
  const filtered = allCategories.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      key="change"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full w-full justify-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="flex w-full max-w-[1200px] gap-16">
        <div className="self-center"><DecorativeGrid /></div>

        {/* Right panel */}
        <div className="flex h-full w-full max-w-[560px] flex-col gap-5 self-start overflow-y-auto">
          <button
            onClick={onBack}
            className="flex w-fit items-center gap-2 rounded-lg bg-gray-hover px-4 py-2 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-stroke"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h2 className="text-[36px] font-medium leading-[1.1] text-gray-dark">
            All categories
          </h2>

          {/* Search input */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-stroke bg-white px-4 py-4">
            <Search size={20} className="shrink-0 text-gray-xlight" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="flex-1 bg-transparent text-[18px] text-gray-dark placeholder:text-gray-xlight focus:outline-none"
              autoFocus
            />
          </div>

          {/* Category list */}
          <div className="flex flex-col overflow-y-auto">
            {filtered.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className="rounded-lg px-3 py-3 text-left text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"loading" | "select" | "details" | "change">("loading");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  function handleSelect(label: string) {
    setSelectedCategory(label);
    setPhase("details");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-white"
    >
      <CloseButton onClose={onClose} />
      <div className="h-full w-full">
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <LoadingScreen onDone={() => setPhase("select")} />
          )}
          {phase === "select" && (
            <CategoryScreen onSelect={handleSelect} />
          )}
          {phase === "details" && (
            <DetailsScreen
              category={selectedCategory}
              onBack={() => setPhase("select")}
              onChangeCategory={() => setPhase("change")}
              onClose={onClose}
            />
          )}
          {phase === "change" && (
            <ChangeCategoryScreen onSelect={handleSelect} onBack={() => setPhase("details")} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Site() {
  const [query, setQuery] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleSubmit() {
    if (query.trim().length > 0) setOverlayOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  function handleClose() {
    setOverlayOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  return (
    <ExtraLinksProvider>
      <div className="min-h-full bg-white">
        {/* Mobile top nav */}
        <div className="md:hidden">
          <MobileTopNav />
        </div>

        {/* Desktop top nav */}
        <div className="sticky top-0 z-30 hidden md:block">
          <TopNav />
        </div>

        <main className="pt-14 pb-20 md:pt-0 md:pb-0">
          {/* ── Hero ── */}
          <section
            className="relative flex min-h-[560px] flex-col justify-end overflow-hidden pb-4 pt-16 md:min-h-[600px] md:justify-center"
            style={{
              backgroundImage: `url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Gradient overlay — desktop: left-to-right, mobile: bottom-to-top */}
            <div
              className="pointer-events-none absolute inset-0 hidden md:block"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.88) 10%, rgba(0,0,0,0) 70%)" }}
            />
            <div
              className="pointer-events-none absolute inset-0 md:hidden"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 10%, rgba(0,0,0,0) 70%)" }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-[1328px] px-4 md:px-6">
              <div className="max-w-[640px]">
                <h1
                  className="font-medium text-white"
                  style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 0.95, maxWidth: "560px" }}
                >
                  The inside track,<br /> open to everyone.
                </h1>

                <p
                  className="mt-4 text-lg font-medium leading-snug md:text-2xl"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Learn from people who've been exactly where you want to go.
                </p>

                {/* Search bar */}
                <div className="mt-6 flex items-center rounded-full border border-gray-stroke bg-white pl-4 pr-1 py-1 shadow-sm">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="What could you use help with?"
                    className="flex-1 bg-transparent text-[18px] text-gray-dark placeholder:text-gray-xlight focus:outline-none"
                  />
                  <button
                    onClick={handleSubmit}
                    className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-dark transition-colors hover:bg-black"
                    aria-label="Search"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3L8 13M8 3L4 7M8 3L12 7"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Goal tags */}
                <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-hide">
                  {goalTags.map((tag) => (
                    <button
                      key={tag}
                      className="shrink-0 rounded-lg border border-white/30 px-3 py-1.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(2px)" }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Eyebrow pinned to bottom of hero */}
            <div className="mt-10 md:absolute md:bottom-4 md:left-0 md:mt-0 md:w-full">
              <div className="mx-auto w-full max-w-[1328px] px-4 md:px-6">
                <p
                  className="text-[14px] font-medium uppercase tracking-[1.4px]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Popular Categories
                </p>
              </div>
            </div>
          </section>

          {/* ── Popular categories strip ── */}
          <section className="bg-white py-4">
            <div className="mx-auto w-full max-w-[1328px] px-4 md:px-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide md:flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className="shrink-0 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Content card rows ── */}
          <div className="mx-auto w-full max-w-[1328px] px-4 py-10 md:px-6">
            {/* Row of 4 */}
            <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[120/63] rounded-xl bg-gray-stroke" />
              ))}
            </div>

            {/* Row of 2 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="aspect-[120/63] rounded-xl bg-gray-stroke" />
              ))}
            </div>
          </div>
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {overlayOpen && <SearchOverlay onClose={handleClose} />}
        </AnimatePresence>
      </div>
    </ExtraLinksProvider>
  );
}
