import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { Button } from "./Button";
import profilePhoto from "../assets/profile photos/profile photo.png";
import groupImg1 from "../assets/placeholder images/group images/18603db620e37b489d2d52da4c9c1f86.jpg";
import groupImg2 from "../assets/placeholder images/group images/419a6944d25e95be7012699559c7b0be.jpg";

// Menu icons
import settingsIcon from "../assets/icons/settings.svg";
import logOutIcon from "../assets/icons/log out.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import helpIcon from "../assets/icons/help.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import storeIcon from "../assets/icons/store.svg";
import moneyIcon from "../assets/icons/money.svg";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import plusIcon from "../assets/icons/plus-icon.svg";
import arrowDiagonalIcon from "../assets/icons/arrow-diagonal.svg";
import expertBanner from "../assets/img/Expert-Banner.png";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sectionHeader =
  "px-5 pt-2 pb-1 text-[16px] font-semibold text-gray-dark";

const menuItemClass =
  "flex items-center gap-3 px-5 py-[10px] text-[16px] font-normal text-[#4c4c4c] transition-colors hover:bg-gray-hover";

const groups = [
  { name: "AI BP April 26", image: groupImg1, to: "/groups/ai-bp-apr-26" },
  { name: "MBA Admissions 2027", image: groupImg2, to: "/groups/mba-admissions-2027" },
];

const expertItems = [
  { icon: lightningIcon, label: "Opportunities", to: "/coach/opportunities", external: false },
  { icon: calendarPageIcon, label: "Calendar", to: "/coach/calendar", external: false },
  { icon: storeIcon, label: "Offerings", to: "/coach/offerings", external: true },
  { icon: moneyIcon, label: "Earnings", to: "/coach/earnings", external: true },
];

const myLelandItems = [
  { icon: myCoursesIcon, label: "Live Programs", to: "/courses", external: true },
  { icon: plusIcon, label: "Leland+", to: "/plus", external: true },
];

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();
  const [adminOpen, setAdminOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [expertMode, setExpertMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo(0, 0);
    } else {
      setAdminOpen(false);
      setAccountOpen(false);
    }
  }, [open]);

  return (
    <motion.div
      ref={scrollRef}
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
        <p className={sectionHeader}>My groups</p>
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

      {/* Expert Tools — only shown when expert mode is on */}
      {expertMode && (
        <div className="pt-4">
          <p className={sectionHeader}>Expert tools</p>
          {expertItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={menuItemClass}
            >
              <img src={item.icon} alt="" className="h-6 w-6 opacity-80" aria-hidden />
              <span>{item.label}</span>
              {item.external && <img src={arrowDiagonalIcon} alt="" className="h-[18px] w-[18px] -ml-2 opacity-50" aria-hidden />}
            </NavLink>
          ))}
        </div>
      )}

      {/* My Leland */}
      <div className="pt-4">
        <p className={sectionHeader}>More</p>
        {myLelandItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onClose}
            className={menuItemClass}
          >
            <img src={item.icon} alt="" className="h-6 w-6 opacity-80" aria-hidden />
            <span>{item.label}</span>
            {item.external && <img src={arrowDiagonalIcon} alt="" className="h-[18px] w-[18px] -ml-2 opacity-50" aria-hidden />}
          </NavLink>
        ))}

        {/* Account accordion */}
        <button
          onClick={() => setAccountOpen((v) => !v)}
          className={`${menuItemClass} w-full`}
        >
          <img src={settingsIcon} alt="" className="h-6 w-6 opacity-80 shrink-0" aria-hidden />
          <span className="flex-1 text-left">Account</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform ${accountOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            <polyline points="4 6 8 10 12 6" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {accountOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative ml-[31px] border-l-[1.5px] border-[#E5E5E5] pl-[25px]">
                <NavLink to="/profile-v2" onClick={onClose} className="flex w-full items-center gap-3 py-[10px] text-[16px] font-normal text-[#4c4c4c] transition-colors hover:bg-gray-hover">
                  <span>Settings</span>
                </NavLink>
                <button onClick={onClose} className="flex w-full items-center gap-3 py-[10px] text-[16px] font-normal text-[#4c4c4c] transition-colors hover:bg-gray-hover">
                  <span>Order History</span>
                  <img src={arrowDiagonalIcon} alt="" className="h-[18px] w-[18px] -ml-2 opacity-50" aria-hidden />
                </button>
                <button onClick={onClose} className="flex w-full items-center gap-3 py-[10px] text-[16px] font-normal text-[#4c4c4c] transition-colors hover:bg-gray-hover">
                  <span>Help</span>
                  <img src={arrowDiagonalIcon} alt="" className="h-[18px] w-[18px] -ml-2 opacity-50" aria-hidden />
                </button>
                <button onClick={onClose} className="flex w-full items-center gap-3 py-[10px] text-[16px] font-normal text-[#D92D20] transition-colors hover:bg-gray-hover">
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Become an expert banner — shown when expert mode is off */}
      {!expertMode && (
        <div className="px-5 pt-6">
          <div className="relative overflow-hidden rounded-[24px]">
            <img
              src={expertBanner}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
            <div className="relative flex flex-col gap-4 p-5 pt-24 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <h3 className="font-serif text-[24px] font-medium leading-tight text-white">
                Turn your experience into a business.
              </h3>
              <Button
                size="lg"
                variant="primary"
                rounded="rounded-full"
                className="w-full"
                onClick={onClose}
              >
                Become an expert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tools accordion */}
      <div className="mt-[100px]">
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
              <div className="relative ml-[31px] border-l-[1.5px] border-[#E5E5E5] pl-[25px] pr-5">
                <button
                  onClick={() => setExpertMode((v) => !v)}
                  className="flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-medium text-[#4c4c4c] transition-colors hover:bg-gray-hover"
                >
                  <span>Expert</span>
                  <span
                    aria-hidden
                    className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${expertMode ? "bg-[#222222]" : "bg-[#E5E5E5]"}`}
                  >
                    <span
                      className="absolute h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform"
                      style={{ transform: `translateX(${expertMode ? 20 : 2}px)` }}
                    />
                  </span>
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-medium text-[#4c4c4c] transition-colors hover:bg-gray-hover"
                >
                  <span>Dark Mode</span>
                  <span
                    aria-hidden
                    className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${darkMode ? "bg-[#222222]" : "bg-[#E5E5E5]"}`}
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
      </div>
    </motion.div>
  );
}
