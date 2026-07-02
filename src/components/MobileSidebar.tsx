import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
import groupImg1 from "../assets/placeholder images/group images/18603db620e37b489d2d52da4c9c1f86.jpg";
import groupImg2 from "../assets/placeholder images/group images/419a6944d25e95be7012699559c7b0be.jpg";

// Menu icons
import settingsIcon from "../assets/icons/settings.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import logOutIcon from "../assets/icons/log out.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import storeIcon from "../assets/icons/store.svg";
import moneyIcon from "../assets/icons/money.svg";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sectionHeader =
  "px-5 pt-2 pb-1 text-[16px] font-semibold text-gray-dark";

const menuItemClass =
  "flex items-center gap-3 px-5 py-[10px] text-[16px] font-medium text-[#4c4c4c] transition-colors hover:bg-gray-hover";

const groups = [
  { name: "AI BP April 26", image: groupImg1, to: "/groups/ai-bp-apr-26" },
  { name: "MBA Admissions 2027", image: groupImg2, to: "/groups/mba-admissions-2027" },
];

const expertItems = [
  { icon: lightningIcon, label: "Opportunities", to: "/coach/opportunities" },
  { icon: calendarPageIcon, label: "Calendar", to: "/coach/calendar" },
  { icon: storeIcon, label: "Offerings", to: "/coach/offerings" },
  { icon: moneyIcon, label: "Earnings", to: "/coach/earnings" },
];

const accountItems = [
  { icon: settingsIcon, label: "Settings", to: "/profile-v2" },
  { icon: orderHistoryIcon, label: "Order History", to: null },
];

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    if (!open) setAdminOpen(false);
  }, [open]);

  return (
    <motion.div
      className="flex h-full w-[280px] flex-col overflow-y-auto pb-[120px] scrollbar-hide bg-white"
      animate={{ scale: open ? 1 : 0.95, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
      style={{ transformOrigin: "left center" }}
      aria-hidden={!open}
    >
      {/* Profile header */}
      <div className="px-5 pt-6 pb-4">
        <NavLink
          to="/profile-v2"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <img
            src={profilePhoto}
            alt="Jane Doe"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-[18px] font-medium text-gray-dark">Jane Doe</p>
            <p className="text-[15px] text-gray-light">View profile</p>
          </div>
        </NavLink>
      </div>

      {/* My Groups */}
      <div className="pt-2">
        <p className={sectionHeader}>My Groups</p>
        {groups.map((group) => (
          <NavLink
            key={group.to}
            to={group.to}
            onClick={onClose}
            className={menuItemClass}
          >
            <img
              src={group.image}
              alt={group.name}
              className="h-6 w-6 rounded object-cover"
            />
            <span>{group.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Expert Tools */}
      <div className="pt-4">
        <p className={sectionHeader}>Expert Tools</p>
        {expertItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={menuItemClass}
          >
            <img src={item.icon} alt="" className="h-6 w-6 opacity-80" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Account */}
      <div className="pt-4">
        <p className={sectionHeader}>Account</p>
        {accountItems.map((item) =>
          item.to ? (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={menuItemClass}
            >
              <img src={item.icon} alt="" className="h-6 w-6 opacity-80" aria-hidden />
              <span>{item.label}</span>
            </NavLink>
          ) : (
            <button
              key={item.label}
              onClick={onClose}
              className={`${menuItemClass} w-full`}
            >
              <img src={item.icon} alt="" className="h-6 w-6 opacity-80" aria-hidden />
              <span>{item.label}</span>
            </button>
          )
        )}

        {/* Admin Tools accordion */}
        <button
          onClick={() => setAdminOpen((v) => !v)}
          className={`${menuItemClass} w-full`}
        >
          <img src={dotsHorizontalIcon} alt="" className="h-6 w-6 opacity-80 shrink-0" aria-hidden />
          <span className="flex-1 text-left">Admin Tools</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform ${adminOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            <polyline points="4 6 8 10 12 6" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {adminOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pl-5 pr-5">
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center justify-between gap-3 py-[10px] pl-9 text-[16px] font-medium text-[#4c4c4c] transition-colors hover:bg-gray-hover"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log out */}
        <button
          onClick={onClose}
          className="flex w-full items-center gap-3 px-5 py-[10px] text-[16px] font-medium text-[#D92D20] transition-colors hover:bg-gray-hover"
        >
          <img src={logOutIcon} alt="" className="h-6 w-6 opacity-80" aria-hidden />
          <span>Log out</span>
        </button>
      </div>
    </motion.div>
  );
}
