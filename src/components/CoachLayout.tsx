import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import chatIcon from "../assets/icons/nav-icons/chat-inactive.svg";
import storeIcon from "../assets/icons/store.svg";
import lightningIcon from "../assets/icons/lightning.svg";
import calendarIcon from "../assets/icons/calendar-page.svg";
import moneyIcon from "../assets/icons/money.svg";
import starIcon from "../assets/icons/star-icon.svg";
import discountIcon from "../assets/icons/discount.svg";
import livestreamIcon from "../assets/icons/lte-signal.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import userIcon from "../assets/icons/user.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import pmIcon from "../assets/icons/category-icons/product-management.svg";

// Top-level items above the Storefront accordion. Profile lives here; Pricing
// and Content live inside the accordion.
const topItems = [
  { to: "/coach/inbox", label: "Inbox", icon: chatIcon },
  { to: "/coach/profile-new", label: "Profile", icon: userIcon },
];

// Top-level items below the Storefront accordion.
const bottomItems = [
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

// Fixed storefront settings shown at the top of the Storefront accordion —
// always present, not editable by the coach.
const storefrontChildren = [
  { to: "/coach/pricing", label: "Pricing" },
  { to: "/coach/content", label: "Content" },
];

// Per-category listings — the coach-editable portion of the accordion, shown
// below a divider separating them from the fixed settings above.
const categoryChildren = categories.map((c) => ({ to: c.to, label: c.label }));

// Routes that live inside the Storefront section (keeps the accordion marked
// active/expanded when any of them is open).
const storefrontRoutes = ["/coach/pricing", "/coach/content"];

// --- v2 nav data -----------------------------------------------------------
// v2 flattens Pricing and Content into top-level items and drops the Storefront
// accordion; categories move to their own section at the bottom.
const v2PrimaryItems = [
  { to: "/coach/inbox", label: "Inbox", icon: chatIcon },
  { to: "/coach/profile-new", label: "Profile", icon: userIcon },
  { to: "/coach/pricing", label: "Pricing", icon: moneyIcon },
  { to: "/coach/content", label: "Content", icon: bookOpenIcon },
  { to: "/coach/opportunities", label: "Opportunities", icon: lightningIcon },
  { to: "/coach/livestreams", label: "Livestreams", icon: livestreamIcon },
  { to: "/coach/calendar", label: "Calendar", icon: calendarIcon },
  { to: "/coach/earnings", label: "Earnings", icon: moneyIcon },
];

// Hidden behind the "More" toggle, below Earnings.
const v2MoreItems = [
  { to: "/coach/reviews", label: "Reviews", icon: starIcon },
  { to: "/coach/discount-codes", label: "Discount Codes", icon: discountIcon },
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

// ---------------------------------------------------------------------------
// Sidebar v1 — the current, shipping layout.
// ---------------------------------------------------------------------------
function SidebarV1() {
  const [listingsOpen, setListingsOpen] = useState(false);
  const { pathname } = useLocation();
  const onStorefront = pathname.startsWith("/coach/manage") || storefrontRoutes.includes(pathname);

  return (
    <nav className="flex flex-col gap-1">
      {/* Inbox, Profile */}
      {topItems.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={navLinkClass}>
          <NavIcon src={icon} className="h-[22px] w-[22px]" />
          {label}
        </NavLink>
      ))}

      {/* Storefront — accordion of fixed settings + per-category listings */}
      <div>
        <button
          onClick={() => setListingsOpen((o) => !o)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] transition-colors ${
            onStorefront ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
          }`}
        >
          <NavIcon src={storeIcon} className="h-[22px] w-[22px]" />
          <span className="flex-1 text-left">Offerings</span>
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
              <div className="relative mb-2 mt-1 flex flex-col gap-2 pl-[34px]">
                {/* Vertical guide line, aligned under the parent icon */}
                <span className="absolute bottom-0 left-[23px] top-0 w-[1.5px] bg-gray-stroke" />
                {/* Fixed settings — always present */}
                {storefrontChildren.map(({ to, label }) => (
                  <NavLink key={to} to={to} end className={childNavLinkClass}>
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
                {/* Divider between fixed settings and coach-editable categories */}
                <span className="mx-3 my-1 h-px bg-gray-stroke" />
                {/* Per-category listings — coach-editable */}
                {categoryChildren.map(({ to, label }) => (
                  <NavLink key={to} to={to} end className={childNavLinkClass}>
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
                <button className="group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1 text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-stroke shadow-[0_1px_1.5px_rgba(0,0,0,0.06)] transition-colors group-hover:border-gray-light">
                    <svg
                      className="h-3.5 w-3.5 text-gray-light"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ vectorEffect: "non-scaling-stroke" }}
                      aria-hidden
                    >
                      <path d="M12 6v12M6 12h12" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </span>
                  New category
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Remaining nav items */}
      {bottomItems.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={navLinkClass}>
          <NavIcon src={icon} className="h-[22px] w-[22px]" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Sidebar v2 — work-in-progress. Pricing/Content are top-level items, the top
// list truncates behind a "More" toggle after Earnings, and categories live in
// their own collapsible section at the bottom (labelled group, full nav rows —
// not the parent/child accordion paradigm).
// ---------------------------------------------------------------------------
function SidebarV2() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  return (
    <nav className="flex flex-col gap-1">
      {/* Primary items, Inbox through Earnings */}
      {v2PrimaryItems.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={navLinkClass}>
          <NavIcon src={icon} className="h-[22px] w-[22px]" />
          {label}
        </NavLink>
      ))}

      {/* More — expands to reveal the remaining top-level items */}
      <button
        onClick={() => setMoreOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark"
      >
        <svg
          className={`h-[22px] w-[22px] shrink-0 transition-transform ${moreOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {moreOpen ? "Less" : "More"}
      </button>
      <AnimatePresence initial={false}>
        {moreOpen && (
          <motion.div
            key="v2-more"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {v2MoreItems.map(({ to, label, icon }) => (
                <NavLink key={to} to={to} className={navLinkClass}>
                  <NavIcon src={icon} className="h-[22px] w-[22px]" />
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories — collapsible labelled section with full nav rows */}
      <div className="mt-3">
        <button
          onClick={() => setCategoriesOpen((o) => !o)}
          className="flex w-full items-center justify-between px-3 py-1.5 text-[14px] text-gray-extra-light transition-colors hover:text-gray-dark"
        >
          <span>Categories</span>
          <svg
            className={`h-4 w-4 shrink-0 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {categoriesOpen && (
            <motion.div
              key="v2-categories"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-1 flex flex-col gap-1">
                {categories.map(({ to, label, icon }) => (
                  <NavLink key={to} to={to} end className={navLinkClass}>
                    <NavIcon src={icon} className="h-[22px] w-[22px]" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark">
                  <NavIcon src={addPlusIcon} className="h-[22px] w-[22px]" />
                  Add category
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Admin version switcher — a 3-dot menu pinned to the sidebar's bottom-right
// that swaps between sidebar versions. Prototype-only tool; the choice is
// persisted to localStorage so it survives reloads.
// ---------------------------------------------------------------------------
const SIDEBAR_VERSIONS = [
  { id: "v1", label: "Sidebar v1" },
  { id: "v2", label: "Sidebar v2" },
] as const;

type SidebarVersion = (typeof SIDEBAR_VERSIONS)[number]["id"];
const SIDEBAR_VERSION_KEY = "coach-sidebar-version";

function AdminVersionMenu({
  version,
  onChange,
}: {
  version: SidebarVersion;
  onChange: (v: SidebarVersion) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0 border-t border-gray-stroke p-2">
      <div className="flex justify-end">
        <button
          type="button"
          aria-label="Switch sidebar version"
          onClick={() => setOpen((o) => !o)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            open ? "bg-[#222222]/5 text-gray-dark" : "text-gray-light hover:bg-[#222222]/5 hover:text-gray-dark"
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>

      {open && (
        <>
          {/* Click-away backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-2 z-20 mb-1 w-44 rounded-xl border border-gray-stroke bg-white p-1 shadow-lg">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-light">
              Sidebar version
            </p>
            {SIDEBAR_VERSIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                  version === id ? "font-semibold text-gray-dark" : "font-medium text-gray-light hover:bg-[#222222]/5 hover:text-gray-dark"
                }`}
              >
                {label}
                {version === id && (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CoachLayout() {
  const [version, setVersion] = useState<SidebarVersion>(() => {
    const stored = localStorage.getItem(SIDEBAR_VERSION_KEY);
    return stored === "v1" || stored === "v2" ? stored : "v1";
  });

  const changeVersion = (v: SidebarVersion) => {
    setVersion(v);
    localStorage.setItem(SIDEBAR_VERSION_KEY, v);
  };

  return (
    <div className="flex min-h-[calc(100vh-61px)]">
      {/* Sidebar — flush left, right border. Nav scrolls; admin menu pinned to the bottom. */}
      <aside className="hidden w-[220px] shrink-0 self-start sticky top-[61px] h-[calc(100vh-61px)] flex-col border-r border-gray-stroke md:flex">
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {version === "v1" ? <SidebarV1 /> : <SidebarV2 />}
        </div>
        <AdminVersionMenu version={version} onChange={changeVersion} />
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
