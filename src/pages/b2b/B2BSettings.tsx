import { Avatar, Pill, Card } from "./B2BShared";
export default function B2BSettings() {
  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-medium text-gray-dark">Admin Settings</h1>
          <p className="mt-[2px] text-[18px] text-[#707070]">Manage permissions, licenses, and account configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-2 items-start gap-4">
        {/* Left column */}
        <div>
          <Card header={<h2 className="text-[14px] font-medium text-gray-dark">License Summary</h2>}>
            <div className="grid grid-cols-2 gap-3 p-5">
              <div className="rounded-lg bg-gray-hover p-[14px] text-center">
                <div className="text-[24px] font-bold text-dark-green">325</div>
                <div className="mt-[3px] text-[11px] uppercase tracking-[0.06em] text-gray-xlight">Total Licenses</div>
              </div>
              <div className="rounded-lg bg-gray-hover p-[14px] text-center">
                <div className="text-[24px] font-bold text-primary">74</div>
                <div className="mt-[3px] text-[11px] uppercase tracking-[0.06em] text-gray-xlight">Remaining</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <Card header={<h2 className="text-[14px] font-medium text-gray-dark">Admin Users</h2>}>
            <div>
              {[
                { initials: "KB", name: "Katie Brown", email: "katie.brown@kellogg.edu", role: "Owner", bg: "bg-dark-green", color: "text-white", pillVariant: "dark" },
                { initials: "MR", name: "Michael Reyes", email: "m-reyes@kellogg.edu", role: "Admin", bg: "bg-gray-xlight", color: "text-white", pillVariant: "green" },
                { initials: "JS", name: "Jennifer Sullivan", email: "j-sullivan@kellogg.edu", role: "View Only", bg: "bg-gray-xlight", color: "text-white", pillVariant: "gray" },
              ].map((admin, i, arr) => (
                <div
                  key={admin.initials}
                  className={`flex items-center justify-between px-5 py-3 ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}
                >
                  <div className="flex items-center gap-[10px]">
                    <Avatar initials={admin.initials} bg={admin.bg} color={admin.color} />
                    <div>
                      <div className="text-[13px] font-semibold">{admin.name}</div>
                      <div className="text-[12px] text-gray-xlight">{admin.email}</div>
                    </div>
                  </div>
                  <Pill variant={admin.pillVariant}>{admin.role}</Pill>
                </div>
              ))}
            </div>
          </Card>

          <Card header={<h2 className="text-[14px] font-medium text-gray-dark">Support</h2>}>
            <div className="p-5">
              <p className="text-[13px] text-gray-light">
                Need help with your account? Reach out to your Leland success team at{" "}
                <a href="mailto:success@joinleland.com" className="font-medium text-primary">
                  success@joinleland.com
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
