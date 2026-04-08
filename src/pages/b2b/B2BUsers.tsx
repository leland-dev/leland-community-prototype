import { useState, useMemo } from "react";
import { users, userOfferings } from "./B2BData";
import type { ModalId } from "./B2BData";
import { SearchToolbar, ActionMenu, Card } from "./B2BShared";

const filters = [
  { key: "all", label: "All" },
  { key: "no-sessions", label: "No 1:1 Sessions" },
  { key: "no-live", label: "No Live Course" },
  { key: "no-self-study", label: "No Self-Study" },
  { key: "no-lp", label: "No Leland+" },
];

export default function B2BUsers({ onOpenModal }: { onOpenModal: (m: ModalId) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      const o = userOfferings.find((x) => x.id === u.id);
      if (!o) return true;
      if (filter === "no-sessions") return o.sessions === "0/2";
      if (filter === "no-live") return o.liveCourse === "\u2014";
      if (filter === "no-self-study") return o.selfStudy === "\u2014";
      if (filter === "no-lp") return !o.lelandPlus;
      return true;
    });
  }, [search, filter]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[40px] font-medium text-gray-dark">Users</h1>
        <p className="mt-[2px] text-[18px] text-[#707070]">18 members associated with this account</p>
      </div>

      <Card>
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
                {["Name", "Email", "1:1 Sessions", "Live Courses", "Self-Study Courses", "Leland+", "Added", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-gray-stroke bg-white px-[14px] py-[10px] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-gray-xlight"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const o = userOfferings.find((x) => x.id === u.id);
                const sess = o?.sessions || "\u2014";
                const sessColor =
                  sess === "2/2" ? "text-primary" : sess === "0/2" ? "text-gray-xlight" : "text-orange";

                const enrollPill = (val: string) =>
                  val === "\u2014" ? (
                    <span className="inline-flex rounded-full bg-gray-hover px-[10px] py-1 text-[11px] font-medium text-gray-light">
                      Not Enrolled
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-primary-xlight px-[10px] py-1 text-[11px] font-medium text-dark-green">
                      {val}
                    </span>
                  );

                const lpCell = o?.lelandPlus ? (
                  <span className="inline-flex rounded-full bg-primary-xlight px-[10px] py-1 text-[11px] font-medium text-dark-green">
                    Activated
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-gray-hover px-[10px] py-1 text-[11px] font-medium text-gray-light">
                    Not Activated
                  </span>
                );

                return (
                  <tr key={u.id}>
                    <td className="border-b border-gray-hover px-[14px] py-[11px] font-medium text-gray-dark">
                      {u.name}
                    </td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-light">
                      {u.email}
                    </td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px]">
                      <span className={`text-[13px] font-semibold ${sessColor}`}>{sess}</span>
                    </td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px]">
                      {enrollPill(o?.liveCourse || "\u2014")}
                    </td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px]">
                      {enrollPill(o?.selfStudy || "\u2014")}
                    </td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px]">{lpCell}</td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">
                      {u.added}
                    </td>
                    <td className="border-b border-gray-hover px-[14px] py-[11px]">
                      <ActionMenu
                        items={[
                          { label: "\u270f Change email" },
                          { label: "\uff0b Grant access", onClick: () => onOpenModal("grant-access") },
                          { label: "---" },
                          { label: "\u2715 Remove access", danger: true },
                          { label: "\u2715 Remove user", danger: true },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
