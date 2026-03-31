import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import MobileTopNav from "./MobileTopNav";
import RightSidebar from "./RightSidebar";
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

export default function Layout() {
  return (
    <ExtraLinksProvider>
      <RightSidebarProvider>
        <LeftSidebarProvider>
          <SubNavProvider>
            <LayoutInner />
          </SubNavProvider>
        </LeftSidebarProvider>
      </RightSidebarProvider>
    </ExtraLinksProvider>
  );
}

function LayoutInner() {
  const rightSidebar = useRightSidebarContent();
  const leftSidebar = useLeftSidebarContent();
  const subNav = useSubNavContent();
  const hasRightSidebar = rightSidebar != null;
  const hasLeftSidebar = leftSidebar != null;

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
      {subNav && (
        <div className="hidden border-b border-gray-stroke bg-white md:block">
          <div className="mx-auto max-w-[1060px] px-6">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
              {subNav}
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <main
        className={`relative z-0 pt-14 pb-20 md:pt-0 md:pb-0${
          hasRightSidebar ? " xl:mr-[300px]" : ""
        }`}
      >
        {hasLeftSidebar ? (
          /* Left-sidebar layout: flex row, sidebar sits 40px left of feed */
          <div className="mx-auto flex max-w-[1060px] items-start gap-10 px-6 py-6">
            <aside className="hidden w-[300px] shrink-0 xl:block sticky top-5 self-start">
              {leftSidebar}
            </aside>
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[1060px] px-6 py-6">
            <Outlet />
          </div>
        )}
      </main>

      {/* Right sidebar (xl+ only, when a page opts in) */}
      <RightSidebar />

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
