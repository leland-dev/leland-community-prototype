import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import MobileTopNav from "./MobileTopNav";
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
              <LayoutVariantProvider>
                <ContentMaxWidthProvider>
                  <LayoutChrome>
                    <Outlet />
                  </LayoutChrome>
                </ContentMaxWidthProvider>
              </LayoutVariantProvider>
            </SubNavStyleProvider>
          </SubNavProvider>
        </LeftSidebarProvider>
      </RightSidebarProvider>
    </ExtraLinksProvider>
  );
}

/**
 * LayoutChrome — renders the nav chrome around children.
 * Used by both Layout (with raw Outlet) and ContextLayout (with PageShell + Outlet).
 */
function LayoutChrome({ children }: { children: React.ReactNode }) {
  const subNav = useSubNavContent();
  const { showSubNav } = useSubNavStyle();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    <div className="min-h-full bg-white">
      {/* Mobile top nav */}
      <div className="md:hidden">
        <MobileTopNav />
      </div>

      {/* Desktop/Tablet top nav */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Sub-nav */}
      {subNav && showSubNav && (
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
      <main className="relative z-0 pt-14 pb-20 md:pt-0 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
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

  return (
    <PageShell
      variant={variant}
      leftSidebar={leftSidebar}
      rightSidebar={rightSidebar}
      contentMaxWidth={contentMaxWidth}
    >
      <Outlet />
    </PageShell>
  );
}
