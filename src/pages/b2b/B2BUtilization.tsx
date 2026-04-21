import { useState, useMemo, Fragment } from "react";
import { utilData, users, admins, offeringLabels, sessionStatusPills } from "./B2BData";
import type { ModalId } from "./B2BData";
import { StatCard, Pill, ActionMenu, Card } from "./B2BShared";

const statusFilterMap: Record<string, string[]> = {
  completed: ["Completed session"],
  scheduled: ["Scheduled session"],
  matched: ["Matched with coach"],
  "not-started": ["Submitted form", "Created Leland account"],
};

const filterLabels: Record<string, string> = {
  all: "All users",
  completed: "Completed session",
  scheduled: "Scheduled session",
  matched: "Matched with coach",
  "not-started": "Not started",
};

const filters = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "scheduled", label: "Scheduled" },
  { key: "matched", label: "Matched" },
  { key: "not-started", label: "Not Started" },
];

interface Props {
  utilFilter: string;
  onSetUtilFilter: (f: string) => void;
  onOpenModal: (m: ModalId) => void;
  onSetEmailRecipients: (r: { name: string; email: string }[]) => void;
  onSetEmailFilterLabel: (label: string) => void;
}

export default function B2BUtilization({
  utilFilter,
  onSetUtilFilter,
  onOpenModal,
  onSetEmailRecipients,
  onSetEmailFilterLabel,
}: Props) {
  const [search, setSearch] = useState("");
  const [adminFilter, setAdminFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const allowed = statusFilterMap[utilFilter];
    return utilData.filter((u) => {
      if (allowed && !allowed.includes(u.sessionStatus)) return false;
      if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (adminFilter) {
        const userRecord = users.find((x) => x.id === u.id);
        if (!userRecord || userRecord.submittedBy !== adminFilter) return false;
      }
      return true;
    });
  }, [utilFilter, search, adminFilter]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEmailAll = () => {
    const recipients = filtered.map((u) => {
      const userRecord = users.find((x) => x.id === u.id);
      return { name: u.name, email: userRecord?.email || "\u2014" };
    });
    onSetEmailRecipients(recipients);
    onSetEmailFilterLabel(filterLabels[utilFilter] || "All users");
    onOpenModal("email");
  };

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-medium text-gray-dark">1:1 Sessions</h1>
          <p className="mt-2 text-[18px] text-[#707070]">Session-level tracking for all submitted users</p>
        </div>
        <button className="inline-flex items-center gap-[6px] rounded-lg border border-gray-stroke bg-white px-[14px] py-[7px] text-[13px] font-semibold text-gray-dark hover:bg-gray-hover">
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-4">
        <StatCard
          label="Sessions Completed"
          value={<>251 <span className="text-[16px] font-bold text-gray-light">/ 300</span></>}
          sub="84% utilization"
          subColor="text-primary"
        />
        <StatCard
          label="Matched with Coach"
          value="241"
          sub="of 289 with accounts (83%)"
        />
        <StatCard
          label="Pending Action"
          value="48"
          valueColor="text-orange"
          sub="users not yet completed"
        />
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex items-center gap-[10px] border-b border-gray-stroke px-4 py-[14px]">
          <div className="relative max-w-[300px] flex-1">
            <svg
              className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-gray-xlight"
              width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="w-full rounded-lg border border-gray-stroke bg-gray-hover py-[7px] pl-8 pr-[10px] text-[13px] text-gray-dark outline-none focus:border-primary focus:bg-white"
              placeholder="Search users..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-[6px]">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => onSetUtilFilter(f.key)}
                className={`rounded-full border px-3 py-[5px] text-[12px] font-medium transition-colors ${
                  utilFilter === f.key
                    ? "border-dark-green bg-dark-green text-white"
                    : "border-gray-stroke bg-white text-gray-light hover:bg-gray-hover"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            className="ml-auto h-8 w-auto rounded-lg border border-gray-stroke bg-white px-[10px] py-[5px] text-[12px] text-gray-dark outline-none focus:border-primary"
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
          >
            <option value="">All admins</option>
            {admins.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button
            onClick={handleEmailAll}
            className="inline-flex shrink-0 items-center gap-[5px] whitespace-nowrap rounded-lg border border-gray-stroke bg-white px-[10px] py-[5px] text-[12px] font-semibold text-gray-dark hover:bg-gray-hover"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="b2b-table w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["", "User", "Track", "Granted", "Coach", "Matched", "Session Status", "Rating", "Last Active", ""].map((h, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap border-b border-gray-stroke bg-white px-[14px] py-[10px] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-gray-xlight"
                    style={i === 0 ? { width: 20 } : undefined}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const d = offeringLabels[u.offering];
                const expanded = expandedRows.has(u.id);
                const pillVariant = sessionStatusPills[u.sessionStatus] || "gray";

                return (
                  <Fragment key={u.id}>
                    <tr
                      className="b2b-util-expand cursor-pointer"
                      onClick={() => toggleRow(u.id)}
                    >
                      <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">
                        {expanded ? "\u25bc" : "\u25b6"}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px] font-medium text-gray-dark">
                        {u.name}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px]">
                        {u.offering === "\u2014" ? (
                          <span className="text-[12px] text-gray-xlight">&mdash;</span>
                        ) : d ? (
                          <span className="flex items-center gap-[5px] text-[12px] font-medium">
                            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${d.dotClass}`} />
                            {d.track}
                          </span>
                        ) : (
                          <span className="text-[12px] text-gray-xlight">&mdash;</span>
                        )}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-light">
                        {u.granted}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-light">
                        {u.coach}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">
                        {u.matched}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px]">
                        <Pill variant={pillVariant}>{u.sessionStatus}</Pill>
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px]">
                        {u.rating ? (
                          <>
                            <span className="text-[12px] tracking-[1px] text-yellow">
                              {"\u2605".repeat(Math.round(u.rating))}
                            </span>{" "}
                            <span className="text-[12px] text-gray-xlight">{u.rating}</span>
                          </>
                        ) : (
                          <span className="text-[12px] text-gray-xlight">&mdash;</span>
                        )}
                      </td>
                      <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">
                        {u.lastActive}
                      </td>
                      <td
                        className="border-b border-gray-hover px-[14px] py-[11px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          items={[
                            { label: "\uff0b Grant additional session" },
                            { label: "\u2b50 Grant Leland+" },
                            { label: "\u2709 Email user" },
                            { label: "---" },
                            { label: "\u2715 Remove user", danger: true },
                          ]}
                        />
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-gray-hover">
                        <td colSpan={10} className="px-[14px] py-3 pl-[42px]">
                          <div className="flex max-w-[720px] gap-3">
                            <div className="flex-1 rounded-lg border border-gray-stroke bg-white p-[12px_14px] text-[12px] leading-[1.5] text-gray-light">
                              <strong className="text-gray-dark">Session Summary:</strong> {u.summary}
                            </div>
                            <div className="flex-1 rounded-lg border border-gray-stroke bg-white p-[12px_14px] text-[12px] leading-[1.5] text-gray-light">
                              <strong className="text-gray-dark">Review Rating:</strong>{" "}
                              {u.review || <span className="text-gray-xlight">No review submitted yet.</span>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
