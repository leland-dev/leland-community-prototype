import { useState, useMemo } from "react";
import { StatCard, ProgressBar, SearchToolbar, Card, Pill, ActionMenu } from "./B2BShared";
import type { ModalId } from "./B2BData";

const lpUsers = [
  { name: "Emma Davis", email: "e-davis@kellogg.edu", status: "Active", granted: "Jan 10", activated: "Jan 12", resources: 22, topCategory: "Finance & PE", topCategoryPill: "orange", lastActive: "Today" },
  { name: "Ryan Kim", email: "r-kim@kellogg.edu", status: "Active", granted: "Jan 20", activated: "Jan 21", resources: 8, topCategory: "Consulting", topCategoryPill: "blue", lastActive: "Mar 1" },
  { name: "Olivia Moore", email: "o-moore@kellogg.edu", status: "Active", granted: "Feb 15", activated: "Feb 15", resources: 22, topCategory: "Finance & PE", topCategoryPill: "orange", lastActive: "Mar 1" },
  { name: "Isabella Martinez", email: "i-martinez@kellogg.edu", status: "Not Activated", granted: "Feb 28", activated: "\u2014", resources: 0, topCategory: "\u2014", topCategoryPill: "", lastActive: "\u2014" },
];

const filters = [
  { key: "all", label: "All" },
  { key: "Active", label: "Activated" },
  { key: "Not Activated", label: "Not Activated" },
];

export default function B2BLelandPlus({ onOpenModal }: { onOpenModal: (m: ModalId) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return lpUsers.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, filter]);

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-medium text-gray-dark">Leland+</h1>
          <p className="mt-[2px] text-[18px] text-[#707070]">Subscription access to courses, guides, templates &amp; resources</p>
        </div>
        <button
          onClick={() => onOpenModal("grant")}
          className="inline-flex items-center gap-[6px] rounded-lg border border-primary bg-primary px-[14px] py-[7px] text-[13px] font-semibold text-white hover:bg-primary-hover"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Grant Leland+
        </button>
      </div>

      {/* Stats + Content Engagement side by side */}
      <div className="mb-5 grid items-start gap-4" style={{ gridTemplateColumns: "220px 1fr" }}>
        <div className="flex flex-col gap-3">
          <StatCard
            label="Seats Activated"
            value={<>42 <span className="text-[16px] font-bold text-gray-light">/ 50</span></>}
            sub="84% activation rate"
            subColor="text-primary"
          />
          <StatCard label="Avg Resources / User" value="12.4" sub="per month, last 30 days" />
          <StatCard label="Not Yet Activated" value="8" valueColor="text-orange" sub="seats granted but unused" />
        </div>

        <Card
          header={<h2 className="text-[14px] font-medium text-gray-dark">Content Engagement by Category</h2>}
          headerRight={<span className="text-[12px] text-gray-xlight">Last 30 days</span>}
        >
          <div className="p-5">
            {[
              { name: "Finance & PE", dotColor: "bg-orange", barColor: "bg-orange", pct: 68, views: "286 views" },
              { name: "Consulting", dotColor: "bg-blue", barColor: "bg-blue", pct: 54, views: "227 views" },
              { name: "Interview Guides", dotColor: "bg-primary", barColor: "bg-primary", pct: 81, views: "340 views" },
              { name: "Resume & Networking", dotColor: "bg-[#2d25a6]", barColor: "bg-[#2d25a6]", pct: 44, views: "185 views" },
              { name: "Courses", dotColor: "bg-[#EC4899]", barColor: "bg-[#EC4899]", pct: 31, views: "130 views" },
            ].map((cat, i, arr) => (
              <div
                key={cat.name}
                className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}
              >
                <div className="flex w-[180px] shrink-0 items-center gap-2 text-[13px] font-medium">
                  <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${cat.dotColor}`} />
                  {cat.name}
                </div>
                <ProgressBar percent={cat.pct} color={cat.barColor} />
                <span className="w-[70px] shrink-0 text-right text-[12px] text-gray-light">{cat.views}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Per-user table */}
      <Card
        header={<h2 className="text-[14px] font-medium text-gray-dark">Per-User Breakdown</h2>}
        headerRight={
          <button className="inline-flex items-center gap-[6px] rounded-lg border border-gray-stroke bg-white px-[10px] py-[5px] text-[12px] font-semibold text-gray-dark hover:bg-gray-hover">
            Export
          </button>
        }
      >
        <SearchToolbar
          placeholder="Search users..."
          onSearch={setSearch}
          filters={filters}
          activeFilter={filter}
          onFilter={setFilter}
        />
        <div className="overflow-x-auto">
          <table className="b2b-table w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["User", "Status", "Granted", "Activated", "Resources Accessed", "Top Category", "Last Active", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap border-b border-gray-stroke bg-white px-[14px] py-[10px] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-gray-xlight">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    <div className="font-medium text-gray-dark">{r.name}</div>
                    <div className="text-[12px] text-gray-light">{r.email}</div>
                  </td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    <Pill variant={r.status === "Active" ? "green" : "orange"}>{r.status}</Pill>
                  </td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">{r.granted}</td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">{r.activated}</td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    <span className="font-semibold">{r.resources}</span>
                    <span className="text-[12px] text-gray-xlight"> resources</span>
                  </td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    {r.topCategoryPill ? (
                      <Pill variant={r.topCategoryPill}>{r.topCategory}</Pill>
                    ) : (
                      <span className="text-[12px] text-gray-xlight">{r.topCategory}</span>
                    )}
                  </td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">{r.lastActive}</td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    <ActionMenu
                      items={
                        r.status === "Active"
                          ? [
                              { label: "\u2709 Email user" },
                              { label: "\uff0b Grant additional session" },
                              { label: "---" },
                              { label: "\u2715 Remove Leland+", danger: true },
                            ]
                          : [
                              { label: "\u2709 Email user" },
                              { label: "\u21ba Resend invite" },
                              { label: "---" },
                              { label: "\u2715 Remove Leland+", danger: true },
                            ]
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
