import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { settingsTabs, SettingsSectionContent } from "../components/SettingsSections";

export default function AccountSettings() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  const settingsNav = (
    <nav className="flex flex-col gap-1">
      {settingsTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium transition-colors ${
            activeTab === tab.key
              ? "bg-[#222222]/5 text-gray-dark"
              : "text-gray-dark hover:bg-gray-hover"
          }`}
        >
          <img src={tab.icon} alt="" className="h-6 w-6 shrink-0" />
          {tab.label}
        </button>
      ))}
    </nav>
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
