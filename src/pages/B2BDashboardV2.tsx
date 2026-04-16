import { useEffect, useState } from "react";
import B2BTopNav from "../components/B2BTopNav";
import B2BMobileSidebar from "../components/B2BMobileSidebar";
import B2BSidebar from "./b2b/B2BSidebar";
import B2BOverviewV2 from "./b2b/B2BOverviewV2";
import B2BUtilization from "./b2b/B2BUtilization";
import B2BLiveCourses from "./b2b/B2BLiveCourses";
import B2BSelfStudy from "./b2b/B2BSelfStudy";
import B2BLelandPlus from "./b2b/B2BLelandPlus";
import B2BSettings from "./b2b/B2BSettings";
import { B2BModalDispatcher } from "./b2b/B2BModals";
import { navItems, type B2BView, type ModalId } from "./b2b/B2BData";
import settingsIcon from "../assets/icons/settings.svg";
import "../styles/b2b.css";

const v2HiddenKeys: B2BView[] = ["utilization", "live-courses", "self-study", "leland-plus", "users"];
const v2NavItems = [
  ...navItems.filter((item) => !v2HiddenKeys.includes(item.key)),
  { key: "settings" as B2BView, label: "Admin Settings", icon: settingsIcon },
];

export default function B2BDashboardV2() {
  const [activeView, setActiveView] = useState<B2BView>("overview");
  const [utilFilter, setUtilFilter] = useState("all");
  const [openModal, setOpenModal] = useState<ModalId>(null);
  const [emailRecipients, setEmailRecipients] = useState<{ name: string; email: string }[]>([]);
  const [emailFilterLabel, setEmailFilterLabel] = useState("All users");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [partnerModel, setPartnerModel] = useState<"per-seat" | "a-la-carte">("a-la-carte");
  const showVerizon = partnerModel === "per-seat";

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
          <B2BSidebar activeView={activeView} onNavigate={setActiveView} items={v2NavItems} showVerizon={showVerizon} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-7">
          <div className="mx-auto max-w-[1280px]">
          {activeView === "overview" && (
            <B2BOverviewV2
              onNavigate={setActiveView}
              onSetUtilFilter={setUtilFilter}
              onOpenModal={setOpenModal}
              partnerModel={partnerModel}
              onSetPartnerModel={setPartnerModel}
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
        items={v2NavItems}
        showVerizon={showVerizon}
      />
      <B2BModalDispatcher
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        emailRecipients={emailRecipients}
        emailFilterLabel={emailFilterLabel}
        showVerizon={showVerizon}
      />
    </div>
  );
}
