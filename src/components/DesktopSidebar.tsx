import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useExpertMode } from "../contexts/ExpertModeContext";
import { useProfileBarMode, type ProfileBarMode } from "../contexts/ProfileBarModeContext";
import { useFeedDemo, type LiveCardStyle, type EventStage } from "../contexts/FeedDemoContext";
import profilePhoto from "../assets/profile photos/profile photo.png";
import lelandWordmark from "../assets/leland-wordmark.svg";

// Navigation section — top-level customer links.
import homeIcon from "../assets/icons/nav-icons/home-inactive.svg";
import searchIcon from "../assets/icons/search.svg";
import chatNavIcon from "../assets/icons/nav-icons/chat-inactive.svg";
import notificationsNavIcon from "../assets/icons/nav-icons/notifications-inactive.svg";
import calendarPageIcon from "../assets/icons/calendar-page.svg";

// Menu icons (shared with MobileSidebar)
import lightningIcon from "../assets/icons/lightning.svg";
import storeIcon from "../assets/icons/store.svg";
import moneyIcon from "../assets/icons/money.svg";
import lteSignalIcon from "../assets/icons/lte-signal.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import globeIcon from "../assets/icons/globe.svg";
import starIcon from "../assets/icons/star-icon.svg";
import discountIcon from "../assets/icons/discount.svg";
import chartIcon from "../assets/icons/chart.svg";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";
import briefcaseIcon from "../assets/icons/briefcase.svg";
// Profile-menu icons — mirror the top-nav profile dropdown.
import giftIcon from "../assets/icons/gift.svg";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import settingsIcon from "../assets/icons/settings.svg";
import toolsIcon from "../assets/icons/tools-wrench-ruler.svg";

const sectionHeaderBase = "px-5 pt-2 pb-1 text-[13px] font-semibold";
// Every nav row — top section AND the sections below — shares this base so they
// read identically: an 8px-inset (mx-2) rounded pill with 12px inner padding.
const navRowBase = "flex items-center gap-3 rounded-lg mx-2 px-3 py-[10px] text-[15px] transition-colors";

// The Discover search bar is parked for now (may return later).
const SHOW_DISCOVER_SEARCH = false;

// Tint an svg to the current text color via CSS mask, so the nav icons stay in
// lockstep with their label color (rather than each svg's own baked-in color).
function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// Top navigation links. These stay inside the alt-nav experience (each
// destination is recreated under /alt-nav/*). `badge` shows a numbered bubble
// on the icon corner; `dot` overlays a small red unread dot.
type NavItem = { icon: string; label: string; to: string; badge?: number; dot?: boolean };
const navItems: NavItem[] = [
  { icon: homeIcon, label: "For you", to: "/alt-nav" },
  { icon: calendarPageIcon, label: "Calendar", to: "/alt-nav/calendar" },
  { icon: chatNavIcon, label: "Messages", to: "/alt-nav/messages", badge: 1 },
  { icon: notificationsNavIcon, label: "Notifications", to: "/alt-nav/notifications", dot: true },
];

// Expert tools — recreated inside alt-nav (mirrors the /coach sidebar, minus
// Messages, Profile, and Calendar — the latter already lives in the top nav).
// The first four show by default; the rest hide behind a "More" toggle.
const expertItems = [
  { icon: storeIcon, label: "Offerings", to: "/alt-nav/offerings" },
  { icon: lightningIcon, label: "Opportunities", to: "/alt-nav/opportunities" },
  { icon: lteSignalIcon, label: "Livestreams", to: "/alt-nav/livestreams" },
  { icon: moneyIcon, label: "Earnings", to: "/alt-nav/earnings" },
];

const expertMoreItems = [
  { icon: chartIcon, label: "Analytics", to: "/alt-nav/analytics" },
  { icon: starIcon, label: "Reviews", to: "/alt-nav/reviews" },
  { icon: discountIcon, label: "Discount Codes", to: "/alt-nav/discount-codes" },
];

const myLelandItems = [
  { icon: briefcaseIcon, label: "Jobs", to: "/alt-nav/jobs", external: false },
  { icon: globeIcon, label: "Browse experts", to: "/alt-nav/discover", external: false },
  { icon: lteSignalIcon, label: "Free Livestreams", to: "/alt-nav/events", external: true },
  { icon: myCoursesIcon, label: "Live Programs", to: "/alt-nav/courses", external: true },
  { icon: bookOpenIcon, label: "Leland+", to: "/alt-nav/plus", external: true },
];

// Admin Tools segmented pill control — one row per demo toggle.
function AdminSegControl<T extends string | number>({ label, darkMode, value, onChange, options }: {
  label: string;
  darkMode: boolean;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal">
      <span className={`${darkMode ? "text-white" : "text-[#4c4c4c]"} shrink-0 whitespace-nowrap`}>{label}</span>
      <div className={`flex shrink-0 overflow-hidden rounded-full p-[2px] ${darkMode ? "bg-white/15" : "bg-[#E5E5E5]"}`}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={String(o.value)}
              onClick={() => onChange(o.value)}
              className={`rounded-full px-2 py-[3px] text-[11px] font-medium transition-colors ${
                active
                  ? darkMode
                    ? "bg-white text-[#131313]"
                    : "bg-[#222222] text-white"
                  : darkMode
                    ? "text-white/70"
                    : "text-[#4c4c4c]"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// A persistent desktop sidebar that mirrors the mobile drawer's structure, with
// the customer top-navbar links added as a Navigation section up top. Rendered
// as the left column of the alt-navigation home feed.
export default function DesktopSidebar() {
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();
  const { expert: expertMode, toggle: toggleExpertMode } = useExpertMode();
  const { mode: profileBarMode, setMode: setProfileBarMode } = useProfileBarMode();
  const { liveCardStyle, setLiveCardStyle, eventStage, setEventStage, hasLivestreams, setHasLivestreams } = useFeedDemo();
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [expertMoreOpen, setExpertMoreOpen] = useState(false);
  const { pathname } = useLocation();

  const textColor = darkMode ? "text-white" : "text-[#4c4c4c]";
  const headerColor = darkMode ? "text-white/50" : "text-gray-extra-light";
  const hoverBg = darkMode ? "hover:bg-white/10" : "hover:bg-gray-hover";
  const sectionHeader = `${sectionHeaderBase} ${headerColor}`;
  // Shared inactive / active row appearance (matches the top-section nav).
  const navInactive = darkMode ? "font-medium text-white/60 hover:text-white" : "font-medium text-gray-light hover:text-gray-dark";
  const navActive = darkMode ? "bg-white/10 font-semibold text-white" : "bg-[#222222]/5 font-semibold text-gray-dark";
  // Non-link rows (accordion triggers) reuse the inactive look.
  const menuItemClass = `${navRowBase} ${navInactive}`;

  const toggleSwitch = (isOn: boolean) => (
    <span
      aria-hidden
      className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${
        isOn ? (darkMode ? "bg-[#ffffff]" : "bg-[#222222]") : (darkMode ? "bg-white/15" : "bg-[#E5E5E5]")
      }`}
    >
      <span
        className={`absolute h-[22px] w-[22px] rounded-full shadow-sm transition-transform ${darkMode ? "bg-[#131313]" : "bg-[#ffffff]"}`}
        style={{ transform: `translateX(${isOn ? 20 : 2}px)` }}
      />
    </span>
  );

  // Rows inside the bottom account dropdown (opened by the 3-dots next to the
  // profile). Mirrors the top-nav profile dropdown exactly: p-3 rows, 14px
  // medium, 24px icons, gray-dark (or red for destructive).
  const menuRow = (danger = false) =>
    `flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium transition-colors ${
      danger ? "text-[#D92D20]" : (darkMode ? "text-white" : "text-gray-dark")
    } ${darkMode ? "hover:bg-white/10" : "hover:bg-[#222222]/5"}`;
  // Text-only sub-rows (admin onboarding links), indented under the tools icon.
  const accountItemClass = `flex w-full items-center gap-3 rounded-lg py-2 pl-[46px] pr-3 text-[14px] font-medium ${textColor} transition-colors ${hoverBg}`;

  // Navigation items match the /coach sidebar exactly: inactive rows read as
  // gray-light (text + icon), darkening to gray-dark on hover; the active row
  // fills with a subtle wash, darkens, and bumps the weight.
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${navRowBase} ${isActive ? navActive : navInactive}`;

  return (
    <div className={`flex h-full w-full flex-col ${darkMode ? "bg-[#131313]" : "bg-white"}`}>
      {/* Scrollable region — everything above the pinned profile footer. Its
          own scrollbar is hidden; the profile stays put while this scrolls. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide pb-4">
      {/* Leland logo — replaces the top navbar on this layout */}
      <div className="px-3 pt-1 pb-3">
        <NavLink to="/alt-nav" className="flex items-center px-2 py-1">
          <img src={lelandWordmark} alt="Leland" className={`h-6 w-auto ${darkMode ? "brightness-0 invert" : ""}`} />
        </NavLink>
      </div>

      {/* Navigation — top-level links (styled to match the /coach sidebar) */}
      <div className="flex flex-col gap-1 pt-2">
        {navItems.map((item) => {
          // Active computed from the path so "For you" also stays lit on the
          // alt-nav post detail (/alt-nav/post/*), not just the exact feed.
          const active = item.to === "/alt-nav"
            ? pathname === "/alt-nav" || pathname.startsWith("/alt-nav/post")
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
          // The overlay ring matches the row background so the bubble/dot reads
          // as floating: white normally, the active wash when the row is active.
          const ring = darkMode
            ? (active ? "border-[#2b2b2b]" : "border-[#131313]")
            : (active ? "border-[#f4f4f4]" : "border-white");
          return (
            <NavLink key={item.label} to={item.to} end={item.to === "/alt-nav"} className={`${navRowBase} ${active ? navActive : navInactive}`}>
              <span className="relative inline-flex h-[22px] w-[22px] shrink-0">
                <MaskIcon src={item.icon} className="h-[22px] w-[22px]" />
                {item.badge ? (
                  <span className={`absolute -right-1.5 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border bg-[#FF003D] px-[3px] text-[10px] font-semibold leading-none text-white ${ring}`}>
                    {item.badge}
                  </span>
                ) : null}
                {item.dot ? (
                  <span className={`absolute right-0 top-0 h-[9px] w-[9px] rounded-full border bg-[#FF003D] ${ring}`} />
                ) : null}
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Discover (was "More") — now sits above Expert tools */}
      <div className="pt-4">
        <p className={sectionHeader}>Discover</p>
        {/* Search bar — hidden for now (may reuse later). Its edges line up
            with the row text (px-5 = the nav content inset). */}
        {SHOW_DISCOVER_SEARCH && (
          <div className="px-5 pb-2 pt-1">
            <div className="relative">
              <MaskIcon
                src={searchIcon}
                className="pointer-events-none absolute left-3.5 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-gray-light"
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full border border-gray-stroke bg-white py-2 pl-9 pr-3.5 text-[14px] text-gray-dark placeholder:text-gray-light focus:outline-none"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {myLelandItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={navLinkClass}>
              <MaskIcon src={item.icon} className="h-[22px] w-[22px]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Expert tools — hidden entirely when Expert mode is off */}
      {expertMode && (
        <div className="pt-4">
          <p className={sectionHeader}>Expert tools</p>
          <div className="flex flex-col gap-1">
            {expertItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                <MaskIcon src={item.icon} className="h-[22px] w-[22px]" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <AnimatePresence initial={false}>
              {expertMoreOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1 overflow-hidden"
                >
                  {expertMoreItems.map((item) => (
                    <NavLink key={item.to} to={item.to} className={navLinkClass}>
                      <MaskIcon src={item.icon} className="h-[22px] w-[22px]" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Styled like any other row; the chevron signals it expands */}
            <button onClick={() => setExpertMoreOpen((v) => !v)} className={menuItemClass}>
              <MaskIcon src={dotsHorizontalIcon} className="h-[22px] w-[22px]" />
              <span className="flex-1 text-left">{expertMoreOpen ? "Show less" : "More"}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${expertMoreOpen ? "rotate-180" : ""}`} aria-hidden>
                <polyline points="4 6 8 10 12 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      </div>{/* /scrollable region */}

      {/* Profile card — pinned at the bottom, floating in its own rounded card.
          The chevron opens an account menu (Settings / … / Log out) upward. */}
      <div className="shrink-0 pb-3">
        <div className={`relative rounded-2xl border px-3 py-3 ${darkMode ? "border-white/10 bg-[#1c1c1c]" : "border-[#E5E5E5] bg-white"}`}>
          <div className="flex items-center gap-3">
            <NavLink to="/profile-v2" className="flex min-w-0 flex-1 items-center gap-3">
              <img src={profilePhoto} alt="Jane Doe" className="h-10 w-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className={`truncate text-[15px] font-semibold ${darkMode ? "text-white" : "text-gray-dark"}`}>Jane Doe</p>
                <p className="text-[14px] text-gray-light">View profile</p>
              </div>
            </NavLink>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              aria-label="Account menu"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${textColor} ${hoverBg}`}
            >
              <MaskIcon src={dotsHorizontalIcon} className="h-5 w-5" />
            </button>
          </div>

          {/* Account menu — opens upward from the chevron */}
          <AnimatePresence>
            {accountOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute bottom-full right-0 z-50 mb-2 max-h-[70vh] w-full origin-bottom-right overflow-y-auto rounded-2xl border shadow-lg ${darkMode ? "border-white/10 bg-[#1c1c1c]" : "border-gray-stroke bg-white"}`}
                >
                  {/* Group 1 */}
                  <div className="px-2 py-2">
                    <NavLink to="/profile-v2" onClick={() => setAccountOpen(false)} className={menuRow()}>
                      <img src={profilePhoto} alt="Profile" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                      Profile
                    </NavLink>
                    <NavLink to="/my-programs" onClick={() => setAccountOpen(false)} className={menuRow()}>
                      <img src={myCoursesIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      My programs
                    </NavLink>
                    <button onClick={() => setAccountOpen(false)} className={menuRow()}>
                      <img src={giftIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      Refer a friend
                    </button>
                    <NavLink to="/settings" onClick={() => setAccountOpen(false)} className={menuRow()}>
                      <img src={settingsIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      Settings
                    </NavLink>
                  </div>

                  {/* Group 2 */}
                  <div className={`border-t px-2 py-2 ${darkMode ? "border-white/10" : "border-gray-stroke"}`}>
                    <NavLink to="/coach/inbox" onClick={() => setAccountOpen(false)} className={menuRow()}>
                      <img src={switchIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      Switch to coaching
                    </NavLink>
                    <button onClick={() => setAccountOpen(false)} className={menuRow()}>
                      <img src={helpIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      Help
                    </button>

                    {/* Admin Tools — folded into the profile menu; collapsed by
                        default so it stays subtle. */}
                    <button onClick={() => setAdminOpen((v) => !v)} className={menuRow()}>
                      <img src={toolsIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      <span className="flex-1 text-left">Admin Tools</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${adminOpen ? "rotate-180" : ""}`} aria-hidden>
                        <polyline points="4 6 8 10 12 6" />
                      </svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {adminOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <button onClick={toggleExpertMode} className={`flex w-full items-center justify-between gap-3 rounded-lg py-2 pl-[46px] pr-3 text-[14px] font-medium ${darkMode ? "text-white" : "text-gray-dark"} ${hoverBg} transition-colors`}>
                            <span>Expert</span>{toggleSwitch(expertMode)}
                          </button>
                          <button onClick={toggleDarkMode} className={`flex w-full items-center justify-between gap-3 rounded-lg py-2 pl-[46px] pr-3 text-[14px] font-medium ${darkMode ? "text-white" : "text-gray-dark"} ${hoverBg} transition-colors`}>
                            <span>Dark Mode</span>{toggleSwitch(darkMode)}
                          </button>
                          <button onClick={() => setHasLivestreams(!hasLivestreams)} className={`flex w-full items-center justify-between gap-3 rounded-lg py-2 pl-[46px] pr-3 text-[14px] font-medium ${darkMode ? "text-white" : "text-gray-dark"} ${hoverBg} transition-colors`}>
                            <span>Livestreams</span>{toggleSwitch(hasLivestreams)}
                          </button>
                          <div className="pl-[46px] pr-3">
                            <AdminSegControl label="Profile bar" darkMode={darkMode} value={profileBarMode} onChange={setProfileBarMode} options={[
                              { value: 1 as ProfileBarMode, label: "Min" },
                              { value: 2 as ProfileBarMode, label: "Title" },
                              { value: 3 as ProfileBarMode, label: "Date" },
                            ]} />
                            <AdminSegControl label="Live card" darkMode={darkMode} value={liveCardStyle} onChange={setLiveCardStyle} options={[
                              { value: "video" as LiveCardStyle, label: "Video" },
                              { value: "min" as LiveCardStyle, label: "Min" },
                            ]} />
                            <AdminSegControl label="Event stage" darkMode={darkMode} value={eventStage} onChange={setEventStage} options={[
                              { value: "upcoming" as EventStage, label: "Soon" },
                              { value: "live" as EventStage, label: "Live" },
                              { value: "wrapped" as EventStage, label: "Done" },
                            ]} />
                          </div>
                          <NavLink to="/onboarding" onClick={() => setAccountOpen(false)} className={accountItemClass}><span>Onboarding v1</span></NavLink>
                          <NavLink to="/onboarding-minimal" onClick={() => setAccountOpen(false)} className={accountItemClass}><span>Onboarding v2</span></NavLink>
                          <NavLink to="/onboarding-minimal-v2" onClick={() => setAccountOpen(false)} className={accountItemClass}><span>Onboarding v3</span></NavLink>
                          <NavLink to="/waitlist" onClick={() => setAccountOpen(false)} className={accountItemClass}><span>Waitlist</span></NavLink>
                          <NavLink to="/waitlist-onboarding" onClick={() => setAccountOpen(false)} className={accountItemClass}><span>Waitlist Onboarding</span></NavLink>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button onClick={() => setAccountOpen(false)} className={menuRow(true)}>
                      <img src={logOutIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
                      Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
