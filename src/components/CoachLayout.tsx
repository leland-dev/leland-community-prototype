import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import chatIcon from "../assets/icons/nav-icons/chat-inactive.svg";
import userIcon from "../assets/icons/user.svg";
import storeIcon from "../assets/icons/store.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import calendarIcon from "../assets/icons/calendar-page.svg";
import moneyIcon from "../assets/icons/money.svg";
import starIcon from "../assets/icons/star-icon.svg";
import discountIcon from "../assets/icons/discount.svg";
import livestreamIcon from "../assets/icons/lte-signal.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import pmIcon from "../assets/icons/category-icons/product-management.svg";

const sidebarItems = [
  { to: "/coach/inbox", label: "Inbox", icon: chatIcon },
  { to: "/coach/profile-new", label: "Profile", icon: userIcon },
  { to: "/coach/opportunities", label: "Opportunities", icon: lightningIcon },
  { to: "/coach/livestreams", label: "Livestreams", icon: livestreamIcon },
  { to: "/coach/calendar", label: "Calendar", icon: calendarIcon },
  { to: "/coach/earnings", label: "Earnings", icon: moneyIcon },
  { to: "/coach/reviews", label: "Reviews", icon: starIcon },
  { to: "/coach/discount-codes", label: "Discount Codes", icon: discountIcon },
];

const categories = [
  { to: "/coach/manage/mba", label: "MBA", icon: mbaIcon },
  { to: "/coach/manage/management-consulting", label: "Management Consulting", icon: consultingIcon },
  { to: "/coach/manage/product-management", label: "Product Management", icon: pmIcon },
];

// Icons are tinted via CSS mask + bg-current so they follow the link's text
// color (gray-extra-light when inactive, gray-dark when active/hovered) — the
// source SVGs have hardcoded colors, so a plain <img> can't inherit currentColor.
function NavIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        // Quote the URL — Vite inlines sub-4KB SVGs as data URIs whose payload
        // contains characters that break an unquoted CSS url(), which silently
        // fails the mask and renders a solid bg-current square.
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

// Inactive items read as gray-light (text + icon), darkening to gray-dark on
// hover with no background. Active fills the row, darkens to gray-dark, and
// bumps the weight to 600.
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] transition-colors ${
    isActive ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
  }`;

// Accordion children: shorter rows, weight stays constant, and the active state
// darkens the segment of the vertical guide line beside the item (via a before
// bar aligned to the guide's x position) instead of filling the row.
const childNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex w-full items-center gap-3 rounded-lg px-3 py-1 text-[15px] font-medium transition-colors ${
    isActive
      ? "text-gray-dark before:absolute before:-left-[11px] before:bottom-0 before:top-0 before:w-[2px] before:rounded-full before:bg-gray-dark before:content-['']"
      : "text-gray-light hover:text-gray-dark"
  }`;

export default function CoachLayout() {
  const [listingsOpen, setListingsOpen] = useState(true);
  const { pathname } = useLocation();
  const onCategory = pathname.startsWith("/coach/manage");

  return (
    <div className="flex min-h-[calc(100vh-61px)]">
      {/* Sidebar — flush left, 8px padding, right border */}
      <aside className="hidden w-[220px] shrink-0 self-start sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto border-r border-gray-stroke p-2 md:block">
        <nav className="flex flex-col gap-1">
          {/* Inbox + Profile */}
          {sidebarItems.slice(0, 2).map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <NavIcon src={icon} className="h-[22px] w-[22px]" />
              {label}
            </NavLink>
          ))}

          {/* My listings — accordion of category listings */}
          <div>
            <button
              onClick={() => setListingsOpen((o) => !o)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] transition-colors ${
                onCategory ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
              }`}
            >
              <NavIcon src={storeIcon} className="h-[22px] w-[22px]" />
              <span className="flex-1 text-left">My listings</span>
              <svg
                className={`h-4 w-4 shrink-0 transition-transform ${listingsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <AnimatePresence initial={false}>
              {listingsOpen && (
                <motion.div
                  key="listings-children"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="relative mt-1 flex flex-col gap-2 pl-[34px]">
                    {/* Vertical guide line, aligned under the parent icon */}
                    <span className="absolute bottom-0 left-[23px] top-0 w-[1.5px] bg-gray-stroke" />
                    {categories.map(({ to, label }) => (
                      <NavLink key={to} to={to} className={childNavLinkClass}>
                        <span className="truncate">{label}</span>
                      </NavLink>
                    ))}
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-1 text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark">
                      <NavIcon src={addPlusIcon} className="h-[22px] w-[22px]" />
                      Add category
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Remaining nav items */}
          {sidebarItems.slice(2).map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <NavIcon src={icon} className="h-[22px] w-[22px]" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content — fills remaining space, capped at 1280px */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
