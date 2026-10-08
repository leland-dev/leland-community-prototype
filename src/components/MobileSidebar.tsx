import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useExpertMode } from "../contexts/ExpertModeContext";
import { useProfileBarMode, type ProfileBarMode } from "../contexts/ProfileBarModeContext";
import { Button } from "./Button";
import { TeamLogo } from "./TeamLogo";
import { useTeam } from "../contexts/TeamContext";
import { getTeamNavItems } from "../lib/teamNav";
import switchIcon from "../assets/icons/switch.svg";
import usersGroupIcon from "../assets/icons/users-group.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";

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
import toolsIcon from "../assets/icons/tools-wrench-ruler.svg";
import chartIcon from "../assets/icons/chart.svg";
import userIcon from "../assets/icons/user.svg";
import starIcon from "../assets/icons/star-icon.svg";
import chevronRight from "../assets/icons/chevron-right.svg";
import discountIcon from "../assets/icons/discount.svg";
import giftIcon from "../assets/icons/gift.svg";
import globeIcon from "../assets/icons/globe.svg";
import messagesIcon from "../assets/icons/chat-inactive-bold.svg";
import goalsIcon from "../assets/icons/star-review.svg";
import organizationsIcon from "../assets/icons/organizations.svg";
import lelandMark from "../assets/leland-mark.svg";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sectionHeaderBase =
  "px-5 pt-2 pb-1 text-[16px]";

const menuItemBase =
  "flex items-center gap-3 px-5 py-[10px] text-[16px] font-normal transition-colors";

// Profile preview — name, high-level headline, and the stat row that mirrors
// the home-feed left-sidebar profile card.
const PROFILE_NAME = "Alex Rivera";
const PROFILE_STATS = [
  { value: "4.9", label: "38 reviews", star: true },
  { value: "84", label: "Followers" },
  { value: "22.9k", label: "Likes" },
];

// My Leland tabs — mirrors the personal (non-expert) nav in the My Leland shell.
// Dashboard is omitted: the bottom navbar's "My Leland" tab already lands there.
// Profile is hidden on mobile; Messages takes its place. Browse is rendered
// separately above these (it opens the category sub-panel rather than linking).
const myLelandTabs = [
  { icon: messagesIcon, label: "Messages", to: "/messages" },
  { icon: calendarPageIcon, label: "Calendar", to: "/my-leland/calendar" },
  { icon: goalsIcon, label: "Goals", to: "/my-leland/goals" },
];

// Top-level category buckets shown in the Browse sub-panel (mirrors BrowseMenu).
const browseCategories = [
  "Popular",
  "General",
  "AI",
  "School Admissions",
  "Test Prep",
  "Business",
  "Finance & Accounting",
  "Product",
  "Technology",
  "Health & Medicine",
  "Law & Public Service",
  "Arts, Media, and Entertainment",
  "More",
];

// Show at most this many expert tools inline; the rest collapse behind a "More"
// accordion.
const MAX_EXPERT_ITEMS = 4;

// Expert tools — mirrors the "Expert tools" card in the My Leland sidebar.
const expertItems = [
  { icon: storeIcon, label: "Offerings", to: "/my-leland/pricing" },
  { icon: lightningIcon, label: "Opportunities", to: "/my-leland/opportunities" },
  { icon: lteSignalIcon, label: "Livestreams", to: "/my-leland/livestreams" },
  { icon: moneyIcon, label: "Earnings", to: "/my-leland/earnings" },
  { icon: chartIcon, label: "Analytics", to: "/my-leland/analytics" },
  { icon: starIcon, label: "Reviews", to: "/my-leland/reviews" },
  { icon: discountIcon, label: "Discount Codes", to: "/my-leland/discount-codes" },
];

const myLelandItems = [
  { icon: lteSignalIcon, label: "Free Livestreams", to: "/events" },
  { icon: myCoursesIcon, label: "Live Programs", to: "/courses" },
  { icon: bookOpenIcon, label: "Leland+", to: "/plus" },
];

// Logged-out marketing links — shown in place of the signed-in app nav.
// Targets are placeholders (no dedicated routes exist yet).
const loggedOutLinks = [
  { icon: starIcon, label: "Reviews", to: "#" },
  { icon: storeIcon, label: "Become an expert", to: "#" },
  { icon: organizationsIcon, label: "For organizations", to: "#" },
];

// Admin Tools segmented pill control — one row per demo toggle.
function AdminSegControl<T extends string | number>({ label, icon, darkMode, value, onChange, options }: {
  label: string;
  icon?: React.ReactNode;
  darkMode: boolean;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal">
      <span className={`${darkMode ? "text-white" : "text-[#4c4c4c]"} flex shrink-0 items-center gap-3 whitespace-nowrap`}>{icon}{label}</span>
      <div className={`flex shrink-0 overflow-hidden rounded-full p-[2px] ${darkMode ? "bg-white/15" : "bg-[#E5E5E5]"}`}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={String(o.value)}
              onClick={() => onChange(o.value)}
              className={`rounded-full px-1.5 py-[3px] text-[11px] font-medium transition-colors ${
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

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const navigate = useNavigate();
  const { dark: darkMode, toggle: toggleDarkMode } = useDarkMode();
  const { expert: expertMode, toggle: toggleExpertMode } = useExpertMode();
  const { mode: profileBarMode, setMode: setProfileBarMode } = useProfileBarMode();
  const { team } = useTeam();
  const { pathname } = useLocation();
  // On /team the sidebar swaps to the team menu (same slide-over, different contents).
  const inTeamMode = !!team && (pathname === "/team" || pathname.startsWith("/team/"));
  // Demo toggle (Admin Tools) — switches the sidebar between logged-in and
  // logged-out states. Intentionally not reset when the sidebar closes.
  const [loggedIn, setLoggedIn] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [expertMoreOpen, setExpertMoreOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
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
      setExpertMoreOpen(false);
      setBrowseOpen(false);
    }
  }, [open]);

  if (inTeamMode && team) {
    return (
      <div className="relative h-full w-[280px] overflow-hidden">
        <motion.div
          ref={scrollRef}
          className={`flex h-full w-full flex-col overflow-y-auto scrollbar-hide pb-6 ${darkMode ? "bg-[#131313]" : "bg-white"}`}
          animate={{ scale: open ? 1 : 0.95, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
          style={{ transformOrigin: "left center" }}
          aria-hidden={!open}
        >
          {/* Team header — same layout as the profile header: logo, name stacked below, then a label row */}
          <div className="px-5 pb-4 pt-6">
            <TeamLogo name={team.name} logo={team.logo} size={48} circle />
            <NavLink to="/team/overview" onClick={onClose} className="mt-3 block min-w-0">
              <p className={`text-[18px] font-semibold ${darkMode ? "text-white" : "text-gray-dark"}`}>{team.name}</p>
            </NavLink>
            <p className="mt-2.5 text-[14px] leading-none text-gray-light">
              <span className={`font-medium ${darkMode ? "text-white" : "text-gray-dark"}`}>
                {team.plan === "enterprise" ? "Enterprise" : "Team"}
              </span>{" "}
              · {team.viewerRole}
            </p>
          </div>

          <div className={`mx-5 border-t ${darkMode ? "border-white/20" : "border-[#E5E5E5]"}`} />

          <div className="pt-2">
            {getTeamNavItems(team).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `${menuItemClass} ${isActive ? (darkMode ? "bg-white/10 font-semibold" : "bg-gray-hover font-semibold") : ""}`}
              >
                <img src={item.icon} alt="" className={iconClass} aria-hidden />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className={`mx-5 mt-2 border-t pt-2 ${darkMode ? "border-white/20" : "border-[#E5E5E5]"}`}>
            <NavLink to="/my-leland" onClick={onClose} className={`${menuItemClass} -mx-5`}>
              <img src={switchIcon} alt="" className={iconClass} aria-hidden />
              <span>Switch to personal view</span>
            </NavLink>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-[280px] overflow-hidden">
    <motion.div
      ref={scrollRef}
      className={`flex h-full w-full flex-col overflow-y-auto scrollbar-hide ${loggedIn ? "pb-6" : ""} ${darkMode ? "bg-[#131313]" : "bg-white"}`}
      animate={{ scale: open ? 1 : 0.95, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
      style={{ transformOrigin: "left center" }}
      aria-hidden={!open}
    >
      {/* Profile header */}
      <div className="px-5 pt-6 pb-4">
        {loggedIn ? (
          <>
            {/* Photo */}
            <img
              src={profilePhoto}
              alt={PROFILE_NAME}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />

            {/* Name — stacked under the photo */}
            <NavLink
              to="/profile/june-allen?me=1"
              onClick={onClose}
              className="mt-3 block min-w-0"
            >
              <p className={`text-[18px] font-semibold ${darkMode ? "text-white" : "text-gray-dark"}`}>{PROFILE_NAME}</p>
            </NavLink>

            {/* Stat row — compact, inline metrics (value + label on one line) */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              {PROFILE_STATS.filter((s) => !s.star).map((s) => (
                <span key={s.label} className="text-[14px] leading-none text-gray-light">
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-dark"}`}>{s.value}</span>{" "}
                  {s.label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Leland mark — stands in for the profile photo when logged out */}
            <span
              aria-hidden
              className={`block h-9 w-9 ${darkMode ? "bg-white" : "bg-gray-dark"}`}
              style={{
                maskImage: `url("${lelandMark}")`,
                WebkitMaskImage: `url("${lelandMark}")`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "left center",
                WebkitMaskPosition: "left center",
              }}
            />
          </>
        )}
      </div>

      {/* Divider between profile and the links below — hidden when logged out */}
      {loggedIn && <div className={`mx-5 border-t ${darkMode ? "border-white/20" : "border-[#E5E5E5]"}`} />}

      {/* Primary nav */}
      <div className="pt-2">
        {/* Browse — opens the category sub-panel (logged-out only; logged-in
            shows it as "Categories" at the top of the More section) */}
        {!loggedIn && (
          <button
            onClick={() => setBrowseOpen(true)}
            className={`${menuItemClass} w-full`}
          >
            <img src={globeIcon} alt="" className={iconClass} aria-hidden />
            <span className="flex-1 text-left">Browse</span>
            <img src={chevronRight} alt="" className="h-5 w-5 shrink-0 opacity-50" aria-hidden />
          </button>
        )}
        {loggedIn ? (
          <>
            {/* Profile — the signed-in user's own profile (My profile on). */}
            <NavLink
              to="/profile/june-allen?me=1"
              onClick={onClose}
              className={menuItemClass}
            >
              <img src={userIcon} alt="" className={iconClass} aria-hidden />
              <span>Profile</span>
            </NavLink>
            {myLelandTabs.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={menuItemClass}
              >
                <img src={item.icon} alt="" className={iconClass} aria-hidden />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        ) : (
          loggedOutLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={menuItemClass}
            >
              <img src={item.icon} alt="" className={iconClass} aria-hidden />
              <span>{item.label}</span>
            </NavLink>
          ))
        )}
      </div>

      {/* Team — its own group below the personal tabs (not part of that list): it leaves
          for the team dashboard and its own menu. Sits above Sell on Leland / Expert tools. */}
      {loggedIn && (
        <div className="pt-4">
          <p className={sectionHeader}>Team</p>
          <NavLink to="/team" onClick={onClose} className={menuItemClass}>
            {team ? (
              <TeamLogo name={team.name} logo={team.logo} size={24} circle />
            ) : (
              <img src={usersGroupIcon} alt="" className={iconClass} aria-hidden />
            )}
            <span className="min-w-0 flex-1 truncate">{team ? team.name : "Add your team"}</span>
          </NavLink>
        </div>
      )}

      {/* Expert Tools — hidden entirely when logged out */}
      {loggedIn && (
      <div className="pt-4">
        <p className={sectionHeader}>{expertMode ? "Expert tools" : "Sell on Leland"}</p>
        {expertMode ? (
          <>
            {expertItems.slice(0, MAX_EXPERT_ITEMS).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={menuItemClass}
              >
                <img src={item.icon} alt="" className={iconClass} aria-hidden />
                <span>{item.label}</span>
              </NavLink>
            ))}
            {/* Overflow items reveal above the toggle, so the "More" / "See less"
                row stays pinned at the bottom of the expert tools list. */}
            {expertItems.length > MAX_EXPERT_ITEMS && (
              <>
                <AnimatePresence initial={false}>
                  {expertMoreOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {expertItems.slice(MAX_EXPERT_ITEMS).map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onClose}
                          className={menuItemClass}
                        >
                          <img src={item.icon} alt="" className={iconClass} aria-hidden />
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setExpertMoreOpen((v) => !v)}
                  className={`${menuItemClass} w-full`}
                >
                  <img src={dotsHorizontalIcon} alt="" className={`${iconClass} shrink-0`} aria-hidden />
                  <span className="flex-1 text-left">{expertMoreOpen ? "See less" : "More"}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-transform ${expertMoreOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    <polyline points="4 6 8 10 12 6" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <p className="px-5 pt-0 pb-[10px] text-[16px] font-normal text-gray-extra-light">
            You haven't set up your expert profile yet.{" "}
            <button onClick={onClose} className={`${textColor} underline decoration-dotted decoration-[1.5px] underline-offset-[3px]`}>
              Get started
            </button>
          </p>
        )}
      </div>
      )}

      {/* More */}
      <div className="pt-4">
        <p className={sectionHeader}>More</p>
        {/* Categories — opens the category sub-panel (logged-in only) */}
        {loggedIn && (
          <button
            onClick={() => setBrowseOpen(true)}
            className={`${menuItemClass} w-full`}
          >
            <img src={globeIcon} alt="" className={iconClass} aria-hidden />
            <span className="flex-1 text-left">All categories</span>
            <img src={chevronRight} alt="" className="h-5 w-5 shrink-0 opacity-50" aria-hidden />
          </button>
        )}
        {myLelandItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onClose}
            className={menuItemClass}
          >
            <img src={item.icon} alt="" className={iconClass} aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Account-specific items — hidden when logged out */}
        {loggedIn && (
        <>
        {/* Refer a friend — sits directly above Account */}
        <NavLink
          to="/my-leland/refer"
          onClick={onClose}
          className={menuItemClass}
        >
          <img src={giftIcon} alt="" className={iconClass} aria-hidden />
          <span>Refer a friend</span>
        </NavLink>

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
                </button>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}>
                  <span>Refer a Friend</span>
                </button>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}>
                  <span>Help</span>
                </button>
                <button onClick={onClose} className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal text-[#D92D20] transition-colors ${hoverBg}`}>
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
        )}
      </div>

      {/* Admin Tools — mt-auto pins it to the bottom of the sidebar when the
          list is short; when the list overflows the screen the auto margin
          collapses and it flows inline right after the More section. */}
      <div className="mt-auto pt-4">
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
                  onClick={() => setLoggedIn((v) => !v)}
                  className={`flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span className="flex items-center gap-3"><svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>Logged in</span>
                  {toggleSwitch(loggedIn)}
                </button>
                <button
                  onClick={toggleExpertMode}
                  className={`flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span className="flex items-center gap-3"><svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" /></svg>Expert</span>
                  {toggleSwitch(expertMode)}
                </button>
                {/* Rarely-touched demo switches live one level down */}
                <button
                  onClick={() => setFeaturesOpen((v) => !v)}
                  className={`flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span className="flex items-center gap-3"><svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>Features</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${featuresOpen ? "rotate-180" : ""}`} aria-hidden>
                    <polyline points="4 6 8 10 12 6" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {featuresOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-[10px]">
                        <button
                          onClick={toggleDarkMode}
                          className={`flex w-full items-center justify-between gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                        >
                          <span className="flex items-center gap-3"><svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>Dark Mode</span>
                          {toggleSwitch(darkMode)}
                        </button>
                        <AdminSegControl
                          label="Profile bar"
                          icon={<svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>}
                          darkMode={darkMode}
                          value={profileBarMode}
                          onChange={setProfileBarMode}
                          options={[
                            { value: 1 as ProfileBarMode, label: "Min" },
                            { value: 2 as ProfileBarMode, label: "Title" },
                            { value: 3 as ProfileBarMode, label: "Date" },
                          ]}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <NavLink
                  to="/onboarding-minimal-v2"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg><span>Onboarding</span>
                </NavLink>
                <NavLink
                  to="/onboarding-v4"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>Onboarding v4</span>
                </NavLink>
                <NavLink
                  to="/ai-onboarding"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <span>AI Builder onboarding</span>
                </NavLink>
                <NavLink
                  to="/waitlist"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg><span>Waitlist</span>
                </NavLink>
                <NavLink
                  to="/waitlist-onboarding"
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 py-[10px] text-[16px] font-normal ${textColor} transition-colors ${hoverBg}`}
                >
                  <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg><span>Waitlist Onboarding</span>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Auth footer — pinned to the bottom when logged out */}
      {!loggedIn && (
        <div className={`sticky bottom-0 flex flex-col gap-2 border-t px-5 pb-5 pt-4 ${darkMode ? "border-white/10 bg-[#131313]" : "border-[#E5E5E5] bg-white"}`}>
          <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" onClick={() => { onClose(); navigate("/onboarding-minimal-v2"); }}>
            Get started
          </Button>
          <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full" onClick={() => { onClose(); navigate("/onboarding-minimal-v2"); }}>
            Log in
          </Button>
        </div>
      )}

    </motion.div>

      {/* Browse sub-panel — slides in from the right over the sidebar. */}
      <AnimatePresence>
        {browseOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
            className={`absolute inset-0 z-10 flex h-full flex-col overflow-y-auto pb-6 scrollbar-hide ${darkMode ? "bg-[#131313]" : "bg-white"}`}
          >
            {/* Back button + divider */}
            <div className="px-5 pt-6 pb-2">
              <button
                onClick={() => setBrowseOpen(false)}
                className={`flex items-center gap-2 text-[16px] font-normal ${textColor}`}
              >
                <img src={chevronRight} alt="" className="h-5 w-5 rotate-180 opacity-70" aria-hidden />
                <span>Back</span>
              </button>
            </div>
            <div className={`mx-5 border-t ${darkMode ? "border-white/20" : "border-[#E5E5E5]"}`} />

            {/* Category list */}
            <div className="pt-2">
              {browseCategories.map((name) => (
                <NavLink
                  key={name}
                  to="/browse"
                  onClick={onClose}
                  className={`${menuItemClass} justify-between`}
                >
                  <span>{name}</span>
                  <img src={chevronRight} alt="" className="h-5 w-5 shrink-0 opacity-50" aria-hidden />
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
