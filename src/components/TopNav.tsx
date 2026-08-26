import { useState, useRef, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useSubNavStyle } from "./SubNavStyleContext";
import { useIsCoachMode } from "../hooks/useIsCoachMode";
import { useNavTheme } from "./NavThemeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import notificationsActive from "../assets/icons/nav-icons/notifications-active.svg";
import searchInactive from "../assets/icons/nav-icons/search-inactive.svg";
import searchActive from "../assets/icons/nav-icons/search-active.svg";
import chatInactive from "../assets/icons/nav-icons/chat-inactive.svg";
import chatActive from "../assets/icons/nav-icons/chat-active.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import lelandWordmark from "../assets/leland-wordmark.svg";

/* ── Nav links ── */
const navLinks = [
  { to: "/", label: "Feed", end: true },
  { to: "/events", label: "Livestreams" },
  { to: "/courses", label: "Live programs" },
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
      { to: "/profile/june-allen?me=1", icon: profilePhoto, label: "Profile", danger: false, isProfile: true },
      { to: "/my-programs", icon: myCoursesIcon, label: "My programs", danger: false },
      { to: null, icon: giftIcon, label: "Refer a friend", danger: false },
      { to: "/settings", icon: settingsIcon, label: "Settings", danger: false },
    ],
  },
  {
    items: [
      { to: "/coach/inbox", icon: switchIcon, label: "Switch to coaching", danger: false },
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
  const [showSearch] = useState(false);
  const { showSubNav } = useSubNavStyle();
  const isCoachMode = useIsCoachMode();
  const navTheme = useNavTheme();

  // scrollReveal pages (e.g. Dashboard) start with the nav matching the hero
  // color, then swap to white + a subtle shadow once the user scrolls.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!navTheme.scrollReveal) return;
    const onScroll = () => setScrolled(window.scrollY > 1);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navTheme.scrollReveal]);
  const reveal = navTheme.scrollReveal;

  const activeProfileMenuGroups = useMemo(() => {
    if (!isCoachMode) return profileMenuGroups;
    return profileMenuGroups.map((group) => ({
      ...group,
      items: group.items
        .filter((item) => item.label !== "My courses")
        .map((item) =>
          item.label === "Switch to coaching"
            ? { ...item, to: "/", label: "Switch to customer view" }
            : item
        ),
    }));
  }, [isCoachMode]);

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
    <header
      className={`sticky top-0 z-30 ${
        reveal
          ? `transition-[background-color,box-shadow] duration-200 ${scrolled ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]" : ""}`
          : "border-b border-gray-stroke bg-white"
      }`}
      style={reveal && !scrolled ? { backgroundColor: navTheme.bg } : undefined}
    >
      <div className="flex items-stretch justify-between px-6">
        {/* Left: Logo + Nav links */}
        <div className="flex items-stretch gap-1">
          <NavLink to={isCoachMode ? "/coach/inbox" : "/"} className="mr-4 flex shrink-0 items-center py-5">
            <img src={lelandWordmark} alt="Leland" className="h-6 w-auto" />
          </NavLink>

          {!isCoachMode && (
            <nav className="flex items-stretch gap-3">
              {/* Feed */}
              <NavLink to="/" end className="relative flex self-stretch items-center">
                <span className="flex items-center rounded-lg px-3 py-2 text-[15px] font-medium whitespace-nowrap text-[#222222] hover:bg-[#222222]/5">
                  Feed
                </span>
              </NavLink>

              {/* Browse dropdown */}
              <div ref={browseRef} className="relative flex self-stretch items-center">
                <button
                  onClick={() => setBrowseOpen(!browseOpen)}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium whitespace-nowrap text-[#222222] hover:bg-[#222222]/5"
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
                            className="flex w-full items-center justify-between rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5"
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

              {/* Nav links (Events, Courses, Leland+) */}
              {navLinks.filter(({ to }) => to !== "/").map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} className="relative flex self-stretch items-center">
                  <span className="flex items-center rounded-lg px-3 py-2 text-[15px] font-medium whitespace-nowrap text-[#222222] hover:bg-[#222222]/5">
                    {label}
                  </span>
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
                    className="w-40 bg-transparent text-[15px] font-medium text-[#222222] placeholder:font-normal placeholder:text-[#999999] outline-none"
                  />
                </form>
                {searchFocused && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#333333]" />}
              </div>}
            </nav>
          )}
        </div>

        {/* Right: Dashboard, Inbox, Notifications, Profile */}
        <div className="flex shrink-0 items-stretch gap-1">

          {/* Dashboard */}
          {!isCoachMode && (
            <NavLink to="/dashboard" className="relative flex self-stretch items-center">
              <span className="flex items-center rounded-lg px-3 py-2 text-[15px] font-medium whitespace-nowrap text-[#222222] hover:bg-[#222222]/5">
                Dashboard
              </span>
            </NavLink>
          )}

          {/* Inbox */}
          {!isCoachMode && (
            <NavLink to="/messages" className="relative flex self-stretch items-center">
              {({ isActive }) => (
                <>
                  <span className="flex items-center justify-center h-10 w-10 rounded-full py-5 hover:bg-[#222222]/5">
                    <img src={isActive ? chatActive : chatInactive} alt="Inbox" className="h-[20px] w-[20px]" />
                  </span>
                </>
              )}
            </NavLink>
          )}

          {/* Notifications */}
          <NavLink to="/notifications" className="relative flex self-stretch items-center">
            {({ isActive }) => (
              <>
                <span className="flex items-center justify-center h-10 w-10 rounded-full py-5 hover:bg-[#222222]/5">
                  <img src={isActive ? notificationsActive : notificationsInactive} alt="Notifications" className="h-[20px] w-[20px]" />
                </span>
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
                  {activeProfileMenuGroups.map((group, gi) => (
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
                            className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium transition-colors ${
                              danger
                                ? "text-[#D92D20] hover:bg-[#222222]/5"
                                : "text-gray-dark hover:bg-[#222222]/5"
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
                            className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium transition-colors ${
                              danger
                                ? "text-[#D92D20] hover:bg-[#222222]/5"
                                : "text-gray-dark hover:bg-[#222222]/5"
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
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-[#999999]">
                      Admin Controls
                    </p>
                    <NavLink
                      to="/onboarding-minimal-v2"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                      Onboarding
                    </NavLink>
                    <NavLink
                      to="/waitlist"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg>
                      Waitlist
                    </NavLink>
                    <NavLink
                      to="/waitlist-onboarding"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
                      Waitlist Onboarding
                    </NavLink>
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
