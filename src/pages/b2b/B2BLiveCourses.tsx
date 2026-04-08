import { useState, useMemo } from "react";
import { StatCard, SearchToolbar, Card, Avatar, Pill, ActionMenu } from "./B2BShared";

const data = [
  { name: "Arjun Kapoor", email: "a-kapoor@kellogg.edu", initials: "AK", bg: "bg-dark-green", course: "IB Recruiting Bootcamp", enrolled: "Jan 8", status: "Attended" },
  { name: "Sofia Lin", email: "s-lin@kellogg.edu", initials: "SL", bg: "bg-[#6B7280]", course: "Consulting Accelerator", enrolled: "Jan 10", status: "Attended" },
  { name: "Marcus Park", email: "m-park@kellogg.edu", initials: "MP", bg: "bg-[#9333EA]", course: "IB Recruiting Bootcamp", enrolled: "Jan 8", status: "Not Attended" },
  { name: "Rachel Torres", email: "r-torres@kellogg.edu", initials: "RT", bg: "bg-[#DC2626]", course: "PE Foundations", enrolled: "Jan 14", status: "Not Started" },
  { name: "Daniel Wu", email: "d-wu@kellogg.edu", initials: "DW", bg: "bg-[#0891B2]", course: "Consulting Accelerator", enrolled: "Jan 10", status: "Completed" },
];

const statusPillMap: Record<string, string> = {
  Completed: "green",
  Attended: "blue",
  "Not Attended": "red",
  "Not Started": "gray",
};

const filters = [
  { key: "all", label: "All" },
  { key: "Attended", label: "Attended" },
  { key: "Not Attended", label: "Not Attended" },
  { key: "Not Started", label: "Not Started" },
  { key: "Completed", label: "Completed" },
];

export default function B2BLiveCourses() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.course.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, filter]);

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-medium text-gray-dark">Live Courses</h1>
          <p className="mt-[2px] text-[18px] text-[#707070]">Cohort-based live course enrollment and attendance tracking</p>
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
          label="Students Enrolled"
          value={<>67 <span className="text-[16px] font-bold text-gray-light">/ 75</span></>}
          sub="89% enrollment rate"
        />
        <StatCard
          label="Total Attendees"
          value={<>52 <span className="text-[16px] font-bold text-gray-light">/ 67</span></>}
          sub="78% attendance rate"
          subColor="text-primary"
        />
        <StatCard
          label="Not Yet Attended"
          value="8"
          valueColor="text-orange"
          sub="enrolled but no sessions"
        />
      </div>

      <Card>
        <SearchToolbar
          placeholder="Search users or courses..."
          onSearch={setSearch}
          filters={filters}
          activeFilter={filter}
          onFilter={setFilter}
        />
        <div className="overflow-x-auto">
          <table className="b2b-table w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["User", "Course", "Enrolled", "Status", ""].map((h) => (
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
                    <div className="flex items-center gap-2">
                      <Avatar initials={r.initials} bg={r.bg} color="text-white" size={28} />
                      <div>
                        <div className="text-[13px] font-medium">{r.name}</div>
                        <div className="text-[11px] text-gray-xlight">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px] text-[13px]">{r.course}</td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px] text-[12px] text-gray-xlight">{r.enrolled}</td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    <Pill variant={statusPillMap[r.status] || "gray"}>{r.status}</Pill>
                  </td>
                  <td className="border-b border-gray-hover px-[14px] py-[11px]">
                    <ActionMenu items={[{ label: "\u270f Edit" }, { label: "---" }, { label: "\u2715 Remove", danger: true }]} />
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
