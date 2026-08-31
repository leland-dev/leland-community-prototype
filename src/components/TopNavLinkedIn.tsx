import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import browserIcon from "../assets/icons/browser.svg";
import codeIcon from "../assets/icons/code.svg";
import { useIsCoachMode } from "../hooks/useIsCoachMode";
import { useNavTheme } from "./NavThemeContext";
import { useTopNavStyle } from "../contexts/TopNavStyleContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
// Primary nav icons — always the filled variant; inactive states just fade to
// 40% opacity (see IconNavLink).
import homeIcon from "../assets/icons/nav-icons/home-active.svg";
import homeAltIcon from "../assets/icons/nav-icons/home-alt.svg";
import browseIcon from "../assets/icons/nav-icons/browse-active.svg";
import notificationsIcon from "../assets/icons/nav-icons/notifications-active.svg";
import chatIcon from "../assets/icons/nav-icons/chat-active.svg";
import searchIcon from "../assets/icons/search.svg";
import searchActiveIcon from "../assets/icons/nav-icons/search-active.svg";
import moreActiveIcon from "../assets/icons/nav-icons/more-active.svg";
import userCircleIcon from "../assets/icons/user-circle-filled.svg";
import userCircleOutlineIcon from "../assets/icons/user-circle.svg";
// Discover dropdown + profile menu icons.
import briefcaseFilledIcon from "../assets/icons/briefcase-filled.svg";
import contentFilledIcon from "../assets/icons/content-book-filled.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import lelandWordmark from "../assets/leland-wordmark.svg";

/* ── Discover dropdown — browse-by-category list, mirroring the classic nav ── */
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

/* ── "Me" dropdown menu groups ── */
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

// A numbered bubble / unread dot anchored to the top-right of a nav icon.
function NavBadge({ count, dot }: { count?: number; dot?: boolean }) {
  if (dot) {
    return <span className="absolute right-0 top-0 h-[9px] w-[9px] rounded-full border border-white bg-[#FF003D]" />;
  }
  if (!count) return null;
  return (
    <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full border border-white bg-[#FF003D] px-1 text-[10px] font-semibold leading-none text-white">
      {count}
    </span>
  );
}

// Shared shell for every primary nav item — a full-height, LinkedIn-style
// stacked (icon over label) target with an active underline pinned to the
// header's bottom edge. Works for both NavLinks and dropdown triggers.
const itemBase =
  "group relative flex h-full min-w-[74px] shrink-0 flex-col items-center justify-center gap-1 px-2.5 pt-3 pb-2";
// Tighter item (no fixed min-width, less horizontal padding) — used for the v3
// Profile + Menu pair so they sit close together rather than evenly spaced.
const compactItemBase =
  "group relative flex h-full shrink-0 flex-col items-center justify-center gap-1 px-2 pt-3 pb-2";
const iconWrap = "relative flex h-[24px] w-[24px] items-center justify-center";
const labelCls = (active: boolean) =>
  `text-[12px] leading-none transition-colors ${
    active ? "font-semibold text-[#222222]" : "font-medium text-[#666666] group-hover:text-[#222222]"
  }`;
const underline = (active: boolean) =>
  active ? <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#222222]" /> : null;
// Icons are always the filled variant — inactive just fades to 40% opacity,
// returning to full on hover.
const iconCls = (active: boolean) =>
  `h-[24px] w-[24px] transition-opacity ${active ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`;

// Filled-icon nav link — opacity marks active vs. inactive.
function IconNavLink({
  to,
  end,
  label,
  icon,
  badge,
  dot,
}: {
  to: string;
  end?: boolean;
  label: string;
  icon: string;
  badge?: number;
  dot?: boolean;
}) {
  const { showNavLabels } = useTopNavStyle();
  return (
    <NavLink to={to} end={end} className={itemBase}>
      {({ isActive }) => (
        <>
          <span className={iconWrap}>
            <img src={icon} alt="" className={iconCls(isActive)} />
            <NavBadge count={badge} dot={dot} />
          </span>
          {showNavLabels && <span className={labelCls(isActive)}>{label}</span>}
          {underline(isActive)}
        </>
      )}
    </NavLink>
  );
}

export default function TopNavLinkedIn() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isCoachMode = useIsCoachMode();
  const navTheme = useNavTheme();
  const { pathname } = useLocation();
  const { variant, setVariant, showNavLabels, setShowNavLabels } = useTopNavStyle();
  // Inside the isolated /linkedin-nav experience, the nav destinations stay within
  // it (e.g. /linkedin-nav/messages); elsewhere they point at the normal routes.
  const inLinkedInNav = pathname.startsWith("/linkedin-nav");
  const homeTo = inLinkedInNav ? "/linkedin-nav" : "/";
  const navTo = (path: string) => (inLinkedInNav ? `/linkedin-nav${path}` : path);
  // v2 and v3 promote Jobs + Content into the top nav and move My Leland into the
  // Me dropdown. v3 additionally centers the icons, drops the search bar, and uses
  // a search glyph for Browse.
  const promoteJobsContent = variant === 2 || variant === 3;
  const isCentered = variant === 3;

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

  // Discover (Browse) opens a browse-by-category list; it reads as active while
  // on the browse surface or whenever its dropdown is open.
  const discoverActive = discoverOpen || pathname === "/browse" || pathname.startsWith("/browse/");
  const myLelandActive =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname.startsWith("/linkedin-nav/dashboard");

  const activeProfileMenuGroups = useMemo(() => {
    let groups = profileMenuGroups;
    // v2 & v3: My Leland moves off the top nav into the Me menu, replacing My programs.
    if (variant === 2 || variant === 3) {
      groups = groups.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.label === "My programs"
            ? { ...item, to: navTo("/dashboard"), label: "My Leland", icon: userCircleOutlineIcon }
            : item
        ),
      }));
    }
    if (isCoachMode) {
      groups = groups.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.label === "Switch to coaching"
            ? { ...item, to: "/", label: "Switch to customer view" }
            : item
        ),
      }));
    }
    return groups;
  }, [isCoachMode, variant, inLinkedInNav]);

  const profileRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (discoverRef.current && !discoverRef.current.contains(e.target as Node)) {
        setDiscoverOpen(false);
      }
    }
    if (profileOpen || discoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, discoverOpen]);

  const caret = (open: boolean): ReactNode => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <header
      // data-nav-variant exposes the active v1/v2/v3 variant — branch on
      // `variant` in this component (or target [data-nav-variant="2"] in CSS) to
      // make per-variant style tweaks.
      data-nav-variant={variant}
      className={`sticky top-0 z-30 ${
        reveal
          ? `transition-[background-color,box-shadow] duration-200 ${scrolled ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]" : ""}`
          : "border-b border-gray-stroke bg-white"
      }`}
      style={reveal && !scrolled ? { backgroundColor: navTheme.bg } : undefined}
    >
      <div className={`relative mx-auto flex min-h-[60px] max-w-[1280px] items-stretch justify-between px-4 sm:px-6 ${isCentered ? "" : "gap-4"}`}>
        {/* Left: Logo (+ search on the non-centered variants) */}
        <div className={`flex items-center py-2.5 ${isCentered ? "" : "min-w-0 flex-1 gap-6"}`}>
          <NavLink to={isCoachMode ? "/coach/inbox" : "/"} className="flex shrink-0 items-center">
            <img src={lelandWordmark} alt="Leland" className="h-6 w-auto" />
          </NavLink>
          {!isCentered && (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden md:flex h-10 w-full max-w-[340px] flex-1 items-center gap-2 rounded-full border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark"
            >
              <img src={searchIcon} alt="" className="h-[18px] w-[18px] shrink-0 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Leland"
                className="w-full bg-transparent text-[14px] text-gray-dark placeholder:text-gray-light outline-none"
              />
            </form>
          )}
        </div>

        {/* Right: Primary icon nav + Me */}
        <div className="flex items-stretch">
          {!isCoachMode && (
            <>
              {/* Icon group — centered as an absolute overlay on v3, in-flow otherwise */}
              <div className={isCentered ? "absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-stretch" : "flex items-stretch"}>
              {/* For you */}
              <IconNavLink to={homeTo} end label="For you" icon={isCentered ? homeAltIcon : homeIcon} />

              {/* Discover — dropdown holding Browse experts + the rest */}
              <div ref={discoverRef} className="relative flex items-stretch">
                <button
                  type="button"
                  onClick={() => setDiscoverOpen((v) => !v)}
                  className={`${itemBase}${showNavLabels ? "" : " !flex-row"}`}
                  aria-expanded={discoverOpen}
                >
                  <span className={iconWrap}>
                    <img src={isCentered ? searchActiveIcon : browseIcon} alt="" className={iconCls(discoverActive)} />
                  </span>
                  <span className={`flex items-center gap-0.5 ${labelCls(discoverActive)}`}>
                    {showNavLabels && "Browse"}
                    {!isCentered && caret(discoverOpen)}
                  </span>
                  {underline(discoverActive)}
                </button>

                <AnimatePresence>
                  {discoverOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute right-0 top-full z-50 mt-1 w-64 rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
                    >
                      {browseCategories.map(({ to, label }) => (
                        <NavLink
                          key={label}
                          to={to}
                          onClick={() => setDiscoverOpen(false)}
                          className="flex w-full items-center justify-between rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5"
                        >
                          {label}
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-light">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* v2 & v3 — Jobs + Content promoted out of the Discover dropdown */}
              {promoteJobsContent && (
                <>
                  <IconNavLink to={navTo("/jobs")} label="Jobs" icon={briefcaseFilledIcon} />
                  <IconNavLink to={navTo("/plus")} label="Content" icon={contentFilledIcon} />
                </>
              )}

              {/* My Leland — hidden on v2/v3 (moves into the Me dropdown there) */}
              {!promoteJobsContent && (
                <NavLink to={navTo("/dashboard")} className={itemBase}>
                  {({ isActive }) => (
                    <>
                      <span className={iconWrap}>
                        <img src={userCircleIcon} alt="" className={iconCls(isActive || myLelandActive)} />
                      </span>
                      {showNavLabels && <span className={labelCls(isActive || myLelandActive)}>My Leland</span>}
                      {underline(isActive || myLelandActive)}
                    </>
                  )}
                </NavLink>
              )}

              {/* Messages */}
              <IconNavLink to={navTo("/messages")} label="Messages" icon={chatIcon} badge={1} />

              {/* Notifications */}
              <IconNavLink to={navTo("/notifications")} label="Notifications" icon={notificationsIcon} dot />
              </div>

              {/* Divider — non-centered variants only */}
              {!isCentered && <span className="my-3 mx-1 w-px self-stretch bg-gray-stroke" />}
            </>
          )}

          {/* Profile photo — v3 gives Profile its own standalone link, with a
              separate "more" menu button beside it. Other variants keep the
              single "Me" avatar + caret dropdown. */}
          {isCentered && (
            <NavLink to="/profile/june-allen?me=1" className={compactItemBase}>
              {({ isActive }) => (
                <>
                  <span className={`relative flex items-center justify-center ${showNavLabels ? "h-[24px] w-[24px]" : "h-[30px] w-[30px]"}`}>
                    <img src={profilePhoto} alt="Profile" className={`rounded-full object-cover ${showNavLabels ? "h-[24px] w-[24px]" : "h-[30px] w-[30px]"} ${isActive ? "ring-2 ring-gray-dark" : ""}`} />
                  </span>
                  {showNavLabels && <span className={labelCls(isActive)}>Profile</span>}
                  {underline(isActive)}
                </>
              )}
            </NavLink>
          )}

          {/* Me (v1/v2) / Menu (v3) trigger + dropdown */}
          <div ref={profileRef} className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className={`${isCentered ? compactItemBase : itemBase}${showNavLabels ? "" : " !flex-row"}`}
              aria-expanded={profileOpen}
            >
              {isCentered ? (
                <>
                  <span className={iconWrap}>
                    <img src={moreActiveIcon} alt="" className={iconCls(profileOpen)} />
                  </span>
                  {showNavLabels && <span className={labelCls(profileOpen)}>Menu</span>}
                </>
              ) : (
                <>
                  <span className={iconWrap}>
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className={`h-[24px] w-[24px] rounded-full object-cover ${profileOpen ? "ring-2 ring-gray-dark" : ""}`}
                    />
                  </span>
                  <span className={`flex items-center gap-0.5 ${labelCls(profileOpen)}`}>
                    {showNavLabels && "Me"}
                    {caret(profileOpen)}
                  </span>
                </>
              )}
              {underline(profileOpen)}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute right-0 top-full z-50 mt-1 w-64 rounded-2xl border border-gray-stroke bg-white shadow-lg"
                >
                  {activeProfileMenuGroups.map((group, gi) => (
                    <div key={gi} className={`px-2 py-2${gi > 0 ? " border-t border-gray-stroke" : ""}`}>
                      {group.items.map(({ to, icon, label, danger, isProfile }) =>
                        to ? (
                          <NavLink
                            key={label}
                            to={to}
                            onClick={() => setProfileOpen(false)}
                            className={`flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium transition-colors ${
                              danger ? "text-[#D92D20] hover:bg-[#222222]/5" : "text-gray-dark hover:bg-[#222222]/5"
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
                              danger ? "text-[#D92D20] hover:bg-[#222222]/5" : "text-gray-dark hover:bg-[#222222]/5"
                            }`}
                          >
                            {icon && <img src={icon} alt={label} className="h-6 w-6 shrink-0" />}
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  ))}

                  {/* Admin controls — collapsible, closed by default */}
                  <div className="border-t border-gray-stroke px-2 py-2">
                    <button
                      onClick={() => setAdminOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-lg px-3 pb-1 pt-2 hover:bg-[#222222]/5"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-light">Admin Controls</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-[#999999] transition-transform ${adminOpen ? "rotate-180" : ""}`} aria-hidden>
                        <polyline points="4 6 8 10 12 6" />
                      </svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {adminOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <NavLink
                      to="/partner-dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <img src={browserIcon} alt="" className="h-5 w-5 shrink-0" />
                      Partner dashboard
                    </NavLink>
                    <NavLink
                      to="/components"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <img src={codeIcon} alt="" className="h-5 w-5 shrink-0" />
                      Components
                    </NavLink>
                    {/* Navigation — pick the top-level nav experience */}
                    <button
                      onClick={() => setNavMenuOpen((v) => !v)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                      <span className="flex-1 text-left">Navigation</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${navMenuOpen ? "rotate-180" : ""}`} aria-hidden>
                        <polyline points="4 6 8 10 12 6" />
                      </svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {navMenuOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="ml-[22px] border-l-[1.5px] border-gray-stroke pl-2">
                            <NavLink
                              to="/alt-nav"
                              onClick={() => setProfileOpen(false)}
                              className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                            >
                              <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></svg>
                              Switch to Sidebar nav
                            </NavLink>
                            <NavLink
                              to="/"
                              onClick={() => setProfileOpen(false)}
                              className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                            >
                              <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg>
                              Switch to Classic nav
                            </NavLink>
                            {/* Alt-nav design variant — v1 / v2 / v3 scratch toggle */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Variant</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([1, 2, 3] as const).map((v) => (
                                  <button
                                    key={v}
                                    onClick={() => setVariant(v)}
                                    className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                                      variant === v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                                    }`}
                                  >
                                    V{v}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Show / hide the labels under the top-level nav icons */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Labels</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([{ v: true, l: "Show" }, { v: false, l: "Hide" }] as const).map((o) => (
                                  <button
                                    key={o.l}
                                    onClick={() => setShowNavLabels(o.v)}
                                    className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                                      showNavLabels === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                                    }`}
                                  >
                                    {o.l}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                        </motion.div>
                      )}
                    </AnimatePresence>
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
