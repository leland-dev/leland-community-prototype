import { useState, useEffect, useContext, useRef } from "react";
import { SubNavContext } from "../components/SubNavContext";
import SubNavItem from "../components/SubNavItem";

/* ── Sub-nav departments ── */
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

/* ── Category filter (searchable dropdown) ── */
function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (cat: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
    else setSearch("");
  }, [open]);

  const filtered = departments.filter((d) =>
    d.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[15px] whitespace-nowrap transition-colors ${
          selected
            ? "border-gray-dark bg-gray-dark text-white"
            : "border-gray-stroke bg-white text-gray-dark hover:border-gray-dark hover:bg-gray-hover"
        }`}
      >
        <span className="max-w-[140px] truncate">{selected ?? "Category"}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-gray-stroke bg-white shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-gray-stroke px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-gray-xlight">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M10 10L12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-transparent text-[14px] text-gray-dark placeholder:text-gray-xlight outline-none"
            />
          </div>
          {/* List */}
          <div className="max-h-60 overflow-y-auto py-1.5">
            {selected && (
              <button
                onClick={() => { onSelect(null); setOpen(false); }}
                className="flex w-full items-center px-3 py-2 text-left text-[14px] text-gray-light hover:bg-gray-hover"
              >
                Clear filter
              </button>
            )}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-[14px] text-gray-xlight">No results</p>
            )}
            {filtered.map((dept) => (
              <button
                key={dept.label}
                onClick={() => { onSelect(dept.label); setOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-[14px] transition-colors hover:bg-gray-hover ${
                  dept.label === selected ? "font-medium text-gray-dark" : "text-gray-light"
                }`}
              >
                {dept.label}
                {dept.label === selected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Toggle filter button ── */
function FilterToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[15px] whitespace-nowrap transition-colors ${
        active
          ? "border-gray-dark bg-gray-dark text-white"
          : "border-gray-stroke bg-white text-gray-dark hover:border-gray-dark hover:bg-gray-hover"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Live cohort mock data ── */
const liveCohorts = [
  {
    id: 1,
    gradient: "from-[#3B82F6] to-[#1E40AF]",
    title: "Nail the Google PM Interview Cycle",
    duration: "3 weeks",
    enrolled: 12,
    avatars: ["#6EA085", "#C6C4C4", "#E8BF78"],
  },
  {
    id: 2,
    gradient: "from-[#10B981] to-[#065F46]",
    title: "MBA Application Mastery: Essays to Interview",
    duration: "6 weeks",
    enrolled: 24,
    avatars: ["#E8BF78", "#6EA085", "#C6C4C4"],
  },
  {
    id: 3,
    gradient: "from-[#F59E0B] to-[#B45309]",
    title: "Breaking Into Investment Banking",
    duration: "4 weeks",
    enrolled: 18,
    avatars: ["#C6C4C4", "#E8BF78", "#6EA085"],
  },
  {
    id: 4,
    gradient: "from-[#8B5CF6] to-[#4C1D95]",
    title: "Data Science for Product Managers",
    duration: "5 weeks",
    enrolled: 31,
    avatars: ["#6EA085", "#E8BF78", "#C6C4C4"],
  },
  {
    id: 5,
    gradient: "from-[#EF4444] to-[#991B1B]",
    title: "LSAT Prep: Logic Games Deep Dive",
    duration: "3 weeks",
    enrolled: 8,
    avatars: ["#C6C4C4", "#6EA085", "#E8BF78"],
  },
  {
    id: 6,
    gradient: "from-[#06B6D4] to-[#0E4A6F]",
    title: "Software Engineering Interview Bootcamp",
    duration: "8 weeks",
    enrolled: 42,
    avatars: ["#E8BF78", "#C6C4C4", "#6EA085"],
  },
];

/* ── Self-paced mock data ── */
const selfPacedCourses = [
  { id: 1, gradient: "from-[#3B82F6] to-[#1E40AF]", title: "PM Interview Mastery", duration: "7h" },
  { id: 2, gradient: "from-[#10B981] to-[#065F46]", title: "MBA Essays That Get You In", duration: "5h" },
  { id: 3, gradient: "from-[#F59E0B] to-[#B45309]", title: "Investment Banking Fundamentals", duration: "12h" },
  { id: 4, gradient: "from-[#8B5CF6] to-[#4C1D95]", title: "Machine Learning for Beginners", duration: "9h" },
  { id: 5, gradient: "from-[#EF4444] to-[#991B1B]", title: "LSAT Logic Games Mastery", duration: "6h" },
  { id: 6, gradient: "from-[#06B6D4] to-[#0E4A6F]", title: "System Design Interview Prep", duration: "8h" },
];

/* ── Live cohort card ── */
function LiveCohortCard({ cohort }: { cohort: typeof liveCohorts[0] }) {
  return (
    <div className="w-[320px] shrink-0">
      <div className={`aspect-[120/63] w-full rounded-lg bg-gradient-to-br ${cohort.gradient}`} />
      <div className="mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center pr-2">
            {cohort.avatars.map((color, i) => (
              <div
                key={i}
                className="h-5 w-5 rounded-full border border-white -mr-2"
                style={{ backgroundColor: color, zIndex: cohort.avatars.length - i, position: "relative" }}
              />
            ))}
          </div>
          <span className="text-[14px] text-gray-light">{cohort.enrolled} enrolled</span>
        </div>
        <p className="mt-1.5 text-[18px] font-medium leading-[1.2] text-gray-dark">{cohort.title}</p>
        <p className="mt-1 text-[16px] text-gray-light">Live cohort · {cohort.duration}</p>
      </div>
    </div>
  );
}

/* ── Self-paced card ── */
function SelfPacedCard({ course }: { course: typeof selfPacedCourses[0] }) {
  return (
    <div className="w-[320px] shrink-0">
      <div className={`aspect-[120/63] w-full rounded-lg bg-gradient-to-br ${course.gradient}`} />
      {/* Content */}
      <div className="mt-2 px-1">
        {/* "Featured course" label */}
        <div className="flex items-center gap-1.5">
          <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EBAC0C]">
            <svg width="7" height="8" viewBox="0 0 7 8" fill="white">
              <path d="M1 1l5 3-5 3z" />
            </svg>
          </div>
          <span className="text-[14px] text-gray-light">Premium course</span>
        </div>
        <p className="mt-1.5 text-[18px] font-medium leading-[1.2] text-gray-dark">{course.title}</p>
        <p className="mt-1 text-[16px] text-gray-light">Self-paced · {course.duration}</p>
      </div>
    </div>
  );
}

/* ── Shared carousel wrapper ── */
function CourseCarousel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });

  return (
    <section className="mt-10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[22px] font-medium text-gray-dark">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[16px] text-gray-light">{subtitle}</p>}
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 pt-0.5 md:flex">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-stroke bg-white shadow-sm transition-opacity hover:bg-gray-hover disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 3L5 7L8.5 11" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-stroke bg-white shadow-sm transition-opacity hover:bg-gray-hover disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 3L9 7L5.5 11" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {children}
      </div>
    </section>
  );
}

/* ── Page ── */
export default function Courses() {
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterLive, setFilterLive] = useState(false);
  const [filterSelfPaced, setFilterSelfPaced] = useState(false);
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
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Courses</h1>
        </div>
        <div className="hidden shrink-0 items-center gap-2 pb-0.5 md:flex">
          <CategoryFilter selected={filterCategory} onSelect={setFilterCategory} />
          <FilterToggle label="Live cohort" active={filterLive} onClick={() => setFilterLive(!filterLive)} />
          <FilterToggle label="Self-paced" active={filterSelfPaced} onClick={() => setFilterSelfPaced(!filterSelfPaced)} />
        </div>
      </div>

      <CourseCarousel
        title="Live cohorts"
        subtitle="Expert instruction, hands-on practice and a supportive peer community to accelerate your growth."
      >
        {liveCohorts.map((cohort) => (
          <LiveCohortCard key={cohort.id} cohort={cohort} />
        ))}
      </CourseCarousel>

      <CourseCarousel title="Self-paced courses">
        {selfPacedCourses.map((course) => (
          <SelfPacedCard key={course.id} course={course} />
        ))}
      </CourseCarousel>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-gray-stroke p-4">
            <div className="h-32 w-full animate-pulse rounded bg-gray-stroke" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-stroke" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
