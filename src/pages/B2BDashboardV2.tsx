import { useEffect, useState } from "react";
import B2BTopNav from "../components/B2BTopNav";
import B2BOverviewV2 from "./b2b/B2BOverviewV2";
import B2BSettings from "./b2b/B2BSettings";
import { B2BModalDispatcher } from "./b2b/B2BModals";
import { type B2BView, type ModalId } from "./b2b/B2BData";
import "../styles/b2b.css";

export default function B2BDashboardV2() {
  const [activeView, setActiveView] = useState<B2BView>("overview");
  const [openModal, setOpenModal] = useState<ModalId>(null);
  const [emailRecipients, setEmailRecipients] = useState<{ name: string; email: string }[]>([]);
  const [emailFilterLabel, setEmailFilterLabel] = useState("All users");
  const [partnerModel, setPartnerModel] = useState<"per-seat" | "a-la-carte">("per-seat");
  const showVerizon = partnerModel === "per-seat";

  useEffect(() => {
    document.title = "B2B Dashboard – Leland";
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <B2BTopNav
        onNavigateSettings={() => setActiveView("settings")}
        onNavigateDashboard={() => setActiveView("overview")}
        isOnSettings={activeView === "settings"}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-10 sm:px-6">
          {activeView === "overview" && (
            <B2BOverviewV2
              onNavigate={setActiveView}
              onSetUtilFilter={() => {}}
              onOpenModal={setOpenModal}
              onNavigateSettings={() => setActiveView("settings")}
              partnerModel={partnerModel}
              onSetPartnerModel={setPartnerModel}
            />
          )}
          {activeView === "settings" && <B2BSettings onNavigateDashboard={() => setActiveView("overview")} />}
          <div className="h-[120px] shrink-0" />
        </div>
      </main>
      <B2BModalDispatcher
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        emailRecipients={emailRecipients}
        emailFilterLabel={emailFilterLabel}
        showVerizon={showVerizon}
        isAlaCarte={partnerModel === "a-la-carte"}
      />
    </div>
  );
}
