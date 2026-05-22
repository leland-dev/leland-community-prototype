import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import OfferingCard from "../components/OfferingCard";
import { COACH_CONFIGS, type CoachOffering } from "./ProfileV2";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import checkIcon from "../assets/icons/check.svg";

const SECTION_DEFS = [
  { id: "packages", label: "Packages", types: ["hourly-package", "package"] },
  { id: "memberships", label: "Memberships", types: ["course"] },
  { id: "agents", label: "Agents", types: ["agent"] },
  { id: "content", label: "Content", types: ["content"] },
] as const;

const COLLAPSED_LIMIT = 4;

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function getOfferingsForSection(offerings: CoachOffering[], types: readonly string[]) {
  return offerings.filter((o) => types.includes(o.type));
}

export default function AllOfferingsModal({ coachId = "samantha", open, onClose }: { coachId?: string; open: boolean; onClose: () => void }) {
  const coachConfig = COACH_CONFIGS[coachId] ?? COACH_CONFIGS.samantha;

  const activeSections = SECTION_DEFS.filter(
    (s) => getOfferingsForSection(coachConfig.offerings, s.types).length > 0,
  );

  const freeIntro = coachConfig.offerings.find((o) => o.type === "free-intro");
  const hourly = coachConfig.offerings.find((o) => o.type === "hourly");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setExpandedSections({});
      setCategoryFilter("All");
      setCategoryOpen(false);
    }
  }, [open]);

  // Click outside to close category dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    if (categoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
          <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
          <div
            ref={scrollContainerRef}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={onClose}
          >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-50 mx-auto my-8 w-full max-w-[700px] rounded-2xl bg-white shadow-2xl md:my-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 rounded-t-2xl border-b border-gray-stroke bg-white px-6 py-4">
              <img
                src={coachConfig.photo}
                alt={coachConfig.name}
                className="h-10 w-10 rounded-[4px] object-cover"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[18px] font-medium text-gray-dark">{coachConfig.name}</span>
                <span className="text-[16px] text-[#707070]">All offerings</span>
              </div>
              <div className="min-w-0 flex-1" />

              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#707070] transition-colors hover:bg-[#f5f5f5] hover:text-gray-dark"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {/* Offerings header + category dropdown */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[24px] font-medium text-gray-dark">Offerings</h2>
                  <div ref={categoryRef} className="relative">
                    <button
                      onClick={() => setCategoryOpen(!categoryOpen)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] transition-colors hover:bg-[#ebebeb]"
                    >
                      {categoryFilter === "All" ? "All categories" : categoryFilter}
                      <img src={chevronDownIcon} alt="" className={`h-[14px] w-[14px] transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {categoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-stroke bg-white py-2 shadow-lg"
                        >
                          {[{ value: "All", label: "All categories" }, { value: "College", label: "College" }, { value: "MBA", label: "MBA" }, { value: "Product Management", label: "Product Management" }].map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => { setCategoryFilter(value); setCategoryOpen(false); }}
                              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover ${categoryFilter === value ? "bg-gray-hover" : ""}`}
                            >
                              {label}
                              {categoryFilter === value && <img src={checkIcon} alt="" className="h-[16px] w-[16px]" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Free intro + hourly cards */}
                {(freeIntro || hourly) && (
                  <div className="mb-8 flex flex-col gap-1">
                    {freeIntro && (
                      <OfferingCard
                        type={freeIntro.type}
                        title={freeIntro.title}
                        subtitle={freeIntro.subtitle}
                        image={freeIntro.image}
                      />
                    )}
                    {hourly && (
                      <OfferingCard
                        type={hourly.type}
                        title={hourly.title}
                        subtitle={hourly.subtitle}
                        image={hourly.image}
                        ctaLabel={hourly.ctaLabel}
                        href={hourly.href}
                      />
                    )}
                  </div>
                )}

                {/* Offering sections */}
                {activeSections.map((section, sIdx) => {
                  const offerings = getOfferingsForSection(coachConfig.offerings, section.types);
                  const isExpandable = offerings.length > COLLAPSED_LIMIT;
                  const isExpanded = expandedSections[section.id] ?? false;
                  const visibleOfferings = offerings.slice(0, COLLAPSED_LIMIT);
                  const overflowOfferings = offerings.slice(COLLAPSED_LIMIT);
                  const hiddenCount = overflowOfferings.length;

                  return (
                    <div key={section.id} className={sIdx > 0 ? "mt-10" : ""}>
                      <h2 className="mb-4 text-[24px] font-medium text-gray-dark">
                        {section.label}
                      </h2>
                      <div className="flex flex-col gap-1">
                        {visibleOfferings.map((o) => (
                          <OfferingCard
                            key={o.title}
                            type={o.type}
                            title={o.title}
                            subtitle={o.subtitle}
                            image={o.image}
                            ctaLabel={o.ctaLabel}
                            href={o.href}
                          />
                        ))}
                        <AnimatePresence initial={false}>
                          {isExpandable && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                              className="flex flex-col gap-1 overflow-hidden"
                            >
                              {overflowOfferings.map((o) => (
                                <OfferingCard
                                  key={o.title}
                                  type={o.type}
                                  title={o.title}
                                  subtitle={o.subtitle}
                                  image={o.image}
                                  ctaLabel={o.ctaLabel}
                                  href={o.href}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {isExpandable && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                          >
                            {isExpanded ? "See less" : `See ${hiddenCount} more`}
                            <ChevronDownIcon className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </motion.div>
          </div>
          </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
