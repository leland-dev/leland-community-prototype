import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import MobileTopNav from "./MobileTopNav";
import RightSidebar from "./RightSidebar";
import {
  RightSidebarProvider,
  useRightSidebarContent,
} from "./RightSidebarContext";
import { ExtraLinksProvider } from "./ExtraLinksContext";

export default function Layout() {
  return (
    <ExtraLinksProvider>
      <RightSidebarProvider>
        <LayoutInner />
      </RightSidebarProvider>
    </ExtraLinksProvider>
  );
}

function LayoutInner() {
  const rightSidebar = useRightSidebarContent();
  const hasRightSidebar = rightSidebar != null;

  return (
    <div className="flex h-full bg-white">
      {/* Mobile top nav */}
      <div className="md:hidden">
        <MobileTopNav />
      </div>

      {/* Desktop/Tablet sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main
        className={`scrollbar-hide relative z-0 flex-1 overflow-y-auto pt-14 pb-20 md:ml-[72px] md:pt-0 md:pb-0 lg:ml-[240px]${
          hasRightSidebar ? " xl:mr-[300px]" : ""
        }`}
      >
        <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
          <Outlet />
        </div>
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
