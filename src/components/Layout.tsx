import { Outlet, useLocation, useOutlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import MobileTopNav from "./MobileTopNav";
import MobileSidebar from "./MobileSidebar";
import PageShell from "./PageShell";
import {
  RightSidebarProvider,
  useRightSidebarContent,
} from "./RightSidebarContext";
import {
  LeftSidebarProvider,
  useLeftSidebarContent,
} from "./LeftSidebarContext";
import { ExtraLinksProvider } from "./ExtraLinksContext";
import { SubNavProvider, useSubNavContent } from "./SubNavContext";
import {
  LayoutVariantProvider,
  useLayoutVariant,
} from "./LayoutVariantContext";
import {
  ContentMaxWidthProvider,
  useContentMaxWidth,
} from "./ContentMaxWidthContext";
import { SubNavStyleProvider, useSubNavStyle } from "./SubNavStyleContext";
import { SessionLayoutProvider } from "./SessionLayoutContext";
import { NavThemeProvider, useNavTheme } from "./NavThemeContext";
import { MobileSidebarProvider, useMobileSidebar } from "./MobileSidebarContext";
import { useDarkMode } from "../contexts/DarkModeContext";

/**
 * Layout — nav chrome (TopNav, MobileTopNav, BottomNav) + context providers + <Outlet />
 */
export default function Layout() {
  return (
    <ExtraLinksProvider>
      <RightSidebarProvider>
        <LeftSidebarProvider>
          <SubNavProvider>
            <SubNavStyleProvider>
              <SessionLayoutProvider>
              <LayoutVariantProvider>
                <ContentMaxWidthProvider>
                  <NavThemeProvider>
                    <MobileSidebarProvider>
                      <LayoutChrome>
                        <AnimatedOutlet />
                      </LayoutChrome>
                    </MobileSidebarProvider>
                  </NavThemeProvider>
                </ContentMaxWidthProvider>
              </LayoutVariantProvider>
              </SessionLayoutProvider>
            </SubNavStyleProvider>
          </SubNavProvider>
        </LeftSidebarProvider>
      </RightSidebarProvider>
    </ExtraLinksProvider>
  );
}

// Routes that share the same hero and animate their content-below between each
// other (Dashboard ⇄ Calendar feel like two states of one page).
const ANIMATED_STATE_ROUTES = ["/dashboard", "/calendar", "/my-programs"];

/**
 * AnimatedOutlet — for the Dashboard/Calendar "states", wraps the routed page
 * in AnimatePresence so the outgoing page's content-below can animate out and
 * the incoming one's can animate in (their shared hero has no exit prop, so it
 * stays put). Every other route renders the outlet directly — unchanged
 * behavior, no forced remounts on param changes, no mode="wait" delay.
 */
function FrozenOutlet() {
  // Freeze at mount: an exiting instance must keep rendering its own page, not
  // the one we just navigated to.
  const [outlet] = useState(useOutlet());
  return <>{outlet}</>;
}

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  if (!ANIMATED_STATE_ROUTES.includes(location.pathname)) return outlet;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <FrozenOutlet key={location.pathname} />
    </AnimatePresence>
  );
}

const SIDEBAR_WIDTH = 280;

/**
 * LayoutChrome — renders the nav chrome around children.
 * Used by both Layout (with raw Outlet) and ContextLayout (with PageShell + Outlet).
 *
 * Mobile sidebar uses a "push" pattern: the sidebar sits behind the content
 * at a lower z-index, always mounted. When opened, the entire content block
 * (top nav + page + bottom nav) translates right to reveal it. An overlay
 * covers the content block so tapping anywhere closes the sidebar.
 */
function LayoutChrome({ children }: { children: React.ReactNode }) {
  const subNav = useSubNavContent();
  const { showSubNav } = useSubNavStyle();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useMobileSidebar();
  const navTheme = useNavTheme();
  const { dark: darkMode } = useDarkMode();
  // Post detail and the profile template are their own surfaces: they hide the
  // shared mobile top nav and render their own nav inside the sliding page, so
  // the mobile top padding (which normally clears the shared nav) is dropped.
  const location = useLocation();
  const pathname = location.pathname;
  const isPostDetail = pathname.startsWith("/post/");
  const isOwnSurface = isPostDetail || pathname.startsWith("/profile/");
  // Embed mode (?embed=1): strip the global nav chrome so the page renders as
  // bare content — used when a page is loaded inside another surface (e.g. the
  // course viewer's Community tab iframes this route).
  const isEmbed = new URLSearchParams(location.search).get("embed") === "1";

  // Keep height/overflow constrained while the close animation plays out,
  // so the content doesn't snap to full height mid-transition.
  const [constrainContent, setConstrainContent] = useState(false);
  const savedScrollY = useRef(0);
  useEffect(() => {
    if (sidebarOpen) {
      // Save scroll position, then reset to top so the scaled-down content
      // block shows from the top rather than at the scroll offset.
      savedScrollY.current = window.scrollY;
      window.scrollTo(0, 0);
      // Lock scroll fully on iOS Safari: position fixed + overflow hidden
      // on both html and body prevents all viewport scrolling.
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
      setConstrainContent(true);
    } else if (constrainContent) {
      // Keep constraints during closing animation, then restore scroll.
      const timer = setTimeout(() => {
        setConstrainContent(false);
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, savedScrollY.current);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  // Update iOS status bar / theme-color.
  // Safari is picky: we update the existing tag's content in-place, then
  // force a re-parse by briefly removing and re-appending it.
  useEffect(() => {
    const color = sidebarOpen
      ? "#f5f5f5"
      : navTheme.themeColor ?? (navTheme.bg === "white" || navTheme.bg === "transparent" ? "#ffffff" : navTheme.bg);

    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    // Update content, then remove + re-append to force Safari to re-read it
    meta.content = color;
    meta.remove();
    document.head.appendChild(meta);
  }, [sidebarOpen, navTheme.bg, navTheme.themeColor]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [subNav]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className={`relative min-h-full overflow-x-clip ${darkMode ? "bg-[#131313]" : "bg-white"}`}>
      {/* Sidebar — always mounted, sits behind the content block.
          Uses scale + fade for a subtle entrance/exit. */}
      <div className="fixed left-0 top-0 bottom-0 z-0 md:hidden">
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Sliding content block — translates right when sidebar opens.
          Important: no transform when closed so fixed children (nav bars)
          remain viewport-fixed. */}
      <div
        className={`relative z-10 min-h-full bg-white transition-all duration-[300ms] ease-in-out ${
          sidebarOpen ? "rounded-[12px] shadow-2xl" : ""
        }`}
        style={{
          ...(sidebarOpen ? { transform: `translateX(${SIDEBAR_WIDTH}px) scale(0.92)`, transformOrigin: "right center" } : undefined),
          ...(constrainContent ? { height: "100dvh", overflow: "hidden", overscrollBehavior: "none", touchAction: "none" } : {}),
        }}
      >
        {/* Overlay — covers entire content block (including nav bars) when
            sidebar is open. Clicking it closes the sidebar. */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[45] bg-black/20"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile top nav */}
        {!isEmbed && (
          <div className="md:hidden">
            <MobileTopNav />
          </div>
        )}

        {/* Desktop/Tablet top nav.
            sticky must live on the wrapper, not on <header> inside TopNav —
            the wrapper's parent (this Layout root) is what gives the sticky
            element room to scroll within. When sticky lived on <header>, its
            immediate parent (this same wrapper) was already collapsed to the
            header's height, so there was no scroll room and it never stuck. */}
        {!isEmbed && (
          <div className="sticky top-0 z-30 hidden md:block">
            <TopNav />
          </div>
        )}

        {/* Sub-nav */}
        {!isEmbed && subNav && showSubNav && (
          <div className="hidden bg-gray-hover md:block">
            <div className="relative mx-auto max-w-[1280px] px-6">
              {/* Left arrow */}
              {canScrollLeft && (
                <div className="pointer-events-none absolute inset-y-0 left-6 z-10 flex items-center">
                  <div className="pointer-events-auto flex items-center">
                    <button
                      onClick={() => scroll("left")}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-stroke bg-white shadow-sm hover:bg-gray-hover"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M8.5 3L5 7L8.5 11" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="w-8 h-10 -ml-0.5 bg-gradient-to-r from-[#f5f5f5] to-transparent" />
                  </div>
                </div>
              )}

              <div ref={scrollRef} className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
                {subNav}
              </div>

              {/* Right arrow */}
              {canScrollRight && (
                <div className="pointer-events-none absolute inset-y-0 right-6 z-10 flex items-center">
                  <div className="pointer-events-auto flex items-center">
                    <div className="w-8 h-10 -mr-0.5 bg-gradient-to-l from-[#f5f5f5] to-transparent" />
                    <button
                      onClick={() => scroll("right")}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-stroke bg-white shadow-sm hover:bg-gray-hover"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5.5 3L9 7L5.5 11" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main content area */}
        <main
          className={`relative z-0 md:pt-0 ${
            isEmbed
              ? "pt-0 pb-0"
              : `pb-20 md:pb-0 ${isOwnSurface ? "pt-0" : "pt-14"}`
          }`}
        >
          {children}
        </main>

        {/* Portal target for the "Saved" toast. Lives inside this z-10 content
            block so the toast's z-index competes with the bottom nav (z-30) in
            the same stacking context — letting it slide up from behind the nav
            instead of painting over it. */}
        <div id="saved-toast-root" />

        {/* Mobile bottom nav */}
        {!isEmbed && (
          <div className="md:hidden">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ContextLayout — reads sidebar/variant contexts, wraps <Outlet /> in <PageShell>.
 * Sits as a nested route element inside <Layout />.
 */
export function ContextLayout() {
  const rightSidebar = useRightSidebarContent();
  const leftSidebar = useLeftSidebarContent();
  const variant = useLayoutVariant();
  const contentMaxWidth = useContentMaxWidth();
  const { pathname } = useLocation();

  // Home feed uses a full-bleed 3-col layout: sidebars pinned to the window
  // edges (356px each), the feed capped at 640px in the middle.
  const isHomeFeed = pathname === "/";

  return (
    <PageShell
      variant={variant}
      leftSidebar={leftSidebar}
      rightSidebar={rightSidebar}
      contentMaxWidth={isHomeFeed ? 640 : contentMaxWidth}
      edgeToEdge={isHomeFeed}
      sidebarWidth={isHomeFeed ? 356 : undefined}
      // Start the row at the sidebar's sticky pin point (nav 61px + 20px gap) so
      // the columns don't slide up 20px before locking as you scroll.
      paddingYClassName={isHomeFeed ? "py-4 sm:pt-5 sm:pb-10" : undefined}
    >
      <Outlet />
    </PageShell>
  );
}
