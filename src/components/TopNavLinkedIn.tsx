import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import browserIcon from "../assets/icons/browser.svg";
import codeIcon from "../assets/icons/code.svg";
import { useIsCoachMode } from "../hooks/useIsCoachMode";
import { useNavTheme } from "./NavThemeContext";
import { useTopNavStyle } from "../contexts/TopNavStyleContext";
import { ExploreSearchModal } from "./ExploreSearchModal";
import { BrowseMenu } from "./BrowseMenu";
import { useExpertMode } from "../contexts/ExpertModeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
// Primary nav icons — always the filled variant; inactive states just fade to
// 40% opacity (see IconNavLink).
import homeIcon from "../assets/icons/nav-icons/home-alt.svg";
import exploreIcon from "../assets/icons/nav-icons/search-active.svg";
import notificationsIcon from "../assets/icons/nav-icons/notifications-active.svg";
import chatIcon from "../assets/icons/nav-icons/chat-active.svg";
import searchIcon from "../assets/icons/search.svg";
import myLelandIcon from "../assets/icons/nav-icons/browse-active.svg";
// Discover dropdown + profile menu icons.
import jobsIcon from "../assets/icons/jobs.svg";
// Outlined variants — used in the "More" dropdown list (the top nav uses the filled ones)
import livestreamsMenuIcon from "../assets/icons/lte-signal.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import lelandWordmark from "../assets/leland-wordmark.svg";

/* ── "Me" dropdown menu groups ── */
type MenuItem = { to: string | null; icon: string; label: string; danger: boolean; isProfile?: boolean; badge?: number };
const profileMenuGroups: { items: MenuItem[] }[] = [
  {
    items: [
      { to: "/my-leland/profile", icon: profilePhoto, label: "Profile", danger: false, isProfile: true },
      { to: null, icon: giftIcon, label: "Refer a friend", danger: false },
      { to: "/settings", icon: settingsIcon, label: "Settings", danger: false },
    ],
  },
  {
    items: [
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
    <span className="absolute -right-2 -top-1.5 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full border border-white bg-[#FF003D] px-1 py-0.5 text-[11px] font-semibold leading-none text-white">
      {count}
    </span>
  );
}

// Shared shell for every primary nav item — a full-height, LinkedIn-style
// stacked (icon over label) target with an active underline pinned to the
// header's bottom edge. Works for both NavLinks and dropdown triggers.
const itemBase =
  "group relative flex h-full shrink-0 flex-col items-center justify-center gap-1 px-2.5 pt-3 pb-2";
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
  // A fixed min-width keeps the primary items evenly spaced.
  return (
    <NavLink to={to} end={end} className={`${itemBase} min-w-[64px]`}>
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
  // Explore used to open a full universal-search modal (ExploreSearchModal).
  // That takeover is kept as a component but no longer wired to Browse — the
  // Browse trigger now opens the smaller BrowseMenu dropdown (below) on hover.
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  // Browse: whether the LinkedIn-style hover dropdown (BrowseMenu) is open.
  const [browseMenuOpen, setBrowseMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isCoachMode = useIsCoachMode();
  const navTheme = useNavTheme();
  const { pathname } = useLocation();
  const { setStyle, showNavLabels, altIcons, setAltIcons, showSearch, setShowSearch, navEdgeToEdge, setNavEdgeToEdge, feedEdgeToEdge, setFeedEdgeToEdge } = useTopNavStyle();
  const { expert, setExpert } = useExpertMode();
  // Inside the isolated /alt-nav experience, the nav destinations stay within
  // it (e.g. /alt-nav/messages); elsewhere they point at the normal routes.
  const inLinkedInNav = pathname.startsWith("/alt-nav") || pathname.startsWith("/my-leland");
  const homeTo = inLinkedInNav ? "/alt-nav" : "/";
  const navTo = (path: string) => (inLinkedInNav ? `/alt-nav${path}` : path);
  // The nav layout: search bar on the left (opt-in), the icon group + "Me"
  // dropdown on the right. Browse opens the LinkedIn-style hover dropdown; My
  // Leland and Jobs are standalone items in the icon group.
  //
  // "Alt icons" experiment: My Leland shows the profile photo, the "Me" item
  // becomes label-less, and the carets hide.

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
  const discoverActive = browseMenuOpen || searchModalOpen || pathname === "/browse" || pathname.startsWith("/browse/");
  // "My Leland" always opens the store shell (/my-leland); the Expert
  // toggle only controls whether the sidebar's "Expert tools" group shows.
  const myLelandTo = "/my-leland";
  const myLelandActive = pathname.startsWith("/my-leland");

  const activeProfileMenuGroups = useMemo(() => {
    // Browse shortcuts injected under Profile — there are no standalone
    // Livestreams/Content nav items, so they live in the "More" menu (Jobs is a
    // standalone nav item).
    const browseItems: MenuItem[] = [
      { to: navTo("/livestreams"), icon: livestreamsMenuIcon, label: "Free Livestreams", danger: false, isProfile: false },
      { to: navTo("/courses"), icon: myCoursesIcon, label: "Live Programs", danger: false, isProfile: false },
      { to: navTo("/content"), icon: bookOpenIcon, label: "Leland+", danger: false, isProfile: false },
    ];
    const [topGroup, bottomGroup] = profileMenuGroups;
    return [
      // Profile then Refer a friend + Settings
      { items: [...topGroup.items] },
      // Browse shortcuts join Help + Log out as one lower section
      { items: [...browseItems, ...bottomGroup.items] },
    ];
  }, [navTo]);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

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

  // The primary nav icon group — For you, Browse, My Leland, Jobs, Messages,
  // Notifications — positioned on the right of the header.
  const iconGroup = (
    <>
      {/* For you */}
      <IconNavLink to={homeTo} end label="For you" icon={homeIcon} />

      {/* Browse — opens the LinkedIn-style BrowseMenu hover dropdown. (The
          full-screen ExploreSearchModal is no longer wired to Browse — see
          searchModalOpen above.) */}
      <div
        className="relative flex items-stretch"
        onMouseEnter={() => setBrowseMenuOpen(true)}
        onMouseLeave={() => setBrowseMenuOpen(false)}
      >
        <button
          type="button"
          onClick={() => setBrowseMenuOpen((v) => !v)}
          className={`${itemBase} min-w-[64px]${showNavLabels ? "" : " !flex-row"}`}
          aria-expanded={browseMenuOpen}
        >
          <span className={iconWrap}>
            <img src={exploreIcon} alt="" className={iconCls(discoverActive)} />
          </span>
          <span className={`flex items-center gap-0.5 ${labelCls(discoverActive)}`}>
            {showNavLabels && "Browse"}
            {caret(browseMenuOpen)}
          </span>
        </button>

        {/* The LinkedIn-style Browse dropdown (modalities · buckets · categories) */}
        <BrowseMenu
          open={browseMenuOpen}
          navTo={navTo}
          onNavigate={() => setBrowseMenuOpen(false)}
        />
      </div>

      {/* My Leland */}
      <NavLink to={myLelandTo} className={`${itemBase} min-w-[64px]`}>
        {({ isActive }) => (
          <>
            <span className={iconWrap}>
              <img src={myLelandIcon} alt="" className={iconCls(isActive || myLelandActive)} />
            </span>
            {showNavLabels && <span className={labelCls(isActive || myLelandActive)}>My Leland</span>}
            {underline(isActive || myLelandActive)}
          </>
        )}
      </NavLink>

      {/* Jobs — standalone item, sitting between My Leland and Messages. */}
      <IconNavLink to={navTo("/jobs")} label="Jobs" icon={jobsIcon} />

      {/* Messages + Notifications */}
      <IconNavLink to={navTo("/messages")} label="Messages" icon={chatIcon} badge={1} />
      <IconNavLink to={navTo("/notifications")} label="Notifications" icon={notificationsIcon} badge={3} />
    </>
  );

  // Full search input — sits in the left cluster (opt-in via the admin toggle).
  const searchBar = (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="hidden h-11 w-[300px] items-center gap-2.5 self-center rounded-full bg-[#222222]/[0.06] px-4 transition-colors focus-within:bg-[#222222]/[0.09] md:flex"
    >
      <img src={searchIcon} alt="" className="h-5 w-5 shrink-0" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Leland"
        className="w-full bg-transparent text-[15px] text-gray-dark placeholder:text-gray-light outline-none"
      />
    </form>
  );

  return (
    <header
      className={`sticky top-0 z-30 ${
        reveal
          ? `transition-[background-color,box-shadow] duration-200 ${scrolled ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]" : ""}`
          : "border-b border-gray-stroke bg-white"
      }`}
      style={reveal && !scrolled ? { backgroundColor: navTheme.bg } : undefined}
    >
      <div className={`relative flex min-h-[60px] items-stretch justify-between gap-4 px-4 sm:px-6 ${navEdgeToEdge ? "w-full" : "mx-auto max-w-[1280px]"}`}>
        {/* Left: logo + (opt-in search bar) */}
        <div className="flex items-center gap-5 py-2.5">
          <NavLink to={isCoachMode ? "/coach/inbox" : homeTo} className="flex shrink-0 items-center">
            <img src={lelandWordmark} alt="Leland" className="h-6 w-auto" />
          </NavLink>
          {/* The search input is hidden unless the admin toggle turns it on */}
          {showSearch && searchBar}
        </div>

        {/* Right: icon group + Me dropdown */}
        <div className="flex items-stretch">
          {!isCoachMode && (
            <>
              <div className="flex items-stretch gap-[2px]">{iconGroup}</div>
              {/* Divider before the trailing Me dropdown */}
              <span className="my-3 mx-1 w-px self-stretch bg-gray-stroke" />
            </>
          )}

          {/* "Me" dropdown — profile photo trigger + the shared menu panel. */}
          <div ref={profileRef} className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className={`${itemBase} min-w-[64px]${!showNavLabels || altIcons ? " !flex-row" : ""}`}
              aria-label={altIcons ? "Me" : undefined}
              aria-expanded={profileOpen}
            >
              <span className={altIcons ? "relative flex items-center justify-center" : iconWrap}>
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className={`rounded-full object-cover ${altIcons ? "h-[32px] w-[32px]" : "h-[24px] w-[24px]"} ${profileOpen ? "ring-2 ring-gray-dark" : ""}`}
                />
              </span>
              {/* The default shows the "Me" label + chevron; alt-icons drops the
                  label but keeps the chevron. */}
              <span className={`flex items-center gap-0.5 ${labelCls(profileOpen)}`}>
                {showNavLabels && (altIcons ? null : "Me")}
                {caret(profileOpen)}
              </span>
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
                      {group.items.map(({ to, icon, label, danger, isProfile, badge }) =>
                        to ? (
                          <NavLink
                            key={label}
                            to={to}
                            onClick={() => setProfileOpen(false)}
                            className={`flex w-full items-center gap-[10px] rounded-lg px-3 py-[10px] text-[14px] font-medium transition-colors ${
                              danger ? "text-[#D92D20] hover:bg-[#222222]/5" : "text-gray-light hover:bg-[#222222]/5"
                            }`}
                          >
                            {icon && (
                              <span className="relative shrink-0">
                                <img
                                  src={icon}
                                  alt={label}
                                  className={`h-5 w-5${isProfile ? " rounded-full object-cover" : ""}`}
                                />
                                <NavBadge count={badge} />
                              </span>
                            )}
                            {label}
                          </NavLink>
                        ) : (
                          <button
                            key={label}
                            onClick={() => setProfileOpen(false)}
                            className={`flex w-full items-center gap-[10px] rounded-lg px-3 py-[10px] text-[14px] font-medium transition-colors ${
                              danger ? "text-[#D92D20] hover:bg-[#222222]/5" : "text-gray-light hover:bg-[#222222]/5"
                            }`}
                          >
                            {icon && <img src={icon} alt={label} className="h-5 w-5 shrink-0" />}
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
                    {/* Switch to coaching — moved here from the main menu list */}
                    <NavLink
                      to={isCoachMode ? "/" : "/coach/inbox"}
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                    >
                      <img src={switchIcon} alt="" className="h-5 w-5 shrink-0" />
                      {isCoachMode ? "Switch to customer view" : "Switch to coaching"}
                    </NavLink>
                    {/* Expert — toggles the "My Store" top-nav entry + coach view */}
                    <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                      <span className="text-[14px] font-medium text-gray-dark">Expert</span>
                      <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                        {([{ v: true, l: "On" }, { v: false, l: "Off" }] as const).map((o) => (
                          <button
                            key={o.l}
                            onClick={() => setExpert(o.v)}
                            className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                              expert === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                            }`}
                          >
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
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
                              to="/"
                              onClick={() => { setStyle("classic"); setProfileOpen(false); }}
                              className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
                            >
                              <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg>
                              Switch to Classic nav
                            </NavLink>
                            {/* Alt icons — profile-photo My Leland, label-less "Me", no carets */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Alt icons</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([{ v: true, l: "On" }, { v: false, l: "Off" }] as const).map((o) => (
                                  <button
                                    key={o.l}
                                    onClick={() => setAltIcons(o.v)}
                                    className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                                      altIcons === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                                    }`}
                                  >
                                    {o.l}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Search bar — show/hide the "Search Leland" input in the navbar */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Search bar</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([{ v: true, l: "On" }, { v: false, l: "Off" }] as const).map((o) => (
                                  <button
                                    key={o.l}
                                    onClick={() => setShowSearch(o.v)}
                                    className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                                      showSearch === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                                    }`}
                                  >
                                    {o.l}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Constrain the nav content to 1280 vs. extend it to the window edges */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Nav width</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([{ v: false, l: "Boxed" }, { v: true, l: "Full" }] as const).map((o) => (
                                  <button
                                    key={o.l}
                                    onClick={() => setNavEdgeToEdge(o.v)}
                                    className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                                      navEdgeToEdge === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                                    }`}
                                  >
                                    {o.l}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Center the feed within 1280 vs. push feed + sidebars to the window edges */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Feed</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([{ v: false, l: "Center" }, { v: true, l: "Edges" }] as const).map((o) => (
                                  <button
                                    key={o.l}
                                    onClick={() => setFeedEdgeToEdge(o.v)}
                                    className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                                      feedEdgeToEdge === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
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

      {/* Universal search modal — opened from Explore (portal to body) */}
      <ExploreSearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
}
