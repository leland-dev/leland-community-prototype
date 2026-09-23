import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import MaskIcon from "../components/MaskIcon";
import { settingsTabs, SettingsSectionContent } from "../components/SettingsSections";

export default function AccountSettings() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Boxed card + masked icons, matching the My Leland sidebar styling. The outer
  // padding gives the card's shadow room inside PageShell's overflow-y-auto
  // aside (which would otherwise clip it on the sides / bottom).
  const settingsNav = (
    <div className="px-1.5 pb-3">
      <div className="rounded-[12px] border border-[#222222]/[0.12] bg-white p-2 shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
      <nav className="flex flex-col gap-1">
        {settingsTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-[10px] text-[15px] transition-colors ${
                isActive
                  ? "bg-[#222222]/5 font-semibold text-gray-dark"
                  : "font-medium text-gray-light hover:text-gray-dark"
              }`}
            >
              <MaskIcon src={tab.icon} className="h-[22px] w-[22px]" />
              {tab.label}
            </button>
          );
        })}
      </nav>
      </div>
    </div>
  );

  const active = settingsTabs.find((t) => t.key === activeTab);

  return (
    <PageShell leftSidebar={settingsNav}>
      <div>
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">
          {active?.title ?? active?.label}
        </h1>
        {active?.subtitle ? <p className="mt-2 text-[16px] text-gray-light">{active.subtitle}</p> : null}

        <SettingsSectionContent tabKey={activeTab} />
      </div>
    </PageShell>
  );
}
