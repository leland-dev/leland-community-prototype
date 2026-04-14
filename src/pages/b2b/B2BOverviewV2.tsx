import { useState } from "react";
import type { B2BView, ModalId } from "./B2BData";
import B2BUserDrawer, { type UserDetail } from "./B2BUserDrawer";
import coachImg1 from "../../assets/profile photos/pic-1.png";
import coachImg2 from "../../assets/profile photos/pic-2.png";
import coachImg3 from "../../assets/profile photos/pic-3.png";

interface Props {
  onNavigate: (view: B2BView) => void;
  onSetUtilFilter: (filter: string) => void;
  onOpenModal: (m: ModalId) => void;
}

const activity = [
  { type: "session", coachImg: coachImg1, name: "Sarah Kim", action: "booked a coaching session with", target: "Jordan Lee", time: "2h ago", category: "Investment Banking" },
  { type: "review", coachImg: coachImg2, name: "Raj Patel", action: "left a 5-star review for", target: "Priya N.", time: "Yesterday", category: "Career Strategy" },
  { type: "enrollment", name: "Mia Chen", action: "enrolled in", target: "Spring '26 IB Cohort", time: "2d ago", category: "Live cohorts" },
  { type: "session", coachImg: coachImg3, name: "Evan Torres", action: "booked a session with", target: "Alex Morgan", time: "3d ago", category: "Private Equity" },
];

const users = [
  { initials: "SK", name: "Sarah Kim", email: "sarah.kim@kellogg.edu", sessions: 3, sessionsTotal: 5, cohorts: 1, cohortsTotal: 1, plus: "Active", lastActive: "2h ago" },
  { initials: "RP", name: "Raj Patel", email: "raj.patel@kellogg.edu", sessions: 1, sessionsTotal: 3, cohorts: null, cohortsTotal: null, plus: "Active", lastActive: "Yesterday" },
  { initials: "MC", name: "Mia Chen", email: "mia.chen@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: 1, cohortsTotal: 2, plus: "—", lastActive: "2d ago" },
  { initials: "ET", name: "Evan Torres", email: "evan.torres@kellogg.edu", sessions: 2, sessionsTotal: 4, cohorts: null, cohortsTotal: null, plus: "Active", lastActive: "3d ago" },
  { initials: "AL", name: "Aisha Lee", email: "aisha.lee@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: null, cohortsTotal: null, plus: "Invited", lastActive: "—" },
  { initials: "JL", name: "Jordan Lee", email: "jordan.lee@kellogg.edu", sessions: 2, sessionsTotal: 3, cohorts: 1, cohortsTotal: 1, plus: "Active", lastActive: "4d ago" },
  { initials: "PM", name: "Priya Mehta", email: "priya.mehta@kellogg.edu", sessions: 1, sessionsTotal: 2, cohorts: null, cohortsTotal: null, plus: "Active", lastActive: "5d ago" },
  { initials: "DW", name: "Daniel Wu", email: "daniel.wu@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: 1, cohortsTotal: 1, plus: "—", lastActive: "1w ago" },
  { initials: "NB", name: "Nina Brooks", email: "nina.brooks@kellogg.edu", sessions: 3, sessionsTotal: 4, cohorts: null, cohortsTotal: null, plus: "Active", lastActive: "1w ago" },
  { initials: "CR", name: "Carlos Rivera", email: "carlos.rivera@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: null, cohortsTotal: null, plus: "Expired", lastActive: "—" },
  { initials: "HS", name: "Hannah Seo", email: "hannah.seo@kellogg.edu", sessions: 1, sessionsTotal: 2, cohorts: 1, cohortsTotal: 1, plus: "Active", lastActive: "2w ago" },
  { initials: "TO", name: "Tunde Okafor", email: "tunde.okafor@kellogg.edu", sessions: 2, sessionsTotal: 3, cohorts: null, cohortsTotal: null, plus: "—", lastActive: "2w ago" },
];

const PAGE_SIZE = 5;

const userDetails: Record<string, UserDetail> = {
  "sarah.kim@kellogg.edu": {
    name: "Sarah Kim", email: "sarah.kim@kellogg.edu", initials: "SK",
    coaching: {
      granted: 5, used: 3,
      sessions: [
        { coach: "Jordan Lee", coachImg: coachImg1, date: "Mar 28, 2026", summary: "Focused on IB technical prep — LBO modeling and valuation frameworks. Sarah showed strong progress on DCF concepts. Jordan walked through a full paper LBO from scratch, identified gaps in returns analysis, and assigned two modeling tests to complete before the next session.", review: { rating: 5, text: "Jordan was incredibly well-prepared and gave me concrete feedback I could act on immediately. He clearly knows the recruiting process inside and out — every suggestion was specific, actionable, and calibrated to exactly where I am in the process. I left the session with a clear plan and a lot more confidence." } },
        { coach: "Jordan Lee", coachImg: coachImg1, date: "Feb 14, 2026", summary: "Behavioral interview prep and fit story development. Worked through the 'why banking' narrative in depth, refined Sarah's answer to 'walk me through your resume,' and practiced responding to curveball questions under time pressure." },
        { coach: "Jordan Lee", coachImg: coachImg1, date: "Jan 10, 2026", summary: "Initial session covering goals, timeline, and target firms. Built a study plan for the recruiting cycle." },
      ],
    },
    plus: {
      topCategories: ["Investment Banking", "Valuation", "Interview Guides"],
      recentItems: [
        { title: "LBO Modeling: Step-by-Step", category: "Investment Banking" },
        { title: "IB Interview Question Bank", category: "Interview Guides" },
        { title: "DCF Valuation Deep Dive", category: "Valuation" },
        { title: "Restructuring 101", category: "Investment Banking" },
        { title: "Walk Me Through a DCF", category: "Valuation" },
      ],
    },
    liveCourses: [
      { cohort: "Spring '26 IB Recruiting", startDate: "Jan 15, 2026", endDate: "Mar 20, 2026", status: "enrolled", review: { rating: 5, text: "Exactly what I needed — structured, fast-paced, and the instructors had real deal experience." } },
    ],
  },
  "raj.patel@kellogg.edu": {
    name: "Raj Patel", email: "raj.patel@kellogg.edu", initials: "RP",
    coaching: {
      granted: 3, used: 1,
      sessions: [
        { coach: "Priya N.", coachImg: coachImg2, date: "Mar 15, 2026", summary: "Career strategy session focused on transitioning from consulting to PE. Covered the timeline and how to position prior deal experience.", review: { rating: 5, text: "Priya gave me a completely different perspective on how to frame my background. Game-changer." } },
      ],
    },
    plus: {
      topCategories: ["Private Equity", "Career Strategy", "Consulting"],
      recentItems: [
        { title: "PE Associate Interview Guide", category: "Private Equity" },
        { title: "Consulting to PE Transition", category: "Career Strategy" },
        { title: "Operating Partner vs. Deal Team", category: "Private Equity" },
        { title: "Case Interview Frameworks", category: "Consulting" },
        { title: "Leveraged Buyout Overview", category: "Private Equity" },
      ],
    },
  },
  "mia.chen@kellogg.edu": {
    name: "Mia Chen", email: "mia.chen@kellogg.edu", initials: "MC",
    liveCourses: [
      { cohort: "Spring '26 IB Cohort", startDate: "Feb 3, 2026", endDate: "Apr 10, 2026", status: "enrolled" },
      { cohort: "AI for Finance", startDate: "Mar 1, 2026", endDate: "Mar 29, 2026", status: "enrolled", review: { rating: 4, text: "Great content, though I wished there was more time for hands-on exercises." } },
    ],
  },
  "evan.torres@kellogg.edu": {
    name: "Evan Torres", email: "evan.torres@kellogg.edu", initials: "ET",
    coaching: {
      granted: 4, used: 2,
      sessions: [
        { coach: "Alex Morgan", coachImg: coachImg3, date: "Mar 22, 2026", summary: "PE modeling practice — worked through a full LBO with a healthcare target. Identified gaps in returns analysis, specifically around entry multiple assumptions and the sensitivity table. Alex also introduced a framework for stress-testing deal structures under downside scenarios, which Evan found especially useful for on-cycle prep.", review: { rating: 4, text: "Very thorough session. Alex clearly knows the PE recruiting process inside out." } },
        { coach: "Alex Morgan", coachImg: coachImg3, date: "Feb 5, 2026", summary: "Introduction session. Mapped out Evan's background and identified target fund types and deal sizes." },
      ],
    },
    plus: {
      topCategories: ["Private Equity", "Valuation", "Investment Banking"],
      recentItems: [
        { title: "Healthcare LBO Case Study", category: "Private Equity" },
        { title: "Returns Analysis Deep Dive", category: "Valuation" },
        { title: "PE Fund Structures", category: "Private Equity" },
        { title: "IRR vs. MOIC", category: "Valuation" },
        { title: "Growth Equity vs. Buyout", category: "Private Equity" },
      ],
    },
  },
};

export default function B2BOverviewV2({ onNavigate, onOpenModal }: Props) {
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const visibleUsers = users.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="leading-[1.2]">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[40px] font-medium text-gray-dark">Overview</h1>
        <p className="mt-[2px] text-[18px] text-[#707070]">Kellogg School of Management &middot; Contract Jan 2025 &ndash; Jun 2026</p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Add users — mobile: full-width green button; sm+: stat-style card */}
        <button
          onClick={() => onOpenModal("invite")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[16px] font-semibold text-white hover:bg-primary-hover sm:flex-col sm:items-start sm:justify-start sm:border sm:border-gray-stroke sm:bg-white sm:p-5 sm:font-normal sm:text-left sm:hover:bg-gray-hover"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="shrink-0 sm:hidden">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span className="sm:hidden">Add users</span>
          <div className="hidden sm:mb-0 sm:flex sm:h-8 sm:w-8 sm:items-center sm:justify-center sm:rounded-full sm:bg-primary">
            <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <div className="text-[18px] font-medium text-gray-dark">Add users</div>
            <div className="mt-[6px] text-[14px] font-normal text-gray-light">Grant access</div>
          </div>
        </button>

        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Users granted</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="text-[32px] font-medium leading-none text-gray-dark">325</div>
            <div className="text-[14px] text-gray-light sm:mt-[6px]">3 added this week</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Users engaged</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="text-[32px] font-medium leading-none text-gray-dark">289</div>
            <div className="text-[14px] text-gray-light sm:mt-[6px]">89% of granted users</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Rating</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="flex items-baseline gap-[6px] text-[32px] font-medium leading-none text-gray-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginBottom: "-2px" }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              4.8<span className="text-[16px] font-normal text-gray-light"> / 5</span>
            </div>
            <div className="text-[14px] text-gray-light sm:mt-[6px]">across 112 reviews</div>
          </div>
        </div>
      </div>

      {/* Two-column: Offerings + Activity */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Offerings */}
        <div>
          <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Offerings</h2>
          <div className="rounded-lg border border-gray-stroke bg-white p-2 shadow-card">
            {/* 1:1 Coaching */}
            <div
              className="flex cursor-pointer items-center justify-between gap-2 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("utilization")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">1:1 Coaching</h3>
                <div className="truncate text-[14px] text-gray-dark">
                  38 sessions left &middot; <span className="text-gray-light">102 used</span>
                </div>
                <div className="truncate text-[14px] text-gray-xlight">Individual coach matching for personalized guidance</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal("invite"); }}
                className="shrink-0 p-1 text-gray-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Live cohorts */}
            <div
              className="flex cursor-pointer items-center justify-between gap-2 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("live-courses")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">Live cohorts</h3>
                <div className="truncate text-[14px]">
                  <span className="text-red">2 seats left</span> &middot; <span className="text-gray-light">64 used</span>
                </div>
                <div className="truncate text-[14px] text-gray-xlight">Cohort-based programs with live instruction and feedback</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal("invite"); }}
                className="shrink-0 p-1 text-gray-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Leland+ */}
            <div
              className="flex cursor-pointer items-center justify-between gap-2 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("leland-plus")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">Leland+</h3>
                <div className="truncate text-[14px] text-gray-dark">
                  24 seats left &middot; <span className="text-gray-light">6 used</span>
                </div>
                <div className="truncate text-[14px] text-gray-xlight">On-demand access to courses, examples, and tools</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal("invite"); }}
                className="shrink-0 p-1 text-gray-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Recent activity</h2>
          <div className="flex flex-col">
            {activity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-hover">
                {/* Icon */}
                <div className="relative shrink-0">
                  {item.type === "enrollment" ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-hover text-gray-xlight">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                  ) : (
                    <>
                      <img
                        src={(item as { coachImg: string }).coachImg}
                        alt={item.target}
                        className="h-12 w-12 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                      />
                      {item.type === "review" && (
                        <div className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <div className="truncate text-[15px]">
                    <span className="font-medium">{item.name}</span> {item.action}{" "}
                    <span className="font-medium">{item.target}</span>
                  </div>
                  <div className="text-[14px] text-gray-light">{item.time} &middot; {item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending invites banner */}
      <div
        className="flex items-center justify-between rounded-lg border px-[18px] py-3"
        style={{ background: "#fdfbf0", borderColor: "#ede9c8" }}
      >
        <div className="flex items-center gap-[10px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[15px] text-gray-dark">
            <strong>5 users</strong> haven't activated yet &middot; Last reminder sent 2d ago
          </span>
        </div>
        <button className="inline-flex items-center rounded-lg border border-gray-stroke bg-white px-3 py-[6px] text-[14px] font-medium text-gray-dark hover:bg-gray-hover">
          Resend invites
        </button>
      </div>

      {/* Users table */}
      <div className="mt-8">
        <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Users</h2>
        <div className="rounded-lg border border-gray-stroke bg-white shadow-card">
          {/* Toolbar */}
          <div className="flex items-center gap-3 rounded-t-lg border-b border-gray-stroke bg-white px-4 py-3">
            <div className="flex max-w-[360px] flex-1 items-center gap-2 rounded-lg border border-gray-stroke px-3 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="flex-1 border-none bg-transparent text-[15px] text-gray-dark outline-none placeholder:text-gray-xlight"
                placeholder="Search by name or email"
              />
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-light">User</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-center text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-light">1:1 Sessions</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-center text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-light">Live Cohorts</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-light">Leland+</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-light">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user, i) => (
                  <tr
                    key={i}
                    className={`cursor-pointer hover:bg-[#fafafa] ${i < visibleUsers.length - 1 ? "border-b border-gray-stroke" : ""}`}
                    onClick={() => setSelectedUser(userDetails[user.email] ?? { name: user.name, email: user.email, initials: user.initials })}
                  >
                    <td className="px-4 py-[14px]">
                      <div className="flex items-center gap-[10px]">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[14px] font-semibold text-dark-green">
                          {user.initials}
                        </div>
                        <div>
                          <div className="text-[15px] font-medium text-gray-dark">{user.name}</div>
                          <div className="text-[14px] text-gray-light">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-[14px] text-center">
                      {user.sessions != null ? (
                        <div>
                          <div className="text-[15px] font-medium text-gray-dark">{user.sessions} <span className="font-normal text-gray-xlight">/ {user.sessionsTotal}</span></div>
                          <div className="text-[14px] text-gray-light">redeemed</div>
                        </div>
                      ) : <span className="text-[15px] text-gray-dark">—</span>}
                    </td>
                    <td className="px-4 py-[14px] text-center">
                      {user.cohorts != null ? (
                        <div>
                          <div className="text-[15px] font-medium text-gray-dark">{user.cohorts} <span className="font-normal text-gray-xlight">/ {user.cohortsTotal}</span></div>
                          <div className="text-[14px] text-gray-light">redeemed</div>
                        </div>
                      ) : <span className="text-[15px] text-gray-dark">—</span>}
                    </td>
                    <td className="px-4 py-[14px] text-[15px]">
                      {user.plus === "Active" && <span className="text-gray-dark">Active</span>}
                      {user.plus === "Invited" && <span className="text-gray-xlight">Invited</span>}
                      {user.plus === "Expired" && <span className="text-gray-xlight">Expired</span>}
                      {user.plus === "—" && <span className="text-gray-dark">—</span>}
                    </td>
                    <td className="px-4 py-[14px] text-[15px] text-gray-light">{user.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-stroke px-4 py-3">
            <span className="text-[14px] text-gray-light">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, users.length)} of {users.length} users
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[120px] shrink-0" />

      <B2BUserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
