import { useState } from "react";
import { Button } from "../../components/Button";
import { Avatar, Card } from "./B2BShared";
import layoutGridIcon from "../../assets/icons/layout-grid.svg";
import { motion, AnimatePresence } from "motion/react";
import { AddAdminModal } from "./B2BModals";

const PAGE_SIZE = 25;

const ADMIN_USERS = [
  { initials: "KB", name: "Katie Brown", email: "katie.brown@kellogg.edu" },
  { initials: "MR", name: "Michael Reyes", email: "m-reyes@kellogg.edu" },
  { initials: "JS", name: "Jennifer Sullivan", email: "j-sullivan@kellogg.edu" },
];

export default function B2BSettings({ onNavigateDashboard }: { onNavigateDashboard?: () => void }) {
  const [admins, setAdmins] = useState(ADMIN_USERS);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ name: string; email: string } | null>(null);
  const [addAdminOpen, setAddAdminOpen] = useState(false);

  const filteredAdmins = admins.filter((a) => {
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
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[38px] font-medium text-gray-dark">Admin Settings</h1>
            <p className="mt-2 text-[16px] text-[#707070]">Manage permissions, licenses, and account configuration</p>
          </div>
          <div className="hidden sm:block">
            <Button size="lg" variant="secondary" onClick={onNavigateDashboard}>
              <img src={layoutGridIcon} alt="" className="h-5 w-5" />
              Overview
            </Button>
          </div>
        </div>
        <Button size="lg" variant="secondary" onClick={onNavigateDashboard} className="mt-6 w-full sm:hidden">
          <img src={layoutGridIcon} alt="" className="h-5 w-5" />
          Overview
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-[1fr_280px] sm:gap-x-col-gap">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[22px] font-medium leading-[1.2] text-gray-dark">Admins</h2>
            <Button size="md" variant="secondary" className="shrink-0" onClick={() => setAddAdminOpen(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add new
            </Button>
          </div>
          <div className="mb-3 flex flex-1 items-center gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 border-none bg-transparent text-[14px] leading-[1.2] text-gray-dark outline-none placeholder:text-gray-xlight"
              placeholder="Search by name or email"
            />
          </div>
          <Card>
            <div>
              {pagedAdmins.length > 0 ? pagedAdmins.map((admin, i, arr) => (
                <div
                  key={admin.initials}
                  className={`flex items-center justify-between px-4 py-[14px] ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-[10px]">
                    <Avatar initials={admin.initials} size={36} />
                    <div className="min-w-0 leading-[1.2]">
                      <div className="truncate text-[14px] font-medium text-gray-dark">{admin.name}</div>
                      <div className="truncate text-[12px] text-gray-light">{admin.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete({ name: admin.name, email: admin.email }); }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-xlight hover:bg-gray-hover hover:text-[#D92D20]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              )) : (
                <div className="px-4 py-8 text-center text-[14px] text-gray-light">No results found</div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-gray-stroke px-4 py-3">
              <span className="text-[12px] text-gray-light">
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
        </div>

        <div className="flex flex-col gap-8">
          <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-gray-light">Support</p>
          <p className="text-[14px] text-gray-light">
            Need help with your account? Reach out to your Leland success team at{" "}
            <a href="mailto:partnerships@joinleland.com" className="font-medium text-primary">
              partnerships@joinleland.com
            </a>
          </p>
          </div>
        </div>
      </div>
      <AddAdminModal
        open={addAdminOpen}
        onClose={() => setAddAdminOpen(false)}
        onAdd={(admin) => setAdmins((prev) => [...prev, admin])}
        existingEmails={admins.map((a) => a.email)}
      />
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:inset-auto sm:left-1/2 sm:w-[400px] sm:-translate-x-1/2 sm:-translate-y-1/2"
            >
              <h2 className="text-[18px] font-medium leading-[1.2] text-gray-dark">Remove admin?</h2>
              <p className="mt-2 text-[14px] leading-[1.5] text-gray-light">
                <span className="font-medium text-gray-dark">{confirmDelete.name}</span> will no longer have access to this dashboard.
              </p>
              <div className="mt-6 flex gap-3">
                <Button size="md" variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Cancel</Button>
                <button
                  onClick={() => { setAdmins((prev) => prev.filter((a) => a.email !== confirmDelete?.email)); setConfirmDelete(null); }}
                  className="flex-1 rounded-lg bg-[#D92D20] py-2.5 px-4 text-[14px] font-medium leading-[1.2] text-white hover:bg-[#b91c10] transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
