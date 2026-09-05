import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useExpertMode } from "../contexts/ExpertModeContext";
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
import layoutGridIcon from "../assets/icons/layout-grid.svg";
import chartIcon from "../assets/icons/chart.svg";
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

// The coach dashboard is reused in two places: the real /coach/* section and
// the LinkedIn-nav "My Store" (/my-leland/*). All nav data is authored
// against /coach; rebase() swaps that prefix for the current base so links and
// active-state checks stay within whichever shell is mounted.
function useCoachBase() {
  const { pathname } = useLocation();
  return pathname.startsWith("/my-leland") ? "/my-leland" : "/coach";
}
function rebase(to: string, base: string) {
  return base === "/coach" ? to : base + to.slice("/coach".length);
}

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
  const base = useCoachBase();
  const { expert, setExpert } = useExpertMode();
  const onStorefront = pathname.startsWith(rebase("/coach/manage", base)) || storefrontRoutes.some((r) => rebase(r, base) === pathname);

  const inStore = base !== "/coach";

  // A single top-level nav row from an item definition.
  const navRow = ({ to, label, icon }: { to: string; label: string; icon: string }) => (
    <NavLink key={to} to={rebase(to, base)} className={navLinkClass}>
      <NavIcon src={icon} className="h-[22px] w-[22px]" />
      {label}
    </NavLink>
  );
  const findItem = (to: string) => [...topItems, ...bottomItems].find((i) => i.to === to)!;

  // Storefront accordion — shared between both layouts (lives in "Expert tools").
  const offeringsAccordion = (
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
                <NavLink key={to} to={rebase(to, base)} end className={childNavLinkClass}>
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
              {/* Divider between fixed settings and coach-editable categories */}
              <span className="mx-3 my-1 h-px bg-gray-stroke" />
              {/* Per-category listings — coach-editable */}
              {categoryChildren.map(({ to, label }) => (
                <NavLink key={to} to={rebase(to, base)} end className={childNavLinkClass}>
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
  );

  // Store: two floating cards — a personal set on top, then an "Expert tools"
  // card (with its own header) below.
  if (inStore) {
    return (
      <>
        {/* Personal group */}
        <div className="shrink-0 rounded-[12px] border border-[#222222]/[0.12] bg-white p-2 shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
          <nav className="flex flex-col gap-1">
            <NavLink to={base} end className={navLinkClass}>
              <NavIcon src={layoutGridIcon} className="h-[22px] w-[22px]" />
              Dashboard
            </NavLink>
            {navRow(findItem("/coach/profile-new"))}
            {navRow(findItem("/coach/calendar"))}
            {navRow({ to: "/coach/my-content", label: "Content", icon: bookOpenIcon })}
            {/* Reviews lives here (as a customer) only until Expert tools are on */}
            {!expert && navRow(findItem("/coach/reviews"))}
          </nav>
        </div>

        {/* Expert tools — only for experts; a non-expert sees just the card above */}
        {expert && (
          <div className="shrink-0 overflow-hidden rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
            <p className="bg-gray-hover px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">
              Expert tools
            </p>
            <nav className="flex flex-col gap-1 p-2">
              {offeringsAccordion}
              {navRow(findItem("/coach/opportunities"))}
              {navRow(findItem("/coach/livestreams"))}
              {navRow(findItem("/coach/earnings"))}
              {navRow({ to: "/coach/analytics", label: "Analytics", icon: chartIcon })}
              {navRow(findItem("/coach/reviews"))}
              {navRow(findItem("/coach/discount-codes"))}
            </nav>
          </div>
        )}

        {/* Non-experts get a prompt to set up their expert tools instead */}
        {!expert && (
          <div
            className="shrink-0 rounded-[12px] bg-[#222222]/[0.04] p-5"
            style={{
              // Custom dashed outline: 3px dashes in gray-dark (#222222) at 30% opacity.
              // border-dashed can't control dash length, so draw it as an SVG background.
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e\")",
            }}
          >
            <h2 className="text-[15px] font-bold leading-tight text-gray-dark">Sell on Leland</h2>
            <p className="mt-2 text-[15px] leading-snug text-gray-light">
              You haven't set up your expert tools yet.
            </p>
            <button
              type="button"
              onClick={() => setExpert(true)}
              className="mt-6 text-[15px] font-semibold text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70"
            >
              Get started
            </button>
          </div>
        )}
      </>
    );
  }

  // /coach — original single flush list (no card treatment).
  return (
    <nav className="flex flex-col gap-1">
      {topItems.map(navRow)}
      {offeringsAccordion}
      {bottomItems.map(navRow)}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Admin Expert toggle — a shortcut/copy of the "Expert" tool in the top-nav
// dropdown, pinned to the sidebar's bottom so both states are quick to test.
// Prototype-only; reads/writes the shared ExpertMode context (localStorage).
// ---------------------------------------------------------------------------
function AdminExpertToggle() {
  const { expert, toggle } = useExpertMode();

  return (
    <div className="rounded-[12px] border border-[#222222]/[0.12] bg-white p-1">
      <button
        type="button"
        role="switch"
        aria-checked={expert}
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#222222]/5"
      >
        <span className="text-[14px] font-medium text-gray-dark">Expert</span>
        <span
          className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
            expert ? "bg-gray-dark" : "bg-[#222222]/20"
          }`}
        >
          <span
            className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
              expert ? "left-[19px]" : "left-[3px]"
            }`}
          />
        </span>
      </button>
    </div>
  );
}

// Mobile section nav — the sidebar is hidden on phones, so this sticky,
// horizontally-scrollable pill bar lets mobile users move between My Leland
// tabs (and the Expert tools). Mirrors the sidebar's items; desktop only ever
// sees the sidebar.
function MobileSectionNav() {
  const base = useCoachBase();
  const { expert } = useExpertMode();

  const items: { to: string; label: string; end?: boolean }[] = [
    { to: base, label: "Dashboard", end: true },
    { to: rebase("/coach/profile-new", base), label: "Profile" },
    { to: rebase("/coach/calendar", base), label: "Calendar" },
    { to: rebase("/coach/my-content", base), label: "Content" },
    ...(!expert ? [{ to: rebase("/coach/reviews", base), label: "Reviews" }] : []),
    ...(expert
      ? [
          { to: rebase("/coach/pricing", base), label: "Offerings" },
          { to: rebase("/coach/opportunities", base), label: "Opportunities" },
          { to: rebase("/coach/livestreams", base), label: "Livestreams" },
          { to: rebase("/coach/earnings", base), label: "Earnings" },
          { to: rebase("/coach/analytics", base), label: "Analytics" },
          { to: rebase("/coach/reviews", base), label: "Reviews" },
          { to: rebase("/coach/discount-codes", base), label: "Discount Codes" },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-14 z-20 border-b border-gray-stroke bg-white md:hidden">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-2.5">
        {items.map(({ to, label, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                isActive ? "bg-gray-dark text-white" : "bg-[#222222]/[0.06] text-gray-dark"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function CoachLayout() {
  const { pathname } = useLocation();
  // The My Leland dashboard (store root) and calendar get a subtle beige tint
  // (brand beige at 50% opacity) across the whole content region.
  const beigePage = pathname === "/my-leland" || pathname === "/my-leland/calendar";
  const inMyLeland = pathname.startsWith("/my-leland");

  return (
    <div className={`flex min-h-[calc(100vh-61px)] ${beigePage ? "bg-[#F3F1E6]/50" : ""}`}>
      {inMyLeland ? (
        /* My Leland — floating cards on the page background. The aside itself is the
           scroll container (matching PageShell), so a tall list scrolls internally
           while keeping its top margin. The Expert admin toggle sits at the bottom
           via mt-auto, and scrolls with the list once it overflows. */
        <aside className="hidden w-[264px] shrink-0 self-start sticky top-[61px] h-[calc(100vh-61px)] flex-col gap-4 overflow-y-auto px-4 pb-4 pt-5 md:flex">
          <SidebarV1 />
          {/* Pinned to the bottom while there's free space (mt-auto); once the cards
              overflow, the auto margin collapses to 0 and everything scrolls together. */}
          <div className="mt-auto shrink-0">
            <AdminExpertToggle />
          </div>
        </aside>
      ) : (
        /* /coach — original flush, bordered sidebar. */
        <aside className="hidden w-[220px] shrink-0 self-start sticky top-[61px] h-[calc(100vh-61px)] flex-col border-r border-gray-stroke md:flex">
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <SidebarV1 />
          </div>
        </aside>
      )}

      {/* Main content — fills remaining space, capped at 1280px. My Leland tabs
          share the Dashboard's fade-up entrance, re-triggered per tab. */}
      <div className="min-w-0 flex-1">
        {inMyLeland && <MobileSectionNav />}
        <div className="mx-auto max-w-[1080px] px-4 py-8 sm:px-6 sm:py-10">
          {inMyLeland ? (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}
