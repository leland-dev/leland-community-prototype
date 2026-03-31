import { useState, useEffect } from "react";
import { useContext } from "react";
import { SubNavContext } from "../components/SubNavContext";

const subNavItems = [
  "All",
  "School Admissions",
  "Career",
  "Test Prep",
  "AI",
  "Business",
  "Finance",
  "Product",
  "Technology",
  "Health & Medicine",
  "Law",
];

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { setContent } = useContext(SubNavContext);

  useEffect(() => {
    setContent(
      <>
        {subNavItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveCategory(item)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[15px] font-medium whitespace-nowrap transition-colors ${
              item === activeCategory
                ? "bg-[#222222] text-white"
                : "text-gray-dark hover:bg-gray-hover"
            }`}
          >
            {item}
          </button>
        ))}
      </>
    );
    return () => setContent(null);
  }, [activeCategory, setContent]);

  return (
    <div>
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Courses</h1>
      <p className="mt-1 text-[18px] text-gray-light">
        Self-paced courses and live cohorts
      </p>
import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";

export default function Courses() {
  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  };

  return (
    <div className="min-h-full bg-white">
      <div className="md:hidden">
        <ExtraLinksProvider>
          <MobileTopNav />
        </ExtraLinksProvider>
      </div>
      <div className="hidden md:block">
        <TopNav />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 pt-20 pb-20 md:px-10 md:pt-6 md:pb-[100px]">
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
          Courses
        </h1>
        <p className="mt-2 text-[18px] text-gray-light">
          Self-paced courses to level up your career.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-[160px] rounded-xl bg-[#F5F5F5]"
              style={dashedBorderStyle}
            />
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
