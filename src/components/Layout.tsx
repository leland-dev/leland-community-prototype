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

export default function Layout() {
  return (
    <ExtraLinksProvider>
      <RightSidebarProvider>
        <LeftSidebarProvider>
          <LayoutInner />
        </LeftSidebarProvider>
      </RightSidebarProvider>
    </ExtraLinksProvider>
  );
}

function LayoutInner() {
  const rightSidebar = useRightSidebarContent();
  const leftSidebar = useLeftSidebarContent();
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

      {/* Main content area */}
      <main
        className={`relative z-0 pt-14 pb-20 md:pt-[60px] md:pb-0${
          hasRightSidebar ? " xl:mr-[300px]" : ""
        }`}
      >
        {hasLeftSidebar ? (
          /* Left-sidebar layout: flex row, sidebar sits 40px left of feed */
          <div className="mx-auto flex max-w-[1060px] items-start gap-10 px-4 py-6 lg:px-8">
            <aside className="hidden w-[286px] shrink-0 xl:block sticky top-[68px] self-start">
              {leftSidebar}
            </aside>
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
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
