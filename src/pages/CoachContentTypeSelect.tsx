import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import { Button } from "../components/Button";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const pageContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Mask-tinted icon so it follows the surrounding text color (bg-current).
function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
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

type ContentKind = "content" | "collection" | "course";

// Each kind maps to the existing CoachProductNew builder route.
const OPTIONS: {
  id: ContentKind;
  name: string;
  route: string;
  icon: string;
  description: string;
  features: string[];
}[] = [
  {
    id: "content",
    name: "Content",
    route: "async",
    icon: bookOpenIcon,
    description: "A single resource — a guide, template, video, or doc members can buy and download.",
    features: ["One downloadable file", "Priced on its own", "Optional Leland+ listing"],
  },
  {
    id: "collection",
    name: "Collection",
    route: "collection",
    icon: stackIcon,
    description: "A curated set of related resources bundled into one offering at a single price.",
    features: ["Group related content", "One price for the set", "Reorder anytime"],
  },
  {
    id: "course",
    name: "Course",
    route: "course",
    icon: myCoursesIcon,
    description: "A structured, multi-lesson course learners progress through at their own pace.",
    features: ["Lessons & sections", "Self-paced progress", "Track completion"],
  },
];

export default function CoachContentTypeSelect() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ContentKind>("content");

  useEffect(() => {
    document.title = "Leland Prototype | Add content";
  }, []);

  const close = () => navigate(`/my-leland/manage/${category}`);
  const start = () => {
    const opt = OPTIONS.find((o) => o.id === selected) ?? OPTIONS[0];
    navigate(`/my-leland/manage/${category}/new-product/${opt.route}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-stroke bg-white px-4 py-3 sm:px-6"
      >
        <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label="Close">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Button>
        <span className="hidden text-[15px] font-semibold text-gray-dark sm:inline">Add content</span>
      </motion.header>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <motion.div variants={pageContainer} initial="hidden" animate="show" className="w-full max-w-[920px]">
          <motion.h1 variants={fadeUp} className="text-center text-[26px] font-semibold text-gray-dark sm:text-[28px]">
            Add content
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-2 max-w-[560px] text-center text-[16px] leading-relaxed text-gray-light">
            All three are self-serve resources members work through on their own. Pick how you want to package it.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {OPTIONS.map((o) => {
              const active = selected === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelected(o.id)}
                  className={`relative flex flex-col rounded-2xl border-[1.5px] bg-white p-6 text-left transition-colors ${active ? "border-gray-dark" : "border-gray-stroke hover:border-[#c9c9c9]"}`}
                >
                  {active && (
                    <img src={checkmarkFilledIcon} alt="" className="absolute right-4 top-4 h-[22px] w-[22px]" />
                  )}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-hover text-gray-dark">
                    <MaskIcon src={o.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 text-[18px] font-semibold text-gray-dark">{o.name}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-light">{o.description}</p>
                  <ul className="mt-4 flex flex-col gap-2 border-t border-gray-stroke pt-4">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13.5px] leading-snug text-gray-dark">
                        <img src={checkmarkFilledIcon} alt="" className="mt-px h-[16px] w-[16px] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex justify-center">
            <Button size="lg" variant="primary" rounded="rounded-full" className="w-full max-w-[320px] text-[15px] font-semibold" onClick={start}>
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
