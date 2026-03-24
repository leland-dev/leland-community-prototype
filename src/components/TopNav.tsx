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
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import arrowRoundIcon from "../assets/icons/arrow-round.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import lelandLogo from "../assets/Logo.svg";

/* ── Nav links ── */
const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Free Events" },
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
      { to: "/profile-v2", icon: profilePhoto, label: "View Profile", danger: false, isProfile: true },
      { to: null, icon: giftIcon, label: "Refer a friend", danger: false },
      { to: null, icon: settingsIcon, label: "Settings", danger: false },
      { to: null, icon: arrowRoundIcon, label: "Order History", danger: false },
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
  const [navVersion, setNavVersion] = useState<1 | 2>(1);
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
      <div className="mx-auto flex items-center justify-between px-5 py-3">
        {navVersion === 1 ? (
          <>
            {/* ── Version 1: Left: Logo + Nav links ── */}
            <div className="flex items-center gap-1">
              <NavLink to="/" className="mr-4 flex shrink-0 items-center">
                <img src={lelandLogo} alt="Leland" className="h-[22px] w-auto" />
              </NavLink>

              <nav className="flex items-center gap-3">
            {/* Feed */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative p-3 text-[18px] font-medium whitespace-nowrap rounded-lg transition-colors ${
                  isActive
                    ? "text-gray-dark"
                    : "text-gray-light hover:bg-gray-hover"
                }`
              }
            >
              Home
            </NavLink>

            {/* Browse dropdown */}
            <div ref={browseRef} className="relative">
              <button
                onClick={() => setBrowseOpen(!browseOpen)}
                className={`flex items-center gap-1 rounded-lg p-3 text-[18px] font-medium whitespace-nowrap transition-colors ${
                  browseOpen
                    ? "text-gray-dark"
                    : "text-gray-light hover:bg-gray-hover"
                }`}
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
                className={({ isActive }) =>
                  `relative p-3 text-[18px] font-medium whitespace-nowrap rounded-lg transition-colors ${
                    isActive
                      ? "text-gray-dark"
                      : "text-gray-light hover:bg-gray-hover"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
              </nav>
            </div>

            {/* ── Version 1: Right: Search, Inbox, Notifications, Profile ── */}
            <div className="flex shrink-0 items-center gap-1">
          {/* Search */}
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-gray-hover" : "hover:bg-gray-hover"
              }`
            }
          >
            {({ isActive }) => (
              <img
                src={isActive ? searchActive : searchInactive}
                alt="Search"
                className="h-[20px] w-[20px]"
              />
            )}
          </NavLink>

          {/* Inbox */}
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-gray-hover" : "hover:bg-gray-hover"
              }`
            }
          >
            {({ isActive }) => (
              <img
                src={isActive ? chatActive : chatInactive}
                alt="Inbox"
                className="h-[20px] w-[20px]"
              />
            )}
          </NavLink>

          {/* Notifications */}
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-gray-hover" : "hover:bg-gray-hover"
              }`
            }
          >
            {({ isActive }) => (
              <img
                src={isActive ? notificationsActive : notificationsInactive}
                alt="Notifications"
                className="h-[20px] w-[20px]"
              />
            )}
          </NavLink>

          {/* Profile avatar + dropdown */}
          <div ref={profileRef} className="relative ml-1">
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
                  {/* Version toggle */}
                  <div className="px-2 py-2 border-b border-gray-stroke">
                    <button
                      onClick={() => setNavVersion(2)}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <span>Nav Version {navVersion}</span>
                      <div
                        className="relative h-[22px] w-[40px] rounded-full transition-colors bg-gray-300"
                      >
                        <div
                          className="absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-transform translate-x-[3px]"
                        />
                      </div>
                    </button>
                  </div>

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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </div>
          </>
        ) : (
          <>
            {/* ── Version 2: Left: Logo + Search ── */}
            <div className="flex flex-1 items-center gap-4">
              <NavLink to="/" className="flex shrink-0 items-center">
                <img src={lelandLogo} alt="Leland" className="h-[22px] w-auto" />
              </NavLink>

              <div className="relative w-full max-w-[600px]">
                <img
                  src={searchInactive}
                  alt=""
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-[20px] w-[20px]"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-full bg-gray-hover pl-11 pr-4 py-[10px] text-[16px] text-gray-dark placeholder:text-[16px] placeholder:text-gray-light transition-shadow focus:bg-white focus:shadow-[0_0_0_2px_#222222] focus:outline-none"
                />
              </div>
            </div>

            {/* ── Version 2: Right: Nav links + Inbox + Notifications + Profile ── */}
            <div className="flex shrink-0 items-center gap-1">
              <nav className="flex items-center gap-3 mr-2">
                {/* Feed */}
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `relative p-3 text-[18px] font-medium whitespace-nowrap rounded-lg transition-colors ${
                      isActive
                        ? "text-gray-dark"
                        : "text-gray-light hover:bg-gray-hover"
                    }`
                  }
                >
                  Home
                </NavLink>

                {/* Browse dropdown */}
                <div ref={browseRef} className="relative">
                  <button
                    onClick={() => setBrowseOpen(!browseOpen)}
                    className={`flex items-center gap-1 rounded-lg p-3 text-[18px] font-medium whitespace-nowrap transition-colors ${
                      browseOpen
                        ? "text-gray-dark"
                        : "text-gray-light hover:bg-gray-hover"
                    }`}
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
                        className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
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
                    className={({ isActive }) =>
                      `relative p-3 text-[18px] font-medium whitespace-nowrap rounded-lg transition-colors ${
                        isActive
                          ? "text-gray-dark"
                          : "text-gray-light hover:bg-gray-hover"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Inbox */}
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-gray-hover" : "hover:bg-gray-hover"
                  }`
                }
              >
                {({ isActive }) => (
                  <img
                    src={isActive ? chatActive : chatInactive}
                    alt="Inbox"
                    className="h-[20px] w-[20px]"
                  />
                )}
              </NavLink>

              {/* Notifications */}
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-gray-hover" : "hover:bg-gray-hover"
                  }`
                }
              >
                {({ isActive }) => (
                  <img
                    src={isActive ? notificationsActive : notificationsInactive}
                    alt="Notifications"
                    className="h-[20px] w-[20px]"
                  />
                )}
              </NavLink>

              {/* Profile avatar + dropdown */}
              <div ref={profileRef} className="relative ml-1">
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
                      {/* Version toggle */}
                      <div className="px-2 py-2 border-b border-gray-stroke">
                        <button
                          onClick={() => setNavVersion(1)}
                          className="flex w-full items-center justify-between rounded-lg p-3 text-[16px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                        >
                          <span>Nav Version {navVersion}</span>
                          <div
                            className="relative h-[22px] w-[40px] rounded-full transition-colors bg-[#038561]"
                          >
                            <div
                              className="absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-transform translate-x-[21px]"
                            />
                          </div>
                        </button>
                      </div>

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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
