import { useEffect, useState } from "react";
import B2BTopNav from "../components/B2BTopNav";
import B2BMobileSidebar from "../components/B2BMobileSidebar";
import B2BSidebar from "./b2b/B2BSidebar";
import B2BOverview from "./b2b/B2BOverview";
import B2BUtilization from "./b2b/B2BUtilization";
import B2BLiveCourses from "./b2b/B2BLiveCourses";
import B2BSelfStudy from "./b2b/B2BSelfStudy";
import B2BLelandPlus from "./b2b/B2BLelandPlus";
import B2BUsers from "./b2b/B2BUsers";
import B2BSettings from "./b2b/B2BSettings";
import { B2BModalDispatcher } from "./b2b/B2BModals";
import type { B2BView, ModalId } from "./b2b/B2BData";
import "../styles/b2b.css";

export default function B2BDashboard() {
  const [activeView, setActiveView] = useState<B2BView>("overview");
  const [utilFilter, setUtilFilter] = useState("all");
  const [openModal, setOpenModal] = useState<ModalId>(null);
  const [emailRecipients, setEmailRecipients] = useState<{ name: string; email: string }[]>([]);
  const [emailFilterLabel, setEmailFilterLabel] = useState("All users");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "B2B Dashboard – Leland";
  }, []);

  const navigateSettings = () => setActiveView("settings");

  return (
    <div className="flex h-screen flex-col">
      <B2BTopNav
        onNavigateSettings={navigateSettings}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <B2BSidebar activeView={activeView} onNavigate={setActiveView} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-7">
          <div className="mx-auto max-w-[1280px]">
          {activeView === "overview" && (
            <B2BOverview
              onNavigate={setActiveView}
              onSetUtilFilter={setUtilFilter}
              onOpenModal={setOpenModal}
            />
          )}
          {activeView === "utilization" && (
            <B2BUtilization
              utilFilter={utilFilter}
              onSetUtilFilter={setUtilFilter}
              onOpenModal={setOpenModal}
              onSetEmailRecipients={setEmailRecipients}
              onSetEmailFilterLabel={setEmailFilterLabel}
            />
          )}
          {activeView === "live-courses" && <B2BLiveCourses />}
          {activeView === "self-study" && <B2BSelfStudy />}
          {activeView === "leland-plus" && <B2BLelandPlus onOpenModal={setOpenModal} />}
          {activeView === "users" && <B2BUsers onOpenModal={setOpenModal} />}
          {activeView === "settings" && <B2BSettings />}
          <div className="h-[120px] shrink-0" />
          </div>
        </main>
      </div>
      <B2BMobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeView={activeView}
        onNavigate={setActiveView}
        onNavigateSettings={navigateSettings}
      />
      <B2BModalDispatcher
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        emailRecipients={emailRecipients}
        emailFilterLabel={emailFilterLabel}
      />
    </div>
  );
}
