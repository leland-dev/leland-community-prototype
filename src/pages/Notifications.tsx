import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useSetLayoutVariant } from "../components/LayoutVariantContext";
import { useSetNavTheme } from "../components/NavThemeContext";
import settingsIcon from "../assets/icons/settings.svg";
import checkIcon from "../assets/icons/check.svg";

const HERO_BG = "#F3F1E6";

export default function Notifications() {
  useSetLayoutVariant("thin");
  const navTheme = useMemo(() => ({ bg: HERO_BG, light: false, hideWordmark: false }), []);
  useSetNavTheme(navTheme);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  };

  return (
    <div>
      {/* Mobile hero */}
      <div
        className="-mx-4 -mt-[72px] mb-6 flex flex-col px-4 pb-12 pt-[88px] md:hidden"
        style={{ backgroundColor: HERO_BG }}
      >
        <div className="flex items-start justify-between">
          <h1 className="font-serif text-[48px] font-medium leading-[1.1] text-gray-dark">
            You have 2 notifications
          </h1>
          <div className="relative shrink-0 ml-4" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex cursor-pointer items-center justify-center rounded-full bg-[#222222]/5 p-2.5 transition-colors hover:bg-[#222222]/[0.08]"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="10" r="1.5" fill="#333333" />
                <circle cx="10" cy="10" r="1.5" fill="#333333" />
                <circle cx="16" cy="10" r="1.5" fill="#333333" />
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-lg"
                >
                  <div className="px-2 py-2">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full cursor-pointer items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <img src={checkIcon} alt="" className="h-6 w-6 shrink-0" />
                      Mark all as read
                    </button>
                    <Link
                      to="/settings?tab=notifications"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <img src={settingsIcon} alt="" className="h-6 w-6 shrink-0" />
                      Notification settings
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop h1 */}
      <div className="hidden md:flex items-center justify-between">
        <h1 className="font-serif text-[36px] font-medium text-gray-dark">
          Notifications
        </h1>
      </div>

      {/* Placeholder boxes */}
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[160px] rounded-xl bg-[#F5F5F5]"
            style={dashedBorderStyle}
          />
        ))}
      </div>
    </div>
  );
}
