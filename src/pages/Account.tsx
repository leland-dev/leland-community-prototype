import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTopNavStyle } from "../contexts/TopNavStyleContext";
import { useExpertMode } from "../contexts/ExpertModeContext";
import { settingsTabs, SettingsSectionContent } from "../components/SettingsSections";
import switchIcon from "../assets/icons/switch.svg";
import helpIcon from "../assets/icons/help.svg";
import logOutIcon from "../assets/icons/log out.svg";
import browserIcon from "../assets/icons/browser.svg";
import codeIcon from "../assets/icons/code.svg";

// The v3 nav drops the top-nav "Me" dropdown, so this page rehomes the account
// surface (mirroring /settings) plus the leftover system/admin links. The five
// settings tabs share their content with /settings via SettingsSections; the
// extra "Admin" tab holds everything else that used to live in the dropdown.
const tabs = [
  // The shared settings "Account" tab reads as "General" here, since the page
  // itself is already titled Account. "Refer a friend" is dropped — it's been
  // promoted to its own My Leland sidebar tab (still present on /settings).
  ...settingsTabs
    .filter((t) => t.key !== "refer")
    .map((t) => (t.key === "account" ? { ...t, label: "General" } : t)),
  { key: "admin", label: "Admin", icon: codeIcon },
];

const rowCls =
  "flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/5";

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
      {title && (
        <p className="bg-gray-hover px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">
          {title}
        </p>
      )}
      <div className="p-2">{children}</div>
    </div>
  );
}

function Toggle<T extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { v: T; l: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
        {options.map((o) => (
          <button
            key={o.l}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
              value === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// The catch-all "Admin" tab — account actions + prototype/admin controls that
// were in the old Me dropdown.
function AdminSection() {
  const {
    setStyle,
    modalities,
    setModalities,
    feedEdgeToEdge,
    setFeedEdgeToEdge,
  } = useTopNavStyle();
  const { expert, setExpert } = useExpertMode();

  return (
    <div className="mt-8 flex max-w-[520px] flex-col gap-4">
      {/* General account actions */}
      <Card>
        <Link to="/coach/inbox" className={rowCls}>
          <img src={switchIcon} alt="" className="h-6 w-6 shrink-0" />
          Switch to coaching
        </Link>
        <button type="button" className={rowCls}>
          <img src={helpIcon} alt="" className="h-6 w-6 shrink-0" />
          Help
        </button>
      </Card>

      {/* Admin controls */}
      <Card title="Admin Controls">
        <Toggle
          label="Expert"
          value={expert}
          options={[
            { v: true, l: "On" },
            { v: false, l: "Off" },
          ]}
          onChange={setExpert}
        />
        <Link to="/partner-dashboard" className={rowCls}>
          <img src={browserIcon} alt="" className="h-5 w-5 shrink-0" />
          Partner dashboard
        </Link>
        <Link to="/components" className={rowCls}>
          <img src={codeIcon} alt="" className="h-5 w-5 shrink-0" />
          Components
        </Link>

        {/* Navigation — the top-level nav experience + alt-nav design knobs */}
        <div className="mt-1 border-t border-gray-stroke pt-1">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-light">
            Navigation
          </p>
          <button type="button" onClick={() => setStyle("classic")} className={rowCls}>
            <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg>
            Switch to Classic nav
          </button>
          <Toggle
            label="Modalities"
            value={modalities}
            options={[
              { v: "off", l: "Off" },
              { v: "jobs", l: "Jobs" },
              { v: "existing", l: "Existing" },
            ]}
            onChange={setModalities}
          />
          <Toggle
            label="Feed"
            value={feedEdgeToEdge}
            options={[
              { v: false, l: "Center" },
              { v: true, l: "Edges" },
            ]}
            onChange={setFeedEdgeToEdge}
          />
        </div>

        {/* Prototype surfaces */}
        <div className="mt-1 border-t border-gray-stroke pt-1">
          <Link to="/onboarding-minimal-v2" className={rowCls}>
            <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
            Onboarding
          </Link>
          <Link to="/waitlist" className={rowCls}>
            <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg>
            Waitlist
          </Link>
          <Link to="/waitlist-onboarding" className={rowCls}>
            <svg className="h-5 w-5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
            Waitlist Onboarding
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function Account() {
  const [activeTab, setActiveTab] = useState("account");
  const active = tabs.find((t) => t.key === activeTab);

  return (
    <div className="pb-6">
      <h1 className="mb-6 font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Account</h1>

      {/* Horizontal tab nav — mirrors the /settings sidebar items, plus Admin */}
      <div className="-mx-4 overflow-x-auto border-b border-gray-stroke px-4 sm:mx-0 sm:px-0">
        <nav className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-[14px] transition-colors ${
                  isActive ? "font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
                }`}
              >
                <img src={tab.icon} alt="" className="h-5 w-5 shrink-0" />
                {tab.label}
                {isActive && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-gray-dark" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Per-tab section heading — skipped on Account, which the page header already names */}
        {activeTab !== "account" && (
          <h2 className="mt-8 text-[24px] font-semibold text-gray-dark">
            {active?.title ?? active?.label}
          </h2>
        )}
        {active?.subtitle ? <p className="mt-2 text-[16px] text-gray-light">{active.subtitle}</p> : null}

        {activeTab === "admin" ? (
          <AdminSection />
        ) : (
          <>
            <SettingsSectionContent tabKey={activeTab} hidePhoneToggles />
            {/* Log out pinned to the bottom of the General (account) tab */}
            {activeTab === "account" && (
              <div className="mt-6 border-t border-gray-stroke pt-6">
                <button
                  type="button"
                  className="flex items-center gap-2.5 text-[16px] font-semibold text-[#D92D20] transition-opacity hover:opacity-70"
                >
                  <img src={logOutIcon} alt="" className="h-5 w-5 shrink-0" />
                  Log out
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
