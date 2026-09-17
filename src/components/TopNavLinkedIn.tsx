import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import browserIcon from "../assets/icons/browser.svg";
import codeIcon from "../assets/icons/code.svg";
import { useIsCoachMode } from "../hooks/useIsCoachMode";
import { useNavTheme } from "./NavThemeContext";
import { useTopNavStyle } from "../contexts/TopNavStyleContext";
import { ExploreSearchModal } from "./ExploreSearchModal";
import { useExpertMode } from "../contexts/ExpertModeContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
// Primary nav icons — always the filled variant; inactive states just fade to
// 40% opacity (see IconNavLink).
import homeIcon from "../assets/icons/nav-icons/home-alt.svg";
import exploreIcon from "../assets/icons/nav-icons/search-active.svg";
import notificationsIcon from "../assets/icons/nav-icons/notifications-active.svg";
import notificationsInactiveIcon from "../assets/icons/nav-icons/notifications-inactive.svg";
import chatIcon from "../assets/icons/nav-icons/chat-active.svg";
import searchIcon from "../assets/icons/search.svg";
import searchInactiveIcon from "../assets/icons/nav-icons/search-inactive.svg";
import myLelandIcon from "../assets/icons/nav-icons/browse-active.svg";
// Discover dropdown + profile menu icons.
import jobsIcon from "../assets/icons/jobs.svg";
import livestreamIcon from "../assets/icons/video-filled-dark.svg";
import contentBookIcon from "../assets/icons/content-book-filled.svg";
// Outlined variants — used in the "More" dropdown list (the top nav uses the filled ones)
import livestreamsMenuIcon from "../assets/icons/lte-signal.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import giftIcon from "../assets/icons/gift.svg";
import settingsIcon from "../assets/icons/settings.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import menuBurgerIcon from "../assets/icons/menu-burger-2.svg";
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

/* ── v2 "Browse" dropdown — a browse hub. "Categories" reveals the category
   list above as a hover flyout; the rest are direct links. `path: null` marks
   the flyout row; "#" is a placeholder destination. Real paths run through
   navTo() so they stay inside /alt-nav. ── */
const browseMenuV2: { path: string | null; label: string }[] = [
  { path: null, label: "Categories" },
  { path: "#", label: "Free Livestreams" },
  { path: "/jobs", label: "Jobs" },
  { path: "#", label: "Programs" },
  { path: "#", label: "Content" },
];

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
// Tighter item (no fixed min-width, less horizontal padding) — keeps the v2/v3
// search + "Me" pair snug rather than evenly spaced like the icon row.
const compactItemBase =
  "group relative flex h-full shrink-0 flex-col items-center justify-center gap-1 px-3.5 pt-3 pb-2";
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
  hideLabel,
}: {
  to: string;
  end?: boolean;
  label: string;
  icon: string;
  badge?: number;
  dot?: boolean;
  // Force an icon-only item (snug, no text) regardless of the global label
  // toggle — used for Messages/Notifications on v4.
  hideLabel?: boolean;
}) {
  const { showNavLabels, variant } = useTopNavStyle();
  const showLabel = showNavLabels && !hideLabel;
  // v1 keeps a fixed min-width so the primary items sit evenly spaced; the
  // other variants let items size to their content.
  return (
    <NavLink
      to={to}
      end={end}
      className={hideLabel ? compactItemBase : `${itemBase}${variant === 1 ? " min-w-[64px]" : ""}`}
      aria-label={hideLabel ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <span className={iconWrap}>
            <img src={icon} alt="" className={iconCls(isActive)} />
            <NavBadge count={badge} dot={dot} />
          </span>
          {showLabel && <span className={labelCls(isActive)}>{label}</span>}
          {underline(isActive)}
        </>
      )}
    </NavLink>
  );
}

export default function TopNavLinkedIn() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  // v1 Explore opens a full universal-search modal instead of the dropdown.
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  // v2 Browse dropdown: whether the "Categories" hover flyout is showing.
  const [browseFlyoutOpen, setBrowseFlyoutOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isCoachMode = useIsCoachMode();
  const navTheme = useNavTheme();
  const { pathname } = useLocation();
  const { setStyle, variant, setVariant, showNavLabels, altIcons, setAltIcons, showSearch, setShowSearch, navEdgeToEdge, setNavEdgeToEdge, feedEdgeToEdge, setFeedEdgeToEdge } = useTopNavStyle();
  const { expert, setExpert } = useExpertMode();
  // Inside the isolated /alt-nav experience, the nav destinations stay within
  // it (e.g. /alt-nav/messages); elsewhere they point at the normal routes.
  const inLinkedInNav = pathname.startsWith("/alt-nav") || pathname.startsWith("/my-leland");
  const homeTo = inLinkedInNav ? "/alt-nav" : "/";
  const navTo = (path: string) => (inLinkedInNav ? `/alt-nav${path}` : path);
  // `layoutVariant` drives the dormant left/right/centered layout branches
  // below; it's pinned to 1 for now (typed loosely so those branches compile).
  //   v1 — search bar on the left, icons on the right (before Me)
  //   v2 — icons on the left, search bar on the right (before Me)
  //   v3 — icons centered on the page, search collapses to an icon before Me
  const layoutVariant = 1 as number;
  const iconsCentered = layoutVariant === 3;
  // Nav variants:
  //   v1 — Browse hub dropdown with Jobs folded in; My Leland + the Me dropdown
  //        sit in the icon group.
  //   v2 — flat category dropdown, standalone Jobs + Livestreams/Content, My
  //        Leland moved to the far right (no Me dropdown), and Messages/
  //        Notifications icon-only past the divider.
  //   v3 — builds on v2, but folds Notifications into a far-right hamburger
  //        menu (Notifications / Settings / Help / Log out) next to the profile
  //        photo; the notification badge rides on the hamburger icon.
  const isV3 = variant === 3;
  const isV4 = variant === 4;
  // The "v3 chrome" — labeled trailing items + a hamburger "More" menu — is
  // shared by v3 and v4. v4 then rearranges the layout (icon group moves next to
  // the logo, search bar centered, Notifications pulled back out of the More
  // menu to sit between Messages and Me).
  const isV3Like = variant === 3 || variant === 4;
  // v2-like chrome (flat Explore dropdown, standalone Jobs/Livestreams/Content
  // in the icon group, no "Me" profile inside the group) spans v2/v3/v4.
  const isV2Like = variant === 2 || variant === 3 || variant === 4;
  // "Alt icons" is a v1-only experiment; force it off on any other variant even
  // if the stored setting is on (its toggle only shows on v1).
  const altIconsOn = variant === 1 && altIcons;

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
  const discoverActive = discoverOpen || searchModalOpen || pathname === "/browse" || pathname.startsWith("/browse/");
  // "My Leland" always opens the store shell (/my-leland); the Expert
  // toggle only controls whether the sidebar's "Expert tools" group shows.
  const myLelandTo = "/my-leland";
  const myLelandActive = pathname.startsWith("/my-leland");

  const activeProfileMenuGroups = useMemo(() => {
    // Browse shortcuts injected directly under Profile — v1 has no standalone
    // Livestreams/Content nav items, so they live in the "More" menu (Jobs is now
    // a standalone v1 nav item). v3/v4 already surface these in the top nav, so
    // they're hidden from their menu.
    const browseItems: MenuItem[] = isV3Like
      ? []
      : [
          { to: navTo("/livestreams"), icon: livestreamsMenuIcon, label: "Free Livestreams", danger: false, isProfile: false },
          { to: navTo("/courses"), icon: myCoursesIcon, label: "Live Programs", danger: false, isProfile: false },
          { to: navTo("/content"), icon: bookOpenIcon, label: "Leland+", danger: false, isProfile: false },
        ];
    // v3 folds Notifications into this menu (with its badge), directly under
    // Profile. v1 shares the menu but keeps Notifications out; v4 pulls it back
    // out to a standalone top-nav item.
    const notificationsItem: MenuItem[] = isV3
      ? [{ to: navTo("/notifications"), icon: notificationsInactiveIcon, label: "Notifications", danger: false, badge: 3 }]
      : [];
    const [topGroup, bottomGroup] = profileMenuGroups;
    return [
      // Profile (+ Notifications on v3) then Refer a friend + Settings
      { items: [topGroup.items[0], ...notificationsItem, ...topGroup.items.slice(1)] },
      // Browse shortcuts join Help + Log out as one lower section
      { items: [...browseItems, ...bottomGroup.items] },
    ];
  }, [navTo, isV3, isV3Like]);

  const profileRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);

  // Collapse the v2 category flyout whenever the Browse dropdown closes.
  useEffect(() => {
    if (!discoverOpen) setBrowseFlyoutOpen(false);
  }, [discoverOpen]);

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

  // A right-pointing chevron used to mark rows that lead somewhere / expand.
  const chevronRight = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-light">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // A single dropdown row (used for the category list and the v2 Browse links).
  const menuRow = (to: string, label: string, showChevron: boolean) => (
    <NavLink
      key={label}
      to={to}
      onClick={() => setDiscoverOpen(false)}
      className="flex w-full items-center justify-between rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5"
    >
      {label}
      {showChevron && chevronRight}
    </NavLink>
  );

  // Shared across all three variants — positioned right (v1), left (v2), or
  // centered (v3) by the layout below.
  const iconGroup = (
    <>
      {/* For you */}
      <IconNavLink to={homeTo} end label="For you" icon={homeIcon} />

      {/* Discover — dropdown holding Browse experts + the rest */}
      <div ref={discoverRef} className="relative flex items-stretch">
        <button
          type="button"
          onClick={() => (isV2Like ? setDiscoverOpen((v) => !v) : setSearchModalOpen(true))}
          className={`${itemBase}${variant === 1 ? " min-w-[64px]" : ""}${showNavLabels ? "" : " !flex-row"}`}
          aria-expanded={isV2Like ? discoverOpen : searchModalOpen}
        >
          <span className={iconWrap}>
            <img src={exploreIcon} alt="" className={iconCls(discoverActive)} />
          </span>
          <span className={`flex items-center gap-0.5 ${labelCls(discoverActive)}`}>
            {showNavLabels && "Explore"}
            {!altIconsOn && !isV4 && caret(discoverOpen)}
          </span>
          {underline(discoverActive)}
        </button>

        <AnimatePresence>
          {isV2Like && discoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 top-full z-50 mt-1 w-64 rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
            >
              {!isV2Like
                ? browseMenuV2.map((item) =>
                    item.path === null ? (
                      // Categories — reveals the category list as a hover flyout.
                      // The flyout is a DOM child of this wrapper, so moving onto
                      // it doesn't fire the wrapper's mouseleave (stays open).
                      <div
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => setBrowseFlyoutOpen(true)}
                        onMouseLeave={() => setBrowseFlyoutOpen(false)}
                      >
                        <button
                          type="button"
                          className={`flex w-full items-center justify-between rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5 ${
                            browseFlyoutOpen ? "bg-[#222222]/5" : ""
                          }`}
                          aria-expanded={browseFlyoutOpen}
                        >
                          {item.label}
                          {chevronRight}
                        </button>
                        <AnimatePresence>
                          {browseFlyoutOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                              className="absolute left-full top-0 z-50 max-h-[70vh] w-64 overflow-y-auto rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
                            >
                              {browseCategories.map(({ to, label }) => menuRow(to, label, true))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      menuRow(item.path === "#" ? "#" : navTo(item.path), item.label, false)
                    )
                  )
                : browseCategories.map(({ to, label }) => menuRow(to, label, true))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* My Leland — on v2/v3 it moves out to the far right (a label-less
          profile photo after the divider), so it's dropped from the icon group */}
      {!isV2Like && (
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
      )}

      {/* Jobs — standalone item on v1, sitting between My Leland and Messages.
          (v2/v3/v4 render their own Jobs item further down in the icon group.) */}
      {!isV2Like && <IconNavLink to={navTo("/jobs")} label="Jobs" icon={jobsIcon} />}

      {/* Jobs — folded into the Browse dropdown on v1, so shown standalone only on v2/v3 */}
      {isV2Like && <IconNavLink to={navTo("/jobs")} label="Jobs" icon={jobsIcon} />}

      {/* Livestreams + Content — v2/v3 add these next to Jobs */}
      {isV2Like && <IconNavLink to={navTo("/livestreams")} label="Livestreams" icon={livestreamIcon} />}
      {isV2Like && <IconNavLink to={navTo("/content")} label="Content" icon={contentBookIcon} />}

      {/* Messages + Notifications — v2/v3 relocate these to the right of the
          divider (icon-only), so they're dropped from the icon group there */}
      {!isV2Like && <IconNavLink to={navTo("/messages")} label="Messages" icon={chatIcon} badge={1} />}
      {!isV2Like && <IconNavLink to={navTo("/notifications")} label="Notifications" icon={notificationsIcon} badge={3} />}
    </>
  );

  // Full search input — left cluster on v1, right cluster on v2.
  const searchBar = (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`${isV4 ? "hidden 2xl:flex" : "hidden md:flex"} h-11 ${isV4 ? "w-full" : "w-[300px]"} items-center gap-2.5 self-center rounded-full bg-[#222222]/[0.06] px-4 transition-colors focus-within:bg-[#222222]/[0.09]`}
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

  // The label-less My Leland profile photo pinned to the far right (after the
  // divider), standing in for the removed Me dropdown. v2 uses a larger photo;
  // v3 shrinks it to match the other nav icons (it sits beside the hamburger).
  const myLelandProfileItem = (
    <NavLink to={myLelandTo} className={isV3 ? itemBase : compactItemBase} aria-label={isV3Like ? "Me" : "My Leland"}>
      {({ isActive }) => (
        <>
          <span className={isV3Like ? iconWrap : "relative flex items-center justify-center"}>
            <img
              src={profilePhoto}
              alt=""
              className={`${isV3Like ? "h-6 w-6" : "h-8 w-8"} rounded-full object-cover ${isActive || myLelandActive ? "ring-2 ring-gray-dark" : ""}`}
            />
          </span>
          {/* v3 labels the trailing "Me"; v2/v4 keep the bare photo */}
          {isV3 && showNavLabels && <span className={labelCls(isActive || myLelandActive)}>Me</span>}
          {underline(isActive || myLelandActive)}
        </>
      )}
    </NavLink>
  );

  return (
    <header
      // data-nav-variant exposes the active v1–v4 variant — branch on
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
      <div className={`relative flex min-h-[60px] items-stretch justify-between gap-4 px-4 sm:px-6 ${navEdgeToEdge ? "w-full" : "mx-auto max-w-[1280px]"}`}>
        {/* Left: logo + (search bar on v1–v3 / icon group on v4) */}
        <div className={`flex gap-5 ${layoutVariant === 2 || isV4 ? "items-stretch" : "items-center py-2.5"}`}>
          <NavLink to={isCoachMode ? "/coach/inbox" : homeTo} className="flex shrink-0 items-center">
            <img src={lelandWordmark} alt="Leland" className="h-6 w-auto" />
          </NavLink>
          {/* v1 hides the search input unless the admin toggle turns it on; v2/v3 always show it */}
          {layoutVariant === 1 && !isV4 && (variant !== 1 || showSearch) && searchBar}
          {/* v4 moves the main icon group (For you … Content) next to the logo */}
          {isV4 && !isCoachMode && <div className="flex items-stretch">{iconGroup}</div>}
          {layoutVariant === 2 && !isCoachMode && <div className="flex items-stretch">{iconGroup}</div>}
        </div>

        {/* Center: main nav group — the dormant v3 centered layout.
            Absolute overlay so it's centered on the page independent of the
            search bar (left) and Messages/Notifications/profile (right). */}
        {iconsCentered && !isCoachMode && (
          <div className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-stretch">
            {iconGroup}
          </div>
        )}

        {/* Center: v4 centers the "Search Leland" field on the page (max 577px) */}
        {isV4 && !isCoachMode && (
          <div className="absolute left-1/2 top-0 flex h-full w-full max-w-[577px] -translate-x-1/2 items-center">
            {searchBar}
          </div>
        )}

        {/* Right: (icons on v1 / search bar on v2 / search icon on v3) + Me */}
        <div className="flex items-stretch">
          {layoutVariant === 1 && !isCoachMode && (
            <>
              {/* Main nav group + its divider sit on the right for v1–v3; v4
                  moves the group next to the logo, so both are dropped here. */}
              {!isV4 && (
                <>
                  <div className={`flex items-stretch${variant === 1 ? " gap-[2px]" : ""}`}>{iconGroup}</div>
                  {/* Divider before the trailing items — the Me dropdown (v1), or
                      the far-right My Leland profile (v2/v3). v2/v3 also group the
                      label-less Messages here (Notifications too on v2; v3 folds it
                      into the hamburger). */}
                  <span className="my-3 mx-1 w-px self-stretch bg-gray-stroke" />
                </>
              )}
              {isV2Like && (
                <>
                  {/* Messages — labeled on v3; icon-only on v2/v4 */}
                  <IconNavLink to={navTo("/messages")} label="Messages" icon={chatIcon} badge={1} hideLabel={!isV3} />
                  {/* Notifications — standalone on v2/v4 (icon-only); folded into the "More" menu on v3 */}
                  {!isV3 && <IconNavLink to={navTo("/notifications")} label="Notifications" icon={notificationsIcon} badge={3} hideLabel />}
                </>
              )}
              {isV2Like && myLelandProfileItem}
            </>
          )}
          {layoutVariant === 2 && <div className="flex items-stretch">{searchBar}</div>}
          {iconsCentered && !isCoachMode && (
            <NavLink to={navTo("/search")} aria-label="Search" className={compactItemBase}>
              {({ isActive }) => (
                <>
                  <span className={iconWrap}>
                    <img src={searchInactiveIcon} alt="" className={iconCls(isActive)} />
                  </span>
                  {underline(isActive)}
                </>
              )}
            </NavLink>
          )}

          {/* "Me" (v1) / "More" (v3/v4) dropdown. v2 has no dropdown trigger — its
              profile photo links straight to My Leland. v3/v4 use a hamburger
              trigger + notification badge but the same menu panel as v1. */}
          {variant !== 2 && (
          <div ref={profileRef} className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className={`${layoutVariant === 1 && !isV4 ? itemBase : compactItemBase}${variant === 1 ? " min-w-[64px]" : ""}${!showNavLabels || altIconsOn ? " !flex-row" : ""}`}
              aria-label={isV3Like ? "More" : altIconsOn ? "Me" : undefined}
              aria-expanded={profileOpen}
            >
              <span className={iconsCentered || layoutVariant === 2 || altIconsOn ? "relative flex items-center justify-center" : iconWrap}>
                {/* v3/v4 use the hamburger glyph + notification badge; v1 (both
                    default and alt-icons) uses the profile photo */}
                {isV3Like ? (
                  <>
                    <img src={menuBurgerIcon} alt="" className={iconCls(profileOpen)} />
                    {/* v3 keeps the notification badge on the hamburger; v4 pulled
                        Notifications out to a standalone item, so no badge here */}
                    {!isV4 && <NavBadge count={3} />}
                  </>
                ) : (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className={`rounded-full object-cover ${altIconsOn ? "h-[32px] w-[32px]" : iconsCentered || layoutVariant === 2 ? "h-[31px] w-[31px]" : "h-[24px] w-[24px]"} ${profileOpen ? "ring-2 ring-gray-dark" : ""}`}
                  />
                )}
              </span>
              {/* v1 default shows the "Me" label + chevron; alt-icons drops the
                  label but keeps the chevron; v3 labels "More" (no chevron); v4
                  hides the label entirely (icon-only) */}
              {layoutVariant === 1 && !isV4 && (
                <span className={`flex items-center gap-0.5 ${labelCls(profileOpen)}`}>
                  {showNavLabels && (isV3Like ? "More" : altIconsOn ? null : "Me")}
                  {!isV3Like && caret(profileOpen)}
                </span>
              )}
              {!isV3Like && underline(profileOpen)}
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
                            {/* Alt-nav design variant — v1 / v2 / v3 / v4 scratch toggle */}
                            <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                              <span className="text-[14px] font-medium text-gray-dark">Variant</span>
                              <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                                {([1, 2, 3, 4] as const).map((v) => (
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
                            {/* Alt icons — v1 only: profile-photo My Leland, "More" hamburger, no carets */}
                            {variant === 1 && (
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
                            )}
                            {/* Search bar — v1 only: show/hide the "Search Leland" input in the navbar */}
                            {variant === 1 && (
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
                            )}
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
          )}
        </div>
      </div>

      {/* v1 universal search modal — opened from Explore (portal to body) */}
      <ExploreSearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
}
