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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-stroke p-4"
          >
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
