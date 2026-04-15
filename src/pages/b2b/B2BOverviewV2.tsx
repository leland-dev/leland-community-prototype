import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { B2BView, ModalId } from "./B2BData";
import B2BUserDrawer, { type UserDetail } from "./B2BUserDrawer";
import coachImg1 from "../../assets/profile photos/pic-1.png";
import coachImg2 from "../../assets/profile photos/pic-2.png";
import coachImg3 from "../../assets/profile photos/pic-3.png";
import userImg1 from "../../assets/profile photos/pic-4.png";
import userImg2 from "../../assets/profile photos/pic-5.png";
import userImg3 from "../../assets/profile photos/pic-6.png";
import userImg4 from "../../assets/profile photos/pic-7.png";
import userImg5 from "../../assets/profile photos/pic-8.png";

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
  { initials: "SK", name: "Sarah Kim", email: "sarah.kim@kellogg.edu", sessions: 2, sessionsTotal: 4, cohorts: 1, cohortsTotal: 2, cohortsStatus: "Enrolled", plus: "Active", lastActive: "2h ago", lastActiveDays: 0.08, dateAdded: "Jan 10, 2026", daysAdded: 94 },
  { initials: "RP", name: "Raj Patel", email: "raj.patel@kellogg.edu", sessions: 1, sessionsTotal: 3, cohorts: 0, cohortsTotal: 1, cohortsStatus: null, plus: "Active", lastActive: "Yesterday", lastActiveDays: 1, dateAdded: "Jan 10, 2026", daysAdded: 94 },
  { initials: "MC", name: "Mia Chen", email: "mia.chen@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: 1, cohortsTotal: 2, cohortsStatus: "Enrolled", plus: "—", lastActive: "2d ago", lastActiveDays: 2, dateAdded: "Jan 15, 2026", daysAdded: 89 },
  { initials: "ET", name: "Evan Torres", email: "evan.torres@kellogg.edu", sessions: 2, sessionsTotal: 4, cohorts: null, cohortsTotal: null, cohortsStatus: null, plus: "Active", lastActive: "3d ago", lastActiveDays: 3, dateAdded: "Jan 15, 2026", daysAdded: 89 },
  { initials: "AL", name: "Aisha Lee", email: "aisha.lee@kellogg.edu", sessions: 0, sessionsTotal: 3, cohorts: null, cohortsTotal: null, cohortsStatus: null, plus: "Invited", lastActive: "—", lastActiveDays: 999, dateAdded: "Feb 1, 2026", daysAdded: 72 },
  { initials: "JL", name: "Jordan Lee", email: "jordan.lee@kellogg.edu", sessions: 2, sessionsTotal: 3, cohorts: 1, cohortsTotal: 1, cohortsStatus: "Completed", plus: "Active", lastActive: "4d ago", lastActiveDays: 4, dateAdded: "Jan 20, 2026", daysAdded: 84 },
  { initials: "PM", name: "Priya Mehta", email: "priya.mehta@kellogg.edu", sessions: 1, sessionsTotal: 2, cohorts: null, cohortsTotal: null, cohortsStatus: null, plus: "Active", lastActive: "5d ago", lastActiveDays: 5, dateAdded: "Jan 20, 2026", daysAdded: 84 },
  { initials: "DW", name: "Daniel Wu", email: "daniel.wu@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: 1, cohortsTotal: 1, cohortsStatus: "Enrolled", plus: "—", lastActive: "1w ago", lastActiveDays: 7, dateAdded: "Feb 3, 2026", daysAdded: 70 },
  { initials: "NB", name: "Nina Brooks", email: "nina.brooks@kellogg.edu", sessions: 3, sessionsTotal: 4, cohorts: null, cohortsTotal: null, cohortsStatus: null, plus: "Active", lastActive: "1w ago", lastActiveDays: 7, dateAdded: "Jan 25, 2026", daysAdded: 79 },
  { initials: "CR", name: "Carlos Rivera", email: "carlos.rivera@kellogg.edu", sessions: null, sessionsTotal: null, cohorts: null, cohortsTotal: null, cohortsStatus: null, plus: "Expired", lastActive: "—", lastActiveDays: 999, dateAdded: "Feb 10, 2026", daysAdded: 63 },
  { initials: "HS", name: "Hannah Seo", email: "hannah.seo@kellogg.edu", sessions: 1, sessionsTotal: 2, cohorts: 1, cohortsTotal: 1, cohortsStatus: "Completed", plus: "Active", lastActive: "2w ago", lastActiveDays: 14, dateAdded: "Feb 15, 2026", daysAdded: 58 },
  { initials: "TO", name: "Tunde Okafor", email: "tunde.okafor@kellogg.edu", sessions: 2, sessionsTotal: 3, cohorts: null, cohortsTotal: null, cohortsStatus: null, plus: "—", lastActive: "2w ago", lastActiveDays: 14, dateAdded: "Mar 1, 2026", daysAdded: 44 },
];

const PAGE_SIZE = 25;

const userDetails: Record<string, UserDetail> = {
  "sarah.kim@kellogg.edu": {
    name: "Sarah Kim", email: "sarah.kim@kellogg.edu", initials: "SK", image: userImg1,
    coaching: {
      granted: 4, used: 2,
      sessions: [
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Apr 18, 2026", status: "scheduled" },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Mar 28, 2026", review: { rating: 5, text: "Jordan was incredibly well-prepared and gave me concrete feedback I could act on immediately. He clearly knows the recruiting process inside and out — every suggestion was specific, actionable, and calibrated to exactly where I am in the process. I left the session with a clear plan and a lot more confidence." } },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Feb 14, 2026", summary: "Behavioral interview prep and fit story development. Worked through the 'why banking' narrative in depth, refined Sarah's answer to 'walk me through your resume,' and practiced responding to curveball questions under time pressure." },
      ],
    },
    plus: {
      topCategories: ["Investment Banking", "Valuation", "Interview Guides"],
      totalEngaged: 47,
      recentItems: [
        { title: "LBO Modeling: Step-by-Step", category: "Investment Banking", type: "video" },
        { title: "IB Interview Question Bank", category: "Interview Guides" },
        { title: "DCF Valuation Deep Dive", category: "Valuation", type: "video" },
        { title: "Restructuring 101", category: "Investment Banking" },
        { title: "Walk Me Through a DCF", category: "Valuation", type: "video" },
      ],
    },
    liveCourses: [
      { cohort: "Spring '26 IB Recruiting", startDate: "Jan 15, 2026", endDate: "Mar 20, 2026", status: "enrolled", review: { rating: 5, text: "Exactly what I needed — structured, fast-paced, and the instructors had real deal experience." } },
      { cohort: "PE Recruiting Bootcamp", startDate: "Apr 7, 2026", endDate: "May 9, 2026", status: "invited", inviteSent: "Mar 25, 2026" },
    ],
  },
  "raj.patel@kellogg.edu": {
    name: "Raj Patel", email: "raj.patel@kellogg.edu", initials: "RP", image: userImg2,
    coaching: {
      granted: 3, used: 1,
      sessions: [
        { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Mar 15, 2026", summary: "Career strategy session focused on transitioning from consulting to PE. Covered the timeline and how to position prior deal experience.", review: { rating: 5, text: "Priya gave me a completely different perspective on how to frame my background. Game-changer." } },
      ],
    },
    plus: {
      topCategories: ["Private Equity", "Career Strategy", "Consulting"],
      recentItems: [
        { title: "PE Associate Interview Guide", category: "Private Equity" },
        { title: "Consulting to PE Transition", category: "Career Strategy", type: "video" },
        { title: "Operating Partner vs. Deal Team", category: "Private Equity", type: "video" },
        { title: "Case Interview Frameworks", category: "Consulting" },
        { title: "Leveraged Buyout Overview", category: "Private Equity", type: "video" },
      ],
    },
    liveCourses: [
      { cohort: "Spring '26 IB Recruiting", startDate: "Jan 15, 2026", endDate: "Mar 20, 2026", status: "invited", inviteSent: "Mar 20, 2026" },
    ],
  },
  "aisha.lee@kellogg.edu": {
    name: "Aisha Lee", email: "aisha.lee@kellogg.edu", initials: "AL", image: userImg3,
    coaching: {
      granted: 3, used: 0, sessions: [], inviteSent: "Mar 30, 2026",
    },
    plus: {
      topCategories: [], recentItems: [], inviteSent: "Mar 30, 2026",
    },
  },
  "mia.chen@kellogg.edu": {
    name: "Mia Chen", email: "mia.chen@kellogg.edu", initials: "MC", image: userImg4,
    liveCourses: [
      { cohort: "Spring '26 IB Cohort", startDate: "Feb 3, 2026", endDate: "Apr 10, 2026", status: "enrolled" },
      { cohort: "AI for Finance", startDate: "Mar 1, 2026", endDate: "Mar 29, 2026", status: "enrolled", review: { rating: 4, text: "Great content, though I wished there was more time for hands-on exercises." } },
    ],
  },
  "evan.torres@kellogg.edu": {
    name: "Evan Torres", email: "evan.torres@kellogg.edu", initials: "ET", image: userImg5,
    coaching: {
      granted: 4, used: 2,
      sessions: [
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Mar 22, 2026", summary: "PE modeling practice — worked through a full LBO with a healthcare target. Identified gaps in returns analysis, specifically around entry multiple assumptions and the sensitivity table. Alex also introduced a framework for stress-testing deal structures under downside scenarios, which Evan found especially useful for on-cycle prep.", review: { rating: 4, text: "Very thorough session. Alex clearly knows the PE recruiting process inside out." } },
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Feb 5, 2026", summary: "Introduction session. Mapped out Evan's background and identified target fund types and deal sizes." },
      ],
    },
    plus: {
      topCategories: ["Private Equity", "Valuation", "Investment Banking"],
      recentItems: [
        { title: "Healthcare LBO Case Study", category: "Private Equity", type: "video" },
        { title: "Returns Analysis Deep Dive", category: "Valuation" },
        { title: "PE Fund Structures", category: "Private Equity" },
        { title: "IRR vs. MOIC", category: "Valuation", type: "video" },
        { title: "Growth Equity vs. Buyout", category: "Private Equity", type: "video" },
      ],
    },
  },
};

export default function B2BOverviewV2({ onNavigate, onOpenModal }: Props) {
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [showCoachingStat, setShowCoachingStat] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const [filter, setFilter] = useState<"all" | "active" | "invited">("all");
  const [sort, setSort] = useState<"last-active" | "date-added">("last-active");

  const filteredUsers = users.filter((u) => {
    if (filter === "active") return u.lastActive !== "—";
    if (filter === "invited") return u.lastActive === "—";
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sort === "last-active") return a.lastActiveDays - b.lastActiveDays;
    return a.daysAdded - b.daysAdded;
  });

  const totalPages = Math.ceil(sortedUsers.length / PAGE_SIZE);
  const visibleUsers = sortedUsers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const [openMenuEmail, setOpenMenuEmail] = useState<string | null>(null);

  const handleFilter = (f: "all" | "active" | "invited") => { setFilter(f); setPage(0); };
  const handleSort = (s: typeof sort) => { setSort(s); setPage(0); };

  const needsResend = (u: typeof users[0]) =>
    (u.sessions === 0 && u.sessionsTotal != null) ||
    (u.cohorts === 0 && u.cohortsTotal != null) ||
    u.plus === "Invited";

  return (
    <div className="leading-[1.2]">
      {/* Sticky button — floated right so it doesn't affect content width */}
      <div className="sticky top-4 z-10 float-right ml-4">
        <div
          className="pointer-events-none absolute -bottom-3 -left-10 -right-3 -top-3 bg-gradient-to-r from-transparent via-white/60 to-white"
          style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 50%)", maskImage: "linear-gradient(to right, transparent, black 50%)" }}
        />
        <button
          onClick={() => onOpenModal("invite")}
          className="relative flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-3 text-[16px] font-medium text-white shadow-md hover:bg-primary-hover"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add users
        </button>
      </div>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.5] text-gray-dark">Overview</h1>
        <p className="mt-1 text-[18px] text-[#707070]">Kellogg School of Management &middot; Contract Jan 2025 &ndash; Jun 2026</p>
      </div>

      {/* Stats row */}
      <div className={`mb-8 grid grid-cols-1 gap-4 ${showCoachingStat ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Seats granted</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="text-[30px] font-medium leading-none text-gray-dark">325</div>
            <div className="text-[14px] text-gray-light sm:mt-[6px]">of 400 available</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Active users*</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="text-[30px] font-medium leading-none text-gray-dark">289</div>
            <div className="mt-[6px] flex items-baseline justify-between">
              <span className="text-[14px] text-gray-light">89% of seats granted</span>
              <span className="text-[14px] text-gray-xlight">*All time</span>
            </div>
          </div>
        </div>
        {showCoachingStat && (
          <div className="rounded-lg border border-gray-stroke bg-white p-5">
            <div className="mb-2 text-[18px] font-normal text-gray-light">Coaching sessions</div>
            <div className="flex items-baseline gap-[6px] sm:block">
              <div className="text-[30px] font-medium leading-none text-gray-dark">147</div>
              <div className="text-[14px] text-gray-light sm:mt-[6px]">Scheduled or completed</div>
            </div>
          </div>
        )}
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Average rating</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="flex items-baseline gap-[6px] text-[30px] font-medium leading-none text-gray-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginBottom: "-2px" }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              4.8
            </div>
            <div className="text-[14px] text-gray-light sm:mt-[6px]">Across 112 reviews</div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="mt-8">
        <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Users</h2>
        <div className="rounded-lg border border-gray-stroke bg-white shadow-card">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 rounded-t-lg border-b border-gray-stroke bg-white px-4 py-3">
            <div className="flex max-w-[280px] flex-1 items-center gap-2 rounded-lg border border-gray-stroke px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="flex-1 border-none bg-transparent text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight"
                placeholder="Search by name or email"
              />
            </div>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-[6px]">
              {(["all", "active", "invited"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] border-[1.5px] transition-colors ${
                    filter === f
                      ? "border-[#222222]"
                      : "border-transparent hover:bg-[#ebebeb]"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => handleSort(sort === "date-added" ? "last-active" : "date-added")}
                className="flex items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] font-medium text-[#222222] transition-colors hover:bg-gray-hover"
              >
                {sort === "date-added" ? "Date added" : "Last active"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-stroke">
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark">User</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark">1:1 Sessions</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark">Live Cohorts</th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark">Leland+</th>
                  <th className="bg-[#fafafa] px-4 py-3" />
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
                        {userDetails[user.email]?.image ? (
                          <img src={userDetails[user.email].image} alt={user.name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[14px] font-semibold text-dark-green">
                            {user.initials}
                          </div>
                        )}
                        <div>
                          <div className="text-[16px] font-medium text-gray-dark">{user.name}</div>
                          <div className="text-[14px] text-gray-light">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-[14px]">
                      {user.sessions != null ? (
                        <div>
                          <div className="text-[16px] font-medium text-gray-dark">{user.sessions} <span className="font-normal text-gray-light">/ {user.sessionsTotal}</span></div>
                        </div>
                      ) : <span className="text-[16px] text-gray-light">—</span>}
                    </td>
                    <td className="px-4 py-[14px] text-[16px]">
                      {user.cohortsStatus === "Enrolled" && <span className="text-gray-dark">Enrolled</span>}
                      {user.cohortsStatus === "Completed" && <span className="text-gray-dark">Completed</span>}
                      {!user.cohortsStatus && <span className="text-gray-light">—</span>}
                    </td>
                    <td className="px-4 py-[14px] text-[16px]">
                      {user.plus === "Active" && <span className="text-gray-dark">Active</span>}
                      {user.plus === "Invited" && <span className="text-gray-xlight">Invited</span>}
                      {user.plus === "Expired" && <span className="text-gray-xlight">Expired</span>}
                      {user.plus === "—" && <span className="text-gray-light">—</span>}
                    </td>
                    <td className="px-2 py-2">
                      <div className="relative flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(openMenuEmail === user.email ? null : user.email); }}
                          className="flex h-12 w-12 items-center justify-center rounded-full text-gray-xlight hover:bg-gray-hover hover:text-gray-dark"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        {openMenuEmail === user.email && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuEmail(null)} />
                            <div className="absolute right-0 top-8 z-20 min-w-[152px] overflow-hidden rounded-lg border border-gray-stroke bg-white shadow-card">
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-gray-dark hover:bg-gray-hover"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Grant access
                              </button>
                              {needsResend(user) && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-gray-dark hover:bg-gray-hover"
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                                  </svg>
                                  Resend invite
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-red hover:bg-gray-hover"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                Revoke access
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-stroke px-4 py-3">
            <span className="text-[14px] text-gray-light">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedUsers.length)} of {sortedUsers.length} users
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

      {/* Two-column: Offerings + Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Offerings */}
        <div>
          <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Utilization</h2>
          <div className="rounded-lg border border-gray-stroke bg-white p-2 shadow-card">
            {/* 1:1 Coaching */}
            <div
              className="flex cursor-pointer items-center justify-between gap-6 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("utilization")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">1:1 Coaching</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(102/140)*100}%` }} />
                  </div>
                  <span className="shrink-0 text-[14px] text-gray-light">102 / 140 sessions used</span>
                </div>
                <div className="text-[14px] text-gray-xlight">Individual coach matching for personalized guidance</div>
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
              className="flex cursor-pointer items-center justify-between gap-6 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("live-courses")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">Live cohorts</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                    <div className="h-full rounded-full bg-red" style={{ width: `${(64/66)*100}%` }} />
                  </div>
                  <span className="shrink-0 text-[14px] text-gray-light">64 / 66 seats used</span>
                </div>
                <div className="text-[14px] text-gray-xlight">Cohort-based programs with live instruction and feedback</div>
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
              className="flex cursor-pointer items-center justify-between gap-6 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("leland-plus")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">Leland+</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(6/30)*100}%` }} />
                  </div>
                  <span className="shrink-0 text-[14px] text-gray-light">6 / 30 licenses used</span>
                </div>
                <div className="text-[14px] text-gray-xlight">On-demand access to courses, examples, and tools</div>
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
                  <div className="truncate text-[16px]">
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

      <div className="h-[120px] shrink-0" />

      <B2BUserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* Prototype toggle */}
      <div ref={adminRef} className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[#9b9b9b]">Prototype options</div>
              <button
                onClick={() => setShowCoachingStat(!showCoachingStat)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-[13px] text-gray-dark hover:bg-gray-hover"
              >
                <span>1:1 coaching sessions stat</span>
                <span className={`text-[11px] font-medium ${showCoachingStat ? "text-primary" : "text-gray-xlight"}`}>
                  {showCoachingStat ? "ON" : "OFF"}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>
    </div>
  );
}
