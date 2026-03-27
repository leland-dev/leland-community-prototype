import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import settingsIcon from "../assets/icons/settings.svg";
import giftIcon from "../assets/icons/gift.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import paymentDetailsIcon from "../assets/icons/payment-details.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";

const tabs = [
  { key: "account", label: "Account", icon: settingsIcon },
  { key: "notifications", label: "Notifications", title: "Notification Settings", icon: notificationsInactive },
  { key: "payment", label: "Payment details", icon: paymentDetailsIcon },
  { key: "orders", label: "Order history", icon: orderHistoryIcon },
  { key: "refer", label: "Refer a friend", icon: giftIcon },
];

export default function AccountSettings() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  };

  return (
    <div className="min-h-full bg-white">
      <div className="sticky top-0 z-30 hidden md:block">
        <TopNav />
      </div>
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <div className="w-[220px] shrink-0 border-r border-gray-stroke p-2">
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-[18px] font-medium transition-colors ${
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
      </div>

      {/* Content area */}
      <div className="flex flex-1 justify-center px-10 pt-6">
        <div className="w-full max-w-[680px]">
          <h1 className="text-[40px] font-medium text-gray-dark">
            {(() => { const t = tabs.find((t) => t.key === activeTab); return t?.title ?? t?.label; })()}
          </h1>

          {/* Placeholder boxes */}
          <div className="mt-6 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[160px] rounded-xl bg-[#F5F5F5]"
                style={dashedBorderStyle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
