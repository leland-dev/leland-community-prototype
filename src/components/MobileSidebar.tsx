import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useExtraLinks } from "./ExtraLinksContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useIsCoachMode } from "../hooks/useIsCoachMode";
import profilePhoto from "../assets/profile photos/profile photo.png";

import eventsIcon from "../assets/icons/nav-icons/calendar-inactive.svg";
import coursesIcon from "../assets/icons/nav-icons/courses-inactive.svg";
import lelandPlusIcon from "../assets/icons/nav-icons/leland-plus-inactive.svg";
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import arrowRoundIcon from "../assets/icons/arrow-round.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import arrowRightIcon from "../assets/icons/arrow-right.svg";
import browserIcon from "../assets/icons/browser.svg";
import usersGroupIcon from "../assets/icons/users-group.svg";

const menuItems = [
  { to: "/events", icon: eventsIcon, label: "Livestreams", danger: false, darkIcon: true },
  { to: "/courses", icon: coursesIcon, label: "Live programs", danger: false, darkIcon: true },
  { to: "/plus", icon: lelandPlusIcon, label: "Leland+", danger: false, darkIcon: true },
  { to: "/profile-v2?tab=more", icon: usersGroupIcon, label: "My Groups", danger: false, darkIcon: true },
  { to: null, icon: giftIcon, label: "Refer a friend", danger: false },
  { to: null, icon: settingsIcon, label: "Settings", danger: false },
  { to: null, icon: arrowRoundIcon, label: "Order History", danger: false },
  { to: "/coach/home", icon: switchIcon, label: "Switch to coaching", danger: false },
  { to: "/partner-dashboard", icon: browserIcon, label: "Partner dashboard", danger: false },
  { to: null, icon: helpIcon, label: "Help", danger: false },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const extraPaths = new Set(["/events", "/courses", "/plus"]);

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { showExtraLinks } = useExtraLinks();
  const isCoachMode = useIsCoachMode();

  const baseItems = isCoachMode
    ? menuItems.map((item) =>
        item.label === "Switch to coaching"
          ? { ...item, to: "/", label: "Switch to customer view" }
          : item
      )
    : menuItems;

  const visibleMenuItems = showExtraLinks
    ? baseItems
    : baseItems.filter((item) => !extraPaths.has(item.to ?? ""));

  // Design toggles — wired to DarkModeContext so the rest of the app can react.
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col bg-white"
          >
            {/* Profile header */}
            <div className="px-5 pb-5 pt-6">
              <img
                src={profilePhoto}
                alt="Jane Doe"
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="mt-3 text-[14px] font-semibold text-gray-dark">Jane Doe</p>
              <p className="text-sm text-gray-light">jane@example.com</p>
              <NavLink
                to="/profile-v2"
                onClick={onClose}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#222222]/5 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
              >
                View profile
                <img src={arrowRightIcon} alt="" className="h-5 w-5" />
              </NavLink>
            </div>

            {/* Menu links */}
            <div className="flex-1 overflow-y-auto">
              <div className="border-t border-gray-stroke py-2">
                {visibleMenuItems.map(({ to, icon, label, danger, darkIcon }) =>
                  to ? (
                    <NavLink
                      key={label}
                      to={to}
                      onClick={onClose}
                      className="flex items-center gap-[10px] px-5 py-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      {danger ? (
                        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      ) : icon ? (
                        <img src={icon} alt={label} className={`h-6 w-6 shrink-0${darkIcon ? " brightness-0" : ""}`} />
                      ) : null}
                      {label}
                    </NavLink>
                  ) : (
                    <button
                      key={label}
                      onClick={onClose}
                      className={`flex w-full items-center gap-[10px] px-5 py-3 text-[14px] font-medium transition-colors hover:bg-gray-hover ${
                        danger ? "text-[#D92D20]" : "text-gray-dark"
                      }`}
                    >
                      {danger ? (
                        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      ) : icon ? (
                        <img src={icon} alt={label} className={`h-6 w-6 shrink-0${darkIcon ? " brightness-0" : ""}`} />
                      ) : null}
                      {label}
                    </button>
                  )
                )}
              </div>

              {/* Dark mode toggle + log out */}
              <div className="border-t border-gray-stroke py-2">
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center justify-between gap-[10px] px-5 py-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <span>Dark Mode</span>
                  <span
                    aria-hidden
                    className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${darkMode ? "bg-[#FFD96F]" : "bg-[#E5E5E5]"}`}
                  >
                    <span
                      className="absolute h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform"
                      style={{ transform: `translateX(${darkMode ? 20 : 2}px)` }}
                    />
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="flex w-full items-center gap-[10px] px-5 py-3 text-[14px] font-medium text-[#D92D20] transition-colors hover:bg-gray-hover"
                >
                  <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
