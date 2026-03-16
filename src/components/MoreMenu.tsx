import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useExtraLinks } from "./ExtraLinksContext";
import moreActive from "../assets/icons/nav-icons/more-active.svg";
import moreInactive from "../assets/icons/nav-icons/more-inactive.svg";

import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import arrowRoundIcon from "../assets/icons/arrow-round.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";

const menuGroups = [
  {
    items: [
      { icon: giftIcon, label: "Refer a friend", danger: false },
      { icon: settingsIcon, label: "Settings", danger: false },
      { icon: arrowRoundIcon, label: "Order History", danger: false },
    ],
  },
  {
    items: [
      { icon: switchIcon, label: "Switch to coaching", danger: false },
      { icon: helpIcon, label: "Help", danger: false },
      { icon: logOutIcon, label: "Log out", danger: true },
    ],
  },
];

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showExtraLinks, toggleExtraLinks } = useExtraLinks();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg lg:left-0"
          >
            {/* Toggle for extra links */}
            <div className="px-2 py-2">
              <button
                onClick={toggleExtraLinks}
                className="flex w-full items-center justify-between rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
              >
                <span>Show extra links</span>
                <div
                  className={`relative h-[22px] w-[40px] rounded-full transition-colors ${
                    showExtraLinks ? "bg-[#038561]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-transform ${
                      showExtraLinks ? "translate-x-[21px]" : "translate-x-[3px]"
                    }`}
                  />
                </div>
              </button>
            </div>

            {menuGroups.map((group, gi) => (
              <div key={gi} className={`border-t border-gray-stroke px-2 py-2`}>
                {group.items.map(({ icon, label, danger }) => (
                  <button
                    key={label}
                    className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium transition-colors ${
                      danger
                        ? "text-[#D92D20] hover:bg-gray-hover"
                        : "text-gray-dark hover:bg-gray-hover"
                    }`}
                  >
                    <img src={icon} alt={label} className="h-6 w-6 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* More button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors lg:px-4 ${
          open
            ? "font-semibold text-gray-dark"
            : "text-[#9B9B9B] hover:bg-gray-hover"
        }`}
      >
        <img
          src={open ? moreActive : moreInactive}
          alt="More"
          className="h-[22px] w-[22px] shrink-0"
        />
        <span className="hidden text-[18px] font-medium lg:block">More</span>
      </button>
    </div>
  );
}
