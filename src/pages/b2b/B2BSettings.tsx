import { Avatar, Card } from "./B2BShared";
import { Tag } from "./B2BUserDrawerV2";
import layoutGridIcon from "../../assets/icons/layout-grid.svg";

export default function B2BSettings({ onNavigateDashboard }: { onNavigateDashboard?: () => void }) {
  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-medium text-gray-dark">Admin Settings</h1>
          <p className="mt-[2px] text-[18px] text-[#707070]">Manage permissions, licenses, and account configuration</p>
        </div>
        <button
          onClick={onNavigateDashboard}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-hover px-4 py-2.5 text-[16px] font-medium text-gray-dark hover:bg-gray-stroke"
        >
          <img src={layoutGridIcon} alt="" className="h-5 w-5" />
          Overview
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_280px]">
        <Card header={<h2 className="text-[16px] font-medium text-gray-dark">Admin Users</h2>} headerPadding="py-3">
          <div>
            {[
              { initials: "KB", name: "Katie Brown", email: "katie.brown@kellogg.edu", role: "Owner", tagColor: "green" as const },
              { initials: "MR", name: "Michael Reyes", email: "m-reyes@kellogg.edu", role: "Admin", tagColor: "green" as const },
              { initials: "JS", name: "Jennifer Sullivan", email: "j-sullivan@kellogg.edu", role: "View Only", tagColor: "gray" as const },
            ].map((admin, i, arr) => (
              <div
                key={admin.initials}
                className={`flex items-center justify-between px-4 py-[14px] ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}
              >
                <div className="flex items-center gap-[10px]">
                  <Avatar initials={admin.initials} size={36} />
                  <div className="leading-[1.2]">
                    <div className="text-[16px] font-medium text-gray-dark">{admin.name}</div>
                    <div className="text-[14px] text-gray-light">{admin.email}</div>
                  </div>
                </div>
                <Tag color={admin.tagColor}>{admin.role}</Tag>
              </div>
            ))}
          </div>
        </Card>

        <Card header={<h2 className="text-[16px] font-medium text-gray-dark">Support</h2>} headerPadding="py-3">
          <div className="p-5">
            <p className="text-[14px] text-gray-light">
              Need help with your account? Reach out to your Leland success team at{" "}
              <a href="mailto:success@joinleland.com" className="font-medium text-primary">
                success@joinleland.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
