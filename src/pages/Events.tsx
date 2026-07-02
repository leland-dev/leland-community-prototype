import { useState, useEffect, useContext, useMemo } from "react";
import { SubNavContext } from "../components/SubNavContext";
import SubNavItem from "../components/SubNavItem";
import { useSetNavTheme } from "../components/NavThemeContext";

const HERO_BG = "#222222";

const departments = [
  {
    label: "School Admissions",
    subCategories: ["MBA", "Law School", "Medical School", "Grad School", "Undergraduate"],
  },
  {
    label: "Test Prep",
    subCategories: ["GMAT", "LSAT", "MCAT", "GRE", "SAT / ACT"],
  },
  {
    label: "General",
    subCategories: ["Career Coaching", "Executive Coaching", "Leadership Coaching", "Communication & Public Speaking", "Life Coaching"],
  },
  {
    label: "Business",
    subCategories: ["Management Consulting", "Marketing", "Sales", "Human Resources", "Customer Success", "Startup Careers"],
  },
  {
    label: "Product",
    subCategories: ["Product Management", "Design", "Product Marketing", "Technical Program Management"],
  },
  {
    label: "Development",
    subCategories: ["Software Engineering", "Data Science", "Cybersecurity", "Web Development", "AI & ML Engineering"],
  },
  {
    label: "Finance & Accounting",
    subCategories: ["Investment Banking", "Private Equity", "Venture Capital", "FP&A", "Real Estate", "Accounting"],
  },
  {
    label: "Health & Medicine",
    subCategories: ["Pre-Med", "Nursing", "Public Health", "Research", "Healthcare Admin"],
  },
  {
    label: "Law & Public Policy",
    subCategories: ["Law School Admissions", "Bar Prep", "Legal Career", "Government & Policy"],
  },
  {
    label: "Arts, Media, and Entertainment",
    subCategories: ["Journalism", "Film & TV", "Music", "Fashion", "Sports"],
  },
  {
    label: "Science",
    subCategories: ["Biotech & Life Sciences", "Environmental Science", "Research", "Engineering"],
  },
  {
    label: "Education & Human Services",
    subCategories: ["Teaching", "Nonprofit", "Social Work", "Higher Education"],
  },
  {
    label: "AI",
    subCategories: ["AI Automation & Agents", "Break Into AI Careers", "AI Strategy & Transformation", "AI for Finance"],
  },
  {
    label: "Emerging Industries",
    subCategories: ["Climate & Sustainability", "Web3 & Crypto", "Space", "Gaming"],
  },
  {
    label: "After Hours",
    subCategories: ["Personal Finance", "Side Projects", "Freelancing", "Creative Pursuits"],
  },
];

export default function Events() {
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const { setContent } = useContext(SubNavContext);

  // On mobile, make the top nav transparent with light icons so it blends
  // into the dark hero section.
  const navTheme = useMemo(() => ({ bg: HERO_BG, light: true, hideWordmark: false }), []);
  useSetNavTheme(navTheme);

  useEffect(() => {
    setContent(
      <>
        {departments.map((dept) => (
          <SubNavItem
            key={dept.label}
            label={dept.label}
            isActive={activeDept === dept.label}
            onClick={() => { setActiveDept(dept.label); setActiveSubCategory(null); }}
            subCategories={dept.subCategories}
            onSubCategoryClick={(cat) => { setActiveDept(dept.label); setActiveSubCategory(cat); }}
            activeSubCategory={activeDept === dept.label ? activeSubCategory : null}
          />
        ))}
      </>
    );
    return () => setContent(null);
  }, [activeDept, activeSubCategory, setContent]);

  return (
    <div>
      {/* Mobile hero — full-bleed dark section behind the nav.
          Negative margins cancel the PageShell px-4 py-4 and main pt-14. */}
      <div
        className="-mx-4 -mt-[72px] mb-6 flex flex-col items-center px-4 pb-12 pt-[88px] text-center md:hidden"
        style={{ backgroundColor: HERO_BG }}
      >
        <h1 className="font-serif text-[48px] font-medium leading-[1.1] text-white">
          Join a free{"\n"}livestream
        </h1>
        <p className="mt-3 text-[17px] text-white">
          Hosted by top experts
        </p>
      </div>

      {/* Desktop h1 — hidden on mobile since the hero replaces it */}
      <h1 className="hidden font-serif text-[36px] font-medium text-gray-dark md:block">Livestreams</h1>
      <p className="mt-2 hidden text-[16px] text-gray-light md:block">
        Live sessions, workshops, and Q&amp;As from top experts.
      </p>

      <div className="mt-8 space-y-3">
        {Array.from({ length: 15 }, (_, i) => i + 1).map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-stroke p-4">
            <div className="flex h-14 w-14 shrink-0 animate-pulse flex-col items-center justify-center rounded-lg bg-gray-stroke" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-stroke" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-hover" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
