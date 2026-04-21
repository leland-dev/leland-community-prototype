import { useState, useEffect, useContext } from "react";
import { SubNavContext } from "../components/SubNavContext";
import SubNavItem from "../components/SubNavItem";

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

export default function LelandPlus() {
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const { setContent } = useContext(SubNavContext);

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
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Leland+</h1>
      <p className="mt-2 text-[18px] text-gray-light">
        Exclusive perks and content for Leland+ members.
      </p>

      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-gray-stroke p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-stroke" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-stroke" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-gray-hover" />
              <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
