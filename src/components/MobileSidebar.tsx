import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useExpertMode } from "../contexts/ExpertModeContext";
import { useProfileBarMode, type ProfileBarMode } from "../contexts/ProfileBarModeContext";
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
import lteSignalIcon from "../assets/icons/lte-signal.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import arrowDiagonalIcon from "../assets/icons/arrow-diagonal.svg";
import toolsIcon from "../assets/icons/tools-wrench-ruler.svg";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sectionHeaderBase =
  "px-5 pt-2 pb-1 text-[16px]";

const menuItemBase =
  "flex items-center gap-3 px-5 py-[10px] text-[16px] font-normal transition-colors";

const groups = [
  { name: "AI BP April 26", image: groupImg1, to: "/groups/ai-bp-apr-26" },
  { name: "MBA Admissions 2027", image: groupImg2, to: "/groups/mba-admissions-2027" },
];

const expertItems = [
  { icon: lightningIcon, label: "Opportunities", to: "/coach/opportunities", external: false },
  { icon: storeIcon, label: "Offerings", to: "/coach/offerings", external: true },
  { icon: moneyIcon, label: "Earnings", to: "/coach/earnings", external: true },
];

const myLelandItems = [
  { icon: lteSignalIcon, label: "Free Livestreams", to: "/events", external: true },
  { icon: myCoursesIcon, label: "Live Programs", to: "/courses", external: true },
  { icon: bookOpenIcon, label: "Leland+", to: "/plus", external: true },
];

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();
  const { expert: expertMode, toggle: toggleExpertMode } = useExpertMode();
  const { mode: profileBarMode, setMode: setProfileBarMode } = useProfileBarMode();
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const textColor = darkMode ? "text-white" : "text-[#4c4c4c]";
  const headerColor = darkMode ? "text-white/50" : "text-gray-dark";
  const hoverBg = darkMode ? "hover:bg-white/10" : "hover:bg-gray-hover";
  const sectionHeader = `${sectionHeaderBase} ${headerColor} ${darkMode ? "font-medium" : "font-semibold"}`;
  const menuItemClass = `${menuItemBase} ${textColor} ${hoverBg}`;
  const iconClass = darkMode ? "h-6 w-6" : "h-6 w-6 opacity-80";

  const toggleSwitch = (isOn: boolean) => (
    <span
      aria-hidden
      className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${
        isOn
          ? (darkMode ? "bg-[#ffffff]" : "bg-[#222222]")
          : (darkMode ? "bg-white/15" : "bg-[#E5E5E5]")
      }`}
    >
      <span
        className={`absolute h-[22px] w-[22px] rounded-full shadow-sm transition-transform ${
          isOn
            ? (darkMode ? "bg-[#131313]" : "bg-[#ffffff]")
            : (darkMode ? "bg-[#131313]" : "bg-[#ffffff]")
        }`}
        style={{ transform: `translateX(${isOn ? 20 : 2}px)` }}
      />
    </span>
  );

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo(0, 0);
    } else {
      setAccountOpen(false);
      setAdminOpen(false);
    }
  }, [open]);

  return (
    <motion.div
      ref={scrollRef}
      className={`flex h-full w-[280px] flex-col overflow-y-auto pb-[120px] scrollbar-hide ${darkMode ? "bg-[#131313]" : "bg-white"}`}
      animate={{ scale: open ? 1 : 0.95, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
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
            <p className={`text-[18px] font-medium ${darkMode ? "text-white" : "text-gray-dark"}`}>Jane Doe</p>
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

      {/* Expert Tools */}
      <div className="pt-4">
        <p className={sectionHeader}>Expert tools</p>
        {expertMode ? (
          expertItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={menuItemClass}
            >
              <img src={item.icon} alt="" className={iconClass} aria-hidden />
              <span>{item.label}</span>
              {item.external && <img src={arrowDiagonalIcon} alt="" className={`h-[18px] w-[18px] -ml-2 ${darkMode ? "" : "opacity-50"}`} aria-hidden />}
            </NavLink>
          ))
        ) : (
          <p className="px-5 py-[10px] text-[16px] font-normal text-gray-extra-light">
            You haven't set up your expert profile yet.{" "}
            <button onClick={onClose} className={`${textColor} underline decoration-dotted decoration-[1.5px] underline-offset-[3px]`}>
              Get started
            </button>
          </p>
        )}
      </div>

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
            <img src={item.icon} alt="" className={iconClass} aria-hidden />
            <span>{item.label}</span>
            {item.external && <img src={arrowDiagonalIcon} alt="" className={`h-[18px] w-[18px] -ml-2 ${darkMode ? "" : "opacity-50"}`} aria-hidden />}
          </NavLink>
        ))}

        {/* Account accordion */}
        <button
          onClick={() => setAccountOpen((v) => !v)}
          className={`${menuItemClass} w-full`}
        >
          <img src={settingsIcon} alt="" className={`${iconClass} shrink-0`} aria-hidden />
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
              <div className={`relative ml-[31px] border-l-[1.5px] ${darkMode ? "border-white/20" : "border-[#E5E5E5]"} pl-[25px] pr-5`}>
                <NavLink to="/profile-v2" onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}>
                  <span>Settings</span>
                </NavLink>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}>
                  <span>Order History</span>
                  <img src={arrowDiagonalIcon} alt="" className={`h-[18px] w-[18px] -ml-2 ${darkMode ? "" : "opacity-50"}`} aria-hidden />
                </button>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}>
                  <span>Refer a Friend</span>
                  <img src={arrowDiagonalIcon} alt="" className={`h-[18px] w-[18px] -ml-2 ${darkMode ? "" : "opacity-50"}`} aria-hidden />
                </button>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}>
                  <span>Help</span>
                  <img src={arrowDiagonalIcon} alt="" className={`h-[18px] w-[18px] -ml-2 ${darkMode ? "" : "opacity-50"}`} aria-hidden />
                </button>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal text-[#D92D20] transition-colors ${hoverBg}`}>
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Tools accordion */}
        <button
          onClick={() => setAdminOpen((v) => !v)}
          className={`${menuItemClass} w-full`}
        >
          <img src={toolsIcon} alt="" className={`${iconClass} shrink-0`} aria-hidden />
          <span className="flex-1 text-left">Admin Tools</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
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
              <div className={`relative ml-[31px] border-l-[1.5px] ${darkMode ? "border-white/20" : "border-[#E5E5E5]"} pl-[25px] pr-5`}>
                <button
                  onClick={toggleExpertMode}
                  className={`flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>Expert</span>
                  {toggleSwitch(expertMode)}
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>Dark Mode</span>
                  {toggleSwitch(darkMode)}
                </button>
                <div className="flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal">
                  <span className={textColor}>Profile bar</span>
                  <div
                    className={`flex shrink-0 overflow-hidden rounded-full p-[2px] ${
                      darkMode ? "bg-white/15" : "bg-[#E5E5E5]"
                    }`}
                  >
                    {([1, 2, 3] as ProfileBarMode[]).map((m) => {
                      const active = profileBarMode === m;
                      const label = m === 1 ? "Min" : m === 2 ? "Title" : "Date";
                      return (
                        <button
                          key={m}
                          onClick={() => setProfileBarMode(m)}
                          className={`rounded-full px-[10px] py-[3px] text-[12px] font-medium transition-colors ${
                            active
                              ? darkMode
                                ? "bg-white text-[#131313]"
                                : "bg-[#222222] text-white"
                              : darkMode
                                ? "text-white/70"
                                : "text-[#4c4c4c]"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <NavLink
                  to="/onboarding"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>Onboarding flow</span>
                </NavLink>
                <NavLink
                  to="/onboarding-minimal"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>Onboarding flow (minimal)</span>
                </NavLink>
                <NavLink
                  to="/onboarding-minimal-v2"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>Onboarding flow (minimal v2)</span>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </motion.div>
  );
}
