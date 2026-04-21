import { useState } from "react";
import { Avatar, Card } from "./B2BShared";
import { Tag } from "./B2BUserDrawerV2";
import layoutGridIcon from "../../assets/icons/layout-grid.svg";

const PAGE_SIZE = 25;

const ADMIN_USERS = [
  { initials: "KB", name: "Katie Brown", email: "katie.brown@kellogg.edu", role: "Owner", tagColor: "green" as const },
  { initials: "MR", name: "Michael Reyes", email: "m-reyes@kellogg.edu", role: "Admin", tagColor: "green" as const },
  { initials: "JS", name: "Jennifer Sullivan", email: "j-sullivan@kellogg.edu", role: "View Only", tagColor: "gray" as const },
];

export default function B2BSettings({ onNavigateDashboard }: { onNavigateDashboard?: () => void }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const filteredAdmins = ADMIN_USERS.filter((a) => {
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });
  const totalPages = Math.ceil(filteredAdmins.length / PAGE_SIZE);
  const pagedAdmins = filteredAdmins.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-medium text-gray-dark">Admin Settings</h1>
          <p className="mt-2 text-[18px] text-[#707070]">Manage permissions, licenses, and account configuration</p>
        </div>
        <button
          onClick={onNavigateDashboard}
          className="hidden shrink-0 items-center gap-2 rounded-lg bg-gray-hover px-4 py-2.5 text-[16px] font-medium text-gray-dark hover:bg-gray-stroke sm:flex"
        >
          <img src={layoutGridIcon} alt="" className="h-5 w-5" />
          Overview
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_280px] sm:gap-x-col-gap">
        <Card header={<h2 className="text-[16px] font-medium text-gray-dark">Admin Users</h2>} headerPadding="py-3" headerClassName="bg-[#fafafa]">
          {/* Search toolbar */}
          <div className="flex items-center gap-3 border-b border-gray-stroke px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 border-none bg-transparent text-[16px] leading-[1.2] text-gray-dark outline-none placeholder:text-gray-xlight"
                placeholder="Search by name or email"
              />
            </div>
            <button className="flex h-[44px] shrink-0 items-center gap-2 rounded-lg bg-gray-hover px-3 text-[16px] font-medium text-gray-dark hover:bg-gray-stroke sm:px-4">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add new</span>
            </button>
          </div>
          <div>
            {pagedAdmins.length > 0 ? pagedAdmins.map((admin, i, arr) => (
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
            )) : (
              <div className="px-4 py-8 text-center text-[16px] text-gray-light">No results found</div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-gray-stroke px-4 py-3">
            <span className="text-[14px] text-gray-light">
              {filteredAdmins.length === 0
                ? "0 users"
                : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filteredAdmins.length)} of ${filteredAdmins.length} users`}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </Card>

        <div>
          <p className="mb-2 text-[14px] font-medium uppercase tracking-[0.1em] text-gray-light">Support</p>
          <p className="text-[16px] text-gray-light">
            Need help with your account? Reach out to your Leland success team at{" "}
            <a href="mailto:success@joinleland.com" className="font-medium text-primary">
              success@joinleland.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
