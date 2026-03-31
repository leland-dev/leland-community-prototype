import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import profilePhoto from "../assets/profile photos/profile photo.png";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import calendarInactive from "../assets/icons/nav-icons/calendar-inactive.svg";
import calendarActive from "../assets/icons/nav-icons/calendar-active.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import lelandLogo from "../assets/Logo.svg";
import homeInactive from "../assets/icons/nav-icons/home-inactive.svg";
import homeActive from "../assets/icons/nav-icons/home-active.svg";

/* ── Nav links ── */
const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/courses", label: "Courses" },
  { to: "/plus", label: "Leland+" },
];

/* ── Browse dropdown categories ── */
const browseCategories = [
  { to: "#", label: "Popular" },
  { to: "#", label: "General" },
  { to: "#", label: "AI" },
  { to: "#", label: "School Admissions" },
  { to: "#", label: "Test Prep" },
  { to: "#", label: "Business" },
  { to: "#", label: "Finance & Accounting" },
  { to: "#", label: "Product" },
  { to: "#", label: "Technology" },
  { to: "#", label: "Health & Medicine" },
  { to: "#", label: "Law & Public Service" },
  { to: "#", label: "Arts, Media, and Entertainment" },
  { to: "#", label: "More" },
];

/* ── Profile dropdown menu items ── */
const profileMenuGroups = [
  {
    items: [
      { to: "/profile-v2", icon: profilePhoto, label: "Profile", danger: false, isProfile: true },
      { to: "/my-courses", icon: myCoursesIcon, label: "My courses", danger: false },
      { to: null, icon: giftIcon, label: "Refer a friend", danger: false },
      { to: "/settings", icon: settingsIcon, label: "Settings", danger: false },
    ],
  },
  {
    items: [
      { to: null, icon: switchIcon, label: "Switch to coaching", danger: false },
      { to: null, icon: helpIcon, label: "Help", danger: false },
      { to: null, icon: logOutIcon, label: "Log out", danger: true },
    ],
  },
];

export default function TopNav() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        browseRef.current &&
        !browseRef.current.contains(e.target as Node)
      ) {
        setBrowseOpen(false);
      }
    }
    if (profileOpen || browseOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, browseOpen]);

  return (
    <header className="border-b border-gray-stroke bg-white">
      <div className="mx-auto flex max-w-[1060px] items-stretch justify-between px-6">
        {/* Left: Logo + Nav links */}
        <div className="flex items-stretch gap-1">
          <NavLink to="/" className="mr-4 flex shrink-0 items-center py-5">
            <img src={lelandLogo} alt="Leland" className="h-[22px] w-auto" />
          </NavLink>

          <nav className="flex items-stretch gap-3">
            {/* Browse dropdown */}
            <div ref={browseRef} className="relative flex self-stretch items-center">
              <button
                onClick={() => setBrowseOpen(!browseOpen)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-[18px] font-medium whitespace-nowrap text-[#222222] hover:bg-gray-hover"
              >
                Browse
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`ml-0.5 transition-transform ${browseOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {browseOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
                  >
                    <div className="px-2 py-2">
                      {browseCategories.map(({ to, label }) => (
                        <NavLink
                          key={to}
                          to={to}
                          onClick={() => setBrowseOpen(false)}
                          className="flex w-full items-center justify-between rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                        >
                          {label}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0 text-gray-light"
                          >
                            <path
                              d="M6 4L10 8L6 12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining nav links */}
            {navLinks.filter(({ to }) => to !== "/").map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="relative flex self-stretch items-center"
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex items-center rounded-lg px-3 py-2 text-[18px] font-medium whitespace-nowrap text-[#222222]${!isActive ? " hover:bg-gray-hover" : ""}`}>
                      {label}
                    </span>
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
                  </>
                )}
              </NavLink>
            ))}

            {/* Search */}
            {showSearch && <div className="relative flex self-stretch items-center">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 px-3 py-2"
              >
                <img
                  src={searchFocused ? searchActive : searchInactive}
                  alt=""
                  className="h-[20px] w-[20px] shrink-0"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search..."
                  className="w-40 bg-transparent text-[18px] font-medium text-[#222222] placeholder:font-normal placeholder:text-[#999999] outline-none"
                />
              </form>
              {searchFocused && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
            </div>}
          </nav>
        </div>

        {/* Right: Home, Inbox, Calendar, Notifications, Profile */}
        <div className="flex shrink-0 items-stretch gap-1">

          {/* Home */}
          <NavLink to="/" end className="relative flex self-stretch items-center">
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center h-10 w-10 rounded-full py-5${!isActive ? " hover:bg-gray-hover" : ""}`}>
                  <img src={isActive ? homeActive : homeInactive} alt="Home" className="h-[20px] w-[20px]" />
                </span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
              </>
            )}
          </NavLink>

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className="relative p-3 text-[18px] font-medium whitespace-nowrap rounded-lg text-[#222222] hover:bg-gray-hover"
          >
            Dashboard
          </NavLink>

          {/* Inbox */}
          <NavLink to="/messages" className="relative flex self-stretch items-center">
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center h-10 w-10 rounded-full py-5${!isActive ? " hover:bg-gray-hover" : ""}`}>
                  <img src={isActive ? chatActive : chatInactive} alt="Inbox" className="h-[20px] w-[20px]" />
                </span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
              </>
            )}
          </NavLink>

          {/* Calendar */}
          <NavLink to="/calendar" className="relative flex self-stretch items-center">
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center h-10 w-10 rounded-full py-5${!isActive ? " hover:bg-gray-hover" : ""}`}>
                  <img src={isActive ? calendarActive : calendarInactive} alt="Calendar" className="h-[20px] w-[20px]" />
                </span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
              </>
            )}
          </NavLink>

          {/* Notifications */}
          <NavLink to="/notifications" className="relative flex self-stretch items-center">
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center h-10 w-10 rounded-full py-5${!isActive ? " hover:bg-gray-hover" : ""}`}>
                  <img src={isActive ? notificationsActive : notificationsInactive} alt="Notifications" className="h-[20px] w-[20px]" />
                </span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
              </>
            )}
          </NavLink>

          {/* Profile avatar + dropdown */}
          <div ref={profileRef} className="relative ml-1 flex items-center">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full"
            >
              <img
                src={profilePhoto}
                alt="Profile"
                className={`h-[30px] w-[30px] rounded-full object-cover transition-shadow ${
                  profileOpen ? "ring-2 ring-gray-dark" : "hover:ring-2 hover:ring-gray-stroke"
                }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
                >
                  {profileMenuGroups.map((group, gi) => (
                    <div
                      key={gi}
                      className={`px-2 py-2${gi > 0 ? " border-t border-gray-stroke" : ""}`}
                    >
                      {group.items.map(({ to, icon, label, danger, isProfile }) =>
                        to ? (
                          <NavLink
                            key={label}
                            to={to}
                            onClick={() => setProfileOpen(false)}
                            className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium transition-colors ${
                              danger
                                ? "text-[#D92D20] hover:bg-gray-hover"
                                : "text-gray-dark hover:bg-gray-hover"
                            }`}
                          >
                            {icon && (
                              <img
                                src={icon}
                                alt={label}
                                className={`h-6 w-6 shrink-0${isProfile ? " rounded-full object-cover" : ""}`}
                              />
                            )}
                            {label}
                          </NavLink>
                        ) : (
                          <button
                            key={label}
                            onClick={() => setProfileOpen(false)}
                            className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[16px] font-medium transition-colors ${
                              danger
                                ? "text-[#D92D20] hover:bg-gray-hover"
                                : "text-gray-dark hover:bg-gray-hover"
                            }`}
                          >
                            {icon && (
                              <img src={icon} alt={label} className="h-6 w-6 shrink-0" />
                            )}
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  ))}

                  {/* Admin controls */}
                  <div className="border-t border-gray-stroke px-2 py-2">
                    <p className="px-3 pb-1 pt-2 text-[12px] font-semibold uppercase tracking-wide text-[#999999]">
                      Admin Controls
                    </p>
                    <label className="flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
                      Search bar
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showSearch}
                        onClick={() => setShowSearch(!showSearch)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${showSearch ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${showSearch ? "translate-x-5" : ""}`}
                        />
                      </button>
                    </label>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
