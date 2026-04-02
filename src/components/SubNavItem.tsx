import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface SubNavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  subCategories?: string[];
  onSubCategoryClick?: (cat: string) => void;
  activeSubCategory?: string | null;
}

export default function SubNavItem({
  label,
  isActive,
  onClick,
  subCategories = [],
  onSubCategoryClick,
  activeSubCategory,
}: SubNavItemProps) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (containerRef.current && subCategories.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={onClick}
        className={`px-3 py-1.5 text-[15px] whitespace-nowrap transition-colors ${
          isActive ? "font-medium text-gray-dark" : "font-normal text-gray-light hover:text-gray-dark"
        }`}
      >
        {label}
      </button>

      {subCategories.length > 0 &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                className="fixed z-50 min-w-[200px] rounded-xl border border-gray-stroke bg-white shadow-lg"
              >
                <div className="px-2 py-2">
                  {subCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSubCategoryClick?.(cat);
                        setOpen(false);
                      }}
                      className={`flex w-full rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                        cat === activeSubCategory
                          ? "font-medium text-gray-dark"
                          : "font-normal text-gray-light hover:bg-gray-hover hover:text-gray-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
